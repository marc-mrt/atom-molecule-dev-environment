import React from 'react';
import { shallow, mount } from 'enzyme';
import Tasks from './Tasks';
import Task from './Task';
import moment from 'moment';

describe('Tasks', () => {
  let tasks = [
    {state: 'stopped', debut: moment().unix(), end: moment().subtract(1, 's').unix()},
    {state: 'running', debut: moment().subtract(2, 'm').unix()},
    {state: 'running', debut: moment().subtract(2, 'm').unix(), selected: true},
    {state: 'failed', debut: moment().subtract(2, 'm').unix(), end: moment().subtract(1, 'm').unix()},
    {state: 'crashed', debut: moment().subtract(3, 'm').unix(), end: moment().unix()},
    {state: 'running', debut: moment().subtract(3, 'h').unix()}
  ];

  it('should display tasks', () => {
    let subject = shallow(<Tasks tasks={tasks}/>);

    expect(subject.find(Task).length).toBe(6);
    let firstTask = subject.find(Task).at(0);
    expect(firstTask.prop('state')).toBe(tasks[0].state);
    expect(firstTask.prop('debut')).toBe(tasks[0].debut);
    expect(firstTask.prop('end')).toBe(tasks[0].end);
  });

  it('should set opacity at 0.7 if a task isn\'t selected', () => {
    let subject = shallow(<Tasks tasks={tasks}/>);

    expect(subject.findWhere(comp => comp.type() == 'li' && comp.prop('style').opacity && comp.prop('style').opacity != '1').length).toBe(5);
    expect(subject.findWhere(comp => comp.type() == 'li' && comp.prop('style').opacity && comp.prop('style').opacity == '1').length).toBe(1);
  });

  it('should display only 5 tasks when limited props is passed', () => {
    let subject = shallow(<Tasks tasks={tasks} limited/>);

    expect(subject.find(Task).length).toBe(5);
  });

  it('should call onTaskClick on click', () => {
    let spy = jest.fn();
    let subject = shallow(<Tasks tasks={tasks} onTaskClick={spy}/>);

    subject.find(Task).at(1).prop('onClick')();

    expect(spy).toBeCalledWith(tasks[1]);
  });
});