/*
*  通知中用到的常量
*/

import I18n from 'react-native-i18n';
import keyMirror from 'fbjs/lib/keyMirror';

module.exports = {
  actionType: keyMirror({
    // 加载请求通知数据
    IS_NOTIFICATION_LOADING: true,
    // 显示接口数据的数组
    RECEIVE_DATA_FROM_SERVER: '',
    // 获取当前的语言信息
    GET_CURRENT_LANGUAGE_BY_SET: '',
  }),

  // 点击浏览通知信息
  isNotClickContent: '0',

  // 没有点击浏览通知信息
  isClickContent: '1',

  // 加载数据
  isLoadData: 0,

  // 不加载数据
  isNotLoadData: 1,

  // 表示加载的是公司通知或公告
  isLoadNotice: 0,

  // 表示加载的是临时授权
  isLoadAuthorization: 1,

  // 表示加载的是考勤信息
  isLoadAttendance: 2,

  // 置顶
  isTop: '1',

  // 不置顶
  isNotTop: '0',

  // 存在附件
  isExistAtt: '1',

  // 不存在附件
  isNotExistAtt: '0',

  getMonth(month, language) {
    if (month == '01') {
      return I18n.t('mobile.consts.month.jan');
    } else if (month == '02') {
      return I18n.t('mobile.consts.month.feb');
    } else if (month == '03') {
      return I18n.t('mobile.consts.month.mar');
    } else if (month == '04') {
      return I18n.t('mobile.consts.month.apr');
    } else if (month == '05') {
      return I18n.t('mobile.consts.month.may');
    } else if (month == '06') {
      return I18n.t('mobile.consts.month.jun');
    } else if (month == '07') {
      return I18n.t('mobile.consts.month.jul');
    } else if (month == '08') {
      return I18n.t('mobile.consts.month.aug');
    } else if (month == '09') {
      return I18n.t('mobile.consts.month.sep');
    } else if (month == '10') {
      return I18n.t('mobile.consts.month.oct');
    } else if (month == '11') {
      return I18n.t('mobile.consts.month.nov');
    }
    return I18n.t('mobile.consts.month.dec');
  },
};
