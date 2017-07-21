import { DeviceEventEmitter, InteractionManager, NativeModules } from 'react-native';

import { event } from '@/common/Util';
import { LoadingManager } from '@/common/Loading';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
import I18n from 'react-native-i18n';
import moment from 'moment';
import _ from 'lodash';

import { GET, POST } from '@/common/Request';
import { messageType, companysCode } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import {
  getCreadits, getCreaditsNew, getLeaveApplyType, getLeaveApplyLast, getLeaveApplyLastDD,
  getEmployeeLeaveReasonList, SubmitEmployeeLeaveFormRequest, SubmitEmployeeLeaveFormRequestDD,
  SubmitEmployeeLeaveFormRequestByLearning
} from '@/common/api';
import LeaveDateUtil from './LeaveDateUtil';

const { RNManager } = NativeModules;
const customizedCompanyHelper = new CustomizedCompanyHelper();

module.exports = {

  // ////////////////////////////////////////////////////////////////////////////////////////////////////
  // 接口调用

  onGetCompanyCode() {
    return customizedCompanyHelper.getPrefix();
  },

  // 获取额度数据
  onOpenCreaditsModal() {
    // 请求数据
    GET(getCreadits(this.onGetCompanyCode()), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        DeviceEventEmitter.emit(event.REFRESH_LEAVE_CREADITS_DATA, responseData);
      });
    }, (message) => {
      showMessage(messageType.error, JSON.stringify(message));
    }, 'getCreadits');
  },

  // 获取额度数据new
  onGetLeaveBalance() {
    if (this.onGetCompanyCode() === '_Custom') {
      // 请求数据
      GET(getCreadits(this.onGetCompanyCode()), (responseData) => {
        InteractionManager.runAfterInteractions(() => {
          DeviceEventEmitter.emit(event.REFRESH_LEAVE_CREADITS_DATA, responseData);
        });
      }, (message) => {
        showMessage(messageType.error, JSON.stringify(message));
      }, 'getCreadits');
    } else {
      // 请求数据
      GET(getCreaditsNew(), (responseData) => {
        InteractionManager.runAfterInteractions(() => {
          DeviceEventEmitter.emit(event.REFRESH_LEAVE_CREADITS_DATA, responseData);
        });
      }, (message) => {
        showMessage(messageType.error, JSON.stringify(message));
      }, 'getCreadits');
    }
  },

  onFetchLeaveTypeDataByServer() {
    // 数据请求
    LoadingManager.start();
    GET(getLeaveApplyType(this.onGetCompanyCode()), (responseData) => {
      LoadingManager.done();
      InteractionManager.runAfterInteractions(() => {
        DeviceEventEmitter.emit(event.REFRESH_LEAVE_TYPE_REQ_DATA, responseData);
      });
    }, (message) => {
      LoadingManager.done();
      showMessage(messageType.error, JSON.stringify(message));
    }, 'getLeaveApplyType');
  },

  onRequestDuration(params) {
    GET(getLeaveApplyLast(this.onGetCompanyCode(), params), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        // 发出通知，请求已经处理完毕
        DeviceEventEmitter.emit(event.REFRESH_LEAVE_DURATION_DATA, responseData);
      });
    }, (message) => {
      InteractionManager.runAfterInteractions(() => {
        DeviceEventEmitter.emit(event.REFRESH_LEAVE_DURATION_DATA, '');
        showMessage(messageType.error, JSON.stringify(message));
      });
    }, 'getLeaveApplyLast');
  },

  onRequestDurationDD(params) {
    GET(getLeaveApplyLastDD(this.onGetCompanyCode(), params), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        // 发出通知，请求已经处理完毕
        DeviceEventEmitter.emit(event.REFRESH_LEAVE_DURATION_DATA, responseData);
      });
    }, (message) => {
      InteractionManager.runAfterInteractions(() => {
        DeviceEventEmitter.emit(event.REFRESH_LEAVE_DURATION_DATA, '');
        showMessage(messageType.error, JSON.stringify(message));
      });
    }, 'getLeaveApplyLastDD');
  },

  onRequestReason() {
    // 数据请求
    GET(getEmployeeLeaveReasonList(this.onGetCompanyCode()), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        DeviceEventEmitter.emit(event.REFRESH_LEAVE_REASON_DATA, responseData);
      });
    }, (message) => {
      showMessage(messageType.error, JSON.stringify(message));
      DeviceEventEmitter.emit(event.REFRESH_LEAVE_REASON_DATA, '');
    }, 'getEmployeeLeaveReasonList');
  },

  onSubmitLeaveApply(params) {
    // 提交接口
    RNManager.showLoading('');
    POST(SubmitEmployeeLeaveFormRequest(this.onGetCompanyCode()), params, (responseData) => {
      RNManager.hideLoading();
      InteractionManager.runAfterInteractions(() => {
        DeviceEventEmitter.emit(event.REFRESH_LEAVE_SUBMIT, true);
        showMessage(messageType.success, I18n.t('mobile.module.leaveapply.leaveapplysuccess'));
      });
    }, (message) => {
      RNManager.hideLoading();
      showMessage(messageType.error, JSON.stringify(message));
    });
  },

  onSubmitLeaveApplyDD(params) {
    // 提交接口
    RNManager.showLoading('');
    POST(SubmitEmployeeLeaveFormRequestDD(this.onGetCompanyCode()), params, (responseData) => {
      RNManager.hideLoading();
      InteractionManager.runAfterInteractions(() => {
        DeviceEventEmitter.emit(event.REFRESH_LEAVE_SUBMIT, true);
        showMessage(messageType.success, I18n.t('mobile.module.leaveapply.leaveapplysuccess'));
      });
    }, (message) => {
      RNManager.hideLoading();
      showMessage(messageType.error, JSON.stringify(message));
    });
  },

  onSubmitLeaveApplyByLearning(params) {
    // 提交接口
    RNManager.showLoading('');
    POST(SubmitEmployeeLeaveFormRequestByLearning(this.onGetCompanyCode()), params, (responseData) => {
      RNManager.hideLoading();
      InteractionManager.runAfterInteractions(() => {
        DeviceEventEmitter.emit(event.REFRESH_LEAVE_SUBMIT, true);
        showMessage(messageType.success, I18n.t('mobile.module.leaveapply.leaveapplysuccess'));
      });
    }, (message) => {
      RNManager.hideLoading();
      showMessage(messageType.error, JSON.stringify(message));
    });
  },

  // ////////////////////////////////////////////////////////////////////////////////////////////////////
  // 工具方法

  // 提交数据
  onSubmitLeaveReqClick(params, isDD) {
    // session判断
    // 获取用户的sessionId
    if (_.isEmpty(global.loginResponseData)) {
      showMessage(messageType.error, I18n.t('mobile.module.leaveapply.leaveapplyloginoutdate'));
      return;
    }
    if (_.isEmpty(params)) {
      return;
    }
    // 请假类型空判断
    if (_.isEmpty(params.leaveType)) {
      showMessage(messageType.error, I18n.t('mobile.module.leaveapply.leaveapplytypeempty'));
      return;
    }
    // 如果请假类型为默认值
    if (params.leaveType === I18n.t('mobile.module.leaveapply.leaveapplytypedefault')) {
      showMessage(messageType.error, I18n.t('mobile.module.leaveapply.leaveapplytypedefault'));
      return;
    }
    // 获取请假类型id code
    const leaveId = params.leaveId;
    // leaveId 不能为空
    if (_.isEmpty(leaveId)) {
      showMessage(messageType.error, I18n.t('mobile.module.leaveapply.leaveapplytypeparamerror'));
      return;
    }
    if (params.leaveModalIndex === 0) {
      showMessage(messageType.error, I18n.t('leaveApplyModalParamError'));
      return;
    }
    // 请假开始日期空判断
    if (_.isEmpty(params.leaveStartDate) || params.leaveStartDate === I18n.t('mobile.module.leaveapply.leaveapplydatedefault')) {
      showMessage(messageType.error, I18n.t('leaveApplyStartDateEmpty'));
      return;
    }
    // 请假结束日期空判断
    if (_.isEmpty(params.leaveEndDate) || params.leaveEndDate === I18n.t('mobile.module.leaveapply.leaveapplydatedefault')) {
      showMessage(messageType.error, I18n.t('leaveApplyEndDateEmpty'));
      return;
    }
    // 请假时间空判断
    // 开始时间不能为空
    if (_.isEmpty(params.leaveStartTime)) {
      showMessage(messageType.error, I18n.t('mobile.module.leaveapply.leaveapplystarttimeempty'));
      return;
    }
    // 结束时间不能为空
    if (_.isEmpty(params.leaveEndTime)) {
      showMessage(messageType.error, I18n.t('mobile.module.leaveapply.leaveapplyendtimeempty'));
      return;
    }
    switch (params.leaveModalIndex) {
      case 1:
      case 4:
      case 5:
        // 只判断日期
        if (!this.onCompareDate(params.leaveStartDate, params.leaveEndDate)) {
          showMessage(messageType.error, I18n.t('mobile.module.leaveapply.leaveapplysatrtdateoverenddate'));
          return;
        }
        break;
      case 6:
        // 只判断日期时间
        if (!LeaveDateUtil.onCompareTime(params.leaveStartDate, params.leaveEndDate, params.leaveStartTime, params.leaveEndTime)) {
          showMessage(messageType.error, I18n.t('mobile.module.leaveapply.leaveapplystarttimeoverendtime'));
          return;
        }
        break;
      default:
        break;
    }
    // 请假时长判断
    if (`${params.leaveLast}` === '0.0' || `${params.leaveLast}` === '0') {
      showMessage(messageType.error, `${I18n.t('mobile.module.leaveapply.leaveapplylastempty')}`);
      return;
    }
    if (params.leaveLast === 0) {
      showMessage(messageType.error, `${I18n.t('mobile.module.leaveapply.leaveapplylastempty')}`);
      if (params.leaveUnit === '0') {
        showMessage(messageType.error, `${I18n.t('leaveApplyLastEmptyByD')}`);
        return;
      }
      if (params.leaveUnit === '1') {
        showMessage(messageType.error, `${I18n.t('leaveApplyLastEmptyByH')}`);
        return;
      }
      showMessage(messageType.error, `${I18n.t('leaveApplyLastEmptyByH')}`);
      return;
    }
    if (params.leaveLast === 0) {
      if (params.leaveUnit === '0') {
        showMessage(messageType.error, `${I18n.t('leaveApplyLastEmptyByD')}`);
        return;
      }
      if (params.leaveUnit === '1') {
        showMessage(messageType.error, `${I18n.t('leaveApplyLastEmptyByH')}`);
        return;
      }
      showMessage(messageType.error, `${I18n.t('leaveApplyLastEmptyByH')}`);
      return;
    }
    // 请假原因空判断
    if (_.isEmpty(params.leaveReason)) {
      showMessage(messageType.error, I18n.t('mobile.module.leaveapply.leaveapplyreasonempty'));
      return;
    }
    if (params.leaveReason === I18n.t('mobile.module.leaveapply.leaveapplyreason')) {
      showMessage(messageType.error, I18n.t('mobile.module.leaveapply.leaveapplyreasondefault'));
      return;
    }
    // 请假附件空判断
    if (customizedCompanyHelper.getCompanyCode() === companysCode.Estee) {
      // 病假必须上传附件 雅诗兰黛
      // 18代表病假
      if (leaveId === '18') {
        if (_.isEmpty(params.attachmentList)) {
          showMessage(messageType.error, I18n.t('mobile.module.leaveapply.leaveapplyattactempty'));
          return;
        }
      }
    } else {
      // 当需要上传附件的情况
      // 比较请假时长与后台配置请假允许的最大时长
      switch (params.isMustNeedAttach) {
        case 'Y':
          if (params.leaveDurationAmount === 0) {
            if (_.isEmpty(params.attachmentList)) {
              showMessage(messageType.error, I18n.t('mobile.module.leaveapply.leaveapplyattactempty'));
              return;
            }
          } else {
            // 时长转化
            if (params.leaveUnit === 0) {
              const last = params.leaveLast * 8;
              params.leaveLast = last;
            }
            if (params.leaveLast > params.leaveDurationAmount) {
              // 请假时长大于允许的最大时长，必须上传附件
              // 请假时长小于等于允许的最大时长，可以不用上传附件
              if (_.isEmpty(params.attachmentList)) {
                showMessage(messageType.error, I18n.t('mobile.module.leaveapply.leavelastoveramount'));
                return;
              }
            }
          }
          break;
        default:
          break;
      }
    }

    // 根据公司代码切换请假模式id
    let leaveModalParam = '';
    if (customizedCompanyHelper.getCompanyCode() === companysCode.Estee) {
      leaveModalParam = this.onShiftLeavemodalIdToName(params.leaveModalIndex);
    } else if (customizedCompanyHelper.getCompanyCode() === companysCode.Gant) {
      leaveModalParam = this.onShiftLeavemodalIdToName(params.leaveModalIndex);
    } else {
      leaveModalParam = params.leaveModalIndex - 1;
    }

    const leaveParam = {};
    leaveParam.SessionId = global.loginResponseData.SessionId;
    leaveParam.LeaveId = params.leaveId;
    leaveParam.LeaveType = params.leaveType;
    // leavecode
    if (this.onGetCompanyCode() === '_Custom') {
      leaveParam.LeaveCode = params.leaveCode;
    }
    leaveParam.LeaveMode = leaveModalParam;
    leaveParam.StartDate = params.leaveStartDate;
    leaveParam.EndDate = params.leaveEndDate;
    leaveParam.StartTime = params.leaveStartTime;
    leaveParam.EndTime = params.leaveEndTime;
    leaveParam.ReasonId = params.reasonId;
    leaveParam.Remark = params.leaveRemark;
    leaveParam.LeaveUnit = params.leaveUnit;
    leaveParam.IsFixedPeriod = params.isFixedPeriod;
    leaveParam.TotalHours = params.leaveLast;

    //////////////////////////////////////////////////////////////////////////////////
    // 乐宁教育控制
    if (customizedCompanyHelper.getCompanyCode().toLowerCase() == 'lening') {
      this.employeeType = global.loginResponseData.EmployeeTypeId;
      switch (this.employeeType) {
        case '16_0':
        case '16_2':
          if (params.leaveId == '18' || params.leaveId == '19') {
            if (!this.onValidateLearningData(params)) {
              return;
            }
            leaveParam.ClassHours = params.leaveClassHour;
            leaveParam.AdministrativeOffice = params.leaveOfficeHour;
          } else {
            leaveParam.ClassHours = '0';
            leaveParam.AdministrativeOffice = '0';
          }
          break;
        case '16_1':
          if (params.leaveId == '18') {
            if (!this.onValidateLearningData(params)) {
              return;
            }
            leaveParam.ClassHours = params.leaveClassHour;
            leaveParam.AdministrativeOffice = params.leaveOfficeHour;
          } else {
            leaveParam.ClassHours = '0';
            leaveParam.AdministrativeOffice = '0';
          }
          break;
        default:
          // 其他假别传0
          leaveParam.ClassHours = '0';
          leaveParam.AdministrativeOffice = '0';
          break;
      }
      leaveParam.CompanyCode = customizedCompanyHelper.getCompanyCode();
    }
    leaveParam.AttachmentList = params.attachmentList;

    if (isDD) {
      leaveParam.FixedCount = String(params.FixedDurationCount);
      // 乐宁教育 提交用接口
      if (customizedCompanyHelper.getCompanyCode().toLowerCase() == 'lening') {
        this.onSubmitLeaveApplyByLearning(leaveParam);
      } else {
        this.onSubmitLeaveApplyDD(leaveParam);
      }
    } else {
      this.onSubmitLeaveApply(leaveParam);
    }
  },

  // 乐宁教育验证模块
  onValidateLearningData(params) {
    // 空验证
    if (_.isEmpty(`${params.leaveClassHour}`)) {
      showMessage(messageType.error, I18n.t('mobile.module.leaveapply.leaveapplylessonperiodnull'));
      return false;
    }
    if (_.isEmpty(`${params.leaveOfficeHour}`)) {
      showMessage(messageType.error, I18n.t('mobile.module.leaveapply.leaveapplyadministrativeofficenull'));
      return false;
    }
    // 非空的情况下 验证课时与行政坐班之和
    const classhour = parseFloat(params.leaveClassHour);
    const officeHour = parseFloat(params.leaveOfficeHour);
    if (parseFloat(params.leaveLast) != (classhour + officeHour)) {
      showMessage(messageType.error, I18n.t('mobile.module.leaveapply.leaveapplytotalerr'));
      return false;
    }
    return true;
  },

  // 获取选择的数据
  onGetPickerData(type) {
    const params = {};
    switch (type) {
      case '1':
        // 类型
        params.itemType = type;
        // 选择框的年月日
        params.selectYear = selectYear;
        params.selectMonth = selectMonth;
        params.selectDay = selectDay;
        params.selectDate = selectDate;
        break;
      case '2':
        // 类型
        params.itemType = type;
        // 选择框的开始时间
        params.selectHour = selectHour;
        params.selectMinute = selectMinute;
        params.selectTime = selectTime;
        break;
      case '3':
        // 类型
        params.itemType = type;
        // 选择框的开始时间
        params.selectYear = selectYear;
        params.selectMonth = selectMonth;
        params.selectDay = selectDay;
        params.selectMinute = selectMinute;
        params.selectTime = selectTime;
        params.selectDateTime = selectDateTime;
        break;
      default: break;
    }
    return params;
  },

  // 刷新页面数据
  onSetPickerData(type, params) {
    switch (type) {
      case '1':
        // 选择框的年月日
        selectYear = params.selectYear;
        selectMonth = params.selectMonth;
        selectDay = params.selectDay;
        selectDate = params.selectDate;
        break;
      case '2':
        // 选择框的开始时间
        selectHour = params.selectHour;
        selectMinute = params.selectMinute;
        break;
      default: break;
    }
  },

  // 日期比较
  onCompareDate(startDate, endDate) {
    let isBefore = moment(startDate).isBefore(endDate);
    if (!isBefore) {
      if (moment(startDate).isSame(endDate)) {
        isBefore = true;
      }
    }
    return isBefore;
  },

  // 更新日期
  onUpdateDateTime(leaveModalId, leaveStartDate, leaveEndDate, leaveStartTime, leaveEndTime) {
    const emitParam = {};
    emitParam.leaveModalId = leaveModalId;
    emitParam.leaveStartDate = leaveStartDate;
    emitParam.leaveEndDate = leaveEndDate;
    emitParam.leaveStartTime = leaveStartTime;
    emitParam.leaveEndTime = leaveEndTime;
    DeviceEventEmitter.emit(event.REFRESH_LEAVE_DATE, emitParam);
  },

  // 日期处理
  onHandleDateTime(leaveModalId, dateParams, isShiftFromSchedule) {
    let leaveStartDate = dateParams.leaveStartDate;
    let leaveEndDate = dateParams.leaveEndDate;
    let leaveStartTime = dateParams.leaveStartTime;
    let leaveEndTime = dateParams.leaveEndTime;

    if (leaveStartDate === I18n.t('mobile.module.leaveapply.leaveapplydatedefault')) {
      leaveStartDate = '';
    }

    if (leaveEndDate === I18n.t('mobile.module.leaveapply.leaveapplydatedefault')) {
      leaveEndDate = '';
    }

    if (_.isEmpty(leaveStartDate) && !_.isEmpty(leaveEndDate)) {
      leaveStartDate = leaveEndDate;
    }

    if (!_.isEmpty(leaveStartDate) && _.isEmpty(leaveEndDate)) {
      leaveEndDate = leaveStartDate;
    }

    if (_.isEmpty(leaveStartTime)) {
      leaveStartTime = '00:00';
    }

    if (_.isEmpty(leaveEndTime)) {
      leaveEndTime = '00:00';
    }

    switch (leaveModalId) {
      case 1:
        // 日期比较
        if (!this.onCompareDate(leaveStartDate, leaveEndDate)) {
          leaveEndDate = leaveStartDate;
        }
        break;
      case 2:
      case 3:
        leaveEndDate = leaveStartDate;
        break;
      case 4:
        if (isShiftFromSchedule === 1) {
          if (!LeaveDateUtil.onCompareTime(leaveStartDate, leaveEndDate, leaveStartTime, leaveEndTime)) {
            if (!(leaveStartDate === leaveEndDate && leaveStartTime === leaveEndTime)) {
              // 日期相同 时间不同
              if (leaveStartDate === leaveEndDate && leaveStartTime !== leaveEndTime) {
                leaveEndDate = LeaveDateUtil.onGetDateAfterDate(leaveEndDate, 1);
              }
            }
          }
        }
        break;
      default:
        break;
    }

    dateParams.leaveStartDate = leaveStartDate;
    dateParams.leaveEndDate = leaveEndDate;
    dateParams.leaveStartTime = leaveStartTime;
    dateParams.leaveEndTime = leaveEndTime;
    this.onUpdateDateTime(leaveModalId, leaveStartDate, leaveEndDate, leaveStartTime, leaveEndTime);
    return dateParams;
  },

  // 请假模式id转请假名称参数
  onShiftLeavemodalIdToName(leaveModalId) {
    switch (leaveModalId) {
      case 1:
        return 'WholeDay';
      case 2:
        return 'FirstHalfDay';
      case 3:
        return 'EndHalfDay';
      case 4:
        return 'DelayWork';
      case 5:
        return 'AdvanceWork';
      case 6:
        return 'CustomTime';
      default:
        return 'WholeDay';
    }
  },
};