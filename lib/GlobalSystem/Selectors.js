"use babel";
// @flow

import type { DevTool } from "../ExecutionControlEpic/DevToolsSummaryFeature/Types/types.js.flow";
import type { PlanConfig } from "../ExecutionControlEpic/PlanConfigurationFeature/Types/types.js.flow";
import type { PlanConfigSchemasReducer } from "../ExecutionControlEpic/PlanConfigurationFeature/Reducers/PlanConfigSchemas";
import type { State } from "./types.js.flow";
import type { TasksReducer } from "../ExecutionControlEpic/TaskExecutionFeature/Reducers/Tasks";
import type { DiagnosticsReducer } from "../ExecutionControlEpic/DiagnosticsFeature/Reducers/Diagnostics";
import type { CacheBlobsReducer } from "../ExecutionControlEpic/CacheSystemFeature/Reducers/CacheBlobs";
import type { PackagesReducer } from "../ProjectSystemEpic/PackageFeature/Reducers/Packages";
import type { DevToolsInfosReducer } from "../ExecutionControlEpic/DevToolsSummaryFeature/Reducers/DevToolsInfos";
import type { PlanConfigsReducer } from "../ExecutionControlEpic/PlanConfigurationFeature/Reducers/PlanConfigs";

export function selectDevtoolsReducer(state: State): DevToolsInfosReducer {
  return state.devtools;
}

export function selectPlansReducer(state: State): PlanConfigsReducer {
  return state.plans;
}

export function selectPlansSchemaReducer(
  state: State,
): PlanConfigSchemasReducer {
  return state.planConfigSchemas;
}

export function selectTasksReducer(state: State): TasksReducer {
  return state.tasks;
}

export function selectDiagnosticsReducer(state: State): DiagnosticsReducer {
  return state.diagnostics;
}

export function selectPackagesReducer(state: State): PackagesReducer {
  return state.packages;
}

export function selectCacheBlobsReducer(state: State): CacheBlobsReducer {
  return state.cacheBlobs;
}
