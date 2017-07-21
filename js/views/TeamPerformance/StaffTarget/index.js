/**
 * 组织指标
 */

import React from 'react';
import {
  processColor,
  ScrollView,
  Text,
  View,
  DeviceEventEmitter,
  NativeModules,
  StatusBar,
  AppState,
 } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import Line from '@/common/components/Line';
import BarChart from '@/views/TeamPerformance/BarChart';
import { device } from '@/common/Util';
import Image from '@/common/components/CustomImage';
import { getTeamAndPointerType, getPersonalTarget } from '@/common/api';
import { GET, ABORT, POST } from '@/common/Request';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import TouchableHighlight from '@/common/components/CustomTouchableHighlight';
import PeriodTypeHelper from '@/views/SelfPerformance/PeriodTypeHelper';
import Filter from '@/common/components/Filter/Filter';
import EmptyView from '@/common/components/EmptyView';
import { LoadingManager } from '@/common/Loading';

import { filterModalDataFormat, filterModalDataFormatTeam } from '../Helpers/filterModalDataHelper';
import { DEVICE_ORIENTATION_CHANDED, NATIVE_DEVICE_DID_CHANGE_LISTENER } from '../constant';

const landscape = 'portrait';
const portrait = 'landscape';
const imageBlue = 'chart_bar_blue';
const imageGreen = 'chart_bar_green';
const nodata = 'empty';
let isLandscape = false;

const { RNManager } = NativeModules;
const periodTypeHelper = new PeriodTypeHelper();

