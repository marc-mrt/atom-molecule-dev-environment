"use babel";
// @flow

import * as React from "react";
import type { DiagnosticSeverity } from "../../DiagnosticsFeature/Types/types.js.flow";
import type { DevToolWithDiagnostics as DevToolWithDiagnosticsType } from "../Types/types.js.flow";
import DevToolWithDiagnostics from "./DevToolWithDiagnostics";
import Rx from "rxjs/Rx";

export default class DevToolsWithDiagnostics extends React.Component<
  Props,
  State,
> {
  state: State;
  props: Props;
  static defaultProps: DefaultProps;
  unsubscribeKeyObs: rxjs$Subscription;

  constructor(props: Props) {
    super(props);

    this.state = {
      showColor: false,
    };
  }

  componentDidMount() {
    const addEventListener = eventName => handler => {
      if (global.atom) {
        global.atom.workspace.observePanes(pane => {
          global.atom.views.getView(pane).addEventListener(eventName, handler);
        });
      } else {
        document.addEventListener(eventName, handler);
      }
    };

    const removeEventListener = eventName => handler => {
      if (global.atom) {
        global.atom.workspace.observePanes(pane => {
          global.atom.views
            .getView(pane)
            .removeEventListener(eventName, handler);
        });
      } else {
        document.removeEventListener(eventName, handler);
      }
    };

    this.unsubscribeKeyObs = Rx.Observable.merge(
      Rx.Observable.fromEventPattern(
        addEventListener("keyup"),
        removeEventListener("keyup"),
      )
        .filter(e => e.keyCode === 222 || e.shiftKey === false)
        .mapTo(false),
      Rx.Observable.fromEventPattern(
        addEventListener("keydown"),
        removeEventListener("keydown"),
      )
        .filter(e => e.keyCode === 222 && e.shiftKey === true)
        .mapTo(true),
    ).subscribe(combinationActivated => {
      if (combinationActivated != this.state.showColor)
        this.setState({ showColor: combinationActivated });
    });
  }

  componentWillUnmount() {
    this.unsubscribeKeyObs.unsubscribe();
  }

  render() {
    return (
      <ul
        style={{
          display: "flex",
          flex: "1",
          flexDirection: "row",
          paddingLeft: "0px",
          margin: "5px 0px",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          position: "relative",
        }}
      >
        {this.props.tools.map(tool => (
          <li
            key={tool.id + "-" + (tool.planColor || "")}
            style={{ listStyle: "none", margin: "0px" }}
          >
            <DevToolWithDiagnostics
              iconUri={tool.iconUri}
              name={tool.name}
              errors={tool.errors}
              warnings={tool.warnings}
              successes={tool.successes}
              info={tool.info}
              state={tool.state}
              index={tool.index}
              busy={tool.busy}
              dominantColor={tool.dominantColor}
              notifier={tool.notifier}
              planColor={tool.planColor}
              legend={tool.legend}
              showColor={this.state.showColor || this.props.showColor}
              onLogsClick={() => this.props.onToolLogsClick(tool)}
              onDiagnosticClick={severity =>
                this.props.onToolDiagnosticsClick(tool, severity)
              }
              onSettingsClick={() => this.props.onToolSettingsClick(tool)}
            />
          </li>
        ))}
        {(this.state.showColor || this.props.showColor) && (
          <div
            className="dev-tool-bar-background-color"
            style={{
              borderRadius: "10px",
              boxShadow:
                "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
              minWidth: "100px",
              height: "75px",
              position: "absolute",
              top: "-100px",
              left: "10px",
              right: "10px",
              zIndex: "0",
            }}
          />
        )}
      </ul>
    );
  }
}

DevToolsWithDiagnostics.defaultProps = {
  showColor: false,
};

type DefaultProps = {};

type Props = {
  tools: Array<DevToolWithDiagnosticsType>,
  showColor?: boolean,
  onToolDiagnosticsClick(
    devtool: DevToolWithDiagnosticsType,
    severity: DiagnosticSeverity,
  ): void,
  onToolLogsClick(devtool: DevToolWithDiagnosticsType): void,
  onToolSettingsClick(devtool: DevToolWithDiagnosticsType): void,
};

type State = {
  showColor: boolean,
};
