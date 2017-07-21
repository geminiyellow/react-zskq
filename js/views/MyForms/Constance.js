import I18n from 'react-native-i18n';
import { device } from '@/common/Util';

module.exports = {
  // 加班
  FORMTYPE_PROCESSOVERTIMEFORM: 'PROCESSOVERTIMEFORM',
  // 异常
  FORMTYPE_ExceptionHandlingprocess: 'ExceptionHandlingprocess',
  // 出差
  FORMTYPE_PROCESSBUSINESSTRAVELFORM: 'PROCESSBUSINESSTRAVELFORM',
  // 请假
  FORMTYPE_PROCESSLEAVEFORM: 'PROCESSLEAVEFORM',
  // 换班
  FORMTYPE_PROCESSTRANSFERSHIFTFORM: 'PROCESSTRANSFERSHIFTFORM',
  // 换班需求
  FORMTYPE_PROCESSDEMANDPOOLFORM: 'PROCESSDEMANDPOOLFORM',
  //销假
  FORMTYPE_PROCESSCANCELFORM: 'PROCESSCANCELFORM',

  // 其他
  FORMTYPE_OTHER: 'Others',

  // 普通表单
  FORMTYPE_FLAG_NORMAL: '1',
  // 手机信息变更类型
  FORMTYPE_FLAG_MOBILE: '2',
  // 部门信息变更类型
  FORMTYPE_FLAG_DEPARTMENT: '3',
  // 蓝牙信息变更类型
  FORMTYPE_FLAG_BLUETOOTH: '4',

  // 全部
  FORMSTATUS_ALL: 'All',
  // 已通过
  FORMSTATUS_COMPLETED: 'COMPLETED',
  // 已驳回
  FORMSTATUS_REJECT: 'REJECT',
  // 已撤销
  FORMSTATUS_CANCEL: 'CANCEL',
  // 审批中
  FORMSTATUS_ACTIVE: 'ACTIVE',


  // 审核历史常量
  // 审核历史常量-全部
  History_STATUS_All: 'All',
  // 审核历史常量-通过
  History_STATUS_COMPLETED: 'COMPLETED',
  // 审核历史常量-跳签
  History_STATUS_SKIP: 'SKIP',
  // 审核历史常量-驳回
  History_STATUS_REJECT: 'REJECT',

  // 表单类型KEY
  FORMKEY_TYPES: 'KEYMYFORMTYPES',

  MenuId: {
    formtype_leave: 'leave',
    formtype_overtime: 'overtime',
    formtype_trave: 'trave',
    formtype_exception: 'exception',
    formtype_changeshift: 'changeshift',

    formstatus_approving: 'approving',
    formstatus_completed: 'completed',
    formstatus_reject: 'reject',
    formstatus_cancel: 'cancel',

    formtime_lastmonth: 'last',
    formtime_currentmonth: 'current',
  },

  // 表单详情审核流程中的状态
  getStatusName: function (status) {
    if (!status) return null;
    if (status == 'ACTIVE') return I18n.t('mobile.module.myform.state.verifying');
    if (status == 'COMPLETED') return I18n.t('mobile.module.myform.state.completed');
    if (status == 'REJECT') return I18n.t('mobile.module.myform.state.rejected');
    if (status == 'CANCEL') return I18n.t('mobile.module.myform.state.canceled');
    if (status == 'SKIP') return I18n.t('mobile.module.myform.state.skip');
    if (status == 'CREATED') return I18n.t('mobile.module.myform.state.new');
    return null;
  },

  // 获取各状态下的背景颜色
  getStatusColor: function (status) {
    if (!status) return null;
    if (status == 'ACTIVE') return '#f9bf13';
    if (status == 'COMPLETED') return '#1fd662';
    if (status == 'REJECT') return '#ff8581';
    if (status == 'CANCEL' || status == '1') return '#999999';
    return '#1fd662';
  },

  // 我的表单筛选条件各状态对应的参数
  getStatusParam: function (status) {
    if (!status) return null;
    if (status == 'mobile.module.myform.all') return 'All';
    if (status == 'mobile.module.myform.state.verifying') return 'ACTIVE';
    if (status == 'mobile.module.myform.state.completed') return 'COMPLETED';
    if (status == 'mobile.module.myform.state.rejected') return 'REJECT';
    if (status == 'mobile.module.myform.state.canceled') return 'CANCEL';
    return null;
  },

  // 审核历史筛选条件各状态对应的参数
  getHistoryStatusParam: function (status) {
    if (!status) return null;
    if (status == 'mobile.module.verify.all') return 'All';
    if (status == 'mobile.module.verify.handleresult.completed') return 'COMPLETED';
    if (status == 'mobile.module.verify.handleresult.reject') return 'REJECT';
    if (status == 'mobile.module.verify.handleresult.Skip') return 'SKIP';
    if (status == 'mobile.module.verify.handleresult.autocompleted') return 'AUTOCOMPLETED';
    if (status == 'mobile.module.verify.handleresult.forcecompleted') return 'FORCECOMPLETED';
    return null;
  },

  // 请假模式
  getLeaveMode: function (mode) {
    if (mode == '0') return I18n.t('mobile.module.verify.fullday');
    if (mode == '1') return I18n.t('mobile.module.verify.leave.upperhalf');
    if (mode == '2') return I18n.t('mobile.module.verify.leave.lowerhalf');
    if (mode == '3' || mode == '4') return I18n.t('mobile.module.verify.leave.bound');
    return null;
  },
  getLeaveUnit: function (unit) {
    if (unit == 'D') return I18n.t('mobile.module.leaveapply.leaveapplylasttitlebyd');
    if (unit == 'H') return I18n.t('mobile.module.leaveapply.leaveapplylasttitlebyh');
    return null;
  },

  /**
  lable:标题key
  content：内容
  ratio:fontSize / PixelRatio.get()
  language：本地语言环境
  otherspace: 要扣除的控件的边距 margin padding 之和
   */
  newLine(lable, content, ratio, language, otherspace) {
    if (!content) return false;
    const multiple = (language == 0) ? 2.5 : 1.5;
    const screenspace = device.width - otherspace - lable.length * ratio * multiple;
    const contentspace = content.length * ratio * multiple;
    // console.log('screenspace: ' + screenspace + ' width: ' + device.width);
    // console.log('reason length:  ' + content.length * ratio * multiple);
    const newline = (screenspace > contentspace) ? false : true;
    return newline;
  },

  getMonth(month, language) {
    if (month == '01') {
      if (language == 0) return '01月';
      return 'Jan';
    } else if (month == '02') {
      if (language == 0) return '02月';
      return 'Feb';
    } else if (month == '03') {
      if (language == 0) return '03月';
      return 'Mar';
    } else if (month == '04') {
      if (language == 0) return '04月';
      return 'Apr';
    } else if (month == '05') {
      if (language == 0) return '05月';
      return 'May';
    } else if (month == '06') {
      if (language == 0) return '06月';
      return 'Jun';
    } else if (month == '07') {
      if (language == 0) return '07月';
      return 'Jul';
    } else if (month == '08') {
      if (language == 0) return '08月';
      return 'Aug';
    } else if (month == '09') {
      if (language == 0) return '09月';
      return 'Sep';
    } else if (month == '10') {
      if (language == 0) return '10月';
      return 'Oct';
    } else if (month == '11') {
      if (language == 0) return '11月';
      return 'Nov';
    } else {
      if (language == 0) return '12月';
      return 'Dec';
    }
  },
};
