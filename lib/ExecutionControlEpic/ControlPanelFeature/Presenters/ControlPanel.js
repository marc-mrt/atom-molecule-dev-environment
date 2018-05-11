"use babel";
// @flow

import React from "react";
import styled from "styled-components";
import path from "path";
import Section, { withTooltip } from "./Section";
import { List } from "immutable";
import type { PackagePanel, PlanPanel, ToolPanel } from "../Types/types";
import PinButton from "./PinButton";
import RunningStateIndicator from "./RunningStateIndicator";
import SplitButton from "./SplitButton";
import StartButton from "./StartButton";
import type { PlanConfig } from "../../PlanConfigurationFeature/Types/types.js.flow";
import { selectPertinentTask } from "../../TaskExecutionFeature/Selectors/Tasks";
import type { DevTool } from "../../DevToolsSummaryFeature/Types/types.js.flow";
import StopButton from "./StopButton";
import type { TaskState } from "../../TaskExecutionFeature/Types/types.js.flow";
import UnpinButton from "./UnpinButton";
import type { DisplayParams } from "../Types/types";

const ControlPanelBox = styled.div`
  padding: 0px;
  margin: 0px;
  width: 300px;
  overflow: auto;
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  align-items: stretch;
  font-family: system-ui;
`;

const ToolIcon = styled.img`
  height: 16px;
  width: 16px;
  display: flex;
  align-items: center;
  margin: 2px 10px 2px 0px;
  background-color: white;
  border-radius: 50%;
  padding: 1px;
`;

const ControlsBox = styled.div`
  display: flex;
  margin: 4px;
`;

const TipSplitButton = withTooltip(SplitButton);
const TipPinButton = withTooltip(PinButton);
const TipUnpinButton = withTooltip(UnpinButton);
const TipStartButton = withTooltip(StartButton);
const TipStopButton = withTooltip(StopButton);

function PlanControls({
  onSplit,
  onPin,
  onUnPin,
  onStart,
  onStop,
  state,
  pinned = false,
}: {
  onSplit: () => void,
  onPin: () => void,
  onUnPin: () => void,
  onStart: () => void,
  onStop: () => void,
  state: TaskState,
  pinned?: boolean,
}) {
  return (
    <ControlsBox>
      <TipSplitButton onClick={onSplit} tooltip="Split the plan's window" />
      {pinned ? (
        <TipUnpinButton
          onClick={onUnPin}
          tooltip="Unpin the plan from the dock"
        />
      ) : (
        <TipPinButton onClick={onPin} tooltip="Pin the plan on the dock" />
      )}
      {state === "running" ? (
        <TipStopButton onClick={onStop} tooltip="Stop the plan" />
      ) : (
        <TipStartButton onClick={onStart} tooltip="Run the plan" />
      )}
    </ControlsBox>
  );
}

function ToolControls() {
  return <ControlsBox />;
}

export default function ControlPanel({
  packagePanels = List(),
  onStartPlan = () => {},
  onStopPlan = () => {},
  onPinPlan = () => {},
  onUnPinPlan = () => {},
  onTerminalClick = () => {},
  onDiagnosticClick = () => {},
  onSplit = () => {},
  onNewPlanClick = () => {},
  onUnifiedDiagnosticsClick = () => {},
  selection,
}: {
  packagePanels: List<PackagePanel>,
  onStartPlan: (plan: PlanConfig) => void,
  onStopPlan: (plan: PlanConfig) => void,
  onPinPlan: (plan: PlanConfig) => void,
  onUnPinPlan: (plan: PlanConfig) => void,
  onTerminalClick: (plan: PlanConfig) => void,
  onDiagnosticClick: (plan: PlanConfig) => void,
  onSplit: (plan: PlanConfig) => void,
  onNewPlanClick: (tool: DevTool) => void,
  onUnifiedDiagnosticsClick: (pkg: string) => void,
  selection: DisplayParams,
}) {
  return (
    <ControlPanelBox className="tool-panel-background-color">
      {packagePanels.map((packagePanel: PackagePanel) => (
        <Section
          key={packagePanel.package.path}
          title={packagePanel.package.name}
          iconClassName={`icon icon-${
            path.extname(packagePanel.package.name).length > 0
              ? "file"
              : "file-directory"
          }`}
          foldable
        >
          <Section
            key={`${packagePanel.package.path}u-d`}
            title={"Unified Diagnostics"}
            iconClassName="icon icon-info"
            tooltip={`Diagnostics view of ${packagePanel.package.name}`}
            onTitleClick={() =>
              onUnifiedDiagnosticsClick(packagePanel.package.path)
            }
            selected={
              selection.mode &&
              selection.mode.type === "unified-diagnostics" &&
              selection.mode.pkg === packagePanel.package.path
            }
          />
          {packagePanel.tools.toArray().map((toolPanel: ToolPanel) => (
            <Section
              key={toolPanel.tool.name}
              title={toolPanel.tool.name}
              icon={() => <ToolIcon src={toolPanel.tool.iconUri} />}
              controls={() => <ToolControls />}
              color={toolPanel.tool.dominantColor}
              foldable
            >
              {toolPanel.plans.toArray().map((planPanel: PlanPanel) => (
                <Section
                  key={planPanel.plan.id}
                  title={planPanel.plan.name}
                  icon={() => (
                    <RunningStateIndicator
                      state={
                        planPanel.tasks.find(task => task.state === "running")
                          ? "running"
                          : "stopped"
                      }
                    />
                  )}
                  controls={() => {
                    const pertinentTask = selectPertinentTask(planPanel.tasks);
                    return (
                      <PlanControls
                        onStart={() => onStartPlan(planPanel.plan)}
                        onStop={() => onStopPlan(planPanel.plan)}
                        onPin={() => onPinPlan(planPanel.plan)}
                        onUnPin={() => onUnPinPlan(planPanel.plan)}
                        onSplit={() => onSplit(planPanel.plan)}
                        state={pertinentTask ? pertinentTask.state : null}
                        pinned={planPanel.plan.pinned}
                      />
                    );
                  }}
                >
                  {planPanel.tasks.find(
                    task =>
                      task.state === "running" &&
                      task.strategy.type === "terminal",
                  ) && (
                    <Section
                      title="Terminal"
                      iconClassName="icon icon-terminal"
                      onTitleClick={() => onTerminalClick(planPanel.plan)}
                      selected={
                        selection.plan === planPanel.plan &&
                        selection.mode &&
                        selection.mode.type === "terminal"
                      }
                      tooltip={`Terminal view of ${planPanel.plan.name}`}
                    />
                  )}
                  {planPanel.tasks.size > 0 && (
                    <Section
                      title="Diagnostics"
                      iconClassName="icon icon-stop"
                      onTitleClick={() => onDiagnosticClick(planPanel.plan)}
                      selected={
                        selection.plan === planPanel.plan &&
                        selection.mode &&
                        selection.mode.type === "diagnostics"
                      }
                      tooltip={`Diagnostics view of ${planPanel.plan.name}`}
                    />
                  )}
                </Section>
              ))}
              <Section
                title="New plan"
                iconClassName="icon icon-plus"
                onTitleClick={() => onNewPlanClick(toolPanel.tool)}
                selected={
                  selection.mode &&
                  selection.mode.type === "plan-config" &&
                  selection.mode.tool.id === toolPanel.tool.id
                }
                tooltip={`Create a new ${toolPanel.tool.name} plan`}
              />
            </Section>
          ))}
        </Section>
      ))}
    </ControlPanelBox>
  );
}
