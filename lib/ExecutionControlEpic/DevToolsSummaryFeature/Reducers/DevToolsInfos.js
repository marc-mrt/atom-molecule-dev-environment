"use babel";
// @flow

import type { DevTool } from "../Types/types.js.flow";
import { List } from "immutable";

export default function(
  state: DevToolsInfosReducer = List(),
  action: any,
): DevToolsInfosReducer {
  switch (action.type) {
    case "ADD_DEVTOOL":
      return state.push(action.payload);
    default:
      return state;
  }
}

export type DevToolsInfosReducer = List<DevTool>;
