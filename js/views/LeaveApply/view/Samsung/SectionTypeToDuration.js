import {
  DeviceEventEmitter,
  View,
} from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import I18n from 'react-native-i18n';

import { event } from '@/common/Util';
import { ABORT } from '@/common/Request';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import { getYYYYMMDDFormat, getYYYYMMDDhhmmFormat, getHHmmFormat } from '@/common/Functions';

import LeaveModal from '@/views/LeaveApply/components/item/LeaveModalItem';
import LeaveType from '@/views/LeaveApply/components/item/LeaveTypeItem';
import LeaveStartDate from '@/views/LeaveApply/components/item/LeaveStartDateItem';
import LeaveEndDate from '@/views/LeaveApply/components/item/LeaveEndDateItem';
import LeaveStartTime from '@/views/LeaveApply/components/item/LeaveStartTimeItem';
import LeaveEndTime from '@/views/LeaveApply/components/item/LeaveEndTimeItem';
import LeaveDuration from '@/views/LeaveApply/components/item/LeaveDurationItem';
import LeaveFlexedTime from '@/views/LeaveApply/components/item/LeaveFlexedTimeItem';

import LeaveDateUtil from './../../utils/LeaveDateUtil';
import LeaveUtil from './../../utils/LeaveUtil';

export default class SectionTypeToDuration extends PureComponent {

