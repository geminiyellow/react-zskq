// Hair Line with marginLeft: 18.

import React, { Component } from 'react';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Line from '@/common/components/Line';

export default class MyLine extends Component {
  mixins: [React.addons.PureRenderMixin]

  render() {
    const { style } = this.props;
    return (
      <View style={styles.background}>
        <Line style={[styles.line, style]} />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  background: {
    backgroundColor: '#ffffff',
  },
  line: {
    marginLeft: 18,
    backgroundColor: '#EBEBEB',
  },
});