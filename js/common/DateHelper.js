/** 日期处理 */

import moment from 'moment';

module.exports = {
  // 返回 YYYY-MM-DD 格式日期
  date(dateTime) {
    const date = moment(dateTime, ['YYYY-MM-DD HH:mm', 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD']).format('YYYY-MM-DD');
    return date;
  },
  // 返回 HH:mm 格式时间
  hourMinute(dateTime) {
    const time = moment(dateTime, ['YYYY-MM-DD HH:mm', 'YYYY-MM-DD HH:mm:ss', 'HH:mm:ss']).format('HH:mm');
    return time;
  },
  // 返回 YYYY-MM-DD HH:mm:ss
  formatDate(dateTime) {
    const date = moment(dateTime, ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm', 'YYYY-MM-DD', 'YYYY-MM', 'HH:mm', 'HH:mm:ss']).format('YYYY-MM-DD HH:mm:ss');
    return date;
  },

  punchDate(dateTime) {
    const date = moment(dateTime, ['YYYY-MM-DD']).toObject();
    return `${date.months+1}月${date.date}日`;
  },
  getNowFormatDate() {
    let date = new Date();
    let seperator1 = "-";
    let seperator2 = ":";
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    if (hours >= 0 && hours <= 9) {
      hours = "0" + hours;
    }
    if (minutes >= 0 && minutes <= 9) {
      minutes = "0" + minutes;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      + " " + hours + seperator2 + minutes;
    return currentdate;
  }
};