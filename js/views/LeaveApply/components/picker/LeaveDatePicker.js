import React, { PureComponent } from 'react';

import DatePicker, { datePickerType } from '@/common/components/DatePicker';
import I18n from 'react-native-i18n';

export default class LeaveDatePicker extends PureComponent {

  constructor(...props) {
    super(...props);
    this.state = {
      datePickerMode: datePickerType.dateMode,
      selectValue: this.props.selectValue,
      datePickerTitle: this.props.datePickerTitle,
    };
  }

  // 设置pickermode
  onInitPickerMode(pickerMode) {
    switch (pickerMode) {
      case 1:
        // 日期
        this.setState({
          datePickerMode: datePickerType.dateMode,
        });
        break;
      case 2:
        //  时间日期
        this.setState({
          datePickerMode: datePickerType.dateHourMinuteMode,
        });
        break;
      case 3:
      case 4:
        //  时间
        this.setState({
          datePickerMode: datePickerType.hourMinuteMode,
        });
        break;
      default: break;
    }
  }

  // 显示picker
  onShowPicker(onShowDateValue) {
    this.setState({
      selectValue: onShowDateValue,
    });
    this.pickerDate.show();
  }

  // 刷新picker显示的title
  onRefreshTtitle(dateType) {
    switch (dateType) {
      case 0:
        // 刷新显示title
        this.setState({
          datePickerTitle: I18n.t('mobile.module.leaveapply.leaveapplystartdatetime'),
        });
        break;
      case 1:
        // 刷新显示title
        this.setState({
          datePickerTitle: I18n.t('mobile.module.leaveapply.leaveapplyenddatetime'),
        });
        break;
      case 3:
        // 开始时间点击
        // 刷新显示title
        this.setState({
          datePickerTitle: I18n.t('mobile.module.leaveapply.leaveapplystarttime'),
        });
        break;
      case 4:
        // 结束时间点击
        // 刷新显示title
        this.setState({
          datePickerTitle: I18n.t('mobile.module.leaveapply.leaveapplyendtime'),
        });
        break;
      default: break;
    }
  }

  render() {
    return (
      <DatePicker
        ref={ref => { this.pickerDate = ref; }}
        datePickerMode={this.state.datePickerMode}
        title={this.state.datePickerTitle}
        selectedValue={this.state.selectValue}
        onPickerConfirm={(pickedValue) => {
          const { onPickerValue } = this.props;
          onPickerValue(pickedValue);
        }} />
    );
  }
}