/**
 * 个人绩效图表页面
 */

import React, { PureComponent } from 'react';
import {
  InteractionManager,
  StatusBar,
  View,
  processColor,
  ScrollView,
} from 'react-native';

import Text from '@/common/components/TextField';
import EStyleSheet from 'react-native-extended-stylesheet';
import LineChart from '@/common/components/Chart/LineChart';
import Image from '@/common/components/CustomImage';
import { device } from '@/common/Util';
import { getSelfPerformanceChartData } from '@/common/api';
import I18n from 'react-native-i18n';
import _ from 'lodash';
import { GET, ABORT } from '@/common/Request';
import ActorImageWrapper from '@/common/components/ImageWrapper';
import EmptyView from '@/common/components/EmptyView';
import PeriodTypeHelper from '@/views/SelfPerformance/PeriodTypeHelper';
import Filter from '@/common/components/Filter/Filter';
import FilterModal from '@/common/components/Filter/FilterModal';
import FlatListView from '@/common/components/FlatListView';
import Line from '@/common/components/Line';
import { messageType, appVersion } from '@/common/Consts';
import { showMessage } from '@/common/Message';

// 保存接口返回的原始数据
let rankingData = [];
// 筛选条件的所有数据
let filterData = [];

let firstModalValues = [];
let secondModalValues = [];

const periodTypeHelper = new PeriodTypeHelper();
// 考核期默认值 0
let currentCheckType = "";
// 佣金指标类型默认值 0
let currentQuotaType = "";
/**
 * 表示当前筛选条件的tab哪个被选中
 */
let tabIndex = 0;

const nodata = 'empty';

