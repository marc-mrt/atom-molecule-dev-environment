"use babel";
// @flow

import type { ConsoleLog } from "../Types/types";
import { List, Map } from "immutable";

export default function(
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
