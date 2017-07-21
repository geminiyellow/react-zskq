import React, { PureComponent } from 'react';
import I18n from 'react-native-i18n';
import Picker from '@/common/components/OptionPicker';

export default class LeaveTypePicker extends PureComponent {

  constructor(...props) {
    super(...props);
    this.state = {
      isTypePickerShow: this.props.isTypePickerShow,
      leaveTypePickerData: this.props.leaveTypePickerData,
      selectedValue: '',
    };
  }

  // 显示picker加载数据源
  onInitLeaveTypePickerData(isShow, dataSource) {
    this.setState({
      isTypePickerShow: isShow,
      leaveTypePickerData: dataSource,
    });
  }

  onFreshPickerSlectedData(value) {
    this.setState({
      selectedValue: value,
    });
  }

  // 弹出picker
  onShowLeaveTypePicker = () => {
    if (this.typePicker)
      this.typePicker.toggle();
  }

  render() {
    if (this.state.isTypePickerShow) {
      return (
        <Picker
          ref={picker => this.typePicker = picker}
          pickerData={this.state.leaveTypePickerData}
          pickerTitle={I18n.t('mobile.module.leaveapply.leaveapplytype')}
          selectedValue={[this.state.selectedValue === '' ? this.state.leaveTypePickerData[0] : this.state.selectedValue]}
          onPickerDone={(pickedValue) => {
            const { onPickerDone } = this.props;
            onPickerDone(pickedValue);
          }} />
      );
    }
    return null;
  }
}