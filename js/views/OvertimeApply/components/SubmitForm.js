/**
 * 加班申请提交表单界面
 */

import { DeviceEventEmitter, NativeModules } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import SubmitButton from '@/common/components/SubmitButton';
import { getCurrentLanguage } from '@/common/Functions';
import I18n from 'react-native-i18n';
import Style from '@/common/Style';
import { event } from '@/common/Util';
import { submitEmployeeOverTimeFormRequest } from '@/common/api';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import { POST } from '@/common/Request';
import { amountOverColor } from '../constants';

const { RNManager } = NativeModules;

export default class SubmitForm extends PureComponent {

  constructor(...props) {
    super(...props);
    this.state = {
      buttonBg: Style.color.mainColorLight,
    };
    // 判断当前的语言环境
    getCurrentLanguage().then(data => {
      this.language = data;
    });
    // 获取表单的信息
    this.textReasonDetails = {};
    this.submitParams = {};
    // 接口信息初始化
    this.getOverTimePreSetInfo = '';
    this.getEmployeeOverTimeRule = '';
    this.getEmployeeActualOTHours = '';
  }

  // 设置按钮的颜色
  onSetButtonColor(getOverTimePreSetInfo) {
    this.getOverTimePreSetInfo = getOverTimePreSetInfo;
    // 设置按钮的颜色
    const { ApprovedOTHours, ApplyingOTHours, SecurityOTHours } = getOverTimePreSetInfo;
    if (!_.isEmpty(getOverTimePreSetInfo) && (ApprovedOTHours + ApplyingOTHours) > SecurityOTHours) {
      this.setState({
        buttonBg: amountOverColor,
      });
    } else {
      this.setState({
        buttonBg: Style.color.mainColorLight,
      });
    }
  }

  // 设置表单的数据----加班的规则和加班的时数
  onSetSubmitParams(getEmployeeOverTimeRule, getEmployeeActualOTHours) {
    if (!_.isEmpty(getEmployeeOverTimeRule)) {
      this.getEmployeeOverTimeRule = getEmployeeOverTimeRule;
    }
    if (!_.isEmpty(getEmployeeActualOTHours)) {
      this.getEmployeeActualOTHours = getEmployeeActualOTHours;
    }
  }

