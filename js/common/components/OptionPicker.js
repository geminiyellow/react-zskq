import React from 'react';
import { Dimensions, View, requireNativeComponent, StyleSheet } from 'react-native';
import I18n from 'react-native-i18n';
import { device } from '../Util';

const Picker = device.isIos ? requireNativeComponent('WPOptionPickerView', OptionPicker) : requireNativeComponent('RNPickerView', OptionPicker);

export default class OptionPicker extends React.Component {

  static defaultProps = {
    component: 1,
    cancelButtonTitle: I18n.t('mobile.module.overtime.pickercancel'),
    doneButtonTitle: I18n.t('mobile.module.overtime.pickerconfirm'),
    title: [I18n.t('mobile.module.overtime.pickercancel'), '', I18n.t('mobile.module.overtime.pickerconfirm')],
  };

  constructor(props) {
    super(props);
    this.state = {
      showPicker: false,
    };
  }

  /** Callback */

  onPickerCancel() {
    this.setState({ showPicker: false });
    const { onPickerCancel } = this.props;
    if (onPickerCancel) {
      onPickerCancel();
    }
  }

  onPickerConfirm(data) {
    this.setState({ showPicker: false });
    const { onPickerDone } = this.props;
    if (onPickerDone) {
      onPickerDone(data);
    }
  }

  /** Event response */

  toggle() {
    this.setState({ showPicker: !this.state.showPicker });
  }

  /** Render */

  render() {
    const { showPicker } = this.state;
    if (!showPicker) return null;
    // 在android端显示的信息
    const { pickerData, dateData, selectedValue, component, pickerTitle, cancelButtonTitle, doneButtonTitle } = this.props;

    const optionData = {
      data: (component == 1) ? pickerData : dateData,
      options: selectedValue,
      type: component,
      title: [I18n.t('mobile.module.overtime.pickercancel'), pickerTitle, I18n.t('mobile.module.overtime.pickerconfirm')],
      showPicker,
    };

    return (
      <Picker
        option={optionData}
        style={styles.picker}
        pickerData={pickerData}
        dateData={dateData}
        value={selectedValue}
        component={component}
        cancelButtonTitle={I18n.t('mobile.module.overtime.pickercancel')}
        doneButtonTitle={I18n.t('mobile.module.overtime.pickerconfirm')}
        title={pickerTitle}
        onPickerCancel={() => this.onPickerCancel()}
        onPickerConfirm={(event) => this.onPickerConfirm(event.nativeEvent.data)}
      />
    );
  }
}

export const optionPickerType = {
  // eg: yyyy-MM-dd
  singleMode: 1,
  // eg: HH:mm:ss
  mutiMode: 2,
};

const styles = StyleSheet.create({
  picker: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});