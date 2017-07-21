import React, { PureComponent } from 'react';
import {
  InteractionManager,
  ListView,
  NativeModules,
  KeyboardAvoidingView,
  Keyboard,
  Text,
  View
} from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import ModalBox from 'react-native-modalbox';
import moment from 'moment';
import NavBar from '@/common/components/NavBar';
import ScrollView from '@/common/components/ScrollView';
import { device } from '@/common/Util';
import TouchableHighlight from '@/common/components/CustomTouchableHighlight';
import Image from '@/common/components/CustomImage';
import Line from '@/common/components/Line';
import OptionCard from '@/common/components/OptionCard';
import SwitchCard from '@/common/components/SwitchCard';
import TextArea from '@/common/components/TextArea';
import SubmitButton from '@/common/components/SubmitButton';
import DatePicker, { datePickerType } from '@/common/components/DatePicker';
import RevokeLeaveListModal from '@/views/RevokeLeave/components/RevokeLeaveListModal';
import { GET, POST, ABORT } from '@/common/Request';
import { submitLeaveDeclineForm, getEmployeeLeaveDeclineHours } from '@/common/api';
import { sessionId } from '@/common/Consts';
import { messageType } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import { getYYYYMMDDhhmmFormat } from '@/common/Functions';

const KeyboardAvoiding = device.isIos ? View : KeyboardAvoidingView;

const imageLeft = 'revoke_list';
const imageRightUp = 'revoke_arrow_up';
const imageRightDown = 'revoke_arrow_down';
const { RNManager } = NativeModules;

