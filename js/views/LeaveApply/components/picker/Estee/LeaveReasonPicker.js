import React, { PureComponent } from 'react';
import I18n from 'react-native-i18n';
import Picker from '@/common/components/OptionPicker';

export default class LeaveReasonPicker extends PureComponent {

  constructor(...props) {
    super(...props);
    this.state = {
      isReasonPickerShow: this.props.isReasonPickerShow,
      leaveReasonPickerData: this.props.leaveReasonPickerData,
      selectedValue: '',
    };
  }

  // 显示picker加载数据源
  onInitLeaveReasonPickerData(isShow, dataSource) {
    this.setState({
      isReasonPickerShow: isShow,
      leaveReasonPickerData: dataSource,
    });
  }

  // 弹出picker
  onShowLeaveReasonPicker = () => {
    if (this.typePicker)
      this.typePicker.toggle();
  }

  onFreshSelectedValue(value) {
    this.setState({
      selectedValue: value,
    });
  }

  render() {
    if (this.state.isReasonPickerShow) {
      return (
        <Picker
          ref={picker => this.typePicker = picker}
          pickerData={this.state.leaveReasonPickerData}
          pickerTitle={I18n.t('mobile.module.leaveapply.leaveapplyreason')}
          selectedValue={[this.state.selectedValue == '' ? this.state.leaveReasonPickerData[0] : this.state.selectedValue]}
          onPickerDone={(pickedValue) => {
            const { onPickerDone } = this.props;
            onPickerDone(pickedValue);
          }} />
      );
    }
    return null;
  }
}