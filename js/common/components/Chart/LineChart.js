/** 折线图 */
import React from 'react';
import { requireNativeComponent } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
const RNLineChart = requireNativeComponent('RNLineChart', LineChart);

export default class LineChart extends React.Component {
  render() {
    const { style } = this.props;
    return (
      <RNLineChart
        style={[styles.chart, style]}
        {...this.props}/>
    );
  }
}

const styles = EStyleSheet.create({
  chart: {
    height: 300,
  }
});