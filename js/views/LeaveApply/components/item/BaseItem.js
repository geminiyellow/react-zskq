import { View } from 'react-native';
import React, { PureComponent } from 'react';

import I18n from 'react-native-i18n';
import OptionCard from '@/common/components/OptionCard';

export default class Render extends PureComponent {

  // 初始化
  constructor(props) {
    super(props);
    this.state = {
      // item 左侧文子
      leftTextView: this.props.leftTextView,
      // item 右侧文字
      rightTextView: this.props.rightTextView,
      // item 类型
      typeItem: this.props.typeItem,
      // 刷新请假模式
      leaveModalItem: this.props.leaveModalItem,
      // 时长
      leaveLast: this.props.leaveLast,
      // 单位
      leaveLastUnit: this.props.leaveLastUnit,
      // 页面组件显示状态
      // 结束日期
      isLeaveApplyEndDateShow: this.props.isLeaveApplyEndDateShow,
      // 开始时间
      isLeaveApplyStartTimeShow: false,
      // 结束时间
      isLeaveApplyEndTimeShow: this.props.isLeaveApplyEndTimeShow,
      // 开始日期
      startDate: this.props.startDate,
      // 结束日期
      endDate: this.props.endDate,
      isShowTopLine: this.props.isShowTopLine,
      isShowBottomLine: this.props.isShowBottomLine,
      isStartDateClickable: false,
      isStartTimeClickable: false,
      isEndTimeClickable: true,
      isLeaveDurationClickable: true,
      isShowRightArrow: false,
      isShowStartDateRightArrow: true,
      isShowEndTimeRightArrow: false,
      isShowStartTimeRightArrow: true,
      leaveDurationTitile: this.props.leaveDurationTitile,
      leaveModalMarginTop: 10,
    };
  }

  // 加载申请的表单Item
  onLoadingItem() {
    switch (this.state.typeItem) {
      case '1':
        // 右侧有文子 有箭头图片
        return (
          <View style={{ marginTop: 10 }}>
            <OptionCard
              title={this.state.leftTextView}
              detailText={this.state.rightTextView}
              topLine={this.state.isShowTopLine}
              bottomLine={this.state.isShowBottomLine}
              onPress={() => {
                const { onPress } = this.props;
                onPress();
              }} />
          </View>
        );
      case '2':
        return (
          // 显示开始日期模块
          <View style={{ marginTop: 10 }}>
            <OptionCard
              title={I18n.t('mobile.module.leaveapply.leaveapplystartdatetime')}
              detailText={this.state.startDate}
              topLine
              bottomLine
              disabled={this.state.isStartDateClickable}
              rightImage={this.state.isShowStartDateRightArrow}
              bottomLineStyle={{ marginLeft: 20 }}
              onPress={() => {
                const { onPress } = this.props;
                onPress();
              }} />
          </View>
        );
      case '3':
        if (this.state.isLeaveApplyEndDateShow) {
          return (
            // 显示结束日期模块
            <OptionCard
              title={I18n.t('mobile.module.leaveapply.leaveapplyenddatetime')}
              detailText={this.state.endDate}
              topLine={false}
              bottomLine
              bottomLineStyle={{ marginLeft: 20 }}
              onPress={() => {
                const { onPress } = this.props;
                onPress();
              }} />
          );
        }
        break;
      case '4':
        // 显示开始时间
        if (this.state.isLeaveApplyStartTimeShow) {
          console.log('this.state.isStartTimeClickable',this.state.isStartTimeClickable);
          return (
            <OptionCard
              title={this.state.leftTextView}
              detailText={this.state.startTime}
              topLine={false}
              bottomLine
              rightImage={this.state.isShowStartTimeRightArrow}
              disabled={this.state.isStartTimeClickable}
              bottomLineStyle={{ marginLeft: 20 }}
              onPress={() => {
                const { onPress } = this.props;
                onPress();
              }} />
          );
        }
        break;
      case '5':
        // 显示结束时间
        if (this.state.isLeaveApplyEndTimeShow) {
          return (
            <OptionCard
              title={this.state.leftTextView}
              detailText={this.state.endTime}
              topLine={false}
              bottomLine
              rightImage={this.state.isShowEndTimeRightArrow}
              disabled={this.state.isEndTimeClickable}
              bottomLineStyle={{ marginLeft: 20 }}
              onPress={() => {
                const { onPress } = this.props;
                onPress();
              }} />
          );
        }
        break;
      case '6':
        // 请假原因
        return (
          <View style={{ marginTop: 10 }}>
            <OptionCard
              title={this.state.leftTextView}
              detailText={this.state.rightTextView}
              topLine
              bottomLine={false}
              onPress={() => {
                const { onPress } = this.props;
                onPress();
              }} />
          </View>
        );
      case '7':
        // 时长
        return (
          <OptionCard
            title={this.state.leaveDurationTitile}
            detailText={`${this.state.leaveLast} ${this.state.leaveLastUnit}`}
            topLine={false}
            bottomLine
            rightImage={this.state.isShowRightArrow}
            disabled={this.state.isLeaveDurationClickable}
            onPress={() => {
              const { onPress } = this.props;
              onPress();
            }} />
        );
      case '8':
        // 右侧有文子 有箭头图片
        return (
          <View style={{ marginTop: 10 }}>
            <OptionCard
              title={this.state.leftTextView}
              detailText={this.state.leaveModalItem}
              topLine
              bottomLine
              onPress={() => {
                const { onPress } = this.props;
                onPress();
              }} />
          </View>
        );
      case '9':
        // 显示请假假别描述 item
        return (
          <View style={{ marginTop: this.state.leaveModalMarginTop }}>
            <OptionCard
              title={this.state.leftTextView}
              detailText={this.state.leaveModalItem}
              topLine
              bottomLine
              onPress={() => {
                const { onPress } = this.props;
                onPress();
              }} />
          </View>
        );
      default:
        break;
    }
    return null;
  }

