"use babel";
// @flow

import type { ConsoleLog } from "../Types/types";
import { Map } from "immutable";

//TODO define a new key for the map

export default function(
  state: ConsoleLogsReducer = Map(),
  action: any,
): ConsoleLogsReducer {
  switch (action.type) {
    case "ADD_CONSOLE_LOG":
      return state.setIn([state.size], {...action.payload.consoleLog});
    default:
      return state;
  }
}

export type ConsoleLogsReducer = Map<string, ConsoleLog>;
