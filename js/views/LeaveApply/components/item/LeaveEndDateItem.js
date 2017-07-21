import React, { PureComponent } from 'react';

import I18n from 'react-native-i18n';
import BaseItem from './BaseItem';

export default class LeaveEndDateItem extends PureComponent {

  // 刷新开始日期
  onRefreshLeaveEndDateValue(isShow, leaveEndDate) {
    this.leaveEndDate.onRefreshEndDate(isShow, leaveEndDate);
  }

  // 获取结束日期
  onExportLeaveEndDateValue() {
    return this.leaveEndDate.onExportEndDateValue();
  }

  render() {
    return (
      <BaseItem
        ref={render => this.leaveEndDate = render}
        leftTextView={I18n.t('mobile.module.leaveapply.leaveapplyenddatetime')}
        rightTextView={''}
        typeItem={'3'}
        onPress={() => {
          const { onPress } = this.props;
          onPress();
        }} />
    );
  }
}