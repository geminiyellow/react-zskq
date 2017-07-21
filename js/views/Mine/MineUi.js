/**
 * 我的界面
 */
import { ScrollView, TouchableOpacity, View, DeviceEventEmitter, NativeModules } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { navigationBar, navBar } from '@/common/Style';
import Text from '@/common/components/TextField';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import { getCurrentLanguage } from '@/common/Functions';
import { getUserInfo } from '@/common/api';

import NavBar from '@/common/components/NavBar';
import Image from '@/common/components/CustomImage';
import ActorImageWrapper from '@/common/components/ImageWrapper';
import { ABORT, GET } from '@/common/Request';
import OptionCard from '@/common/components/OptionCard';
import Login from '@/views/Login';
import QRLogin from '@/views/Mine/QRLogin';
import UnuseableTime from '@/views/Mine/UnuseableTime';
import CompanyCode from '@/views/CompanyCode';
import { showMessage } from '@/common/Message';
import { messageType, appVersion } from '@/common/Consts';
import { languages } from '@/common/LanguageSettingData';
import AboutUs from '../ProtocolAndPrivacy/AboutOneHandle';
import AccountUi from './AccountUi';
import Setting from './Setting';
import { device, keys } from '../../common/Util';
import Line from '../../common/components/Line';
import MyFormHelper from './../MyForms/MyFormHelper';
import Feedback from './Feedback/Feedback';

const { RNManager } = NativeModules;
const rightarr = 'forward';
const share = 'share';
const set = 'set';
const tip = 'tip';
const feed = 'feed';
const scanning = 'scanning';
const about = 'about';
const time = 'time';


const myFormHelper = new MyFormHelper();

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
  },
  imgStyle: {
    width: 65,
    height: 65,
    alignSelf: 'center',
    marginLeft: 18,
    marginRight: 18,
    borderRadius: 33,
  },
  arrimgStyle: {
    width: 22,
    height: 22,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginRight: 12,
  },
});

let username = '';
let position = '';
let actor = '';
const languageArr = [
  'mobile.module.language.chinese',
  'mobile.module.language.english',
  'mobile.module.language.korean',
  'mobile.module.language.japanese',
  'mobile.module.language.french',
  'mobile.module.language.deutsch',
  'mobile.module.language.thai'];


