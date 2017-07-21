import React, { PureComponent } from 'react';
import {
  InteractionManager,
  NativeModules,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
} from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import Modal from 'react-native-modalbox';

import UmengAnalysis from '@/common/components/UmengAnalysis';
import { device, keys } from '@/common/Util';
import { ABORT, POST } from '@/common/Request';
import { getNewSetUserPassword, submitSIMChange } from '@/common/api';
import { messageType } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import NavBar from '@/common/components/NavBar';
import Input from '@/common/components/Input';
import Line from '@/common/components/Line';
import { getCurrentLanguage, encrypt, checkPermissionOfModule } from '@/common/Functions';
import Login from '@/views/Login';
import realm from '@/realm';
import Consts, { sessionId } from '@/common/Consts';
import TouchableHighlight from '@/common/components/CustomTouchableHighlight';
import Image from '@/common/components/CustomImage';
import { setUserLoginRequest } from '@/common/components/Login/LoginRequest';
import MobileCheckIn from '@/views/MobileCheckIn';
import ScanQrCheckIn from '@/views/MobileCheckIn/ScanQrCheckIn';
import MyForms from '@/views/MyForms';
import Tab from '@/views/Tab';
import Text from '@/common/components/TextField';
import { log } from '@/common/LogHelper';
import Style from '@/common/Style';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
import SubmitButton from '@/common/components/SubmitButton';

const { RNManager, RNKeychainManager } = NativeModules;
const secureHide = 'eye_off';
const secureShow = 'eye_on';
const KeyboardAvoiding = device.isIos ? View : KeyboardAvoidingView;
const customizedCompanyHelper = new CustomizedCompanyHelper();

