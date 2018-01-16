"use babel";
// @flow

import type { DevToolPlanConfigSchema } from "../Types/types.js.flow";
import type { PlanConfigSchemasReducer } from "../Reducers/PlanConfigSchemas";

export function selectConfigSchemaOfTool(
  state: PlanConfigSchemasReducer,
  toolId: string,
): DevToolPlanConfigSchema {
  return state.get(toolId);
}
