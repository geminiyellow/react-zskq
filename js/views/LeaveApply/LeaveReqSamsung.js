import {
  DeviceEventEmitter,
  KeyboardAvoidingView,
  Keyboard,
  View,
} from 'react-native';
import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import _ from 'lodash';
import { event, device, keys } from '@/common/Util';
import { ABORT } from '@/common/Request';
import { LoadingManager } from '@/common/Loading';
import Functions from '@/common/Functions';
import I18n from 'react-native-i18n';
import ScrollView from '@/common/components/ScrollView';
import AttachmentModal from "@/common/components/Attachment";
import ModalWithImage from '@/common/components/modal/ModalWithImage';
import LeaveTypePicker from '@/views/LeaveApply/components/picker/Estee/LeaveTypePicker';

import realm from '@/realm';
import Realm from 'realm';

import { getYYYYMMDDFormat, getYYYYMMDDhhmmFormat, getHHmmFormat } from '@/common/Functions';

import ActionBarItem from './components/item/ActionBarItem';
import Creadits from './components/item/LeaveVocationItem';
import LeaveAttDetailPicker from './components/picker/LeaveAttDetailPicker';
import LeaveDatePicker from './components/picker/LeaveDatePicker';
import LeaveCreaditsPopover from './components/popover/LeaveCreaditsPopover';
import Picker from './components/picker/Picker';
import LeaveSubmit from './components/item/LeaveSubmitItem';
import LeaveUtil from './utils/LeaveUtil';
import LeaveDateUtil from './utils/LeaveDateUtil';
import SectionAttachment from './view/Samsung/SectionAttachment';
import SectionReason from './view/SectionReason';
import LeaveRemark from './components/item/LeaveRemarkItem';
import SectionTypeToDuration from './view/Samsung/SectionTypeToDuration';

const KeyboardAvoiding = device.isIos ? View : KeyboardAvoidingView;
// 额度图片
const creaditsImg = 'quota';

let backPress = false;

export default class LeaveReqSamsung extends PureComponent {

