"use babel";
// @flow

import * as React from "react";
import styled from "styled-components";
import type { ConsoleLog } from "../Types/types";
import type { ConsoleLogsReducer } from '../Reducers/ConsoleLogs';
import { LogItem } from "../Layouts/LogItem";

export default class ConsoleTraveller extends React.Component<Props, State> {
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
          justifyContent: "start",
          flex: "3",
          flexDirection: "column",
          background: "#404040",
        }}
      >
        <ul>
          <li>"One line"</li>
          {this.props.logs && this.props.logs.map(elem => <li>{elem.message}</li>)}
        </ul>
      </div>
    );
  }
}

ConsoleTraveller.defaultProps = {};

type DefaultProps = {};

type Props = {
  logs: ConsoleLogsReducer,
};

type State = {};
