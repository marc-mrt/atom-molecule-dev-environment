"use babel";
// @flow

import * as React from "react";
import styled from "styled-components";
import type { ConsoleLog } from "../Types/types";

const LogCell = styled.td`
  padding: 3px;
`;

export default class LogItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <tr>
        <LogCell>{this.props.log.source}</LogCell>
        <LogCell>{this.props.log.severity}</LogCell>
        <LogCell>{this.props.log.message}</LogCell>
        <LogCell>{this.props.log.date}</LogCell>
        <LogCell>{this.props.log.version}</LogCell>
      </tr>
    );
  }
}

LogItem.defaultProps = {};

type DefaultProps = {};

type Props = {
  log: ConsoleLog
};

type State = {};
