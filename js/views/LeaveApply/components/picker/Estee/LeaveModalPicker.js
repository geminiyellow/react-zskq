import React, { PureComponent } from 'react';
import Picker from '@/common/components/OptionPicker';
import I18n from 'react-native-i18n';
import DataSources from './../../../utils/Estee/DataSources';

export default class LeaveModalPicker extends PureComponent {

  // 初始化
  constructor(...props) {
    super(...props);
    this.state = {
      isModalPickerShow: this.props.isModalPickerShow,
      leaveModalArr: DataSources.initLeaveModalArr(),
      leaveModalSelectValue: DataSources.initLeaveModalArr()[0],
    };
  }

  // 初始化modalpicker
  onInitModalPicker(isShow) {
    this.setState({
      isModalPickerShow: isShow,
    });
  }

  // 刷新数据源
  onFreshLeaveModalDataSources(isNXJ) {
    if (isNXJ) {
      this.setState({
        leaveModalArr: DataSources.initLeaveModalNXYArr(),
      });
      return;
    }
    this.setState({
      leaveModalArr: DataSources.initLeaveModalArr(),
    });
  }

  // 刷新请假选中的值
  onFreshLeaveModalSelectValue(selectValue) {
    this.setState({
      leaveModalSelectValue: selectValue,
    });
  }

  // 弹出模式
  onShowModalPicker() {
    if (this.modalPicker)
      this.modalPicker.toggle();
  }

  render() {
    if (this.state.isModalPickerShow) {
      return (
        <Picker
          ref={modalPicker => this.modalPicker = modalPicker}
          pickerTitle={I18n.t('mobile.module.leaveapply.leaveapplymodal')}
          pickerData={this.state.leaveModalArr}
          selectedValue={[this.state.leaveModalSelectValue]}
          onPickerDone={(pickedValue) => {
            const { onPickerDone } = this.props;
            onPickerDone(pickedValue);
          }} />
      );
    }
    return null;
  }
}