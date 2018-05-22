"use babel";
// @flow

import Rx from "rxjs";
import {
  ConsoleLogError,
  ConsoleLogWarning,
  ConsoleLogInformation,
  // ConsoleLogHint,
  // ConsoleLogSuccess
} from "../../LanguageServerProtocolFeature/Types/standard";
import { addConsoleLogsForTask } from "../Actions/AddConsoleLog";

const consoleEpic = () => (action$: any) => {
  const currentDate = require("moment");
  const molecule = {
    source: "Molecule",
    color: "purple",
    version: "0.4.0",
  };

  return Rx.Observable.merge(
    action$.ofType("ADD_PLAN_CONFIGURATION").map(action =>
      addConsoleLogsForTask({
        ...molecule,
        severity: ConsoleLogInformation,
        message:
          "The plan " +
          action.payload.name +
          " from the tool " +
          action.payload.tool.name +
          " has been created",
        date: currentDate().format("DD-MM-YYYY kk:mm:ss"),
      }),
    ),

    action$.ofType("REMOVE_PLAN_CONFIGURATION").map(action =>
      addConsoleLogsForTask({
        ...molecule,
        severity: ConsoleLogInformation,
        message:
          "The plan " +
          action.payload.name +
          " from the tool " +
          action.payload.tool.name +
          " has been deleted",
        date: currentDate().format("DD-MM-YYYY kk:mm:ss"),
      }),
    ),

    action$.ofType("PIN_PLAN_CONFIGURATION").map(action =>
      addConsoleLogsForTask({
        ...molecule,
        severity: ConsoleLogInformation,
        message:
          "The plan " +
          action.payload.planConfig.name +
          " from the tool " +
          action.payload.planConfig.tool.name +
          " has been pinned",
        date: currentDate().format("DD-MM-YYYY kk:mm:ss"),
      }),
    ),

    action$.ofType("UNPIN_PLAN_CONFIGURATION").map(action =>
      addConsoleLogsForTask({
        ...molecule,
        severity: ConsoleLogInformation,
        message:
          "The plan " +
          action.payload.planConfig.name +
          " from the tool " +
          action.payload.planConfig.tool.name +
          " has been unpinned",
        date: currentDate().format("DD-MM-YYYY kk:mm:ss"),
      }),
    ),

    action$.ofType("RUN_TASK").map(action =>
      addConsoleLogsForTask({
        ...molecule,
        severity: ConsoleLogInformation,
        message:
          "The plan " +
          action.payload.plan.name +
          " from the tool " +
          action.payload.plan.tool.name +
          " is running",
        date: currentDate().format("DD-MM-YYYY kk:mm:ss"),
      }),
    ),

    action$.ofType("STOP_TASK").map(action =>
      addConsoleLogsForTask({
        ...molecule,
        severity: ConsoleLogInformation,
        message: "The task has stopped for " + action.payload.id,
        date: currentDate().format("DD-MM-YYYY kk:mm:ss"),
      }),
    ),

    action$.ofType("CRASH_TASK").map(action =>
      addConsoleLogsForTask({
        ...molecule,
        severity: ConsoleLogError,
        message: "Crash task",
        date: currentDate().format("DD-MM-YYYY kk:mm:ss"),
      }),
    ),

    action$.ofType("FAIL_TASK").map(action =>
      addConsoleLogsForTask({
        ...molecule,
        severity: ConsoleLogError,
        message: "The task has stopped",
        date: currentDate().format("DD-MM-YYYY kk:mm:ss"),
      }),
    ),

    action$.ofType("KILL_TASK").map(action =>
      addConsoleLogsForTask({
        ...molecule,
        severity: ConsoleLogWarning,
        message:
          "The task " +
          action.payload.plan.name +
          " of tool " +
          action.payload.plan.tool.name +
          " has been killed",
        date: currentDate().format("DD-MM-YYYY kk:mm:ss"),
      }),
    ),
  );
};

export default consoleEpic;
