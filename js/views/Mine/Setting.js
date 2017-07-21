import { ScrollView, TouchableOpacity, View, DeviceEventEmitter, NativeModules } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import Text from '@/common/components/TextField';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import { getCurrentLanguage } from '@/common/Functions';
import { getCustomer, getUserInfo } from '@/common/api';
import { messageType } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import UmengAnalysis from '@/common/components/UmengAnalysis';
import NavBar from '@/common/components/NavBar';
import { ABORT, GET } from '@/common/Request';
import OptionCard from '@/common/components/OptionCard';
import SwitchCard from '@/common/components/SwitchCard';
import Login from '@/views/Login';
import CompanyCode from '@/views/CompanyCode';
import realm from '@/realm';
import Safe from './Safe';
import LanguageSetting from './LanguageSetting';
import { device, keys, event } from '../../common/Util';
import TipSettingUi from './../TipSetting/TipSettingUi';
import Line from '../../common/components/Line';
import MyFormHelper from './../MyForms/MyFormHelper';
import { appExitLog } from '@/common/Log/requestLogHelper';

const { RNManager } = NativeModules;
const myFormHelper = new MyFormHelper();

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
  },
  itemStyle: {
    flexGrow: 1,
    paddingLeft: 18,
    paddingRight: 10,
    height: 48,
    alignItems: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
});

let actor = '';
const languageArr = ['mobile.module.language.chinese', 'mobile.module.language.english', 'mobile.module.language.korean', 'mobile.module.language.japanese', 'mobile.module.language.french'];


