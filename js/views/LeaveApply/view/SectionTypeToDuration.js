import {
  DeviceEventEmitter,
  View,
} from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import I18n from 'react-native-i18n';

import { event } from '@/common/Util';
import { ABORT } from '@/common/Request';

import { messageType } from '@/common/Consts';
import { showMessage } from '@/common/Message';

import LeaveModal from '@/views/LeaveApply/components/item/LeaveModalItem';
import LeaveType from '@/views/LeaveApply/components/item/LeaveTypeItem';
import LeaveStartDate from '@/views/LeaveApply/components/item/LeaveStartDateItem';
import LeaveEndDate from '@/views/LeaveApply/components/item/LeaveEndDateItem';
import LeaveStartTime from '@/views/LeaveApply/components/item/LeaveStartTimeItem';
import LeaveEndTime from '@/views/LeaveApply/components/item/LeaveEndTimeItem';
import LeaveDuration from '@/views/LeaveApply/components/item/LeaveDurationItem';
import LeaveFlexedTime from '@/views/LeaveApply/components/item/LeaveFlexedTimeItem';
import LeaveTypeDescItem from '@/views/LeaveApply/components/item/LeaveTypeDescItem';
import LeaveRepeatTimesItem from '@/views/LeaveApply/components/item/LeaveRepeatTimesItem';
import LeaveLearningItem from '@/views/LeaveApply/components/item/LeaveLearningItem';

import { getYYYYMMDDFormat, getYYYYMMDDhhmmFormat, getHHmmFormat } from '@/common/Functions';

import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
const customizedCompanyHelper = new CustomizedCompanyHelper();

import LeaveDateUtil from './../utils/LeaveDateUtil';
import LeaveUtil from './../utils/LeaveUtil';

export default class SectionTypeToDuration extends PureComponent {

  constructor(...props) {
    super(...props);
    this.isFirstEnter = 0;
    this.leaveModalIndex = 1;
    this.leaveTypeTemp = '';
    this.leaveModalNameTemp = '';
    this.leaveDurationAmount = 0;
    this.leaveUnit = '0';
    this.state = {
      textValue: 1,
    };
    // 员工类别为“中教类／外教类（老合同）”时；申请病假或事假才显示【课时】／【行政坐班】字段
    // 员工类别为“外教类（新合同）”时；申请病假时才显示
    // 员工类别为空时；申请病假或事假都不显示【课时】／【行政坐班】字段
    if (customizedCompanyHelper.getCompanyCode().toLowerCase() == 'lening') {
      this.employeeType = global.loginResponseData.EmployeeTypeId;
    }
  }

  componentDidMount() {
    // 请假类型消息监听事件
    this.listeners = [
      DeviceEventEmitter.addListener('REFRESH_VIEW_INIT', (eventBody) => {
        if (this.isFirstEnter !== 1) {
          this.isFirstEnter = 1;
        }
      }),
      DeviceEventEmitter.addListener('VIEW_INIT', (eventBody) => {
        if (this.isFirstEnter !== 0) {
          this.isFirstEnter = 0;
        }
      }),
      DeviceEventEmitter.addListener('UPDATE_SHIFT_VIEW', (eventBody) => {
        this.isShiftFromSchedule = 0;
      }),
      DeviceEventEmitter.addListener('REPEAT_INPUT_NUM_ERR', (eventBody) => {
        showMessage(messageType.error, I18n.t('mobile.module.leaveapply.leaveapplyisrepeattimesnumerr'));
      }),
      DeviceEventEmitter.addListener('REPEAT_INPUT_EMPTY_ERR', (eventBody) => {
        showMessage(messageType.error, I18n.t('mobile.module.leaveapply.leaveapplyisrepeattimesemptyerr'));
      }),
      DeviceEventEmitter.addListener('REPEAT_INPUT_TYPE_ERR', (eventBody) => {
        showMessage(messageType.error, I18n.t('mobile.module.leaveapply.leaveapplyisrepeattimestypeerr'));
      }),
      DeviceEventEmitter.addListener('CLASS_INPUT_TYPE_ERR', (eventBody) => {
        showMessage(messageType.error, I18n.t('mobile.module.leaveapply.leaveapplylessonperiodnotnum'));
      }),
      DeviceEventEmitter.addListener('OFFICE_INPUT_TYPE_ERR', (eventBody) => {
        showMessage(messageType.error, I18n.t('mobile.module.leaveapply.leaveapplyadministrativeofficenotnum'));
      }),
    ];
  }

