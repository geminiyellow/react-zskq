import { View } from 'react-native';
import React, { PureComponent } from 'react';

import Line from '@/common/components/Line';

import LeaveReason from './../../components/item/LeaveReasonItem';

export default class SectionReason extends PureComponent {

  // 请假原因数据处理
  onHandleLeaveReasonData(leaveReasonData) {
    this.leaveReasonPickerData = [];
    this.leaveReasonMap = new Map();
    if (!this.leaveReasonItem) {
      return;
    }
    for (let i = 0; i < leaveReasonData.length; i += 1) {
      this.leaveReasonPickerData.push(leaveReasonData[i].Reason);
      this.leaveReasonMap.set(leaveReasonData[i].Reason, leaveReasonData[i]);
    }
    // 请假原因赋值
    if (this.leaveReasonPickerData && this.leaveReasonPickerData.length > 0) {
      this.leaveReasonItem.onRefreshLeaveReason(this.leaveReasonPickerData[0]);
    }
  }

  // 刷新请假原因
  onRefreshLeaveReasonData(leaveReason) {
    if (!this.leaveReasonItem) {
      return;
    }
    this.leaveReasonItem.onRefreshLeaveReason(leaveReason);
  }

  // 导出请假原因数据
  onExportLeaveReasonData() {
    return this.leaveReasonPickerData;
  }

  // 导出请假原因数据map
  onExportLeaveReasonTo(leaveReason) {
    return this.leaveReasonMap.get(leaveReason);
  }

  render() {
    return (
      <View style={{ flexDirection: 'column' }}>
        <LeaveReason
          ref={item => this.leaveReasonItem = item}
          onPress={() => {
            const { leaveReasonClick } = this.props;
            leaveReasonClick();
          }} />
        <Line />
      </View>
    );
  }
}