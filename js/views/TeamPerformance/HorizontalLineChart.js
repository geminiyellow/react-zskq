/** 横屏折线图显示 */

import React from 'react';
import { processColor, ScrollView, Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';
import LineChart from './LineChart';

export default class HorizontalLineChart extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.chart, { transform: [
          { rotate: '90deg' },
          { translateX: 145 },
          { translateY: 145 },
          ]}]}>
          <LineChart style={styles.chart}/>
        </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
  },
  chart: {
    width: device.height,
    height: device.width,
  },
});