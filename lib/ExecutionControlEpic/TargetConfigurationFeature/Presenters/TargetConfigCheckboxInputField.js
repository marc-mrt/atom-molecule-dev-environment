'use babel'
// @flow

import React from 'react';

export default class TargetConfigCheckboxInputField extends React.Component<DefaultProps, Props, State> {

  state: State;
  props: Props;
  static defaultProps: DefaultProps;

  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <span>
        <input type="checkbox" checked={this.props.value} onChange={e => this.props.onChange(e.target.checked)}/>
        <label>{this.props.label}</label>
      </span>
    )
  }
}

TargetConfigCheckboxInputField.propTypes = {

};

TargetConfigCheckboxInputField.defaultProps = {

};

type DefaultProps = {

};

type Props = {
  value: boolean,
  label?: string,
  onChange(value: boolean): void,
};

type State = {

};