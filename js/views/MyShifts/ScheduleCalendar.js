/** 我的排班日历 */
import React from 'react';
import { requireNativeComponent } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';
const RNCalendar = requireNativeComponent('ScheduleCalendarView', Calendar);

export default class Calendar extends React.Component {
  render() {
    const { style } = this.props;
    return (
      <RNCalendar
        style={[styles.calendar, style]}
        {...this.props}/>
    );
  }
}

const styles = EStyleSheet.create({
  calendar: {
    width: device.width,
  },
});