import I18n from 'react-native-i18n';

module.exports = {
  get7DatesArr(date) {
    let datt = date.split('-');//这边给定一个特定时间
    let d1 = new Date(datt[0], datt[1] - 1, datt[2]);
    let d2 = new Date(datt[0], datt[1] - 1, datt[2]);
    let d3 = new Date(datt[0], datt[1] - 1, datt[2]);
    let d4 = new Date(datt[0], datt[1] - 1, datt[2]);
    let d5 = new Date(datt[0], datt[1] - 1, datt[2]);
    let d6 = new Date(datt[0], datt[1] - 1, datt[2]);
    let d7 = new Date(datt[0], datt[1] - 1, datt[2]);
    const dates = [];
    d1.setDate(d1.getDate() + 1);
    const month1 = d1.getMonth() + 1;
    dates.push(d1.getFullYear() + "-" + (month1 < 10 ? ('0' + month1) : month1) + "-" + (d1.getDate() < 10 ? ('0' + d1.getDate()) : d1.getDate()));
    d2.setDate(d2.getDate() + 2);
    const month2 = d2.getMonth() + 1;
    dates.push(d2.getFullYear() + "-" + (month2 < 10 ? ('0' + month2) : month2) + "-" + (d2.getDate() < 10 ? ('0' + d2.getDate()) : d2.getDate()));
    d3.setDate(d3.getDate() + 3);
    const month3 = d3.getMonth() + 1;
    dates.push(d3.getFullYear() + "-" + (month3 < 10 ? ('0' + month3) : month3) + "-" + (d3.getDate() < 10 ? ('0' + d3.getDate()) : d3.getDate()));
    d4.setDate(d4.getDate() + 4);
    const month4 = d4.getMonth() + 1;
    dates.push(d4.getFullYear() + "-" + (month4 < 10 ? ('0' + month4) : month4) + "-" + (d4.getDate() < 10 ? ('0' + d4.getDate()) : d4.getDate()));
    d5.setDate(d5.getDate() + 5);
    const month5 = d5.getMonth() + 1;
    dates.push(d5.getFullYear() + "-" + (month5 < 10 ? ('0' + month5) : month5) + "-" + (d5.getDate() < 10 ? ('0' + d5.getDate()) : d5.getDate()));
    d6.setDate(d6.getDate() + 6);
    const month6 = d6.getMonth() + 1;
    dates.push(d6.getFullYear() + "-" + (month6 < 10 ? ('0' + month6) : month6) + "-" + (d6.getDate() < 10 ? ('0' + d6.getDate()) : d6.getDate()));
    d7.setDate(d7.getDate() + 7);
    const month7 = d7.getMonth() + 1;
    dates.push(d7.getFullYear() + "-" + (month7 < 10 ? ('0' + month7) : month7) + "-" + (d7.getDate() < 10 ? ('0' + d7.getDate()) : d7.getDate()));
    return dates;
  },
  getDateAfter7Str(date) {
    let datt = date.split('-');//这边给定一个特定时间
    let newDate = new Date(datt[0], datt[1], datt[2]);
    let befminuts = newDate.getTime() + 1000 * 60 * 60 * 24 * parseInt(7);//计算前几天用减，计算后几天用加，最后一个就是多少天的数量
    let beforeDat = new Date;
    beforeDat.setTime(befminuts);
    let befMonth = beforeDat.getMonth() + 1;
    let mon = befMonth >= 10 ? befMonth : '0' + befMonth;
    let befDate = beforeDat.getDate();
    let da = befDate >= 10 ? befDate : '0' + befDate;
    let resultDate = beforeDat.getFullYear() + "-" + mon + "-" + (da < 10 ? ('0' + da) : da);
    return resultDate;
  },
  getMonthAfter7(date) {
    let datt = date.split('-');//这边给定一个特定时间
    let da = new Date(datt[0], datt[1], datt[2]);
    da.setDate(da.getDate() + 7);
    return da.getMonth();
  },
  getWeek(date) {
    let datt = date.split('-');//这边给定一个特定时间
    let da = new Date(datt[0], datt[1] - 1, datt[2]);
    let weekday = new Array(7);
    weekday[0] = I18n.t('mobile.consts.week.sunday');
    weekday[1] = I18n.t('mobile.consts.week.monday');
    weekday[2] = I18n.t('mobile.consts.week.tuesday');
    weekday[3] = I18n.t('mobile.consts.week.wednesday');
    weekday[4] = I18n.t('mobile.consts.week.thurday');
    weekday[5] = I18n.t('mobile.consts.week.friday');
    weekday[6] = I18n.t('mobile.consts.week.saturday');
    return weekday[da.getDay()];
  },
  getDay(date) {
    let datt = date.split('-');//这边给定一个特定时间
    let da = new Date(datt[0], datt[1], datt[2]);
    return da.getDate();
  },
}