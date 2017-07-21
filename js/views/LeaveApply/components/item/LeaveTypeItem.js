import {
  DeviceEventEmitter,
} from 'react-native';
import React, { PureComponent } from 'react';

import I18n from 'react-native-i18n';
import { event } from '@/common/Util';
import { ABORT } from '@/common/Request';
import _ from 'lodash';
import BaseItem from './BaseItem';
import LeaveUtil from './../../utils/LeaveUtil';

export default class LeaveType extends PureComponent {

  // 组件渲染完成 加载默认值
  componentDidMount() {
    // 默认请假类型显示
    this.leaveTypeText.onRefreash(I18n.t('mobile.module.leaveapply.leaveapplytypedefault'));
    // 请求服务器获取假别数据
    this.onFetchLeaveTypeDataByServer();
    // 请假类型消息监听事件
    this.listeners = [
      // 请假类别
      DeviceEventEmitter.addListener(event.REFRESH_LEAVE_TYPE_REQ_DATA, (eventBody) => {
        if (!_.isEmpty(eventBody)) {
          this.onInitLeaveApplyTypeData(eventBody);
        }
      }),
    ];
  }

  componentWillUnmount() {
    this.listeners && this.listeners.forEach(listener => listener.remove());
    ABORT('getCreadits');
  }

  onFetchLeaveTypeDataByServer = () => {
    LeaveUtil.onFetchLeaveTypeDataByServer();
  }

  // 将数据填充到请假类型中
  onInitLeaveApplyTypeData = (responseData) => {
    this.leaveTypePickerData = [];
    this.leaveTypeMap = new Map();
    this.leaveTypePickerData = responseData.map(item => {
      this.leaveTypeMap.set(item.LeaveType, item);
      return item.LeaveType;
    });
    // 发出通知，请求已经处理完毕
    DeviceEventEmitter.emit(event.REFRESH_LEAVE_TYPE_DATA, this.leaveTypePickerData);
  }

  // 刷新请假类型数据显示
  onRefreshLeaveTypeData(leaveType) {
    this.leaveTypeText.onRefreash(leaveType);
  }

  // 传出leaveTypePickerData
  onExportLeaveTypePickerData() {
    return this.leaveTypePickerData;
  }

  // 传出leaveTypeMap
  onExportleaveTypeMap() {
    return this.leaveTypeMap;
  }

  // 清空数据
  onClearData() {
    this.leaveTypePickerData = [];
    this.leaveTypeMap = new Map();
  }

  render() {
    return (
      <BaseItem
        ref={text => this.leaveTypeText = text}
        typeItem={'1'}
        leftTextView={I18n.t('mobile.module.leaveapply.leaveapplytype')}
        isShowTopLine
        isShowBottomLine
        onPress={() => {
          const { onPress } = this.props;
          onPress();
        }} />
    );
  }
}