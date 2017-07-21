import React, { PureComponent } from 'react';
import Picker from '@/common/components/OptionPicker';
import I18n from 'react-native-i18n';

export default class LeaveReasonPicker extends PureComponent {

  // 初始化
  constructor(...props) {
    super(...props);
    this.state = {
      leaveReasonPickerData: this.props.leaveReasonPickerData,
      isReasonPickerShow: false,
      // type modal reason 选中值
      leaveReasonSelectData: '',
    };
  }

  // 初始化原因picker
  onInitReasonPicker(isShow, dataSource) {
    this.setState({
      isReasonPickerShow: isShow,
      leaveReasonPickerData: dataSource,
    });
  }

  // 弹出原因picker
  onShowReasonPicker() {
    this.reasonPicker.toggle();
  }

  onFreshLeaveReasonSelectData(selectData) {
    this.setState({
      leaveReasonSelectData: selectData,
    });
  }

  render() {
    if (this.state.isReasonPickerShow) {
      return (
        <Picker
          ref={reasonPicker => this.reasonPicker = reasonPicker}
          pickerTitle={I18n.t('mobile.module.leaveapply.leaveapplyreason')}
          pickerData={this.state.leaveReasonPickerData}
          selectedValue={[this.state.leaveReasonSelectData === '' ? this.state.leaveReasonPickerData[0] : this.state.leaveReasonSelectData]}
          onPickerDone={(pickedValue) => {
            const { onPickerDone } = this.props;
            onPickerDone(pickedValue);
          }} />
      );
    }
    return null;
  }
}