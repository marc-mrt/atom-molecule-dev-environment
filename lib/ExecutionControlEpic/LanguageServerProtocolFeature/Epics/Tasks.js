"use babel";
// @flow

import Rx from "rxjs";
import type { RunTaskAction } from "../../TaskExecutionFeature/Actions/RunTask";
import { addTask } from "../../TaskExecutionFeature/Actions/AddTask";
import { startTask } from "../../TaskExecutionFeature/Actions/StartTask";
import { stopTask } from "../../TaskExecutionFeature/Actions/StopTask";
import { runLanguageClient } from "../Model/MoleculeLanguageClient";
import { selectPackagesReducer } from "../../../GlobalSystem/Selectors";
import { selectPackagesOfTool } from "../../../ProjectSystemEpic/PackageFeature/Selectors/Packages";
import Execution from "../Model/Execution";
import { api } from "../../QuestionSystemFeature/Model/api";
import currentDate from "moment";
import { addConsoleLogsForTask } from "../../ConsoleFeature/Actions/AddConsoleLog";
import { ConsoleLogError } from "../../LanguageServerProtocolFeature/Types/standard";
import { EditorFileObservable } from "../../../EventSystemEpic/EditorFeature/Model/EditorFileObservable";
import type { MoleculeAtomEditorEvent } from "../../../EventSystemEpic/EditorFeature/Types/editorEvents";
import { setDiagnosticsForPathsForTasks } from "../../DiagnosticsFeature/Actions/SetDiagnosticsForPathsForTasks";
import { stopTask } from "../../TaskExecutionFeature/Actions/StopTask";
import type { RunTaskAction } from "../../TaskExecutionFeature/Actions/RunTask";

type ExecutionContext = {
  atom: AtomContext,
  molecule: MoleculeContext,
  node: NodeContext,
  extended: ExtendedContext,
};

