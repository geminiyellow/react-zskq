import {
  DeviceEventEmitter,
  InteractionManager,
  KeyboardAvoidingView,
  Keyboard,
  View,
} from 'react-native';
import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import _ from 'lodash';
import { event, device, keys } from '@/common/Util';
import { getYYYYMMDDFormat, getYYYYMMDDhhmmFormat, getHHmmFormat } from '@/common/Functions';
import { ABORT } from '@/common/Request';
import { LoadingManager } from '@/common/Loading';
import Functions from '@/common/Functions';
import I18n from 'react-native-i18n';
import UmengAnalysis from '@/common/components/UmengAnalysis';
import ScrollView from '@/common/components/ScrollView';
import AttachmentModal from "@/common/components/Attachment";
import ModalWithImage from '@/common/components/modal/ModalWithImage';

import realm from '@/realm';
import Realm from 'realm';

import ActionBarItem from './components/item/ActionBarItem';
import Creadits from './components/item/LeaveVocationItem';
import LeaveAttDetailPicker from './components/picker/LeaveAttDetailPicker';
import LeaveDatePicker from './components/picker/LeaveDatePicker';
import LeaveCreaditsPopover from './components/popover/LeaveCreaditsPopover';
import LeaveTypePicker from './components/picker/LeaveTypePicker';
import LeaveModalPicker from './components/picker/LeaveModalPicker';
import LeaveReasonPicker from './components/picker/LeaveReasonPicker';
import LeaveSubmit from './components/item/LeaveSubmitItem';
import LeaveUtil from './utils/LeaveUtil';
import LeaveDateUtil from './utils/LeaveDateUtil';
import SectionAttachment from './view/SectionAttachment';
import SectionReason from './view/SectionReason';
import LeaveRemark from './components/item/LeaveRemarkItem';
import SectionTypeToDuration from './view/SectionTypeToDuration';

import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
const customizedCompanyHelper = new CustomizedCompanyHelper();

const KeyboardAvoiding = device.isIos ? View : KeyboardAvoidingView;
// 额度图片
const creaditsImg = 'quota';

let backPress = false;
let firstClick = true;
let attachStr = '';