export default class SelfChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 左边筛选条件默认值
      filterLeftDefaultText: '',
      // 右边筛选条件默认值
      filterRightDefaultText: '',
      // 当前选中的右边筛选条件描述
      currentQuotaDesc: '',
      // 获取图表和排名数据接口是否请求成功
      requestSuccess: false,
      // 图表和排名数据
      chartData: '',
      // 筛选条件为空
      filterEmpty: false,
      legend: {
        enabled: true,
        form: 'NONE',
        textColor: processColor('#FFFFFF'),
      },
      data: {
        dataSets: [{
          values: [],
          label: '',
          config: {
            lineWidth: 2,
            drawCircles: true,
            //设置空心圆的大小
            circleRadius: 4,
            circleHoleRadius: 2,
            circleColor: processColor('#14BE4B'),
            color: processColor('#14BE4B'),
            // 空心圆的颜色
            circleHoleColor: processColor('white'),
            drawCircleHole: true,
            fillAlpha: 60,
            // 设置折线图节点的数据是否显示
            drawValues: false,
            valueTextSize: 15,
            //筛选本地数据0 的显示屏蔽
            valueFormatter: '###,###,###,##0.0',
            drawHighlightIndicators: false,
            drawVerticalHighlightIndicator: false,
            drawHorizontalHighlightIndicator: false,
          }
        },
        ],
      },
      xAxis: {
        valueFormatter: [],
        position: 'BOTTOM',
        labelRotationAngle: 60,
        labelCount: 2,
        labelCountForce: true,
        textSize: 10,
        textColor: processColor('#999999'),
        gridLineWidth: 1,
        gridColor: processColor('#FDFBEF'),
        drawAxisLine: true,
        axisLineWidth: 1,
        axisLineColor: processColor('#14BE4B33'),
      },
      yAxis: {
        left: {
          textSize: 10,
          textColor: processColor('#999999'),
          spaceBottom: 0,
          gridLineWidth: 1,
          gridColor: processColor('#FDFBEF'),
          drawAxisLine: true,
          axisLineWidth: 1,
          axisLineColor: processColor('#14BE4B33'),
          //筛选本地数据0 的显示屏蔽
          valueFormatter: '###,###,###,##0',
          // 设置y轴最小值为0
          axisMinimum: 0,
          granularity: 1,
          granularityEnabled: true,
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
    };
  }

  onSelect = (index, isSelected) => {
    tabIndex = index;
    if (index == 0) {
      this.filterModal.onUpdateDataSource(firstModalValues);
    } else if (index == 1) {
      this.filterModal.onUpdateDataSource(secondModalValues);
    }
    this.filterModal.open();
  }

  selectMenu = (data) => {
    if (tabIndex == 0) {
      filterData.map(item => {
        if (item.value == data.Type) {
          currentCheckType = data.Type;
        }
      });
    } else if (tabIndex == 1) {
      currentQuotaType = data.Type;
      this.setState({
        currentQuotaDesc: data.Description
      });
    }
    this.sendRequestForChartData();
  }

  componentWillMount() {
    this.setFilterData();
  }

  componentDidMount() {
    this.sendRequestForChartData();
  }
  /**
   * 获取图表及排名数据
   */
  sendRequestForChartData() {
    if (_.isEmpty(currentCheckType) || _.isEmpty(currentQuotaType)) return;
    this.setState({
      requestSuccess: false,
    });
    GET(getSelfPerformanceChartData(currentCheckType, currentQuotaType), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        rankingData = [...responseData.ranking];
        let targets = responseData.targets;
        let xTargetsValues = [];
        let yTargetsValues = [];
        let dataSetsTemp = [];

      let targetColor = '#139CF5';
        if (currentQuotaType == 1) {
          targetColor = '#14BE4B';
        }
        targets.map(item => {
          xTargetsValues.push(item.x);
          yTargetsValues.push(item.y);
        });
        dataSetsTemp.push({
          values: yTargetsValues,
          label: '',
          config: {
            lineWidth: 2,
            drawCircles: true,
            //设置空心圆的大小
            circleRadius: 4,
            circleHoleRadius: 2,
            circleColor: processColor(targetColor),
            highlightColor: processColor('#FF7C12'),
            highlightLineWidth: 1,
            color: processColor(targetColor),
            // 空心圆的颜色
            circleHoleColor: processColor('white'),
            drawCircleHole: true,
            fillAlpha: 60,
            // 设置折线图节点的数据是否显示
            drawValues: false,
            valueTextSize: 15,
            //筛选本地数据0 的显示屏蔽
            valueFormatter: '###,###,###,##0.0',
            drawHighlightIndicators: false,
            drawVerticalHighlightIndicator: false,
            drawHorizontalHighlightIndicator: false,
          }
        });

        let xCompletedsValues = [];
        let yCompletedsValues = [];
        let completeds = responseData.completeds;
        if (currentQuotaType != 1 && completeds) {
          completeds.map(item => {
            xCompletedsValues.push(item.x);
            yCompletedsValues.push(item.y);
          });
          dataSetsTemp.push({
            values: yCompletedsValues,
            label: 'X',
            config: {
              lineWidth: 2,
              drawCircles: true,
              //设置空心圆的大小
              circleRadius: 4,
              circleHoleRadius: 2,
              circleColor: processColor('#14BE4B'),
              highlightColor: processColor('#FF7C12'),
              highlightLineWidth: 1,
              color: processColor('#14BE4B'),
              // 空心圆的颜色
              circleHoleColor: processColor('white'),
              drawCircleHole: true,
              fillAlpha: 60,
              // 设置折线图节点的数据是否显示
              drawValues: false,
              valueTextSize: 15,
              //筛选本地数据0 的显示屏蔽
              valueFormatter: '###,###,###,##0.0',
              drawHighlightIndicators: false,
              drawVerticalHighlightIndicator: false,
              drawHorizontalHighlightIndicator: false,
            }
          });
        }

        this.setState({
          requestSuccess: true,
          chartData: responseData,
          data: {
            dataSets: dataSetsTemp,
          },
          xAxis: {
            valueFormatter: xTargetsValues,
            position: 'BOTTOM',
            labelRotationAngle: (xTargetsValues.length > 4) ? 60 : 0,
            labelCount: xTargetsValues.length,
            labelCountForce: (xTargetsValues.length == 1) ? false : true,
            textSize: 10,
            textColor: processColor('#999999'),
            gridLineWidth: 1,
            gridColor: processColor('#FDFBEF'),
            drawAxisLine: true,
            axisLineWidth: 1,
            axisLineColor: processColor('#14BE4B33'),
            avoidFirstLastClipping: true,
          }
        });
        if (this.flatlist) {
          // 当前用户有排名 但是不在前十名
          if (rankingData.length > 10) {
            let temp = [...responseData.ranking];
            temp = temp.slice(0, 10);
            this.flatlist.notifyList(temp, temp.length, true);
          } else
            this.flatlist.notifyList(responseData.ranking, responseData.ranking.length, true);
        }
      });
    }, (err) => {
      showMessage(messageType.error, err);
      this.setState({
        chartData: '',
        requestSuccess: true,
      });
    }, 'getSelfPerformanceChartData');
  }

  getFilterView = () => {
    // 筛选条件为空
    if (this.state.filterEmpty) {
      return (
        <EmptyView
          style={{ backgroundColor: 'white' }}
          emptyimg={nodata}
          enabled={false}
          emptyTitle={I18n.t('mobile.module.achievements.null')}
          emptyContent={'这里将展示个人绩效完成信息'}
          content={''} />
      )
    } else {
      return (
        <Filter
          ref={item => this.filter = item}
          dataSources={[
            {
              id: '0',
              title: this.state.filterLeftDefaultText,
              selected: false,
            },
            {
              id: '1',
              title: this.state.filterRightDefaultText,
              selected: false,
            }
          ]}
          onSelect={this.onSelect} />
      );
    }
  }

  getMyViews = () => {
    let rowData = null;
    let index = 0;
    rankingData.map(item => {
      index = index + 1;
      if (global.loginResponseData.PersonID == item.EmployeeId) {
        rowData = item;
      }
    })
    if (rowData) {
      let percentStr = rowData.percent;
      if (currentQuotaType == 1) percentStr = `${rowData.percent}`;
      else percentStr = `${rowData.percent * 100}%`;
      return (
        <View style={{ flexDirection: 'column', marginTop: 10, backgroundColor: '#F4F4F4' }}>
          <Line />
          <View style={{ flexDirection: 'row', alignItems: 'center', height: 70, paddingLeft: 18, paddingRight: 18, paddingTop: 10, paddingBottom: 10 }}>
            <Text numberOfLines={1} style={{ width: 34, textAlign: 'center', fontSize: 28, color: '#333333' }}>{`${rowData.orderIndex}`}</Text>
            <ActorImageWrapper style={{ width: 50, height: 50, marginLeft: 10, alignSelf: 'center', borderRadius: 25, }} actor={rowData.headUrl} EmpID={rowData.EmployeeId} EmpName={rowData.name} EnglishName={rowData.name} />
            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
              <Text style={{ fontSize: 14, color: '#333333' }}>{rowData.name}</Text>
              <Text style={{ fontSize: 18, color: '#333333' }}>{percentStr}</Text>
            </View>
          </View>
          <Line />
        </View>
      );
    }
    return (
      <View style={{ flexDirection: 'column', marginTop: 10, backgroundColor: '#F4F4F4' }}>
        <Line />
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 70, paddingLeft: 18, paddingRight: 18, paddingTop: 10, paddingBottom: 10 }}>
          <Text numberOfLines={1} style={{ width: 34, textAlign: 'center', fontSize: 28, color: '#333333' }}>-</Text>
          <ActorImageWrapper style={{ width: 50, height: 50, marginLeft: 10, alignSelf: 'center', borderRadius: 25, }}
            actor={global.loginResponseData.HeadImgUrl} EmpID={global.loginResponseData.EmpID} EmpName={global.loginResponseData.EmpName} EnglishName={global.loginResponseData.EmpName} />
          <View style={{ flexDirection: 'column', marginLeft: 10 }}>
            <Text style={{ fontSize: 14, color: '#333333' }}>{global.loginResponseData.EmpName}</Text>
            <Text style={{ fontSize: 18, color: '#333333' }}>-</Text>
          </View>
        </View>
        <Line />
      </View>
    );
  }

  getContentView = () => {
    const { data, xAxis, yAxis, legend, chartDescription, drawGridBackground,
      gridBackgroundColor, noDataText, marker, requestSuccess, chartData } = this.state;

    if (!this.state.filterEmpty && requestSuccess) {
      if (chartData == '') {
        return (
          <EmptyView
            style={{ backgroundColor: 'white' }}
            emptyimg={nodata}
            enabled={false}
            emptyTitle={I18n.t('mobile.module.achievements.null')}
            emptyContent={'这里将展示个人绩效完成信息'}
            content={''} />
        );
      }
      if (chartData) {
        if (chartData.targets && chartData.targets.length == 0
          && chartData.completeds && chartData.completeds.length == 0
          && chartData.ranking && chartData.ranking.length == 0) {
          return (
            <EmptyView
              style={{ backgroundColor: 'white' }}
              emptyimg={nodata}
              enabled={false}
              emptyTitle={I18n.t('mobile.module.achievements.null')}
              emptyContent={'这里将展示个人绩效完成信息'}
              content={''} />
          );
        }
      }
      return (
        <ScrollView
          style={{ flex: 1 }}
          bounces={false}
          showsVerticalScrollIndicator={false}>
          <View style={styles.chart}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
              <View style={{ flex: 1 }} />
              {
                (currentQuotaType == 1) ?
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                    <Image style={{ width: 26, height: 12, marginTop: 3 }} source={{ uri: "chart_legend_completed_icon" }} />
                    <Text style={{ color: '#999999', fontSize: 10 }}>佣金完成值</Text>
                  </View> :
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginRight: 10 }}>
                    <Image style={{ width: 26, height: 12, marginTop: 3 }} source={{ uri: "chart_legend_completed_icon" }} />
                    <Text style={{ color: '#999999', fontSize: 10 }}>{`${this.state.currentQuotaDesc}完成值`}</Text>
                    <Image style={{ width: 26, height: 12, marginTop: 3, marginLeft: 24 }} source={{ uri: "chart_legend_target_icon" }} />
                    <Text style={{ color: '#999999', fontSize: 10 }}>{`${this.state.currentQuotaDesc}目标值`}</Text>
                  </View>
              }
            </View>
            <LineChart
              style={styles.chartstyle}
              data={data}
              xAxis={xAxis}
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
            />
          </View>
          {this.getMyViews()}
          <View style={{ flex: 1, backgroundColor: 'white' }}>
            <FlatListView
              needPage={false}
              ref={(ref) => this.flatlist = ref}
              inflatItemView={this.inflateItem}
              disableRefresh={true}
              disableEmptyView={true}
            />
          </View>
        </ScrollView>
      );

    } else {
      return null;
    }


  }

  /**
   * 设置筛选条件数据
   */
  setFilterData() {
    let responseData = periodTypeHelper.getFilterResult();
    if (responseData && responseData.length == 0) {
      this.setState({
        filterEmpty: true,
      });
      return;
    }
    filterData = responseData;
    if (filterData) {
      let index = 0;
      firstModalValues = [];
      filterData.map(item => {
        let temp = {};
        temp.Description = item.label;
        temp.Type = item.value;
        if (index == 0)
          temp.selected = true;
        else
          temp.selected = false;
        firstModalValues.push(temp);
        index = index + 1;
      });
      secondModalValues = [];
      let secondIndex = 0;
      if (filterData.length <= 0) return;
      filterData[0].quotalists.map(item => {
        let temp = {};
        temp.Description = item.label;
        temp.Type = item.value;
        if (secondIndex == 0)
          temp.selected = true;
        else
          temp.selected = false;
        secondModalValues.push(temp);
        secondIndex = secondIndex + 1;
      });
      this.setState({
        filterLeftDefaultText: firstModalValues.length > 0 ? firstModalValues[0].Description : '',
        filterRightDefaultText: secondModalValues.length > 0 ? secondModalValues[0].Description : ''
      });
      currentCheckType = firstModalValues[0].Type;
      currentQuotaType = secondModalValues[0].Type;
    }
  }
  // 获取左边的排名和奖牌布局
  getLeftMedalViews = (index) => {
    if (index == 1) {
      return (
        <Image style={{ width: 34, height: 34 }} source={{ uri: "goldmedal" }} />
      );
    } else if (index == 2) {
      return (
        <Image style={{ width: 34, height: 34 }} source={{ uri: "silvermedal" }} />
      );
    } else if (index == 3) {
      return (
        <Image style={{ width: 34, height: 34 }} source={{ uri: "bronzemedal" }} />
      );
    }
    return (
      <Text numberOfLines={1} style={{ width: 34, textAlign: 'center', fontSize: 28, color: '#333333' }}>{index}</Text>
    );
  }

  inflateItem = (rowData, index) => {
    let percentStr = rowData.percent;
    if (currentQuotaType == 1) percentStr = `${rowData.percent}`;
    else percentStr = `${Math.ceil(rowData.percent * 100)}%`;
    return (
      <View style={{ flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 70, paddingLeft: 18, paddingRight: 18, paddingTop: 10, paddingBottom: 10 }}>
          {this.getLeftMedalViews(rowData.orderIndex)}
          <ActorImageWrapper style={{ width: 50, height: 50, marginLeft: 10, alignSelf: 'center', borderRadius: 25, }} actor={rowData.headUrl} EmpID={rowData.EmployeeId} EmpName={rowData.name} EnglishName={rowData.name} />
          <View style={{ flexDirection: 'column', marginLeft: 10 }}>
            <Text style={{ fontSize: 14, color: '#333333' }}>{rowData.name}</Text>
            <Text style={{ fontSize: 18, color: '#333333' }}>{percentStr}</Text>
          </View>
        </View>
        <Line />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.getFilterView()}
        {this.getContentView()}

        <FilterModal
          topParams={45}
          ref={modal => this.filterModal = modal}
          dataSources={firstModalValues}
          selectMenu={this.selectMenu} />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
  },
  chart: {
    marginTop: 10,
    width: device.width,
    height: 305,
    backgroundColor: 'white',
  },

  chartstyle: {
    marginLeft: 10,
    marginRight: 15,
    '@media ios': {
      marginTop: -10,
    },
    height: 290,
  },
});