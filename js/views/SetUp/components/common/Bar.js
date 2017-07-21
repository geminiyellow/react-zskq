// 显示设备组

import React, { Component } from 'react';
import { Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';

export default class Bar extends Component {
  mixins: [React.addons.PureRenderMixin]

  render() {
    const { title } = this.props;
    return (
      <View style={styles.bar}>
        <Text allowFontScaling={false} style={styles.font}>{title}</Text>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  bar: {
    width: device.width,
    height: 35,
    justifyContent: 'center',
  },
  font: {
    marginLeft: 18,
    fontSize: 12,
    color: 'gray',
  },
});