  componentWillUnmount() {
    this.listeners && this.listeners.forEach(listener => listener.remove());
    ABORT('getLeaveApplyLast');
    ABORT('getLeaveApplyLastDD');
  }

  // 重新获取请假类型
  onFetchLeaveTypePickerData() {
    if (!this.LeaveTypeItem) {
      return;
    }
    this.LeaveTypeItem.onFetchLeaveTypeDataByServer();
  }

  // 刷新请假类型显示
  onRefreshLeaveTypeData(leaveType, dateParams, isShiftFromSchedule) {
    if (!this.LeaveTypeItem) {
      return;
    }
    this.leaveTypeTemp = leaveType;
    this.LeaveTypeItem.onRefreshLeaveTypeData(leaveType);
    this.isShiftFromSchedule = isShiftFromSchedule;
    this.onHandleLeaveTypeModal(dateParams, leaveType);
  }

  // 刷新请假模式显示值
  onRefreshLeaveModalNameByPickedValue(leaveModalName) {
    if (!this.LeaveModalItem) {
      return;
    }
    this.leaveModalNameTemp = leaveModalName;
    this.LeaveModalItem.onLeaveModalShow(true);
    this.LeaveModalItem.onRefreshLeaveModalName(this.leaveModalNameTemp);
  }

  // 隐藏请假模式
  onHideLeaveModal() {
    if (!this.LeaveModalItem) {
      return;
    }
    this.LeaveModalItem.onHideLeaveModal();
  }

  // 请假类别 请假模式 整合
  onHandleLeaveTypeModal(dateParams, leaveType) {
    if (!this.LeaveModalItem || !this.LeaveDurationItem) {
      return;
    }
    this.leaveTypeTemp = leaveType;
    // 根据请假类别名称获取对应的实体类
    const leaveTypeTo = this.onExportLeaveTypeTo(leaveType);
    // 请加时长允许的最大值
    this.leaveDurationAmount = leaveTypeTo.OVERDRAWN;

    // 初始化请假模式显示设置
    this.LeaveModalItem.onInitLeaveModalDataSource(leaveTypeTo);
    const leaveTypeDesc = leaveTypeTo.LeaveDescription;
    const isLeaveModalItemShow = this.LeaveModalItem.onExportLeaveModalShow();
    if (!_.isEmpty(leaveTypeTo.LeaveDescription)) {
      // 获取请假模式显示控制
      this.LeaveTypeDesc.onShowLeaveTypeDesc(true);
    } else {
      this.LeaveTypeDesc.onShowLeaveTypeDesc(false);
    }
    this.LeaveModalItem.onLeaveModalShow(isLeaveModalItemShow);
    // 显示leaveModal时，刷新leavemodalpicker数据源
    if (isLeaveModalItemShow) {
      // 发送通知到主页面，刷新leavemodalpicker数据源
      const leaveModalPickerData = this.LeaveModalItem.onExportLeaveModalData();
      DeviceEventEmitter.emit(event.REFRESH_LEAVE_MODAL_DATA, leaveModalPickerData);
    }
    // 刷新时长单位
    this.leaveUnit = `${leaveTypeTo.LeaveModeUnit}`;
    this.LeaveDurationItem.onRefreshLeaveDurationUnit(this.leaveUnit);
    // 判断 如果切换假别 默认的模式与上一次假别选择的模式相同则不刷新时间模块
    // 获取请假模式数据源
    if (!_.isEmpty(this.leaveModalNameTemp) && !_.isUndefined(this.leaveModalNameTemp)) {
      if (!_.isEqual(this.LeaveModalItem.onExportLeaveModalName(), this.leaveModalNameTemp)) {
        this.leaveModalNameTemp = this.LeaveModalItem.onExportLeaveModalName();
        // 时间模块控制
        // 根据请假模式控制
        this.onHandleDateTimeShow(dateParams, this.LeaveModalItem.onExportLeaveModalId());
      } else {
        this.onLeaveDurationRequest(this.leaveTypeTemp, dateParams);
      }
    } else {
      this.leaveModalNameTemp = this.LeaveModalItem.onExportLeaveModalName();
      // 时间模块控制
      // 根据请假模式控制
      this.onHandleDateTimeShow(dateParams, this.LeaveModalItem.onExportLeaveModalId());
    }
    // 刷新请假模式显示值
    this.LeaveModalItem.onRefreshLeaveModalName(this.leaveModalNameTemp);
    // 刷新index请假模式名称
    DeviceEventEmitter.emit('REFRESH_LEAVE_MODAL_NAME', this.leaveModalNameTemp);
    //////////////////////////////////////////////////////////////////////////////
    // 乐宁教育 根据假别和员工类型 判断 课时与行政坐班显示
    // 员工类别为 中教类／外教类（老合同）外教类（新合同） 显示课时与行政坐班
    // 中教类 16_0 外教类（老合同）16_2 外教类（新合同）16_1
    // 病假 18 事假 19
    switch (this.employeeType) {
      case '16_0':
      case '16_2':
        if (leaveTypeTo.LeaveId == '18' || leaveTypeTo.LeaveId == '19') {
          // 病假 事假
          this.leaveLearningItem.onUpdateItemShow(true);
        } else {
          this.leaveLearningItem.onUpdateItemShow(false);
        }
        break;
      case '16_1':
        if (leaveTypeTo.LeaveId == '18') {
          // 病假
          this.leaveLearningItem.onUpdateItemShow(true);
        } else {
          this.leaveLearningItem.onUpdateItemShow(false);
        }
        break;
      default:
        this.leaveLearningItem.onUpdateItemShow(false);
        break;
    }
  }

