import React, { Component } from 'react';
import { Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Line from '@/common/components/Line';
import Image from '@/common/components/CustomImage';
import Util from '@/views/MyShifts/Util';
import I18n from 'react-native-i18n';
import { device } from '@/common/Util';
import { getHHmmFormat } from '@/common/Functions';

const coffee = 'schedule_rest';
// 排班颜色值
const noScheduleColor = '#2C2C2C';
const scheduleRestColor = '#A6A6A6';
const scheduleColor = '#14BE4B';

export default class ScheduleNext extends Component {

  onRenderTime(color) {
    const date = this.props.scheduleDate;
    const day = Util.getDay(date);
    const week = Util.getWeek(date);
    return (
      <View style={{ flexDirection: 'row' }}>
        <Text style={[styles.leftLineStyle, { backgroundColor: color }]} />
        <View>
          <View style={[styles.timeStyle, { marginTop: 8 }]}>
            <Text style={styles.dateStyle}>{`${day}`}</Text>
          </View>
          <View style={styles.weekContainerStyle}>
            <Text style={styles.weekStyle}>{week}</Text>
          </View>
        </View>
        <Line style={styles.lineStyle} />
      </View>
    );
  }

  onRenderRest() {
    return (
      <View style={styles.scheduleRestStyle}>
        <Image style={styles.scheduleRestImgStyle} source={{ uri: coffee }} />
        <Text style={[styles.scheduleRestTextStyle, { marginTop: 20 }]}>{I18n.t('mobile.module.myschedule.lisitem.rest')}</Text>
      </View>
    );
  }

  onRenderNoSchedule() {
    return (
      <View style={styles.scheduleRestStyle}>
        <Text style={[styles.scheduleRestTextStyle, { marginTop: 20 }]}>{I18n.t('mobile.module.myschedule.list.nodate')}</Text>
      </View>
    );
  }

  onRenderSchedule() {
    const startTime = getHHmmFormat(this.props.scheduleInfo.startTime);
    const endTime = getHHmmFormat(this.props.scheduleInfo.endTime);
    return (
      <View style={styles.scheduleStyle}>
        <Text style={styles.scheduleNameStyle}>{`${this.props.scheduleInfo.shiftName}`}</Text>
        <Text style={styles.scheduleTimeStyle}>{`${startTime}${'-'}${endTime}`}</Text>
      </View>
    );
  }

  onRenderMonth() {
    return (
      <View style={styles.monthItemStyle}>
        <Text style={styles.monthNameStyle}>{`${this.props.monthName}${'月'}`}</Text>
      </View>
    );
  }

  onRenderItem() {
    if (this.props.scheduleType == 0) {
      // 未排班
      return (
        <View style={styles.container}>
          {this.onRenderTime(noScheduleColor)}
          {this.onRenderNoSchedule()}
        </View>
      );
    } else if (this.props.scheduleType == 1) {
      // 休息
      return (
        <View style={styles.container}>
          {this.onRenderTime(scheduleRestColor)}
          {this.onRenderRest()}
        </View>
      );
    } else if (this.props.scheduleType == 2) {
      // 正常班
      return (
        <View style={styles.container}>
          {this.onRenderTime(scheduleColor)}
          {this.onRenderSchedule()}
        </View>
      );
    }
    // 默认返回为排班
    return (
      <View style={styles.container}>
        {this.onRenderTime()}
        {this.onRenderNoSchedule()}
      </View>
    );
  }


  render() {
    if (this.props.isMonthItemShow) {
      return (
        <View>
          {this.onRenderMonth()}
          {this.onRenderItem()}
        </View>
      );
    }
    return (
      <View>
        {this.onRenderItem()}
      </View>
    );
  }

}

const styles = EStyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    height: 60,
  },
  leftLineStyle: {
    width: 3,
    height: 30,
    marginLeft: 5,
    marginTop: 15,
    marginRight: 12,
    marginBottom: 15,
  },
  timeStyle: {
    marginRight: 15,
  },
  dateStyle: {
    color: '#333333',
    fontSize: 22,
    textAlign: 'center',
  },
  weekContainerStyle: {
    marginRight: 15,
  },
  weekStyle: {
    color: '#333333',
    width: 28,
    fontSize: 11,
    textAlign: 'center',
  },
  lineStyle: {
    width: 1.5,
    height: 28,
    marginTop: 16,
    marginRight: 10,
    marginBottom: 16,
    backgroundColor: '#e9eef1',
  },
  scheduleStyle: {
    height: 60,
    flex: 1,
    flexDirection: 'column',
  },
  scheduleNameStyle: {
    flex: 1,
    color: '#737373',
    fontSize: 14,
    marginTop: 10,
  },
  scheduleTimeStyle: {
    flex: 1,
    color: '#333333',
    fontSize: 16,
    marginBottom: 8,
  },
  monthItemStyle: {
    height: 35,
    backgroundColor: '#ffffff'
  },
  monthNameStyle: {
    flex: 1,
    color: '#bababa',
    fontSize: 12,
    marginLeft: 20,
    marginTop: 16,
    marginBottom: 5,
  },
  scheduleRestStyle: {
    height: 60,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  scheduleRestImgStyle: {
    height: 22,
    width: 22,
    marginTop: 19,
    marginRight: 5,
    marginBottom: 19,
  },
  scheduleRestTextStyle: {
    color: '#333333',
    fontSize: 16,
    marginBottom: 20,
  },
});