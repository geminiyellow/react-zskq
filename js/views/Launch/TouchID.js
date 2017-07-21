import {
  DeviceEventEmitter,
  Text,
  View,
  NativeModules,
  InteractionManager,
} from 'react-native';
import React, { Component } from 'react';

import I18n from 'react-native-i18n';
import SplashScreen from 'rn-splash-screen';
import EStyleSheet from 'react-native-extended-stylesheet';
import { CachedImage } from 'react-native-img-cache';

import CompanyCode from '@/views/CompanyCode';
import Guide from '@/views/Guide';
import Login from '@/views/Login';
import Tab from '@/views/Tab';
import { device, keys } from '@/common/Util';
import { showMessage } from '@/common/Message';
import Consts, { messageType, parameterToControlGuideShow } from '@/common/Consts';
import MobileCheckIn from '@/views/MobileCheckIn';
import ScanQrCheckIn from '@/views/MobileCheckIn/ScanQrCheckIn';
import MyForms from '@/views/MyForms';
import Image from '@/common/components/CustomImage';
import { setUserLoginRequest } from '@/common/components/Login/LoginRequest';
import { languageType } from '@/common/LanguageSettingData';
import { checkPermissionOfModule } from '@/common/Functions';
import realm from '@/realm';
import NavBar from '@/common/components/NavBar';
import Head from '@/views/Login/Head';
import ActorImageWrapper from '@/common/components/ImageWrapper';
import TouchableHighlight from '@/common/components/CustomTouchableHighlight';
import TryAgainModal from '@/views/Launch/components/TryAgainModal';

import QuickClock from './QuickClock';

const touchIDImage = 'touch_id_login';

const { RNManager } = NativeModules;

export default class TouchID extends Component {
  mixins: [React.addons.pureRenderMixin]

  constructor(props) {
    super(props);
    this.state = {
      msg: '',
      keepTime: '',
      headImgUrl: '',
      empName: '',
      englishName: '',
      empID: '',
      timesFailed: 0,
    };
  }