export default class LeaveApply extends PureComponent {

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
    this.leaveModalTemp = '';
  }

  componentWillMount() {
    if (!_.isEmpty(this.shiftToLeaveData) || !_.isUndefined(this.shiftToLeaveData)) {
      this.isShiftFromSchedule = 1;
      this.leaveStartDate = this.shiftToLeaveData.ShiftDate;
      this.leaveEndDate = this.shiftToLeaveData.ShiftDate;
      this.leaveStartTime = this.shiftToLeaveData.TimeFrom;
      this.leaveEndTime = this.shiftToLeaveData.TimeTo;
    } else {
      this.isShiftFromSchedule = 0;
      this.leaveStartDate = Functions.getNowFormatDate();
      this.leaveEndDate = Functions.getNowFormatDate();
      this.leaveStartTime = '00:00';
      this.leaveEndTime = '00:00';
    }
    this.leaveLast = 0;
    UmengAnalysis.onPageBegin('LeaveApply');
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
          if (!this.leaveTypePicker) {
            return;
          }
          this.leaveTypeDataTemp = eventBody;
          this.leaveTypePicker.onInitTypePicker(true, eventBody);
          // 加载默认配置
          if (eventBody.length > 0) {
            this.leaveType = eventBody[0];
            this.sectionTypeToDurationItem.onRefreshLeaveTypeData(this.leaveType, this.onHandleDateTimeParam(), this.isShiftFromSchedule);
            // 刷新假别说明
            this.onUpdateLeaveTypeDesc();
          }
          this.setState({
            isOk: true,
          });
        }
      }),
      // 请假模式
      DeviceEventEmitter.addListener(event.REFRESH_LEAVE_MODAL_DATA, (eventBody) => {
        if (!_.isEmpty(eventBody)) {
          if (!this.leaveModalPicker) {
            return;
          }
          this.leaveModalPicker.onInitModalPicker(true, eventBody);
        }
      }),
      // 请假时长
      DeviceEventEmitter.addListener(event.REFRESH_LEAVE_DURATION_DATA, (eventBody) => {
        console.log('eventBody=====',eventBody);
        if (!this.sectionTypeToDurationItem) {
          return;
        }
        const leaveModalId = this.sectionTypeToDurationItem.onExportLeaveModalId();
        if (!_.isEmpty(eventBody)) {
          // 加载时长
          // 刷新时间
          const unit = this.sectionTypeToDurationItem.onExportLeaveDurationData().leaveDurationUnit;
          if (leaveModalId !== 4) {
            this.onUpdateTime(eventBody);
          } else {
            if (unit != '1') {
              this.onUpdateTime(eventBody);
            }
          }
          if (_.isEmpty(this.leaveEndDate) || this.leaveEndDate === I18n.t('mobile.module.leaveapply.leaveapplydatedefault')) {
            this.leaveEndDate = this.leaveStartDate;
          }
          // 日期
          if (leaveModalId == 4) {
            if (unit != '1') {
              this.sectionTypeToDurationItem.onRefreshLeaveSatrtDate(getYYYYMMDDhhmmFormat(`${this.leaveStartDate} ${this.leaveStartTime}`));
              this.sectionTypeToDurationItem.onRefreshLeaveEndDate(true, getYYYYMMDDhhmmFormat(`${this.leaveEndDate} ${this.leaveEndTime}`));
            }
          }
          // 刷新开始时间结束时间
          this.sectionTypeToDurationItem.onRefreshLeaveStartTime(getHHmmFormat(this.leaveStartTime));
          this.sectionTypeToDurationItem.onRefreshLeaveEndTime(this.isEndDateClick, this.leaveEndDate, this.leaveEndTime);
          // 刷新时长
          if (global.loginResponseData.BackGroundVersion.indexOf('Y') != -1) {
            this.leaveLast = eventBody.hours;
          } else {
            this.leaveLast = eventBody.TotalAmt;
          }
          this.sectionTypeToDurationItem.onRefreshDuration(this.leaveLast);
          // 刷新固定时段显示
          if (global.loginResponseData.BackGroundVersion.indexOf('Y') == -1) {
            if (leaveModalId === 4) {
              this.sectionTypeToDurationItem.onShowFlexTime(this.leaveStartDate, this.leaveEndDate, this.leaveStartTime, this.leaveEndTime);
            }
          } else {
            this.sectionTypeToDurationItem.onShowFlexTimeDD(leaveModalId);
          }
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
            this.sectionTypeToDurationItem.onRefreshLeaveStartTime(getYYYYMMDDFormat('00:00'));
            this.sectionTypeToDurationItem.onRefreshLeaveEndTime(this.isEndDateClick, this.leaveEndDate, getYYYYMMDDFormat('00:00'));
          }
          // 刷新固定时段显示
          if (global.loginResponseData.BackGroundVersion.indexOf('Y') == -1) {
            if (leaveModalId === 4) {
              this.sectionTypeToDurationItem.onShowFlexTime(this.leaveStartDate, this.leaveEndDate, this.leaveStartTime, this.leaveEndTime);
            }
          } else {
            this.sectionTypeToDurationItem.onShowFlexTimeDD(leaveModalId);
          }
          // 清空时长
          this.leaveLast = 0;
          this.sectionTypeToDurationItem.onRefreshDuration(0);
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
            this.leaveReasonPicker.onInitReasonPicker(true, leaveReasonData);
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
        this.leaveStartTime = eventBody.leaveStartTime;
        this.leaveEndTime = eventBody.leaveEndTime;
        if (!this.sectionTypeToDurationItem) {
          return;
        }
        if (eventBody.leaveModalId === 1) {
          this.leaveEndDate = eventBody.leaveStartDate;
          this.sectionTypeToDurationItem.onRefreshLeaveSatrtDate(getYYYYMMDDFormat(`${this.leaveStartDate}`));
          this.sectionTypeToDurationItem.onRefreshLeaveEndDate(true, `${this.leaveEndDate}`);
        }
        if (eventBody.leaveModalId === 4) {
          this.leaveEndDate = eventBody.leaveEndDate;
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
        }
        this.sectionTypeToDurationItem.onRefreshLeaveStartTime(getHHmmFormat(this.leaveStartTime));
        this.sectionTypeToDurationItem.onRefreshLeaveEndTime(this.isEndDateClick, this.leaveEndDate, this.leaveEndTime);
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

  onUpdateTime(eventBody) {
    if (global.loginResponseData.BackGroundVersion.indexOf('Y') != -1) {
      this.leaveStartDate = eventBody.startDate;
      this.leaveEndDate = eventBody.endDate;
      this.leaveStartTime = eventBody.startTime;
      this.leaveEndTime = eventBody.endTime;
    } else {
      this.leaveStartTime = eventBody.StartTime;
      this.leaveEndTime = eventBody.EndTime;
    }
  }

  componentWillUnmount() {
    backPress = false;
    if (device.isAndroid) {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }
    UmengAnalysis.onPageEnd('LeaveApply');
    this.listeners && this.listeners.forEach(listener => listener.remove());
    ABORT('getEmployeeLeaveReasonList');

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
    attachStr = '';
    firstClick = true;
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
    this.isEndDateClick = 0;
    this.leaveModalTemp = '';
    this.onInitShiftParam();
    DeviceEventEmitter.emit('VIEW_INIT', '');
  }

  /**
   * 返回处理
   */
  onBackPress = (viewType, detailType) => {
    backPress = true;
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
    Keyboard.dismiss();
  }

  /**
   * 请假类型点击事件
   */
  onLeaveTypePickerClick() {
    if (!this.leaveTypePicker || _.isEmpty(this.leaveTypeDataTemp) || !this.sectionTypeToDurationItem) {
      return;
    }
    this.onInitShiftParam();
    // 刷新picker选中的值
    this.leaveTypePicker.onFreshLeaveTypeSelectData(this.leaveType);
    this.leaveTypePicker.onShowTypePicker();
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
    this.onUpdateLeaveTypeDesc();
    this.sectionTypeToDurationItem.onRefreshLeaveTypeData(this.leaveType, this.onHandleDateTimeParam(), this.isShiftFromSchedule);
  }

  // 请假模式picker选择完成处理
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
      if (global.loginResponseData.BackGroundVersion.indexOf('Y') != -1) {
        this.sectionTypeToDurationItem.onShowFlexTimeDD(leaveModalId);
      } else {
        if (leaveModalId != 4) {
          // 非弹性时段 隐藏固定时段
          this.sectionTypeToDurationItem.onHideLeaveFlextime();
        }
      }
      this.sectionTypeToDurationItem.onHandleDateTimeShow(this.onHandleDateTimeParam(), leaveModalId);
    }
  }

  // 请假模式itemclick
  onLeaveModalItemClick() {
    if (!this.leaveModalPicker) {
      return;
    }
    this.onInitShiftParam();
    // 刷新选中值
    this.leaveModalPicker.onFreshLeaveModalSelectData(this.leaveModalName);
    this.leaveModalPicker.onShowModalPicker();
  }

  onLeaveDateClick() {
    if (!this.sectionTypeToDurationItem || !this.pickerDate) {
      return;
    }
    this.pickerDate.onRefreshTtitle(this.dateType);
    this.onInitShiftParam();
    DeviceEventEmitter.emit('REFRESH_VIEW_INIT', '');
    if (_.isEmpty(this.leaveModalName)) {
      this.leavemodalName = this.sectionTypeToDurationItem.onExportLeaveModalName();
    }
    const leaveModalId = this.sectionTypeToDurationItem.onShiftLeaveModalNameToId(this.leaveModalName);
    if (this.dateType === 0) {
      if (leaveModalId === 4) {
        this.pickerDate.onInitPickerMode(2);
        this.pickerDate.onShowPicker(`${this.leaveStartDate} ${this.leaveStartTime}`);
      } else {
        this.pickerDate.onInitPickerMode(1);
        this.pickerDate.onShowPicker(`${this.leaveStartDate}`);
      }
    } else if (this.dateType !== 4) {
      if (leaveModalId === 4) {
        this.pickerDate.onInitPickerMode(2);
        this.pickerDate.onShowPicker(`${this.leaveEndDate} ${this.leaveEndTime}`);
      } else {
        this.pickerDate.onInitPickerMode(1);
        this.pickerDate.onShowPicker(`${this.leaveEndDate}`);
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
    // 刷新时长为0
    this.leaveLast = 0;
    this.sectionTypeToDurationItem.onRefreshDuration(0);
    const leaveModalId = this.sectionTypeToDurationItem.onShiftLeaveModalNameToId(this.leaveModalName);
    if (leaveModalId === 4) {
      const dateTimeArr = LeaveDateUtil.onHandleDateTimeValue(pickedValue);
      if (this.dateType === 0) {
        this.leaveStartDate = dateTimeArr[0];
        this.leaveStartTime = dateTimeArr[1];
        this.sectionTypeToDurationItem.onRefreshLeaveSatrtDate(getYYYYMMDDhhmmFormat(`${this.leaveStartDate} ${this.leaveStartTime}`));
      } else {
        this.leaveEndDate = dateTimeArr[0];
        this.leaveEndTime = dateTimeArr[1];
        this.sectionTypeToDurationItem.onRefreshLeaveEndDate(true, getYYYYMMDDhhmmFormat(`${this.leaveEndDate} ${this.leaveEndTime}`));
      }
      if (global.loginResponseData.BackGroundVersion.indexOf('Y') == -1) {
        this.sectionTypeToDurationItem.onShowFlexTime(this.leaveStartDate, this.leaveEndDate, this.leaveStartTime, this.leaveEndTime);
      }
    } else if (leaveModalId !== 4) {
      if (this.dateType === 0) {
        this.leaveStartDate = pickedValue;
        this.sectionTypeToDurationItem.onRefreshLeaveSatrtDate(getYYYYMMDDFormat(this.leaveStartDate));
      }
      if (this.dateType === 1) {
        this.leaveEndDate = pickedValue;
        this.sectionTypeToDurationItem.onRefreshLeaveEndDate(true, getYYYYMMDDFormat(this.leaveEndDate));
      }
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

  onHandleDateChange(dateParam) {
    if (!this.sectionTypeToDurationItem) {
      return;
    }
    this.leaveStartDate = dateParam.leaveStartDate;
    this.leaveEndDate = dateParam.leaveEndDate;
    this.leaveStartTime = dateParam.leaveStartTime;
    this.leaveEndTime = dateParam.leaveEndTime;
    // getYYYYMMDDFormat, getYYYYMMDDhhmmFormat, getHHmmFormat
    switch (dateParam.leaveModalId) {
      case 1:
        this.sectionTypeToDurationItem.onRefreshLeaveSatrtDate(getYYYYMMDDFormat(this.leaveStartDate));
        this.sectionTypeToDurationItem.onRefreshLeaveEndDate(true, getYYYYMMDDFormat(this.leaveEndDate));
        break;
      case 2:
      case 3:
        this.sectionTypeToDurationItem.onRefreshLeaveStartTime(getHHmmFormat(this.leaveStartTime));
        this.sectionTypeToDurationItem.onRefreshLeaveEndTime(this.isEndDateClick, this.leaveEndDate, this.leaveEndTime);
        break;
      case 4:
        this.sectionTypeToDurationItem.onRefreshLeaveSatrtDate(getYYYYMMDDhhmmFormat(`${this.leaveStartDate} ${this.leaveStartTime}`));
        this.sectionTypeToDurationItem.onRefreshLeaveEndDate(true, getYYYYMMDDhhmmFormat(`${this.leaveEndDate} ${this.leaveEndTime}`));
        break;
      default:
        break;
    }
  }

  // 请假原因点击
  onLeaveReasonClick() {
    if (!this.leaveReasonPicker || _.isEmpty(this.leaveReason)) {
      return;
    }
    this.onInitShiftParam();
    DeviceEventEmitter.emit('REFRESH_VIEW_INIT', '');
    // 刷新选中的值
    this.leaveReasonPicker.onFreshLeaveReasonSelectData(this.leaveReason);
    this.leaveReasonPicker.onShowReasonPicker();
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

  // 刷新请假假别说明
  onUpdateLeaveTypeDesc() {
    const leaveTypeTo = this.sectionTypeToDurationItem.onExportLeaveTypeTo(this.leaveType);
    if (!_.isEmpty(leaveTypeTo.LeaveDescription)) {
      this.sectionTypeToDurationItem.onUpdateLeaveTypeDesc(leaveTypeTo.LeaveDescription);
    } else {
      this.sectionTypeToDurationItem.onHideLeaveTypeDesc();
    }
  }

  // 提交表单
  onSubmitLeaveForm() {
    const params = {};
    let isDD = false;
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
    params.leaveModalIndex = this.sectionTypeToDurationItem.onExportLeaveModalId();
    params.leaveStartDate = this.leaveStartDate;
    params.leaveEndDate = this.leaveEndDate;
    params.leaveStartTime = this.leaveStartTime;
    params.leaveEndTime = this.leaveEndTime;
    params.leaveLast = this.leaveLast;
    params.leaveDurationAmount = this.sectionTypeToDurationItem.onExportLeaveDurationAmount();
    params.leaveUnit = this.sectionTypeToDurationItem.onExportLeaveDurationData().leaveDurationUnit;
    // isFixedPeriod
    params.isFixedPeriod = this.sectionTypeToDurationItem.onExportLeaveFlexTimeStatus();
    if (global.loginResponseData.BackGroundVersion.indexOf('Y') != -1) {
      isDD = true;
      if (params.isFixedPeriod == 0) {
        params.FixedDurationCount = 0;
      } else {
        params.FixedDurationCount = this.sectionTypeToDurationItem.onExportRepeatTimes();
      }
    }
    params.leaveReason = this.leaveReason;
    params.isNeedReasonChoose = this.sectionTypeToDurationItem.onExportLeaveTypeTo(this.leaveType).IsNeedReason;
    params.isNeedReason = this.sectionReasonItem.onExportLeaveReasonTo(this.leaveReason).IsNeedRemark;
    params.reasonId = this.sectionReasonItem.onExportLeaveReasonTo(this.leaveReason).ReasonId;
    params.leaveRemark = this.leaveRemarkItem.onExportLeaveRemark();
    params.isMustNeedAttach = this.sectionTypeToDurationItem.onExportLeaveTypeTo(this.leaveType).IsNeedAttchment;
    // 乐宁教育新增 行政坐班 与 课时 字段
    if (customizedCompanyHelper.getCompanyCode().toLowerCase() == 'lening') {
      params.leaveClassHour = this.sectionTypeToDurationItem.onExportLeaveClassValue();
      params.leaveOfficeHour = this.sectionTypeToDurationItem.onExportLeaveOffValue();
    }
    if (firstClick) {
      firstClick = false;
      attachStr = this.sectionAttachmentItem.onExportLeaveAttBase64Arr();
    }
    params.attachmentList = attachStr;
    DeviceEventEmitter.emit('REFRESH_VIEW_INIT', '');
  
    LeaveUtil.onSubmitLeaveReqClick(params, isDD);
  }

  // 初始化页面跳转
  onInitShiftParam() {
    if (this.isShiftFromSchedule !== 0) {
      this.isShiftFromSchedule = 0;
      DeviceEventEmitter.emit('UPDATE_SHIFT_VIEW', '');
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
        <LeaveModalPicker
          ref={picker => this.leaveModalPicker = picker}
          onPickerDone={(pickedValue) => this.onLeaveModalPicked(pickedValue)} />
        <LeaveReasonPicker
          ref={picker => this.leaveReasonPicker = picker}
          onPickerDone={(pickedValue) => this.onLeaveReasonPickedDone(pickedValue)} />
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