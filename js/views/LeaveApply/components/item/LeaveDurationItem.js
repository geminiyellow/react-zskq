import React, { PureComponent } from 'react';

import I18n from 'react-native-i18n';
import Baseitem from './BaseItem';

export default class LeaveDurationItem extends PureComponent {

  componentWillMount() {
    // 时长值
    this.leaveDurationDataTemp = 0;
    // 时长单位
    this.leaveDurationUnitTemp = 0;
  }

  componentDidMount() {
    // 加载时长默认值单位
    this.onRefreshLeaveDurationUnit(this.leaveDurationUnitTemp);
    this.onRefreshLeaveDurationData(this.leaveDurationDataTemp);
  }

  // 刷新时长数据
  onRefreshLeaveDurationData(leaveDurationData) {
    this.leaveDurationDataTemp = leaveDurationData;
    this.leaveApplyLastText.onRefreshLast(leaveDurationData);
  }

  // 刷新时长单位
  onRefreshLeaveDurationUnit(leaveDurationUnit) {
    // 时长单位转换
    // 1表示小时单位
    // 0表示天单位
    // 默认小时单位
    this.leaveDurationUnitTemp = leaveDurationUnit;
    switch (leaveDurationUnit) {
      case '1':
        this.leaveApplyLastText.onRefreshLastUnit('');
        this.leaveApplyLastText.onFreshTitle(I18n.t('mobile.module.leaveapply.leaveapplylasttitlebyh'));
        break;
      case '0':
        this.leaveApplyLastText.onRefreshLastUnit('');
        this.leaveApplyLastText.onFreshTitle(I18n.t('mobile.module.leaveapply.leaveapplylasttitlebyd'));
        break;
      default:
        this.leaveApplyLastText.onRefreshLastUnit('');
        this.leaveApplyLastText.onFreshTitle(I18n.t('mobile.module.leaveapply.leaveapplylasttitlebyh'));
        break;
    }
  }

  // 传出时长数据
  onExportDurationData() {
    const params = {};
    params.leaveDurationData = this.leaveDurationDataTemp;
    params.leaveDurationUnit = this.leaveDurationUnitTemp;
    return params;
  }

  onExportLeaveLast() {
    return this.leaveApplyLastText.onExportLeaveLast();
  }

  render() {
    return (
      <Baseitem
        leaveDurationTitile={I18n.t('mobile.module.leaveapply.leaveapplylast')}
        ref={text => this.leaveApplyLastText = text}
        typeItem={'7'} />
    );
  }
}