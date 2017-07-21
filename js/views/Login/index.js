import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  NativeModules,
  InteractionManager,
  KeyboardAvoidingView,
} from 'react-native';

import Modal from 'react-native-modalbox';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import SplashScreen from 'rn-splash-screen';
import { log, logWithDeviceInfo } from '@/common/LogHelper';
import Button from '@/common/components/Button';
import OthersButton from '@/common/components/OthersButton';
import Line from '@/common/components/Line';
import Input from '@/common/components/Input';
import Tab from '@/views/Tab';
import { device, keys } from '@/common/Util';
import { POST } from '@/common/Request';
import { submitSIMChange, setUserGesturePassword } from '@/common/api';
import Style from '@/common/Style';
import Consts, { appVersion, messageType } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import { getCurrentLanguage, checkPermissionOfModule } from '@/common/Functions';
import SmallHintView from '@/common/components/SmallHintView';
import MobileCheckIn from '@/views/MobileCheckIn';
import ScanQrCheckIn from '@/views/MobileCheckIn/ScanQrCheckIn';
import MyForms from '@/views/MyForms';
import Image from '@/common/components/CustomImage';
import { setCompanyCodeMobileRequest, setUserLoginRequest } from '@/common/components/Login/LoginRequest';
import realm from '@/realm';
import ForcedUpdateModal from '@/common/components/Login/ForcedUpdateModal';
import ChangePwd from '@/common/components/Login/ChangePwd';
import ChangePassowrd from '@/views/Mine/ChangePassword';
import { button } from '@/common/Style';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';

import React, { Component } from 'react';
import CompanyCode from '../CompanyCode';
import ForgetPwd from '../ForgetPwd';
import Head from './Head';

const { RNManager, RNKeychainManager } = NativeModules;
const customizedCompanyHelper = new CustomizedCompanyHelper();
const KeyboardAvoiding = device.isIos ? View : KeyboardAvoidingView;
const secureHide = 'eye_off';
const secureShow = 'eye_on';

export default class Login extends Component {
  mixins: [React.addons.PureRenderMixin]

  constructor(props) {
    super(props);
    this.state = {
      staffId: '',
      password: '',
      reason: '',
      showModalTextInput: false,
      headImgUrl: '',
      secureImageShow: false,
      behavior: null,
    };
    this.isPusing = false;
  }

