"use babel";
// @flow

import Rx from "rxjs";
//import { List, Map } from "immutable";
import { combineEpics } from "redux-observable";
import Packages from "../../../ProjectSystemEpic/PackageFeature/Epics/Packages";
//import type { ConsoleMessages, DiagnosticSeverity } from "../Types/types.js.flow";

//epic
const fetchConsoleEpic = action$ =>
  action$.ofType().mergeMap(action => {
    return Rx.Observable.create(observer => {});
  });
