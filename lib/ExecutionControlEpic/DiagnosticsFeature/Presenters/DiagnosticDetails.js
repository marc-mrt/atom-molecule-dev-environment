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
`;

const Severity = styled.pre`
  border-left: ${props => getSeverityColor(props.severity)} 1px solid;
`;

const Message = styled.p`
  margin-left: 4px;
`;

const Path = styled.code`
  font-size: 10px;
  text-decoration: underline;
`;

export default class DiagnosticDetails extends React.Component<Props, State> {
  state: State;
  props: Props;
  static defaultProps: DefaultProps;

  constructor(props: Props) {
    super(props);
  }

  render() {
    const Convert = new ansiToHtml();
    const Comp = this.props.view;
    return Comp ? (
      <Comp {...this.props.diagnostic} />
    ) : (
      <Box>
        <Path>{path.basename(this.props.diagnostic.path)}</Path>
        <Severity severity={this.props.diagnostic.severity}>
          <Message
            dangerouslySetInnerHTML={{
              __html: Convert.toHtml(
                this.props.diagnostic.message
                  .replace(/(?:\r\n|\r|\n)/g, "<br/>")
                  .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
                  .replace(/ /g, "&nbsp;"),
              ),
            }}
          />
        </Severity>
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
