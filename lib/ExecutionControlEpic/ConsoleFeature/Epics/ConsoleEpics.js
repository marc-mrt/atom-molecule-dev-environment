"use babel";
// @flow

import Rx from "rxjs";
import { List, Map } from "immutable";
import { ofType } from "redux-observable";
import { addConsoleLogsForTask } from '../Actions/AddConsoleLog';

const consoleEpic = () => (action$: any, store: any) => {
  return action$
  .ofType("ADD_PLAN_CONFIGURATION")
  .map(action =>
    //console.log("ACTION : " + action.payload),
     addConsoleLogsForTask({
       source: "Molecule",
       color: "#ffffff",
       severity: 3,
       message: "The plan has been created",
       version: "0.4.0",
     }));
};

export default consoleEpic;
