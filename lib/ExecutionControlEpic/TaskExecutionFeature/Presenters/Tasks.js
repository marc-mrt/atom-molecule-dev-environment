"use babel";
// @flow

import * as React from "react";
import Task from "./Task";
import styled from "styled-components";
import type { Task as TaskType } from "../Types/types";

const TasksBox = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding: 0px;
  flex: 0 0 auto;
`;

const TaskBox = styled.li`
  list-style: none;
  flex: 0 0 auto;
`;

export default function Tasks({ limited = false, tasks, onTaskClick }: Props) {
  return (
    <TasksBox>
      {tasks.slice(0, limited ? 5 : undefined).map(task => (
        <TaskBox key={task.id}>
          <Task {...task} onClick={() => onTaskClick(task)} />
        </TaskBox>
      ))}
    </TasksBox>
  );
}

Tasks.defaultProps = {
  limited: false,
};

type Props = {
  limited: boolean,
  onTaskClick(task: TaskType): void,
  tasks: Array<TaskType & { selected: boolean }>,
};
