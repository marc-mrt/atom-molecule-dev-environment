"use babel";
// @flow

import Rx from "rxjs";
import { addTask } from "../../TaskExecutionFeature/Actions/AddTask";
import { startTask } from "../../TaskExecutionFeature/Actions/StartTask";
import { addDiagnosticsForTask } from "../../DiagnosticsFeature/Actions/AddDiagnosticsForTask";
import { runLanguageClient } from "../Model/MoleculeLanguageClient";
import Execution from "../Model/Execution";
import type { Diagnostic } from "../../DiagnosticsFeature/Types/types.js";
import { waitingTask } from "../../TaskExecutionFeature/Actions/WaitingTask";
import { busyTask } from "../../TaskExecutionFeature/Actions/BusyTask";

type ExecutionContext = {
  atom: AtomContext,
  molecule: MoleculeContext,
  node: NodeContext,
  extended: ExtendedContext,
};

export const RUN_TASK = "RUN_TASK";

export type RunAction = (dispatch: (action: mixed) => void) => void;

export type RunTaskAction = {
  type: typeof RUN_TASK,
  payload: { plan: PlanConfig },
};

export default (context: ExecutionContext) => (action$, store) => {
  return action$
    .ofType(RUN_TASK)
    .mergeMap((action: RunTaskAction) => {
      return Rx.Observable.create(observer => {
        const languageClientConfig = runLanguageClient({
          plan: action.payload.plan,
          stagerConfig: action.payload.plan.stager,
        });

        let execution = null;

        const taskID = context.molecule.generateTaskID();
        if (languageClientConfig.connection != null) {
          languageClientConfig.connection.onNotification(
            "strategy/init",
            ({ strategy }) => {
              const addTaskAction = addTask(
                taskID.toString(),
                { ...action.payload.plan, state: undefined },
                strategy,
                context.node.getCurrentDate(),
              );
              observer.next(addTaskAction);

              execution = new Execution({ task: addTaskAction.payload.task });
              context.molecule.ExecutionsController.setExecution(execution);
            },
          );

          languageClientConfig.connection.onRequest(
            "window/showMessageRequest",
            data => {
              if (data) {
                return api
                  .ask([data.questions])
                  .then(response => convertToLSPResponse(response));
              }
            },
          );

          languageClientConfig.connection.onNotification(
            "textDocument/publishDiagnostics",
            (diagnostics: Array<Diagnostic>, uri: string) => {
              store.dispatch(
                addDiagnosticsForTask(
                  uri,
                  diagnostics.map(diagnostic =>
                    Object.assign({}, diagnostic, { task: taskID.toString() }),
                  ),
                ),
              );
            },
          );

          languageClientConfig.connection.onNotification(
            "workspace/publishDiagnostics",
            (diagnostics: Array<Diagnostic>, workspace: string) => {
              store.dispatch(
                addDiagnosticsForTask(
                  workspace,
                  diagnostics.map(diagnostic =>
                    Object.assign({}, diagnostic, { task: taskID.toString() }),
                  ),
                ),
              );
            },
          );

          languageClientConfig.connection.onNotification(
            "workspace/clearDiagnostics",
            (workspace: string) => {
              console.log(`Clearing diagnostics for ${workspace}`);
            },
          );

          languageClientConfig.connection.onNotification(
            "workspace/busy",
            (isBusy: boolean): void => {
              store.dispatch(isBusy ? busyTask(taskID) : waitingTask(taskID));
            },
          );

          languageClientConfig.connection.onNotification(
            "terminal/init",
            () => {
              if (execution) {
                execution.initTerminal();
              }
            },
          );

          languageClientConfig.connection.onNotification(
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

          languageClientConfig.connection.listen();

          languageClientConfig.connection.initialize({}).then(() => {
            if (execution && execution.terminal) {
              execution.onTerminalData(data => {
                languageClientConfig.connection.sendNotification(
                  "terminal/input",
                  {
                    data: data,
                  },
                );
              });

              execution.onTerminalResize(infos => {
                languageClientConfig.connection.sendNotification(
                  "terminal/resize",
                  {
                    cols: infos.cols,
                    rows: infos.rows,
                  },
                );
              });
            }
            observer.next(startTask(taskID.toString()));
          });
        } else {
          console.log("LSP connection is null");
        }

        return function unsubscribe() {
          if (languageClientConfig.connection != null) {
            languageClientConfig.connection.sendNotification("exit");
            if (execution) {
              if (execution.terminal) {
                execution.stopTerminal();
                execution.terminal.writeln(`\n\rProgram exited`);
              }
            }
          }
        };
      }).takeUntil(
        action$.filter(
          a =>
            a.type === "KILL_TASK" &&
            a.payload.plan.tool.id === action.payload.plan.tool.id &&
            a.payload.plan.name === action.payload.plan.name,
        ),
      );
    })
    .catch(() => Rx.Observable.empty());
};