  constructor(...props) {
    super(...props);
    this.isFirstEnter = 0;
    this.leaveModalIndex = 1;
    this.leaveTypeTemp = '';
    this.leaveModalNameTemp = '';
    this.leaveDurationAmount = 0;
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
      DeviceEventEmitter.addListener('FRESH_LEAVE_CODE', (eventBody) => {
        this.leaveCode = eventBody;
      }),
    ];
  }

  componentWillUnmount() {
    this.listeners && this.listeners.forEach(listener => listener.remove());
    ABORT('getLeaveApplyLast');
  }

  // 重新获取请假类型
  onFetchLeaveTypePickerData() {
    if (!this.LeaveTypeItem) {
      return;
    }
    this.LeaveTypeItem.onFetchLeaveTypeDataByServer();
  }

  // 刷新请假类型显示
  onRefreshLeaveTypeData(leaveType, dateParams) {
    if (!this.LeaveTypeItem) {
      return;
    }
    this.leaveTypeTemp = leaveType;
    this.LeaveTypeItem.onRefreshLeaveTypeData(leaveType);
    this.onHandleLeaveTypeModal(dateParams, leaveType);
  }

  // 刷新请假模式显示值
  onRefreshLeaveModalNameByPickedValue(leaveModalName) {
    if (!this.LeaveModalItem) {
      return;
    }
    this.leaveModalNameTemp = leaveModalName;
    this.LeaveModalItem.onLeaveModalShow(true);
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
    this.leaveCode = leaveTypeTo.LeaveCode;
    // 请加时长允许的最大值
    this.leaveDurationAmount = leaveTypeTo.OVERDRAWN;
    // 初始化请假模式显示设置
    this.LeaveModalItem.onInitLeaveModalDataSource(leaveTypeTo);
    // 获取请假模式显示控制
    const isLeaveModalItemShow = false;
    // 获取请假模式数据源
    this.leaveModalNameTemp = I18n.t('mobile.module.leaveapply.leaveapplymodalflextime');
    // 时间模块控制
    // 根据请假模式控制
    this.onHandleDateTimeShow(dateParams, 4);
    this.LeaveModalItem.onLeaveModalShow(isLeaveModalItemShow);
    // 显示leaveModal时，刷新leavemodalpicker数据源
    if (isLeaveModalItemShow) {
      // 发送通知到主页面，刷新leavemodalpicker数据源
      const leaveModalPickerData = this.LeaveModalItem.onExportLeaveModalData();
      DeviceEventEmitter.emit(event.REFRESH_LEAVE_MODAL_DATA, leaveModalPickerData);
    }

    // 刷新时长单位
    this.LeaveDurationItem.onRefreshLeaveDurationUnit(`${leaveTypeTo.LeaveModeUnit}`);
    // 刷新index请假模式名称
    DeviceEventEmitter.emit('REFRESH_LEAVE_MODAL_NAME', this.leaveModalNameTemp);
  }

  // 获取请假类别TO
  onExportLeaveTypeTo(leaveType) {
    // 根据请假类别名称获取对应的实体类
    if (!this.LeaveTypeItem) {
      return;
    }
    return this.LeaveTypeItem.onExportleaveTypeMap().get(leaveType);
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
    this.leaveModalIndex = leaveModalId;
    switch (leaveModalId) {
      case 1:
        // 全天模式
        // 开始日期始终显示
        this.leaveStartDateItem.onRefreshLeaveStartDateValue(dateParams.leaveStartDate);
        // 显示开始日期 结束日期
        this.leaveEndDateItem.onRefreshLeaveEndDateValue(true, dateParams.leaveEndDate);
        // 隐藏开始时间 结束时间
        this.leaveStartTimeItem.onRefreshStartTime(false, true, dateParams.leaveStartTime);
        this.leaveEndTimeItem.onRefreshEndTime(false, true, dateParams.leaveEndTime);
        break;
      case 2:
        // 上半个班次
        // 开始日期始终显示
        this.leaveStartDateItem.onRefreshLeaveStartDateValue(dateParams.leaveStartDate);
        // 显示开始日期 开始时间 结束时间
        this.leaveStartTimeItem.onRefreshStartTime(true, true, dateParams.leaveStartTime);
        this.leaveEndTimeItem.onRefreshEndTime(true, true, dateParams.leaveEndTime);
        this.leaveEndTimeItem.onFreshEndTimeRightArrowShow(false);
        this.leaveStartTimeItem.onFreshStartTimeRightArrowShow(false);
        // 隐藏 结束日期
        this.leaveEndDateItem.onRefreshLeaveEndDateValue(false, dateParams.LeaveEndDate);
        break;
      case 3:
        // 下半个班次
        // 开始日期始终显示
        this.leaveStartDateItem.onRefreshLeaveStartDateValue(dateParams.leaveStartDate);
        // 显示开始日期 开始时间 结束时间
        this.leaveStartTimeItem.onRefreshStartTime(true, true, dateParams.leaveStartTime);
        this.leaveEndTimeItem.onRefreshEndTime(true, true, dateParams.leaveEndTime);
        this.leaveEndTimeItem.onFreshEndTimeRightArrowShow(false);
        this.leaveStartTimeItem.onFreshStartTimeRightArrowShow(false);
        // 隐藏 结束日期
        this.leaveEndDateItem.onRefreshLeaveEndDateValue(false, dateParams.leaveEndDate);
        break;
      case 4:
        // 弹性模式
        if (this.isFirstEnter !== 0) {
          dateParams.leaveStartTime = '00:00';
          dateParams.leaveEndTime = '00:00';
        }
        DeviceEventEmitter.emit(event.REFRESH_LEAVE_TIME, dateParams);
        break;
      default:
        break;
    }
    // 请求时长
    if (_.isEmpty(dateParams.leaveStartDate) || dateParams.leaveStartDate === I18n.t('mobile.module.leaveapply.leaveapplydatedefault')) {
      return;
    }
    this.onLeaveDurationRequest(this.leaveTypeTemp, dateParams);
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
    if (this.leaveModalIndex === 2 || this.leaveModalIndex === 3) {
      this.leaveEndTimeItem.onRefreshEndTime(true, true, leaveEndTimeStr);
    } else if (this.leaveModalIndex === 1) {
      this.leaveEndTimeItem.onRefreshEndTime(false, true, leaveEndTimeStr);
    } else if (this.leaveModalIndex === 4) {
      // getYYYYMMDDFormat, getYYYYMMDDhhmmFormat, getHHmmFormat
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
    switch (leaveModalId) {
      case 1:
        this.leaveStartDateItem.onRefreshLeaveStartDateValue(dateTimeParams.leaveStartDate);
        this.leaveEndDateItem.onRefreshLeaveEndDateValue(true, dateTimeParams.leaveEndDate);
        break;
      case 2:
      case 3:
        this.leaveStartTimeItem.onRefreshStartTime(true, true, dateTimeParams.leaveStartTime);
        this.leaveEndTimeItem.onRefreshEndTime(true, true, dateTimeParams.leaveEndTime);
        break;
      case 4:
      // import { getYYYYMMDDFormat, getYYYYMMDDhhmmFormat, getHHmmFormat } from '@/common/Functions';
        this.leaveStartDateItem.onRefreshLeaveStartDateValue(getYYYYMMDDhhmmFormat(`${dateTimeParams.leaveStartDate} ${dateTimeParams.leaveStartTime}`));
        this.leaveEndDateItem.onRefreshLeaveEndDateValue(true, getYYYYMMDDhhmmFormat(`${dateTimeParams.leaveEndDate} ${dateTimeParams.leaveEndTime}`));
        this.leaveStartTimeItem.onRefreshStartTime(false, true, dateTimeParams.leaveStartTime);
        this.leaveEndTimeItem.onRefreshEndTime(false, true, dateTimeParams.leaveEndTime);
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
    this.leaveModalIndex = 4;
    // 时间模块控制
    const dateTimeParams = LeaveUtil.onHandleDateTime(this.leaveModalIndex, dateParams);

    // 时间验证
    if (!LeaveDateUtil.onCompareTime(dateTimeParams.leaveStartDate, dateTimeParams.leaveEndDate, dateTimeParams.leaveStartTime, dateTimeParams.leaveEndTime)) {
      showMessage(messageType.error, I18n.t('mobile.module.leaveapply.leaveapplystarttimeoverendtime'));
      return;
    }

    // 刷新时间日期
    this.onRefreshDateTime(dateTimeParams, this.leaveModalIndex);

    params.leaveId = leaveTypeMap.get(leaveType).LeaveId;
    // leaveMode
    params.leaveMode = this.leaveModalIndex - 1;
    // leaveMode
    params.leaveCode = this.leaveCode;
    // startDate
    params.startDate = dateTimeParams.leaveStartDate;
    // endDate
    params.endDate = dateTimeParams.leaveEndDate;
    // startTime
    params.startTime = dateTimeParams.leaveStartTime;
    // endTime
    params.endTime = dateTimeParams.leaveEndTime;
    // 时长
    params.hours = 0;
    // isFixedPeriod
    params.isFixedPeriod = this.onExportLeaveFlexTimeStatus();

    LeaveUtil.onUpdateDateTime(params.leaveId, params.startDate, params.endDate, params.startTime, params.endTime);

    this.leaveId = leaveTypeMap.get(leaveType).LeaveId;
    this.leaveMode = this.leaveModalIndex - 1;
    this.startDate = dateTimeParams.leaveStartDate;
    this.endDate = dateTimeParams.leaveEndDate;
    this.startTime = dateTimeParams.leaveStartTime;
    this.endTime = dateTimeParams.leaveEndTime;

    LeaveUtil.onRequestDuration(params);
  }

  // 固定时段点击事件
  onLeaveFlexTimeClick = () => {
    if (!this.LeaveFlexedTimeItem) {
      return;
    }
    // 发通知，固定时段已被点击
    DeviceEventEmitter.emit('REFRESH_FLEX_TIME_CLICK', 1);
    // 取得固定时段激活状态
    this.LeaveFlexedTimeItem.onShiftFlexTimeBg(this.onExportLeaveFlexTimeStatus());
    // 固定时段点击触发时长请求
    const params = {};
    params.leaveId = this.leaveId;
    // leaveMode
    params.leaveMode = this.leaveMode;
    // this.leaveCode;
    params.leaveCode = this.leaveCode;
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

    LeaveUtil.onRequestDuration(params);
  }

  // 导出请假类别code
  onExportLeaveTypeCode() {
    return this.leaveCode;
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

  render() {
    return (
      <View>
        <LeaveType
          ref={item => this.LeaveTypeItem = item}
          onPress={() => {
            const { LeaveTypeClick } = this.props;
            LeaveTypeClick();
          }} />
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
        <LeaveFlexedTime
          ref={item => this.LeaveFlexedTimeItem = item}
          onPress={() => this.onLeaveFlexTimeClick()} />
      </View>
    );
  }
}