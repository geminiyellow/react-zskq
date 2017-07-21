import React, { Component } from 'react';
import ManagerVerifyUi from './../Verify/ManagerVerifyUi';
import {
  Text,
} from 'react-native';

export default class DirectorApprove extends Component {
  mixins: [React.addons.PureRenderMixin]
  render() {
    return (
      <ManagerVerifyUi navigator={this.props.navigator} needToSignQty={this.props.passProps.needToSignQty} />
    );
  }
}
