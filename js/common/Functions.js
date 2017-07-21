import _ from 'lodash';
import moment from 'moment';
import Des from '@remobile/react-native-des';
import I18n from 'react-native-i18n';
import realm from '@/realm';
import { desKey, companyCodeList } from './Consts';
import { languages, languageType } from './LanguageSettingData';
import { device, keys } from './Util';

module.exports = {
  // 获取当前日期并格式化 yyyy-mm-dd
  getNowFormatDate() {
    return moment().format('YYYY-MM-DD');
  },

  // 获取日期：年-月-日
  createDateData() {
    const date = {};
    _.range(2015, 2018).map(year => {
      const yearKey = `${year}`;
      date[yearKey] = {};

      _.range(12).map(month => {
        const mon = `0${month + 1}`.substr(-2);
        const monthKey = `${mon}`;
        date[yearKey][monthKey] = [];
        date[yearKey][monthKey] = _.range(moment(`${year}-${mon}`).daysInMonth()).map((day, i) => {
          return date[yearKey][monthKey][i] = `${`0${day + 1}`.substr(-2)}`;
        });
      });
    });
    return date;
  },

  // 获取日期：年-月 for Salary
  createDateDataForSalary(strNumber) {
    let number = parseInt(strNumber);

    if (number > 36) {
      number = 36;
    }
    const date = {};
    const currentMonth = moment().month() + 1;
    const currentYear = moment().year();
    let startYear = currentYear;
    let decodeYear = 0;
    if (number >= currentMonth) {
      decodeYear = parseInt((number - currentMonth) / 12) + 1;
      startYear = currentYear - decodeYear;
    }

    _.range(startYear, (currentYear + 1)).map(year => {
      const yearKey = `${year}`;
      date[yearKey] = [];

      if (startYear == currentYear) {
        _.range((number + 1)).map(month => {
          const mon = `0${(currentMonth - number) + month}`.substr(-2);
          const monthKey = `${mon}`;
          return date[yearKey][month] = monthKey;
        });
      } else {
        if (year == startYear) {
          const monthLeft = (number + 1) - ((currentYear - startYear - 1) * 12) - currentMonth;
          _.range(monthLeft).map(month => {
            const mon = `0${(12 - monthLeft) + month + 1}`.substr(-2);
            const monthKey = `${mon}`;
            return date[yearKey][month] = monthKey;
          });
        } else if (year == currentYear) {
          _.range(currentMonth).map(month => {
            const mon = `0${month + 1}`.substr(-2);
            const monthKey = `${mon}`;
            return date[yearKey][month] = monthKey;
          });
        } else {
          _.range(12).map(month => {
            const mon = `0${month + 1}`.substr(-2);
            const monthKey = `${mon}`;
            return date[yearKey][month] = monthKey;
          });
        }
      }
    });
    return date;
  },

  // 获取小时数组
  createHoursArray() {
    return _.range(24).map(item => `${moment().hours(item).format('HH')}`);
  },

  // 获取分钟数组
  createMinutesArray() {
    return _.range(60).map(item => `${moment().minutes(item).format('mm')}`);
  },

  // 获取分钟数组（以5分钟间隔）
  createMinutesArrayByFilter() {
    return _.range(0, 60, 5).map(item => `${moment().minutes(item).format('mm')}`);
  },

  // 得到年份 yyyy
  getYear() {
    return moment().year();
  },

  // 得到月份 mm
  getMonth() {
    // return moment().month(moment().month()).format('MM');
    return moment().format('MM');
  },

  // 得到月份 m
  getOriginMonth() {
    return moment().add(1, 'M').month();
  },

  // 得到日期 dd
  getDay() {
    return moment().format('DD');
  },

  // 得到小时
  getHours() {
    return `${moment().hours(moment().hour()).format('HH')}`;
  },

  // 得到分钟
  getMinutes() {
    return `${moment().minutes(moment().minute()).format('mm')}`;
  },

  // 得到当前的分钟数目
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

  // 获取今年某个月的天数
  getDaysAccountForMonth(month) {
    return moment(moment().month(month).format('YYYY-MM'), 'YYYY-MM').daysInMonth();
  },

  // 截取字符中不包含最后一位的数据
  getSubInfo(str, sLength) {
    return str.substring(0, sLength);
  },

  // 判断是上午、下午、昨天、还是星期几，最后是显示日期2016-11-23
  getDateByCompared(str, language, getYYYYMMDDFormat) {
    // 获取当前的时间
    const timeNow = moment().format('YYYY-MM-DD');
    // 获取时间信息
    const strTemp = (str.length > 10) ? str.substring(0, 10) : str;
    // 判断是否是今天
    if (moment(strTemp).isSame(timeNow)) {
      // 设置标准格式的日期
      const tempDate = moment(str).format('YYYY-MM-DD HH:mm');
      const timeTemp = tempDate.substring(10, tempDate.length).split(':');
      // 设置标准格式的时间
      let lastTimeTemp = tempDate.substring(10, tempDate.length);
      // 判断是上午还是下午
      if (parseInt(timeTemp[0]) > 12) {
        const hourTemp = ((parseInt(timeTemp[0]) - 12) > 9) ? (parseInt(timeTemp[0]) - 12) : `0${(parseInt(timeTemp[0]) - 12)}`;
        lastTimeTemp = ` ${hourTemp}:${timeTemp[1]}`;
        if (language === 'EN-US') {
          return `${lastTimeTemp} ${I18n.t('mobile.module.notification.notiafternoon')}`;
        }
        return `${I18n.t('mobile.module.notification.notiafternoon')}${lastTimeTemp}`;
      }
      if (language === 'EN-US') {
        return `${lastTimeTemp} ${I18n.t('mobile.module.notification.notimorning')}`;
      }
      return `${I18n.t('mobile.module.notification.notimorning')}${lastTimeTemp}`;
    }
    // 判断是否是昨天
    if (moment(strTemp).isSame(moment().subtract(1, 'days').format('YYYY-MM-DD'))) {
      return I18n.t('mobile.module.notification.notiyesterday');
    }
    // 判断是否在本周内，显示星期几
    const dayOfWeekNow = moment().format('d');
    if (!moment(strTemp).isBefore(moment().subtract(dayOfWeekNow, 'days').format('YYYY-MM-DD'))) {
      const dayOfWeek = moment(strTemp).format('d');
      switch (parseInt(dayOfWeek)) {
        case 0: return I18n.t('mobile.consts.week.sunday');
        case 1: return I18n.t('mobile.consts.week.monday');
        case 2: return I18n.t('mobile.consts.week.tuesday');
        case 3: return I18n.t('mobile.consts.week.wednesday');
        case 4: return I18n.t('mobile.consts.week.thurday');
        case 5: return I18n.t('mobile.consts.week.friday');
        case 6: return I18n.t('mobile.consts.week.saturday');
        default: break;
      }
    }
    // 显示具体的时间
    return getYYYYMMDDFormat(strTemp);
  },

  // 获取APP当前应该使用的语言
  getCurrentLanguage() {
    return new Promise((resolve, reject) => {
      const configLan = realm.objects('Config').filtered('name="language"');
      let language;
      if (configLan.length != 0 && configLan[0].value != '0') {
        language = languages[parseInt(configLan[0].value) - 1];
      } else {
        let k = 1;
        languageType.map(item => {
          if (device.mobileLocale == item) {
            k = languageType.indexOf(item);
          }
          return true;
        });
        language = languages[k];
      }
      resolve(language);
    });
  },

  // 统一加密规则
  encrypt(value, salt = desKey) {
    return new Promise((resolve, reject) => {
      Des.encrypt(value, salt, (base64) => {
        resolve(base64);
      }, () => null);
    });
  },

  // 统一解密规则
  decrypt(base64, salt = desKey) {
    return new Promise((resolve, reject) => {
      Des.decrypt(base64, salt, (value) => {
        resolve(value);
      }, () => null);
    });
  },

  // 获取当前月份的前几个月
  createTwelveMonths(number) {
    let monthNumber;
    if (number <= 0) {
      monthNumber = 0;
    } else if (number > 36) {
      monthNumber = 36;
    } else {
      monthNumber = number;
    }
    const previousMonth = moment().subtract(monthNumber, 'months').month() + 1;
    const previousYear = moment().subtract(monthNumber, 'months').year();
    const currentMonth = moment().month() + 1;
    const currentYear = moment().year();
    const yearMonthList = {};

    if (monthNumber <= 0) {
      const mon = [];
      mon.push(currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`);
      yearMonthList[currentYear] = mon;
    } else if (monthNumber > 0 && monthNumber <= 36) {
      for (let i = previousYear; i <= currentYear; i++) {
        const months = [];
        if (i == (currentYear - 1)) {
          for (let j = previousMonth; j <= 12; j++) {
            if (j < 10) {
              months.push(`0${j}`);
            } else {
              months.push(`${j}`);
            }
          }
        } else if (i == currentYear) {
          let tempMonth = currentMonth - number;
          if (currentYear != previousYear) {
            tempMonth = 1;
          }
          for (let m = tempMonth; m <= currentMonth; m++) {
            if (m < 10) {
              months.push(`0${m}`);
            } else {
              months.push(`${m}`);
            }
          }
        } else {
          for (let n = 1; n <= 12; n++) {
            if (n < 10) {
              months.push(`0${n}`);
            } else {
              months.push(`${n}`);
            }
          }
        }
        yearMonthList[i] = months;
      }
    }

    return yearMonthList;
  },

  format(input) {
    const n = parseFloat(input).toFixed(2);
    const re = /(\d{1,3})(?=(\d{3})+(?:\.))/g;
    return n.replace(re, '$1,');
  },

  // 获取版本的信息
  getVersionId(versionData, moduleData) {
    let companyCode;
    if (versionData) {
      for (let i = 0; i < versionData.length; i += 1) {
        if (versionData[i].moduleCode == moduleData) {
          companyCode = versionData[i].companyCode;
        }
      }
    } else {
      companyCode = companyCodeList.standard;
    }
    return companyCode;
  },

  // 判断是否有九宫格 某个模块权限
  checkPermissionOfModule(Module) {
    const { ModuleList } = global.loginResponseData;
    if (!ModuleList) {
      return false;
    }
    let hasPermission = false;
    let i = ModuleList.length + 1;
    while ((i -= 1)) {
      if (ModuleList[i - 1].Id == Module) {
        hasPermission = true;
        break;
      }
    }
    return hasPermission;
  },

  // 获取 YYYY-MM-DD 标准格式
  getYYYYMMDDFormat(date, formatT) {
    if (!date) {
      return '';
    }
    let format = formatT ? formatT : 'YYYY-MM-DD';
    const dateT = moment(date, format);
    if (!moment.isMoment(dateT) || !global.companyResponseData || !global.companyResponseData.config || !global.companyResponseData.config.dateConfig) {
      return date;
    }

    const formatStr = global.companyResponseData.config.dateConfig.dateMode;
    const dateY = formatStr.replace('YYYY', dateT.year());
    const dateM = dateY.replace('MM', `0${dateT.month() + 1}`.slice(-2));
    const dateD = dateM.replace('DD', `0${dateT.date()}`.slice(-2));
    return dateD;
  },

  // 获取 YYYY-MM-DD hh:mm 标准格式
  getYYYYMMDDhhmmFormat(date, formatT) {
    if (!date) {
      return '';
    }
    let format = formatT ? formatT : 'YYYY-MM-DD HH:mm';
    const dateT = moment(date, format);
    if (!moment.isMoment(dateT) || !global.companyResponseData || !global.companyResponseData.config || !global.companyResponseData.config.dateConfig) {
      return date;
    }

    const formatStr = global.companyResponseData.config.dateConfig.dateHourMinuteMode;
    const dateY = formatStr.replace('YYYY', dateT.year());
    const dateM = dateY.replace('MM', `0${dateT.month() + 1}`.slice(-2));
    const dateD = dateM.replace('DD', `0${dateT.date()}`.slice(-2));
    const dateH = dateD.replace('hh', `0${dateT.hour()}`.slice(-2));
    const datem = dateH.replace('mm', `0${dateT.minute()}`.slice(-2));
    return datem;
  },

  // 获取 YYYY-MM 标准格式
  getYYYYMMFormat(date, formatT) {
    if (!date) {
      return '';
    }
    let format = formatT ? formatT : 'YYYY-MM';
    const dateT = moment(date, format);
    if (!moment.isMoment(dateT) || !global.companyResponseData || !global.companyResponseData.config || !global.companyResponseData.config.dateConfig) {
      return date;
    }

    const formatStr = global.companyResponseData.config.dateConfig.yearMonthMode;
    const dateY = formatStr.replace('YYYY', dateT.year());
    const dateM = dateY.replace('MM', `0${dateT.month() + 1}`.slice(-2));
    return dateM;
  },

  // 获取 HH:mm 标准格式
  getHHmmFormat(date, formatT) {
    if (!date) {
      return '';
    }
    let format = formatT ? formatT : 'HH:mm';
    const dateT = moment(date, format);
    if (!moment.isMoment(dateT) || !global.companyResponseData || !global.companyResponseData.config || !global.companyResponseData.config.dateConfig) {
      return date;
    }

    const formatStr = global.companyResponseData.config.dateConfig.hourMinuteMode;
    const dateH = formatStr.replace('hh', `0${dateT.hour()}`.slice(-2));
    const datem = dateH.replace('mm', `0${dateT.minute()}`.slice(-2));
    return datem;
  },

  toThousands(num) {
    const point = num.toString().indexOf('.');
    if (point > 0) {
      const numT = num.toString();
      const temp = numT.substring(0, point);
      return (temp || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + numT.substring(point, numT.length);
    }
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '.00';
  },

  thousandBitSeparator(num) {
    var decimal = num.split('.')[1] || '';//小数部分
    var tempArr = [];
    var revNumArr = num.split('.')[0].split("").reverse();//倒序
    for (i in revNumArr) {
      tempArr.push(revNumArr[i]);
      if ((i + 1) % 3 === 0 && i != revNumArr.length - 1) {
        tempArr.push(',');
      }
    }
    var zs = tempArr.reverse().join('');//整数部分
    return decimal ? zs + '.' + decimal : zs;
  }
};