// Hair line

import React, { Component } from 'react';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Line from '@/common/components/Line';

export default class MyLine extends Component {
  mixins: [React.addons.PureRenderMixin]

  render() {
    return (
      <View style={styles.background}>
        <Line style={styles.line} />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  background: {
    backgroundColor: '#ffffff',
  },
  line: {
    marginLeft: 22,
    backgroundColor: '#EBEBEB',
  },
});