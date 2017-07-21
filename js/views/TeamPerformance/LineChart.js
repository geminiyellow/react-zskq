/**
 * 组织指标折线图
 */
import React from 'react';
import { processColor, StatusBar, Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import LineChart from '@/common/components/Chart/LineChart';
import { device } from '@/common/Util';
import Legend from './Legend';
import { LINE_CHART_HEIGHT } from './constant';

export default class OrganizationLineChart extends React.Component {
  static defaultProps = {
    chartCompletedData: [],
    chartTargetData: [],
    chartXValues: [],
  };

  constructor(props) {
    super(props);

    this.isLanscape = false;
    this.state = {
      chartWidth: device.width,
      chartHeight: LINE_CHART_HEIGHT,
      marginTop: 10,

      legend: {
        enabled: false,
      },
      yAxis: {
        left: {
          textSize: 10,
          textColor: processColor('#999999'),
          spaceBottom: 0,
          gridLineWidth: 1,
          gridColor: processColor('#FDFBEF'),
          axisLineWidth: 1,
          axisLineColor: processColor('#14BE4B33'),
          axisMinimum: 0,
          granularity: 1,
          granularityEnabled: true,
          valueFormatter: '#,###',
        },
        right: {
          enabled: false,
        },
      },
      chartDescription: {
        text: '',
      },
      drawGridBackground: true,
      gridBackgroundColor: processColor('white'),
      setScaleEnabled: false,
      noDataText: '暂无图表数据',
      marker: {
        enabled: true,
        backgroundTint: processColor('teal'),
        markerColor: processColor('#14BE4B'),
        textColor: processColor('white'),
        textSize: 10,
      },
      animation: {
      },
    };
  }

  /** Callback */

  onSelect(event) {
    const { chartCompletedData, chartTargetData, chartXValues } = this.props;
    let entry = event.nativeEvent;
    if (!entry) return;
    let selectedIndex = 0;
    selectedIndex = parseInt(entry.x);
    if (isNaN(selectedIndex)) return;
    const completedValue = chartCompletedData[selectedIndex];
    const targetValue = chartTargetData[selectedIndex];
    const xValue = chartXValues[selectedIndex];
    const { onSelectedValue } = this.props;
    if (onSelectedValue && completedValue && targetValue) {
      onSelectedValue(completedValue.y, targetValue.y, xValue);
    }
  }

  onRotateScreen(isLandscape) {
    if (isLandscape) {
      this.setState({
        chartHeight: device.width,
        marginTop: 0,
      });
    } else {
      this.setState({
        chartHeight: LINE_CHART_HEIGHT,
        marginTop: 10,
      });
    }
  }

  /** Render methods */

  render() {
    const { chartHeight, marginTop } = this.state;
    const { chartCompletedData } = this.props;
    if (!chartCompletedData || chartCompletedData.length < 1) {
      return null;
    }
    return (
      <View style={[styles.container, { height: chartHeight, marginTop }]}>
        {this.renderLegend()}
        {this.renderPureLineChart()}
      </View>
    );
  }

  // 加载单独的折线图
  renderPureLineChart() {
    const { yAxis, legend, chartDescription, drawGridBackground, gridBackgroundColor, noDataText, marker, animation } = this.state;
    const { chartCompletedData, chartTargetData, chartXValues } = this.props;
    const data = {
      dataSets: [
        {
          values: chartTargetData,
          label: 'Company Y',
          config: {
            lineWidth: 2,
            drawCubicIntensity: 0.4,
            drawValues: false,
            drawHighlightIndicators: true,
            color: processColor('#139CF5'),
            drawFilled: false,
            fillColor: processColor('#139CF5'),
            fillAlpha: 45,
            drawHighlightIndicators: true,
            drawVerticalHighlightIndicator: true,
            drawHorizontalHighlightIndicator: false,
            highlightColor: processColor('#FF7C12'),
            highlightLineWidth: 1,
            // 绘制空心圆
            drawCircles: true,
            circleRadius: 4,
            circleColor: processColor('#139CF5'),
            drawCircleHole: true,
            circleHoleRadius: 2,
            circleHoleColor: processColor('white'),
          },
        },
        {
          values: chartCompletedData,
          label: 'Company X',
          config: {
            lineWidth: 2,
            highlightColor: processColor('#FF7C12'),
            highlightLineWidth: 1,
            color: processColor('#14BE4B'),
            fillAlpha: 60,
            // 设置折线图节点的数据是否显示
            drawValues: false,
            valueTextSize: 15,
            valueFormatter: "##.000",
            drawHighlightIndicators: true,
            drawVerticalHighlightIndicator: true,
            drawHorizontalHighlightIndicator: false,
            // 绘制空心圆
            drawCircles: true,
            circleRadius: 4,
            circleColor: processColor('#14BE4B'),
            drawCircleHole: true,
            circleHoleRadius: 2,
            circleHoleColor: processColor('white'),
          }
        },
      ],
    };
    // xAxis
    const xAxisConfig = {
      valueFormatter: chartXValues,
      position: 'BOTTOM',
      labelRotationAngle: (chartXValues.length > 4) ? 60 : 0,
      textSize: 10,
      textColor: processColor('#999999'),
      gridLineWidth: 1,
      gridColor: processColor('#FDFBEF'),
      axisLineWidth: 1,
      axisLineColor: processColor('#14BE4B33'),
      labelCount: chartXValues.length,
      labelCountForce: (chartXValues.length == 1) ? false : true,
      avoidFirstLastClipping: true,
    };
    return (
      <LineChart
        style={styles.chart}
        data={data}
        xAxis={xAxisConfig}
        yAxis={yAxis}
        legend={legend}
        chartDescription={chartDescription}
        drawGridBackground={drawGridBackground}
        gridBackgroundColor={gridBackgroundColor}
        doubleTapToZoomEnabled={false}
        pinchZoom={false}
        scaleEnabled={false}
        noDataText={noDataText}
        marker={marker}
        onSelect={(event) => this.onSelect(event)}
        animation={animation}
      />
    );
  }

  // 加载折线图图例
  renderLegend() {
    const { completedName, targetName } = this.props;
    return (
      <Legend
        completedName={completedName}
        targetName={targetName}
        onRotateScreen={(isLandscape) => this.onRotateScreen(isLandscape)}/>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    marginTop: 10,
    flex: 1,
    backgroundColor: 'white',
  },
  chart: {
    marginLeft: 5,
    marginRight: 10,
    '@media ios': {
      marginTop: -20,
    },
    height: 280,
  },
});