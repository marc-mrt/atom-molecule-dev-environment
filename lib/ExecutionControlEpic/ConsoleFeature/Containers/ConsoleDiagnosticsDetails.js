"use babel";
// @flow

import { connect } from "react-redux";
import type { State } from "../../../GlobalSystem/types.js.flow";

//Containers: The state has changed. Send new state to presenter

//Get State to rerender
export function mapStateToProps(
  state: State,
  //ownProps: { diagnostic: MoleculeDiagnostic },
): { view: any } {

  );
  return {

  };
}

export function mapDispatchToProps() {
  return {};
}

export var Connecter = connect(mapStateToProps, mapDispatchToProps);

//Connect presenter
//export default Connecter(DiagnosticDetails);
