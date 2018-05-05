"use babel";
// @flow

import * as React from "react";
import { compose, withProps, withState } from "recompose";
import styled from "styled-components";
import DiagnosticsModeSelector from "./DiagnosticsModeSelector";
import { List, Map, Set } from "immutable";
import DiagnosticDetailsFlow from "./DiagnosticDetailsFlow";
import type { DiagnosticSeverity, MoleculeDiagnostic } from "../Types/types";
import type { Range } from "../../LanguageServerProtocolFeature/Types/standard";
import Term from "../../ActionSystemFeature/Presenters/Term";
import DiagnosticsQuickSelector from "./DiagnosticsQuickSelector";
import DiagnosticsFilters from "./DiagnosticsFilters";
import type { Task } from "../../TaskExecutionFeature/Types/types";

const Panel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  flex: 1;
`;

const ContentBox = styled.div`
  display: flex;
  align-items: stretch;
  flex: 1;
  flex-direction: column;
  padding: 8px 0px 8px 8px;
`;

const ModeBox = styled.div`
  display: flex;
  align-items: stretch;
  flex-direction: column;
`;

export type TravellingState = {
  diagnosticsTypes: Set<DiagnosticSeverity>,
  search: string,
};

const ContentState = withState(
  "contentState",
  "setContentState",
  (): TravellingState => ({
    diagnosticsTypes: Set.of(1, 2, 3, 4, 5),
    search: "",
  }),
);

const Filter = withProps(
  ({
    diagnostics, //= List(),
    contentState,
  }: {
    diagnostics: Map<string, Map<DiagnosticSeverity, List<MoleculeDiagnostic>>>,
    contentState: TravellingState,
  }): {
    diagnostics: Map<string, Map<DiagnosticSeverity, List<MoleculeDiagnostic>>>,
  } => {
    return {
      diagnostics: diagnostics.map(map =>
        map.filter((v, k) => contentState.diagnosticsTypes.includes(k)),
      ),
    };
  },
);

const ContentModeAdapter = withProps(
  ({
    contentState,
    setContentState = () => {},
  }: {
    contentState: TravellingState,
    setContentState: (
      state: TravellingState | ((state: TravellingState) => TravellingState),
    ) => void,
  }) => ({
    filters: contentState,
    onToggleDiagnosticType(severity: DiagnosticSeverity) {
      if (
        contentState.diagnosticsTypes.size > 1 ||
        contentState.diagnosticsTypes.includes(severity) === false
      ) {
        setContentState((state: TravellingState) => ({
          ...state,
          diagnosticsTypes: state.diagnosticsTypes.includes(severity)
            ? state.diagnosticsTypes.remove(severity)
            : state.diagnosticsTypes.add(severity),
        }));
      }
    },
    onSearchChange(newSearch: string) {
      setContentState((state: TravellingState) => ({
        ...state,
        search: newSearch,
      }));
    },
    onClearFilters() {
      setContentState({
        diagnosticsTypes: Set.of(1, 2, 3, 4, 5),
        search: "",
      });
    },
  }),
);

const DiagnosticsContentBox = styled.div`
  position: relative;
  display: flex;
  flex: 1 1 0;
  align-items: stretch;
  overflow: hidden;
  flex-direction: column;
`;

const QuickSelectorBox = styled.div`
  display: flex;
  flex: 0 0 auto;
  position: absolute;
  top: 0px;
  right: 0px;
`;

const SearchIcon = styled.span`
  position: relative;
  left: 28px;
  top: 14px;
  pointer-events: none;
`;

const SearchField = styled.input`
  padding: 0;
  font-size: 12px;
  margin: 8px 8px 8px 0px;
  border: 1px solid black;
  height: 30px;
  width: 30px;
  text-indent: 30px;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
  transition: all 0.4s ease;
  &:focus {
    width: 200px;
  }
`;

const FiltersBox = styled.div`
  display: flex;
  position: absolute;
  right: -350px;
  top: 0px;
  bottom: 0px;
  transition: transform 0.375s;
  transform: translate3d(${props => (props.open ? "-375px" : "0px")}, 0, 0);
