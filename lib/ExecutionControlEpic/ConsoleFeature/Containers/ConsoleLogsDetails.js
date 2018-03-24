"use babel";
// @flow

import { connect } from "react-redux";
import type { State } from "../../../GlobalSystem/types.js.flow";
import { selectConsoleLogsReducer } from '../../../GlobalSystem/Selectors';
import { ConsoleLog } from "../Types/types.js.flow";

// TODO Console Traveller as Presenter ?

//Get State to rerender
export function mapStateToProps(state: State): { log: ConsoleLog } {
  return {
    log: selectConsoleLogsReducer(state),
  };
}

export function mapDispatchToProps() {
  return {};
}

export var Connecter = connect(mapStateToProps, mapDispatchToProps);

//to which component it's connected
export default Connecter(ConsoleLogsDetails);
