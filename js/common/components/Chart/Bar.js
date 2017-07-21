/** spm 条形图 */

import React from 'react';
import { requireNativeComponent } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const RNBarChart = requireNativeComponent('RNBarChart', Bar);

export default class Bar extends React.Component {
  render() {
    return (
      <RNBarChart
        style={styles.chart}
        {...this.props}/>
    );
  }
}

const styles = EStyleSheet.create({
  chart: {
    height: 220,
  }
});