"use babel";
// @flow

import type { DevTool } from "../Types/types.js.flow";
import type { DevToolsInfoReducer } from "../Reducers/DevToolsInfo";
import { List } from "immutable";

export function selectDevtools(devtools: DevToolsInfoReducer): List<DevTool> {
  return devtools;
}
