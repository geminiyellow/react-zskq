import React, { PureComponent } from 'react';

import I18n from 'react-native-i18n';
import BaseItem from './BaseItem';

export default class LeaveEndTimeItem extends PureComponent {

  // 刷新结束时间
  onRefreshEndTime(isShow, clickable, leaveEndTime) {
    this.leaveEndTime.onRefreshEndTime(isShow, clickable, leaveEndTime);
  }

  onFreshEndTimeRightArrowShow(isShow) {
    this.leaveEndTime.onFreshEndTimeRightArrowShow(isShow);
  }

  render() {
    return (
      <BaseItem
        ref={text => this.leaveEndTime = text}
        leftTextView={I18n.t('mobile.module.leaveapply.leaveapplyendtime')}
        typeItem={'5'} />
    );
  }
}