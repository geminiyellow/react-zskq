import React, { PureComponent } from 'react';

import I18n from 'react-native-i18n';
import _ from 'lodash';

import BaseItem from '@/views/LeaveApply/components/item/BaseItem';

export default class LeaveModalItem extends PureComponent {

  constructor(props) {
    super(props);
    // state控制
    this.state = {
      isShow: this.props.isShow,
    };
  }

  // 组件渲染完成 加载默认值
  componentWillMount() {
    this.leaveModalPickerData = '';
    this.isFlexTimeShow = false;
    this.leaveModalId = 1;
    this.leaveModalItemValue = '';
    this.isLeaveModalItemShow = false;
  }

  componentDidUpdate() {
    const reFreshValue = this.props.reFreshValue;
    reFreshValue();
  }

  // item显示控制
  onLeaveModalShow(isLeaveModalShow) {
    this.setState({
      isShow: isLeaveModalShow,
    });
  }

  // 刷新请假模式显示的值
  onRefreshLeaveModalName = (leaveModalName) => {
    if (!this.leaveModalItem) {
      return;
    }
    this.leaveModalItem.onRefreshModal(leaveModalName);
  }

  // 根据请假类别初始化请假模式数据源
  onInitLeaveModalDataSource(leaveTypeTo) {
    this.leaveModalPickerData = [];
    // 全天模式
    if (leaveTypeTo.FullDayAvailable === 'Y') {
      this.leaveModalPickerData.push(I18n.t('mobile.module.leaveapply.leaveapplymodalfullday'));
    }
    // 上半天模式
    if (leaveTypeTo.FirstHalfAvailable === 'Y') {
      this.leaveModalPickerData.push(I18n.t('mobile.module.leaveapply.leaveapplymodalfirsthalf'));
    }
    // 下班天模式
    if (leaveTypeTo.SecondHalfAvailable === 'Y') {
      this.leaveModalPickerData.push(I18n.t('mobile.module.leaveapply.leaveapplymodalsecndhalf'));
    }
    // 弹性时间模式
    if (leaveTypeTo.FlexibleTimeAvailable === 'Y') {
      this.leaveModalPickerData.push(I18n.t('mobile.module.leaveapply.leaveapplymodalflextime'));
    }
    // 多天模式

    // 根据模式sources初始化请假模式picker
    if (_.isEmpty(this.leaveModalPickerData)) {
      this.onHandleLeaveModalSourceNull();
    } else if (this.leaveModalPickerData.length == 1) {
      this.onHandleLeaveModalSource();
    } else {
      this.onHandleLeaveModalSources();
    }
  }

  // 处理请假模式数据源为空
  onHandleLeaveModalSourceNull() {
    // 显示固定时段
    this.isFlexTimeShow = true;
    // 请假模式名称
    this.leaveModalItemValue = I18n.t('mobile.module.leaveapply.leaveapplymodalflextime');
    // 请假模式id
    this.leaveModalId = 4;
    // 不显示请假模式
    this.isLeaveModalItemShow = false;
  }

  // 处理请假模式数据源只有一个值
  onHandleLeaveModalSource() {
    // 根据模式初始化请假模式显示
    // 显示固定时段
    this.isFlexTimeShow = false;
    // 不显示请假模式
    this.isLeaveModalItemShow = true;
    switch (this.leaveModalPickerData[0]) {
      case I18n.t('mobile.module.leaveapply.leaveapplymodalfullday'):
        // 请假模式名称
        this.leaveModalItemValue = I18n.t('mobile.module.leaveapply.leaveapplymodalfullday');
        // 请假模式id
        this.leaveModalId = 1;
        break;
      case I18n.t('mobile.module.leaveapply.leaveapplymodalfirsthalf'):
        // 请假模式名称
        this.leaveModalItemValue = I18n.t('mobile.module.leaveapply.leaveapplymodalfirsthalf');
        // 请假模式id
        this.leaveModalId = 2;
        break;
      case I18n.t('mobile.module.leaveapply.leaveapplymodalsecndhalf'):
        // 请假模式名称
        this.leaveModalItemValue = I18n.t('mobile.module.leaveapply.leaveapplymodalsecndhalf');
        // 请假模式id
        this.leaveModalId = 3;
        break;
      case I18n.t('mobile.module.leaveapply.leaveapplymodalflextime'):
        // 显示固定时段
        this.isFlexTimeShow = true;
        // 请假模式名称
        this.leaveModalItemValue = I18n.t('mobile.module.leaveapply.leaveapplymodalflextime');
        // 请假模式id
        this.leaveModalId = 4;
        // 不显示请假模式
        this.isLeaveModalItemShow = false;
        break;
      case I18n.t('mobile.module.leaveapply.leaveapplymodaldt'):
        // 请假模式名称
        this.leaveModalItemValue = I18n.t('mobile.module.leaveapply.leaveapplymodaldt');
        // 请假模式id
        this.leaveModalId = 5;
        break;
      default:
        break;
    }
  }

