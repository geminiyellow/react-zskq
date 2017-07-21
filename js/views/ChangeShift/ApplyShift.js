/**
 * 申请换班，将班次放入换班池中
 */
import { DeviceEventEmitter, InteractionManager, KeyboardAvoidingView, Keyboard, TouchableOpacity, View, NativeModules } from 'react-native';
import React, { PureComponent } from 'react';
import Text from '@/common/components/TextField';
import NavBarBackText from '@/common/components/NavBarBackText';
import EStyleSheet from 'react-native-extended-stylesheet';
import moment from 'moment';
import { device } from '@/common/Util';
import ScrollView from '@/common/components/ScrollView';
import SubmitButton from '@/common/components/SubmitButton';
import I18n from 'react-native-i18n';
import UmengAnalysis from '@/common/components/UmengAnalysis';
import TextArea from '@/common/components/TextArea';
import Line from '@/common/components/Line';
import NavBar from '@/common/components/NavBar';
import Image from '@/common/components/CustomImage';
import { GET, POST, ABORT } from '@/common/Request';
import NavigationBar from '@/common/components/NavigationBar';
import { getCurrentLanguage } from '@/common/Functions';
import { languages } from '@/common/LanguageSettingData';
import _ from 'lodash';
import { showMessage } from '../../common/Message';
import { messageType } from '../../common/Consts';
import { toPage } from './ShiftConst';
import Constance from './../Schedule/Constance';
import EmployeeShiftList from './EmployeeShiftList';
import { SubmitShiftDemand, getMyAvailableShift } from './../../common/api';
import MyFormHelper from '../MyForms/MyFormHelper';
import { getHHmmFormat } from '@/common/Functions';

const myFormHelper = new MyFormHelper();
const KeyboardAvoiding = device.isIos ? View : KeyboardAvoidingView;
const { RNManager } = NativeModules;

let reason = '';

const rightarr = 'forward';

const styles = EStyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '$color.containerBackground',
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
    //backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'flex-end',
  },
  monthTextStyle: {
    fontSize: 15,
    color: '#999999',
    marginLeft: 18,
    marginTop: 10,
    marginBottom: 10,
  },
  arrimgStyle: {
    width: 22,
    height: 22,
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  rowStyle: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    paddingLeft: 18,
    paddingTop: 8,
    alignItems: 'center',
    paddingBottom: 8,
  },
  // 多行文本框统一加下这个样式
  multilineInput: {
    '@media ios': {
      paddingVertical: 5,
    },
    flexGrow: 1,
    marginTop: 5,
    height: 130,
    textAlignVertical: 'top',
    color: '#cccccc',
    fontSize: 14,
  },
  rowTextStyle: {
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 10,
  },
  columnImg: {
    width: device.width,
    height: 220,
    marginVertical: 10,
  },
});

let selectedShift = '';

let selectMyShiftListener = null;