export default class StaffTarget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orientationImage: portrait,
      pointerType: '',
      showFilter: false,
      showChart: false,

      chartCompletedData: [],
      chartTargetData: [],
      chartXValues: [],
    };

    this.filterDataSource = [
      { id: '0', title: '组织', selected: false },
      { id: '1', title: '指标详情', selected: false },
      { id: '2', title: '考核期', selected: false },];
    this.filterModalDataSourceTeam;     // 人员指标组织类型（modal）
    this.filterModalDataSourcePointer;  // 人员指标指标类型（modal）
    this.filterModalDataSourcePeriod;   // 人员指标考核期（modal）
    this.teamAndPointerData;  // 组织类型以及指标类型
    this.periodType;
    this.personalTargetData;  // 图表数据具体值
    this.appState = AppState.currentState;
    this.couldAutorotate = false;
  }

  componentWillMount() {
    // 开始获取 考核期类型、请求接口
    this.periodType = [];
    this.periodType = periodTypeHelper.getPeriodTypes();
    if(this.periodType.length != 0) {
      this.filterModalDataSourcePeriod = filterModalDataFormatTeam(this.periodType);
      this.getTeamAndPointerTypeRequest();
    }
  }

  componentDidMount() {
    this.nativeDeviceOrientationListener = DeviceEventEmitter.addListener(NATIVE_DEVICE_DID_CHANGE_LISTENER, (data) => {
      if (!this.couldAutorotate) { return; }
      let deviceOrientation;
      if (device.isIos) {
        deviceOrientation = data.orientation;
      } else {
        const tempData = JSON.parse(data);
        if (tempData) {
          deviceOrientation = tempData.orientation;
        }
      }
      if (deviceOrientation === 'landscape') {
        // 横屏
        isLandscape = true;
        this.setState({
          orientationImage: landscape,
        });
        StatusBar.setHidden(true);
      } else {
        // 竖屏
        isLandscape = false;
        this.setState({
          orientationImage: portrait,
        });
        StatusBar.setHidden(false);
      }
      DeviceEventEmitter.emit(DEVICE_ORIENTATION_CHANDED, isLandscape);
    });
  }

  componentWillUnmount() {
    LoadingManager.stop();
    isLandscape = false;
    this.couldAutorotate = false;
    RNManager.disableAutorotate();
    this.nativeDeviceOrientationListener.remove();
    ABORT('AbortGetPersonalTarget');
    ABORT('abortGetTeamAndPointerType');
  }

  getTeamAndPointerTypeRequest() {
    // 获取人员指标 组织列表、指标类型的数据
    LoadingManager.start();
    GET(getTeamAndPointerType(1),(responseData) => {
      if (responseData.teamType.length == 0 || responseData.pointerType.legend == 0) return;
        this.teamAndPointerData = responseData;
        this.filterModalDataSourceTeam = filterModalDataFormatTeam(responseData.teamType);
        this.filterModalDataSourcePointer = filterModalDataFormatTeam(responseData.pointerType, true);
        this.updateFilterModal();
        if (responseData.pointerType.length != 0) {
          this.setState({
            pointerType: responseData.pointerType[0].IndicatorName,
          });
        }
      },(err) => {
        showMessage(messageType.error, err);
      },
      'abortGetTeamAndPointerType'
    );
  }

  getPersonalTargetRequest(orgId, periodType) {
    // 获取人员指标 图表的具体数据
    if (this.periodType.length == 0 || !this.teamAndPointerData) {
      return;
    }
    LoadingManager.start();
    this.personalTargetData = [];
    GET(getPersonalTarget(orgId, periodType), (responseData) => {
      LoadingManager.done();
      this.checkPersonalBarChartData(responseData);
    }, (err) => {
      LoadingManager.done();
      showMessage(messageType.error, err);
    }, 'AbortGetPersonalTarget');
  }

  checkPersonalBarChartData(data) {
    // 整理图表的数据源
    const arrPointerType = this.teamAndPointerData.pointerType;
    const barChartDataArr = [];
    if (data.length != 0) {
      const k = data.length;
      const h = arrPointerType.length;
      for (let j = 0; j < h; j++) {
        const temp = [];
        for (let m = 0; m < k; m++) {
          if (data[m].IndicatorName == arrPointerType[j].IndicatorName) {
            temp.push(data[m]);
          }
        }
        barChartDataArr.push(temp);
      }
      this.personalTargetData = barChartDataArr;

      const pointerSelectedIndex = this.filterModalDataSourcePointer.indexOf(this.filterModalDataSourcePointer.find(item => item.selected));
      this.updateBarChart(barChartDataArr[pointerSelectedIndex]);
      this.setState({
        showChart: barChartDataArr[pointerSelectedIndex].length != 0 ? true : false,
      });
    } else {
      this.updateBarChart([]);
      this.setState({
        showChart: false,
      });
    }
  }

  onPressOrientaionImage() {
    // 图表翻转
    const { orientationImage } = this.state;
    if (orientationImage == landscape) {
      // 切换至竖屏
      RNManager.rotateScreenPortrait();
    } else {
      // 切换至横屏
      RNManager.rotateScreenLandscape();
    }
  }

  updateFilterModal() {
    // 更新 filter modal 数据源
    this.filterDataSource[0].title = this.filterModalDataSourceTeam[0].Description;
    this.filterDataSource[1].title = this.filterModalDataSourcePointer[0].Description;
    this.filterDataSource[2].title = this.filterModalDataSourcePeriod.length != 0 ? this.filterModalDataSourcePeriod[0].Description : 'null';
    if (this.teamAndPointerData && this.periodType && this.periodType.length != 0) {
      this.orgId = this.teamAndPointerData.teamType[0].value;
      this.periodId = this.periodType[0].value;
      this.getPersonalTargetRequest(this.orgId, this.periodId);
    }
    this.setState({
      showFilter: this.filterModalDataSourcePeriod.length != 0 ? true : false,
    });
  }

  updateBarChart(dataArr) {
    // 刷新图表 数据
    if (dataArr && dataArr.length != 0) {
      this.couldAutorotate = true;
      RNManager.supportAutorotate();
      const k = dataArr.length;
      let completeData = [];
      let targetData = [];
      let xValues = [];
      for (let i = 0; i < k; i++) {
        const temp = dataArr[i];
        let itemC = {};
        let itemT = {};
        itemC.y = parseInt(temp.CompleteValue);
        completeData.push(itemC);
        itemT.y = parseInt(temp.Target);
        targetData.push(itemT);
        xValues.push(temp.EmployeeName);
      }
      this.setState({
        showChart: true,
        chartCompletedData: completeData,
        chartTargetData: targetData,
        chartXValues: xValues,
      });
    } else {
      this.couldAutorotate = false;
      RNManager.disableAutorotate();
      this.setState({
        showChart: false,
        chartCompletedData: [],
        chartTargetData: [],
        chartXValues: [],
      });
    }
  }

  updateBarChartRequest(item) {
    // 重新请求图表数据 以及本地切换指标类型
    ABORT('AbortGetPersonalTarget');
    switch(this.filterIndex) {
      case 0:
          const itemIndex = this.filterModalDataSourceTeam.indexOf(item);
          this.orgId = this.teamAndPointerData.teamType[itemIndex].value;
          this.getPersonalTargetRequest(this.orgId, this.periodId);
          break;
      
      case 1:
          const tempIndex = this.filterModalDataSourcePointer.indexOf(item);
          if (this.personalTargetData) {
            this.setState({
              pointerType: item.Description,
            });
            this.updateBarChart(this.personalTargetData[tempIndex]);
          }
          break;
      
      case 2:
          const index = this.filterModalDataSourcePeriod.indexOf(item);
          this.periodId = this.periodType[index].value;
          this.getPersonalTargetRequest(this.orgId, this.periodId);
          break;
      
      default:
          break;
    }
    
  }

  onSelect(index) {
    // 记录filter 的下标
    const { openModal, updateModalData } = this.props;
    let temp;
    switch(index) {
      case 0:
          temp = this.filterModalDataSourceTeam;
          this.filterIndex = 0;
          break;
      
      case 1:
          temp = this.filterModalDataSourcePointer;
          this.filterIndex = 1;
          break;
      
      case 2:
          temp = this.filterModalDataSourcePeriod;
          this.filterIndex = 2;
          break;
      
      default:
          break;
    }
    if (openModal) {
      updateModalData(temp);
      openModal(); 
    }
  }

  renderFilter() {
    const { orientationImage, showChart } = this.state;
    if (orientationImage == landscape) {
      return null;
    }

    return (
      <View>
        <Filter
          ref={filter => this.filter = filter}
          dataSources={this.filterDataSource}
          onSelect={(index) => this.onSelect(index)} />
        {showChart ? <View style={{ width:device.width, height: 10, backgroundColor: 'transparent' }} /> : null }
        { showChart ? <Line /> : null }
      </View>
    );
  }

  renderDesc() {
    const { orientationImage, pointerType } = this.state;
    if (orientationImage == landscape) {
      return (
        <View style={styles.barDescLandscape}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.titleLandscape}>人员指标走势图</Text>
            <View style={{ flex: 1 }} />
            <TouchableHighlight onPress={() => this.onPressOrientaionImage()} style={styles.pressStyleLandScape}>
              <View>
                <Image style={styles.changeImageLandscape} source={{ uri: orientationImage }} />
              </View>
            </TouchableHighlight>
          </View>

          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <Image style={[styles.imageBlueLandscape, { marginLeft: 24 }]} source={{ uri: imageGreen }} />
            <Text style={[styles.textDetailLandscape, { marginLeft: 10 }]}>{pointerType}完成值</Text>
            <Image style={[styles.imageBlueLandscape, { marginLeft: 20 }]} source={{ uri: imageBlue }} />
            <Text style={[styles.textDetailLandscape, { marginLeft: 10 }]}>{pointerType}目标值</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.barDesc}>
        <View style={styles.container} />
        <Image style={styles.imageBlue} source={{ uri: imageGreen }} />
        <Text style={[styles.textDetail, { marginRight: 16 }]}>{pointerType}完成值</Text>
        <Image style={styles.imageBlue} source={{ uri: imageBlue }} />
        <Text style={styles.textDetail}>{pointerType}目标值</Text>
        <TouchableHighlight onPress={() => this.onPressOrientaionImage()} style={styles.pressStyle}>
          <View>
            <Image style={styles.changeStand} source={{ uri: orientationImage }} />
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    const { data, xAxis, yAxis, legend, chartDescription, drawGridBackground, gridBackgroundColor,
            chartCompletedData, chartTargetData, chartXValues, showFilter, showChart, orientationImage } = this.state;
    const height = orientationImage == landscape ? device.width - 100 : 320;
    const barChartstyle = orientationImage == landscape ? styles.container : styles.viewInner;
    const scrollViewBg = orientationImage == landscape ? '#FFF' : 'transparent';
    return (
      <View style={{ flex: 1 }}>
        { showFilter ? this.renderFilter() : 
        <View style={{ width:device.width, height: 1, backgroundColor: 'transparent' }} /> }

        { showChart && showFilter ?
          <ScrollView style={[styles.container, { backgroundColor: scrollViewBg }]} bounces={false}>
            <View style={barChartstyle}>
              {this.renderDesc()}
              <BarChart
                style={{ height: height }}
                navigator={navigator}
                isOrientation={isLandscape}
                chartCompletedData={chartCompletedData}
                chartTargetData={chartTargetData}
                chartXValues={chartXValues} />
            </View>
          </ScrollView> : <EmptyView
          style={{ backgroundColor: 'white' }}
          onRefreshing={() => this.getPersonalTargetRequest(this.orgId, this.periodId)}
          emptyimg={nodata}
          emptyTitle="暂无数据"
          emptyContent="这里将展示人员指标完成信息" />}
        
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  viewInner: {
    backgroundColor: '#FFF',
    width: device.width,
    height: 472,
  },

  barDesc: {
    height: 40,
    marginBottom: 80,
    width: device.width,
    flexDirection: 'row',
  },
  barDescLandscape: {
    marginTop: 25,
    marginBottom: 20,
  },
  titleLandscape: {
    fontSize: 18,
    color: '$color.mainBodyTextColor',
    marginLeft: 24,
  },
  pressStyleLandScape: {
    marginRight: 25,
  },
  changeImageLandscape: {
    height: 29,
    width: 29,
  },
  imageBlueLandscape: {
    height: 20,
    width: 32,
  },
  textDetailLandscape: {
    fontSize: 10,
    color: '#999999',
  },

  imageBlue: {
    marginTop: 24,
    marginRight: 6,
    width: 32,
    height: 20,
  },
  textDetail: {
    marginRight: 20,
    marginTop: 27,
    fontSize: 10,
    color: '#999999',
  },
  changeStand: {
    width: 22,
    height: 22,
  },
  pressStyle: {
    marginRight: 12,
    marginTop: 15,
    width: 22,
    height: 22,
  },
});