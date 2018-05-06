"use babel";
// @flow

import * as React from "react";
import styled from "styled-components";
import type { DiagnosticSeverity, MoleculeDiagnostic } from "../Types/types";
import DiagnosticDetails from "../Containers/DiagnosticDetails";
import { List, Map } from "immutable";
import type { Range } from "../../LanguageServerProtocolFeature/Types/standard";

const Flow = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  align-items: stretch;
  overflow: auto;
  padding: 0px;
`;

const Detail = styled.li`
  display: flex;
  flex: 0 0 auto;
  align-items: stretch;
  flex-direction: column;
  padding: 0px;
`;

export default class DiagnosticDetailsFlow extends React.Component<
  Props,
  State,
> {
  state: State;
  props: Props;
  static defaultProps: DefaultProps;
  contain: HTMLElement;
  list: HTMLElement;
  isDown: boolean;

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    if (this.contain) this.isDown = true;
    this._scroll();
  }

  componentWillUpdate() {
    if (this.contain) this.isDown = this.isScrolledDown();
  }

  componentDidUpdate() {
    this._scroll();
  }

  isScrolledDown() {
    return (
      this.contain.scrollTop + this.contain.clientHeight ==
      this.contain.scrollHeight
    );
  }

  _scroll() {
    if (this.contain && this.isDown && this.list) {
      this.contain.scrollTop =
        this.contain.scrollHeight - this.contain.clientHeight;
    }
  }

  render() {
    return (
      <Flow
        innerRef={ref => {
          this.contain = ref;
        }}
      >
        {this.props.diagnostics.map(severityMap =>
          severityMap.map(diagnosticsList =>
            diagnosticsList.map((diagnostic, i) => (
              <Detail
                key={i}
                innerRef={e => {
                  i == this.props.diagnostics.size - 1 ? (this.list = e) : null;
                }}
              >
                <DiagnosticDetails
                  diagnostic={diagnostic}
                  jumpTo={this.props.onJumpTo}
                />
              </Detail>
            )),
          ),
        )}
      </Flow>
    );
  }
}

DiagnosticDetailsFlow.defaultProps = {};

type DefaultProps = {};

type Props = {
  diagnostics: Map<string, Map<DiagnosticSeverity, List<MoleculeDiagnostic>>>,
  onJumpTo: (path: string, range: Range, pending: boolean) => void,
};

type State = {};
