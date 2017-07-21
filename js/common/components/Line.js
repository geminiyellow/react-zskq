import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View,
} from 'react-native';

import { device } from '../Util';

export default class Line extends Component {
  mixins: [React.addons.PureRenderMixin]
  render() {
    const { style } = this.props;
    return (
      <View style={[styles.line, style]} />
    );
  }
}

const styles = EStyleSheet.create({
  line: {
    backgroundColor: '$color.line',
    width: device.width,
    height: device.hairlineWidth,
  },
});