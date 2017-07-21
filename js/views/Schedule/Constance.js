/**
 * 排班查询常量
 */

module.exports = {
  // 平时
  ShiftType_PEACETIME: '1',
  // 假日
  ShiftType_HOLIDAY: '2',
  // 节日
  ShiftType_FESTIVAL: '3',


  getMonth(month, language) {
    if (month == '01') {
      return 'mobile.consts.month.jan';
    } else if (month == '02') {
      return 'mobile.consts.month.feb';
    } else if (month == '03') {
      return 'mobile.consts.month.mar';
    } else if (month == '04') {
      return 'mobile.consts.month.apr';
    } else if (month == '05') {
      return 'mobile.consts.month.may';
    } else if (month == '06') {
      return 'mobile.consts.month.jun';
    } else if (month == '07') {
      return 'mobile.consts.month.jul';
    } else if (month == '08') {
      return 'mobile.consts.month.aug';
    } else if (month == '09') {
      return 'mobile.consts.month.sep';
    } else if (month == '10') {
      return 'mobile.consts.month.oct';
    } else if (month == '11') {
      return 'mobile.consts.month.nov';
    }
    return 'mobile.consts.month.dec';
  },

  getWeekIndex(date, language) {
    const week = new Date(date).getDay();
    if (week == 0) {
      return 'mobile.consts.week.sunday';
    } else if (week == 1) {
      return 'mobile.consts.week.monday';
    } else if (week == 2) {
      return 'mobile.consts.week.tuesday';
    } else if (week == 3) {
      return 'mobile.consts.week.wednesday';
    } else if (week == 4) {
      return 'mobile.consts.week.thurday';
    } else if (week == 5) {
      return 'mobile.consts.week.friday';
    } else if (week == 6) {
      return 'mobile.consts.week.saturday';
    }
  },
};