export default class ApplyShift extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      behavior: null,
      language: 0,
      update: true,
      myShift: null,
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
    UmengAnalysis.onPageBegin('ApplyShift');
    selectedShift = this.props.passProps.data;
    if (_.isEmpty(selectedShift)) {
      // 发请求获取我的默认可换班次
      this.getDefaultShift();
    }
    selectMyShiftListener = DeviceEventEmitter.addListener('selectMyShift', value => {
      selectedShift = value;
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

  getDefaultShift = () => {
    const params = {};
    params.currentToday = moment().format('YYYYMMDDHHmmss');
    GET(getMyAvailableShift(params), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        RNManager.hideLoading();
        // 返回数据为空
        if (!_.isEmpty(responseData)) {
          selectedShift = responseData[0];
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

  componentWillUnmount() {
    UmengAnalysis.onPageEnd('ApplyShift');
    if (!device.isIos) {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }
    reason = '';
    selectedShift = null;
    ABORT('getDefaultShift');
    selectMyShiftListener.remove();
  }

  onSubmit = () => {
    if (_.isEmpty(selectedShift)) {
      showMessage(messageType.error, I18n.t('mobile.module.changeshift.noshift'));
      return;
    }
    InteractionManager.runAfterInteractions(() => {
      const params = {};
      params.sessionId = global.loginResponseData.SessionId;
      params.shiftDate = selectedShift.ShiftDate;
      params.reason = reason;
      POST(SubmitShiftDemand(), params, (responseData) => {
        RNManager.hideLoading();
        showMessage(messageType.success, I18n.t('mobile.module.changeshift.providesuccess'));
        this.props.navigator.pop();
        this.props.navigator.pop();
      }, (err) => {
        RNManager.hideLoading();
        showMessage(messageType.error, err);
      });
      RNManager.showLoading('');
    });
  }

  pressItem = () => {
    if (toPage.ApplyShift == this.props.passProps.toPage) {
      this.props.navigator.push({
        component: EmployeeShiftList,
        passProps: {
          toPage: -1,
          fromPage: 'ApplyShift',
          otherID: '',
          ShiftDate: selectedShift,
        },
      });
      return;
    }
    this.props.navigator.pop();
  }

  shiftView() {
    if (_.isEmpty(selectedShift)) {
      return (
        <Text style={{ fontSize: 16, color: '#999999', marginLeft: 18 }}>{I18n.t('mobile.module.changeshift.noshift')}</Text>
      );
    }
    const date = _.split(selectedShift.ShiftDate, '-');
    let circlebg = styles.circleStyle;
    const startData = getHHmmFormat(selectedShift.TimeFrom);
    const endData = getHHmmFormat(selectedShift.TimeTo);
    if (selectedShift.ShiftType == Constance.ShiftType_HOLIDAY || selectedShift.ShiftType == Constance.ShiftType_FESTIVAL) {
      circlebg = styles.circleStyleOrange;
    }
    let durationView = null;

    durationView = (<Text style={{ fontSize: 14, color: '#999999' }}>{I18n.t('mobile.module.clock.shifttime')}：{startData}-{endData}{`(${selectedShift.TotalHours}${I18n.t('mobile.module.changeshift.hour')})`}</Text>);

    const monthText = Constance.getMonth(date[1], myFormHelper.getLanguage());
    return (
      <TouchableOpacity onPress={() => this.pressItem()}>
        <Line />
        <View style={styles.rowStyle}>
          <View style={circlebg} >
            <Text style={{ fontSize: 16, color: 'white' }}>{date[2]}</Text>
            <Text style={{ fontSize: 11, color: 'white', marginTop: 2 }}>{I18n.t(monthText)}</Text>
          </View>

          <View style={styles.rowTextStyle} >
            <Text style={{ fontSize: 16, color: '#000000' }}>{selectedShift.ShiftName}</Text>
            {durationView}
          </View>
          <Image style={[styles.arrimgStyle, { marginRight: 1 }]} source={{ uri: rightarr }} />
        </View>
        <Line />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar title={I18n.t('mobile.module.changeshift.providetitle')} onPressLeftButton={() => this.props.navigator.pop()} />

        <KeyboardAvoidingView behavior={this.state.behavior} style={{ flex: 1 }}>
          <ScrollView style={{ flexGrow: 1 }}>
            <Text style={{ margin: 10, marginLeft: 18 }}>{I18n.t('mobile.module.changeshift.providehint')}</Text>
            {this.shiftView()}
            {
              (!_.isEmpty(selectedShift)) ?
                <TextArea
                  title={`${I18n.t('mobile.module.changeshift.reasonhinttab')}${I18n.t('mobile.module.changeshift.noneedreason')}`}
                  placeholder={I18n.t('mobile.module.changeshift.reasonhint')}
                  value={reason}
                  onChange={(text) => {
                    reason = text;
                    this.setState({
                      update: !this.state.update,
                    });
                  }}
                />
                : null
            }
          </ScrollView>
        </KeyboardAvoidingView>
        {
          (!_.isEmpty(selectedShift)) ?
            <SubmitButton onPressBtn={() => this.onSubmit()} /> : null
        }
      </View>
    );
  }
}