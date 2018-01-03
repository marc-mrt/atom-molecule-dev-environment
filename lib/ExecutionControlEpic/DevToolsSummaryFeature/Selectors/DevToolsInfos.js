"use babel";
// @flow

import type { DevTool } from "../Types/types.js.flow";
import type { DevToolsInfosReducer } from "../Reducers/DevToolsInfos";
import { List } from "immutable";

export function selectDevtools(devtools: DevToolsInfosReducer): List<DevTool> {
  return devtools;
}
