import React, { PureComponent } from 'react';
import {
  DeviceEventEmitter,
  PanResponder,
  View,
  NativeModules,
  processColor,
} from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import Text from '@/common/components/TextField';
import { device, keys } from '@/common/Util';
import Loading from '@/common/components/Loading';
import { GET, ABORT } from '@/common/Request';
import Image from '@/common/components/CustomImage';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import { getEmployeeAttendanceData } from '@/common/api';
import { chart } from '@/common/Style';
import realm from '@/realm';
import Realm from 'realm';
import { weekOrderArray } from './Function/weekHelper';

const BarChart = device.isIos ? require('@/common/components/Chart/BarChart') : null;
const AndroidBarChart = device.isAndroid ? require('./BarChart') : null;

const { RNManager } = NativeModules;
this.lastWeek = [];
this.thisWeek = [];
this.panResponder = {};
this.startDay = '1';

export default class Chart extends PureComponent {
  constructor() {
    super();
    this.state = {
      configandroid: {
        chartDescription: {
          text: I18n.t('mobile.module.home.chart.thisweekhours'),
          textColor: '#7f7f7f',
          textSize: 12,
          positionX: -10000000,
          positionY: 0,
        },
        chartBackgroundColor: processColor('white'),
        drawValueAboveBar: false,
        stackLabels: [`${I18n.t('mobile.module.home.chart.tag.regularhours')}`, `${I18n.t('mobile.module.home.chart.tag.overtime')}`,
        `${I18n.t('mobile.module.home.chart.tag.leave')}`, `${I18n.t('mobile.module.home.chart.tag.onbusiness')}`],
        legend: {
          enabled: true,
          form: 'NONE',
          textColor: processColor('#FFFFFF'),
        },
        animation: {
          easingX: 'Linear',
          easingY: 'Linear',
          durationX: 1000,
          durationY: 1000,
        },
        xAxis: {
          position: 'BOTTOM',
          textSize: 12,
          textColor: processColor('#cecece'),
          drawGridLines: false,
          drawAxisLine: false,
          axisLineWidth: 1,
          axisLineColor: processColor('#e5e5e5'),
          spaceBetweenLabels: 1,
          valueFormatter: weekOrderArray(this.startDay),
          gridLineWidth: 1,
        },
        yAxis: {
          left: {
            textSize: 13,
            textColor: processColor('#CECECE'),
            // 控制y轴的数值线样式
            gridColor: processColor('#FDFBEF'),
            gridLineWidth: 1,
            drawAxisLine: false,
            spaceTop: 5,
            // 控制x轴文字
            spaceBottom: 5,
            // 控制x轴线的样式
            zeroLine: {
              lineColor: processColor('#e5e5e5'),
              lineWidth: 1,
              enabled: true,
            },
            drawTopYLabelEntryEnabled: false,
            labelCount: 6,
          },
          right: {
            drawGridLines: false,
            enabled: false,
          },
        },
        data: {
          dataSets: [{
            values: [],
            label: '',
            config: {
              colors: [processColor(chart.regularHours), processColor(chart.overtime), processColor(chart.leave), processColor(chart.onBusiness)],
              // 柱子上的文字样式
              valueTextSize: 6,
              valueTextColor: processColor('#FFFFFF'),
              //筛选本地数据0 的显示屏蔽
              valueFormatter: '###,###,###,##0.0',
            }
          }],
          config: {
            barWidth: 0.4,
          }
        },
        noDataText: I18n.t('mobile.module.home.chart.hoursdistributiontable'),
        noDataTextDescription: I18n.t('mobile.module.home.chart.nohoursdata'),
      },
      config: {
        dataSets: [{
          values: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
          colors: [chart.regularHours, chart.overtime, chart.leave, chart.onBusiness],
          stackLabels: [`${I18n.t('mobile.module.home.chart.tag.regularhours')}`, `${I18n.t('mobile.module.home.chart.tag.overtime')}`,
          `${I18n.t('mobile.module.home.chart.tag.leave')}`, `${I18n.t('mobile.module.home.chart.tag.onbusiness')}`],
          valueTextFontSize: 8,
          valueTextColor: 'white',
          barSpace: 0.6,
        }],
        noDataText: I18n.t('mobile.module.home.chart.hoursdistributiontable'),
        noDataTextDescription: I18n.t('mobile.module.home.chart.nohoursdata'),
        infoTextColor: '#000',
        infoTextFontSize: 17,
        infoDescriptionTextColor: '#999',
        infoDescriptionFontSize: 14,
        descriptionText: I18n.t('mobile.module.home.chart.thisweekhours'),
        descriptionTextColor: '#d7d7d7',
        descriptionTextAlign: 'left',
        descriptionFontSize: 12,
        descriptionTextPosition: {
          x: 10,
          y: 2,
        },
        barType: 'Stacked',
        userInteractionEnabled: false,
        drawValueAboveBar: false,
        backgroundColor: 'transparent',
        labels: weekOrderArray(this.startDay),
        legend: {
          position: 'aboveChartRight',
          textSize: 10,
          textColor: '#bebebe',
          xEntrySpace: 5,
          formSize: 12,
          formToTextSpace: 5,
          xOffset: -16,
        },
        animation: {
          easingOption: 'linear',
          xAxisDuration: 1,
          yAxisDuration: 1,
        },
        xAxis: {
          position: 'bottom',
          textSize: 12,
          textColor: '#cecece',
          drawGridLines: false,
          drawAxisLine: false,
          spaceBetweenLabels: 1,
        },
        leftAxis: {
          spaceBottom: 0.05,
          textSize: 14,
          textColor: '#d7d7d7',
          gridColor: '#fdf9e5',
          drawAxisLine: false,
          drawZeroLines: true,
          drawTopYLabelEntryEnabled: true,
          axisMinimum: 0,
          labelCount: 6,
          zeroLineColor: '#b1f2e6',
        },
        rightAxis: {
          drawGridLines: false,
          enabled: false,
        },
        valueFormatter: {
          type: 'regular',
          numberStyle: 'DecimalStyle',
          maximumDecimalPlaces: 1,
        },
        viewport: {
          left: 36,
          top: 36,
          right: 26,
          bottom: 30,
        },
      },
      scrollData: null,
      flag: 0,
      loaded: false,
    };
  }