export default class Setting extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      autoLogin: true,
      languageName: '',
      refresh: false,
      tel: '',
      showCustomerService: '',
    };
  }

  sendRequest() {
    this.setState({
      tel: global.companyResponseData.config.telConfig.telphoneNumber,
      showCustomerService: global.companyResponseData.config.telConfig.showCustomerService,
    });
  }

  getTel() {
    if ((this.state.showCustomerService == false) || ((this.state.showCustomerService == true) && (_.isEmpty(this.state.tel)))) {
      return null;
    } else {
      return (
        <View style={{ marginTop: 10 }}>
          <OptionCard title={I18n.t('mobile.module.mine.contact.title')} detailText={this.state.tel} rightImage={false} onPress={() => this.gotoTelePhone()} />
          <Line />
        </View>
      );
    }
  }

  componentWillMount() {
    UmengAnalysis.onPageBegin('Setting');
    this.sendRequest();
    actor = '';
    DeviceEventEmitter.addListener('updateActorCallBack', (url) => {
      if (url) {
        actor = `${url}?key=${_.now()}`;
        this.setState({
          updateActorSuccess: !this.state.updateActorSuccess,
        });
      }
    });
    if (!_.isEmpty(global.loginResponseData)) {
      if (!_.isEmpty(global.loginResponseData.Position)) position = global.loginResponseData.Position;

      if (!_.isEmpty(global.loginResponseData.HeadImgUrl)) {
        actor = global.loginResponseData.HeadImgUrl;
        actor = `${actor}?key=${_.now()}`;
      }
    }

    getCurrentLanguage().then(dataLan => {
      if (dataLan == 'EN-US') {
        username = _.isEmpty(global.loginResponseData.EnglishName) ? global.loginResponseData.EmpName : global.loginResponseData.EnglishName;
        this.setState({
          languageName: languageArr[1],
        });
      } else if (dataLan == 'KO-KR') {
        username = _.isEmpty(global.loginResponseData.EnglishName) ? global.loginResponseData.EmpName : global.loginResponseData.EnglishName;
        this.setState({
          languageName: languageArr[2],
        });
      } else if (dataLan == 'JA-JP') {
        username = _.isEmpty(global.loginResponseData.EnglishName) ? global.loginResponseData.EmpName : global.loginResponseData.EnglishName;
        this.setState({
          languageName: languageArr[3],
        });
      } else if (dataLan == 'FR-FR') {
        username = _.isEmpty(global.loginResponseData.EnglishName) ? global.loginResponseData.EmpName : global.loginResponseData.EnglishName;
        this.setState({
          languageName: languageArr[4],
        });
      } else {
        username = _.isEmpty(global.loginResponseData.EmpName) ? global.loginResponseData.EnglishName : global.loginResponseData.EmpName;
        this.setState({
          languageName: languageArr[0],
        });
      }
    });

    this.languageChanged = DeviceEventEmitter.addListener('changeLanguage', (selectedIndex) => {
      myFormHelper.sendRequestFormTypes();
      this.getUserInfoRequest();
      getCurrentLanguage().then(dataLan => {
        username = '';
        if (dataLan == 'EN-US') {
          username = _.isEmpty(global.loginResponseData.EnglishName) ? global.loginResponseData.EmpName : global.loginResponseData.EnglishName;
          this.setState({
            languageName: languageArr[1],
          });
        } else if (dataLan == 'KO-KR') {
          username = _.isEmpty(global.loginResponseData.EnglishName) ? global.loginResponseData.EmpName : global.loginResponseData.EnglishName;
          this.setState({
            languageName: languageArr[2],
          });
        } else if (dataLan == 'JA-JP') {
          username = _.isEmpty(global.loginResponseData.EnglishName) ? global.loginResponseData.EmpName : global.loginResponseData.EnglishName;
          this.setState({
            languageName: languageArr[3],
          });
        } else if (dataLan == 'FR-FR') {
          username = _.isEmpty(global.loginResponseData.EnglishName) ? global.loginResponseData.EmpName : global.loginResponseData.EnglishName;
          this.setState({
            languageName: languageArr[4],
          });
        } else {
          username = _.isEmpty(global.loginResponseData.EmpName) ? global.loginResponseData.EnglishName : global.loginResponseData.EmpName;
          this.setState({
            languageName: languageArr[0],
          });
        }
      });
    });
  }


  componentWillUnmount() {
    UmengAnalysis.onPageEnd('Setting');

  }

  // 获取用户信息
  getUserInfoRequest() {
    GET(getUserInfo(), (responseData) => {
      if (!_.isEmpty(responseData)) {
        username = responseData.EmpName;
        this.setState({
          refresh: !this.state.refresh,
        });
      }
    }, (error) => {
    }, 'getUserInfo');
  }

  gotoNextView(view) {
    this.props.navigator.push({
      component: view,
    });
  }

  gotoTipSetting = () => {
    this.props.navigator.push({
      component: TipSettingUi,
    });
  }

  gotoSafe = () => {
    this.props.navigator.push({
      component: Safe,
    });
  }


  gotoLoginPage = () => {
    // 记录日志
    appExitLog();
    DeviceEventEmitter.emit(event.EXIT, true);

    realm.write(() => {
      const userInfo = realm.objects('User');
      let userEffectiveName = '';
      for (let i = 0; i < userInfo.length; i++) {
        if (userInfo[i].password != 0) {
          userEffectiveName = userInfo[i].name;
        }
        userInfo[i].password = '';
      }
      username = '';
      position = '';
      actor = '';
      let component = Login;
      const touchIDEnable = realm.objects('Config').filtered('name="touchIDEnable"');
      if (touchIDEnable.length != 0 && touchIDEnable[0].enable) {
        touchIDEnable[0].enable = false;
      }
      const companyInfo = realm.objects('Company');
      if (companyInfo.length != 0 && companyInfo[0].code == 'trial') {
        companyInfo[0].code = '';
        component = CompanyCode;
      }
      this.props.navigator.resetTo({
        userName: userEffectiveName.replace(/\#KENG#/g, '\\'),
        component: component,
      });
      RNManager.stopJPushService();
    });
  }


  // 跳转到手机系统拨号界面
  gotoTelePhone() {
    RNManager.TelePhone(this.state.tel);
  }

  gotoLanguageSetting = () => {
    this.props.navigator.push({
      component: LanguageSetting,
    });
  }

  componentWillUnmount() {
    position = '';
    actor = '';
    this.languageChanged.remove();
    ABORT('getCustomer');
  }

  render() {
    const showModifyPwd = global.companyResponseData ? global.companyResponseData.config.showModifyPwd : true;

    return (
      <View style={styles.container}>

        <NavBar title={I18n.t('mobile.module.mine.contact.set')} onPressLeftButton={() => this.props.navigator.pop()} />

        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={{ backgroundColor: 'white', marginTop: 10 }}>
            <OptionCard title={I18n.t('mobile.module.mine.contact.account')} detailText={''} onPress={this.gotoSafe} />
            <OptionCard topLineStyle={{ marginLeft: 18 }} title={I18n.t('mobile.module.mine.contact.tipsetting')} detailText={''} onPress={this.gotoTipSetting} />
            <OptionCard topLineStyle={{ marginLeft: 18 }} bottomLine title={I18n.t('mobile.module.mine.aboutus.languageset')} onPress={this.gotoLanguageSetting} />
          </View>
          <Line />

          {/*联系客服*/}
          {this.getTel()}
          <View style={{ backgroundColor: 'white', marginTop: 10 }}>
            <Line />
            <TouchableOpacity onPress={this.gotoLoginPage} style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
              <View style={styles.itemStyle}>
                <Text style={{ fontSize: 17, color: '#000' }}>{I18n.t('mobile.module.mine.feedback.logout')}</Text>
              </View>
            </TouchableOpacity>
            <Line />
          </View>
        </ScrollView >
      </View >
    );
  }
}