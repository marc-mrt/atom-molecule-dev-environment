"use babel";
// @flow

import React from "react";
import type {
  PlanConfig,
} from "../PlanConfigurationFeature/Types/types.js.flow";
import type { TaskAPI } from "../DevtoolLoadingFeature/Types/types.js.flow";
import fs from "fs";
import path from "path";
import moment from "moment";
import type { HelperApi } from "../TaskExecutionFeature/Model/HelperApi";
import EslintDiagnostic from "./Presenters/EslintDiagnostic.js";

function getOutputFilePath(planName) {
  return path.join(path.sep, "tmp", `eslint-${planName}.output.json`);
}

export default {
  infos: {
    name: "eslint",
    iconUri: "atom://molecule-dev-environment/.storybook/public/devtool-icon-eslint.svg",
  },
  configSchema: {
    type: "object",
    schemas: {
      binary: {
        type: "conditional",
        expression: {
          type: "enum",
          enum: [
            { value: "local", description: "local" },
            { value: "global", description: "global" },
          ],
        },
        cases: {
          local: null,
          global: null,
        },
      },
      sources: {
        type: "object",
        title: "sources files",
        schemas: {
          source: {
            type: "string",
            title: "source",
            placeholder: "lib/",
            default: "lib/",
          },
          sourceArray: {
            type: "array",
            title: "aditional files",
            items: {
              type: "string",
              title: "source",
              placeholder: "lib/",
            },
          },
        },
      },
    },
  },
  getStrategyForPlan(plan: PlanConfig) {
    let binaryPath;
    const sources = `${plan.config.sources.source} ${plan.config.sources.sourceArray.join(" ")}`;
    if (plan.config.binary.expressionValue === "local") {
      binaryPath = `${path.join(path.dirname(plan.packageInfos.path), "node_modules", ".bin", "eslint")}`;
    } else binaryPath = "eslint";
    const cmd = `${binaryPath} ${sources} -f json -o ${getOutputFilePath(plan.name)}`;
    return {
      strategy: {
        type: "shell",
        command: cmd,
        cwd: path.dirname(plan.packageInfos.path),
      },
      controller: {
        onData(): void {},
        onExit(code: number, taskAPI: TaskAPI, helperAPI: HelperApi): void {
          fs.readFile(`${getOutputFilePath(plan.name)}`, (err, json) => {
            if (!err) {
              helperAPI.json.parseAsync(json.toString()).then(res => {
                res.forEach(file => {
                  if (file.errorCount > 0 || file.warningCount > 0) {
                    file.messages.forEach(message => {
                      taskAPI.addDiagnostics([
                        {
                          type: message.severity > 1 ? "error" : "warning",
                          message: function EslintDiagnosticComp() {
                            return (
                              <EslintDiagnostic
                                path={file.filePath}
                                message={message}
                              />
                            );
                          },
                          date: moment().unix(),
                          location: {
                            path: file.filePath,
                            line: message.line,
                            column: message.column,
                          },
                        },
                      ]);
                    });
                  }
                });
              });
            }
          });
        },
        onError(err: any, taskAPI: TaskAPI, helperAPI: HelperApi): void {
          taskAPI.addDiagnostics([
            {
              type: "error",
              message: { data: err },
              date: moment().unix(),
            },
          ]);
        },
      },
    };
  },
  isPackage: (packageName: string, dirname: string) =>
    path.basename(packageName).indexOf("eslintrc") !== -1,
};