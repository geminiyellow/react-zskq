import React, { Component } from 'react';
import { Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Line from '@/common/components/Line';
import Image from '@/common/components/CustomImage';
import Util from '@/views/MyShifts/Util';
import _ from 'lodash';
import { device } from '@/common/Util';
import DateUtil from '@/views/LeaveApply/utils/LeaveDateUtil';
import I18n from 'react-native-i18n';
import { getYYYYMMDDFormat, getYYYYMMDDhhmmFormat, getHHmmFormat } from '@/common/Functions';

const coffee = 'schedule_rest';

export default class ScheduleSelectedDay extends Component {

  constructor(...props) {
    super(...props);
    this.state = {
      scheduleDate: this.props.scheduleDate,
      scheduleInfo: this.props.scheduleInfo,
    };
  }

  // 当前日期时间标题
  onRenderTitle() {
    const dateArr = this.props.scheduleDate.split('-');
    const dateTemp = getYYYYMMDDFormat(`${dateArr[0]}${'-'}${dateArr[1]}${'-'}${dateArr[2]}`);
    const week = Util.getWeek(this.props.scheduleDate);
    return (
      <Text style={styles.titleStyle}>{`${dateTemp}${' '}${week}`}</Text>
    );
  }

  onRenderScheculeNow() {
    const schedule = this.props.scheduleInfo;
    const startTime = getHHmmFormat(schedule.startTime);
    const endTime = getHHmmFormat(schedule.endTime);
    return (
      <View style={styles.scheculeNowStyle}>
        <Text style={styles.scheculeNowNameStyle}>{schedule.shiftName}</Text>
        <Text style={{ flex: 1 }}></Text>
        <Text style={styles.scheculeNowNameStyle}>{`${startTime}${'-'}${endTime}`}</Text>
      </View>
    );
  }

  // 其他排班信息
  onRenderScheculeOthers(type) {
    let items = [];
    const scheduleTemp = this.props.scheduleInfo;
    const startTime = getHHmmFormat(scheduleTemp.startTime);
    const endTime = getHHmmFormat(scheduleTemp.endTime);
    if (_.isEmpty(scheduleTemp.startTime1) || _.isUndefined(scheduleTemp.startTime1)) {

      items.push(
        <View key={0}>
          {this.onRenderScheduleItem(startTime, endTime, scheduleTemp.hours)}
        </View>
      );
    } else {
      const firstHour = this.onJSSC(scheduleTemp.shiftDate, scheduleTemp.startTime, scheduleTemp.startTime1);
      const secoHour = this.onJSSC(scheduleTemp.shiftDate, scheduleTemp.endTime1, scheduleTemp.endTime);
      const startTime1 = getHHmmFormat(scheduleTemp.startTime1);
      const endTime1 = getHHmmFormat(scheduleTemp.endTime1);
      items.push(
        <View key={1}>
          {this.onRenderScheduleItem(startTime, startTime1, firstHour)}
        </View>
      );
      items.push(
        <View key={2}>
          {this.onRenderScheduleItem(endTime1, endTime, secoHour)}
        </View>
      );
    }
    return (
      <View style={[styles.scheduleOthersStyle, { marginBottom: type == 0 ? 40 : 0 }]}>
        {items}
      </View>
    );
  }

  // 当日异常标题
  onRenderExceTitle() {
    return (
      <Text style={styles.exceTitleStyle}>{I18n.t('mobile.module.myschedule.lisitem.business')}</Text>
    );
  }

  // 异常列表信息
  onRenderExceList() {
    let exceList = [];
    const exceListInfos = this.props.scheduleInfo.list;
    for (let i = 0; i < exceListInfos.length; i++) {
      if (i == exceListInfos.length - 1) {
        exceList.push(
          <View key={i}>
            {this.onRenderItem(exceListInfos[i])}
          </View>
        );
      } else {
        exceList.push(
          <View key={i}>
            {this.onRenderItemWithLine(exceListInfos[i])}
          </View>
        );
      }
    }
    return (
      <View style={styles.exceContainerStyle}>
        {exceList}
      </View>
    );
  }

  // 组件
  onRenderComponent() {
    if (_.isEmpty(this.props.scheduleInfo) || _.isUndefined(this.props.scheduleInfo)) {
      // 排班为空 显示暂无排班
      return (
        <View style={styles.container}>
          {this.onRenderTitle()}
          {this.onRenderNoSchedule()}
        </View>
      );
    }
    const scheduleInfos = this.props.scheduleInfo;
    // 在返回排班数据值为空 显示暂无排班
    if (_.isEmpty(scheduleInfos.shiftName) && _.isEmpty(scheduleInfos.startTime) && _.isEmpty(scheduleInfos.endTime)) {
      // 排班为空 显示暂无排班
      return (
        <View style={styles.container}>
          {this.onRenderTitle()}
          {this.onRenderNoSchedule()}
        </View>
      );
    }
    // 休息班
    if (scheduleInfos.hours == 0 || scheduleInfos.hours == '0') {
      if (_.isEmpty(scheduleInfos.list) || _.isUndefined(scheduleInfos.list)) {
        return (
          <View style={styles.container}>
            {this.onRenderTitle()}
            {this.onRenderScheduleRest(false)}
          </View>
        );
      }
      return (
        <View style={styles.container}>
          {this.onRenderTitle()}
          {this.onRenderScheduleRest(true)}
          {this.onRenderExceTitle()}
          {this.onRenderExceList()}
        </View>
      );
    }
    // 正常班
    // 无事件
    if (_.isEmpty(scheduleInfos.list) || _.isUndefined(scheduleInfos.list)) {
      return (
        <View style={styles.container}>
          {this.onRenderTitle()}
          {this.onRenderScheculeNow()}
          {this.onRenderScheculeOthers(0)}
        </View>
      );
    }
    // 有事件
    return (
      <View style={styles.container}>
        {this.onRenderTitle()}
        {this.onRenderScheculeNow()}
        {this.onRenderScheculeOthers(1)}
        {this.onRenderExceTitle()}
        {this.onRenderExceList()}
      </View>
    );
  }

  //////////////////////////////////////////////
  // item tools
  onRenderItem(exceInfo) {
    const startTime = getHHmmFormat(exceInfo.startTime);
    const endTime = getHHmmFormat(exceInfo.endTime);
    return (
      <View style={styles.exceItemStyle}>
        <Text style={[styles.scheculeNowNameStyle, { width: device.width * 0.5, marginRight: 18 }]} numberOfLines={1}>{`${exceInfo.className}`}</Text>
        <Text style={{ flex: 1 }} />
        <Text style={styles.scheculeNowNameStyle}>{`${startTime}${'-'}${endTime}`}</Text>
      </View>
    );
  }

  onRenderItemWithLine(exceInfo) {
    const startTime = getHHmmFormat(exceInfo.startTime);
    const endTime = getHHmmFormat(exceInfo.endTime);
    return (
      <View style={{ flexDirection: 'column' }}>
        <View style={styles.exceItemStyle}>
          <Text style={[styles.scheculeNowNameStyle, { width: device.width * 0.5, marginRight: 18 }]} numberOfLines={1}>{`${exceInfo.className}`}</Text>
          <Text style={{ flex: 1 }} />
          <Text style={styles.scheculeNowNameStyle}>{`${startTime}${'-'}${endTime}`}</Text>
        </View>
        <Line style={{ backgroundColor: '#ebebeb', marginTop: 9 }} />
      </View>
    );
  }

  onRenderNoSchedule() {
    return (
      <Text style={styles.noScheduleStyle}>{I18n.t('mobile.module.myschedule.lisitem.no')}</Text>
    );
  }

  onRenderScheduleRest(isShowExceList) {
    return (
      <View style={[styles.scheduleRestStyle, { marginBottom: isShowExceList ? 0 : 40 }]}>
        <Image style={styles.scheduleRestImgStyle} source={{ uri: coffee }} />
        <Text style={styles.scheduleRestTextStyle}>{I18n.t('mobile.module.myschedule.lisitem.rest')}</Text>
      </View>
    );
  }

  onRenderScheduleItem(startTime, endTime, hours) {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.scheduleItemStyle}>{`${startTime}${'-'}${endTime}`}</Text>
        <Text style={{ flex: 1 }}></Text>
        <Text style={styles.scheduleItemTimeStyle}>{`${hours}${I18n.t('mobile.module.verify.hour')}`}</Text>
      </View>
    );
  }

  ///////////////////////////////////
  // 时差计算
  onJSSC(date, startTime, endTime) {
    const isBefore = DateUtil.onCompareTime(date, date, startTime, endTime);
    let diffTime = 0;
    if (!isBefore) {
      // 隔夜
      // 计算结束日期
      const endDate = DateUtil.onGetDateAfterDate(date, 1);
      diffTime = DateUtil.onDiffDateTime(date, endDate, startTime, endTime);
    } else {
      diffTime = DateUtil.onDiffDateTime(date, date, startTime, endTime);
    }
    return diffTime / (1000 * 60 * 60);
  }

  render() {
    return (
      <View>
        {this.onRenderComponent()}
      </View>
    );
  }

}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  titleStyle: {
    flex: 1,
    color: '#bababa',
    fontSize: 16,
    marginLeft: 25,
    marginTop: 15,
    marginRight: 25,
  },
  scheculeNowStyle: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 25,
    marginTop: 4,
    marginRight: 25,
  },
  scheculeNowNameStyle: {
    color: '#333333',
    fontSize: 16,
  },
  scheduleOthersStyle: {
    height: 50,
    backgroundColor: '#f9f9f9',
    marginLeft: 25,
    marginTop: 8,
    marginRight: 25,
    justifyContent: 'center',
  },
  scheduleItemStyle: {
    color: '#666666',
    marginLeft: 9,
  },
  scheduleItemTimeStyle: {
    color: '#666666',
    marginRight: 10,
  },
  exceTitleStyle: {
    color: '#a8a8a8',
    fontSize: 12,
    marginTop: 25,
    marginLeft: 25,
    marginRight: 25,
  },
  exceContainerStyle: {
    marginTop: 10,
    marginLeft: 25,
    marginRight: 25,
    marginBottom: 40,
  },
  exceItemStyle: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
  },
  noScheduleStyle: {
    width: 98,
    color: '#333333',
    fontSize: 16,
    marginLeft: 25,
    marginTop: 8,
    marginBottom: 40,
  },
  scheduleRestStyle: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 25,
    marginTop: 10,
  },
  scheduleRestImgStyle: {
    height: 22,
    width: 22,
    marginRight: 5,
  },
  scheduleRestTextStyle: {
    marginTop: 1.5,
    marginBottom: 1.5,
    color: '#333333',
    fontSize: 16,
  },
});