  constructor(...props) {
    super(...props);
    this.state = {
      isOk: false,
      dapePickerMode: this.props.datePickerMode,
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
      this.onHandleEndDate();
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

  // 组件渲染完成 加载默认值
  componentDidMount() {
    // 请假类型消息监听事件
    this.listeners = [
      // 请假类别
      DeviceEventEmitter.addListener(event.REFRESH_LEAVE_TYPE_DATA, (eventBody) => {
        if (!_.isEmpty(eventBody)) {
          // 请假picker数据源更新
          // 加载页面modal
          if (!this.leavePicker) {
            return;
          }
          this.leaveTypeDataTemp = eventBody;
          this.leaveTypePicker.onInitLeaveTypePickerData(true, eventBody);
          // 加载默认配置
          if (eventBody.length > 0) {
            this.leaveType = eventBody[0];
            this.sectionTypeToDurationItem.onRefreshLeaveTypeData(this.leaveType, this.onHandleDateTimeParam());
          }
          this.setState({
            isOk: true,
          });
          // 更新leavecode
          const leaveTypeTo = this.sectionTypeToDurationItem.onExportLeaveTypeTo(this.leaveType);
          DeviceEventEmitter.emit('FRESH_LEAVE_CODE', leaveTypeTo.LeaveCode);
        }
      }),
      // 请假模式
      DeviceEventEmitter.addListener(event.REFRESH_LEAVE_MODAL_DATA, (eventBody) => {
        if (!_.isEmpty(eventBody)) {
          if (!this.leavePicker) {
            return;
          }
          this.leavePicker.onInitLeaveModalPicker(eventBody);
        }
      }),
      // 请假时长
      DeviceEventEmitter.addListener(event.REFRESH_LEAVE_DURATION_DATA, (eventBody) => {
        if (!this.sectionTypeToDurationItem) {
          return;
        }
        const leaveModalId = 4;
        if (!_.isEmpty(eventBody)) {
          // 加载时长
          // 刷新时间
          if (leaveModalId !== 4) {
            this.leaveStartTime = eventBody.StartTime;
            this.leaveEndTime = eventBody.EndTime;
          }
          if (_.isEmpty(this.leaveEndDate) || this.leaveEndDate === I18n.t('mobile.module.leaveapply.leaveapplydatedefault')) {
            this.leaveEndDate = this.leaveStartDate;
          }
          // 刷新开始时间结束时间
          this.sectionTypeToDurationItem.onRefreshLeaveStartTime(this.leaveStartTime);
          this.sectionTypeToDurationItem.onRefreshLeaveEndTime(this.isEndDateClick, getYYYYMMDDFormat(this.leaveEndDate), this.leaveEndTime);
          // 刷新时长
          this.leaveLast = eventBody.TotalAmt;
          this.sectionTypeToDurationItem.onRefreshDuration(eventBody.TotalAmt);
        } else {
          if (leaveModalId === 1) {
            if (_.isEmpty(this.leaveEndDate) || this.leaveEndDate === I18n.t('mobile.module.leaveapply.leaveapplydatedefault')) {
              this.leaveEndDate = this.leaveStartDate;
            }
            this.sectionTypeToDurationItem.onRefreshLeaveEndDate(true, getYYYYMMDDFormat(this.leaveEndDate));
          }
          if (this.leaveModalId === 4) {
            if (_.isEmpty(this.leaveEndDate) || this.leaveEndDate === I18n.t('mobile.module.leaveapply.leaveapplydatedefault')) {
              this.leaveEndDate = this.leaveStartDate;
              this.leaveEndTime = this.leaveStartTime;
            }
            this.sectionTypeToDurationItem.onRefreshLeaveEndDate(true, getYYYYMMDDhhmmFormat(`${this.leaveEndDate} ${this.leaveEndTime}`));
          }
          if (this.leaveModalId === 2 || this.leaveModalId === 3) {
            if (_.isEmpty(this.leaveEndDate) || this.leaveEndDate === I18n.t('mobile.module.leaveapply.leaveapplydatedefault')) {
              this.leaveEndDate = this.leaveStartDate;
            }
            this.sectionTypeToDurationItem.onRefreshLeaveStartTime('00:00');
            this.sectionTypeToDurationItem.onRefreshLeaveEndTime(this.isEndDateClick, getYYYYMMDDFormat(this.eaveEndDate), '00:00');
          }
          // 清空时长
          this.leaveLast = 0;
          this.sectionTypeToDurationItem.onRefreshDuration(0);
        }
      }),
      // 请假原因
      DeviceEventEmitter.addListener(event.REFRESH_LEAVE_REASON_DATA, (eventBody) => {
        if (!_.isEmpty(eventBody)) {
          if (!this.sectionReasonItem || !this.leavePicker) {
            return;
          }
          this.sectionReasonItem.onHandleLeaveReasonData(eventBody);
          const leaveReasonData = this.sectionReasonItem.onExportLeaveReasonData();
          if (leaveReasonData && leaveReasonData.length > 0) {
            this.leaveReason = leaveReasonData[0];
            this.leavePicker.onInitLeaveReasonPickerData(leaveReasonData);
          }
        }
      }),
      // 请假提交
      DeviceEventEmitter.addListener(event.REFRESH_LEAVE_SUBMIT, (eventBody) => {
        if (eventBody) {
          DeviceEventEmitter.emit(event.REFRESH_CORNER_EVENT, true);
          this.props.navigator.pop();
        }
      }),
      DeviceEventEmitter.addListener(event.REFRESH_LEAVE_DATE, (eventBody) => {
        if (!_.isEmpty(eventBody)) {
          this.onHandleDateChange(eventBody);
        }
      }),
      // 类别模式选择弹性时段后刷新时间日期
      DeviceEventEmitter.addListener(event.REFRESH_LEAVE_TIME, (eventBody) => {
        this.leaveStartDate = eventBody.leaveStartDate;
        this.leaveEndDate = eventBody.leaveEndDate;
        this.leaveStartTime = eventBody.leaveStartTime;
        this.leaveEndTime = eventBody.leaveEndTime;
        if (!this.sectionTypeToDurationItem) {
          return;
        }
        // getYYYYMMDDFormat, getYYYYMMDDhhmmFormat, getHHmmFormat
        if (this.leaveStartDate === I18n.t('mobile.module.leaveapply.leaveapplydatedefault')) {
          this.sectionTypeToDurationItem.onRefreshLeaveSatrtDate(getYYYYMMDDFormat(`${this.leaveStartDate}`));
        } else {
          this.sectionTypeToDurationItem.onRefreshLeaveSatrtDate(getYYYYMMDDhhmmFormat(`${this.leaveStartDate} ${this.leaveStartTime}`));
        }
        if (this.leaveEndDate === I18n.t('mobile.module.leaveapply.leaveapplydatedefault')) {
          this.sectionTypeToDurationItem.onRefreshLeaveEndDate(true, getYYYYMMDDFormat(`${this.leaveEndDate}`));
        } else {
          this.sectionTypeToDurationItem.onRefreshLeaveEndDate(true, getYYYYMMDDhhmmFormat(`${this.leaveEndDate} ${this.leaveEndTime}`));
        }
        this.sectionTypeToDurationItem.onRefreshLeaveStartTime(this.leaveStartTime);
        this.sectionTypeToDurationItem.onRefreshLeaveEndTime(this.isEndDateClick, getYYYYMMDDFormat(this.leaveEndDate), this.leaveEndTime);
      }),
      // 相机权限iOS使用
      DeviceEventEmitter.addListener('CAMERAACCESS', (eventBody) => {
        if (!this.cameraAlert) {
          return;
        }
        this.cameraAlert.open();
      }),
      // 刷新请假模式名称
      DeviceEventEmitter.addListener('REFRESH_LEAVE_MODAL_NAME', (eventBody) => {
        if (!_.isEmpty(eventBody)) {
          this.leaveModalName = `${eventBody}`;
        }
      }),
      // 刷新固定时段点击
      DeviceEventEmitter.addListener('REFRESH_FLEX_TIME_CLICK', (eventBody) => {
        this.isFlexTimeReq = 1;
      }),
    ];
    // 显示pop over
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
    this.listeners && this.listeners.forEach(listener => listener.remove());
    ABORT('getEmployeeLeaveReasonList');
    if (device.isAndroid) {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }
    LoadingManager.stop();
  }

  onShowCreaditsPopover() {
    const object = realm.objects('Config').filtered('name = "firstEnterLeavePage"').slice(0, 1);
    if (object.length == 0) {
      this.leaveCreaditsPopoverItem.showPopover(150, 140, device.width, device.height);
      realm.write(() => {
        realm.create('Config', { name: 'firstEnterLeavePage', enable: true });
      });
    }
  }

  onHandleCreaditsViewShow() {
    Keyboard.dismiss();
    DeviceEventEmitter.emit('REFRESH_VIEW_INIT', '');
    this.creadits.onOpenCreaditsModal(true);
  }

  /**
   * 初始化变量
   */
  onInitParams() {
    this.leaveStartDate = '';
    this.leaveEndDate = '';
    this.leaveStartTime = '';
    this.leaveEndTime = '';
    this.leaveLast = 0;
    // 请假类别数据Temp
    this.leaveTypeDataTemp = '';
    // 服务器请求参数
    this.leaveType = '';
    this.leaveModalName = '';
    this.dateType = 0;
    this.attIndex = 0;
    this.leaveReason = '';
    this.isFlexTimeReq = 0;
    this.isEndDateClick = 0;
    this.onInitShiftParam();
    DeviceEventEmitter.emit('VIEW_INIT', '');
  }

  /**
   * 返回处理
   */
  onBackPress = (viewType, detailType) => {
    backPress = true;
    Keyboard.dismiss();
    if (viewType === 0) {
      this.props.navigator.pop();
    }
    if (viewType === 1) {
      // 关闭额度页面 或者 额度显示列表页面
      switch (detailType) {
        case 0:
          // 关闭modal
          this.props.navigator.pop();
          break;
        case 1:
          // 返回列表页面
          this.creadits.onShowList('transparent');
          break;
        default:
          break;
      }
    }
  }

  /**
   * 请假类型点击事件
   */
  onLeaveTypePickerClick() {
    if (_.isEmpty(this.leaveTypeDataTemp) || !this.sectionTypeToDurationItem) {
      return;
    }
    this.onInitShiftParam();
    // 刷新picker选中的值
    this.leaveTypePicker.onFreshPickerSlectedData(this.leaveType);
    this.leaveTypePicker.onShowLeaveTypePicker();
    DeviceEventEmitter.emit('REFRESH_VIEW_INIT', '');
  }

  // 请假类型选择结果处理
  onHandleLeaveTypePickedData(pickedValue) {
    if (!this.sectionTypeToDurationItem) {
      return;
    }
    if (!pickedValue || pickedValue.length <= 0) {
      return;
    }
    this.leaveType = pickedValue[0];
    this.sectionTypeToDurationItem.onRefreshLeaveTypeData(this.leaveType, this.onHandleDateTimeParam());
  }

  // 请假模式picker选择完成处理
  onLeaveModalPicked(pickedValue) {
    if (!this.sectionTypeToDurationItem) {
      return;
    }
    DeviceEventEmitter.emit('REFRESH_VIEW_INIT', '');
    // 清空时长
    this.leaveLast = 0;
    this.sectionTypeToDurationItem.onRefreshDuration(0);
    // 格式化请假模式
    if (pickedValue && pickedValue.length > 0) {
      this.leaveModalName = String(pickedValue[0]);
      this.sectionTypeToDurationItem.onRefreshLeaveModalNameByPickedValue(this.leaveModalName);
      // 时间模块显示控制
      const leaveModalId = this.sectionTypeToDurationItem.onShiftLeaveModalNameToId(this.leaveModalName);
      if (leaveModalId != 4) {
        // 非弹性时段 隐藏固定时段
        this.sectionTypeToDurationItem.onHideLeaveFlextime();
      }
      this.sectionTypeToDurationItem.onHandleDateTimeShow(this.onHandleDateTimeParam(), leaveModalId);
    }
  }

  // 请假模式itemclick
  onLeaveModalItemClick() {
    if (!this.leavePicker) {
      return;
    }
    this.onInitShiftParam();
    // 刷新选中值
    this.leavePicker.onRefreshLeaveModalSelectValue(this.leaveModalName);
    this.leavePicker.onShowLeaveModalPicker();
  }

  onLeaveDateClick() {
    if (!this.sectionTypeToDurationItem || !this.pickerDate) {
      return;
    }
    this.pickerDate.onRefreshTtitle(this.dateType);
    this.onInitShiftParam();
    DeviceEventEmitter.emit('REFRESH_VIEW_INIT', '');
    const leaveModalId = 4;
    if (this.dateType === 0) {
      if (leaveModalId === 4) {
        this.pickerDate.onInitPickerMode(2);
        this.pickerDate.onShowPicker(`${this.leaveStartDate} ${this.leaveStartTime}`);
      }
    } else if (this.dateType !== 4) {
      if (leaveModalId === 4) {
        this.pickerDate.onInitPickerMode(2);
        this.pickerDate.onShowPicker(`${this.leaveEndDate} ${this.leaveEndTime}`);
      }
    }
  }

  // 请假开始日期点击
  onLeaveStartDateClick() {
    if (!this.sectionTypeToDurationItem || !this.pickerDate) {
      return;
    }
    this.dateType = 0;
    this.onLeaveDateClick();
  }

  // 请假结束日期点击
  onLeaveEndDateClick() {
    if (!this.sectionTypeToDurationItem || !this.pickerDate) {
      return;
    }
    this.dateType = 1;
    this.onLeaveDateClick();
  }

  onLeaveDatePickedDone(pickedValue) {
    if (!this.sectionTypeToDurationItem) {
      return;
    }
    console.log('pickedValue====', pickedValue);
    // 清空时长
    this.leaveLast = 0;
    this.sectionTypeToDurationItem.onRefreshDuration(0);
    const dateTimeArr = LeaveDateUtil.onHandleDateTimeValue(pickedValue);
    if (this.dateType === 0) {
      this.leaveStartDate = dateTimeArr[0];
      this.leaveStartTime = dateTimeArr[1];
      this.sectionTypeToDurationItem.onRefreshLeaveSatrtDate(getYYYYMMDDhhmmFormat(pickedValue));
    } else {
      this.leaveEndDate = dateTimeArr[0];
      this.leaveEndTime = dateTimeArr[1];
      this.sectionTypeToDurationItem.onRefreshLeaveEndDate(true, getYYYYMMDDhhmmFormat(pickedValue));
    }
    // 日期选中后时长请求
    this.sectionTypeToDurationItem.onLeaveDurationRequest(this.leaveType, this.onHandleDateTimeParam());
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
  onHandleEndDate() {
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

  onHandleDateChange(dateParam) {
    if (!this.sectionTypeToDurationItem) {
      return;
    }
    this.leaveStartDate = dateParam.leaveStartDate;
    this.leaveEndDate = dateParam.leaveEndDate;
    this.leaveStartTime = dateParam.leaveStartTime;
    this.leaveEndTime = dateParam.leaveEndTime;
    this.sectionTypeToDurationItem.onRefreshLeaveSatrtDate(getYYYYMMDDhhmmFormat(`${this.leaveStartDate} ${this.leaveStartTime}`));
    this.sectionTypeToDurationItem.onRefreshLeaveEndDate(true, getYYYYMMDDhhmmFormat(`${this.leaveEndDate} ${this.leaveEndTime}`));
  }

  // 请假原因点击
  onLeaveReasonClick() {
    if (!this.leavePicker || _.isEmpty(this.leaveReason)) {
      return;
    }
    this.onInitShiftParam();
    DeviceEventEmitter.emit('REFRESH_VIEW_INIT', '');
    // 刷新选中的值
    this.leavePicker.onRefreshLeaveReasonSelectValue(this.leaveReason);
    this.leavePicker.onShowLeaveReasonPicker();
  }

  // 请假原因选择处理
  onLeaveReasonPickedDone(pickedValue) {
    if (pickedValue && pickedValue.length > 0) {
      DeviceEventEmitter.emit('REFRESH_VIEW_INIT', '');
      this.leaveReason = pickedValue[0];
      this.sectionReasonItem.onRefreshLeaveReasonData(pickedValue[0]);
    }
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

  // 提交表单
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
    if (_.isUndefined(this.sectionTypeToDurationItem.onExportLeaveDurationData())) {
      return;
    }
    if (_.isUndefined(this.leaveRemarkItem.onExportLeaveRemark())) {
      return;
    }
    params.leaveType = this.leaveType;
    params.leaveCode = this.sectionTypeToDurationItem.onExportLeaveTypeTo(this.leaveType).LeaveCode;
    params.leaveId = this.sectionTypeToDurationItem.onExportLeaveTypeTo(this.leaveType).LeaveId;
    params.leaveModalIndex = 4;
    params.leaveStartDate = this.leaveStartDate;
    params.leaveEndDate = this.leaveEndDate;
    params.leaveStartTime = this.leaveStartTime;
    params.leaveEndTime = this.leaveEndTime;
    params.leaveLast = this.leaveLast;
    params.leaveDurationAmount = this.sectionTypeToDurationItem.onExportLeaveDurationAmount();
    params.leaveUnit = this.sectionTypeToDurationItem.onExportLeaveDurationData().leaveDurationUnit;
    params.isFixedPeriod = this.sectionTypeToDurationItem.onExportLeaveFlexTimeStatus();
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

  // 初始化页面跳转
  onInitShiftParam() {
    if (this.isShiftFromSchedule !== 0) {
      this.isShiftFromSchedule = 0;
    }
  }

  // 页面渲染
  render() {
    return (
      <View style={styles.container}>
        <ActionBarItem
          ref={actionbar => this.actionbar = actionbar}
          imgRight={creaditsImg}
          onBackAction={() => {
            const viewType = 0;
            const detailType = 0;
            this.onBackPress(viewType, detailType);
          }}
          onShiftAction={() => this.onHandleCreaditsViewShow()} />
        <KeyboardAvoiding behavior={this.state.behavior} style={{ flex: 1 }}>
          <ScrollView style={styles.ScrollViewStyle} behavior={this.state.behavior}>
            <SectionTypeToDuration
              ref={item => this.sectionTypeToDurationItem = item}
              LeaveTypeClick={() => this.onLeaveTypePickerClick()}
              LeaveModalClick={() => this.onLeaveModalItemClick()}
              leaveStartDateClick={() => this.onLeaveStartDateClick()}
              leaveEndDateClick={() => this.onLeaveEndDateClick()} />
            <SectionReason
              ref={item => this.sectionReasonItem = item}
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
          isListShow
          onCreaditsBackClick={(viewType, detailType) => this.onBackPress(viewType, detailType)} />
        <LeaveTypePicker
          ref={picker => this.leaveTypePicker = picker}
          onPickerDone={(pickedValue) => this.onHandleLeaveTypePickedData(pickedValue)} />
        <Picker
          ref={picker => this.leavePicker = picker}
          onLeaveModalPicked={(pickedValue) => this.onLeaveModalPicked(pickedValue)}
          onLeaveReasonPicked={(pickedValue) => this.onLeaveReasonPickedDone(pickedValue)} />
        <LeaveAttDetailPicker
          ref={picker => this.leaveAttDetailPickerItem = picker}
          onDeleteAttModal={() => this.onDeleteAttDetail()} />
        <LeaveCreaditsPopover
          ref={popover => this.leaveCreaditsPopoverItem = popover} />
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
        {
          this.state.isOk ?
            <LeaveDatePicker
              ref={picker => this.pickerDate = picker}
              selectValue={this.leaveStartDate}
              datePickerTitle={I18n.t('mobile.module.leaveapply.leaveapplydatetimepickertitle')}
              onPickerValue={(pickedValue) => this.onLeaveDatePickedDone(pickedValue)} /> : null
        }
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#eeeeee',
  },
  ScrollViewStyle: {
    flexGrow: 1,
  },
});