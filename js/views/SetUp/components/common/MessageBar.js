// 顶部导航栏下方的提示条

import React, { Component } from 'react';
import { Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';

export default class MessageBar extends Component {
  mixins: [React.addons.PureRenderMixin]

  render() {
    const { title, style } = this.props;
    return (
      <View style={[styles.bar, style]}>
        <Text allowFontScaling={false} style={styles.font}>{title}</Text>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  bar: {
    '@media ios': {
      top: 64,
    },
    '@media android': {
      top: 44,
    },
    left: 0,
    opacity: 0.8,
    position: 'absolute',
    width: device.width,
    height: 36,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  font: {
    fontSize: 14,
    color: '#ffffff',
  },
});