'use babel'
// @flow

import type {TaskState, DevToolInfos, Task} from "../Types/types.js.flow";
import { fromJS, is } from "immutable";
import type {TasksReducer} from "../Reducers/Tasks";
import {areSameTargets} from "../../TargetConfigurationFeature/Model/TargetManipulators";
import type {TargetConfig} from "../../TargetConfigurationFeature/Types/types.js.flow";

export function selectPertinentTask(state: TasksReducer): Task {
  let tasks = fromJS(state);
  let runningTask = tasks.find(task => task.get('state') == "running");
  if (runningTask)
    return runningTask.toJS();
  else {
    return tasks.reduce((red, task) => {
      if (red.get('state') == null)
        return task;
      else if (red.get('end') && task.get('end'))
        return red.get('end') < task.get('end') ? task : red;
      else if (task.get('end'))
        return task;
      else
        return red;
    }, fromJS({state: null})).update(task => task.get('state') ? task.toJS() : null);
  };
};

export function selectStateOfTarget(state: TasksReducer, target: {config: mixed, tool: DevToolInfos}): TaskState {
  return fromJS(state)
          .filter(task => areSameTargets(task.get('target').toJS(), target))
          .update(values => {
            let task = selectPertinentTask(values.toJS());
            if (task)
              return task.state;
            else
              return null;
          });
};

export function selectStateOfTool(state: TasksReducer, toolId: string): TaskState {
  return fromJS(state)
          .filter(task => task.getIn(['target', 'tool', 'id']) == toolId)
          .update(values => {
            let task = selectPertinentTask(values.toJS());
            if (task)
              return task.state;
            else
              return null;
          });
};

export function selectTaskIDOfRunningTarget(state: TasksReducer, target: TargetConfig): string {
  return fromJS(state)
          .filter(task => areSameTargets(task.get('target').toJS(), target) && task.get('state') == "running")
          .update(tasks => tasks.count() > 0 ? tasks.getIn([0, 'id']) : null);
};

export function selectTasksOfTool(state: TasksReducer, toolId: string) {
  return fromJS(state)
          .filter(task => task.getIn(['target', 'tool', 'id']) == toolId)
          .toJS();
};

export function selectPertinentTaskID(state: TasksReducer): string {
  let task = selectPertinentTask(state);
  return task ? task.id : null;
};