  // 检查表单的数据
  onSubmit = () => {
    // 获取picker的数据
    const { selectDateTemp, selectStartTemp, selectEndTemp } = this.props.pickerTime();
    const { dayTypeId, selectReason, getEmployeeOverTimeReasonMap } = this.props.pickerOption();
    if (_.isEmpty(selectEndTemp) || selectEndTemp === I18n.t('mobile.module.overtime.overtimeapplypicker')) {
      showMessage(messageType.error, I18n.t('mobile.module.overtime.overtimeapplyt'));
      return;
    }
    // 获取餐别和转调休的数据
    const { mealAndShiftData } = this.props;
    const { totleHours, mealHours, mealData, isCompTime } = mealAndShiftData();
    if (_.isEmpty(totleHours) || _.trim(totleHours) === '0.00') {
      showMessage(messageType.error, I18n.t('mobile.module.overtime.overtimeapplyl'));
      return;
    }
    // 获取加班初始化信息
    const { OTType, OTCode, DayTypeId } = this.getOverTimePreSetInfo;
    // 获取加班的规则
    const { ManualMealModeVisable } = this.getEmployeeOverTimeRule;
    // 获取加班的时数
    const { CompTimeVisible, IsCompTime } = this.getEmployeeActualOTHours;
    // 获取加班备注的数据
    const { textReasonDetailsData } = this.props;
    this.textReasonDetails = textReasonDetailsData();
    // 获取附件的数据
    const { attachmentData } = this.props;
    const { attViewBase64Arr } = attachmentData();
    // 提交参数
    const params = {};
    params.SessionId = global.loginResponseData.SessionId;
    params.OvertimeDate = selectDateTemp;
    params.OvertimeType = OTType;
    params.OvertimeCode = OTCode;
    params.StartTime = selectStartTemp;
    params.EndTime = selectEndTemp;
    params.TotalHours = totleHours;
    // 表单中的实际日期
    if (dayTypeId) {
      params.DayTypeId = dayTypeId;
    } else {
      params.DayTypeId = DayTypeId;
    }
    // 餐别信息
    if (!_.isEmpty(this.getEmployeeOverTimeRule) && ManualMealModeVisable) {
      // 判断输入餐别时间是否为空
      if (_.isEmpty(mealHours)) {
        showMessage(messageType.error, I18n.t('mobile.module.overtime.overtimeapplym'));
        return;
      }
      // 判断输入的信息不符合要求
      const regex = /^\d+(\.\d+)?$/;
      if (!mealHours.match(regex)) {
        showMessage(messageType.error, I18n.t('mobile.module.overtime.overtimeapplyinput'));
        return;
      }
      params.MealId = '';
      params.MealHours = mealHours;
    } else {
      if (mealData.length != 0) {
        params.MealId = `${mealData.join(',')},`;
      } else {
        params.MealId = '';
      }
      params.MealHours = 0;
    }
    // 装调休信息
    if (!_.isEmpty(this.getEmployeeActualOTHours) && CompTimeVisible) {
      // 判断是否转调休
      params.IsCompTime = (isCompTime) ? 1 : 0;
    } else {
      params.IsCompTime = IsCompTime;
    }
    // 判断原因是否需要
    let selectReasonTemp = _.isEmpty(selectReason) ? '' : selectReason;
    // 获取系统预设的员工加班原因
    if (!_.isEmpty(getEmployeeOverTimeReasonMap)) {
      if (!_.isEmpty(global.loginResponseData.SysParaInfo.IsNeedOTReason) && global.loginResponseData.SysParaInfo.IsNeedOTReason === 'Y') {
        selectReasonTemp = getEmployeeOverTimeReasonMap.get(selectReason).ReasonId;
        // 判断是否需要填写加班备注
        if (getEmployeeOverTimeReasonMap.get(selectReason).IsNeedRemark === 'Y') {
          if (_.isEmpty(this.textReasonDetails)) {
            showMessage(messageType.error, I18n.t('mobile.module.overtime.overtimeapplyd'));
            return;
          }
        }
      } else {
        selectReasonTemp = getEmployeeOverTimeReasonMap.get(selectReason).ReasonId;
      }
    }
    params.ReasonId = selectReasonTemp;
    params.Remark = (_.isEmpty(this.textReasonDetails)) ? '' : this.textReasonDetails;
    params.AttachmentList = _.isEmpty(attViewBase64Arr) ? '' : attViewBase64Arr;
    // 第一次提交表单
    params.Flag = 0;
    // 设置当再次提交表单的时候提交的参数
    this.submitParams = params;
    this.onSubmitInfo(params);
  }

  // 提交表单
  onSubmitInfo = (params) => {
    RNManager.showLoading('');
    POST(submitEmployeeOverTimeFormRequest(''), params, (responseData) => {
      RNManager.hideLoading();
      // 当申请的工时超过安全工时，弹出提示框
      if (responseData.state === 1) {
        const { open } = this.props;
        open(responseData.msg);
      } else {
        // 退出当前界面
        const { close } = this.props;
        close();
        // 发送通知信息
        DeviceEventEmitter.emit(event.REFRESH_CORNER_EVENT, true);
        // 提交成功,显示提交信息
        showMessage(messageType.success, I18n.t('mobile.module.overtime.overtimeapplys'));
      }
    }, (message) => {
      RNManager.hideLoading();
      showMessage(messageType.error, message);
    });
  }

  // 获取表单的数据
  onGetSubmitData() {
    this.submitParams.Flag = 1;
    return this.submitParams;
  }

  render() {
    const { buttonBg } = this.state;
    return (
      <SubmitButton customStyle={{ backgroundColor: buttonBg }} onPressBtn={() => this.onSubmit()} />
    );
  }
}