export default class RevokeLeave extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imageRight: imageRightDown,
      textColor: '#000000',
      timeStart: '',
      timeEnd: '',
      switchValue: false,
      showSwitchCard: false,
      hours: 0,
      remark: '',
      behavior: null,

      pickerType: datePickerType.dateHourMinuteMode,
      pickerTitle: '',
      selectValue: '',
    };
    this.timeInitial = `${moment().year()}-${moment().month() + 1}-${moment().date()} 00:00`;
    this.isBacking = false;
  }

  componentDidMount() {
    this.mounted = true;
    if (!device.isIos) {
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.setState({ behavior: 'height' }));
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this.setState({ behavior: null }));
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    this.isBacking = false;
    if (!device.isIos) {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }
    ABORT('abortsubmitLeaveDeclineForm');
    ABORT('abortGetEmployeeLeaveDeclineHours');
  }

  checkSwitchCardAviliable(dateStart, dateEnd) {
    const time = (dateEnd.date() - dateStart.date()) * 24 + (dateEnd.hour() - dateStart.hour()) + (dateEnd.minute() - dateStart.minute()) / 24;
    if (time > 24) {
      this.setState({
        showSwitchCard: true,
      });
    } else {
      this.setState({
        showSwitchCard: false,
      });
    }
  }

  getDouble(number) {
    return `0${number}`.slice(-2);
  }

  getLatestHours() {
    const { timeStart, timeEnd, switchValue } = this.state;
    if (timeStart.length == 0 || timeEnd.length == 0) { return; }
    const dateStart = moment(timeStart, 'YYYY-MM-DD HH:mm');
    const dateEnd = moment(timeEnd, 'YYYY-MM-DD HH:mm');
    this.checkSwitchCardAviliable(dateStart, dateEnd);
    const params = {};
    params.beginDate = `${dateStart.year()}-${this.getDouble(dateStart.month() + 1)}-${this.getDouble(dateStart.date())}`;
    params.endDate = `${dateEnd.year()}-${this.getDouble(dateEnd.month() + 1)}-${this.getDouble(dateEnd.date())}`;
    params.beginTime = `${this.getDouble(dateStart.hour())}:${this.getDouble(dateStart.minutes())}`;
    params.endTime = `${this.getDouble(dateEnd.hour())}:${this.getDouble(dateEnd.minutes())}`;
    params.isCheckFixedTime = switchValue ? 1 : 0;;
    GET(getEmployeeLeaveDeclineHours(params), (responseData) => {
      if (!this.mounted) {
        return;
      }
      this.setState({
        hours: responseData.hours,
      });
    }, (err) => {
      showMessage(messageType.error, err);
    }, 'abortGetEmployeeLeaveDeclineHours');
  }

  onChildrenPress = () => {
    this.onPressSelect();
    const selectLeave = this.listModalBox.getSelectLeave();
    const arrS = selectLeave.STIME.split(':');
    const arrE = selectLeave.ETIME.split(':');
    const number = (parseInt(arrS[0]) - parseInt(arrE[0])) * 60 + parseInt(arrS[1]) - parseInt(arrE[1]);
    this.setState({
      timeStart: `${selectLeave.TIMECARDDATE} ${selectLeave.STIME}`,
      timeEnd: number > 0 ? `${selectLeave.ENDDTM}` : `${selectLeave.TIMECARDDATE} ${selectLeave.ETIME}`,
    });
    InteractionManager.runAfterInteractions(() => {
      this.getLatestHours();
    });
  }

  onChildrenPressBackground = () => {
    if (!this.listModalBox.isOpen()) {
      this.setState({
        textColor: '#000000',
        imageRight: imageRightDown,
      });
    }
  }

  onPressSelect = () => {
    if (!this.listModalBox.isOpen()) {
      this.listModalBox.open();
      this.setState({
        textColor: '#14BE4B',
        imageRight: imageRightUp,
      });
    } else {
      this.listModalBox.close();
      this.setState({
        textColor: '#000000',
        imageRight: imageRightDown,
      });
    }
  }

  onPickerConfirm = (date) => {
    switch (this.state.pickerTitle) {
      case '开始时间':
        this.setState({
          timeStart: date,
        });
        break;

      case '结束时间':
        this.setState({
          timeEnd: date,
        });
        break;

      default:
        break;
    }
    InteractionManager.runAfterInteractions(() => {
      this.getLatestHours();
    });
  }

  onSubmitRevokeLeave = () => {
    // 提交销假申请(开始请求接口)
    if (this.isBacking) { return; }
    const { timeStart, timeEnd, hours, remark, switchValue } = this.state;
    if (timeStart.length == 0) {
      showMessage(messageType.error, I18n.t('mobile.module.revoke.starttimeempty'));
      return;
    } else if (timeEnd.length == 0) {
      showMessage(messageType.error, I18n.t('mobile.module.revoke.endtimeempty'));
      return;
    } else if (remark.length == 0) {
      showMessage(messageType.error, I18n.t('mobile.module.overtime.overtimeapplyd'));
      return;
    }

    const dateStart = moment(timeStart, 'YYYY-MM-DD HH:mm');
    const dateEnd = moment(timeEnd, 'YYYY-MM-DD HH:mm');
    const timeAll = dateEnd.hours() + 24 - dateStart.hours() + (dateEnd.minutes() + 60 - dateStart.minutes()) / 60;
    if ((!dateStart.isBefore(dateEnd) && !dateStart.isSame(dateEnd)) || timeAll < 0) {
      showMessage(messageType.error, I18n.t('mobile.module.revoke.starttimelow'));
      return;
    } else if (hours == 0) {
      showMessage(messageType.error, I18n.t('mobile.module.revoke.hourscannotempty'));
      return;
    }
    const params = {};
    params.sessionId = sessionId;
    params.startDate = `${dateStart.year()}-${this.getDouble(dateStart.month() + 1)}-${this.getDouble(dateStart.date())}`;
    params.endDate = `${dateEnd.year()}-${this.getDouble(dateEnd.month() + 1)}-${this.getDouble(dateEnd.date())}`;
    params.startTime = `${this.getDouble(dateStart.hour())}:${this.getDouble(dateStart.minutes())}`;
    params.endTime = `${this.getDouble(dateEnd.hour())}:${this.getDouble(dateEnd.minutes())}`;
    params.hours = hours;
    params.remark = remark;
    params.isCheckFixedTime = switchValue ? 1 : 0;
    this.isBacking = true;
    POST(submitLeaveDeclineForm(), params, (responseData) => {
      if (!this.mounted) {
        return;
      }
      this.props.navigator.pop();
      showMessage(messageType.success, I18n.t('mobile.module.revoke.waitfor'));
    }, (err) => {
      this.isBacking = false;
      showMessage(messageType.error, err);
    }, 'abortsubmitLeaveDeclineForm');
  }

  onValueChanged = () => {
    this.setState({
      switchValue: !this.state.switchValue,
    });
    InteractionManager.runAfterInteractions(() => {
      this.getLatestHours();
    });
  }

  showPicker(type, title, selectedValue) {
    this.setState({
      pickerType: type,
      pickerTitle: title,
      selectValue: selectedValue ? selectedValue : this.timeInitial,
    });
    this.datePicker.show();
  }

  render() {
    const { textColor, imageRight, timeStart, timeEnd, hours, switchValue, showSwitchCard } = this.state;

    return (
      <View style={styles.container}>
        <NavBar
          title={I18n.t('mobile.module.revoke.title')}
          onPressLeftButton={() => {Keyboard.dismiss();this.props.navigator.pop()}} />
        <View style={styles.categorySelectView}>
          <View style={{ flexGrow: 1 }} />
          <Image style={styles.imageLeft} source={{ uri: imageLeft }} />
          <TouchableHighlight style={styles.textSelectView} onPress={this.onPressSelect}>
            <Text style={[styles.textSelect, { color: textColor }]} numberOfLines={1}>{I18n.t('mobile.module.revoke.choseleave')}</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.onPressSelect} style={{ width: 13, height: 9, alignSelf: 'center', marginLeft: 6 }}>
            <View style={{ width: 13, height: 9 }}>
              <Image style={styles.imageRight} source={{ uri: imageRight }} />
            </View>
          </TouchableHighlight>

          <View style={{ flexGrow: 1 }} />
        </View>
        <Line />
        <KeyboardAvoiding behavior={this.state.behavior} style={{ flex: 1 }}>

          <ScrollView bounces={false} behavior={this.state.behavior} >
            <Text style={styles.textAlert}>{I18n.t('mobile.module.revoke.chosetime')}</Text>
            <OptionCard
              title={I18n.t('mobile.module.onbusiness.startdatetitle')}
              detailText={timeStart ? getYYYYMMDDhhmmFormat(timeStart) : timeStart}
              onPress={() => this.showPicker(datePickerType.dateHourMinuteMode, '开始时间', this.state.timeStart)} />
            <OptionCard
              title={I18n.t('mobile.module.onbusiness.enddatetitle')}
              detailText={timeEnd ? getYYYYMMDDhhmmFormat(timeEnd) : timeEnd}
              topLineStyle={{ marginLeft: 18 }}
              onPress={() => this.showPicker(datePickerType.dateHourMinuteMode, '结束时间', this.state.timeEnd)} />
            {showSwitchCard ? 
            <SwitchCard
              title={I18n.t('mobile.module.leaveapply.leaveapplyflextime')}
              bottomLine
              switchState={switchValue}
              topLineStyle={{ marginLeft: 18 }}
              onPress={this.onValueChanged} /> : null }
            <OptionCard
              title={I18n.t('mobile.module.revoke.revoketime')}
              detailText={`${hours}`}
              style={{ marginTop: 10 }}
              rightImage=""
              disabled
              bottomLine />

            <TextArea
              title={I18n.t('mobile.module.overtime.detailstitle')}
              multiline
              onChangeText={(text) => this.setState({ remark: text })}
              placeholder={I18n.t('mobile.module.overtime.overtimeapplyreasondetail')}
              placeholderTextColor={'#999'} />
          </ScrollView>
        </KeyboardAvoiding>

        <SubmitButton title={I18n.t('mobile.module.clock.fieldinputsubtitle')} onPressBtn={this.onSubmitRevokeLeave} />
        <DatePicker
          ref={picker => this.datePicker = picker}
          title={this.state.pickerTitle}
          selectedValue={this.state.selectValue}
          datePickerMode={this.state.pickerType}
          onPickerConfirm={this.onPickerConfirm} />
        <RevokeLeaveListModal
          ref={listModal => this.listModalBox = listModal}
          onChildrenPress={this.onChildrenPress}
          onChildrenPressBackground={this.onChildrenPressBackground} />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
  },
  categorySelectView: {
    width: device.width,
    height: 60,
    backgroundColor: '$color.white',
    flexDirection: 'row',
  },
  textSelectView: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  textSelect: {
    alignSelf: 'center',
    fontSize: 18,
    width: 150,
  },
  imageLeft: {
    width: 25,
    height: 25,
    alignSelf: 'center',
    marginRight: 8,
  },
  imageRight: {
    width: 13,
    height: 9,
    alignSelf: 'center',
  },
  textAlert: {
    marginTop: 17,
    marginLeft: 18,
    marginBottom: 6,
    fontSize: 14,
  },
  modalView: {
    height: 200,
    width: 200,
    backgroundColor: '#317498',
  },
});