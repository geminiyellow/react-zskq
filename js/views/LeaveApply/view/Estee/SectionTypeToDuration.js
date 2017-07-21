import {
  DeviceEventEmitter,
  View,
} from 'react-native';
import React, { PureComponent } from 'react';

import I18n from 'react-native-i18n';
import { event } from '@/common/Util';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import moment from 'moment';
import _ from 'lodash';
import { getYYYYMMDDFormat, getYYYYMMDDhhmmFormat, getHHmmFormat } from '@/common/Functions';

import LeaveType from './../../components/item/LeaveTypeItem';
import LeaveModal from './../../components/item/Estee/LeaveModalItem';
import LeaveStartDate from './../../components/item/LeaveStartDateItem';
import LeaveEndDate from './../../components/item/LeaveEndDateItem';
import LeaveStartTime from './../../components/item/Estee/LeaveStartTimeItem';
import LeaveEndTime from './../../components/item/Estee/LeaveEndTimeItem';
import LeaveDuration from './../../components/item/Estee/LeaveDurationItem';
import LeaveTypeDescItem from './../../components/item/LeaveTypeDescItem';

import LeaveUtil from './../../utils/LeaveUtil';
import LeaveDateUtil from './../../utils/LeaveDateUtil';

export default class SectionTypeToDuration extends PureComponent {

