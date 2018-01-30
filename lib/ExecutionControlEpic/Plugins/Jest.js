"use babel";
// @flow

import type { PlanConfig } from "../PlanConfigurationFeature/Types/types.js.flow";
import type { TaskAPI } from "../LanguageServerProtocolFeature/Types/pluginApi";
import moment from "moment";
import path from "path";
import type { HelperApi } from "../TaskExecutionFeature/Model/HelperApi";
import fs from "fs";

function getOutputFilePath(planName: string, helperAPI: HelperApi): string {
  return helperAPI.fs.getTmpPath(`jest-${planName}.output.json`);
}

export default {
  info: {
    name: "jest",
    dominantColor: "#AB4426",
    iconUri:
      "atom://molecule-dev-environment/.storybook/public/devtool-icon-jest.png",
  },
  configSchema: {
    type: "object",
    schemas: {
      configFile: {
        type: "file",
        label: "Configuration",
        default: "",
        tester: (packagePath: string, dirname: string) =>
          path.basename(packagePath).match(/.*jest.*(js|json)$/) != null,
      },
      modifiedOnly: {
        type: "boolean",
        label: "only modified files (must be in a Git repo)",
        default: false,
      },
      watch: {
        type: "boolean",
        label: "Watch mode",
        default: true,
      },
      binary: {
        type: "conditional",
        expression: {
          type: "enum",
          label: "binary",
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
      environmentVariables: {
        type: "array",
        label: "Environment Variables",
        items: {
          type: "string",
          default: "",
          label: "Variable",
          placeholder: "NAME=value",
        },
      },
    },
  },
  getStrategyForPlan(plan: PlanConfig, helperApi: HelperApi) {
    let binaryPath;
    if (plan.config.binary.expressionValue === "local")
      binaryPath = `${path.join(
        path.dirname(plan.packageInfo.path),
        "node_modules",
        ".bin",
        "jest",
      )}`;
    else binaryPath = "jest";

    let command = `${
      binaryPath
    } --json --useStderr --silent --outputFile ${getOutputFilePath(
      plan.name,
      helperApi,
    )}`;
    command = `${command} ${plan.config.modifiedOnly ? `-o` : ""}`;
    if (plan.config.configFile !== "")
      command = `${command} --config ${plan.config.configFile}`;
    command = `${command} ${plan.config.watch ? "--watch" : ""}`;

    let env = plan.config.environmentVariables.reduce(function(
      env: any,
      varDeclaration: string,
    ) {
      let split = varDeclaration.split("=");
      return { ...env, [split[0]]: split[1] };
    },
    process.env);

    return {
      strategy: {
        type: "terminal",
        command: command,
        cwd: path.dirname(plan.packageInfo.path),
        env: env,
      },
      controller: {
        onData(data: string, taskAPI: TaskAPI, helperAPI: HelperApi): void {
          if (this.nextStepAtNextData === true) {
            this.nextStepAtNextData = false;
            taskAPI.diagnostics.clearAll();
          }
          if (
            data.toString().indexOf("Test results written to: ") !== -1 &&
            data.toString().indexOf(`jest-${plan.name}.output.json`) !== -1
          ) {
            taskAPI.busy.switchToWaitingMode();
            this.nextStepAtNextData = true;
            fs.readFile(
              `${getOutputFilePath(plan.name, helperAPI)}`,
              (err, json) => {
                if (!err) {
                  helperAPI.json.parseAsync(json.toString()).then(json => {
                    json.testResults.forEach(suite => {
                      if (suite.status === "passed") {
                        taskAPI.diagnostics.setForPath({
                          uri: suite.name,
                          diagnostics: [
                            {
                              severity: helperApi.severity.success,
                              message: helperAPI.outputToHTML(
                                `${suite.name.replace(
                                  path.dirname(plan.packageInfo.path),
                                  "",
                                )} :${"\n"}${suite.assertionResults
                                  .map(assertionResult => assertionResult.title)
                                  .join("\n")}`,
                              ),
                              date: moment(suite.endTime),
                            },
                          ],
                        });
                      } else {
                        taskAPI.diagnostics.setForPath({
                          uri: suite.name,
                          diagnostics: [
                            {
                              severity: helperApi.severity.error,
                              message: helperAPI.outputToHTML(
                                `${suite.name.replace(
                                  path.dirname(plan.packageInfo.path),
                                  "",
                                )}${"\n"}${suite.message}`,
                              ),
                              date: moment(suite.endTime),
                            },
                          ],
                        });
                      }
                    });
                  });
                }
              },
            );
          } else if (
            data.toString().indexOf("Determining test suites to run...") !== -1
          ) {
            taskAPI.busy.switchToBusyMode();
          }
        },
        onError(err: any, taskAPI: TaskAPI, helperAPI: HelperApi): void {
          taskAPI.diagnostics.setForWorkspace({
            uri: "jest",
            diagnostics: [
              {
                severity: helperApi.severity.error,
                message: err,
                date: moment().unix(),
              },
            ],
          });
        },
      },
    };
  },
  isPackage: (packageName: string, dirname: string) => {
    if (path.basename(packageName) === "package.json") {
      const check = new Promise((resolve, reject) =>
        fs.access(
          path.join(
            packageName.slice(
              0,
              packageName.lastIndexOf(path.basename(packageName)),
            ),
            "node_modules",
            "jest-cli",
          ),
          err => {
            if (err) resolve(false);
            else resolve(true);
          },
        ),
      );
      return check;
    } else {
      return false;
    }
  },
};
