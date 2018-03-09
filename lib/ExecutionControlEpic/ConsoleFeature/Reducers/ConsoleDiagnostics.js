"use babel";
// @flow

import { ConsoleDiagnostic, DiagnosticSeverity } from "../Types/types.js.flow";
import { List, Map } from "immutable";

export default function ConsoleDiagnostics(
  state: ConsoleDiagnosticsReducer = Map(),
  action: any,
): ConsoleDiagnosticsReducer {
  switch (action.type) {
    case "SET_CONSOLE_DIAGNOSTIC":
      return action.payload.diagnostic.reduce(
        //combine to results and return it
      );
      break;
    // case "DELETE_CONSOLE_DIAGNOSTIC":
    //   return action.payload.diagnostic.reduce(
    //
    //   );
    default:

  }
}

//What for ??
export type ConsoleDiagnosticsReducer = Map<
  string,
  Map<string, Map<DiagnosticSeverity, List<ConsoleDiagnostic>>>,
>;
