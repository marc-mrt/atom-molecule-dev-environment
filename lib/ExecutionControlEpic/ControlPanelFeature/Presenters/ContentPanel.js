"use babel";
// @flow

import React from "react";
import Term from "../../ActionSystemFeature/Presenters/Term";
import type { DisplayParams } from "../Types/types";
import type { Range } from "../../LanguageServerProtocolFeature/Types/standard";
import { DiagnosticsContent } from "../../DiagnosticsFeature/Presenters/DiagnosticsPanel";
import PlanConfigPanel from "../../PlanConfigurationFeature/Layouts/PlanConfigPanel";
import type { Task } from "../../TaskExecutionFeature/Types/types.js.flow";
import PlanConsolePanel from "../../ConsoleFeature/Layouts/PlanConsolePanel";

export default function ContentPanel({
  selection,
  onJumpTo,
  onTaskClick,
}: {
  selection: DisplayParams,
  onJumpTo: (path: string, range: Range, pending: boolean) => void,
  onTaskClick: (task: Task) => void,
}) {
  if (selection.mode == null) return null;
  else {
    switch (selection.mode.type) {
      case "terminal":
        return <Term xtermInstance={selection.mode.xtermInstance} />;
      case "diagnostics":
        return (
          <DiagnosticsContent
            diagnostics={selection.mode.diagnostics}
            onJumpTo={onJumpTo}
            tasks={selection.mode.tasks}
            onTaskClick={onTaskClick}
          />
        );
      case "plan-config":
        return (
          <PlanConfigPanel
            toolId={selection.mode.tool.id}
            toolName={selection.mode.tool.name}
            toolIconUri={selection.mode.tool.iconUri}
            toolDominantColor={selection.mode.tool.dominantColor}
            toolUri={selection.mode.tool.uri}
          />
        );
<<<<<<< HEAD
      case "console-panel":
        return <PlanConsolePanel />;
=======
      case "unified-diagnostics":
        return (
          <DiagnosticsContent
            diagnostics={selection.mode.diagnostics}
            onJumpTo={onJumpTo}
            tasks={selection.mode.tasks}
            onTaskClick={onTaskClick}
          />
        );
>>>>>>> b0dc048d2936a9d0ffc68055da7f0629624607d3
      default:
        return null;
    }
  }
}
