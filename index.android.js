import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import App from './App';

class ZSKQ extends Component {
  mixins: [React.addons.PureRenderMixin]

  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('ZSKQ', () => ZSKQ);