  constructor(...props) {
    super(...props);
    this.isFirstEnter = 0;
    this.leaveModalIndex = 1;
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
    ];
  }

  // ***************************************************************

  // 页面刷新

  // 刷新请假假别
  onRefreshLeaveType(leaveTypeStr) {
    this.leaveTypeTemp = leaveTypeStr;
    this.LeaveTypeItem.onRefreshLeaveTypeData(leaveTypeStr);
  }

  // 更新请假模式显示值
  onRefreshLeaveModalNameByPickedValue(leaveModalName) {
    if (!this.LeaveModalItem) {
      return;
    }
    this.leaveModalNameTemp = leaveModalName;
    this.LeaveModalItem.onRefreshModalValue(leaveModalName);
  }

  // 刷新结束日期
  onRefreshLeaveEndDate(isShow, leaveEndDateStr) {
    if (!this.leaveEndDateItem) {
      return;
    }
    this.leaveEndDateItem.onRefreshLeaveEndDateValue(isShow, leaveEndDateStr);
  }

  // 开始日期刷新
  onRefreshLeaveSatrtDate(leaveStartDateStr) {
    if (!this.leaveStartDateItem) {
      return;
    }
    this.leaveStartDateItem.onRefreshLeaveStartDateValue(leaveStartDateStr);
  }

  // 刷新开始时间
  onReFreshLeaveStartTime(startTimeStr) {
    if (!this.leaveStartTimeItem) {
      return;
    }
    this.leaveStartTimeItem.onFreshStartTimeRightArrowShow(false);
    this.leaveStartTimeItem.onRefreshStartTime(true, true, startTimeStr);
  }

  onReFreshLeaveStartTimeByFlxiable(startTimeStr) {
    if (!this.leaveStartTimeItem) {
      return;
    }
    this.leaveStartTimeItem.onFreshStartTimeRightArrowShow(true);
    this.leaveStartTimeItem.onRefreshStartTime(true, false, startTimeStr);
  }

  // 刷新结束时间
  onReFreshLeaveEndTime(endTimeStr) {
    if (!this.leaveEndTimeItem) {
      return;
    }
    this.leaveEndTimeItem.onRefreshEndTime(true, true, endTimeStr);
  }

  // 刷新弹性时段显示的时间
  onReFreshLeaveEndTimeTX(endTimeStr) {
    if (!this.leaveEndTimeItem) {
      return;
    }
    this.leaveEndTimeItem.onRefreshEndTime(true, true, endTimeStr);
  }

  // // 在不显示开始时间 结束时间情况下 刷新时间显示
  onReFreshLeaveStartTimeHide(startTimeStr) {
    if (!this.leaveStartTimeItem) {
      return;
    }
    this.leaveStartTimeItem.onRefreshStartTime(false, true, startTimeStr);
  }

  onReFreshLeaveEndTimeHide(endTimeStr) {
    if (!this.leaveEndTimeItem) {
      return;
    }
    this.leaveEndTimeItem.onRefreshEndTime(false, true, endTimeStr);
  }

  // 刷新时长
  onRefreshDuration(totalMount) {
    if (!this.LeaveDurationItem) {
      return;
    }
    this.LeaveDurationItem.onRefreshLeaveDurationData(totalMount);
  }

  // 刷新时长显示为0
  onFreshLeaveDurationZero() {
    this.LeaveDurationItem.onRefreshLeaveDurationData(0);
    DeviceEventEmitter.emit('FRESH_LAST_ZERO', '');
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
    // 刷新模式顶部间距
    this.LeaveTypeDesc.omUpdateLeaveTypeDesc(descStr);
    this.LeaveTypeDesc.onShowLeaveTypeDesc(true);
  }

  onHideLeaveTypeDesc() {
    // 刷新模式顶部间距
    this.LeaveTypeDesc.onShowLeaveTypeDesc(false);
  }

  // *********************************************************************************************
  // 工具类

  // 根据请假模式生成请假模式ID
  onExportLeaveModalIdByName(modalName) {
    if (!this.LeaveModalItem) {
      return;
    }
    this.leaveModalNameTemp = modalName;
    return this.LeaveModalItem.onExportLeaveModalIdByName(modalName);
  }

  // 请假模式名称转化请假模式id
  onShiftLeaveModalNameToId(leaveModalName) {
    if (!this.LeaveModalItem) {
      return;
    }
    this.leaveModalNameTemp = leaveModalName;
    return this.LeaveModalItem.onExportLeaveModalIdByName(leaveModalName);
  }

  // 导出请假模式
  onExportLeaveModal() {
    return this.LeaveModalItem.onExportLeaveModal();
  }

  // 获取开始日期显示的值
  onExportLeaveStartDateValue() {
    return this.leaveStartDateItem.onExportLeaveStartDateValue();
  }

  // 获取结束日期显示的值
  onExportLeaveEndDateValue() {
    return this.leaveEndDateItem.onExportLeaveEndDateValue();
  }

  // 导出请假开始时间
  onExportLeaveStartTime() {
    return this.leaveStartTimeItem.onExportLeaveStartTime();
  }

  // 导出请假开始时间
  onExportLeaveEndTime() {
    return this.leaveEndTimeItem.onExportLeaveEndTime();
  }

  // 导出请假模式id
  onExportLeaveModalId() {
    return this.leaveModalIndex;
  }

  // 获取请假类别TO
  onExportLeaveTypeTo(leaveType) {
    // 根据请假类别名称获取对应的实体类
    if (!this.LeaveTypeItem) {
      return;
    }
    return this.LeaveTypeItem.onExportleaveTypeMap().get(leaveType);
  }

  // 是假模块显示处理
  onHandleDateTimeShow(dateParams, leaveModalId) {
    if (!this.leaveStartDateItem || !this.leaveStartTimeItem || !this.leaveEndDateItem || !this.leaveEndTimeItem) {
      return;
    }
    this.leaveModalIndex = leaveModalId;
    // getYYYYMMDDFormat, getYYYYMMDDhhmmFormat, getHHmmFormat
    switch (leaveModalId) {
      case 1:
      case 4:
      case 5:
        // 全天模式
        // 延迟上班／提前下班
        // 开始日期始终显示
        this.leaveStartDateItem.onRefreshLeaveStartDateValue(getYYYYMMDDFormat(dateParams.leaveStartDate));
        this.leaveStartDateItem.onFreshStartDateRightArrowShow(true, false);
        // 显示开始日期 结束日期
        this.leaveEndDateItem.onRefreshLeaveEndDateValue(true, getYYYYMMDDFormat(dateParams.leaveEndDate));
        // 隐藏开始时间 结束时间
        this.leaveStartTimeItem.onRefreshStartTime(false, false, getHHmmFormat(dateParams.leaveStartTime));
        this.leaveEndTimeItem.onRefreshEndTime(false, true, getHHmmFormat(dateParams.leaveEndTime));
        break;
      case 2:
      case 3:
        // 前半段／后半段
        // 开始日期始终显示
        if (_.isEmpty(dateParams.leaveStartTime) || _.isEmpty(dateParams.leaveEndTime)) {
          dateParams.leaveStartTime = '00:00';
          dateParams.leaveEndTime = '23:59';
        }
        this.leaveStartDateItem.onRefreshLeaveStartDateValue(getYYYYMMDDFormat(dateParams.leaveStartDate));
        this.leaveStartDateItem.onFreshStartDateRightArrowShow(true, false);
        // 显示开始日期 开始时间 结束时间
        this.leaveStartTimeItem.onRefreshStartTime(true, true, getHHmmFormat(dateParams.leaveStartTime));
        this.leaveEndTimeItem.onRefreshEndTime(true, true, getHHmmFormat(dateParams.leaveEndTime));
        this.leaveStartTimeItem.onFreshStartTimeRightArrowShow(false);
        this.leaveEndTimeItem.onFreshEndTimeRightArrowShow(false);
        // 隐藏 结束日期
        this.leaveEndDateItem.onRefreshLeaveEndDateValue(false, getYYYYMMDDFormat(dateParams.LeaveEndDate));
        break;
      case 6:
        // 弹性时段
        // 开始日期始终显示
        if (_.isEmpty(dateParams.leaveStartTime) || _.isEmpty(dateParams.leaveEndTime)) {
          dateParams.leaveStartTime = '00:00';
          dateParams.leaveEndTime = '00:00';
        }
        // 刷新页面显示
        this.onUpdateDateTime(leaveModalId, dateParams.leaveStartDate, dateParams.leaveEndDate, dateParams.leaveStartTime, dateParams.leaveEndTime);
        this.leaveStartDateItem.onRefreshLeaveStartDateValue(getYYYYMMDDFormat(dateParams.leaveStartDate));
        // 隐藏开始日期右侧箭头
        this.leaveStartDateItem.onFreshStartDateRightArrowShow(true, false);
        // 显示开始日期 开始时间 结束时间
        this.leaveStartTimeItem.onRefreshStartTime(true, false, getHHmmFormat(dateParams.leaveStartTime));
        this.leaveEndTimeItem.onRefreshEndTime(true, true, getHHmmFormat(dateParams.leaveEndTime));
        this.leaveStartTimeItem.onFreshStartTimeRightArrowShow(true);
        // 隐藏 结束日期
        this.leaveEndDateItem.onRefreshLeaveEndDateValue(false, getYYYYMMDDFormat(dateParams.LeaveEndDate));
        break;
      default:
        break;
    }
    if (leaveModalId === 4 || leaveModalId === 5 || leaveModalId === 6) {
      this.onFreshLeaveDurationZero();
      return;
    }
    this.onLeaveDurationRequest(this.leaveTypeTemp, dateParams, 0);
  }

  // 日期处理
  onHandleDateTime(leaveModalId, dateParams) {
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
      case 4:
      case 5:
        // 日期比较
        if (!this.onCompareDate(leaveStartDate, leaveEndDate)) {
          leaveEndDate = leaveStartDate;
        }
        break;
      case 2:
      case 3:
      case 6:
        leaveEndDate = leaveStartDate;
        break;
      default:
        break;
    }

    dateParams.leaveStartDate = leaveStartDate;
    dateParams.leaveEndDate = leaveEndDate;
    dateParams.leaveStartTime = leaveStartTime;
    dateParams.leaveEndTime = leaveEndTime;
    return dateParams;
  }

  // 日期比较
  onCompareDate(startDate, endDate) {
    let isBefore = moment(startDate).isBefore(endDate);
    if (!isBefore) {
      if (moment(startDate).isSame(endDate)) {
        isBefore = true;
      }
    }
    return isBefore;
  }

  // 更新日期
  onUpdateDateTime(leaveModalId, leaveStartDate, leaveEndDate, leaveStartTime, leaveEndTime) {
    const emitParam = {};
    emitParam.leaveModalId = leaveModalId;
    emitParam.leaveStartDate = leaveStartDate;
    emitParam.leaveEndDate = leaveEndDate;
    emitParam.leaveStartTime = leaveStartTime;
    emitParam.leaveEndTime = leaveEndTime;
    DeviceEventEmitter.emit(event.REFRESH_TIMEBEFORE_DURATION_REQ, emitParam);
  }

  // 时长点击处理
  onHandleLeaveDurationClickable(leaveModalstr) {
    switch (leaveModalstr) {
      case I18n.t('mobile.module.leaveapply.leaveapplymodalfullday'):
      case I18n.t('mobile.module.leaveapply.leaveapplymodalfirsthalfestee'):
      case I18n.t('mobile.module.leaveapply.leaveapplymodalsecndhalfestee'):
        this.LeaveDurationItem.onHanldeTouchable(true);
        this.LeaveDurationItem.onFreshRightArrowShow(false);
        break;
      case I18n.t('mobile.module.leaveapply.leaveapplymodaldelayworkestee'):
      case I18n.t('mobile.module.leaveapply.leaveapplymodalearlyworkestee'):
      case I18n.t('mobile.module.leaveapply.leaveapplymodalflextime'):
        this.LeaveDurationItem.onHanldeTouchable(false);
        this.LeaveDurationItem.onFreshRightArrowShow(true);
        break;
      default:
        break;
    }
  }

  // ***************************************************************************************
  // 请假时长获取
  onLeaveDurationRequest(leaveType, dateParams, leaveLastTemp) {
    const params = {};
    if (!this.LeaveTypeItem) {
      return;
    }
    // 请假类别名称
    // 根据请假类别获取请假类别map集合
    const leaveTypeMap = this.LeaveTypeItem.onExportleaveTypeMap();
    params.leaveId = leaveTypeMap.get(leaveType).LeaveId;
    this.leaveModalIndex = this.LeaveModalItem.onExportLeaveModalId();
    // 时间模块控制
    const dateTimeParams = this.onHandleDateTime(this.leaveModalIndex, dateParams);
    const isBefore = LeaveDateUtil.onCompareTime(dateTimeParams.leaveStartDate, dateTimeParams.leaveEndDate, dateTimeParams.leaveStartTime, dateTimeParams.leaveEndTime);
    // 时间判断
    // 根据请假模式判断时间
    switch (this.leaveModalIndex) {
      case 1:
      case 4:
      case 5:
        // 只判断日期
        if (!this.onCompareDate(dateTimeParams.leaveStartDate, dateTimeParams.leaveEndDate)) {
          showMessage(messageType.error, I18n.t('mobile.module.leaveapply.leaveapplysatrtdateoverenddate'));
          return;
        }
        break;
      case 6:
        // 只判断日期时间
        if (!isBefore) {
          showMessage(messageType.error, I18n.t('mobile.module.leaveapply.leaveapplystarttimeoverendtime'));
          return;
        }
        break;
      default:
        break;
    }

    // leaveMode
    params.leaveMode = LeaveUtil.onShiftLeavemodalIdToName(this.leaveModalIndex);
    // startDate
    params.startDate = dateTimeParams.leaveStartDate;
    // endDate
    params.endDate = dateTimeParams.leaveEndDate;
    // startTime
    params.startTime = dateTimeParams.leaveStartTime;
    // endTime
    params.endTime = dateTimeParams.leaveEndTime;
    // 时长
    params.hours = leaveLastTemp;
    // isFixedPeriod
    params.isFixedPeriod = 0;

    this.onUpdateDateTime(this.leaveModalIndex, params.startDate, params.endDate, params.startTime, params.endTime);

    // 时长请求
    this.onFreshLeaveDurationZero();

    LeaveUtil.onRequestDuration(params);
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
          ref={item => this.leaveStartTimeItem = item}
          isTimeShow
          timeType={0}
          leaveStartTimeClick={() => {
            const { leaveStartTimeClick } = this.props;
            leaveStartTimeClick();
          }} />
        <LeaveEndTime
          ref={item => this.leaveEndTimeItem = item}
          isTimeShow
          timeType={0}
          leaveEndTimeClick={() => {
            const { leaveEndTimeClick } = this.props;
            leaveEndTimeClick();
          }} />
        <LeaveDuration
          ref={item => this.LeaveDurationItem = item}
          onPress={() => {
            const { leaveDurationClick } = this.props;
            leaveDurationClick();
          }} />
      </View>
    );
  }
}