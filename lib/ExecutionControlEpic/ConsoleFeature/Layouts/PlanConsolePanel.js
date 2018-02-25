"use babel";
// @flow

import * as React from "react";
import styled from "styled-components";
import SourceSelection from './SourceSelection';
import ConsoleTraveller from "./ConsoleTraveller";

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
          justifyContent: "center",
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

type Props = {
};

type State = {};