export default class MineUi extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      languageName: '',
      refresh: false,
    };
  }

  componentWillMount() {
    actor = '';
    DeviceEventEmitter.addListener('SHARE_CODE', (data) => {
      if (data == '0') {
        showMessage(messageType.success, I18n.t('mobile.module.mine.share.success'));
      }
      if (data == '1') {
        showMessage(messageType.error, I18n.t('mobile.module.mine.share.notexist'));
      }
      if (data == '2') {
        showMessage(messageType.error, I18n.t('mobile.module.mine.share.failed'));
      }
      if (data == '3') {
        showMessage(messageType.error, I18n.t('mobile.module.mine.share.cancel'));
      }
    });
    DeviceEventEmitter.addListener('updateActorCallBack', (url) => {
      if (url) {
        actor = url;
        this.setState({
          updateActorSuccess: !this.state.updateActorSuccess,
        });
      }
    });
    if (!_.isEmpty(global.loginResponseData)) {
      if (!_.isEmpty(global.loginResponseData.Position)) position = global.loginResponseData.Position;

      if (!_.isEmpty(global.loginResponseData.HeadImgUrl)) {
        actor = global.loginResponseData.HeadImgUrl;
      }
    }

    getCurrentLanguage().then(dataLan => {
      const k = languages.indexOf(dataLan);
      if (k == 0) {
        username = _.isEmpty(global.loginResponseData.EmpName) ? global.loginResponseData.EnglishName : global.loginResponseData.EmpName;
      } else {
        username = _.isEmpty(global.loginResponseData.EnglishName) ? global.loginResponseData.EmpName : global.loginResponseData.EnglishName;
      }
      this.setState({
        languageName: languageArr[k],
      });
    });

    this.languageChanged = DeviceEventEmitter.addListener('changeLanguage', (selectedIndex) => {
      myFormHelper.sendRequestFormTypes();
      this.getUserInfoRequest();
      getCurrentLanguage().then(dataLan => {
        username = '';
        const k = languages.indexOf(dataLan);
        if (k == 0) {
          username = _.isEmpty(global.loginResponseData.EmpName) ? global.loginResponseData.EnglishName : global.loginResponseData.EmpName;
        } else {
          username = _.isEmpty(global.loginResponseData.EnglishName) ? global.loginResponseData.EmpName : global.loginResponseData.EnglishName;
        }
        this.setState({
          languageName: languageArr[k],
        });
      });
    });
  }

  componentWillUnmount() {
    username = '';
    position = '';
    actor = '';
    this.languageChanged.remove();
    ABORT('getCustomer');
  }

  // 获取用户信息
  getUserInfoRequest() {
    if (!_.isEmpty(global.loginResponseData)) {
      username = global.loginResponseData.EmpName;
      this.setState({
        refresh: !this.state.refresh,
      });
    }
  }

  gotoDetail = () => {
    this.props.navigator.push({
      component: AccountUi,
    });
  }

  gotoQRLogin = () => {
    this.props.navigator.push({
      component: QRLogin,
    });
  }

  gotoNextView(view) {
    this.props.navigator.push({
      component: view,
    });
  }

  gotoAboutUs = () => {
    this.props.navigator.push({
      component: AboutUs,
    });
  }

  shareApp = () => {
    RNManager.shareApp(I18n.t('mobile.module.mine.aboutus.onahandle'), I18n.t('mobile.module.mine.aboutus.time'));
  }

  gotoFeedback = () => {
    this.props.navigator.push({
      component: Feedback,
    });
  }

  gotoSetting = () => {
    this.props.navigator.push({
      component: Setting,
    });
  }

  render() {
    const showQRLogin = global.companyResponseData ? global.companyResponseData.config.showScanLogin : true;
    const showUnuseTime = global.companyResponseData ? global.companyResponseData.config.showUnuseTime : false;

    return (
      <View style={styles.container}>

        <NavBar
          barStyle="light-content"
          title={I18n.t('mobile.module.mine.title')}
          leftButton={false}
          backgroundColor={navigationBar.homeBackgroundColor} titleColor={navBar.title.whiteColor} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Line style={{ marginTop: 10 }} />
          <View style={{ backgroundColor: 'white' }}>
            <TouchableOpacity style={[styles.container, { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' }]} onPress={this.gotoDetail}>
              <ActorImageWrapper style={styles.imgStyle} textStyle={{ fontSize: 30 }} actor={actor} EmpID={global.loginResponseData.EmpID} EmpName={username} EnglishName={username} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 19, color: '#000', marginTop: 26 }}>{username}</Text>
                <Text style={{ fontSize: 14, color: '#8a8a8a', marginTop: 9, marginBottom: 28 }} >{position}</Text>
              </View>
              <Image style={styles.arrimgStyle} source={{ uri: rightarr }} />
            </TouchableOpacity>
          </View>
          <Line />

          {showQRLogin ? <OptionCard
            title={I18n.t('mobile.module.mine.qr.title')}
            bottomLine
            style={{ marginTop: 10 }}
            leftImageName={scanning}
            onPress={this.gotoQRLogin} /> : null}

          {showUnuseTime ? <OptionCard
            title={I18n.t('mobile.module.unuseless.title')}
            bottomLine
            leftImageName={time}
            style={{ marginTop: 10 }}
            onPress={() => this.gotoNextView(UnuseableTime)} /> : null}

          <View style={{ backgroundColor: 'white', marginTop: 10 }}>
            <OptionCard leftImageName={feed} title={I18n.t('mobile.module.mine.feedback.title')} detailText={''} onPress={this.gotoFeedback} />
            <OptionCard leftImageName={share} topLineStyle={{ marginLeft: 18 }} title={I18n.t('mobile.module.mine.share')} detailText={''} onPress={this.shareApp} />
            <OptionCard leftImageName={about} topLineStyle={{ marginLeft: 18 }} bottomLine detailText={`v${appVersion}`} title={I18n.t('mobile.module.mine.aboutus.title')} onPress={this.gotoAboutUs} />
          </View>

          <View style={{ backgroundColor: 'white', marginTop: 10 }}>
            <OptionCard leftImageName={set} title={I18n.t('mobile.module.mine.contact.set')} bottomLine onPress={this.gotoSetting} />
          </View>
        </ScrollView >
      </View >
    );
  }
}