  // 获取请假类别TO
  onExportLeaveTypeTo(leaveType) {
    // 根据请假类别名称获取对应的实体类
    if (!this.LeaveTypeItem) {
      return;
    }
    return this.LeaveTypeItem.onExportleaveTypeMap().get(leaveType);
  }

  // 刷新请假假别说明
  onUpdateLeaveTypeDesc(descStr) {
    this.LeaveTypeDesc.omUpdateLeaveTypeDesc(descStr);
    this.LeaveTypeDesc.onShowLeaveTypeDesc(true);
  }

  onHideLeaveTypeDesc() {
    this.LeaveTypeDesc.onShowLeaveTypeDesc(false);
  }

  onExportLeaveDurationData() {
    if (!this.LeaveDurationItem) {
      return;
    }
    return this.LeaveDurationItem.onExportDurationData();
  }

  // 传出固定时段状态
  onExportLeaveFlexTimeStatus() {
    if (!this.LeaveFlexedTimeItem) {
      return;
    }
    return this.LeaveFlexedTimeItem.onExportFlexTimeStatus();
  }

  // 导出请假模式名称
  onExportLeaveModalName() {
    return this.leaveModalNameTemp;
  }

  // 固定时段显示控制
  onShowFlexTime(leaveStartDate, leaveEndDate, leaveStartTime, leaveEndTime) {
    if (!this.LeaveFlexedTimeItem) {
      return;
    }
    if (_.isUndefined(this.LeaveFlexedTimeItem)) {
      return;
    }
    const flag = LeaveDateUtil.onCalculateDateTime(leaveStartDate, leaveEndDate, leaveStartTime, leaveEndTime);

    if (flag) {
      // 显示固定时段
      // 隐藏时长底部边框
      this.LeaveFlexedTimeItem.onShowFlexTimeItem(true);
    } else {
      // 隐藏固定时段
      // 显示时长底部边框
      this.LeaveFlexedTimeItem.onShowFlexTimeItem(false);
    }
  }

  // 固定时段显示控制
  onShowFlexTimeDD(leaveModalId) {
    if (!this.LeaveFlexedTimeItem || _.isUndefined(this.LeaveFlexedTimeItem)) {
      return;
    }
    // 当前公司代码判断 乐宁教育 不显示固定时段
    if (customizedCompanyHelper.getCompanyCode().toLowerCase() == 'lening') {
      // 隐藏固定时段
      // 显示时长底部边框
      this.LeaveFlexedTimeItem.onShowFlexTimeItem(false);
      this.LeaveRepeatTimesItem.onShowItem(false, this.state.textValue);
      return;
    }
    // 获取当前repeat显示状态
    const isShow = this.LeaveFlexedTimeItem.onExportRepeatShow();
    if (leaveModalId == 1 || leaveModalId == 4) {
      // 显示固定时段
      // 隐藏时长底部边框
      if (!isShow) {
        this.LeaveFlexedTimeItem.onShowFlexTimeItem(true);
        // 刷新标题
        this.LeaveFlexedTimeItem.onUpdateTitle();
      }
    } else {
      // 隐藏固定时段
      // 显示时长底部边框
      this.LeaveFlexedTimeItem.onShowFlexTimeItem(false);
      this.LeaveRepeatTimesItem.onShowItem(false, this.state.textValue);
    }
  }

