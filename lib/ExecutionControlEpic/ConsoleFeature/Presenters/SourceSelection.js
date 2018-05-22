"use babel";
// @flow

import * as React from "react";
import styled from "styled-components";
import type { ConsoleSourcesReducer } from "../Reducers/ConsoleSourcesDetails";

export default class SourceSelection extends React.Component<Props, State> {
  state: State;
  props: Props;
  static defaultProps: DefaultProps;

  constructor(props: Props) {
    super(props);
  }

  toggleChange(source: string, status: boolean) {
    this.props.onIsChecked(source, status);
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
        }}
      >
        {this.props.sources &&
          this.props.sources.map(elem => (
            <div
              style={{
                paddingRight: "15px",
                paddingLeft: "25px",
              }}
            >
              <label
                style={{
                  float: "left",
                  fontSize: "13px",
                }}
              >
                {elem[0]}
              </label>
              <input
                type="checkbox"
                className="console-log-checkbox"
                defaultChecked={elem[1]}
                onChange={event => {
                  this.toggleChange(elem[0], event.target.checked);
                }}
              />
            </div>
          ))}
      </div>
    );
  }
}

SourceSelection.defaultProps = {};

type DefaultProps = {};

type Props = {
  sources: ConsoleSourcesReducer,
  onIsChecked(source: string, status: boolean): void,
  addMoleculeSource(source: string, status: boolean): void,
};

type State = {};
