import React, { PureComponent } from 'react';
import Picker from '@/common/components/OptionPicker';
import I18n from 'react-native-i18n';
import { leaveModalHourArr } from './../../../utils/Estee/DataSources';

export default class LeaveDurationPicker extends PureComponent {

  constructor(...props) {
    super(...props);
    // 从个人信息中获取 附件 是否可以上传
    this.state = {
      pickedValue: 0.5,
    };
  }

  // 弹出模式
  onShowDurationPicker() {
    if (this.modalPicker)
      this.modalPicker.toggle();
  }

  onFreshVlaue(selectedVlaue) {
    this.setState({
      pickedValue: selectedVlaue,
    });
  }

  render() {
    return (
      <Picker
        ref={modalPicker => this.modalPicker = modalPicker}
        pickerData={leaveModalHourArr}
        pickerTitle={I18n.t('mobile.module.leaveapply.leaveapplylasttitlebyh')}
        selectedValue={[`${this.state.pickedValue}`]}
        onPickerDone={(pickedValue) => {
          const { onPickerDone } = this.props;
          onPickerDone(pickedValue);
        }} />
    );
  }
}