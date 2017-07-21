import React, { PureComponent } from 'react';
import Picker from '@/common/components/OptionPicker';
import { View } from 'react-native';
import I18n from 'react-native-i18n';


export default class LeaveTypePicker extends PureComponent {

  // 初始化
  constructor(...props) {
    super(...props);
    this.state = {
      leaveTypePickerData: this.props.leaveTypePickerData,
      isTypePickerShow: false,
      // type modal reason 选中值
      leaveTypeSelectData: '',
    };
  }

  // 初始化typepicker
  onInitTypePicker(isShow, dataSource) {
    this.setState({
      isTypePickerShow: isShow,
      leaveTypePickerData: dataSource,
    });
  }

  // 弹出类型
  onShowTypePicker() {
    if (!this.optionPicker) {
      return;
    }
    this.optionPicker.toggle();
  }

  onFreshLeaveTypeSelectData(selectData) {
    this.setState({
      leaveTypeSelectData: selectData,
    });
  }

  render() {
    if (this.state.isTypePickerShow) {
      return (
        <Picker
          ref={ref => {
            this.optionPicker = ref;
          }}
          pickerTitle={I18n.t('mobile.module.leaveapply.leaveapplytype')}
          pickerData={this.state.leaveTypePickerData}
          selectedValue={[this.state.leaveTypeSelectData === '' ? this.state.leaveTypePickerData[0] : this.state.leaveTypeSelectData]}
          onPickerDone={(pickedValue) => {
            const { onPickerDone } = this.props;
            onPickerDone(pickedValue);
          }} />
      );
    }
    return null;
  }
}