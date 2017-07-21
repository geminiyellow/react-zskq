import moment from 'moment';

module.exports = {
  // 获取星期
  getWeekText: function (date) {
    const days = moment(date).days();
    let weekText = '';
    switch (days) {
      case 0:
        weekText = '日';
        break;
      case 1:
        weekText = '一';
        break;
      case 2:
        weekText = '二';
        break;
      case 3:
        weekText = '三';
        break;
      case 4:
        weekText = '四';
        break;
      case 5:
        weekText = '五';
        break;
      case 6:
        weekText = '六';
        break;
      default:
        weekText = '';
        break;
    }
    return weekText;
  },
  getMonthText(date) {
    const month = moment(date).month();
    let monthText = '';
    switch (month) {
      case 0:
        monthText = '1月';
        break;
      case 1:
        monthText = '2月';
        break;
      case 2:
        monthText = '3月';
        break;
      case 3:
        monthText = '4月';
        break;
      case 4:
        monthText = '5月';
        break;
      case 5:
        monthText = '6月';
        break;
      case 6:
        monthText = '7月';
        break;
      case 7:
        monthText = '8月';
        break;
      case 8:
        monthText = '9月';
        break;
      case 9:
        monthText = '10月';
        break;
      case 10:
        monthText = '11月';
        break;
      case 11:
        monthText = '12月';
        break;
      default:
        monthText = '';
        break;
    }
    return monthText;
  },
};