  componentWillMount() {
    if (device.isAndroid) {
      RNManager.getScreenSize((info) => {
        this.screenWidth = info.screenWidth;
        this.screenHeight = info.screenHeight;
      });
    }

    this.previousLeft = 0;
    this.previousTop = 0;
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder.bind(this),
      onMoveShouldSetPanResponder: this.handleMoveShouldSetPanResponder.bind(this),
      onPanResponderGrant: this.handlePanResponderGrant.bind(this),
      onPanResponderMove: this.handlePanResponderMove.bind(this),
      onPanResponderRelease: this.handlePanResponderEnd.bind(this),
      onPanResponderTerminate: this.handlePanResponderEnd.bind(this),
    });
  }

  componentDidMount() {
    this.mounted = true;
    this.fetchThisWeekData();
    this.fetchLastWeekData();
    // To show popover when first entering the home page.
    this.popoverTimer = setTimeout(() => this.showHomePopover(), 1000);

    this.languageChanged = DeviceEventEmitter.addListener('changeLanguage', (data) => {
      if (device.isAndroid) {
        this.setState({
          configandroid: {
            chartDescription: {
              text: I18n.t('mobile.module.home.chart.thisweekhours'),
              textColor: '#7f7f7f',
              textSize: 12,
              positionX: -10000000,
              positionY: 0,
            },
            chartBackgroundColor: processColor('white'),
            stackLabels: [`${I18n.t('mobile.module.home.chart.tag.regularhours')}`, `${I18n.t('mobile.module.home.chart.tag.overtime')}`,
            `${I18n.t('mobile.module.home.chart.tag.leave')}`, `${I18n.t('mobile.module.home.chart.tag.onbusiness')}`],
            drawValueAboveBar: false,
            legend: {
              enabled: true,
              form: 'NONE',
              textColor: processColor('#FFFFFF'),
            },
            animation: {
              easingX: 'Linear',
              easingY: 'Linear',
              durationX: 1000,
              durationY: 1000,
            },
            xAxis: {
              position: 'BOTTOM',
              textSize: 12,
              textColor: processColor('#cecece'),
              drawGridLines: false,
              drawAxisLine: false,
              spaceBetweenLabels: 1,
              valueFormatter: weekOrderArray(this.startDay),
              axisLineWidth: 1,
              axisLineColor: processColor('#e5e5e5'),
              gridLineWidth: 1,
            },
            yAxis: {
              left: {
                textSize: 13,
                textColor: processColor('#CECECE'),
                // 控制y轴的数值线样式
                gridColor: processColor('#FDFBEF'),
                gridLineWidth: 1,
                drawAxisLine: false,
                spaceTop: 5,
                // 控制x轴文字
                spaceBottom: 5,
                // 控制x轴线的样式
                zeroLine: {
                  lineColor: processColor('#e5e5e5'),
                  lineWidth: 1,
                  enabled: true,
                },
                drawTopYLabelEntryEnabled: false,
                labelCount: 6,
              },
              right: {
                drawGridLines: false,
                enabled: false,
              },
            },
            data: {
              dataSets: [{
                values: this.thisWeek,
                label: '',
                config: {
                  colors: [processColor(chart.regularHours), processColor(chart.overtime), processColor(chart.leave), processColor(chart.onBusiness)],
                  // 柱子上的文字样式
                  valueTextSize: 6,
                  valueTextColor: processColor('#FFFFFF'),
                  //筛选本地数据0 的显示屏蔽
                  valueFormatter: '###,###,###,##0.0',
                }
              }],
              config: {
                barWidth: 0.4,
              }
            },
            noDataText: I18n.t('mobile.module.home.chart.hoursdistributiontable'),
            noDataTextDescription: I18n.t('mobile.module.home.chart.nohoursdata'),
          }
        });
      }
      if (device.isIos) {
        this.setState({
          config: {
            dataSets: [{
              values: this.thisWeek,
              colors: [chart.regularHours, chart.overtime, chart.leave, chart.onBusiness],
              stackLabels: [`${I18n.t('mobile.module.home.chart.tag.regularhours')}`, `${I18n.t('mobile.module.home.chart.tag.overtime')}`,
              `${I18n.t('mobile.module.home.chart.tag.leave')}`, `${I18n.t('mobile.module.home.chart.tag.onbusiness')}`],
              valueTextFontSize: 8,
              valueTextColor: 'white',
              barSpace: 0.6,
            }],
            noDataText: I18n.t('mobile.module.home.chart.hoursdistributiontable'),
            noDataTextDescription: I18n.t('mobile.module.home.chart.nohoursdata'),
            infoTextColor: '#000',
            infoTextFontSize: 17,
            infoDescriptionTextColor: '#999',
            infoDescriptionFontSize: 14,
            descriptionText: I18n.t('mobile.module.home.chart.thisweekhours'),
            descriptionTextColor: '#d7d7d7',
            descriptionTextAlign: 'left',
            descriptionFontSize: 12,
            descriptionTextPosition: {
              x: 10,
              y: 2,
            },
            barType: 'Stacked',
            userInteractionEnabled: false,
            drawValueAboveBar: false,
            backgroundColor: 'transparent',
            labels: weekOrderArray(this.startDay),
            legend: {
              position: 'aboveChartRight',
              textSize: 10,
              textColor: '#bebebe',
              xEntrySpace: 5,
              formSize: 12,
              formToTextSpace: 5,
              xOffset: -16,
            },
            animation: {
              easingOption: 'linear',
              xAxisDuration: 1,
              yAxisDuration: 1,
            },
            xAxis: {
              position: 'bottom',
              textSize: 12,
              textColor: '#cecece',
              drawGridLines: false,
              drawAxisLine: false,
            },
            leftAxis: {
              spaceBottom: 0.05,
              textSize: 14,
              textColor: '#d7d7d7',
              gridColor: '#fdf9e5',
              drawAxisLine: false,
              drawZeroLines: true,
              axisMinimum: 0,
              labelCount: 6,
              zeroLineColor: '#b1f2e6',
            },
            rightAxis: {
              drawGridLines: false,
              enabled: false,
            },
            valueFormatter: {
              type: 'regular',
              numberStyle: 'DecimalStyle',
              maximumDecimalPlaces: 1,
            },
            viewport: {
              left: 36,
              top: 36,
              right: 26,
              bottom: 30,
            },
          },
        });
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
    this.languageChanged.remove();
    clearTimeout(this.popoverTimer);
    ABORT('getEmployeeAttendanceData');
  }

  showHomePopover() {
    const objects = realm.objects('Config').filtered('name = "firstEnterHomePage"');
    if (objects.length == 0) {
      this.popoverTimer = setTimeout(() => this.props.showPopover(0, 190, device.width, 100), 500);
      realm.write(() => {
        realm.create('Config', { name: 'firstEnterHomePage', enable: true });
      });
    }
  }

  handleStartShouldSetPanResponder(e, gestureState) {
    // Should we become active when the user presses down on the circle?
    return true;
  }

  handleMoveShouldSetPanResponder(e, gestureState) {
    // Should we become active when the user moves a touch over the circle?
    return true;
  }

  handlePanResponderGrant(e, gestureState) {
    // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
    // gestureState.{x,y}0 现在会被设置为0
  }

  handlePanResponderMove(e, gestureState) {
    // 最近一次的移动距离为gestureState.move{X,Y}
    // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
  }

  handlePanResponderEnd(e, gestureState) {
    const { config, configandroid } = this.state;
    this.previousLeft += gestureState.dx;
    this.previousTop += gestureState.dy;
    const temp = {};
    for (const k in configandroid) {
      temp[k] = configandroid[k];
    }
    if (Math.abs(gestureState.dx) > 20) {
      if (gestureState.dx > 0) {
        if (device.isAndroid) {
          temp.data = {
            dataSets: [{
              values: this.lastWeek,
              label: '',
              config: {
                colors: [processColor(chart.regularHours), processColor(chart.overtime), processColor(chart.leave), processColor(chart.onBusiness)],
                // 柱子上的文字样式
                valueTextSize: 6,
                valueTextColor: processColor('#FFFFFF'),
                //筛选本地数据0 的显示屏蔽
                valueFormatter: '###,###,###,##0.0',
              }
            }],
            config: {
              barWidth: 0.4,
            }
          };
          temp.chartDescription = {
            text: I18n.t('mobile.module.home.chart.lastweekhours'),
            textColor: '#7f7f7f',
            textSize: 12,
            positionX: -100000000000,
            positionY: 0,
          }
          this.setState({
            configandroid: temp,
          });
        }
        if (device.isIos) {
          config.dataSets[0].values = this.lastWeek;
          config.descriptionText = I18n.t('mobile.module.home.chart.lastweekhours');
          config.labels = weekOrderArray(this.startDay);
          this.setState(config);
        }
      } else {
        if (device.isAndroid) {
          temp.data = {
            dataSets: [{
              values: this.thisWeek,
              label: '',
              config: {
                colors: [processColor(chart.regularHours), processColor(chart.overtime), processColor(chart.leave), processColor(chart.onBusiness)],
                // 柱子上的文字样式
                valueTextSize: 6,
                valueTextColor: processColor('#FFFFFF'),
                //筛选本地数据0 的显示屏蔽
                valueFormatter: '###,###,###,##0.0',
              }
            }],
            config: {
              barWidth: 0.4,
            }
          };
          temp.chartDescription = {
            text: I18n.t('mobile.module.home.chart.thisweekhours'),
            textColor: '#7f7f7f',
            textSize: 12,
            positionX: -10000000000000,
            positionY: 0,
          }
          this.setState({
            configandroid: temp,
          });
        }
        if (device.isIos) {
          config.dataSets[0].values = this.thisWeek;
          config.descriptionText = I18n.t('mobile.module.home.chart.thisweekhours');
          config.labels = weekOrderArray(this.startDay);
          this.setState(config);
        }
      }
    }
  }

  fetchThisWeekData() {
    const { config, configandroid } = this.state;
    const params = {};
    params.flag = 0;
    GET(getEmployeeAttendanceData(params), (responseData) => {
      if (!this.mounted) return;
      this.thisWeek = responseData.hours;
      this.startDay = responseData.startDay;
      configandroid.data.dataSets[0].values = this.thisWeek;
      configandroid.xAxis.valueFormatter = weekOrderArray(this.startDay);
      if (device.isAndroid) {
        this.setState({
          configandroid,
          loaded: true,
        });
      }
      if (device.isIos) {
        config.dataSets[0].values = this.thisWeek;
        config.labels = weekOrderArray(this.startDay);
        this.setState({
          config,
          loaded: true,
        });
      }
    }, (message) => {
      if (!this.mounted) return;
      showMessage(messageType.error, message);
    },
      'getEmployeeAttendanceData');
  }

  fetchLastWeekData() {
    const params = {};
    params.flag = -1;
    GET(getEmployeeAttendanceData(params), (responseData) => {
      this.lastWeek = responseData.hours;
    }, (message) => {
      showMessage(messageType.error, message);
    },
      'getEmployeeAttendanceData');
  }

  // 获取顶部legend布局视图
  getTopLayout = () => {
    if (device.isAndroid) {
      let empty = true;
      const { configandroid } = this.state;
      const values = configandroid.data.dataSets[0].values;
      values.map(item => {
        item.map(v => {
          if (v > 0) {
            empty = false;
          }
        })
      });
      if (!empty) {
        return (
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 13 }}>
              <Text numberOfLines={1} lineBreakMode="tail" style={{ fontSize: 12, color: '#cecece', marginLeft: 10, maxWidth: 110 }}>{configandroid.chartDescription.text}</Text>
              <View style={{ flex: 1 }} />
              <Text style={{ width: 13, height: 13, backgroundColor: '#14BE4B', marginRight: 5 }} />
              <Text numberOfLines={1} lineBreakMode="tail" style={{ fontSize: 10, color: '#999999', maxWidth: 60 }}>{configandroid.stackLabels[0]}</Text>

              <Text style={{ width: 13, height: 13, backgroundColor: '#129CF5', marginLeft: 5, marginRight: 5 }} />
              <Text numberOfLines={1} lineBreakMode="tail" style={{ fontSize: 10, color: '#999999', maxWidth: 60 }}>{configandroid.stackLabels[1]}</Text>

              <Text num style={{ width: 13, height: 13, backgroundColor: '#F9BF13', marginLeft: 5, marginRight: 5 }} />
              <Text numberOfLines={1} lineBreakMode="tail" style={{ fontSize: 10, color: '#999999', maxWidth: 60 }}>{configandroid.stackLabels[2]}</Text>

              <Text style={{ width: 13, height: 13, backgroundColor: '#FF801A', marginLeft: 5, marginRight: 5 }} />
              <Text numberOfLines={1} lineBreakMode="tail" style={{ fontSize: 10, color: '#999999', maxWidth: 60, marginRight: 14 }}>{configandroid.stackLabels[3]}</Text>
            </View>
            <AndroidBarChart
              style={styles.chart}
              config={this.state.configandroid}
            />
          </View>
        );
      }
      return (
        <View style={{ flexDirection: 'column' }}>
          <View style={{ height: 200, marginLeft: 15, marginRight: 15, marginTop: 5, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Image style={{ width: 40, height: 30 }} source={{ uri: 'icon_chart' }} />
            <Text style={{ fontSize: 16, color: 'black' }}>{configandroid.noDataText}</Text>
            <Text style={{ fontSize: 14 }}>{configandroid.noDataTextDescription}</Text>
          </View>
        </View>
      );
    }
  }

  renderChart() {
    const { config, configandroid } = this.state;
    if (device.isAndroid) {
      return (
        <View>
          {this.getTopLayout()}
        </View>
      );
    }
    return <BarChart config={config} style={styles.chart} />;
  }

  render() {
    const { loaded } = this.state;
    if (!loaded) {
      // return <Loading />;
      return (
        <View style={styles.loadingWrapper}>
          <Loading loadingText={I18n.t('mobile.module.home.chart.hoursloading')} loadingIcon={'icon_chart'} />
        </View>
      );
    }
    return (
      <View style={styles.chartWrapper} {...this.panResponder.panHandlers}>
        {this.renderChart()}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  chartWrapper: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 5
  },
  chart: {
    height: 200,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    '@media ios': {
      backgroundColor: 'white',
    },
  },
  loadingWrapper: {
    flex: 1,
    backgroundColor: 'white',
    height: 215,
  },
});