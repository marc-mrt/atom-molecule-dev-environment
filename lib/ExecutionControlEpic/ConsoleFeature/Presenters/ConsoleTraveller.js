"use babel";
// @flow

import * as React from "react";
import styled from "styled-components";
import type { ConsoleLogsReducer } from "../Containers/ConsoleLogsDetails";
import LogItem from "./LogItem";

const ColumnTitle = styled.th`
  padding: 0.7em;
  font-size: 14px;

  &:nth-child(1) {
    width: 15%;
    padding-left: 2em;
  }

  &:nth-child(2) {
    width: 10%;
  }

  &:nth-child(3) {
    width: 45%;
  }

  &:nth-child(4) {
    width: 20%;
  }

  &:nth-child(5) {
    width: 10%;
  }
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
      <table
        style={{
          width: "100%",
          overflow: "auto",
          justifyContent: "start",
          tableLayout: "fixed",
        }}
      >
        <thead>
          <tr className="table-title">
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
    );
  }
}

ConsoleTraveller.defaultProps = {};

type DefaultProps = {};

type Props = {
  logs: ConsoleLogsReducer,
};

type State = {};
