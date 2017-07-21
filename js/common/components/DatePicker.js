import React, { Component } from 'react';
import { Dimensions, requireNativeComponent, StyleSheet } from 'react-native';
import { getYear, getCurrentLanguage } from '@/common/Functions';
import I18n from 'react-native-i18n';
import { formatDate } from '@/common/DateHelper';
import { languages } from '@/common/LanguageSettingData';
const RNPickerView = requireNativeComponent('RNPickerView', Picker);
let currentLanguage = 1;

export default class Picker extends Component {
  static defaultProps = {
    minYear: getYear() - 1,
    maxYear: getYear() + 1,
  };

  static propTypes = {
    // 当选择 date picker `确定`按钮时调用时调用该 function.
    onPickerConfirm: React.PropTypes.func.isRequired,

    // 最小年份
    minYear: React.PropTypes.number,

    // 最大年份
    maxYear: React.PropTypes.number,

    // 设置默认选中日期时间
    selectedValue: React.PropTypes.string.isRequired,

    // `dateMode`: 1 eg: yyyy-MM-dd
    // `timeMode`: 2 eg: HH:mm:ss
    // `dateTimeMode`: 3 eg: yyyy-MM-dd HH:mm:ss
    // `yearMonthMode`: 4 eg: yyyy-MM
    // `monthDayMode`: 5 eg: MM-dd
    // `hourMinuteMode`: 6 eg: HH:mm
    // `DateHourMinuteMode`: 7 eg: yyyy-MM-dd HH:mm
    datePickerMode: React.PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      showPicker: false,
    };
  }

  /** Life Cycle */
  componentWillMount() {
    // 获取当前的语言信息
    getCurrentLanguage().then(data => {
      currentLanguage = languages.indexOf(data) + 1;
    });
  }

  /** Callback */
  onPickerConfirm(data) {
    this.hide();
    const { onPickerConfirm } = this.props;
    if (onPickerConfirm) onPickerConfirm(data);
  }

  onPickerCancel(data) {
    this.hide();
    const { onPickerCancel } = this.props;
    if (onPickerCancel) onPickerCancel();
  }

  /** Event Response */
  show() {
    this.setState({ showPicker: true });
  }

  hide() {
    this.setState({ showPicker: false });
  }

  /** Render View */
  render() {
    const { showPicker } = this.state;
    if (!showPicker) return null;
    const { datePickerMode, title, selectedValue, minYear, maxYear } = this.props;
    const dataTime = {
      minYear,
      maxYear,
      datePickerMode,
      defaultTime: selectedValue,
      title: [I18n.t('mobile.module.overtime.pickercancel'), title, I18n.t('mobile.module.overtime.pickerconfirm')],
      unit: [
        I18n.t('mobile.module.overtime.datepickeryear'),
        I18n.t('mobile.module.overtime.datepickermonth'),
        I18n.t('mobile.module.overtime.datepickerday'),
        I18n.t('mobile.module.overtime.datepickerhour'),
        I18n.t('mobile.module.overtime.datepickerminute'),
      ],
      weeks: [
        I18n.t('mobile.consts.week.sunday'),
        I18n.t('mobile.consts.week.monday'),
        I18n.t('mobile.consts.week.tuesday'),
        I18n.t('mobile.consts.week.wednesday'),
        I18n.t('mobile.consts.week.thurday'),
        I18n.t('mobile.consts.week.friday'),
        I18n.t('mobile.consts.week.saturday'),
      ],
      languageType: currentLanguage,
      showPicker,
    };
    const defaultDateTime = formatDate(selectedValue);
    return (
      <RNPickerView
        style={styles.picker}
        minYear={minYear}
        maxYear={maxYear}
        datePickerMode={datePickerMode}
        defaultTime={defaultDateTime}
        title={title}
        languageType={currentLanguage}
        config={dataTime}
        onPickerConfirm={event => this.onPickerConfirm(event.nativeEvent.data)}
        onPickerCancel={event => this.onPickerCancel(event.nativeEvent.data)}
      />
    );
  }
}

export const datePickerType = {
  // eg: yyyy-MM-dd
  dateMode: 1,
  // eg: HH:mm:ss
  timeMode: 2,
  // eg: yyyy-MM-dd HH:mm:ss
  dateTimeMode: 3,
  // eg: yyyy-MM
  yearMonthMode: 4,
  // eg: MM-dd
  monthDayMode: 5,
  // eg: HH:mm
  hourMinuteMode: 6,
  // eg: yyyy-MM-dd HH:mm
  dateHourMinuteMode: 7,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  picker: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
