import React, { PureComponent } from 'react';
import Picker from '@/common/components/OptionPicker';
import { View } from 'react-native';
import I18n from 'react-native-i18n';


export default class PickerWheel extends PureComponent {

  // 初始化
  constructor(...props) {
    super(...props);
    this.state = {
      itemType: this.props.itemType,
      leaveTypePickerData: this.props.leaveTypePickerData,
      leaveModalPickerData: this.props.leaveModalPickerData,
      leaveReasonPickerData: this.props.leaveReasonPickerData,
      isTypePickerShow: this.props.isTypePickerShow,
      isModalPickerShow: this.props.isModalPickerShow,
      isReasonPickerShow: this.props.isReasonPickerShow,
      // type modal reason 选中值
      leaveTypeSelectData: '',
      leaveModalSelectData: '',
      leaveReasonSelectData: '',
    };
  }

  onLoadingItem() {
    switch (this.state.itemType) {
      case '4':
        if (this.state.isTypePickerShow) {
          return (
            <Picker
              ref={typePicker => this.typePicker = typePicker}
              pickerTitle={I18n.t('mobile.module.leaveapply.leaveapplytype')}
              pickerData={this.state.leaveTypePickerData}
              selectedValue={[this.state.leaveTypeSelectData === '' ? this.state.leaveTypePickerData[0] : this.state.leaveTypeSelectData]}
              onPickerDone={(pickedValue) => {
                const { onPickerDone } = this.props;
                onPickerDone(pickedValue);
                this.setState({
                  isModalPickerShow: this.props.isModalPickerShow,
                });
              }} />
          );
        }
        break;
      case '5':
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
        break;
      case '6':
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
        break;
      default:
        return null;
    }
  }

  // 初始化
  onInitPicker(type) {
    this.setState({
      itemType: type,
    });
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
    this.typePicker.toggle();
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
    this.modalPicker.toggle();
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

  onFreshLeaveTypeSelectData(selectData) {
    this.setState({
      leaveTypeSelectData: selectData,
    });
  }

  onFreshLeaveModalSelectData(selectData) {
    this.setState({
      leaveModalSelectData: selectData,
    });
  }

  onFreshLeaveReasonSelectData(selectData) {
    this.setState({
      leaveReasonSelectData: selectData,
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