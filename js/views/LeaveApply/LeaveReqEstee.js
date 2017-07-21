import {
  DeviceEventEmitter,
  KeyboardAvoidingView,
  Keyboard,
  View,
} from 'react-native';
import React, { PureComponent } from 'react';

import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import { event, device } from '@/common/Util';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import Functions from '@/common/Functions';
import { LoadingManager } from '@/common/Loading';
import _ from 'lodash';
import ScrollView from '@/common/components/ScrollView';
import ModalWithImage from '@/common/components/modal/ModalWithImage';

import realm from '@/realm';
import Realm from 'realm';

import LeaveTypePicker from '@/views/LeaveApply/components/picker/Estee/LeaveTypePicker';
import LeaveModalPicker from '@/views/LeaveApply/components/picker/Estee/LeaveModalPicker';
import LeaveDatePicker from '@/views/LeaveApply/components/picker/LeaveDatePicker';
import LeaveReasonPicker from '@/views/LeaveApply/components/picker/Estee/LeaveReasonPicker';
import LeaveDurationPicker from '@/views/LeaveApply/components/picker/Estee/LeaveDurationPicker';
import LeaveAttDetailPicker from '@/views/LeaveApply/components/picker/LeaveAttDetailPicker';
import AttachmentModal from "@/common/components/Attachment";
import { getYYYYMMDDFormat, getYYYYMMDDhhmmFormat, getHHmmFormat } from '@/common/Functions';

import ActionbarItem from './components/item/ActionBarItem';
import Creadits from './components/item/LeaveCreaditsItem';
import SectionTypeToDuration from './view/Estee/SectionTypeToDuration';
import SectionReason from './view/SectionReason';
import LeaveRemark from './components/item/LeaveRemarkItem';
import SectionAttachment from './view/Estee/SectionAttachment';
import LeaveSubmit from './components/item/LeaveSubmitItem';
import LeaveCreaditsPopover from './components/popover/LeaveCreaditsPopover';

import LeaveDateUtil from './utils/LeaveDateUtil';
import LeaveUtil from './utils/LeaveUtil';
const KeyboardAvoiding = device.isIos ? View : KeyboardAvoidingView;
// 额度图片
const creaditsImg = 'quota';

let backPress = false;

export default class LeaveReqEstee extends PureComponent {

  constructor(...props) {
    super(...props);
    this.state = {
      isOk: false,
      behavior: null,
    };
    // 获取排班页面跳转传递的参数
    this.shiftToLeaveData = this.props.data;
    this.onInitParams();
  }

  componentWillMount() {
    if (!_.isEmpty(this.shiftToLeaveData) || !_.isUndefined(this.shiftToLeaveData)) {
      this.isShiftFromSchedule = 1;
      this.leaveStartDate = this.shiftToLeaveData.ShiftDate;
      this.leaveEndDate = this.shiftToLeaveData.ShiftDate;
      this.leaveStartTime = this.shiftToLeaveData.TimeFrom;
      this.leaveEndTime = this.shiftToLeaveData.TimeTo;
      // 结束日期
      this.onHaandleEndDate();
    } else {
      this.isShiftFromSchedule = 0;
      this.leaveStartDate = Functions.getNowFormatDate();
      this.leaveEndDate = Functions.getNowFormatDate();
      this.leaveStartTime = '00:00';
      this.leaveEndTime = '00:00';
    }
    this.leaveLast = 0;
    // 获取请假原因
    LeaveUtil.onRequestReason();
  }

