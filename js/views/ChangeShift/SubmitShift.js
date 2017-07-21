/**
 * 选择换班，提交换班
 */

import { DeviceEventEmitter, InteractionManager, KeyboardAvoidingView, Keyboard, TouchableOpacity, View, NativeModules } from 'react-native';
import React, { PureComponent } from 'react';
import Text from '@/common/components/TextField';
import SubmitButton from '@/common/components/SubmitButton';
import { getCurrentLanguage } from '@/common/Functions';
import TextArea from '@/common/components/TextArea';
import { messageType } from '@/common/Consts';

import UmengAnalysis from '@/common/components/UmengAnalysis';
import ScrollView from '@/common/components/ScrollView';
import _ from 'lodash';
import { device } from '@/common/Util';
import NavBar from '@/common/components/NavBar';
import { languages } from '@/common/LanguageSettingData';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import Image from '@/common/components/CustomImage';
import { GET, POST, ABORT } from '../../common/Request';
import Constance from './../Schedule/Constance';
import EmployeeShiftList from './EmployeeShiftList';
import { GetValidChangeShift, SubmitShiftFormRequest } from './../../common/api';
import { showMessage } from '../../common/Message';
import MyFormHelper from '../MyForms/MyFormHelper';
import { getHHmmFormat } from '@/common/Functions';

const myFormHelper = new MyFormHelper();

const { RNManager } = NativeModules;

const rightarr = 'forward';
const KeyboardAvoiding = device.isIos ? View : KeyboardAvoidingView;
let selectMyShiftListener = null;

let Addvice = null;

const styles = EStyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '$color.containerBackground',
  },
  arrimgStyle: {
    width: 22,
    height: 22,
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  circleStyle: {
    flexDirection: 'column',
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#1fd662',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleStyleOrange: {
    flexDirection: 'column',
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#ffc817',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemBottomStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 48,
    width: device.width,
    justifyContent: 'flex-end',
  },
  monthTextStyle: {
    fontSize: 15,
    color: '#999999',
    marginLeft: 18,
    marginTop: 10,
    marginBottom: 10,
  },
  rowStyle: {
    backgroundColor: 'white',
    height: 65,
    flexDirection: 'row',
    padding: 18,
    paddingLeft: 18,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
  rowTextStyle: {
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 11,
  },
  columnImg: {
    width: device.width,
    height: 220,
    marginVertical: 10,
  },
  // 多行文本框统一加下这个样式
  multilineInput: {
    '@media ios': {
      paddingVertical: 5,
    },
    flexGrow: 1,
    paddingLeft: 0,
    height: 130,
    marginTop: 8,
    color: '#cccccc',
    textAlignVertical: 'top',
    fontSize: 14,
  },
});

let otherShift = '';

