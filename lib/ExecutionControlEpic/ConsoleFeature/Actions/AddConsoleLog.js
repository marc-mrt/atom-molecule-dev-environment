"use babel";
// @flow

import type { ConsoleLog } from "../Types/types.js.flow";

export type SetConsoleLogsForTaskAction = {
  type: "ADD_CONSOLE_LOG",
  payload: {
    consoleLog: ConsoleLog,
  },
};

export function addConsoleDiagnosticsForTask(
  log: ConsoleLog,
): SetConsoleLogsForTaskAction {
  return {
    type: "ADD_CONSOLE_LOG",
    payload: {
      log,
    }
  };
}
s
