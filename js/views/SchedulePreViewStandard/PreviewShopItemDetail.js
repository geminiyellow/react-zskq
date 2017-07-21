/**
 * 店铺列表
 */

import { InteractionManager, ListView, View, NativeModules } from 'react-native';
import { device } from '@/common/Util';
import Text from '@/common/components/TextField';
import React, { PureComponent } from 'react';
import { GET, ABORT } from '@/common/Request';
import NavBar from './NavbarSegment';
import EStyleSheet from 'react-native-extended-stylesheet';
import { getYYYYMMDDFormat, getHHmmFormat } from '@/common/Functions';
import { getStandardPreviewShopDetail } from '@/common/api';
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
  tabsContainerStyle: {
    width: 151,
  },
  tabStyle: {
    borderColor: '$color.mainColorLight',
    paddingVertical: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  tabTextStyle: {
    color: '$color.mainColorLight',
    fontSize: 14
  },
  activeTabStyle: {
    backgroundColor: '$color.mainColorLight',
  },
  activeTabTextStyle: {
    color: 'white',
    fontSize: 14
  },
});

let currentIndex = 0;

// 保存接口返回的原始数据
let monthlistData = [];
// 保存接口返回的周视图原始数据
let weeklistData = [];
const monthusers = new Set();
const weekdatas = new Set();
const dayfromtimes = new Set();
// 选中天对应的数据
let selectedDayData = [];

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
    let start = `${currentYearMonth}-01`;
    let count = moment(start).daysInMonth();
    let end = `${currentYearMonth}-${count}`;
    this.sendRequest(start, end);
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
        selectedDayData.map(item => {
          if (item.ShiftTimeFrom == secItem) {
            secValues.push(item);
          }
        });
      } else if (viewType == 'M') {
        monthlistData.map(item => {
          if (item.EmpName == secItem) {
            secValues.push(item);
          }
        });
      } else {
        weeklistData.map(item => {
          if (item.ShiftDate == secItem) {
            secValues.push(item);
          }
        })
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
        values = resultMap.get(key);
        if (values.length > 0) {
          rowIDs[i] = [];
          for (const j in values) {
            rowIDs[i].push(j);
            dataBlob[i + ':' + j] = values[j];
          }
        }
      } else {
        rowIDs[i] = [];
        rowIDs[i].push('');
      }
      i = i + 1;
    }

    if (_.isEmpty(dataBlob) || dataBlob.length == 0) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
        empty: true,
      });
    } else {
      // 更新状态
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
        empty: false,
      });
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
    monthlistData = [];
    selectedDayData = [];
    monthusers.clear();
    weekdatas.clear();
    dayfromtimes.clear();
    currentIndex = 0;
    ABORT('getStandardPreviewShopDetail');
  }

  inflateItem(rowData, sectionID, rowID, highlightRow) {
    if (!rowData) return null;
    let firstView = null;
    if (currentIndex == 0) {
      firstView = <Text style={{ color: '#333', fontSize: 14, textAlign: 'left', width: 100 }}>{getYYYYMMDDFormat(rowData.ShiftDate)}</Text>;
    } else {
      firstView = <Text style={{ color: '#333', fontSize: 14, textAlign: 'left', width: 80 }}>{rowData.EmpName}</Text>;
    }

    return (
      <View style={{ overflow: 'hidden' }} key={`${sectionID}-${rowID}`}>
        <View style={{ flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 11, paddingLeft: 16 }}>
          {firstView}
          <Text numberOfLines={1} style={{ flex: 1, color: '#333', fontSize: 14, textAlign: 'center' }}>{rowData.ShiftType}</Text>
          <Text numberOfLines={1} style={{ flex: 1, color: '#333', fontSize: 14, textAlign: 'left' }}>{getHHmmFormat(rowData.ShiftTimeFrom)}-{getHHmmFormat(rowData.ShiftTimeTo)}</Text>
          <Text numberOfLines={1} style={{ color: '#333', fontSize: 14, textAlign: 'center', marginHorizontal: 16 }}>{`${rowData.ShiftHours}`}H</Text>
        </View>
        <Line />
      </View>
    );
  }
  // 日期排序
  sortDate = (a, b) => {
    if (moment(a).isBefore(b))
      return -1;
    return 1;
  }

  sendRequest(start, end) {
    const details = this.props.passProps.data;
    const params = {};
    params.unitId = details.UNITID;
    params.startDate = start;
    params.endDate = end;
    GET(getStandardPreviewShopDetail(params), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        RNManager.hideLoading();
        if (_.isEmpty(responseData || responseData.length == 0)) {
          this.setState({
            empty: true,
          });
          return;
        }
        // 获取月视图数据
        if (currentIndex == 0) {
          monthlistData = [...responseData];
          monthlistData.map(item => {
            monthusers.add(item.EmpName);
            dayfromtimes.add(item.ShiftTimeFrom);
          });
          this.getSectionListViews(monthusers, 'M');
        } else if (currentIndex == 1) { // 获取周视图数据
          weeklistData = [...responseData];
          weekdatas.clear();

          weeklistData.map(item => {
            weekdatas.add(item.ShiftDate);
          });
          const tempDate = [];
          for (let item of weekdatas) {
            tempDate.push(item);
          }
          weekdatas.clear();
          let sortedResult = tempDate.sort(this.sortDate);
          sortedResult.forEach(item => weekdatas.add(item));
          this.getSectionListViews(weekdatas, 'W');
        }
      });
    }, (err) => {
      RNManager.hideLoading();
      showMessage(messageType.error, err);
    }, 'getStandardPreviewShopDetail');
  }

  //格式化日期：yyyy-MM-dd     
  formatDate = (date) => {
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate() + 1;

    if (mymonth < 10) {
      mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
      myweekday = "0" + myweekday;
    }
    return (myyear + "-" + mymonth + "-" + myweekday);
  }

  tabSelectedCallback = (index) => {
    if (index == currentIndex) return;
    RNManager.showLoading('');
    if (device.isAndroid && this.listView) this.listView.scrollTo({ y: 0 });
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections({}, [], []),
      empty: false,
      showHorizonListViewIndex: index,
    });
    currentIndex = index;
    window.setTimeout(
      () => {
        if (index == 0) {
          let start = `${currentYearMonth}-01`;
          let count = moment(start).daysInMonth();
          let end = `${currentYearMonth}-${count}`;
          this.sendRequest(start, end);
        } else if (index == 1) {
          const now = new Date();
          const nowDayOfWeek = now.getDay();         //今天本周的第几天     
          const nowDay = now.getDate();              //当前日     
          const nowMonth = now.getMonth();           //当前月     
          const nowYear = now.getYear();             //当前年     
          nowYear += (nowYear < 2000) ? 1900 : 0;

          const weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
          var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));

          this.showSchedulesForWeek(this.formatDate(weekStartDate), this.formatDate(weekEndDate));
        } else {
          this.showSchedulesForDay(moment(`${currentYearMonth}-01`).format('YYYY-MM-DD'));
          window.setTimeout(() => {
            RNManager.hideLoading();
          }, 500);
        }
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
    let selectedYearMonth = moment(selectedMonth).format('YYYY-MM');
    currentYearMonth = selectedYearMonth;
    let start = `${selectedYearMonth}-01`;
    let count = moment(start).daysInMonth();
    let end = `${moment(start).format('YYYY-MM')}-${count}`;
    this.sendRequest(start, end);
  }

  // 显示对应日期的天视图
  showSchedulesForDay = (selectedDay) => {
    selectedDayData = [];
    monthlistData.map(item => {
      if (item.ShiftDate == selectedDay) {
        selectedDayData.push(item);
      }
    });
    dayfromtimes.clear();
    selectedDayData.map(item => {
      dayfromtimes.add(item.ShiftTimeFrom);
    });

    const tempDate = [];
    for (let item of dayfromtimes) {
      tempDate.push(`${selectedDay} ${item}`);
    }
    dayfromtimes.clear();
    let sortedResult = tempDate.sort(this.sortDate);
    sortedResult.forEach(item => dayfromtimes.add(moment(item).format('HH:mm')));
    this.getSectionListViews(dayfromtimes, 'D');
  }
  // 显示对应一周的周视图
  showSchedulesForWeek = (start, end) => {
    this.sendRequest(start, end);
  }

  renderSectionHeader(sectionData, sectionID) {
    return (
      <View>
        <View style={{ backgroundColor: '#EEEEF0', paddingHorizontal: 14, paddingVertical: 9 }}>
          <Text style={{ color: '#000', fontSize: 14 }}>{sectionData}</Text>
        </View>
        <Line />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar title={'排班查询'} onPressLeftButton={() => this.props.navigator.pop()} tabSelected={this.tabSelectedCallback} />
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