export default class SubmitShift extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      behavior: null,
      language: 0,
      myShift: null,
      update: true,
      showavaliable: true,
      behavior: null,
    };
    getCurrentLanguage().then(data => {
      const k = languages.indexOf(data);
      if (k == 0) {
        this.setState({
          language: 0,
        });
      } else {
        this.setState({
          language: 1,
        });
      }
    });
  }

  componentWillMount() {
    UmengAnalysis.onPageBegin('Submitshift');
    otherShift = this.props.passProps.data;
    this.getDefaultShift();
    Addvice = null;

    selectMyShiftListener = DeviceEventEmitter.addListener('selectMyShift', value => {
      this.setState({
        myShift: value,
      });
    });
  }

  componentDidMount() {
    if (!device.isIos) {
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.setState({ behavior: 'height' }));
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this.setState({ behavior: null }));
    }
  }

  componentWillUnmount() {
    UmengAnalysis.onPageEnd('Submitshift');
    if (!device.isIos) {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }
    selectMyShiftListener.remove();
    ABORT('getDefaultShift');
  }

  onSubmit = () => {
    if (_.isEmpty(this.state.myShift)) {
      showMessage(messageType.error, I18n.t('mobile.module.changeshift.noshift'));
      return;
    }
    if (_.isEmpty(Addvice)) {
      showMessage(messageType.error, I18n.t('mobile.module.changeshift.reasonhint'));
      return;
    }
    InteractionManager.runAfterInteractions(() => {
      const params = {};
      params.sessionId = global.loginResponseData.SessionId;
      params.myShiftDate = this.state.myShift.ShiftDate;
      params.otherShiftID = otherShift.ID;
      params.reason = Addvice;
      POST(SubmitShiftFormRequest(), params, (responseData) => {
        RNManager.hideLoading();
        showMessage(messageType.success, I18n.t('mobile.module.changeshift.subsuccess'));
        DeviceEventEmitter.emit('refreshShiftList', true);
        this.props.navigator.pop();
      }, (err) => {
        RNManager.hideLoading();
        showMessage(messageType.error, err);
      });
      RNManager.showLoading('');
    });
  }

  getDefaultShift = () => {
    const params = {};
    params.OtherShiftID = otherShift.ID;
    GET(GetValidChangeShift(params), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        RNManager.hideLoading();
        // 返回数据为空
        if (!_.isEmpty(responseData)) {
          this.setState({
            myShift: responseData[0],
          });
        }
      });
    }, (err) => {
      showMessage(messageType.error, err);
      RNManager.hideLoading();
    }, 'getDefaultShift');
    RNManager.showLoading('');
  }

  otherShiftView() {
    const date = _.split(otherShift.ShiftDate, '-');
    let circlebg = styles.circleStyle;
    const startData = getHHmmFormat(otherShift.TimeFrom);
    const endData = getHHmmFormat(otherShift.TimeTo);
    if (otherShift.ShiftType == Constance.ShiftType_HOLIDAY || otherShift.ShiftType == Constance.ShiftType_FESTIVAL) {
      circlebg = styles.circleStyleOrange;
    }
    let durationView = null;
    durationView = (<Text style={{ fontSize: 14, color: '#999999' }}>{I18n.t('mobile.module.clock.shifttime')}：{startData}-{endData}{`(${otherShift.TotalHours}${I18n.t('mobile.module.changeshift.hour')})`}</Text>);
    const monthText = Constance.getMonth(date[1], myFormHelper.getLanguage());
    return (
      <View style={{ height: 70 }}>
        <View style={styles.rowStyle}>
          <View style={circlebg} >
            <Text style={{ fontSize: 16, color: 'white' }}>{date[2]}</Text>
            <Text style={{ fontSize: 11, color: 'white', marginTop: 2 }}>{I18n.t(monthText)}</Text>
          </View>

          <View style={styles.rowTextStyle} >
            <Text style={{ fontSize: 16, color: '#000000' }}>{otherShift.PersonName} {otherShift.ShiftName}</Text>
            {durationView}
          </View>
        </View>
      </View>
    );
  }

  selectMyShift = () => {
    this.props.navigator.push({
      component: EmployeeShiftList,
      passProps: {
        toPage: -1,
        fromPage: 'SubmitShift',
        otherID: otherShift.ID,
        ShiftDate: this.state.myShift,
      },
    });
  }

  myShiftView() {
    if (!_.isEmpty(this.state.myShift)) {
      const date = _.split(this.state.myShift.ShiftDate, '-');
      let circlebg = styles.circleStyle;
      const startData = getHHmmFormat(this.state.myShift.TimeFrom);
      const endData = getHHmmFormat(this.state.myShift.TimeTo);
      if (this.state.myShift.ShiftType == Constance.ShiftType_HOLIDAY || this.state.myShift.ShiftType == Constance.ShiftType_FESTIVAL) {
        circlebg = styles.circleStyleOrange;
      }
      let durationView = null;
      durationView = (<Text style={{ fontSize: 14, color: '#999999' }}>{I18n.t('mobile.module.clock.shifttime')}：{startData}-{endData}{`(${this.state.myShift.TotalHours}${I18n.t('mobile.module.changeshift.hour')})`}</Text>);
      const monthText = Constance.getMonth(date[1], myFormHelper.getLanguage());
      return (
        <TouchableOpacity onPress={() => this.selectMyShift()}>
          <View style={styles.rowStyle}>
            <View style={circlebg} >
              <Text style={{ fontSize: 16, color: 'white' }}>{date[2]}</Text>
              <Text style={{ fontSize: 11, color: 'white', marginTop: 2 }}>{I18n.t(monthText)}</Text>
            </View>

            <View style={styles.rowTextStyle} >
              <Text style={{ fontSize: 16, color: '#000000' }}>{this.state.myShift.ShiftName}</Text>
              {durationView}
            </View>

            <Image style={styles.arrimgStyle} source={{ uri: rightarr }} />
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <Text style={{ fontSize: 16, color: '#999999', marginLeft: 18 }}>{I18n.t('mobile.module.changeshift.noshift')}</Text>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar title={I18n.t('mobile.module.changeshift.submit')} onPressLeftButton={() => {Keyboard.dismiss();this.props.navigator.pop()}} />
        <KeyboardAvoidingView behavior={this.state.behavior} style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1 }} behavior={this.state.behavior}>
            <Text style={{ margin: 10, marginLeft: 18 }}>{I18n.t('mobile.module.changeshift.othershift')}</Text>
            {this.otherShiftView()}
            {
              (!_.isEmpty(this.state.myShift)) ? <Text style={{ margin: 10, marginLeft: 18 }}>{I18n.t('mobile.module.changeshift.myshifthint')}</Text> : null
            }
            {this.myShiftView()}
            {
              (!_.isEmpty(this.state.myShift)) ?

                <View style={{ marginBottom: 15 }}>
                  <TextArea
                    title={`${I18n.t('mobile.module.changeshift.reasonhinttab')}${I18n.t('mobile.module.changeshift.needreason')}`}
                    placeholder={I18n.t('mobile.module.changeshift.reasonhint')}
                    value={Addvice}
                    onChange={(text) => {
                      text = text.replace(/(^\s*)|(\s*$)/g, "")
                      Addvice = text;
                      this.setState({
                        update: !this.state.update,
                      });
                    }}
                  />
                </View> : null
            }
          </ScrollView>
        </KeyboardAvoidingView>
        {
          (!_.isEmpty(this.state.myShift)) ?
            <SubmitButton onPressBtn={() => this.onSubmit()} /> : null
        }
      </View>
    );
  }
}
