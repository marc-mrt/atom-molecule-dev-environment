"use babel";
// @flow

import { ConsoleLog, ConsoleLogSeverity } from "../Types/types.js.flow";
import { List, Map } from "immutable";

export default function ConsoleDiagnostics(
  state: ConsoleLogsReducer = Map(),
  action: any,
): ConsoleLogsReducer {
  switch (action.type) {
    case "ADD_CONSOLE_LOG":
      return state.setIn(action.payload.source, ...action.payload);
      break;
    // case "DELETE_CONSOLE_LOG":
    //   return action.payload.log.reduce(
    //
    //   );
    default:
      return state;
  }
}

//string: Source name of the diagnostic
export type ConsoleLogsReducer = Map<string, ConsoleLog>;
