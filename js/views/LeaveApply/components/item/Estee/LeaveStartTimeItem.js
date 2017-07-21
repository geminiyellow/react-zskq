import React, { PureComponent } from 'react';

import I18n from 'react-native-i18n';
import BaseItem from './../BaseItem';

export default class LeaveStartTimeItem extends PureComponent {

  // 刷新开始时间
  onRefreshStartTime(isShow, isStartTimeClickable, leaveSatrtTime) {
    this.leaveStartTime.onRefreshStartTime(isShow, isStartTimeClickable, leaveSatrtTime);
  }

  // 刷新右侧箭头显示
  onFreshStartTimeRightArrowShow(isShow) {
    this.leaveStartTime.onFreshStartTimeRightArrowShow(isShow);
  }

  onExportLeaveStartTime() {
    return this.leaveStartTime.onExportLeaveStartTime();
  }

  render() {
    return (
      <BaseItem
        ref={render => this.leaveStartTime = render}
        leftTextView={I18n.t('mobile.module.leaveapply.leaveapplystarttime')}
        typeItem={'4'}
        isLeaveApplyStartTimeShow={false}
        onPress={() => {
          const { leaveStartTimeClick } = this.props;
          leaveStartTimeClick();
        }} />
    );
  }
}