export default (context: ExecutionContext) => (action$, store) => {
  const rootObs = action$
    .ofType("RUN_TASK")
    .mergeMap((action: RunTaskAction) => {
      return Rx.Observable.create(async observer => {
        const languageClientConfig = runLanguageClient({
          plan: action.payload.plan,
          stagerConfig: action.payload.stager,
        });

        let execution = null;
        let languageClientSub = null;
        let fileEventSub = null;

        try {
          const { connection, stager } = runLanguageClient({
            plan: action.payload.plan,
            stagerConfig: action.payload.stager,
          });

          const taskID = context.molecule.generateTaskID();

        const taskID = context.molecule.generateTaskID();

        if (languageClientConfig.connection == null) {
          // TODO - Make sure every resource is properly disposed of
          observer.error(
            new Error("Could not create connection for language client"),
          );
          return;
        }

        const languageClientConnexion = languageClientConfig.connection;

        languageClientConnexion.onRequest("strategy/init", ({ strategy }) => {
          const addTaskAction = addTask(
            taskID.toString(),
            { ...action.payload.plan, state: undefined },
            strategy,
            context.node.getCurrentDate(),
          );
          observer.next(addTaskAction);

          execution = new Execution({ task: addTaskAction.payload.task });
          context.molecule.ExecutionsController.setExecution(execution);
          observer.next(startTask(taskID.toString()));
          if (languageClientConfig.stager) {
            languageClientConfig.stager.on("killed", () => {
              observer.next(
                stopTask(
                  taskID.toString(),
                  action.payload.plan.name,
                  context.node.getCurrentDate(),
                ),
              );
              observer.complete();
            });
          }
          return Promise.resolve({});
        });

        editorObservable = EditorFileObservable.withLatestFrom(
          EditorFileObservable.scan(
            (versions, event: MoleculeAtomEditorEvent) => {
              if (event.type === "didChange") {
                return {
                  ...versions,
                  [event.path]: (versions[event.path] || 0) + 1,
                };
              } else {
                return versions;
              }
            },
            {},
          ),
          (event: MoleculeAtomEditorEvent, versions) => ({
            message: event.type,
            args: {
              textDocument: {
                uri: event.path,
                version:
                  event.type === "didOpen" || event.type === "didChange"
                    ? versions[event.path] || 0
                    : undefined,
                text:
                  event.type === "didOpen"
                    ? event.event.textEditor.getText()
                    : undefined,
                languageId:
                  event.type === "didOpen"
                    ? event.event.textEditor.getGrammar().name
                    : undefined,
              },
              contentChanges:
                event.type === "didChange"
                  ? event.event.changes.map(change => ({
                      range: {
                        start: {
                          character: change.newRange.start.column,
                          line: change.newRange.start.row,
                        },
                        end: {
                          character: change.newRange.end.column,
                          line: change.newRange.end.row,
                        },
                      },
                      text: change.newText,
                    }))
                  : undefined,
            },
          }),
        );

        languageClientConnexion.sendNotification("packages/didChange", {
          packages: selectPackagesOfTool(
            selectPackagesReducer(store.getState()),
            action.payload.plan.tool.id,
          ),
        });

        languageClientConnexion.onRequest(
          "window/showMessageRequest",
          async data => {
            if (data) {
              const response = await api.ask([
                {
                  name: "answer",
                  type: "list",
                  choices: data.actions.map(action => ({
                    value: action.title,
                    description: action.title,
                  })),
                  message: data.message,
                },
              ]);
              return response != null
                ? { result: response.answer }
                : { error: true };
            }
          },
        );

        languageClientConnexion.onNotification(
          "textDocument/publishDiagnostics",
          (diagnostics: { diagnostics: Array<Diagnostic>, uri: string }) => {
            observer.next(
              setDiagnosticsForTask({
                uri: diagnostics.uri,
                task: taskID,
                diagnostics: diagnostics.diagnostics.map(diagnostic =>
                  Object.assign({}, diagnostic, {
                    path: diagnostics.uri,
                    task: taskID.toString(),
                  }),
                ),
              }),
            );
          },
        );

        languageClientConnexion.onNotification(
          "workspace/publishDiagnostics",
          (diagnostics: {
            diagnostics: Array<Diagnostic>,
            workspace: string,
          }) => {
            observer.next(
              setDiagnosticsForTask({
                uri: diagnostics.workspace,
                task: taskID,
                diagnostics: diagnostics.diagnostics.map(diagnostic =>
                  Object.assign({}, diagnostic, {
                    path: diagnostics.workspace,
                    task: taskID.toString(),
                  }),
                ),
              }),
            );
          },
        );

        languageClientConnexion.onNotification(
          "workspace/clearDiagnostics",
          () => {
            observer.next(removeDiagnosticsForTask(taskID));
          },
        );

        languageClientConnexion.onNotification(
          "workspace/busy",
          (args: { isBusy: boolean }): void => {
            observer.next(args.isBusy ? busyTask(taskID) : waitingTask(taskID));
          },
        );

        languageClientConnexion.onNotification("terminal/init", () => {
          if (execution) {
            execution.initTerminal();
          }
        });

        languageClientConnexion.onNotification(
          "terminal/output",
          ({ data }) => {
            if (execution) {
              execution.terminal.write(data);
              execution.broker.emit("terminal/output", {
                data,
              });
            }
          },
        );

        languageClientConnexion.listen();

        try {
          // NOTE: if the code in `onRequest("initialize", ...)` in
          // runController() throws an Error, vscode-jsonrpc will transmit that
          // error, and `sendRequest("initialize", ...)` will throw the same
          // error
          // It is an undocumented feature of vscode-jsonrpc
          await languageClientConnexion.initialize({
            processId: process.pid,
            trace: "verbose",
            rootUri: action.payload.plan.packageInfo.path,
            capabilities: {
              workspace: {},
              textDocument: {},
            },
          });
        } catch (err) {
          // TODO - handle error in Molecule console
          observer.error(err);
        }

        editorObservable.subscribe(event =>
          languageClientConnexion.sendNotification(
            "textDocument/" + event.message,
            event.args,
          ),
        );

        if (execution && execution.terminal) {
          execution.onTerminalData(data => {
            languageClientConnexion.sendNotification("terminal/input", {
              data: data,
            });
          });

          execution.onTerminalResize(info => {
            languageClientConnexion.sendNotification("terminal/resize", {
              cols: info.cols,
              rows: info.rows,
            });
          });
        }

        const killTaskSubscription = action$
          .filter(
            a =>
              a.type === "KILL_TASK" &&
              a.payload.plan.tool.id === action.payload.plan.tool.id &&
              a.payload.plan.name === action.payload.plan.name,
          )
          .subscribe(async () => {
            if (languageClientConfig.connection != null) {
              await languageClientConfig.connection.sendRequest("shutdown");
              languageClientConfig.connection.sendNotification("exit");
            }
            observer.complete();
          });

        return function unsubscribe() {
          if (execution && execution.terminal) {
            execution.terminal.writeln(`\n\rProgram exited`);
            execution.stopTerminal();
          }
          if (languageClientSub) {
            languageClientSub.unsubscribe();
          }
          if (fileEventSub) {
            fileEventSub.unsubscribe();
          }
        };
      });
    })
    .share()
    .partition(
      action =>
        action.type === "SET_DIAGNOSTICS_FOR_PATH_FOR_TASK" ||
        action.type === "REMOVE_DIAGNOSTICS_OF_TASK",
    );
  const sharedDiagnosticObs = rootObs[0];
  return (
    rootObs[1]
      .merge(
        sharedDiagnosticObs
          .bufferWhen(() =>
            Rx.Observable.interval(1000).merge(
              sharedDiagnosticObs.filter(
                action => action.type === "REMOVE_DIAGNOSTICS_OF_TASK",
              ),
            ),
          )
          .filter(buffer => buffer.length > 0)
          .concatMap(buffer =>
            Rx.Observable.create(observer => {
              let diagnosticsActions = [];

              buffer.forEach(action => {
                if (action.type === "REMOVE_DIAGNOSTICS_OF_TASK") {
                  if (diagnosticsActions.length > 0) {
                    observer.next(
                      convertSetDiagnosticsForPathToSetDiagnosticsForTasks(
                        diagnosticsActions,
                      ),
                    );
                    diagnosticsActions = [];
                  }
                  observer.next(action);
                } else {
                  diagnosticsActions.push(action);
                }
              });
              if (diagnosticsActions.length > 0)
                observer.next(
                  convertSetDiagnosticsForPathToSetDiagnosticsForTasks(
                    diagnosticsActions,
                  ),
                );
              observer.complete();
            }),
          ),
      )
      // TODO - Catch errors without interrupting every single Task
      // by changing the layout of the .catch and the .mergeMap operators
      .catch(err => {
        console.error(err);
        return Rx.Observable.empty();
      })
  );
};
