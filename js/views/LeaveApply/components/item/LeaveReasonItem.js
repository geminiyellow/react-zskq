import React, { PureComponent } from 'react';

import I18n from 'react-native-i18n';
import BaseItem from './BaseItem';

export default class LeaveReasonItem extends PureComponent {

  // 刷新请假原因
  onRefreshLeaveReason(leaveReason) {
    this.leaveReasonItem.onRefreash(leaveReason);
  }

  render() {
    return (
      <BaseItem
        ref={text => this.leaveReasonItem = text}
        typeItem={'6'}
        leftTextView={I18n.t('mobile.module.leaveapply.leaveapplyreason')}
        onPress={() => {
          const { onPress } = this.props;
          onPress();
        }} />
    );
  }
}