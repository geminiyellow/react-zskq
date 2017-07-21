/**
 * 排班查询界面
 */
import { InteractionManager, ListView, TouchableOpacity, View, NativeModules } from 'react-native';
import React, { PureComponent } from 'react';
import Calendar from 'react-native-calendar';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import _ from 'lodash';
import moment from 'moment';
import NavBar from '@/common/components/NavBar';
import Text from '@/common/components/TextField';
import { getCurrentLanguage, getHHmmFormat } from '@/common/Functions';
import DatePicker, { datePickerType } from '@/common/components/DatePicker';
import Line from '@/common/components/Line';
import { showMessage } from '@/common/Message';
import { messageType, companyCodeList } from '@/common/Consts';
import { device } from '@/common/Util';
import { GET, ABORT } from '@/common/Request';
import { getEmployeeScheduleInfo } from '@/common/api';
import Functions from '@/common/Functions';
import List from './List';
import UmengAnalysis from '@/common/components/UmengAnalysis'
import LeaveApply from './../LeaveApply/LeaveReq';
import LeaveApplyEstee from './../LeaveApply/LeaveReqEstee';
import LeaveApplySamsung from './../LeaveApply/LeaveReqSamsung';
import LeaveApplyGant from './../LeaveApply/LeaveReqGant';
import Constance from './Constance';
import LeaveModeHelper from './LeaveModeHelper';

const titleimg = 'downarrow';
const calendar = 'calendar';
const righticon = 'list';
const leaveModeHelper = new LeaveModeHelper();

const componentMap = new Map();

let showCalendar = false;
const { RNManager } = NativeModules;
const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
  },
  circleStyle: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#1fd662',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleStyleOrange: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#ffc817',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleStyleGray: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#999999',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTextStyle: {
    fontSize: 15,
    color: '#999999',
    marginLeft: 18,
    marginTop: 10,
    marginBottom: 10,
  },
  rowStyle: {
    backgroundColor: 'white',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 10,
  },
  rowTextStyle: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 11,
  },
  leaveTextStyle: {
    width: 60,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#1fd762',
    borderRadius: 3,
  },
  columnImg: {
    width: device.width,
    height: 220,
    marginVertical: 10,
  },
});

let currentYear = '2016';
let currentMonth = '1';
let todayShift = null;
let schedules = [];

function getData() {
  const myDate = new Date();
  // 获取完整的年份(4位,1970-????)
  currentYear = myDate.getFullYear();
  // 获取当前月份(0-11,0代表1月)
  currentMonth = myDate.getMonth() + 1;
  selectedMonth = `${currentMonth}`;

  currentYear = `${currentYear}`;
  currentMonth = `${currentMonth}`;
}

let selectedMonth;

export default class ScheduleListUi extends PureComponent {
  constructor(...args) {
    super(...args);
    this.list = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      firstInit: true,
      dataSource: this.list.cloneWithRows([]),
      reload: false,
      showListView: true,
      language: 0,
      titleStr: I18n.t('mobile.module.myschedule.default.title'),
      customDayHeadings: [I18n.t('mobile.consts.week.sunday'), I18n.t('mobile.consts.week.monday'), I18n.t('mobile.consts.week.tuesday'),
      I18n.t('mobile.consts.week.wednesday'), I18n.t('mobile.consts.week.thurday'), I18n.t('mobile.consts.week.friday'),
      I18n.t('mobile.consts.week.saturday')],
      customMonthNames: [I18n.t('mobile.module.myschedule.picker.one'), I18n.t('mobile.module.myschedule.picker.two'), I18n.t('mobile.module.myschedule.picker.three'),
      I18n.t('mobile.module.myschedule.picker.four'), I18n.t('mobile.module.myschedule.picker.five'), I18n.t('mobile.module.myschedule.picker.six'),
      I18n.t('mobile.module.myschedule.picker.seven'), I18n.t('mobile.module.myschedule.picker.eight'), I18n.t('mobile.module.myschedule.picker.nine'),
      I18n.t('mobile.module.myschedule.picker.ten'), I18n.t('mobile.module.myschedule.picker.eleven'), I18n.t('mobile.module.myschedule.picker.twelve')],
    };

    getData();

