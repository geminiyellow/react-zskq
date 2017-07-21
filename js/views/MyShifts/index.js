/**
 * 排班查询界面
 */
import { InteractionManager, TouchableOpacity, View, NativeModules, DeviceEventEmitter, processColor, ScrollView } from 'react-native';
import React, { PureComponent } from 'react';
import Calendar from 'react-native-calendar';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import _ from 'lodash';
import moment from 'moment';
import NavBar from '@/common/components/NavBar';
import Text from '@/common/components/TextField';
import Schedule7DaysView from './Schedule7DaysView';
import ScheduleSelectedDay from '@/common/components/schedule/ScheduleSelectedDay';
import { getYear, getMonth, getCurrentLanguage, getHHmmFormat } from '@/common/Functions';
import DatePicker, { datePickerType } from '@/common/components/DatePicker';
import Line from '@/common/components/Line';
import { showMessage } from '@/common/Message';
import { messageType, companyCodeList } from '@/common/Consts';
import { device } from '@/common/Util';
import { ABORT, GET } from '@/common/Request';
import { getEmployeeScheduleInfo, GetEmployeeScheduleForFour } from '@/common/api';
import Functions, { getDaysAccountForMonth } from '@/common/Functions';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
import { appVersion } from '@/common/Consts';
import ScheduleCalendar from './ScheduleCalendar';
import HttpUtil from './HttpUtil';
import Util from './Util';
import ScheduleConstance from '../Schedule/Constance';
import MyFormHelper from '../MyForms/MyFormHelper';
const myFormHelper = new MyFormHelper();
const { ScheduleCalendarView, ScheduleCalendarViewManager } = NativeModules;
const customizedCompanyHelper = new CustomizedCompanyHelper();
const calendar_rect_will_change = 'calendar_Rect_Will_Change';
const did_select_date = 'did_select_date';
const titleimg = 'downarrow';

let currentyear = getYear();
let currentmonth = getMonth();
let selectedMonth;
function getData() {
  const myDate = new Date();
  // 获取完整的年份(4位,1970-????)
  currentyear = myDate.getFullYear();
  // 获取当前月份(0-11,0代表1月)
  currentmonth = myDate.getMonth() + 1;
  if (currentmonth < 10) {
    currentmonth = `0${currentmonth}`;
  }
  selectedMonth = `${currentmonth}`;

  currentyear = `${currentyear}`;
  currentmonth = `${currentmonth}`;
}

// let dateSources = '';
let scheduleInfo = '';
let isFirstEnter = true;

export default class MyShifts extends PureComponent {
  constructor(props) {
    super(props);
    let currenttemp = moment().format('YYYY-MM');
    let size = 5;
    // 总天数
    const count = moment(`${currenttemp}-01`).daysInMonth();
    const dayOfWeek = moment(`${currenttemp}-01`).days()
    // 1、星期5 31天显示6行    2、星期6  大于29天显示6行
    if ((dayOfWeek == 5 && count == 31) || (dayOfWeek == 6 && count > 29)) {
      size = 6;
    }
    getData();
    this.state = {
      currentYear: currentyear,
      currentMonth: currentmonth,
      calendarHeight: device.isAndroid ? size * 42 : 254,
      dateSources: [],
      isChange: false,
      scheduleData: {},
      isFinish: false,
      titleStr: `${I18n.t(ScheduleConstance.getMonth(currentmonth, myFormHelper.getLanguage()))} ${I18n.t('mobile.module.myschedule.default.title')}`,
    };
    this.calendarSelectedDate = Functions.getNowFormatDate();
    if (device.isIos) {
      const dateArr = Util.get7DatesArr(this.calendarSelectedDate);
      HttpUtil.GetEmployeeSchedule(dateArr[0], dateArr[6]);
    }
  }

  /** Life Cycle */
  componentWillMount() {
    this.getEmployeeScheduleForFour();
  }

  componentDidMount() {
    this.calendarBoundsListener = DeviceEventEmitter.addListener(calendar_rect_will_change, (data) => {
      let height = parseFloat(data.height);
      this.setState({ calendarHeight: height });
    });
    this.selectDateListener = DeviceEventEmitter.addListener(did_select_date, (data) => {
      this.scheduleScrollView.scrollTo({ x: 0, y: 0, animated: true });
      this.calendarSelectedDate = data.date;
      // 请求网络数据
      const dateArr = Util.get7DatesArr(this.calendarSelectedDate);
      HttpUtil.GetEmployeeSchedule(dateArr[0], dateArr[6]);
    });
    this.listeners = [
      DeviceEventEmitter.addListener('SCHEDULE_INFOS', (eventBody) => {
        // 排班信息接口返回
        this.setState({
          dateSources: eventBody,
        });
        HttpUtil.GetAttendanceAndSchedule(this.calendarSelectedDate);
      }),
      DeviceEventEmitter.addListener('SCHEDULE', (eventBody) => {
        // 排班信息接口返回
        scheduleInfo = eventBody;
        console.log('scheduleInfo========',scheduleInfo);
        this.setState({
          isChange: !this.state.isChange,
        });
      }),
    ];
  }