export default class ChangePassword extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      passwordOld: '',
      passwordNew: '',
      passwordNewTwice: '',
      showSecureImage: false,
      secureImage: secureHide,
      behavior: null,

      showModalTextInput: false,
      reason: '',
    };
  }

  componentWillMount() {
    UmengAnalysis.onPageBegin('ChangePassword');
    if (!device.isIos) {
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.setState({ behavior: 'height' }));
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this.setState({ behavior: null }));
    }
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
    UmengAnalysis.onPageEnd('ChangePassword')
    ABORT('AbortRequestCheckQRLogin');
     if (!device.isIos) {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }
  }

  clearReason() {
    this.setState({
      reason: '',
    });
  }

  goLoginRequest() {
    const { staffId } = this.props;
    const { passwordNew } = this.state;
    setUserLoginRequest(staffId, passwordNew).then(responseData => {
      if (!this.mounted) return;

      this.onActionAfterLogin(responseData);
    }).catch(message => {
      showMessage(messageType.error, message);
      RNManager.hideLoading();
    });
  }

  onActionAfterLogin(responseData) {
    const { staffId } = this.props;
    Consts.sessionId = responseData.SessionId;
    global.loginResponseData = responseData;
    if (!responseData.IsValid) {
      if (responseData.NeedReason === 'N') {
        this.setState({ showModalTextInput: false });
      } else {
        this.setState({ showModalTextInput: true });
      }

      // 记录设备信息变更日志
      RNKeychainManager.getDeviceId(deviceId => {
        const simId = deviceId;
        const phoneModel = device.mobileName;
        const phoneSystemVersion = device.mobileOS;
        const deviceName = device.deviceName;
        const logInfo = `${simId}-${phoneModel}-${phoneSystemVersion}-${deviceName},手机变更提示`;
        log(logInfo, staffId);
      });

      this.modal.open();
      RNManager.hideLoading();
      return;
    }

    this.saveUserInfoLocal(responseData);
    RNManager.hideLoading();
    RNManager.resumePush();

    const isNeedResetAutoLogin = realm.objects('Config').filtered('name="isNeedResetAutoLogin"');
    if (isNeedResetAutoLogin.length != 0) {
      if (isNeedResetAutoLogin[0].value) {
        realm.write(() => {
          const autoLogin = realm.objects('Config').filtered('name="autoLogin"');
          const isNeedResetAutoLogin = realm.objects('Config').filtered('name="isNeedResetAutoLogin"');
          if (autoLogin.length == 0) {
            realm.create('Config', { name: 'autoLogin', enabled: true });
          } else {
            autoLogin[0].enabled = true;
          }
          if (isNeedResetAutoLogin.length == 0) {
            realm.create('Config', { name: 'isNeedResetAutoLogin', enabled: false });
          } else {
            isNeedResetAutoLogin[0].value = false;
          }
        });
      }
    }

    if (this.props.passProps) {
      if (this.props.passProps.loginPageFrom == Consts.loginPageFromResetGesturePwd) {
        realm.write(() => {
          const storageDrawUnlockTimes = realm.objects('Config').filtered('name="storageDrawUnlockTimes"');
          if (storageDrawUnlockTimes.length == 0) {
            realm.create('Config', { name: 'storageDrawUnlockTimes', value: '0' });
          } else {
            storageDrawUnlockTimes[0].value = '0';
          }
        });

        const resetParams = {};
        resetParams.sessionId = responseData.SessionId;
        resetParams.newGesturePwd = '';
        POST(setUserGesturePassword(), resetParams, (respData) => {
          this.props.navigator.push({
            component: Tab,
            passProps: {
              loginData: responseData,
            },
            gestureDisabled: true,
          });
        }, (message) => {
        });
      }
    } else if (device.isIos) {
      RNManager.getEntranceType(info => {
        if (info == 'gaia_clock') {
          this.goMobileCheckIn();
        } else if (info == 'gaia_request') {
          this.goMyRequest();
        } else {
          this.goTab(responseData);
        }
      });
    } else {
      this.goTab(responseData);
    }
  }

  saveUserInfoLocal(responseData) {
    const { staffId } = this.props;
    const password = this.state.passwordNew;

    realm.write(() => {
      const info = realm.objects('User').filtered(`name="${staffId}"`);
      if (info.length == 0) {
        realm.create('User', { user_id: responseData.UserID, name: staffId, password: password, emp_id: responseData.EmpID });
      } else {
        const userInfo = realm.objects('User');
        for (let i = 0; i < userInfo; i++) {
          userInfo[i].password = '';
        }
        info[0].password = password;
        info[0].emp_name = responseData.EmpName;
        info[0].english_name = responseData.EnglishName;
        info[0].head_url = responseData.HeadImgUrl;
      }
    });
  }

  submitSIMChange() {
    const { showModalTextInput, reason } = this.state;
    if (showModalTextInput && !reason) {
      showMessage(messageType.error, I18n.t('mobile.module.login.reasonhint'));
      return;
    }
    InteractionManager.runAfterInteractions(() => {
      RNManager.RegistrationId(registId => {
        getCurrentLanguage().then(dataLan => {
          RNKeychainManager.getDeviceId(deviceId => {
            const params = {};
            params.companyCode = customizedCompanyHelper.getCompanyCode();
            params.personId = global.loginResponseData.PersonID;
            params.simId = deviceId;
            params.mobileId = deviceId;
            params.phoneModel = device.mobileName;
            params.phoneSysVersion = device.mobileOS;
            params.language = dataLan;
            params.registrationId = registId;

            if (showModalTextInput) {
              params.changeReason = reason;
            }

            POST(submitSIMChange(), params, (responseData) => {
              showMessage(messageType.success, I18n.t('mobile.module.login.changesuccess'));
              RNManager.hideLoading();
              this.modal.close();
              this.clearReason();
              this.props.navigator.pop();
            }, (message) => {
              RNManager.hideLoading();
              showMessage(messageType.error, message);
            });
          });
        });
      });
    });
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

  goTab(responseData) {
    this.props.navigator.push({
      component: Tab,
      passProps: {
        loginData: responseData,
      },
      gestureDisabled: true,
    });
  }

  onButtonChangeSecure() {
    const { showSecureImage } = this.state;
    this.setState({
      secureImage: !showSecureImage ? secureShow : secureHide,
      showSecureImage: !showSecureImage,
    });
  }

  onButtonPress() {
    const { passwordOld, passwordNew, passwordNewTwice } = this.state;
    if (!passwordOld) {
      showMessage(messageType.error, I18n.t('mobile.module.login.pwidemptyold'));
      return;
    } else if (!passwordNew) {
      showMessage(messageType.error, I18n.t('mobile.module.login.pwidemptynew'));
      return;
    } else if (!passwordNewTwice) {
      showMessage(messageType.error, I18n.t('mobile.module.login.pwidemptynewagain'));
      return;
    } else if (passwordNew != passwordNewTwice) {
      showMessage(messageType.error, I18n.t('mobile.module.mine.password.twiceerror'));
      return;
    } else if (passwordOld == passwordNew) {
      showMessage(messageType.error, I18n.t('mobile.module.login.oldnewpwd'));
      return;
    }

    RNManager.showLoading('');
    const companyInfo = realm.objects('Company');
    const userArr = realm.objects('User');
    let userInfo = userArr[userArr.length - 1];
    for (let i = 0; i < userArr.length; i++) {
      if (userArr[i].password.length != 0) {
        userInfo = userArr[i];
      }
    }
    Promise.all([encrypt(passwordOld), encrypt(passwordNew), getCurrentLanguage()]).then(data => {
      const params = {};
      params.LoginName = this.props.atFirstLogin ? this.props.staffId : userInfo.name.replace(/\#KENG#/g, '\\');
      params.OldPwd = data[0];
      params.NewPwd = data[1];
      params.Language = data[2];
      params.CompanyCode = companyInfo[0].code;
      if (sessionId && !global.loginResponseData.PlatForm) {
        params.SessionID = sessionId;
      }
      POST(getNewSetUserPassword(), params, (responseData) => {
        RNManager.hideLoading();
        if (this.props.atFirstLogin) {
          this.goLoginRequest();
          showMessage(messageType.success, I18n.t('mobile.module.login.updatepwdsuccess'));
          return;
        }
        if (responseData == '') {
          realm.write(() => {
            const userInfo = realm.objects('User');
            let userEffective;
            for (let i = 0; i < userInfo.length; i++) {
              if (userInfo[i].password != 0) {
                userEffective = userInfo[i];
              }
              userInfo[i].password = '';
            }
            username = '';
            position = '';
            actor = '';
            this.props.navigator.resetTo({
              userName: userEffective.name,
              component: Login,
            });
            RNManager.stopJPushService();
          });
          showMessage(messageType.success, I18n.t('mobile.module.login.updatepwdsuccess'));
        }
      }, (err) => {
        RNManager.hideLoading();
        showMessage(messageType.error, err);
      });
    });
  }

  renderModalView() {
    let modalTextInput = null;
    const { showModalTextInput } = this.state;
    if (showModalTextInput) {
      modalTextInput = (
        <Input
          style={styles.modalInput}
          multiline
          onChangeText={(text) => this.setState({ reason: text })}
          placeholder={I18n.t('mobile.module.login.reasonhint')}
        />
      );
    }

    return (
      <Modal
        ref={modal => this.modal = modal}
        swipeToClose={false}
        animationDuration={0}
        style={styles.modalView}
      >
        <View style={styles.modalInnerView}>
          <Image source={{ uri: 'abnormal_sim' }} style={styles.modalImage} />
          <Text allowFontScaling={false} style={[styles.modalSubTitle, { marginTop: 24 }]}>{I18n.t('mobile.module.login.submitchange')}</Text>
          {modalTextInput}
          <View style={styles.modalButtonView}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => this.submitSIMChange()}
            >
              <Text allowFontScaling={false} style={styles.modalButtonText}>{I18n.t('mobile.module.login.codesubmit')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: Style.color.white }]}
              onPress={() => {this.modal.close(); this.clearReason();}}
            >
              <Text allowFontScaling={false} style={[styles.modalButtonText, { color: '#CCC', fontSize: 16 }]}>{I18n.t('mobile.module.login.optionno')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    const { secureImage, showSecureImage } = this.state;

    return (
      <View style={styles.container}>
        <NavBar
          title={I18n.t('mobile.module.login.changpwd')}
          onPressLeftButton={() => { Keyboard.dismiss(); this.props.navigator.pop(); }} />

        <KeyboardAvoiding behavior={this.state.behavior} style={{ flex: 1 }}>
        <ScrollView behavior={this.state.behavior} style={{ flexGrow: 1 }}>
          <Text style={styles.textOld}>{I18n.t('mobile.module.mine.password.oldpwd')}</Text>
          <Line style={{ marginTop: 5 }} />
          <View style={styles.viewWrapper}>
            <Input
              style={styles.inputPasswordOld}
              placeholder={I18n.t('mobile.module.mine.password.oldpwdholder')}
              onChangeText={(text) => this.setState({ passwordOld: text })}
              clearButtonMode="never"
              keyboardType="numbers-and-punctuation" />
          </View>
          <Line />

          <Text style={styles.textOld}>{I18n.t('mobile.module.login.changpwd')}</Text>
          <Line style={{ marginTop: 5 }} />
          <View style={styles.viewWrapper}>
            <View style={{ flexGrow: 1, flexDirection: 'row' }}>
              <Input
                style={styles.inputPasswordOld}
                secureTextEntry={!showSecureImage}
                placeholder={I18n.t('mobile.module.login.newpwdhint')}
                onChangeText={(text) => this.setState({ passwordNew: text })}
                clearButtonMode="never"
                keyboardType="numbers-and-punctuation" />
              <TouchableHighlight style={styles.secureImageTouch} onPress={() => this.onButtonChangeSecure()} >
                <View style={{ flexGrow: 1 }}>
                  <Image style={styles.secureImage} source={{ uri: secureImage }} />
                </View>
              </TouchableHighlight>
            </View>
          </View>
          <Line style={{ marginLeft: 18 }} />
          <View style={styles.viewWrapper}>
            <Input
              style={styles.inputPasswordOld}
              secureTextEntry={!showSecureImage}
              placeholder={I18n.t('mobile.module.login.confimpwdhint')}
              onChangeText={(text) => this.setState({ passwordNewTwice: text })}
              clearButtonMode="never"
              keyboardType="numbers-and-punctuation" />
          </View>

          <View style={{ width: device.width, height: 82, backgroundColor: 'transparent'}} />
          <SubmitButton
            customStyle={{ width: device.width - 32, marginLeft: 16, borderRadius: 4 }}
            title={I18n.t('mobile.module.language.done')}
            onPressBtn={() => { this.onButtonPress(); }} />
        </ScrollView>
        </KeyboardAvoiding>
        {this.renderModalView()}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
  },
  textOld: {
    marginTop: 10,
    fontSize: 13,
    color: '$color.mainBodyTextColor',
    marginLeft: 19,
  },
  viewWrapper: {
    width: device.width,
    height: 48,
    backgroundColor: 'white',
  },
  inputPasswordOld: {
    marginLeft: 18,
    width: device.width - 36 - 18 - 18,
    backgroundColor: '#FFF',
  },
  secureImageTouch: {
    marginRight: 18,
    width: 18,
    height: 18,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  secureImage: {
    width: 18,
    height: 18,
    alignSelf: 'center',
    justifyContent: 'center',
  },

  // modal view style
  modalView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 38,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalInnerView: {
    borderRadius: 4,
    backgroundColor: '$color.white',
    paddingHorizontal: 15,
  },
  modalImage: {
    width: 50,
    height: 50,
    marginTop: 24,
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: 21,
    color: '#333',
    alignSelf: 'center',
    marginTop: 33,
  },
  modalSubTitle: {
    fontSize: 16,
    color: '#999',
    marginTop: 33,
    alignSelf: 'center',
    textAlign: 'center',
  },
  modalInput: {
    flexGrow: 1,
    paddingLeft: 5,
    paddingTop: 5,
    height: 100,
    marginTop: 33,
    marginLeft: 16,
    '@media ios': {
      paddingVertical: 5,
    },
    borderWidth: device.hairlineWidth,
    borderColor: '$color.line',
  },
  modalButtonView: {
    height: 88,
    marginTop: 33,
  },
  modalButton: {
    height: 44,
    borderRadius: 4,
    justifyContent: 'center',
    backgroundColor: '$color.mainColorLight',
  },
  modalButtonText: {
    textAlign: 'center',
    fontSize: 17,
    color: '$color.white',
  },
});