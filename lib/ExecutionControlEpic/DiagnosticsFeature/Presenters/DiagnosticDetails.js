"use babel";
// @flow

import * as React from "react";
import path from "path";
import styled from "styled-components";
import ansiToHtml from "ansi-to-html";
import type { MoleculeDiagnostic } from "../Types/types.js";

const getSeverityColor = (color: number) => {
  switch (color) {
    case 1:
      return "red";
    case 2:
      return "yellow";
    case 3:
      return "blue";
    case 5:
      return "green";
    default:
      return "blue";
  }
};

const Box = styled.div`
  display: flex;
  flex: 0 0 auto;
  fontsize: 15px;
  flex-direction: column;
  border-bottom: 1px black solid;
  border-radius: 3px;
`;

const Severity = styled.div`
  border-left: ${props => getSeverityColor(props.severity)} 1px solid;
  border-radius: 3px;
`;

const Message = styled.p`
  margin-left: 4px;
`;

const Path = styled.h6`
  text-decoration: underline;
  margin: 4px;
`;

export default class DiagnosticDetails extends React.Component<Props, State> {
  state: State;
  props: Props;
  static defaultProps: DefaultProps;

  constructor(props: Props) {
    super(props);
    this.convert = new ansiToHtml();
  }

  convertMessageToHtml(message: string) {
    return this.convert.toHtml(
      message
        .replace(/(?:\r\n|\r|\n)/g, "<br/>")
        .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
        .replace(/ /g, "&nbsp;"),
    );
  }

  render() {
    const Comp = this.props.view;
    return (
      <Box>
        {Comp ? (
          <Comp {...this.props.diagnostic} />
        ) : (
          <Severity severity={this.props.diagnostic.severity}>
            <Path className="text-subtle">
              {path.basename(this.props.diagnostic.path || "")}
            </Path>
            <Message
              dangerouslySetInnerHTML={{
                __html: this.convertMessageToHtml(
                  this.props.diagnostic.message,
                ),
              }}
            />
          </Severity>
        )}
      </Box>
    );
  }
}

DiagnosticDetails.defaultProps = {};

type DefaultProps = {};

type Props = {
  view?: React.ComponentType<any>,
  diagnostic: MoleculeDiagnostic,
};

type State = {};
