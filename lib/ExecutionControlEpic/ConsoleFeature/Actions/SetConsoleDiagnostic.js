"use babel";
// @flow

import type { ConsoleDiagnostic } from "../Types/types.js.flow";

export type SetConsoleDiagnosticsForTaskAction = {
  type: "SET_CONSOLE_DIAGNOSTIC",
  payload: ConsoleDiagnostic,
};

export function setDiagnosticsForTask(
  publishedConsoleDiagnostics: ConsoleDiagnostic,
): SetConsoleDiagnosticsForTaskAction {
  return {
    type: "SET_CONSOLE_DIAGNOSTIC",
    payload: publishedDiagnostics,
  };
}