  componentDidMount() {
    // 请假类型消息监听事件
    this.listeners = [
      // 请假类别
      DeviceEventEmitter.addListener(event.REFRESH_LEAVE_TYPE_DATA, (eventBody) => {
        if (!_.isEmpty(eventBody)) {
          // 请假类别数据源
          if (eventBody.length > 0) {
            this.leaveType = eventBody[0];
            // 显示请假假别
            this.sectionTypeToDurationItem.onRefreshLeaveType(this.leaveType);
            this.leaveTypePicker.onInitLeaveTypePickerData(true, eventBody);
            // 默认加载第一个模式
            this.sectionTypeToDurationItem.onRefreshLeaveModalNameByPickedValue(I18n.t('mobile.module.leaveapply.leaveapplymodalfullday'));
            this.leaveModalTemp = I18n.t('mobile.module.leaveapply.leaveapplymodalfullday');
            this.sectionTypeToDurationItem.onHandleDateTimeShow(this.onHandleDateTimeParam(), 1);
            // 刷新假别说明
            this.onUpdateLeaveTypeDesc();
            this.setState({
              isOk: true,
            });
            this.onFreshLeaveModalDataSources();
          }
        }
      }),
      // 请假原因
      DeviceEventEmitter.addListener(event.REFRESH_LEAVE_REASON_DATA, (eventBody) => {
        if (!_.isEmpty(eventBody)) {
          if (!this.sectionReasonItem || !this.leaveReasonPicker) {
            return;
          }
          this.sectionReasonItem.onHandleLeaveReasonData(eventBody);
          const leaveReasonData = this.sectionReasonItem.onExportLeaveReasonData();
          if (leaveReasonData && leaveReasonData.length > 0) {
            this.leaveReason = leaveReasonData[0];
            this.leaveReasonPicker.onInitLeaveReasonPickerData(true, leaveReasonData);
          }
        }
      }),
      // 相机权限iOS使用
      DeviceEventEmitter.addListener('CAMERAACCESS', (eventBody) => {
        if (!this.cameraAlert) {
          return;
        }
        this.cameraAlert.open();
      }),
      // 类别模式选择弹性时段后刷新时间日期
      DeviceEventEmitter.addListener(event.REFRESH_TIMEBEFORE_DURATION_REQ, (eventBody) => {
        this.leaveStartDate = eventBody.leaveStartDate;
        this.leaveEndDate = eventBody.leaveEndDate;
        this.leaveStartTime = eventBody.leaveStartTime;
        this.leaveEndTime = eventBody.leaveEndTime;
        if (!this.sectionTypeToDurationItem) {
          return;
        }
        // getYYYYMMDDFormat, getYYYYMMDDhhmmFormat, getHHmmFormat 
        if (eventBody.leaveModalId === 1 || eventBody.leaveModalId === 4 || eventBody.leaveModalId === 5) {
          this.sectionTypeToDurationItem.onRefreshLeaveSatrtDate(getYYYYMMDDFormat(this.leaveStartDate));
          this.sectionTypeToDurationItem.onRefreshLeaveEndDate(true, getYYYYMMDDFormat(this.leaveEndDate));
        }
        if (eventBody.leaveModalId === 6) {
          // 刷新开始日期显示
          this.sectionTypeToDurationItem.onRefreshLeaveSatrtDate(getYYYYMMDDFormat(this.leaveStartDate));
        }
      }),
      DeviceEventEmitter.addListener(event.REFRESH_LEAVE_DURATION_DATA, (eventBody) => {
        if (!this.sectionTypeToDurationItem) {
          return;
        }
        // getYYYYMMDDFormat, getYYYYMMDDhhmmFormat, getHHmmFormat
        const leaveModalId = this.sectionTypeToDurationItem.onExportLeaveModalId();
        if (!_.isEmpty(eventBody)) {
          if (leaveModalId === 1 || leaveModalId === 4 || leaveModalId === 5) {
            // 全天模式
            this.leaveStartTime = eventBody.StartTime;
            this.leaveEndTime = eventBody.EndTime;
            // 刷新开始时间 结束时间
            this.sectionTypeToDurationItem.onReFreshLeaveStartTimeHide(getHHmmFormat(this.leaveStartTime));
            this.sectionTypeToDurationItem.onReFreshLeaveEndTimeHide(getHHmmFormat(this.leaveEndTime));
          }
          if (leaveModalId === 2 || leaveModalId === 3) {
            // 前半段 后半段
            this.leaveStartTime = eventBody.StartTime;
            this.leaveEndTime = eventBody.EndTime;
            if (_.isEmpty(eventBody.StartTime) || _.isEmpty(eventBody.EndTime)) {
              this.leaveStartTime = '00:00';
              this.leaveEndTime = '00:00';
            }
            // 刷新开始时间 结束时间
            this.sectionTypeToDurationItem.onReFreshLeaveStartTime(getHHmmFormat(this.leaveStartTime));
            this.sectionTypeToDurationItem.onReFreshLeaveEndTime(getHHmmFormat(this.leaveEndTime));
          }
          if (leaveModalId === 6) {
            // 刷新结束时间
            if (_.isEmpty(eventBody.StartTime) || _.isEmpty(eventBody.EndTime)) {
              this.leaveEndTime = this.leaveStartTime;
            } else {
              this.leaveEndTime = eventBody.EndTime;
            }
            this.sectionTypeToDurationItem.onReFreshLeaveEndTimeTX(getHHmmFormat(this.leaveEndTime));
          }
          if (_.isUndefined(eventBody.TotalAmt)) {
            this.leaveLast = 0;
          } else {
            this.leaveLast = eventBody.TotalAmt;
          }
          this.sectionTypeToDurationItem.onRefreshDuration(this.leaveLast);
        }
      }),
      // 请假提交
      DeviceEventEmitter.addListener(event.REFRESH_LEAVE_SUBMIT, (eventBody) => {
        if (eventBody) {
          DeviceEventEmitter.emit(event.REFRESH_CORNER_EVENT, true);
          this.props.navigator.pop();
        }
      }),
      // 请假提交
      DeviceEventEmitter.addListener('FRESH_LAST_ZERO', (eventBody) => {
        this.leaveLast = 0;
      }),
    ];
    this.onShowCreaditsPopover();
    if (device.isAndroid) {
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.setState({ behavior: 'height' }));
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }
  }

  _keyboardDidHide = () => {
    if (!backPress)
      this.setState({ behavior: null });
  }

  componentWillUnmount() {
    backPress = false;
    this.listeners && this.listeners.forEach(listener => listener.remove());
    if (device.isAndroid) {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }
    LoadingManager.stop();
  }

  // *******************************************************************
  // 点击事件处理

  onHandleCreaditsViewShow() {
    Keyboard.dismiss();
    DeviceEventEmitter.emit('REFRESH_VIEW_INIT', '');
    this.creadits.onOpenCreaditsModal();
  }

  onLeaveTypePickerClick() {
    if (!this.leaveTypePicker || _.isEmpty(this.leaveType)) {
      return;
    }
    // 刷新请假类别
    this.leaveTypePicker.onFreshPickerSlectedData(this.leaveType);
    this.leaveTypePicker.onShowLeaveTypePicker();
  }

  // 请假模式点击
  onLeaveModalItemClick() {
    if (!this.leaveModalPicker || !this.sectionTypeToDurationItem || _.isEmpty(this.sectionTypeToDurationItem.onExportLeaveModal())) {
      return;
    }
    // 刷新请假模式选中的值
    this.leaveModalPicker.onFreshLeaveModalSelectValue(this.sectionTypeToDurationItem.onExportLeaveModal());
    this.leaveModalPicker.onShowModalPicker();
  }

  // 请假开始日期点击
  onLeaveStartDateClick() {
    if (!this.sectionTypeToDurationItem || !this.pickerDate) {
      return;
    }
    this.onDateTimeClick(0);
  }

  // 请假结束日期点击
  onLeaveEndDateClick() {
    if (!this.sectionTypeToDurationItem || !this.pickerDate) {
      return;
    }
    this.onDateTimeClick(1);
  }

  onLeaveStartTimeClick() {
    if (!this.sectionTypeToDurationItem) {
      return;
    }
    this.onDateTimeClick(3);
  }

  onLeaveEndTimeClick() {
    if (!this.sectionTypeToDurationItem) {
      return;
    }
    this.onDateTimeClick(4);
  }

  onDateTimeClick(clickType) {
    this.dateTimeType = clickType;
    this.onInitShiftParam();
    this.onLeaveDateClick();
  }

  onLeaveDateClick() {
    if (!this.sectionTypeToDurationItem || !this.pickerDate) {
      return;
    }
    this.pickerDate.onRefreshTtitle(this.dateTimeType);
    this.onInitShiftParam();
    DeviceEventEmitter.emit('REFRESH_VIEW_INIT', '');
    if (_.isEmpty(this.leaveModalName)) {
      this.leavemodalName = I18n.t('mobile.module.leaveapply.leaveapplymodalfullday');
    }
    const leaveModalId = this.sectionTypeToDurationItem.onShiftLeaveModalNameToId(this.leaveModalName);
    if (leaveModalId !== 6) {
      if (this.dateTimeType === 0) {
        this.pickerDate.onInitPickerMode(1);
        this.pickerDate.onShowPicker(this.leaveStartDate);
      } else if (this.dateTimeType == 1) {
        this.pickerDate.onInitPickerMode(1);
        this.pickerDate.onShowPicker(this.leaveEndDate);
      }
    } else if (leaveModalId === 6) {
      // 时间点击显示picker
      if (this.dateTimeType === 0) {
        this.pickerDate.onInitPickerMode(1);
        this.pickerDate.onShowPicker(this.sectionTypeToDurationItem.onExportLeaveStartDateValue());
      } else if (this.dateTimeType === 3) {
        this.pickerDate.onInitPickerMode(3);
        // 显示开始时间picker
        this.pickerDate.onShowPicker(this.sectionTypeToDurationItem.onExportLeaveStartTime());
      }
    }
  }

  // 请假原因点击事件
  onLeaveReasonClick() {
    if (!this.leaveReasonPicker || _.isEmpty(this.leaveReason)) {
      return;
    }
    this.leaveReasonPicker.onFreshSelectedValue(this.leaveReason);
    this.leaveReasonPicker.onShowLeaveReasonPicker();
  }

  // 请假时长点击事件
  onLeaveDurationClick() {
    if (!this.leaveDurationPickerItem) {
      return;
    }
    // 刷新时长
    this.leaveDurationPickerItem.onFreshVlaue(this.leaveLast);
    this.leaveDurationPickerItem.onShowDurationPicker();
  }

  // 申请提交
  onSubmitLeaveForm() {
    const params = {};
    if (_.isEmpty(this.leaveType) || _.isEmpty(this.leaveReason)) {
      return;
    }
    if (!this.sectionTypeToDurationItem || !this.sectionReasonItem || !this.sectionAttachmentItem || !this.leaveRemarkItem) {
      return;
    }
    if (_.isUndefined(this.sectionTypeToDurationItem.onExportLeaveTypeTo(this.leaveType))) {
      return;
    }
    if (_.isUndefined(this.sectionReasonItem.onExportLeaveReasonTo(this.leaveReason))) {
      return;
    }
    if (_.isUndefined(this.leaveRemarkItem.onExportLeaveRemark())) {
      return;
    }
    params.leaveType = this.leaveType;
    params.leaveId = this.sectionTypeToDurationItem.onExportLeaveTypeTo(this.leaveType).LeaveId;
    params.leaveModalIndex = this.sectionTypeToDurationItem.onExportLeaveModalId();
    params.leaveStartDate = this.leaveStartDate;
    params.leaveEndDate = this.leaveEndDate;
    params.leaveStartTime = this.leaveStartTime;
    params.leaveEndTime = this.leaveEndTime;
    params.leaveLast = this.leaveLast;
    params.leaveDurationAmount = 0;
    params.leaveUnit = 1;
    params.isFixedPeriod = 0;
    params.leaveReason = this.leaveReason;
    params.isNeedReasonChoose = this.sectionTypeToDurationItem.onExportLeaveTypeTo(this.leaveType).IsNeedReason;
    params.isNeedReason = this.sectionReasonItem.onExportLeaveReasonTo(this.leaveReason).IsNeedRemark;
    params.reasonId = this.sectionReasonItem.onExportLeaveReasonTo(this.leaveReason).ReasonId;
    params.leaveRemark = this.leaveRemarkItem.onExportLeaveRemark();
    params.isMustNeedAttach = this.sectionTypeToDurationItem.onExportLeaveTypeTo(this.leaveType).IsNeedAttchment;
    params.attachmentList = this.sectionAttachmentItem.onExportLeaveAttBase64Arr();
    DeviceEventEmitter.emit('REFRESH_VIEW_INIT', '');
    LeaveUtil.onSubmitLeaveReqClick(params);
  }

  // 返回处理
  onBackPress = () => {
    backPress = true;
    Keyboard.dismiss();
    this.props.navigator.pop();
  }

  // 刷新请假假别说明
  onUpdateLeaveTypeDesc() {
    const leaveTypeTo = this.sectionTypeToDurationItem.onExportLeaveTypeTo(this.leaveType);
    if (!_.isEmpty(leaveTypeTo.LeaveDescription)) {
      this.sectionTypeToDurationItem.onUpdateLeaveTypeDesc(leaveTypeTo.LeaveDescription);
    } else {
      this.sectionTypeToDurationItem.onHideLeaveTypeDesc();
    }
  }

  // *********************************************************************/
  // picker选中处理

  onShowCreaditsPopover() {
    const object = realm.objects('Config').filtered('name = "firstEnterLeavePage"').slice(0, 1);
    if (object.length == 0) {
      this.leaveCreaditsPopoverItem.showPopover(150, 140, device.width, device.height);
      realm.write(() => {
        realm.create('Config', { name: 'firstEnterLeavePage', enable: true });
      });
    }
  }

  // 请假类别选中处理
  onLeaveTypePicked(pickedValue) {
    if (!this.sectionTypeToDurationItem) {
      return;
    }
    // 格式化请假模式
    if (pickedValue && pickedValue.length > 0) {
      this.leaveType = pickedValue[0];
      this.onFreshLeaveModalDataSources();
      // 刷新假别
      this.onUpdateLeaveTypeDesc();
      // 请求时长
      this.leaveModalName = this.sectionTypeToDurationItem.onExportLeaveModal();
      if (_.isEmpty(this.leaveModalName)) {
        return;
      }
      const leaveModalId = this.sectionTypeToDurationItem.onExportLeaveModalIdByName(this.leaveModalName);
      // 时长请求 提前下班推迟上班 不请求时长 时长刷新0
      this.leaveLast = 0;
      this.sectionTypeToDurationItem.onRefreshDuration(0);
      if (leaveModalId === 4 || leaveModalId === 5) {
        this.sectionTypeToDurationItem.onRefreshLeaveType(this.leaveType);
        return;
      }
      // 请假模式为弹性时段 选择请假类型为年休假则提示 ‘该模式不支持弹性时段’
      if (leaveModalId === 6) {
        const leaveTypeIdTemp = this.sectionTypeToDurationItem.onExportLeaveTypeTo(this.leaveType).LeaveId;
        if (leaveTypeIdTemp === '1') {
          showMessage(messageType.error, I18n.t('mobile.module.leaveapply.leaveapplytypemodalnotmatch'));
          return;
        }
      }
      this.sectionTypeToDurationItem.onRefreshLeaveType(this.leaveType);
      this.sectionTypeToDurationItem.onLeaveDurationRequest(this.leaveType, this.onHandleDateTimeParam(), leaveModalId);
    }
  }

  // 模式选中后处理
  onLeaveModalPicked(pickedValue) {
    if (!this.sectionTypeToDurationItem) {
      return;
    }
    if (!_.isEmpty(this.leaveModalTemp) && '' != this.leaveModalTemp) {
      if (_.isEqual(`${pickedValue}`, `${this.leaveModalTemp}`)) {
        return;
      } else {
        this.leaveModalTemp = `${pickedValue}`;
      }
    }
    this.leaveLast = 0;
    // 请假时长刷新
    this.sectionTypeToDurationItem.onRefreshDuration(0);
    // 格式化请假模式
    if (pickedValue && pickedValue.length > 0) {
      this.leaveModalName = String(pickedValue[0]);
      this.sectionTypeToDurationItem.onRefreshLeaveModalNameByPickedValue(this.leaveModalName);
      // 时间模块显示控制
      const leaveModalId = this.sectionTypeToDurationItem.onExportLeaveModalIdByName(this.leaveModalName);
      this.sectionTypeToDurationItem.onHandleDateTimeShow(this.onHandleDateTimeParam(), leaveModalId);
      this.sectionTypeToDurationItem.onHandleLeaveDurationClickable(this.leaveModalName);
    }
  }

  onLeaveDatePickedDone(pickedValue) {
    // 刷新开始日期 结束日期 开始时间 结束时间
    if (!this.sectionTypeToDurationItem) {
      return;
    }
    switch (this.dateTimeType) {
      case 0:
        this.leaveStartDate = pickedValue;
        this.sectionTypeToDurationItem.onRefreshLeaveSatrtDate(getYYYYMMDDFormat(this.leaveStartDate));
        break;
      case 1:
        this.leaveEndDate = pickedValue;
        this.sectionTypeToDurationItem.onRefreshLeaveEndDate(true, getYYYYMMDDFormat(this.leaveEndDate));
        break;
      case 3:
        this.leaveStartTime = pickedValue;
        this.sectionTypeToDurationItem.onReFreshLeaveStartTimeByFlxiable(getHHmmFormat(this.leaveStartTime));
        break;
      case 4:
        this.leaveEndTime = pickedValue;
        this.sectionTypeToDurationItem.onReFreshLeaveEndTime(getHHmmFormat(this.leaveEndTime));
        break;
      default:
        break;
    }
    // 请求时长
    // 清空时长
    this.leaveLast = 0;
    this.sectionTypeToDurationItem.onRefreshDuration(0);
    this.sectionTypeToDurationItem.onLeaveDurationRequest(this.leaveType, this.onHandleDateTimeParam(), 0);
  }

  // 时长选中处理
  onLeaveDurationickedDone(pickedValue) {
    if (!this.sectionTypeToDurationItem) {
      return;
    }
    if (pickedValue && pickedValue.length > 0) {
      // 刷新请假时长
      this.leaveLast = pickedValue[0];
      this.sectionTypeToDurationItem.onRefreshDuration(this.leaveLast);
      // 请求时长
      const leaveModalId = this.sectionTypeToDurationItem.onExportLeaveModalIdByName(this.leaveModalName);
      if (leaveModalId === 6) {
        this.sectionTypeToDurationItem.onLeaveDurationRequest(this.leaveType, this.onHandleDateTimeParam(), this.leaveLast);
      }
    }
  }

  // 原因选中处理
  onLeaveReasonPicked(pickedValue) {
    if (!this.sectionReasonItem) {
      return;
    }
    this.leaveReason = pickedValue[0];
    // 刷新原因
    this.sectionReasonItem.onRefreshLeaveReasonData(pickedValue);
  }

  // 显示附件详情
  onShowAttDetailModal(rowID) {
    if (!this.sectionAttachmentItem || !this.leaveAttDetailPickerItem) {
      return;
    }
    this.attIndex = rowID;
    const attUriArr = this.sectionAttachmentItem.onExportLeaveAttUriArr();
    const attImgBase64Arr = this.sectionAttachmentItem.onExportLeaveAttBase64Arr();
    this.leaveAttDetailPickerItem.onShowAttDetail(attUriArr[rowID], attImgBase64Arr[rowID]);
  }

  // 删除附件
  onDeleteAttDetail() {
    if (!this.sectionAttachmentItem || !this.leaveAttDetailPickerItem) {
      return;
    }
    this.sectionAttachmentItem.onRefreshAttDataSources(this.attIndex);
    this.leaveAttDetailPickerItem.onCloseAttDetail();
  }

  // *********************************************************************/
  // 工具类

  // 初始化页面跳转
  onInitShiftParam() {
    if (this.isShiftFromSchedule !== 0) {
      this.isShiftFromSchedule = 0;
    }
  }

  // 初始化变量
  onInitParams() {
    this.leaveStartDate = '';
    this.leaveEndDate = '';
    this.leaveStartTime = '';
    this.leaveEndTime = '';
    this.leaveLast = 0;
    this.leaveModalTemp = '';
    // 服务器请求参数
    this.leaveModalName = '';
  }

  // 刷新请假模式数据源
  onFreshLeaveModalDataSources() {
    if (!this.state.isOk) {
      return;
    }
    // 刷新请假模式
    // 年休假不显示弹性时段
    const leaveModalIdTemp = this.sectionTypeToDurationItem.onExportLeaveTypeTo(this.leaveType).LeaveId;
    if (leaveModalIdTemp === '1') {
      // 刷新请假模式数据源 不含有请假
      this.leaveModalPicker.onFreshLeaveModalDataSources(true);
    } else {
      this.leaveModalPicker.onFreshLeaveModalDataSources(false);
    }
  }

  // 刷新leavamodalselectvalue
  onFreshLeaveModalSelectValue(pickedValue) {
    this.leaveModalPicker.onFreshLeaveModalSelectValue(pickedValue);
  }

  // 时间模块赋值
  onHandleDateTimeParam() {
    const dateTimeParams = {};
    dateTimeParams.leaveStartDate = this.leaveStartDate;
    dateTimeParams.leaveEndDate = this.leaveEndDate;
    dateTimeParams.leaveStartTime = this.leaveStartTime;
    dateTimeParams.leaveEndTime = this.leaveEndTime;
    return dateTimeParams;
  }

  // 结束日期+-1
  onHaandleEndDate() {
    if (this.isShiftFromSchedule === 1) {
      if (!LeaveDateUtil.onCompareTime(this.leaveStartDate, this.leaveEndDate, this.leaveStartTime, this.leaveEndTime)) {
        if (!(this.leaveStartDate === this.leaveEndDate && this.leaveStartTime === this.leaveEndTime)) {
          // 日期相同 时间不同
          if (this.leaveStartDate === this.leaveEndDate && this.leaveStartTime !== this.leaveEndTime) {
            this.leaveEndDate = LeaveDateUtil.onGetDateAfterDate(this.leaveEndDate, 1);
          }
        }
      }
    }
  }

  // 页面渲染
  render() {
    return (
      <View style={styles.container}>
        <ActionbarItem
          ref={actionbar => this.actionbar = actionbar}
          imgRight={creaditsImg}
          onBackAction={() => this.onBackPress()}
          onShiftAction={() => this.onHandleCreaditsViewShow()} />
        <KeyboardAvoiding behavior={this.state.behavior} style={{ flex: 1 }} behavior={this.state.behavior}>
          <ScrollView style={styles.ScrollViewStyle}>
            <SectionTypeToDuration
              ref={item => this.sectionTypeToDurationItem = item}
              LeaveTypeClick={() => this.onLeaveTypePickerClick()}
              LeaveModalClick={() => this.onLeaveModalItemClick()}
              leaveStartDateClick={() => this.onLeaveStartDateClick()}
              leaveEndDateClick={() => this.onLeaveEndDateClick()}
              leaveStartTimeClick={() => this.onLeaveStartTimeClick()}
              leaveEndTimeClick={() => this.onLeaveEndTimeClick()}
              leaveDurationClick={() => this.onLeaveDurationClick()} />
            <SectionReason
              ref={item => this.sectionReasonItem = item}
              open={(isSingle) => this.attsModal.open(isSingle)}
              leaveReasonClick={() => this.onLeaveReasonClick()} />
            <LeaveRemark
              ref={item => this.leaveRemarkItem = item} />
            <SectionAttachment
              ref={item => this.sectionAttachmentItem = item}
              open={(isSingle) => this.attsModal.open(isSingle)}
              onShowAttDetail={(rowID) => this.onShowAttDetailModal(rowID)} />
          </ScrollView>
        </KeyboardAvoiding>
        <LeaveSubmit
          ref={item => this.leaveSubmitItem = item}
          onSubmitLeaveForm={() => this.onSubmitLeaveForm()} />
        <Creadits
          ref={creadits => this.creadits = creadits}
          onCreaditsBackClick={() => this.onBackPress()} />
        <LeaveTypePicker
          ref={picker => this.leaveTypePicker = picker}
          onPickerDone={(pickedValue) => this.onLeaveTypePicked(pickedValue)} />
        <LeaveReasonPicker
          ref={picker => this.leaveReasonPicker = picker}
          onPickerDone={(pickedValue) => this.onLeaveReasonPicked(pickedValue)} />
        <LeaveDatePicker
          ref={picker => this.pickerDate = picker}
          selectValue={this.leaveStartDate}
          datePickerTitle={I18n.t('mobile.module.leaveapply.leaveapplydatetimepickertitle')}
          onPickerValue={(pickedValue) => this.onLeaveDatePickedDone(pickedValue)} />
        <LeaveCreaditsPopover
          ref={popover => this.leaveCreaditsPopoverItem = popover} />
        <LeaveAttDetailPicker
          ref={picker => this.leaveAttDetailPickerItem = picker}
          onDeleteAttModal={() => this.onDeleteAttDetail()} />
        <AttachmentModal
          ref={ref => { this.attsModal = ref; }}
          loadData={(images) => this.sectionAttachmentItem.loadData(images)}
          takePhotos={() => this.cameraAlert.open()}
          loadLibrary={() => this.libraryAlert.open()}
        />
        <ModalWithImage
          ref={ref => { this.cameraAlert = ref; }} title={I18n.t('mobile.module.mine.account.cameratitle')}
          subTitle={I18n.t('mobile.module.mine.account.camerasubtitle')} topButtonTitle={I18n.t('mobile.module.clock.getit')}
          topButtonPress={() => { this.cameraAlert.close(); }}
          bottomButtonTitle={I18n.t('mobile.module.mine.account.camerareject')}
          bottomButtonPress={() => { this.cameraAlert.close(); }}
        />
        <ModalWithImage
          ref={ref => { this.libraryAlert = ref; }} title={I18n.t('mobile.module.mine.account.librarytitle')}
          subTitle={I18n.t('mobile.module.mine.account.librarysubtitle')} topButtonTitle={I18n.t('mobile.module.clock.getit')}
          topButtonPress={() => { this.libraryAlert.close(); }}
          bottomButtonTitle={I18n.t('mobile.module.mine.account.camerareject')}
          bottomButtonPress={() => { this.libraryAlert.close(); }}
        />
        <LeaveModalPicker
          ref={picker => this.leaveModalPicker = picker}
          isModalPickerShow
          onPickerDone={(pickedValue) => this.onLeaveModalPicked(pickedValue)} />
        {
          this.state.isOk ?
            <LeaveDurationPicker
              ref={picker => this.leaveDurationPickerItem = picker}
              onPickerDone={(pickedValue) => this.onLeaveDurationickedDone(pickedValue)} /> : null
        }
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0EFF4',
  },
  ScrollViewStyle: {
    flex: 1,
  },
});