  // 隐藏固定时段
  onHideLeaveFlextime() {
    // 显示时长底部边框
    this.LeaveFlexedTimeItem.onShowFlexTimeItem(false);
  }

  // 时间模块显示控制
  // 根据请假模式id控制
  onHandleDateTimeShow(dateParams, leaveModalId) {
    if (!this.leaveStartDateItem || !this.leaveStartTimeItem || !this.leaveEndDateItem || !this.leaveEndTimeItem) {
      return;
    }
    const dateTimeParam = {};
    dateTimeParam.leaveStartDate = dateParams.leaveStartDate;
    this.leaveModalIndex = leaveModalId;
    // getYYYYMMDDFormat, getYYYYMMDDhhmmFormat, getHHmmFormat
    switch (leaveModalId) {
      case 1:
        // 全天模式
        // 开始日期始终显示
        dateTimeParam.leaveEndDate = dateParams.leaveStartDate;
        dateTimeParam.leaveStartTime = dateParams.leaveStartTime;
        dateTimeParam.leaveEndTime = dateParams.leaveEndTime;
        this.leaveStartDateItem.onRefreshLeaveStartDateValue(getYYYYMMDDFormat(dateTimeParam.leaveStartDate));
        // 显示开始日期 结束日期
        this.leaveEndDateItem.onRefreshLeaveEndDateValue(true, getYYYYMMDDFormat(dateTimeParam.leaveEndDate));
        // 隐藏开始时间 结束时间
        this.leaveStartTimeItem.onRefreshStartTime(false, true, getHHmmFormat(dateTimeParam.leaveStartTime));
        this.leaveEndTimeItem.onRefreshEndTime(false, true, getHHmmFormat(dateTimeParam.leaveEndTime));
        dateTimeParam.leaveModalId = leaveModalId;
        DeviceEventEmitter.emit(event.REFRESH_LEAVE_TIME, dateTimeParam);
        break;
      case 2:
      case 3:
        // 上半个班次
        // 开始日期始终显示
        dateTimeParam.leaveEndDate = dateParams.leaveEndDate;
        dateTimeParam.leaveStartTime = dateParams.leaveStartTime;
        dateTimeParam.leaveEndTime = dateParams.leaveEndTime;
        this.leaveStartDateItem.onRefreshLeaveStartDateValue(getYYYYMMDDFormat(dateTimeParam.leaveStartDate));
        // 显示开始日期 开始时间 结束时间
        this.leaveStartTimeItem.onRefreshStartTime(true, true, getHHmmFormat(dateTimeParam.leaveStartTime));
        this.leaveEndTimeItem.onRefreshEndTime(true, true, getHHmmFormat(dateTimeParam.leaveEndTime));
        this.leaveEndTimeItem.onFreshEndTimeRightArrowShow(false);
        this.leaveStartTimeItem.onFreshStartTimeRightArrowShow(false);
        // 隐藏 结束日期
        this.leaveEndDateItem.onRefreshLeaveEndDateValue(false, getYYYYMMDDFormat(dateTimeParam.LeaveEndDate));
        break;
      case 4:
        // 弹性模式
        dateTimeParam.leaveEndDate = dateParams.leaveEndDate;
        if (this.isShiftFromSchedule == 0) {
          dateTimeParam.leaveStartTime = '00:00';
          dateTimeParam.leaveEndTime = '00:00';
        } else {
          dateTimeParam.leaveStartTime = dateParams.leaveStartTime;
          dateTimeParam.leaveEndTime = dateParams.leaveEndTime;
        }
        dateTimeParam.leaveModalId = leaveModalId;
        DeviceEventEmitter.emit(event.REFRESH_LEAVE_TIME, dateParams);
        break;
      default:
        break;
    }
    // 请求时长
    if (_.isEmpty(dateParams.leaveStartDate) || dateParams.leaveStartDate === I18n.t('mobile.module.leaveapply.leaveapplydatedefault')) {
      return;
    }
    this.onLeaveDurationRequest(this.leaveTypeTemp, dateTimeParam);
  }