`;

const FilterPanelState = withState("filtersOpen", "setFiltersOpen", false);

function DiagnosticsContentPanel({
  filters,
  diagnostics,
  filtersOpen,
  setFiltersOpen,
  onToggleDiagnosticType,
  onSearchChange,
  tasks = List(),
  onTaskClick = () => {},
  onClearFilters = () => {},
  onJumpTo = () => {},
}: {
  filters: TravellingState,
  diagnostics: Map<string, Map<DiagnosticSeverity, List<MoleculeDiagnostic>>>,
  filtersOpen: boolean,
  setFiltersOpen: (v: boolean) => void,
  onToggleDiagnosticType: (severity: DiagnosticSeverity) => void,
  onSearchChange: (search: string) => void,
  tasks: List<Task>,
  onTaskClick: (task: Task) => void,
  onClearFilters: () => void,
  onJumpTo: (path: string, range: Range, pending: boolean) => void,
}) {
  return (
    <DiagnosticsContentBox>
      <DiagnosticDetailsFlow diagnostics={diagnostics} onJumpTo={onJumpTo} />
      <QuickSelectorBox>
        <DiagnosticsQuickSelector
          diagnostics={diagnostics}
          severities={filters.diagnosticsTypes}
          onFilterClick={onToggleDiagnosticType}
        />
        <SearchIcon className="icon icon-search" />
        <SearchField
          className="input-search badge"
          type="search"
          placeholder="Search.."
          value={filters.search}
          onChange={e => onSearchChange(e.target.value)}
          style={{ display: "inline" }}
        />
      </QuickSelectorBox>
    </DiagnosticsContentBox>
  );
}

export const DiagnosticsContent = compose(
  ContentState,
  Filter,
  FilterPanelState,
  ContentModeAdapter,
)(DiagnosticsContentPanel);

// const JumpToButtonElement = styled.button`
//   position: absolute;
//   right: 16px;
//   bottom: 16px;
// `;

// function JumpToButton({ onClick }: { onClick: () => void }) {
//   return (
//     <JumpToButtonElement
//       className="btn btn-primary inline-block-tight"
//       onClick={onClick}
//     >
//       Jump to
//     </JumpToButtonElement>
//   );
// }

function DiagnosticsPanel({
  diagnostics = Map(),
  mode,
  onModeSelection,
  onJumpTo,
  xtermInstance,
  tasks,
  onTaskClick,
  currentTask,
}: {
  diagnostics: Map<string, Map<DiagnosticSeverity, List<MoleculeDiagnostic>>>,
  mode: PanelMode,
  onModeSelection: (mode: PanelMode) => void,
  onJumpTo: (path: string, range: Range, pending: boolean) => void,
  xtermInstance: any,
  tasks: List<Task>,
  onTaskClick: (task: Task) => void,
  currentTask: Task,
}) {
  return (
    <Panel>
      <ModeBox>
        <DiagnosticsModeSelector
          type={mode}
          onClick={onModeSelection}
          terminal={
            currentTask.terminal !== false &&
            currentTask.strategy != null &&
            currentTask.strategy.type === "terminal"
          }
        />
      </ModeBox>
      <ContentBox
        className={`diagnostic-content ${
          mode === "terminal" ? "terminal" : ""
        }`}
      >
        {mode === "terminal" ? (
          <Term xtermInstance={xtermInstance} />
        ) : (
          <DiagnosticsContent
            mode={mode}
            diagnostics={diagnostics}
            onJumpTo={onJumpTo}
            tasks={tasks}
            onTaskClick={onTaskClick}
          />
        )}
      </ContentBox>
    </Panel>
  );
}

type PanelMode = "diagnostics" | "terminal";

type DiagnosticsModeState = {
  mode: "diagnostics",
};

type TerminalModeState = {
  mode: "terminal",
};

type PanelState = TerminalModeState | DiagnosticsModeState;

// function selectDiagnosticsByType(
//   diagnostics: List<MoleculeDiagnostic>,
//   type: DiagnosticSeverity,
// ) {
//   return diagnostics.filter(d => d.type === type);
// }

// function selectDiagnosticN(diagnostics: List<MoleculeDiagnostic>, n: number) {
//   return diagnostics.get(n, diagnostics.get(0, null));
// }

const ModeAdapter = withProps(
  ({
    panelState,
    setPanelState = () => {},
  }: {
    panelState: PanelState,
    setPanelState: (state: PanelState) => void,
  }) => ({
    mode: panelState.mode,
    onModeSelection: (mode: PanelMode): void => {
      if (mode === "terminal") {
        setPanelState({
          mode: "terminal",
        });
      } else if (mode === "diagnostics") {
        setPanelState({
          mode: "diagnostics",
        });
      } else {
        setPanelState({
          mode: "diagnostics",
        });
      }
    },
  }),
);

// function getHigherPriorityType(diagnostics: List<MoleculeDiagnostic>): DiagnosticSeverity {
//   if (diagnostics.some(d => d.type === "error")) return "error";
//   else if (diagnostics.some(d => d.type === "warning")) return "warning";
//   else if (diagnostics.some(d => d.type === "success")) return "success";
//   else if (diagnostics.some(d => d.type === "info")) return "info";
//   else return "error";
// }

export const enhance = compose(
  withState(
    "panelState",
    "setPanelState",
    ({ currentTask }: { currentTask: Task }): PanelState => {
      let mode: PanelState;

      if (
        currentTask.terminal !== false &&
        currentTask.strategy != null &&
        currentTask.strategy.type === "terminal"
      ) {
        mode = { mode: "terminal" };
      } else {
        mode = { mode: "diagnostics" };
      }

      return mode;
    },
  ),
  ModeAdapter,
);

export default enhance(DiagnosticsPanel);
