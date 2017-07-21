/**
 * 店铺列表
 */

import { InteractionManager, ListView, View, NativeModules } from 'react-native';
import Text from '@/common/components/TextField';
import { device } from '@/common/Util';
import React, { PureComponent } from 'react';
import { GET, ABORT } from '@/common/Request';
import NavBar from '../SchedulePreViewStandard/NavbarSegment';
import EStyleSheet from 'react-native-extended-stylesheet';
import { getPreviewShopDetail } from '@/common/api';
import { getYYYYMMDDFormat, getHHmmFormat } from '@/common/Functions';
import { showMessage } from '@/common/Message';
import Line from '@/common/components/Line';
import moment from 'moment';
import { messageType } from '@/common/Consts';
import _ from 'lodash';
import I18n from 'react-native-i18n';
import EmptyView from '@/common/components/EmptyView';
import Constance from './Constance';
import TabContent from './PreviewTabContent';
import DayList from './PreviewDayList';
import MonthList from './PreviewMonthList';
import WeekList from './PreviewWeekList';

const { RNManager } = NativeModules;

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
  },
  arrimgStyle: {
    width: 22,
    height: 22,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginRight: 12,
  },
});

let currentIndex = 0;

// 保存接口返回的原始数据
let listData = [];
const users = new Set();
const dates = new Set();
const fromtimes = new Set();

let dataBlobMonth = {};
let sectionIDsMonth = [];
let rowIDsMonth = [];

let dataBlobWeek = {};
let sectionIDsWeek = [];
let rowIDsWeek = [];

let dataBlobDay = {};
let daydates = [];

const nodata = 'empty_schedule';

let currentYearMonth = moment().format('YYYY-MM');

