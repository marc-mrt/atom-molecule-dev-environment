"use babel";
// @flow

import { renderConsolePanel } from "../AtomLinks/Panels"

export function openPlanConsole() {
  return (dispatch: any) => {
    renderConsolePanel();
  };
}
