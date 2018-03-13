"use babel";
// @flow

import Rx from "rxjs";
//import { List, Map } from "immutable";
import { combineEpics } from "redux-observable";
import Packages from "../../../ProjectSystemEpic/PackageFeature/Epics/Packages";
import { addConsoleDiagnosticsForTask } from '../Actions/AddConsoleDiagnostic';
import type { SetConsoleLogsForTaskAction } from '../Actions/AddConsoleDiagnostic';
//import type { ConsoleMessages, DiagnosticSeverity } from "../Types/types.js.flow";

const consoleEpic = action$ =>
  action$.ofType().mergeMap(action => {
    return Rx.Observable.create(observer => {

    });
  });

export default consoleEpic;
