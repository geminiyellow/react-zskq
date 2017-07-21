import React, { PureComponent } from 'react';
import BaseItem from './BaseItem';

export default class LeaveStartDateiTEM extends PureComponent {

  // 刷新开始日期
  onRefreshLeaveStartDateValue(leaveSatrtDate) {
    this.leaveStartDate.onRefreshStartDate(leaveSatrtDate);
  }

  onFreshStartDateRightArrowShow(isShow, clickable) {
    this.leaveStartDate.onFreshStartDateRightArrowShow(isShow, clickable);
  }

  // 获取开始日期显示的值
  onExportLeaveStartDateValue() {
    return this.leaveStartDate.onExportStartDateValue();
  }

  render() {
    return (
      <BaseItem
        ref={render => this.leaveStartDate = render}
        typeItem={'2'}
        onPress={() => {
          const { onPress } = this.props;
          onPress();
        }} />
    );
  }
}