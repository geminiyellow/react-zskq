import React, { PureComponent } from 'react';

import I18n from 'react-native-i18n';
import _ from 'lodash';
import SwitchCard from '@/common/components/SwitchCard';

let isFixedPeriodTemp = 0;


export default class LeaveFlexedTimeItem extends PureComponent {

  constructor(...props) {
    super(...props);
    isFixedPeriodTemp = 0;
    // state控制
    this.state = {
      isShow: this.props.isShow,
      isPicked: false,
      title: '',
      leftMargin: 0,
    };
  }

  componentDidMount() {
    if (_.isEmpty(global.loginResponseData) || _.isUndefined(global.loginResponseData)) {
      return;
    }
    if (!global.loginResponseData.BackGroundVersion) {
      return;
    }
    if (global.loginResponseData.BackGroundVersion.indexOf('Y') == -1) {
      this.setState({
        isShow: false,
        title: I18n.t('mobile.module.leaveapply.leaveapplyflextime'),
      });
    } else {
      this.setState({
        isShow: true,
        title: I18n.t('mobile.module.leaveapply.leaveapplyisrepeat'),
      });
    }

  }

  // 固定时段显示与隐藏
  onShowFlexTimeItem(isFlexTimeShow) {
    if (this.state.isShow && !isFlexTimeShow) {
      this.onShiftFlexTimeBg(1);
    }
    this.setState({
      isShow: isFlexTimeShow,
    });
  }

  // button图片切换
  onShiftFlexTimeBg(isFixedPeriod) {
    // 固定时段图片背景切换
    // 0 未选中状态背景
    // 1 选中状态背景
    // 默认未选中
    switch (isFixedPeriod) {
      case 0:
        isFixedPeriodTemp = 1;
        this.setState({
          isPicked: true,
        });
        break;
      case 1:
        isFixedPeriodTemp = 0;
        this.setState({
          isPicked: false,
        });
        break;
      default:
        break;
    }
  }

  // 传出固定时段状态
  onExportFlexTimeStatus() {
    return isFixedPeriodTemp;
  }

  // 根据迭代与不迭代区分显示 
  onUpdateTitle() {
    const version = global.loginResponseData.BackGroundVersion;
    if (version.indexOf('Y') != -1) {
      // 迭代版本
      this.setState({
        title: I18n.t('mobile.module.leaveapply.leaveapplyisrepeat'),
      });
    } else {
      this.setState({
        title: I18n.t('mobile.module.leaveapply.leaveapplyflextime'),
      });
    }
  }

  onUpdateLeftMargin(margin) {
    this.setState({
      leftMargin: margin,
    });
  }

  onExportRepeatShow() {
    return this.state.isShow;
  }

  render() {
    if (this.state.isShow) {
      return (
        <SwitchCard
          title={this.state.title}
          switchState={this.state.isPicked}
          topLine={false}
          bottomLine
          bottomLineStyle={{ marginLeft: this.state.leftMargin }}
          onPress={() => {
            const { onPress } = this.props;
            onPress();
          }} />
      );
    }
    return null;
  }
}