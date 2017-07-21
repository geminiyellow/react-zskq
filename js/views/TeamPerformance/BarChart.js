/**
 * 条形图
 */

import React from 'react';
import { processColor, Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import NavBar from '@/common/components/NavBar';
import BarChart from '@/common/components/Chart/Bar';
import { device } from '@/common/Util';

export default class OrganizationTarget extends React.Component {
  static defaultProps = {
    chartCompletedData: [],
    chartTargetData: [],
    chartXValues: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      legend: {
        enabled: true,
        form: 'NONE',
        textColor: processColor('#FFFFFF'),
      },
      yAxis: {
        left: {
          textSize: 10,
          textColor: processColor('#999999'),
          spaceBottom: 0,
          gridLineWidth: 1,
          gridColor: processColor('#FDFBEF'),
          axisMinimum: 0,
          axisLineWidth: 1,
          axisLineColor: processColor('#14BE4B33'),
          valueFormatter: '#,###',
        },
        right: {
          enabled: false,
        },
      },
      chartDescription: {
        text: '',
      },
    };
  }

  /** Callback */

  handleSelect(event) {
    let entry = event.nativeEvent
    if (entry == null) {
      this.setState({ ...this.state, selectedEntry: null })
    } else {
      this.setState({ ...this.state, selectedEntry: JSON.stringify(entry) })
    }
  }

  /** Render methods */

  render() {
    const { yAxis, chartDescription } = this.state;
    const { navigator, chartCompletedData, chartTargetData, chartXValues, isOrientation, ...props } = this.props;

    const data = {
      dataSets: [{
        values: chartCompletedData,
        label: 'Completed Data',
        config: {
          drawValues: false,
          barWidth: 0.2,
          color: processColor('#14BE4B'),
          barShadowColor: processColor('lightgrey'),
          highlightColor: processColor('#14BE4B'),
        }
      }, {
        values: chartTargetData,
        label: 'Target Data',
        config: {
          drawValues: false,
          barWidth: 0.2,
          color: processColor('#139CF5'),
          barShadowColor: processColor('lightgrey'),
          highlightColor: processColor('#139CF5'),
        }
      }],
      config: {
        barWidth: 0.26,
        group: {
          fromX: device.isIos ? 0 : -0.02,
          groupSpace: 0.16,
          barSpace: 0.16,
        },
      },
    };

    let times;
    let countX;
    if (isOrientation) {
      times = chartXValues.length < 8 ? 1 : (chartXValues.length / 8) * 1.1;
      if (device.isIos) {
        times = 8;
      }
      countX = chartXValues.length <= 8 ? 8 : chartXValues.length;
    } else {
      times = chartXValues.length <= 4 ? 1 : (chartXValues.length / 4) * 1.1;
      if (device.isIos) {
        times = 4;
      }
      countX = chartXValues.length <= 4 ? 4 : chartXValues.length;
    }

    const xAxis = {
      valueFormatter: chartXValues,
      position: 'BOTTOM',
      gridLineWidth: 1,
      gridColor: processColor('#FDFBEF'),
      axisLineWidth: 1,
      axisLineColor: processColor('#14BE4B33'),
      gridLineWidth: 1,
      axisLineWidth: 1,
      granularity: 1,
      axisMinimum: 0,
      axisMaximum: countX,
      granularityEnabled: true,
      centerAxisLabels: true,
      textColor: processColor('#999999'),
    };
    // alert('aaaa');

    return (
      <View style={styles.container}>
        <BarChart
          style={styles.barChart}
          data={data}
          xAxis={xAxis}
          yAxis={yAxis}
          animation={{ durationX: 1000, durationY: device.isIos ? 1000 : 0 }}
          legend={this.state.legend}
          gridBackgroundColor={processColor('#ffffff')}
          drawBarShadow={false}
          drawValueAboveBar={true}
          drawHighlightArrow={true}
          chartDescription={chartDescription}
          onSelect={(event) => this.handleSelect(event)}
          scaleEnabled={false}
          dragEnabled={true}
          slide={times}
          {...props}
          />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 8,
  },
  barChart: {
    height: 280,
    width: device.width,
  },
});