  componentWillUnmount() {
    this.calendarBoundsListener.remove();
    this.selectDateListener.remove();
    this.listeners && this.listeners.forEach(listener => listener.remove());
    ABORT('GetEmployeeScheduleForFour');
    ABORT('GetAttendanceAndSchedule');
    this.calendarSelectedDate = Functions.getNowFormatDate();
  }

  componentDidUpdate() {
    if (device.isIos) {
      if (isFirstEnter) {
        isFirstEnter = false;
        this.setState({
          isChange: !this.state.isChange,
        });
      }
    }
  }

  getEmployeeScheduleForFour(selectedYear, selectedMonth) {
    // 获取员工的排班信息（包含4卡制）
    const params = {};
    const month = selectedMonth && selectedMonth.length != 0 ? `0${selectedMonth}`.slice(-2) : `0${moment().month() + 1}`.slice(-2);
    const monthDays = selectedMonth && selectedMonth.length != 0 ? parseInt(selectedMonth) - 1 : moment().month();
    const year = selectedYear && selectedYear.length != 0 ? selectedYear : moment().year();
    const days = getDaysAccountForMonth(monthDays);
    const beginDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-${days}`;
    params.companyCode = customizedCompanyHelper.getCompanyCode();
    params.appVersion = appVersion;
    params.beginDate = beginDate;
    params.endDate = endDate;
    GET(GetEmployeeScheduleForFour(params), (responseData) => {
      this.employeeScheduleDataFilter(responseData);
    }, (err) => {
      if (device.isAndroid) {
        const { currentYear, currentMonth } = this.state;
        const selectNext = {
          scheduleData: {},
          selectedMonth: `${currentYear}-${currentMonth}-01`,
        };
        ScheduleCalendarView.jump(selectNext);
      }
      this.setState({ isFinish: true });
      showMessage(messageType.error, err);
    }, 'AbortGetEmployeeScheduleForFour');
  }

  GetDateAfter7Str(date) {
    let datt = date.split('-');//这边给定一个特定时间
    let newDate = new Date(datt[0], datt[1] - 1, datt[2]);
    let befminuts = newDate.getTime() + 1000 * 60 * 60 * 24 * parseInt(7);//计算前几天用减，计算后几天用加，最后一个就是多少天的数量
    let beforeDat = new Date;
    beforeDat.setTime(befminuts);
    let befMonth = beforeDat.getMonth() + 1;
    let mon = befMonth >= 10 ? befMonth : '0' + befMonth;
    let befDate = beforeDat.getDate();
    let da = befDate >= 10 ? befDate : '0' + befDate;
    return beforeDat.getFullYear() + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (da < 10 ? ('0' + da) : da);
  }

  employeeScheduleDataFilter(data) {
    // 对接口获取的 用户排班信息做调整，提供给日历
    const length = data.length;
    let messageFormat = new Map();
    for (let i = 0; i < length; i++) {
      const key = data[i].shiftDate;
      const hours = data[i].hours;
      const isEvent = data[i].isEvent == 'N' ? false : true;
      messageFormat[key] = { 'hours': hours, 'hasEvent': isEvent };
    }
    if (device.isAndroid) {
      const { currentYear, currentMonth } = this.state;
      const selectNext = {
        scheduleData: messageFormat,
        selectedMonth: `${currentYear}-${currentMonth}-01`,
      };
      ScheduleCalendarView.jump(selectNext);
    }
    this.setState({
      isFinish: true,
      scheduleData: messageFormat,
    });
  }


  /** Render Methods */
  render() {
    const { currentYear, currentMonth, calendarHeight } = this.state;
    const { navigator } = this.props;
    return (
      <View style={styles.container}>
        <NavBar
          title={this.state.titleStr}
          onPressLeftButton={() => this.props.navigator.pop()}
          titleImage={{ uri: titleimg }}
          onPressTitle={() => {
            this.picker.show();
          }}
          onPressRightContainerRightButton={() => { }} />
        <View style={{
          width: device.width, height: 30, backgroundColor: '#F5F5F5', flexDirection: 'row',
          justifyContent: 'center', alignItems: 'center'
        }}>
          <Text numberOfLines={1} style={styles.calendarHeaderStyle}>{I18n.t('mobile.consts.week.sunday')}</Text>
          <Text numberOfLines={1} style={styles.calendarHeaderStyle}>{I18n.t('mobile.consts.week.monday')}</Text>
          <Text numberOfLines={1} style={styles.calendarHeaderStyle}>{I18n.t('mobile.consts.week.tuesday')}</Text>
          <Text numberOfLines={1} style={styles.calendarHeaderStyle}>{I18n.t('mobile.consts.week.wednesday')}</Text>
          <Text numberOfLines={1} style={styles.calendarHeaderStyle}>{I18n.t('mobile.consts.week.thurday')}</Text>
          <Text numberOfLines={1} style={styles.calendarHeaderStyle}>{I18n.t('mobile.consts.week.friday')}</Text>
          <Text numberOfLines={1} style={styles.calendarHeaderStyle}>{I18n.t('mobile.consts.week.saturday')}</Text>
        </View>
        {this.renderCalendar()}
        <ScrollView
          ref={view => this.scheduleScrollView = view}
          style={styles.ScrollViewStyle}
          bounces={false}
          behavior={this.state.behavior}
          showsVerticalScrollIndicator={false}>
          {this.renderScheduleInfo(this.calendarSelectedDate)}
          {this.renderDevider()}
          {this.onRenderScheduleListInfo(this.calendarSelectedDate)}
        </ScrollView>
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
            currentyear = array[0];
            currentmonth = array[1];
            selectedMonth = currentmonth;
            const monthText = ScheduleConstance.getMonth(selectedMonth, myFormHelper.getLanguage());
            if (device.isAndroid) {
              let size = 5;
              // 总天数
              const count = moment(`${pickedValue}-01`).daysInMonth();
              const dayOfWeek = moment(`${pickedValue}-01`).days()
              // 1、星期5 31天显示6行    2、星期6  大于29天显示6行
              if ((dayOfWeek == 5 && count == 31) || (dayOfWeek == 6 && count > 29)) {
                size = 6;
              }
              this.setState({
                calendarHeight: size * 42,
                currentYear: currentyear,
                currentMonth: currentmonth,
                titleStr: `${I18n.t(monthText)} ${I18n.t('mobile.module.myschedule.default.title')}`,
              });
            } else {
              this.setState({
                currentYear: currentyear,
                currentMonth: currentmonth,
                titleStr: `${I18n.t(monthText)} ${I18n.t('mobile.module.myschedule.default.title')}`,
              });
            }
            this.getEmployeeScheduleForFour(currentyear, currentmonth);
          }} />
      </View>
    );
  }

  renderCalendar() {
    const { calendarHeight, scheduleData, currentYear, currentMonth, isFinish } = this.state;
    if (device.isIos) {
      return (
        <View style={{ height: calendarHeight + 10.0, backgroundColor: 'white' }}>
          <ScheduleCalendar
            style={[styles.calendar, { height: calendarHeight }]}
            scheduledTextColor={processColor('#14BE4B')}
            offScheduledTextColor={processColor('#ACACAC')}
            noScheduledTextColor={processColor('#2C2C2C')}
            selectedMonth={`${currentYear}-${currentMonth}`}
            scheduleData={scheduleData} />
        </View>
      );
    }
    return (
      <View style={{ height: calendarHeight, backgroundColor: 'white' }}>
        {
          !isFinish ? null :
            <ScheduleCalendar
              style={{ height: calendarHeight }}
              scheduledTextColor={processColor('#14BE4B')}
              scheduledTextSize={14}
              selectedMonth={`${currentYear}-${currentMonth}`}
              scheduleData={scheduleData} />
        }
      </View>
    );
  }


  renderScheduleInfo(date) {
    return (
      <ScheduleSelectedDay
        scheduleDate={date}
        scheduleInfo={scheduleInfo} />
    );
  }

  onRenderScheduleListInfo(date) {
    return (
      <Schedule7DaysView
        scheduleDate={date}
        itemNum={this.state.dateSources == '' ? 0 : this.state.dateSources.length}
        dateSources={[...this.state.dateSources]} />
    );
  }

  renderDevider() {
    return (
      <View style={styles.deviderStyle}>
        <Text style={styles.deviderTextStyle}>{I18n.t('mobile.module.myschedule.lisitem.next')}</Text>
      </View>
    );
  }

}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  calendar: {
    // shadow
    shadowColor: '#140000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    shadowOpacity: 0.05,
  },
  deviderStyle: {
    flex: 1,
    backgroundColor: '#ebebeb',
    height: 45,
  },
  deviderTextStyle: {
    color: '#bababa',
    fontSize: 12,
    alignSelf: 'center',
    marginTop: 21,
    marginBottom: 10,
  },
  calendarHeaderStyle: {
    flex: 1,
    textAlign: 'center',
    color: '#A6A6A6',
    fontSize: 14,
  },
});