"use babel";
// @flow

import Rx from "rxjs";
import { List, Map } from "immutable";
import { ofType } from "redux-observable";
import { ConsoleLogInformation } from "../../LanguageServerProtocolFeature/Types/standard";
import { addConsoleLogsForTask } from "../Actions/AddConsoleLog";
import type { ConsoleLog } from "../Types/types";

const consoleEpic = () => (action$: any, store: any) => {
  const currentDate = require("moment");
  const molecule = {
    source: "Molecule",
    color: "purple",
    date: currentDate().format("DD-MM-YYYY kk:mm:ss"),
    version: "0.4.0"
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
          " has been created"
      })
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
          " has been deleted"
      })
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
          " has been pinned"
      })
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
          " has been unpinned"
      })
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
          " is running"
      })
    ),

    action$.ofType("STOP_TASK").map(action =>
      addConsoleLogsForTask({
        ...molecule,
        severity: ConsoleLogInformation,
        message: "Stop task " + action.payload.id
      })
    ),

    action$.ofType("CRASH_TASK").map(action =>
      addConsoleLogsForTask({
        ...molecule,
        severity: ConsoleLogInformation,
        message: "CRASH stop"
      })
    ),

    action$.ofType("FAIL_TASK").map(action =>
      addConsoleLogsForTask({
        ...molecule,
        severity: ConsoleLogInformation,
        message: "FAIL stop"
      })
    ),

    action$.ofType("KILL_TASK").map(action =>
      addConsoleLogsForTask({
        ...molecule,
        severity: ConsoleLogInformation,
        message:
          "The task " +
          action.payload.plan.name +
          " of tool " +
          action.payload.plan.tool.name +
          " has been killed",
      })
    )
  );
};

export default consoleEpic;
