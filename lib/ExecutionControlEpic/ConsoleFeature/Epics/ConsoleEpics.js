"use babel";
// @flow

import Rx from "rxjs";
//import { List, Map } from "immutable";
import { combineEpics } from "redux-observable";
import Packages from "../../../ProjectSystemEpic/PackageFeature/Epics/Packages";
import { addConsoleLogsForTask } from '../Actions/AddConsoleLog';
import type { SetConsoleLogsForTaskAction } from '../Actions/AddConsoleLog';
//import type { ConsoleLog, ConsoleLogSeverity } from "../Types/types.js.flow";

// $ : RxJS convention to identify variables that reference a stream

// partition : It's like filter, but returns two Observables: one like the output of
// filter, and the other with values that did not pass the condition.

const consoleEpic = (action$: Observable, store: Store) => {
  return action$
    .ofType("ADD_CONSOLE_LOG")
};

export default consoleEpic;
