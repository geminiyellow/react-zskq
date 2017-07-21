import React, { Component } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import moment from 'moment';

import { device } from '@/common/Util';
import ScrollView from '@/common/components/ScrollView';
import { messageType } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import NavBar from '@/common/components/NavBar';
import OptionCard from '@/common/components/OptionCard';
import SwitchCard from '@/common/components/SwitchCard';
import DatePicker, { datePickerType } from '@/common/components/DatePicker';
import TextArea from '@/common/components/TextArea';
import SubmitButton from '@/common/components/SubmitButton';
import { getYYYYMMDDFormat } from '@/common/Functions';

const arrWeek = ['mobile.consts.week.sunday', 'mobile.consts.week.monday', 'mobile.consts.week.tuesday', 'mobile.consts.week.wednesday', 'mobile.consts.week.thurday', 'mobile.consts.week.friday', 'mobile.consts.week.saturday'];
const KeyboardAvoiding = device.isIos ? View : KeyboardAvoidingView;

export default class AddContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue: `${moment().year()}-${moment().month() + 1}-${moment().date()}`,
      week: arrWeek[moment().day()],
      pickerType: datePickerType.dateMode,
      pickerTitle: '',
      switchFullDay: true,
      timeFull: `${moment().year()}-${moment().month() + 1}-${moment().date()}`,
      timeStart: `${`0${moment().hour()}`.substr(-2)}:${`0${moment().minute()}`.substr(-2)}`,
      timeEnd: `${`0${moment().hour()}`.substr(-2)}:${`0${moment().minute() + 1}`.substr(-2)}`,
      weekRepeat: false,
      reason: '',
      behavior: null,
    };
  }

  componentWillMount() {
    if (!device.isIos) {
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.setState({ behavior: 'height' }));
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this.setState({ behavior: null }));
    }
  }

  componentWillUnmount() {
    if (!device.isIos) {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }
  }

  onPickerConfirm(date) {
    switch (this.state.pickerTitle) {
      case 'timeFull':
        this.setState({
          timeFull: date,
        });
        break;

      case 'timeStart':
        this.setState({
          timeStart: date,
        });
        break;

      case 'timeEnd':
        this.setState({
          timeEnd: date,
        });
        break;

      default:
        break;
    }
  }

  onSaveMessage() {
    const arrStart = this.state.timeStart.split(':');
    const arrEnd = this.state.timeEnd.split(':');
    const timeVaild = ((parseInt(arrEnd[0]) * 60) + parseInt(arrEnd[1])) - ((parseInt(arrStart[0]) * 60) + parseInt(arrStart[1]));
    if (!this.state.switchFullDay) {
      if (timeVaild <= 0) {
        showMessage(messageType.error, I18n.t('mobile.module.unuseless.endtimemost'));
        return;
      }
    }
    if (this.state.reason.length == 0) {
      showMessage(messageType.error, I18n.t('mobile.module.unuseless.reasonneeded'));
      return;
    }

    const params = {};
    params.date = this.state.timeFull;
    params.timeStart = this.state.timeStart;
    params.timeEnd = this.state.timeEnd;
    params.weekRepeat = this.state.weekRepeat;
    this.props.navigator.pop();
    // console.log('params = - - - - - - - - - - - ', params);
  }

  onValueChanged() {
    this.setState({
      switchFullDay: !this.state.switchFullDay,
    });
  }

  showPicker(type, title, selectedValue) {
    this.setState({
      pickerType: type,
      pickerTitle: title,
      selectValue: selectedValue,
    });
    this.datePicker.show();
  }

  actionAddContent() {
  }

  renderTimeSelected() {
    return (
      <View>
        <OptionCard
          title={I18n.t('mobile.module.overtime.overtimeapplystarttime')}
          topLine={false}
          detailText={this.state.timeStart}
          onPress={() => this.showPicker(datePickerType.hourMinuteMode, 'timeStart', this.state.timeStart)} />

        <OptionCard
          title={I18n.t('mobile.module.overtime.overtimeapplyendtime')}
          bottomLine
          detailText={this.state.timeEnd}
          onPress={() => this.showPicker(datePickerType.hourMinuteMode, 'timeEnd', this.state.timeEnd)} />
      </View>
    );
  }

  render() {
    const { timeFull, week } = this.state;

    return (
      <View style={styles.container}>
        <NavBar
          title={I18n.t('mobile.module.unuseless.addsection')}
          onPressLeftButton={() => { Keyboard.dismiss(); this.props.navigator.pop(); }} />

        <KeyboardAvoiding behavior={this.state.behavior} style={{ flex: 1 }}>
          <ScrollView bounces={false} behavior={this.state.behavior} style={{ flex: 1 }}>
            <View>
              <OptionCard
                title={I18n.t('mobile.module.unuseless.date')}
                bottomLine
                detailText={`${getYYYYMMDDFormat(timeFull)} ${I18n.t(week)}`}
                style={{ marginTop: 10, marginBottom: 10 }}
                onPress={() => this.showPicker(datePickerType.dateMode, 'timeFull', this.state.timeFull)} />

              <SwitchCard
                title={I18n.t('mobile.module.verify.fullday')}
                bottomLine
                switchState={this.state.switchFullDay}
                onPress={() => this.onValueChanged()} />
              {!this.state.switchFullDay ? this.renderTimeSelected() : null}

              <View style={{ width: device.width, height: 10, backgroundColor: 'transparent' }} />
              <SwitchCard
                title={I18n.t('mobile.module.unuseless.everyweek')}
                bottomLine
                switchState={this.state.weekRepeat}
                onPress={() => {
                  this.setState({
                    weekRepeat: !this.state.weekRepeat,
                  });
                }} />

              <TextArea
                title={I18n.t('mobile.module.unuseless.reason')}
                multiline
                onChangeText={(text) => this.setState({ reason: text })}
                placeholder={I18n.t('mobile.module.unuseless.reasonforce')}
                placeholderTextColor={'#999'}
              />
            </View>
          </ScrollView>
        </KeyboardAvoiding>

        <SubmitButton title={I18n.t('mobile.module.unuseless.save')} onPressBtn={() => this.onSaveMessage()} />

        <DatePicker
          ref={picker => this.datePicker = picker}
          title={this.state.pickerTitle}
          selectedValue={this.state.selectValue}
          datePickerMode={this.state.pickerType}
          onPickerConfirm={(data) => this.onPickerConfirm(data)} />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
  },
});