  /** life cycle */

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      const userInfo = realm.objects('User');
      if (userInfo.length != 0) {
        let userEffective = [];
        for (let i = 0; i < userInfo.length; i++) {
          if (userInfo[i].password.length != 0) {
            userEffective = userInfo[i];
          }
        }
        if (userEffective.length == 0) {
          this.setState({
            staffId: this.props.userName,
            headImgUrl: '',
            password: '',
          });
        } else {
          this.setState({
            staffId: userEffective.name.replace(/\#KENG#/g, '\\'),
            headImgUrl: userEffective.head_url,
            password: (!this.props.params) ? '' : this.props.params.loginPwd,
          });
        }
      } else {
        RNKeychainManager.getUserInfo(info => {
          this.setState({
            staffId: info.userName,
            headImgUrl: '',
          });
        });
      }
    });
  }

  componentDidMount() {
    if (device.isIos) {
      RNManager.disableAutorotate();
    }
    InteractionManager.runAfterInteractions(() => {
      SplashScreen.hide();
    });
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  /** response event */

  onButtonPress() {
   
    if (this.isPusing) return;
    const { staffId, password } = this.state;
    if (!staffId) {
      showMessage(messageType.error, I18n.t('mobile.module.login.idisempty'));
      return;
    }

    if (!password) {
      showMessage(messageType.error, I18n.t('mobile.module.login.pwidempty'));
      return;
    }

    RNManager.showLoading('');
    this.isPusing = true;
    setCompanyCodeMobileRequest().then((imagerUrl) => {
      setUserLoginRequest(staffId, password).then(responseData => {
        if (!this.mounted) return;
        this.isPusing = false;
        if (responseData.IsPWDFirstChange == 1) {
          RNManager.hideLoading();
          this.modalBox.getStaffId(this.state.staffId);
          this.modalBox.open();
          return;
        }

        this.onActionAfterLogin(responseData);
      }).catch(message => {
        this.isPusing = false;
        showMessage(messageType.error, message);
        RNManager.hideLoading();
      });
    }).catch(err => {
      this.isPusing = false;
      showMessage(messageType.error, err);
      RNManager.hideLoading();
    });
  }

  onActionAfterLogin(responseData) {
    const { staffId } = this.state;
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

    // this.saveUserInfoLocal(responseData);
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
    const { staffId, password } = this.state;
    realm.write(() => {
      const staffIdT = staffId.replace(/\\/g, '#KENG#');
      const passwordT = password.replace(/\\/g, '#KENG#');
      const info = realm.objects('User').filtered(`name="${staffIdT}"`);
      if (info.length == 0) {
        realm.create('User', { user_id: responseData.UserID, name: staffIdT, password: passwordT, emp_id: responseData.EmpID });
      } else {
        const userInfo = realm.objects('User');
        for (let i = 0; i < userInfo; i++) {
          userInfo[i].password = '';
        }
        info[0].password = passwordT;
        info[0].emp_name = responseData.EmpName;
        info[0].english_name = responseData.EnglishName;
        info[0].head_url = responseData.HeadImgUrl;
      }
    });
  }

  clearReason() {
    this.setState({
      reason: '',
    });
  }

  /** 点击忘记密码，进入忘记密码页面 */
  onForgetPasswordPress() {
    this.props.navigator.push({
      component: ForgetPwd,
    });
  }

  /** 点击切换公司代码，进入录入公司代码页面 */
  onChangeCompanyCodePress() {
    this.props.navigator.push({
      component: CompanyCode,
      params: {
        loginPwd: this.state.password,
      },
      gestureDisabled: true,
    });
  }

  /** private methods */

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

  showSecureImage() {
    this.setState({
      secureImageShow: !this.state.secureImageShow,
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
            }, (message) => {
              RNManager.hideLoading();
              showMessage(messageType.error, message);
            });
          });
        });
      });
    });
  }

  /** render methods */
  renderForgetPassword() {
    if (global.companyResponseData && global.companyResponseData.config.showPwd) {
      return (
        <Button
          textStyle={styles.spaceBetweenText}
          containerStyle={styles.spaceBetweenBtn}
          text={I18n.t('mobile.module.login.forgetpw')}
          onPress={() => { this.onForgetPasswordPress(); }}
        />
      );
    }
    return (
      <Button
        textStyle={styles.spaceBetweenText}
        containerStyle={styles.spaceBetweenBtn}
        text=""
        onPress={() => { }}
      />
    );
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
    const { staffId, password } = this.state;
    const { navigator } = this.props;

    let secureImage = secureHide;
    let showImage = false;
    if (password) {
      showImage = true;
      if (this.state.secureImageShow) {
        secureImage = secureShow;
      }
    }

    return (
      <View style={styles.wrapper}>
        <KeyboardAvoiding behavior={this.state.behavior}>
          <ScrollView
            style={styles.container}
            bounces={false}
            behavior={this.state.behavior} >
            <Head userName={this.state.staffId} style={{ marginTop: 70 }} />
            <Input
              style={{
                flex: 1,
                marginLeft: 24,
                width: device.width - 48,
                height: 40,
                marginTop: 16
              }}
              value={staffId}
              onChangeText={(text) => this.setState({ staffId: text })}
              placeholder={I18n.t('mobile.module.login.idhint')}
            />
            <Line style={{ marginLeft: 24, width: device.width - 48 }} />

            <View style={styles.inputViewWrapper}>
              <Input
                style={{ height: 40, width: device.width - 88 }}
                value={password}
                secureTextEntry={!this.state.secureImageShow}
                onChangeText={(text) => this.setState({ password: text })}
                placeholder={I18n.t('mobile.module.login.pwhint')}
                clearButtonMode="never"
              />
              <TouchableOpacity onPress={() => this.showSecureImage()}>
                <View style={{ width: 40, height: 35, justifyContent: 'center' }}>
                  {showImage ? <Image style={styles.secureImage} source={{ uri: secureImage }} /> : null}
                </View>
              </TouchableOpacity>
            </View>
            <Line style={{ marginLeft: 24, width: device.width - 48 }} />
            <OthersButton
              customStyle={{ marginTop: 40 }}
              title={I18n.t('mobile.module.login.confirm')}
              backgroundColor={button.background.normal}
              activeBg={button.background.active}
              onPressBtn={() => { this.onButtonPress(); }}
            />
            <View style={styles.spaceBetweenView}>
              {this.renderForgetPassword()}
              <Button
                textStyle={styles.spaceBetweenText}
                containerStyle={styles.spaceBetweenBtn}
                text={I18n.t('mobile.module.login.changecode')}
                onPress={() => { this.onChangeCompanyCodePress(); }}
              />
            </View>
          </ScrollView>
        </KeyboardAvoiding>
        <View style={{ flex: 1 }} />
        <View style={{ marginBottom: 18 }}>
          <SmallHintView content={`${I18n.t('mobile.module.mine.aboutus.version')}:${appVersion}`} />
        </View>
        {this.renderModalView()}
        <ForcedUpdateModal />
        <ChangePwd
          ref={modal => this.modalBox = modal}
          navigator={navigator}
          username={this.state.staffId}
        />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '$color.white',
  },
  container: {
    backgroundColor: '$color.white',
  },
  inputViewWrapper: {
    paddingLeft: 24,
    paddingRight: 24,
    backgroundColor: '$color.white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  modalView: {
    flex: 1,
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
    marginLeft: 16,
    marginTop: 33,
    marginBottom: 2,
    textAlignVertical: 'top',
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
  spaceBetweenView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  spaceBetweenBtn: {
    backgroundColor: '$color.white',
    height: 20,
    marginHorizontal: 0,
  },
  spaceBetweenText: {
    fontSize: 14,
    color: '#999',
    backgroundColor: '$color.white',
  },
  secureImage: {
    marginLeft: -1.5,
    width: 18,
    height: 18,
    justifyContent: 'center',
  },
});