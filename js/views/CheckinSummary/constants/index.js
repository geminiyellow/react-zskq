/*
*  异常申请中用到的常量
*/
import I18n from 'react-native-i18n';

module.exports = {
  // -------------设置标题的类型------------------
  // 数据分析的标题
  statisticsTitle: 1,
  // 数据列表的标题
  listTitle: 2,

  getMonth(month, language) {
    if (language == 0) {
      switch (month) {
        case '01':
          return '一月';
        case '02':
          return '二月';
        case '03':
          return '三月';
        case '04':
          return '四月';
        case '05':
          return '五月';
        case '06':
          return '六月';
        case '07':
          return '七月';
        case '08':
          return '八月';
        case '09':
          return '九月';
        case '10':
          return '十月';
        case '11':
          return '十一月';
        case '12':
          return '十二月';
        default:
          return '';
      }
    } else {
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
    }
  },

  SHOW_PICKER: 'SHOW_PICKER',

  // 异常统计
  EXCEPTION: 'exception',

  // 出勤统计
  ATTENDANCE: 'attendance',

  // 打卡统计
  PUNCH_CARD: 'punchCard',

  // 限制加班申请的附件上传
  attachmentNone: '0',
  // 只上传一张图片
  attachmentSingle: '1',
  // 可以上传多张图片
  attachmentMultiple: '2',
  // 附件上传的添加图片
  attachAdd: 'list_add_pic',

  // -------------设置附件上传的数量-------------------
  attachmentNumber: 5,
  // 删除图片
  attachDelete: 'delete',
};
