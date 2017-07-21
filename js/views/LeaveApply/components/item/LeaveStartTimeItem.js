import React, { PureComponent } from 'react';

import I18n from 'react-native-i18n';
import BaseItem from './BaseItem';

export default class LeaveStartTimeItem extends PureComponent {

  // 刷新开始时间
  onRefreshStartTime(isShow, clickable, leaveSatrtTime) {
    this.leaveStartTime.onRefreshStartTime(isShow, clickable, leaveSatrtTime);
  }

  onFreshStartTimeRightArrowShow(isShow) {
    this.leaveStartTime.onFreshStartTimeRightArrowShow(isShow);
  }

  render() {
    return (
      <BaseItem
        ref={render => this.leaveStartTime = render}
        leftTextView={I18n.t('mobile.module.leaveapply.leaveapplystarttime')}
        typeItem={'4'} />
    );
  }
}