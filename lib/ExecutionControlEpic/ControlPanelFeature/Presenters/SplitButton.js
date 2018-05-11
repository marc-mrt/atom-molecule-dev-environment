"use babel";
// @flow

import React from "react";
import styled from "styled-components";

const SplitButtonElement = styled.span`
  height: 15px;
  width: 15px;
  display: flex;
  align-items: center;
  margin: 0px 4px 0px 4px;
  cursor: pointer;
`;

const SplitButton = ({ onClick }: { onClick: () => void }) => (
  <SplitButtonElement className="icon icon-versions" onClick={onClick} />
);

export default SplitButton;