  // 刷新顶部间距 雅诗兰黛显示假别说明需求
  onRefreshMarginTop(top) {
    this.setState({
      leaveModalMarginTop: top,
    });
  }

  // 获取text input显示的值
  onExportStartDateValue() {
    return this.state.startDate;
  }

  // 获取text input显示的值
  onExportEndDateValue() {
    return this.state.endDate;
  }

  onExportLeaveStartTime() {
    return this.state.startTime;
  }

  onExportLeaveEndTime() {
    return this.state.endTime;
  }

  onExportLeaveLast() {
    return this.state.leaveLast;
  }

  onFreshTitle(title) {
    this.setState({
      leaveDurationTitile: title,
    });
  }

  // 刷新文本信息
  onRefreash(str) {
    this.setState({
      rightTextView: str,
    });
  }

  // 刷新开始日期
  onRefreshStartDate(startDateStr) {
    this.setState({
      startDate: startDateStr,
    });
  }

  onFreshStartDateRightArrowShow(isShow, clickable) {
    this.setState({
      isShowStartDateRightArrow: isShow,
      isStartDateClickable: clickable,
    });
  }

  // 刷新请假结束日期
  onRefreshEndDate(isShow, endDateStr) {
    this.setState({
      isLeaveApplyEndDateShow: isShow,
      endDate: endDateStr,
    });
  }

  onFreshEndTimeRightArrowShow(isShow) {
    this.setState({
      isShowEndTimeRightArrow: isShow,
    });
  }

  // 刷新开始时间
  onRefreshStartTime(isShow, clickable, startTimeStr) {
    this.setState({
      isLeaveApplyStartTimeShow: isShow,
      isStartTimeClickable: clickable,
      startTime: startTimeStr,
    });
  }

  onFreshStartTimeRightArrowShow(isShow) {
    this.setState({
      isShowStartTimeRightArrow: isShow,
    });
  }

  // 刷新结束时间
  onRefreshEndTime(isShow, clickable, endTimeStr) {
    this.setState({
      isLeaveApplyEndTimeShow: isShow,
      isEndTimeClickable: clickable,
      endTime: endTimeStr,
    });
  }

  // 刷新请假模式
  onRefreshModal(modal) {
    this.setState({
      leaveModalItem: modal,
    });
  }

  // 导出请假模式
  onExportLeaveModal() {
    return this.state.leaveModalItem;
  }

  // 刷新请假时长
  onRefreshLast(last) {
    this.setState({
      leaveLast: last,
    });
  }

  // 刷新请假时长单位
  onRefreshLastUnit(lastUnit) {
    this.setState({
      leaveLastUnit: lastUnit,
    });
  }

  // 刷新请假时长点击
  onRefreshLeaveDurationClick(clickable) {
    this.setState({
      isLeaveDurationClickable: clickable,
    });
  }

  // 刷新右侧箭头
  onFreshRightArrowShow(isShow) {
    this.setState({
      isShowRightArrow: isShow,
    });
  }

  render() {
    return (
      <View>
        {this.onLoadingItem()}
      </View>
    );
  }
}