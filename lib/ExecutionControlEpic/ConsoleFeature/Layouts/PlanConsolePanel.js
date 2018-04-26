"use babel";
// @flow

import * as React from "react";
import styled from "styled-components";
import SourceSelection from "../Containers/ConsoleSourcesDetails";
import ConsoleTraveller from '../Containers/ConsoleLogsDetails';

export default class PlanConsolePanel extends React.Component<Props, State> {
  state: State;
  props: Props;
  static defaultProps: DefaultProps;

  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div
        style={{
          overflow: "auto",
          display: "flex",
          justifyContent: "left",
          flexDirection: "row",
          flex: "1",
        }}
      >
        <SourceSelection />
        <ConsoleTraveller />
      </div>
    );
  }
}

PlanConsolePanel.defaultProps = {};

type DefaultProps = {};

type Props = {};

type State = {};
