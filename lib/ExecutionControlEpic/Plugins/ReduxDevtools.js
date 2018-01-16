"use babel";
// @flow

import type { PlanConfig } from "../PlanConfigurationFeature/Types/types.js.flow";

export default {
  info: {
    name: "redux",
    iconUri:
      "atom://molecule-dev-environment/.storybook/public/devtool-icon-redux.png",
  },
  configSchema: {
    type: "object",
    schemas: {
      env: {
        type: "string",
        default: "",
        placeholder: "env",
      },
    },
  },
  getStrategyForPlan(plan: PlanConfig, helperAPI: HelperApi) {
    return {
      strategy: {
        type: "shell",
        command: `nightwatch --env ${plan.config.env}`,
      },
      controller: {},
    };
  },
};
