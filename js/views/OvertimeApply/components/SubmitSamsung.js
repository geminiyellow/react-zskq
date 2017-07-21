/**
 * 加班申请提交表单界面
 */

import { DeviceEventEmitter, NativeModules } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import I18n from 'react-native-i18n';
import { event } from '@/common/Util';
import { POST } from '@/common/Request';
import { messageType } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import { getCurrentLanguage } from '@/common/Functions';
import SubmitButton from '@/common/components/SubmitButton';
import { submitEmployeeOverTimeFormRequest } from '@/common/api';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';

const { RNManager } = NativeModules;
// 导入公司代码的数据
const customizedCompanyHelper = new CustomizedCompanyHelper();

export default class SubmitSamsung extends PureComponent {

  constructor(...props) {
    super(...props);
    // 判断当前的语言环境
    getCurrentLanguage().then(data => {
      this.language = data;
    });
    // 获取表单的信息
    this.textReasonDetails = {};
    this.getOvertimePresetInfo = '';
  }

  onSetData(getOvertimePresetInfo) {
    this.getOvertimePresetInfo = getOvertimePresetInfo;
  }

  // 检查表单的数据
  onSubmit = () => {
    // 获取picker的数据
    const {
      selectDateTemp,
      selectStartTemp,
      selectEndTemp,
      totalHoursTemp,
    } = this.props.pickerTime();
    if (
      _.isEmpty(selectEndTemp) ||
      selectEndTemp === I18n.t('mobile.module.overtime.overtimeapplypicker')
    ) {
      showMessage(messageType.error, I18n.t('mobile.module.overtime.overtimeapplyt'));
      return;
    }
    // 获取加班时数
    if (_.isEmpty(totalHoursTemp) || _.trim(totalHoursTemp) === '0.00') {
      showMessage(messageType.error, I18n.t('mobile.module.overtime.overtimeapplyl'));
      return;
    }
    const {
      selectReason,
      getEmployeeOverTimeReasonMap,
    } = this.props.pickerOption();
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
    params.OvertimeType = this.getOvertimePresetInfo.OTType;
    params.OvertimeCode = '';
    params.StartTime = selectStartTemp;
    params.EndTime = selectEndTemp;
    params.TotalHours = totalHoursTemp;
    // 表单中的实际日期
    params.DayTypeId = '';
    // 餐别信息
    params.MealId = '';
    params.MealHours = '';
    // 装调休信息
    params.IsCompTime = '0';
    // 判断原因是否需要
    let selectReasonTemp = _.isEmpty(selectReason) ? '' : selectReason;
    // 获取系统预设的员工加班原因
    if (!_.isEmpty(getEmployeeOverTimeReasonMap)) {
      if (
        !_.isEmpty(global.loginResponseData.SysParaInfo.IsNeedOTReason) &&
        global.loginResponseData.SysParaInfo.IsNeedOTReason === 'Y'
      ) {
        selectReasonTemp = getEmployeeOverTimeReasonMap.get(
          selectReason,
        ).ReasonId;
        // 判断是否需要填写加班备注
        if (
          getEmployeeOverTimeReasonMap.get(selectReason).IsNeedRemark === 'Y'
        ) {
          if (_.isEmpty(this.textReasonDetails)) {
            showMessage(messageType.error, I18n.t('mobile.module.overtime.overtimeapplyd'));
            return;
          }
        }
      } else {
        selectReasonTemp = getEmployeeOverTimeReasonMap.get(
          selectReason,
        ).ReasonId;
      }
    }
    params.ReasonId = selectReasonTemp;
    params.Remark = _.isEmpty(this.textReasonDetails)
      ? ''
      : this.textReasonDetails;
    params.AttachmentList = _.isEmpty(attViewBase64Arr) ? '' : attViewBase64Arr;
    // 第一次提交表单
    params.Flag = 0;
    // 设置当再次提交表单的时候提交的参数
    this.onSubmitInfo(params);
  };

  // 提交表单
  onSubmitInfo = params => {
    RNManager.showLoading('');
    POST(
      submitEmployeeOverTimeFormRequest(customizedCompanyHelper.getPrefix()),
      params,
      responseData => {
        RNManager.hideLoading();
        // 退出当前界面
        const { close } = this.props;
        close();
        // 发送通知信息
        DeviceEventEmitter.emit(event.REFRESH_CORNER_EVENT, true);
        // 提交成功,显示提交信息
        showMessage(messageType.success, I18n.t('mobile.module.overtime.overtimeapplys'));
      },
      message => {
        RNManager.hideLoading();
        showMessage(messageType.error, message);
      },
    );
  };

  render() {
    return (
      <SubmitButton onPressBtn={() => this.onSubmit()} />
    );
  }
}