    getCurrentLanguage().then(data => {
      const currentDate = new Date();
      let currentmonth = currentDate.getMonth() + 1;
      if (currentmonth < 10) {
        currentmonth = `0${currentmonth}`;
      }
      if (data == 'ZH-CN') {
        this.setState({
          language: 0,
          titleStr: `${I18n.t(Constance.getMonth(currentmonth, 0))} ${I18n.t('mobile.module.myschedule.default.title')}`,
        });
      } else if (data == 'EN-US') {
        this.setState({
          language: 1,
          titleStr: `${I18n.t(Constance.getMonth(currentmonth, 1))} ${I18n.t('mobile.module.myschedule.default.title')}`,
        });
      } else {
        this.setState({
          language: 2,
          titleStr: `${I18n.t(Constance.getMonth(currentmonth, 2))} ${I18n.t('mobile.module.myschedule.default.title')}`,
        });
      }
    });

    this.months = new Map();
    this.months.set('1', '01');
    this.months.set('2', '02');
    this.months.set('3', '03');
    this.months.set('4', '04');
    this.months.set('5', '05');
    this.months.set('6', '06');
    this.months.set('7', '07');
    this.months.set('8', '08');
    this.months.set('9', '09');
    this.months.set('10', '10');
    this.months.set('11', '11');
    this.months.set('12', '12');

