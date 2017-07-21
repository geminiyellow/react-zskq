import React, { Component } from 'react';
import App from './App';

import {
  AppRegistry,
} from 'react-native';

class ZSKQ extends Component {
  mixins: [React.addons.PureRenderMixin]

  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('ZSKQ', () => ZSKQ);