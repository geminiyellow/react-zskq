import moment from 'moment';
import _ from 'lodash';

module.exports = {
  // 时间计算
  onCalculateDateTime(leaveStartDate, leaveEndDate, leaveStartTime, leaveEndTime) {
    // 同一天 返回false
    if (leaveStartDate === leaveEndDate) {
      return false;
    }
    // 跨天
    // 跨天，（ 开始时间 - 结束时间 ）/ 24 >=1
    const resultDifftSec = this.onDiffDateTime(leaveStartDate, leaveEndDate, leaveStartTime, leaveEndTime);
    const resultDiffDay = resultDifftSec / 86400000;
    if (resultDiffDay === 1) {
      return false;
    }

    if (resultDiffDay > 1) {
      return true;
    }

    if (resultDiffDay < 1) {
      return false;
    }
  },

  onDiffDateTime(startDate, endDate, startTime, endTime) {
    const startTimeTemp = `${startDate} ${startTime}`;
    const endTimeTemp = `${endDate} ${endTime}`;
    return moment(endTimeTemp, 'YYYY-MM-DD HH-mm').diff(moment(startTimeTemp, 'YYYY-MM-DD HH-mm'));
  },

  onCompareTime(startDate, endDate, startTime, endTime) {
    const startTimeTemp = `${startDate} ${startTime}`;
    const endTimeTemp = `${endDate} ${endTime}`;
    if (startTimeTemp === endTimeTemp) {
      return true;
    }
    const isBefore = moment(moment(startTimeTemp, 'YYYY-MM-DD HH-mm')).isBefore(moment(endTimeTemp, 'YYYY-MM-DD HH-mm'));
    return isBefore;
  },

  // 前后一天处理
  onGetDateAfterDate(endDate, scaleStep) {
    // scaleStep 1 后一天
    // scaleStep -1 前一天
    for (let i = 1; ; i += 1) {
      const handleDate = new Date(endDate);
      handleDate.setHours((new Date(endDate).getHours()) + (scaleStep * i));
      if (handleDate.getDate() !== new Date(endDate).getDate()) {
        // 日期月份 天 加0
        let month = 0;
        if (`${handleDate.getMonth()}` < 9) {
          month = `${'0'}${handleDate.getMonth() + 1}`;
        } else {
          month = `${handleDate.getMonth() + 1}`;
        }
        let day = 0;
        if (`${handleDate.getDate()}` <= 9) {
          day = `${'0'}${handleDate.getDate()}`;
        } else {
          day = `${handleDate.getDate()}`;
        }
        const year = `${handleDate.getYear() + 1900}`;
        return `${year}${'-'}${month}${'-'}${day}`;
      }
    }
  },

  onGetNextDate(date) {
    let d = new Date(date);
    d = +d + (1000 * 60 * 60 * 24);
    d = new Date(d);
    // return d;
    // 格式化
    return `${d.getFullYear()}${'-'}${d.getMonth() + 1}${'-'}${d.getDate()}`;
  },

  getMinutesFiltered(minutes) {
    let minutesTemp = '';
    if (_.isEmpty(minutes)) {
      const currentMinutes = this.getMinutes();
      minutesTemp = parseInt(currentMinutes / 5.0) * 5;
    } else {
      minutesTemp = parseInt(minutes / 5.0) * 5;
    }
    return `${moment().minutes(minutesTemp).format('mm')}`;
  },

  onCreateDateTimeParam(dateValue) {
    const dateTimeArr = String(dateValue).split(' ');
    const dateArr = String(dateTimeArr[0]).split('-');
    const timeArr = String(dateTimeArr[1]).split(':');
    const minute = this.getMinutesFiltered(timeArr[1]);

    const dateParams = {};
    dateParams.year = dateArr[0];
    dateParams.month = dateArr[1];
    dateParams.day = dateArr[2];
    dateParams.hour = timeArr[0];
    dateParams.minute = minute;
    return dateParams;
  },

  onHandleDateTimeValue(dateTimeValue) {
    return String(dateTimeValue).split(' ');
  },

  // 多天模式下时间比较
  onCompareDateTime(selectDate, selectTime, middleTime) {
    const selectStartDateTime = `${selectDate} ${selectTime}`;
    const selectEndDateTime = `${selectDate} ${middleTime}`;
    if (selectStartDateTime === selectEndDateTime) {
      return true;
    }
    return moment(moment(selectEndDateTime, 'YYYY-MM-DD HH-mm')).isBefore(moment(selectEndDateTime, 'YYYY-MM-DD HH-mm'));
  },
};