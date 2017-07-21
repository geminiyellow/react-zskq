import {
  NetInfo,
  View,
} from 'react-native';

import React, { Component } from 'react';

import I18n from 'react-native-i18n';
import { showMessage } from './Message';
import { messageType } from './Consts';

import { device, keys } from './Util';

const languageTypes = ['zh', 'en'];

export default class extends Component {
  mixins: [React.addons.PureRenderMixin]

  constructor(props) {
    super(props);
    this.state = {
      connectionAlive: null,
    };
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('change', (connectionAlive) => this.handleNetworkChange(connectionAlive));
    NetInfo.isConnected.fetch().done((connectionAlive) => this.setState({ connectionAlive }));
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('change', this.handleNetworkChange);
  }

  handleNetworkChange(connectionAlive) {
    this.setState({
      connectionAlive,
    });
  }

  render() {
    return (
      <View />
    );
  }
}