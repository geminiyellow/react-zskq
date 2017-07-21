import {
  DeviceEventEmitter,
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
import { setCompanyCodeMobileRequest, setUserLoginRequest } from '@/common/components/Login/LoginRequest';
import { languageType } from '@/common/LanguageSettingData';
import { checkPermissionOfModule } from '@/common/Functions';
import realm from '@/realm';
import TouchID from '@/views/Launch/TouchID';
import ForcedUpdateModal from '@/common/components/Login/ForcedUpdateModal';

import QuickClock from './QuickClock';

const imageBottom = 'launch_image_bottom';
const bg = 'splash_icon1';


const { RNManager } = NativeModules;

export default class Launch extends Component {
  mixins: [React.addons.pureRenderMixin]

  constructor(props) {
    super(props);
    this.state = {
      imageUrl: '',
      statusHeight: 25,
      msg: '',
      keepTime: '',
    };
  }

  componentWillMount() {
    if (device.isAndroid) {
      RNManager.getStatusBarHeight((height) => {
        this.setState({
          statusHeight: height,
        });
      });
    }
  }

  componentDidMount() {
    RNManager.hideLoading();
    if (device.isAndroid) {
      RNManager.getCurrentLanguage((lan) => {
        device.mobileLocale = lan.split('-')[0];
        this.companyCodeMobileRequest();
      });
      RNManager.getStatusBarHeight((height) => {

      });
    } else {
      // iOS开启原生定位功能
      RNManager.startBaiduMapLocationService();
      this.companyCodeMobileRequest();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.time);
    clearTimeout(this.timerTouchID);
  }

  getContentView() {
    if (device.isIos) {
      return (<View style={{ flex: 1, backgroundColor: '#fff' }}>
        {this.renderLaunchImage()}
        <View style={styles.viewBottom}>
          <View style={{ flex: 1 }} />
          <Image style={styles.imageBottom} source={{ uri: imageBottom }} />
        </View>
      </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <Image resizeMode={Image.resizeMode.stretch} style={{ width: device.width, height: device.height, marginTop: -this.state.statusHeight }} source={{ uri: bg }} />
        {
          (this.state.imageUrl) ? <Image style={{ position: 'absolute', width: device.width, height: device.height - 121 }} source={{ uri: this.state.imageUrl }} /> : null
        }
      </View>
    );
  }

  companyCodeMobileRequest() {
    setCompanyCodeMobileRequest().then((imageUrl) => {
      if (imageUrl) {
        SplashScreen.hide();
        this.setState({
          imageUrl: imageUrl,
        });
        this.showLaunchImage(true);
      } else {
        this.showLaunchImage(false);
      }
    }).catch((err) => {
      const userInfo = realm.objects('User');
      let userPw = '';
      if (userInfo.length != 0) {
        for (let i = 0; i < userInfo.length; i++) {
          if (userInfo[i].password.length != 0) {
            userPw = userInfo[i].password;
          }
        }
      } else {
        this.showLaunchImage(false);
        return;
      }
      this.props.navigator.push({
        component: Login,
        params: {
          loginPwd: userPw.replace(/\#KENG#/g, '\\'),
        },
        gestureDisabled: true,
      });
    });
  }

  showLaunchImage(showImage) {
    InteractionManager.runAfterInteractions(() => {
      const touchIDEnable = realm.objects('Config').filtered('name="touchIDEnable"');
      const companyInfo = realm.objects('Company');
      const msg = companyInfo[0];
      const serverTouchIDEnable = global.companyResponseData ? global.companyResponseData.config.showFingerPrint : false;
      if (touchIDEnable.length == 0 || (!touchIDEnable[0].enable) || !serverTouchIDEnable) {
        if (companyInfo.length != 0) {
          if (showImage) {
            this.startToLogin(msg, 2000);
          } else if (!showImage && msg.image_url) {
            this.setState({
              imageUrl: msg.image_url,
            });
            this.startToLogin(msg, 2000);
          } else {
            this.startToLogin(msg, 1);
          }
        } else {
          const parameterAboutGuide = realm.objects('Config').filtered('name="parameterAboutGuide"');
          let component = CompanyCode;
          if (parameterAboutGuide.length == 0) {
            component = Guide;
          }
          this.props.navigator.push({
            component: component,
            gestureDisabled: true,
          });
        }
      } else {
        if (companyInfo.length != 0) {
          let timeDelay = 1;
          if (showImage) {
            timeDelay = 1000;
          }
          if (!showImage && msg.image_url) {
            SplashScreen.hide();
            this.setState({
              imageUrl: msg.image_url,
            });
            timeDelay = 1000;
          }
          this.timerTouchID = setTimeout(() => {
            RNManager.canEvaluatePolicy(value => {
              if (value) {
                this.props.navigator.replace({
                  component: TouchID,
                  gestureDisabled: true,
                  msg: msg,
                  keepTime: 1,
                });
              } else {
                this.startToLogin(msg, timeDelay);
              }
            });
          }, timeDelay);
        } else {
          this.props.navigator.push({
            component: Guide,
            gestureDisabled: true,
          });
        }
      }
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
          this.props.navigator.push({
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
      this.props.navigator.push({
        component: Tab,
        gestureDisabled: true,
      });
    }
  }

  goMobileCheckIn() {
    const hasPermission = checkPermissionOfModule('S010010');
    if (!hasPermission) {
      this.props.navigator.push({
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

  renderLaunchImage() {
    if (this.state.imageUrl) {
      return (
        <CachedImage style={styles.imageTop} source={{ uri: this.state.imageUrl }} />
      );
    } else {
      return (
        <CachedImage style={styles.imageTop} source={{ uri: '' }} />
      );
    }

    return null;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.getContentView()}
        <ForcedUpdateModal />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  imageTop: {
    width: device.width,
    height: device.height - 121,
    flex: 1,
  },
  viewBottom: {
    width: device.width,
    height: (121 / 667) * device.height,
    marginBottom: 0,
  },
  imageBottom: {
    alignSelf: 'center',
    marginBottom: 30,
    width: 256,
    height: 52,
    resizeMode: 'center',
  },
});