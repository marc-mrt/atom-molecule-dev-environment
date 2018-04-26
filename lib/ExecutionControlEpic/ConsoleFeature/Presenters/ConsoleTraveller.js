"use babel";
// @flow

import * as React from "react";
import styled from "styled-components";
import type { ConsoleLog } from "../Types/types";
import type { ConsoleLogsReducer } from "../Containers/ConsoleLogsDetails";
import LogItem from "./LogItem";

const ColumnTitle = styled.th`
  padding: 5px;
  background-color: purple;
  font-size: 14px;
  color: white;
`;

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
          background: "#404040"
        }}
      >
        <table
          style={{
            width: "100%"
          }}
        >
          <thead>
            <tr>
              <ColumnTitle>Source</ColumnTitle>
              <ColumnTitle>Type</ColumnTitle>
              <ColumnTitle>Message</ColumnTitle>
              <ColumnTitle>Date</ColumnTitle>
              <ColumnTitle>Version</ColumnTitle>
            </tr>
          </thead>
          <tbody>
            {this.props.logs &&
              this.props.logs.map(elem => <LogItem log={elem} />)}
          </tbody>
        </table>
      </div>
    );
  }
}

ConsoleTraveller.defaultProps = {};

type DefaultProps = {};

type Props = {
  logs: ConsoleLogsReducer
};

type State = {};
