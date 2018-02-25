"use babel";
// @flow

import * as React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "../../../GlobalSystem/Store";
import PlanConsolePanel from "../Layouts/PlanConsolePanel";
import { StyleRoot } from "radium";

export function renderConsolePanel(
): void {
  const mountingPoint = document.createElement("div");
  mountingPoint.style.alignItems = "stretch";
  mountingPoint.style.flex = "1";
  mountingPoint.style.height = "100%";
  mountingPoint.className = "flex";
  ReactDOM.render(
    <Provider store={store}>
      <StyleRoot style={{ display: "flex", alignItems: "stretch", flex: "1" }}>
        <PlanConsolePanel>
        </PlanConsolePanel>
      </StyleRoot>
    </Provider>,
    mountingPoint,
  );
  const paneItem = {
    element: mountingPoint,
    getTitle() {
      return `Molecule Console`;
    },
    getDefaultLocation() {
      return "bottom";
    },
    getURI() {
      return "molecule-console-panel";
    },
  };
  global.atom.workspace.open(paneItem);
}
