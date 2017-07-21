/** 首页图表 */

import {
  NativeModules,
  findNodeHandle,
  requireNativeComponent,
} from 'react-native';

import React, { Component } from 'react';
import { processColors } from './commonColorProps';

const RNBarChartManager = NativeModules.RNBarChartSwift;
const RNBarChart = requireNativeComponent('RNBarChartSwift', BarChart);

class BarChart extends Component {
  mixins: [React.addons.PureRenderMixin]
  constructor(props) {
    super(props);
    this.setVisibleXRangeMaximum = this.setVisibleXRangeMaximum.bind(this);
  }

  setVisibleXRangeMaximum(value) {
    RNBarChartManager.setVisibleXRangeMaximum(findNodeHandle(this), value);
  }

  render() {
    let { config, ...otherProps } = this.props;
    config = JSON.stringify(processColors(config));

    return <RNBarChart config={config} {...otherProps} />;
  }
}

module.exports = BarChart;