    this.onShiftView(global.companyResponseData.version);
  }

  componentWillMount() {
    UmengAnalysis.onPageBegin('Schedule');
  }

  componentDidMount() {
    const currentDate = new Date();
    let currentmonth = currentDate.getMonth() + 1;
    if (currentmonth < 10) {
      currentmonth = `0${currentmonth}`;
    }
    const start = `${currentDate.getFullYear()}-${currentmonth}-01`;
    const day = new Date(currentDate.getFullYear(), currentmonth, 0);
    // 获取天数：
    const daycount = day.getDate();

    const end = `${currentDate.getFullYear()}-${currentmonth}-${daycount}`;

    this.sendRequest(start, end);

    this.setState({
      firstInit: false,
    });
  }

  componentDidUpdate() {
    if (showCalendar) {
      if (!this.state.showListView && this.calendar) {
        this.calendar.jump(currentYear, selectedMonth - 1);
        showCalendar = false;
      }
    }
  }

  componentWillUnmount() {
    UmengAnalysis.onPageEnd('Schedule');
    ABORT('getEmployeeScheduleInfo');
    todayShift = null;
  }

  getViews() {
    if (this.state.showListView) {
      return (
        <List
          style={{ flexGrow: 1 }}
          datas={schedules}
          navigator={this.props.navigator}
          ref={list => this.listview = list}
        />
      );
    }
    const holidays = [];
    const events = [];
    for (item of schedules) {
      events.push(item.ShiftDate);
      if (item.ShiftType == Constance.ShiftType_HOLIDAY || item.ShiftType == Constance.ShiftType_FESTIVAL) {
        holidays.push(item.ShiftDate);
      }
    }

    return (
      <View style={{ flexGrow: 1 }}>
        <Calendar
          ref={cal => this.calendar = cal}
          eventDates={events}
          holidayDates={holidays}
          dayHeadings={this.state.customDayHeadings}
          monthNames={this.state.customMonthNames}
          titleFormat={'MMMM YYYY'}
          prevButtonText={'Prev'}
          nextButtonText={'Next'}
          onDateSelect={(date) => {
            this.setState({ selectedDate: moment(date).format('YYYY-MM-DD') });
          }}
        />
        {this.getTodaySchedule()}
      </View>
    );
  }

  getTodaySchedule() {
    let circlebg = styles.circleStyle;
    let leaveText = null;
    if (this.state.selectedDate) {
      let tempselectSchedule = null;
      const date = _.split(this.state.selectedDate, '-');
      for (const item of schedules) {
        if (item.ShiftDate == this.state.selectedDate) {
          tempselectSchedule = item;
        }
      }
      leaveText = (
        <TouchableOpacity style={styles.leaveTextStyle} onPress={() => this.gotoLeaveApply(tempselectSchedule)}>
          <Text style={{ fontSize: 14, color: '#1fd662' }}>{I18n.t('mobile.module.myschedule.lisitem.leave')}</Text>
        </TouchableOpacity>
      );

      let durationView = (<Text style={{ fontSize: 14, color: '#ADADAD', marginTop: 2 }}>{tempselectSchedule ? `${I18n.t('mobile.module.myschedule.lisitem.shifttime')}：${getHHmmFormat(tempselectSchedule.TimeFrom)}-${getHHmmFormat(tempselectSchedule.TimeTo)}` : I18n.t('mobile.module.myschedule.list.nodatedesc')}</Text>);
      if (!tempselectSchedule) {
        circlebg = styles.circleStyleGray;
        leaveText = null;
      } else {
        if (tempselectSchedule.ShiftType == Constance.ShiftType_HOLIDAY || tempselectSchedule.ShiftType == Constance.ShiftType_FESTIVAL) circlebg = styles.circleStyleOrange;
      }
      if (tempselectSchedule && moment(moment().format('YYYY-MM-DD')) > moment(tempselectSchedule.ShiftDate)) {
        circlebg = styles.circleStyleGray;
        leaveText = null;
      }
      if (tempselectSchedule && _.parseInt(tempselectSchedule.TotalHours) == 0) {
        leaveText = null;
      }
      if (leaveModeHelper && !leaveModeHelper.hasLeaveAuthority()) {
        leaveText = null;
      }
      if (tempselectSchedule && _.parseInt(tempselectSchedule.TotalHours) == 0) {
        durationView = null;
      }
      const monthText = Constance.getWeekIndex(this.state.selectedDate, this.state.language);
      return (
        <View style={[styles.rowStyle, { backgroundColor: 'white' }]}>
          <View style={circlebg} >
            <Text style={{ fontSize: 16, color: 'white' }}>{date[2]}</Text>
            <Text style={{ fontSize: 11, color: 'white' }}>{I18n.t(monthText)}</Text>
          </View>

          <View style={styles.rowTextStyle} >
            <Text style={{ fontSize: 16, color: '#666666' }}>{tempselectSchedule ? tempselectSchedule.ShiftName : I18n.t('mobile.module.myschedule.list.nodate')}</Text>
            {durationView}
          </View>

          {leaveText}
        </View>
      );
    } else {
      const tempselectSchedule = todayShift;
      const today = moment().format('YYYY-MM-DD');
      const date = _.split(today, '-');
      leaveText = (
        <TouchableOpacity style={styles.leaveTextStyle} onPress={() => this.gotoLeaveApply(tempselectSchedule)}>
          <Text style={{ fontSize: 14, color: '#1fd662' }}>{I18n.t('mobile.module.myschedule.lisitem.leave')}</Text>
        </TouchableOpacity>
      );
      let durationView = (<Text style={{ fontSize: 14, color: '#ADADAD', marginTop: 2 }}>{tempselectSchedule ? `${I18n.t('mobile.module.myschedule.lisitem.shifttime')}：${getHHmmFormat(tempselectSchedule.TimeFrom)}-${getHHmmFormat(tempselectSchedule.TimeTo)}` : I18n.t('mobile.module.myschedule.list.nodatedesc')}</Text>);
      if (!tempselectSchedule) {
        circlebg = styles.circleStyleGray;
        leaveText = null;
      } else {
        if (tempselectSchedule.ShiftType == Constance.ShiftType_HOLIDAY || tempselectSchedule.ShiftType == Constance.ShiftType_FESTIVAL) circlebg = styles.circleStyleOrange;
      }
      if (tempselectSchedule && moment(moment().format('YYYY-MM-DD')) > moment(tempselectSchedule.ShiftDate)) {
        circlebg = styles.circleStyleGray;
        leaveText = null;
      }
      if (tempselectSchedule && _.parseInt(tempselectSchedule.TotalHours) == 0) {
        leaveText = null;
      }
      if (leaveModeHelper && !leaveModeHelper.hasLeaveAuthority()) {
        leaveText = null;
      }
      if (tempselectSchedule && _.parseInt(tempselectSchedule.TotalHours) == 0) {
        durationView = null;
      }
      return (
        <View style={[styles.rowStyle, { backgroundColor: 'white' }]}>
          <View style={circlebg} >
            <Text style={{ fontSize: 16, color: 'white' }}>{date[2]}</Text>
            <Text style={{ fontSize: 11, color: 'white' }}>{I18n.t(Constance.getWeekIndex(today, this.state.language))}</Text>
          </View>

          <View style={styles.rowTextStyle} >
            <Text style={{ fontSize: 16, color: '#666666' }}>{tempselectSchedule ? tempselectSchedule.ShiftName : I18n.t('mobile.module.myschedule.list.nodate')}</Text>
            {durationView}
          </View>

          {leaveText}
        </View>
      );
    }
  }

  onGetLeaveReqView(versionId) {
    if (versionId === companyCodeList.standard) {
      // 标准版
      return LeaveApply;
    }
    if (versionId === companyCodeList.estee) {
      // 雅诗兰黛
      return LeaveApplyEstee;
    }
    if (versionId === companyCodeList.gant) {
      // 甘特
      return LeaveApplyGant;
    }
    if (versionId === companyCodeList.samsung) {
      // 三星
      return LeaveApplySamsung;
    }
    // 默认跳转请假
    return LeaveApply;
  }

  // 请假加班跳转
  onShiftView(versions) {
    // 请假 加班跳转
    for (i = 0; i < versions.length; i += 1) {
      // 存入map中
      componentMap.set(versions[i].moduleCode, versions[i].companyCode);
    }
  }

  // 跳转到请假页面
  gotoLeaveApply = (shift) => {
    this.props.navigator.push({
      component: this.onGetLeaveReqView(componentMap.get('S010030')),
      passProps: {
        data: shift,
      },
    });
  }

  sendRequest(start, end) {
    const params = {};
    params.startDate = start;
    params.endDate = end;
    GET(getEmployeeScheduleInfo(params), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        const result = [...responseData];
        schedules = [...responseData];
        const today = moment().format('YYYY-MM-DD');
        schedules.map(item => {
          if (item.ShiftDate == today) {
            todayShift = item;
          }
        });

        if (this.listview) {
          this.listview.refrashList(result);
        } else {
          this.setState({
            reload: !this.state.reload,
          });
        }
      });
    }, (err) => {
      showMessage(messageType.error, err);
    }, 'getEmployeeScheduleInfo');
  }

  titleonPress = () => {
    this.picker.show();
  }

  createDateData = () => {
    const tempYear = moment().year();
    const date = [
      [`${tempYear - 1}`, `${tempYear}`, `${tempYear + 1}`, `${tempYear + 2}`],
      this.state.customMonthNames,
    ];
    return date;
  }

  initPicker() {
    if (!this.state.firstInit) {
      return (
        <DatePicker
          ref={picker => this.picker = picker}
          datePickerMode={datePickerType.yearMonthMode}
          title={I18n.t('mobile.module.myschedule.picker.title')}
          selectedValue={`${currentYear}-${currentMonth}`}
          onPickerConfirm={(pickedValue) => {
            if (pickedValue == `${currentYear}-${currentMonth}`) {
              return;
            }
            const array = _.split(pickedValue, '-');
            currentMonth = array[1];
            currentYear = array[0];
            if (!this.state.showListView) {
              this.calendar.jump(currentYear, currentMonth - 1);
            }
            selectedMonth = currentMonth;
            const monthText = Constance.getMonth(selectedMonth, this.state.language);
            schedules = [];
            this.setState({
              selectedDate: null,
              titleStr: `${I18n.t(monthText)} ${I18n.t('mobile.module.myschedule.default.title')}`,
            });

            const start = `${currentYear}-${selectedMonth}-01`;
            // 获取天数：
            const daycount = Functions.getDaysAccountForMonth(selectedMonth - 1);
            const end = `${currentYear}-${selectedMonth}-${daycount}`;
            this.sendRequest(start, end);
          }} />
      );
    }
    return null;
  }

  render() {
    return (
      <View style={styles.container}>

        <NavBar title={this.state.titleStr} onPressLeftButton={() => this.props.navigator.pop()}
          titleImage={{ uri: titleimg }} onPressTitle={this.titleonPress}
          rightContainerRightImage={{ uri: this.state.showListView ? calendar : righticon }}
          onPressRightContainerRightButton={() => {
            RNManager.showLoading('');
            showCalendar = true;
            this.setState({
              showListView: !this.state.showListView,
            });

            window.setTimeout(
              () => { RNManager.hideLoading(); },
              1000
            );
          }} />

        {this.getViews()}
        <Line />

        {this.initPicker()}

      </View>
    );
  }
}
