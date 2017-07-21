// Hair line

import React, { Component } from 'react';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Line from '@/common/components/Line';

export default class MyLine extends Component {

  render() {
    const { style, lineStyle } = this.props;
    return (
      <View style={[styles.background, style]}>
        <Line style={[styles.line, lineStyle]} />
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
    backgroundColor: '$color.line',
  },
});