"use babel";
// @flow

import * as React from "react";
import styled from "styled-components";
import type { ConsoleLog } from "../Types/types";
import type { ConsoleLogsReducer } from '../Containers/ConsoleLogsDetails';

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
        <ul
        style={{
          listStyleType: "none",
        }}
        >
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