  // 请假模式名称转化请假模式id
  onShiftLeaveModalNameToId(leaveModalName) {
    if (!this.LeaveModalItem) {
      return;
    }
    return this.LeaveModalItem.onExportLeaveModalIdByName(leaveModalName);
  }

  // 导出请假模式id
  onExportLeaveModalId() {
    return this.leaveModalIndex;
  }

  // 开始日期刷新
  onRefreshLeaveSatrtDate(leaveStartDateStr) {
    if (!this.leaveStartDateItem) {
      return;
    }
    this.leaveStartDateItem.onRefreshLeaveStartDateValue(leaveStartDateStr);
  }

  // 刷新结束日期
  onRefreshLeaveEndDate(isShow, leaveEndDateStr) {
    if (!this.leaveEndDateItem) {
      return;
    }
    this.leaveEndDateItem.onRefreshLeaveEndDateValue(isShow, leaveEndDateStr);
  }

  // 刷新开始时间
  onRefreshLeaveStartTime(leaveStartTimeStr) {
    if (!this.leaveStartTimeItem) {
      return;
    }
    if (this.leaveModalIndex === 2 || this.leaveModalIndex === 3) {
      this.leaveStartTimeItem.onRefreshStartTime(true, true, leaveStartTimeStr);
    } else {
      this.leaveStartTimeItem.onRefreshStartTime(false, true, leaveStartTimeStr);
    }
  }

  // 刷新结束时间
  onRefreshLeaveEndTime(isEndDateClick, leaveEndDateStr, leaveEndTimeStr) {
    if (!this.leaveEndTimeItem || !this.leaveEndDateItem) {
      return;
    }
    // getYYYYMMDDFormat, getYYYYMMDDhhmmFormat, getHHmmFormat
    if (this.leaveModalIndex === 2 || this.leaveModalIndex === 3) {
      this.leaveEndTimeItem.onRefreshEndTime(true, true, getHHmmFormat(leaveEndTimeStr));
    } else if (this.leaveModalIndex === 1) {
      this.leaveEndTimeItem.onRefreshEndTime(false, true, getHHmmFormat(leaveEndTimeStr));
    } else if (this.leaveModalIndex === 4) {
      this.leaveEndTimeItem.onRefreshEndTime(false, true, getHHmmFormat(leaveEndTimeStr));
      // 结束日期时间在初次加载不进行结束日期刷新
      if (isEndDateClick === 0) {
        if (_.isEmpty(leaveEndDateStr) || leaveEndDateStr === I18n.t('mobile.module.leaveapply.leaveapplydatedefault')) {
          this.leaveEndDateItem.onRefreshLeaveEndDateValue(true, getYYYYMMDDFormat(`${leaveEndDateStr}`));
        } else {
          this.leaveEndDateItem.onRefreshLeaveEndDateValue(true, getYYYYMMDDhhmmFormat(`${leaveEndDateStr} ${leaveEndTimeStr}`));
        }
      }
    }
  }

  // 刷新时长
  onRefreshDuration(totalMount) {
    if (!this.LeaveDurationItem) {
      return;
    }
    this.LeaveDurationItem.onRefreshLeaveDurationData(totalMount);
  }

  // 刷新时间日期
  onRefreshDateTime(dateTimeParams, leaveModalId) {
    if (!this.leaveStartDateItem || !this.leaveEndDateItem || !this.leaveStartTimeItem || !this.leaveEndTimeItem) {
      return;
    }
    // 请求时长之前刷新时间日期
    // getYYYYMMDDFormat, getYYYYMMDDhhmmFormat, getHHmmFormat
    switch (leaveModalId) {
      case 1:
        this.leaveStartDateItem.onRefreshLeaveStartDateValue(getYYYYMMDDFormat(dateTimeParams.leaveStartDate));
        this.leaveEndDateItem.onRefreshLeaveEndDateValue(true, getYYYYMMDDFormat(dateTimeParams.leaveEndDate));
        break;
      case 2:
      case 3:
        this.leaveStartTimeItem.onRefreshStartTime(true, true, getHHmmFormat(dateTimeParams.leaveStartTime));
        this.leaveEndTimeItem.onRefreshEndTime(true, true, getHHmmFormat(dateTimeParams.leaveEndTime));
        break;
      case 4:
        this.leaveStartDateItem.onRefreshLeaveStartDateValue(getYYYYMMDDhhmmFormat(`${dateTimeParams.leaveStartDate} ${dateTimeParams.leaveStartTime}`));
        this.leaveEndDateItem.onRefreshLeaveEndDateValue(true, getYYYYMMDDhhmmFormat(`${dateTimeParams.leaveEndDate} ${dateTimeParams.leaveEndTime}`));
        this.leaveStartTimeItem.onRefreshStartTime(false, true, getHHmmFormat(dateTimeParams.leaveStartTime));
        this.leaveEndTimeItem.onRefreshEndTime(false, true, getHHmmFormat(dateTimeParams.leaveEndTime));
        break;
      default:
        break;
    }
  }

