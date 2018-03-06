"use babel";
// @flow

import { List } from "immutable";
import type { PackageInfo } from "../../../ProjectSystemEpic/PackageFeature/Types/types.js.flow";
import type { PlanConfig } from "../../PlanConfigurationFeature/Types/types.js.flow";
import type { Task } from "../../TaskExecutionFeature/Types/types.js.flow";
import type { DevTool } from "../../DevToolsSummaryFeature/Types/types.js.flow";
import type {
  MoleculeDiagnostic,
  DiagnosticSeverity,
} from "../../DiagnosticsFeature/Types/types.js.flow";
import Terminal from "xterm";

export type PlanPanel = {
  plan: PlanConfig,
  tasks: List<Task>,
};
export type ToolPanel = { tool: DevTool, plans: List<PlanPanel> };
export type PackagePanel = { package: PackageInfo, tools: List<ToolPanel> };

export type DisplayMode =
  | {
      type: "terminal",
      xtermInstance: ?Terminal,
    }
  | {
      type: "diagnostics",
      diagnostics: Map<
        string,
        Map<DiagnosticSeverity, List<MoleculeDiagnostic>>,
      >,
      tasks: List<Task>,
    }
  | {
      type: "plan-config",
      tool: DevTool,
    };

export type DisplayParams = {
  plan: ?PlanConfig,
  mode: ?DisplayMode,
};
