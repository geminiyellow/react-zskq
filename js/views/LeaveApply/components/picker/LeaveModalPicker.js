import React, { PureComponent } from 'react';
import Picker from '@/common/components/OptionPicker';
import I18n from 'react-native-i18n';


export default class LeaveModalPicker extends PureComponent {

  // 初始化
  constructor(...props) {
    super(...props);
    this.state = {
      leaveModalPickerData: this.props.leaveModalPickerData,
      isModalPickerShow: false,
      // type modal reason 选中值
      leaveModalSelectData: '',
    };
  }

  // 初始化modalpicker
  onInitModalPicker(isShow, dataSource) {
    this.setState({
      isModalPickerShow: isShow,
      leaveModalPickerData: dataSource,
    });
  }

  // 弹出模式
  onShowModalPicker() {
    if (!this.modalPicker) {
      return;
    }
    this.modalPicker.toggle();
  }

  onFreshLeaveModalSelectData(selectData) {
    this.setState({
      leaveModalSelectData: selectData,
    });
  }

  render() {
    if (this.state.isModalPickerShow) {
      return (
        <Picker
          ref={modalPicker => this.modalPicker = modalPicker}
          pickerTitle={I18n.t('mobile.module.leaveapply.leaveapplymodal')}
          pickerData={this.state.leaveModalPickerData}
          selectedValue={[this.state.leaveModalSelectData === '' ? this.state.leaveModalPickerData[0] : this.state.leaveModalSelectData]}
          onPickerDone={(pickedValue) => {
            const { onPickerDone } = this.props;
            onPickerDone(pickedValue);
          }} />
      );
    }
    return null;
  }
}