  // 时长请求
  onLeaveDurationRequest(leaveType, dateParams) {
    const params = {};
    if (!this.LeaveTypeItem || !this.LeaveModalItem) {
      return;
    }
    // 请假类别名称
    // 根据请假类别获取请假类别map集合
    const leaveTypeMap = this.LeaveTypeItem.onExportleaveTypeMap();
    this.leaveModalIndex = this.LeaveModalItem.onExportLeaveModalId();
    // 时间模块控制
    const dateTimeParams = LeaveUtil.onHandleDateTime(this.leaveModalIndex, dateParams, this.isShiftFromSchedule);

    // 刷新时间日期
    this.onRefreshDateTime(dateTimeParams, this.leaveModalIndex);

    params.leaveId = leaveTypeMap.get(leaveType).LeaveId;
    // leaveMode
    params.leaveMode = this.leaveModalIndex - 1;
    // startDate
    params.startDate = dateTimeParams.leaveStartDate;
    // endDate
    params.endDate = dateTimeParams.leaveEndDate;
    // startTime
    params.startTime = dateTimeParams.leaveStartTime;
    // endTime
    params.endTime = dateTimeParams.leaveEndTime;
    // 时长
    params.hours = this.LeaveDurationItem.onExportLeaveLast();

    LeaveUtil.onUpdateDateTime(params.leaveId, params.startDate, params.endDate, params.startTime, params.endTime);

    this.leaveId = leaveTypeMap.get(leaveType).LeaveId;
    this.leaveMode = this.leaveModalIndex - 1;
    this.startDate = dateTimeParams.leaveStartDate;
    this.endDate = dateTimeParams.leaveEndDate;
    this.startTime = dateTimeParams.leaveStartTime;
    this.endTime = dateTimeParams.leaveEndTime;
    // isFixedPeriod
    params.isFixedPeriod = this.onExportLeaveFlexTimeStatus();
    if (global.loginResponseData.BackGroundVersion.indexOf('Y') != -1) {
      if (params.isFixedPeriod == 0) {
        params.FixedDurationCount = 0;
      } else {
        params.FixedDurationCount = this.state.textValue;
      }
      if (this.leaveUnit != this.onExportLeaveDurationData().leaveDurationUnit) {
        params.LeaveUnit = this.leaveUnit;
      } else {
        params.LeaveUnit = this.onExportLeaveDurationData().leaveDurationUnit;
      }
      LeaveUtil.onRequestDurationDD(params);
    } else {
      LeaveUtil.onRequestDuration(params);
    }
  }

  // 固定时段点击事件
  onLeaveFlexTimeClick = () => {
    if (!this.LeaveFlexedTimeItem) {
      return;
    }
    // 取得固定时段激活状态
    // status 表示点击前 按钮状态并非点击后按钮状态
    const status = this.onExportLeaveFlexTimeStatus();
    this.LeaveFlexedTimeItem.onShiftFlexTimeBg(status);
    if (status == 1) {
      if (global.loginResponseData.BackGroundVersion.indexOf('Y') != -1) {
        // 迭代版本
        this.LeaveFlexedTimeItem.onUpdateLeftMargin(0);
        this.LeaveRepeatTimesItem.onShowItem(false, this.state.textValue);
      } else {
        // 非迭代版本
        this.LeaveFlexedTimeItem.onUpdateLeftMargin(0);
        this.LeaveRepeatTimesItem.onShowItem(false, this.state.textValue);
        // 请求时长
        this.onRepeatRequest();
      }
    }
    if (status == 0) {
      if (global.loginResponseData.BackGroundVersion.indexOf('Y') != -1) {
        // 迭代版本
        this.LeaveFlexedTimeItem.onUpdateLeftMargin(20);
        this.LeaveRepeatTimesItem.onShowItem(true, this.state.textValue);
      } else {
        // 非迭代版本
        this.LeaveFlexedTimeItem.onUpdateLeftMargin(0);
        this.LeaveRepeatTimesItem.onShowItem(false, this.state.textValue);
        // 请求时长
        this.onRepeatRequest();
      }
    }
  }

