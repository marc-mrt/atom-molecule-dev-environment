"use babel";
// @flow

import * as React from "react";
import styled from "styled-components";

export default class SourceSelection extends React.Component<Props, State> {
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
          flex: "1",
          flexDirection: "column",
          background: "#262626",
        }}
      />
    );
  }
}

SourceSelection.defaultProps = {};

type DefaultProps = {};

type Props = {};

type State = {};
