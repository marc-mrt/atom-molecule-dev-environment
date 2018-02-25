"use babel";
// @flow

import * as React from "react";
import styled from "styled-components";

export default class ConsoleTraveller extends React.Component<Props, State> {
  state: State;
  props: Props;
  static defaultProps: DefaultProps;

  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div style={{
        overflow: "auto",
        display: "flex",
        justifyContent: "start",
        flex: "3",
        flexDirection: "column",
        background: "#404040",
      }}
      >
      </div>
    );
  }
}

ConsoleTraveller.defaultProps = {};

type DefaultProps = {};

type Props = {};

type State = {};