  // 处理请假模式数据源有多个值
  onHandleLeaveModalSources() {
    // 根据模式初始化请假模式显示
    // 显示固定时段
    this.isFlexTimeShow = false;
    // 是否显示请假模式
    this.isLeaveModalItemShow = true;
    switch (this.leaveModalPickerData[0]) {
      case I18n.t('mobile.module.leaveapply.leaveapplymodalfullday'):
        // 请假模式名称
        this.leaveModalItemValue = I18n.t('mobile.module.leaveapply.leaveapplymodalfullday');
        // 请假模式id
        this.leaveModalId = 1;
        break;
      case I18n.t('mobile.module.leaveapply.leaveapplymodalfirsthalf'):
        // 请假模式名称
        this.leaveModalItemValue = I18n.t('mobile.module.leaveapply.leaveapplymodalfirsthalf');
        // 请假模式id
        this.leaveModalId = 2;
        break;
      case I18n.t('mobile.module.leaveapply.leaveapplymodalsecndhalf'):
        // 请假模式名称
        this.leaveModalItemValue = I18n.t('mobile.module.leaveapply.leaveapplymodalsecndhalf');
        // 请假模式id
        this.leaveModalId = 3;
        break;
      case I18n.t('mobile.module.leaveapply.leaveapplymodalflextime'):
        // 显示固定时段
        this.isFlexTimeShow = true;
        // 请假模式名称
        this.leaveModalItemValue = I18n.t('mobile.module.leaveapply.leaveapplymodalflextime');
        // 请假模式id
        this.leaveModalId = 4;
        break;
      case I18n.t('mobile.module.leaveapply.leaveapplymodaldt'):
        // 显示固定时段
        this.isFlexTimeShow = true;
        // 请假模式名称
        this.leaveModalItemValue = I18n.t('mobile.module.leaveapply.leaveapplymodaldt');
        // 请假模式id
        this.leaveModalId = 5;
        break;
      default:
        break;
    }
  }

  // 根据请假名称刷新请假固定时段 时间模块
  onRefreshFlexTimeShow(leaveModalName) {
    switch (leaveModalName) {
      case I18n.t('mobile.module.leaveapply.leaveapplymodalfullday'):
        // 请假模式名称
        this.leaveModalItemValue = I18n.t('mobile.module.leaveapply.leaveapplymodalfullday');
        // 请假模式id
        this.leaveModalId = 1;
        // 显示固定时段
        this.isFlexTimeShow = false;
        break;
      case I18n.t('mobile.module.leaveapply.leaveapplymodalfirsthalf'):
        // 请假模式名称
        this.leaveModalItemValue = I18n.t('mobile.module.leaveapply.leaveapplymodalfirsthalf');
        // 请假模式id
        this.leaveModalId = 2;
        // 显示固定时段
        this.isFlexTimeShow = false;
        break;
      case I18n.t('mobile.module.leaveapply.leaveapplymodalsecndhalf'):
        // 请假模式名称
        this.leaveModalItemValue = I18n.t('mobile.module.leaveapply.leaveapplymodalsecndhalf');
        // 请假模式id
        this.leaveModalId = 3;
        // 显示固定时段
        this.isFlexTimeShow = false;
        break;
      case I18n.t('mobile.module.leaveapply.leaveapplymodalflextime'):
        // 显示固定时段
        this.isFlexTimeShow = true;
        // 请假模式名称
        this.leaveModalItemValue = I18n.t('mobile.module.leaveapply.leaveapplymodalflextime');
        // 请假模式id
        this.leaveModalId = 4;
        break;
      case I18n.t('mobile.module.leaveapply.leaveapplymodaldt'):
        // 显示固定时段
        this.isFlexTimeShow = true;
        // 请假模式名称
        this.leaveModalItemValue = I18n.t('mobile.module.leaveapply.leaveapplymodaldt');
        // 请假模式id
        this.leaveModalId = 5;
        break;
      default:
        break;
    }
  }

  // 根据请假模式名称 返回请假模式id
  onExportLeaveModalIdByName(leaveModalName) {
    switch (leaveModalName) {
      case I18n.t('mobile.module.leaveapply.leaveapplymodalfullday'):
        this.leaveModalId = 1;
        break;
      case I18n.t('mobile.module.leaveapply.leaveapplymodalfirsthalf'):
        this.leaveModalId = 2;
        break;
      case I18n.t('mobile.module.leaveapply.leaveapplymodalsecndhalf'):
        this.leaveModalId = 3;
        break;
      case I18n.t('mobile.module.leaveapply.leaveapplymodalflextime'):
        this.leaveModalId = 4;
        break;
      case I18n.t('mobile.module.leaveapply.leaveapplymodaldt'):
        this.leaveModalId = 5;
        break;
      default:
        break;
    }
    return this.leaveModalId;
  }

  // 传出请假类型选择后请假模式id
  onExportLeaveModalId() {
    return this.leaveModalId;
  }

  // 传出请假模式名称
  onExportLeaveModalName() {
    return this.leaveModalItemValue;
  }

  // 传出请假模式item显示控制
  onExportLeaveModalShow() {
    return this.isLeaveModalItemShow;
  }

  // 传出固定时段显示控制
  onExportFlexTimeStatus() {
    return this.isFlexTimeShow;
  }

  // 传出请假模式数据源
  onExportLeaveModalData() {
    return this.leaveModalPickerData;
  }

  render() {
    if (this.state.isShow) {
      return (
        <BaseItem
          ref={text => { this.leaveModalItem = text; }}
          typeItem={'8'}
          leftTextView={I18n.t('mobile.module.leaveapply.leaveapplymodal')}
          onPress={() => {
            const { onPress } = this.props;
            onPress();
          }} />
      );
    }
    return null;
  }
}