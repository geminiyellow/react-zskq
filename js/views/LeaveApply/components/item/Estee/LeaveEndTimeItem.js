import React, { PureComponent } from 'react';

import I18n from 'react-native-i18n';
import BaseItem from './../BaseItem';

export default class LeaveEndTimeItem extends PureComponent {

  // 刷新结束时间
  onRefreshEndTime(isShow, isEndTimeClickable, leaveEndTime) {
    this.leaveEndTime.onRefreshEndTime(isShow, isEndTimeClickable, leaveEndTime);
  }

  // 刷新右侧箭头显示
  onFreshEndTimeRightArrowShow(isShow) {
    this.leaveEndTime.onFreshEndTimeRightArrowShow(isShow);
  }

  onExportLeaveEndTime() {
    return this.leaveEndTime.onExportLeaveEndTime();
  }

  render() {
    return (
      <BaseItem
        ref={render => this.leaveEndTime = render}
        leftTextView={I18n.t('mobile.module.leaveapply.leaveapplyendtime')}
        isLeaveApplyEndTimeShow={false}
        typeItem={'5'}
        onPress={() => {
          const { leaveEndTimeClick } = this.props;
          leaveEndTimeClick();
        }} />
    );
  }
}