  componentWillMount() {
    this.touchIDListener = DeviceEventEmitter.addListener('EVENT_WITH_TOUCHID', (data) => {
      if (device.isIos) {
        if (!data.value && data.msg == 'authenticationFailed') {
          realm.write(() => {
            const userInfo = realm.objects('User');
            let userEffectiveName;
            for (let i = 0; i < userInfo.length; i++) {
              if (userInfo[i].password != 0) {
                userEffectiveName = userInfo[i].name;
              } else {

              }
              userInfo[i].password = '';
            }
            this.props.navigator.resetTo({
              userName: userEffectiveName.replace(/\#KENG#/g, '\\'),
              component: Login,
              gestureDisabled: true,
            });
          });
          return;
        } else if (!data.value) {
          return;
        }
        if (data.value && data.msg == '2') {
          this.useTouchID();
          return;
        }
      } else {
        if (!data.value && data.msg != '指纹操作已取消。' && data.msg != '手指移动太快，请重试。') {     
          if (data.msg == '尝试次数过多，请稍后重试。') {
            this.timer = setTimeout(() => {
              this.useTouchID();
              this.tryAgainModal.changeStateRestart();
            }, 30000);
            this.tryAgainModal.open();
            this.tryAgainModal.changeStateWait('尝试次数过多，请稍后重试。');
            return;
          }
          this.tryAgainModal.open();
          this.tryAgainModal.changeState();
          this.setState({
            timesFailed: this.state.timesFailed + 1,
          });
          return;
        } else if (!data.value && data.msg == '指纹操作已取消。') {
          return;
        } else if (data.msg == '手指移动太快，请重试。') {
          return;
        }
      }
      
      if (device.isAndroid) {
        RNManager.stopListening();
      }
      const { msg, keepTime } = this.props;
      this.startToLogin(msg, keepTime);
    });
    const userInfo = realm.objects('User');
    let userEffective;
    if (userInfo.length != 0) {
      for (let i = 0; i < userInfo.length; i ++) {
        if (userInfo[i].password.length != 0) {
          this.setState({
            empName: userInfo[i].emp_name,
            headImgUrl: userInfo[i].head_url,
            englishName: userInfo[i].english_name,
            empID: userInfo[i].emp_id,            
          });
        }
      }
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.useTouchID();
    });
    SplashScreen.hide();
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.time);
    this.touchIDListener.remove();
    if (device.isAndroid) {
      clearTimeout(this.timer);
    }
  }

  startToLoginMiddle(msg, keepTime) {
    this.setState({
      msg: msg,
      keepTime: keepTime,
    });
  }

  startToLogin(msg, keepTime) {
    if (keepTime == 2000) {
      SplashScreen.hide();
    }
    this.time = setTimeout(() => {
      let firstLaunchZ = false;
      let companyCode = '';
      const autoLogin = true;
      companyCode = msg.code;
      Consts.apiAddress = msg.url;

      const parameterAboutGuide = realm.objects('Config').filtered('name="parameterAboutGuide"');
      if (parameterAboutGuide.length != 0 && parameterAboutGuide[0].value == parameterToControlGuideShow) {
        firstLaunchZ = false;
      } else {
        firstLaunchZ = true;
      }
      // 针对安卓 跟随系统语言 特殊情况做处理
      if (device.isAndroid) {
        const configLan = realm.objects('Config').filtered('name="language"');
        if (configLan.length == 0 || (configLan.length != 0 && configLan[0].language == '0')) {
          const k = languageType.indexOf(device.mobileLocale);
          if (k == -1) {
            I18n.locale = languageType[1];
          } else {
            I18n.locale = languageType[k];
          }
        }
      }

      /** 安装App后首次进入时进入引导页面，
       * 自动登录失败进入公司代码页面，若公司代码已保存，进入登录页面
       */
      if (firstLaunchZ) {
        this.props.navigator.push({
          component: Guide,
          gestureDisabled: true,
        });
      } else {
        const userInfo = realm.objects('User');
        let userPw = '';
        if (userInfo.length != 0) {
          for (let i = 0; i < userInfo.length; i++) {
            if (userInfo[i].password.length != 0) {
              userPw = userInfo[i].password;
            }
          }
        } else {
          const companyInfo = realm.objects('Company');
          let component = Login;
          if (companyInfo.length == 0 || (companyInfo.length != 0 && companyInfo[0].code == 'trial')) {
            component = CompanyCode;
          }
          this.props.navigator.push({
            component: component,
            gestureDisabled: true,
          });
          return;
        }
        if (userPw.length == 0) {
          this.props.navigator.push({
            component: Login,
            gestureDisabled: true,
          });
          return;
        }

        setUserLoginRequest().then(responseData => {
          if (!this.mounted) {
            return;
          }
          if (responseData.IsValid) {
            this.checkOutTimeToWork(responseData);
          } else {
            this.props.navigator.push({
              component: Login,
              params: {
                loginPwd: userPw.replace(/\#KENG#/g, '\\'),
              },
              gestureDisabled: true,
            });
          }
        }).catch(err => {
          showMessage(messageType.error, err);
          this.props.navigator.push({
            component: Login,
            params: {
              loginPwd: userPw,
            },
            gestureDisabled: true,
          });
        });
      }
    }, keepTime);
  }

  checkOutTimeToWork(data) {
    if (device.isIos) {
      RNManager.getEntranceType(info => {
        if (info == 'gaia_clock') {
          this.goMobileCheckIn();
        } else if (info == 'gaia_request') {
          this.goMyRequest();
        } else {
          this.checkOutTimeToWorkTwice(data);
        }
      });
    } else {
      this.checkOutTimeToWorkTwice(data);
    }
  }

  checkOutTimeToWorkTwice(data) {
    const hasPermission = checkPermissionOfModule('S010010');
    if (!data.timeClassS) {
      this.props.navigator.push({
        component: Tab,
        gestureDisabled: true,
      });
      return;
    }
    const timeToWork = data.timeClassS;
    const strArr = timeToWork.split(':');
    const strService = data.ServiceTime.split(':');
    const numberHours = parseInt(strArr[0]) - parseInt(strService[0]);
    const numberMinutes = parseInt(strArr[1]) - parseInt(strService[1]);
    const numberAll = (numberHours * 60) + numberMinutes;
    if (numberAll <= 120 && numberAll > 0 && hasPermission) {
      const configQuickClock = realm.objects('Config').filtered('name="QuickClockEnter"');
      if (configQuickClock.length != 0) {
        const dateN = new Date();
        const dateStrN = `${dateN.getFullYear()}-${dateN.getMonth() + 1}-${dateN.getDate()}`;
        if (configQuickClock[0].value == dateStrN) {
          this.props.navigator.replace({
            component: Tab,
            gestureDisabled: true,
          });
        } else {
          this.props.navigator.push({
            timeLeft: numberAll,
            component: QuickClock,
            gestureDisabled: true,
          });

          realm.write(() => {
            const info = realm.objects('Config').filtered('name="QuickClockEnter"');
            if (info.length == 0) {
              realm.create('Config', { name: 'QuickClockEnter', value: dateStrN });
            } else {
              info[0].value = dateStrN;
            }
          });
        }
      } else {
        const dateE = new Date();
        const dateStr = `${dateE.getFullYear()}-${dateE.getMonth() + 1}-${dateE.getDate()}`;
        realm.write(() => {
          const info = realm.objects('Config').filtered('name="QuickClockEnter"');
          if (info.length == 0) {
            realm.create('Config', { name: 'QuickClockEnter', value: dateStr });
          } else {
            info[0].value = dateStr;
          }
        });
        this.props.navigator.push({
          timeLeft: numberAll,
          component: QuickClock,
          gestureDisabled: true,
        });
      }
    } else {
      this.props.navigator.replace({
        component: Tab,
        gestureDisabled: true,
      });
    }
  }

  goMobileCheckIn() {
    const hasPermission = checkPermissionOfModule('S010010');
    if (!hasPermission) {
      this.props.navigator.replace({
        shouldBackHome: true,
        component: Tab,
        gestureDisabled: true,
      });
      return;
    }
    const punchTypeList = global.companyResponseData ? global.companyResponseData.attendance : null;
    if (punchTypeList.length == 1 && punchTypeList[0] == 'APP_QR') {
      this.props.navigator.push({
        shouldBackHome: true,
        component: ScanQrCheckIn,
        gestureDisabled: true,
      });
    } else {
      this.props.navigator.push({
        shouldBackHome: true,
        component: MobileCheckIn,
        gestureDisabled: true,
      });
    }
  }

  goMyRequest() {
    this.props.navigator.push({
      shouldBackHome: true,
      component: MyForms,
      gestureDisabled: true,
    });
  }

  useTouchID() {
    RNManager.evaluatePolicy(I18n.t('mobile.module.login.usetouchid'));
    if (device.isAndroid && !this.tryAgainModal.isOpen) {
      this.tryAgainModal.open();
    }
  }

  changeLogin() {
    realm.write(() => {
      const userInfo = realm.objects('User');
      let userEffectiveName = '';
      for (let i = 0; i < userInfo.length; i++) {
        if (userInfo[i].password != 0) {
          userEffectiveName = userInfo[i].name;
        } else {

        }
        userInfo[i].password = '';
      }
      this.props.navigator.resetTo({
        userName: userEffectiveName.replace(/\#KENG#/g, '\\'),
        component: Login,
        gestureDisabled: true,
      });
    });
  }

  renderTimes() {
    return(
        <Text style={styles.textTouchID}>{I18n.t('mobile.module.login.touchid')}</Text>
      );
  }

  render() {
    const { headImgUrl, empName, englishName, empID } = this.state;

    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#FFF' }}>
        <NavBar
          title={I18n.t('mobile.module.login.login')}
          leftButton={false} />
        <ActorImageWrapper style={styles.headImage} textStyle={{ fontSize: 30 }} actor={headImgUrl} EmpID={empID} EmpName={empName} EnglishName={englishName} />
        
        <TouchableHighlight style={styles.touchableHighlight} onPress={() => this.useTouchID()}>
          <View style={{ alignItems: 'center' }}>
            <Image style={styles.imageTouchID} source={{ uri: touchIDImage }} />
            {this.renderTimes()}
          </View>
        </TouchableHighlight>

        <View style={{ flex: 1 }} />
        <TouchableHighlight onPress={() => this.changeLogin()}>
        <Text style={styles.textChange}>{I18n.t('mobile.module.login.touchchangelogin')}</Text>
        </TouchableHighlight>
        <TryAgainModal
        ref={modal => this.tryAgainModal = modal} />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  imageTouchID: {
    width: 60,
    height: 60,
  },
  textTouchID: {
    marginTop: 20,
    color: '$color.mainColorLight',
    fontSize: 14,
  },
  textChange: {
    color: '$color.mainColorLight',
    fontSize: 16,
    marginBottom: 40,
  },
  headImage: {
    marginTop: 28,
    width: 65,
    height: 65,
    borderRadius: 32.5,
  },
  touchableHighlight: {
    marginTop: 117,
    alignItems: 'center',
  },
});