  onRepeatRequest() {
    // 固定时段点击触发时长请求
    const params = {};
    params.leaveId = this.leaveId;
    // leaveMode
    params.leaveMode = this.leaveMode;
    // startDate
    params.startDate = this.startDate;
    // endDate
    params.endDate = this.endDate;
    // startTime
    params.startTime = this.startTime;
    // endTime
    params.endTime = this.endTime;
    // 时长
    params.hours = 0;
    // isFixedPeriod
    params.isFixedPeriod = this.onExportLeaveFlexTimeStatus();
    if (global.loginResponseData.BackGroundVersion.indexOf('Y') != -1) {
      if (params.isFixedPeriod == 0) {
        params.FixedDurationCount = 0;
      } else {
        params.FixedDurationCount = this.state.textValue;
      }
      params.LeaveUnit = this.onExportLeaveDurationData().leaveDurationUnit;
      LeaveUtil.onRequestDurationDD(params);
    } else {
      LeaveUtil.onRequestDuration(params);
    }
  }

  // 导出请假时长允许的最大值
  onExportLeaveDurationAmount() {
    return this.leaveDurationAmount;
  }

  // 获取开始日期显示的值
  onExportLeaveStartDateValue() {
    return this.leaveStartDateItem.onExportLeaveStartDateValue();
  }

  // 获取结束日期显示的值
  onExportLeaveEndDateValue() {
    return this.leaveEndDateItem.onExportLeaveEndDateValue();
  }

  reFreshValue = () => {
    if (!this.LeaveModalItem) {
      return;
    }
    this.LeaveModalItem.onRefreshLeaveModalName(this.leaveModalNameTemp);
  }

  onUp(value) {
    this.setState({
      textValue: value
    });
  }

  onDown(value) {
    this.setState({
      textValue: value
    });
  }

  onInput(value) {
    this.setState({
      textValue: value
    });
  }

  onExportRepeatTimes() {
    return this.state.textValue;
  }

  onExportLeaveClassValue() {
    return this.leaveLearningItem.onExportLeaveClassValue();
  }

  onExportLeaveOffValue() {
    return this.leaveLearningItem.onExportLeaveOffValue();
  }

  render() {
    return (
      <View>
        <LeaveType
          ref={item => this.LeaveTypeItem = item}
          onPress={() => {
            const { LeaveTypeClick } = this.props;
            LeaveTypeClick();
          }} />
        <LeaveTypeDescItem
          ref={item => this.LeaveTypeDesc = item}
          isShow={false} />
        <LeaveModal
          ref={item => this.LeaveModalItem = item}
          reFreshValue={this.reFreshValue}
          onPress={() => {
            const { LeaveModalClick } = this.props;
            LeaveModalClick();
          }} />
        <LeaveStartDate
          ref={item => this.leaveStartDateItem = item}
          onPress={() => {
            const { leaveStartDateClick } = this.props;
            leaveStartDateClick();
          }} />
        <LeaveEndDate
          ref={item => this.leaveEndDateItem = item}
          onPress={() => {
            const { leaveEndDateClick } = this.props;
            leaveEndDateClick();
          }} />
        <LeaveStartTime
          ref={item => this.leaveStartTimeItem = item} />
        <LeaveEndTime
          ref={item => this.leaveEndTimeItem = item} />
        <LeaveDuration
          ref={item => this.LeaveDurationItem = item} />
        <LeaveLearningItem
          ref={item => this.leaveLearningItem = item} />
        <LeaveFlexedTime
          ref={item => this.LeaveFlexedTimeItem = item}
          onPress={() => this.onLeaveFlexTimeClick()} />
        <LeaveRepeatTimesItem
          ref={item => this.LeaveRepeatTimesItem = item}
          isShow={false}
          textValue={this.state.textValue}
          onUp={(textValue) => this.onUp(textValue)}
          onDown={(textValue) => this.onDown(textValue)}
          onInput={(textValue) => this.onInput(textValue)} />
      </View>
    );
  }
}