/**
 * 文本提示控件，适用于显示版本号，表单号这类小的信息
 */
import React, { PureComponent } from 'react';
import Line from '@/common/components/Line';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Text, View } from 'react-native';
import { device } from '../Util';

export default class SmallHintView extends PureComponent {
  render() {
    const { content, lineStyle, textStyle } = this.props;
    return (
      <View style={styles.container}>
        <Line style={[styles.linedefaultStyle, lineStyle]} />
        <Text allowFontScaling={false} style={[styles.textdefaultStyle, textStyle]}>{content}</Text>
        <Line style={[styles.linedefaultStyle, lineStyle]} />
      </View >
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linedefaultStyle: {
    width: 40,
    height: device.hairlineWidth,
    backgroundColor: '#bfbfbf',
  },
  textdefaultStyle: {
    marginLeft: 11,
    marginRight: 11,
    fontSize: 11,
    color: '#bfbfbf',
  },
});