export default class ShopItemDetail extends PureComponent {
  constructor(...args) {
    super(...args);
    const getsectionData = (dataBlob, sectionID) => {
      let weekText = ' ';
      let dataStr = dataBlob[sectionID];
      if (currentIndex == 1) {
        weekText = `星期${Constance.getWeekText(dataStr)}`;
        dataStr = getYYYYMMDDFormat(dataStr);
      } else if (currentIndex == 2) {
        dataStr = getHHmmFormat(dataStr);
      }
      return `${dataStr} ${weekText}`;
    };

    const getrowData = (dataBlob, sectionID, rowID) => {
      return dataBlob[`${sectionID}:${rowID}`];
    };
    this.list = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      empty: false,
      showHorizonListViewIndex: 0,
      dataSource: new ListView.DataSource({
        getSectionHeaderData: getsectionData,
        getRowData: getrowData,
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      }),
    };
  }

  componentWillMount() {
    RNManager.showLoading('');
    this.sendRequest();
  }

  componentWillUnmount() {
    this.resetData();
    currentYearMonth = moment().format('YYYY-MM');
  }

  getSectionListViews(sections, viewType) {
    const resultMap = new Map();
    for (const secItem of sections) {
      const secValues = [];
      if (viewType == 'D') {
        daydates.map(item => {
          if (item.ShiftTimeFrom == secItem) {
            secValues.push(item);
          }
        });
      } else {
        listData.map(item => {
          if (viewType == 'M') {
            if (item.EmpName == secItem) {
              secValues.push(item);
            }
          } else if (viewType == 'W') {
            if (item.ShiftDate == secItem) {
              secValues.push(item);
            }
          }
        });
      }
      // 设置姓名 --》排班 map
      resultMap.set(secItem, secValues);
    }
    const dataBlob = {};
    const sectionIDs = [];
    const rowIDs = [];
    let values = [];
    let i = 0;
    for (const key of resultMap.keys()) {
      sectionIDs.push(i);
      const temp = resultMap.get(key);
      if (temp && temp.length > 0) {
        if (viewType == 'M') {
          dataBlob[i] = temp[0].EmpName;
        } else if (viewType == 'W') {
          dataBlob[i] = temp[0].ShiftDate;
        } else {
          dataBlob[i] = temp[0].ShiftTimeFrom;
        }
        console.log('dataBlob[' + i + ']' + dataBlob[i]);
        values = resultMap.get(key);
        rowIDs[i] = [];
        for (const j in values) {
          rowIDs[i].push(j);
          dataBlob[i + ':' + j] = values[j];
        }
      }
      i = i + 1;
    }
    if (_.isEmpty(dataBlob) || dataBlob.length == 0) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
        empty: true,
        showHorizonListViewIndex: currentIndex,
      });
    } else {
      // 更新状态
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
        empty: false,
        showHorizonListViewIndex: currentIndex,
      });
    }
    if (currentIndex == 0) {
      for (const k in dataBlob) {
        dataBlobMonth[k] = dataBlob[k];
      }
      sectionIDsMonth = [...sectionIDs];
      rowIDsMonth = [...rowIDs];
      sectionIDsDay = [...sectionIDs];
      rowIDsDay = [...rowIDs];
    } else if (currentIndex == 1) {
      for (const k in dataBlob) {
        dataBlobWeek[k] = dataBlob[k];
      }
      sectionIDsWeek = [...sectionIDs];
      rowIDsWeek = [...rowIDs];
    } else {
      for (const k in dataBlob) {
        dataBlobDay[k] = dataBlob[k];
      }
    }
  }

  getHorizonListView() {
    switch (this.state.showHorizonListViewIndex) {
      case 0:
        return <MonthList yearMonth={currentYearMonth} pressMonthCallback={this.pressMonthCallback} />;
      case 1:
        return <WeekList yearMonth={currentYearMonth} pressWeekCallback={this.pressWeekCallback} />;
      case 2:
        return <DayList yearMonth={currentYearMonth} pressCallback={this.pressDayCallback} />;
      default:
    }
  }
  // 重置
  resetData() {
    listData = [];
    users.clear();
    dates.clear();
    fromtimes.clear();
    dataBlobMonth = {};
    sectionIDsMonth = [];
    rowIDsMonth = [];

    dataBlobWeek = {};
    sectionIDsWeek = [];
    rowIDsWeek = [];

    dataBlobDay = {};
    sectionIDsDay = [];
    rowIDsDay = [];
    currentIndex = 0;
    ABORT('getShoplists');
  }

  inflateItem(rowData, sectionID, rowID, highlightRow) {
    let firstView = null;
    if (currentIndex == 0) {
      firstView = <Text style={{ color: '#333', fontSize: 14, textAlign: 'center' }}>{getYYYYMMDDFormat(rowData.ShiftDate)}</Text>;
    } else {
      firstView = <Text style={{ color: '#333', fontSize: 14, textAlign: 'center' }}>{rowData.EmpName}</Text>;
    }

    return (
      <View style={{ overflow: 'hidden' }} key={`${sectionID}-${rowID}`}>
        <View style={{ flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 11, paddingLeft: 16 }}>
          <Text numberOfLines={1} style={{ color: '#333', fontSize: 14, textAlign: 'left' }}>{firstView}</Text>
          <Text numberOfLines={1} style={{ flex: 1, color: '#333', fontSize: 14, textAlign: 'center' }}>{rowData.ShiftType}</Text>
          <Text numberOfLines={1} style={{ flex: 1, color: '#333', fontSize: 14, textAlign: 'center' }}>{getHHmmFormat(rowData.ShiftTimeFrom)}-{getHHmmFormat(rowData.ShiftTimeTo)}</Text>
          <Text numberOfLines={1} style={{ color: '#333', fontSize: 14, textAlign: 'center', marginHorizontal: 16 }}>{`${rowData.ShiftHours}`}H</Text>
        </View>
        <Line />
      </View>
    );
  }

  sendRequest() {
    const details = this.props.passProps.data;
    const params = {};
    params.unitId = details.UnitId;
    params.yearMonth = currentYearMonth;
    GET(getPreviewShopDetail(params), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        RNManager.hideLoading();
        if (_.isEmpty(responseData || responseData.length == 0)) {
          this.setState({
            empty: true,
          });
          return;
        }
        listData = [...responseData];
        listData.map(item => {
          users.add(item.EmpName);
          dates.add(item.ShiftDate);
          fromtimes.add(item.ShiftTimeFrom);
        });
        this.getSectionListViews(users, 'M');
      });
    }, (err) => {
      RNManager.hideLoading();
      showMessage(messageType.error, err);
    }, 'getShopDetail');
  }

  tabSelectedCallback = (index) => {
    if (index == currentIndex) return;
    RNManager.showLoading('');
    if (device.isAndroid && this.listView) this.listView.scrollTo({ y: 0 });
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections({}, [], []),
      empty: false,
      showDayHorizonList: index,
    });
    currentIndex = index;
    window.setTimeout(
      () => {
        if (index == 0) {
          this.getSectionListViews(users, 'M');
        } else if (index == 1) {
          const start = `${currentYearMonth}-01`;
          let end = '';
          for (let i = 0; i < 10; i++) {
            const itemMoment = moment(start).add(i, 'day');
            if (i == 0 && itemMoment.day() == 1) {
              // 一号就是星期一
              end = itemMoment.add(6, 'day').format('YYYY-MM-DD');
              break;
            }
            if (i != 0 && itemMoment.day() == 1) {
              // 一号不是星期一
              end = itemMoment.subtract(1, 'day').format('YYYY-MM-DD');
              break;
            }
          }
          this.showSchedulesForWeek(start, end);
        } else {
          this.showSchedulesForDay(moment(`${currentYearMonth}-01`).format('YYYY-MM-DD'));
        }
        window.setTimeout(() => {
          RNManager.hideLoading();
        }, 500);
      },
      500,
    );
  }
  popCallback = () => {
    this.props.navigator.pop();
  }

  pressDayCallback = (selectedDay) => {
    RNManager.showLoading('');
    if (device.isAndroid && this.listView) this.listView.scrollTo({ y: 0 });
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections({}, [], []),
      empty: false,
    });
    this.showSchedulesForDay(selectedDay);
    window.setTimeout(() => {
      RNManager.hideLoading();
    }, 500);
  }

  pressWeekCallback = (weekData) => {
    RNManager.showLoading('');
    if (device.isAndroid && this.listView) this.listView.scrollTo({ y: 0 });
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections({}, [], []),
      empty: false,
    });
    this.showSchedulesForWeek(weekData.start, weekData.end);
    window.setTimeout(() => {
      RNManager.hideLoading();
    }, 500);
  }

  pressMonthCallback = (selectedMonth) => {
    RNManager.showLoading('');
    const tempYearMonth = moment(selectedMonth).format('YYYY-MM');
    if (tempYearMonth === currentYearMonth) return;
    this.resetData();
    if (device.isAndroid && this.listView) this.listView.scrollTo({ y: 0 });
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections({}, [], []),
      empty: false,
    });
    currentYearMonth = moment(selectedMonth).format('YYYY-MM');
    this.sendRequest();
  }

  // 显示对应日期的天视图
  showSchedulesForDay = (selectedDay) => {
    daydates = [];
    listData.map(item => {
      if (item.ShiftDate == selectedDay) {
        daydates.push(item);
      }
    });
    fromtimes.clear();
    daydates.map(item => {
      fromtimes.add(item.ShiftTimeFrom);
    });
    this.getSectionListViews(fromtimes, 'D');
  }
  // 显示对应一周的周视图
  showSchedulesForWeek = (start, end) => {
    daydates = [];
    listData.map(item => {
      if (moment(item.ShiftDate).isBetween(start, end) || item.ShiftDate === start || item.ShiftDate === end) {
        daydates.push(item);
      }
    });
    dates.clear();
    daydates.map(item => {
      dates.add(item.ShiftDate);
    });
    this.getSectionListViews(dates, 'W');
  }

  renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={{ backgroundColor: '#EEEEF0', paddingHorizontal: 14, paddingVertical: 9 }}>
        <Text style={{ color: '#000', fontSize: 14 }}>{sectionData}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar title={'排班查询'} onPressLeftButton={() => this.props.navigator.pop()} tabSelected={this.tabSelectedCallback} />
        <Line />
        {this.getHorizonListView()}
        {
          (!this.state.empty) ?
            <View style={{ flex: 1 }}>
              <ListView
                ref={listview => this.listView = listview}
                dataSource={this.state.dataSource}
                enableEmptySections
                initialListSize={20}
                pageSize={3}
                removeClippedSubviews
                showsVerticalScrollIndicator={false}
                renderRow={this.inflateItem}
                renderSectionHeader={this.renderSectionHeader}
              />
            </View> :
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
              <EmptyView enabled={false} emptyimg={nodata} emptyTitle={I18n.t('mobile.module.myschedule.empty.title')} emptyContent={'这里将展示多人排班信息'} />
            </View>
        }
      </View>
    );
  }
}