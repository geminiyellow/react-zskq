import React, { PureComponent } from 'react';

import I18n from 'react-native-i18n';
import BaseItem from './../BaseItem';

// 请假模式id
let leaveModalId = 1;

export default class LeaveModalItem extends PureComponent {

  // 刷新模式显示的值
  onRefreshModalValue(modalValue) {
    leaveModalId = this.onExportLeaveModalIdByName(modalValue);
    this.leaveModalItem.onRefreshModal(modalValue);
  }

  // 根据请假模式返回请假模式id
  onExportLeaveModalIdByName(leaveModalName) {
    switch (leaveModalName) {
      case I18n.t('mobile.module.leaveapply.leaveapplymodalfullday'):
        leaveModalId = 1;
        break;
      case I18n.t('mobile.module.leaveapply.leaveapplymodalfirsthalfestee'):
        leaveModalId = 2;
        break;
      case I18n.t('mobile.module.leaveapply.leaveapplymodalsecndhalfestee'):
        leaveModalId = 3;
        break;
      case I18n.t('mobile.module.leaveapply.leaveapplymodaldelayworkestee'):
        leaveModalId = 4;
        break;
      case I18n.t('mobile.module.leaveapply.leaveapplymodalearlyworkestee'):
        leaveModalId = 5;
        break;
      case I18n.t('mobile.module.leaveapply.leaveapplymodalflextime'):
        leaveModalId = 6;
        break;
      default:
        break;
    }
    return leaveModalId;
  }

  onExportLeaveModalId() {
    return leaveModalId;
  }

  onExportLeaveModal() {
    return this.leaveModalItem.onExportLeaveModal();
  }

  // 刷新顶部间距 雅诗兰黛显示假别说明需求
  onRefreshMarginTop(top) {
    this.leaveModalItem.onRefreshMarginTop(top);
  }

  render() {
    return (
      <BaseItem
        ref={text => this.leaveModalItem = text}
        typeItem={'9'}
        leftTextView={I18n.t('mobile.module.leaveapply.leaveapplymodal')}
        onPress={() => {
          const { onPress } = this.props;
          onPress();
        }} />
    );
  }
}