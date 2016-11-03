import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import DevTools from "./DevTools";


storiesOf('DevTools', module)
  .add('Basic', () => (
    <DevTools tools={[
      {iconUri: 'devtool-icon-docker.png'},
      {iconUri: 'devtool-icon-nightwatch.png'},
      {iconUri: 'devtool-icon-npm.svg'},
    ]}/>
  ))