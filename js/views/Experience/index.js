/** 快速体验 */
import React, { Component } from 'react';
import { NativeModules, ScrollView, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import OthersButton from '@/common/components/OthersButton';
import { showMessage } from '@/common/Message';
import { keys } from '@/common/Util';
import { messageType } from '@/common/Consts';
import NavBar from '@/common/components/NavBar';
import { getSMSCode, validateSMSCode, submitExperienceUserInfo } from '@/common/api';
import { GET, ABORT } from '@/common/Request';
import { setUserLoginRequest, setCompanyCodeMobileRequest } from '@/common/components/Login/LoginRequest';
import Tab from '@/views/Tab';
import Message from './Message';
import TextInput from './TextInput';
import { clearIntervalTimer, isValidEmail, isValidPhoneNumber } from './Function';
const { RNManager } = NativeModules;
const demoCompanyCode = 'trial';

export default class Experience extends Component {

  state = {
    buttonDisabled: true,
    name: '',
    phoneNumber: '',
    companyName: '',
    authCode: '',
    mail: '',
    authCodeButtonTitle: null,
  };

  /** life cycle */

  componentWillUnmount() {
    clearIntervalTimer(this.timeoutId);
    ABORT('getSMSCode');
    ABORT('submitExperienceUserInfo');
  }

  /** callback */

  onChangeNameText(text) {
    this.setState({ name: text });
  }

  onChangeCompanyText(text) {
    this.setState({ companyName: text });
  }

  onChangePhoneNumberInputText(text) {
    let value = text;
    if (text.length > 11) {
      value = text.substr(0, 11);
    }
    if (text.length >= 11) {
      this.buttonDisabled = false;
      this.setState({
        buttonDisabled: this.buttonDisabled,
        phoneNumber: value,
      });
    } else {
      this.buttonDisabled = true;
      this.setState({
        buttonDisabled: this.buttonDisabled,
        phoneNumber: value,
      });
    }
  }

  onChangeAuthCodeText(text) {
    this.setState({ authCode: text });
  }

  onChangeMailText(text) {
    this.setState({ mail: text });
  }

  /** event response */

  onPressSMSCodeButton() {
    const { phoneNumber } = this.state;
    if (!isValidPhoneNumber(phoneNumber)) {
      showMessage(messageType.error, I18n.t('mobile.module.quickexperience.phonenumbererror'));
      return;
    }

    if (!this.buttonDisabled) {
      clearIntervalTimer(this.timeoutId);
      this.setState({ buttonDisabled: this.buttonDisabled });
    } else {
      return;
    }

    let count = 60;
    this.timeoutId = setInterval(() => {
      if (count <= 0) {
        clearIntervalTimer(this.timeoutId);
        this.buttonDisabled = false;
        this.setState({
          buttonDisabled: this.buttonDisabled,
          authCodeButtonTitle: null,
        });
      } else {
        this.buttonDisabled = true;
        count--;
        this.setState({
          authCodeButtonTitle: `${count}s${I18n.t('mobile.module.quickexperience.countdow')}`,
          buttonDisabled: this.buttonDisabled,
        });
      }
    }, 1000);

    const params = {};
    params.mobileNum = phoneNumber;
    params.templateId = '5';
    GET(getSMSCode(params), (data) => {
      if (data && data.sessionId) {
        this.sessionId = data.sessionId;
      }
    }, (errorMessage) => {
      showMessage(messageType.error, errorMessage);
      clearIntervalTimer(this.timeoutId);
      this.buttonDisabled = false;
      this.setState({
        buttonDisabled: this.buttonDisabled,
        authCodeButtonTitle: null,
      });
    }, 'getSMSCode');
  }

  onPressSubmitButton() {
    const { name, phoneNumber, companyName, authCode, mail } = this.state;
    if (!name) {
      showMessage(messageType.error, I18n.t('mobile.module.quickexperience.namenull'));
      return;
    }
    if (!companyName) {
      showMessage(messageType.error, I18n.t('mobile.module.quickexperience.companynull'));
      return;
    }
    if (!mail) {
      showMessage(messageType.error, I18n.t('mobile.module.quickexperience.mailnull'));
      return;
    }
    if (!isValidEmail(mail)) {
      showMessage(messageType.error, I18n.t('mobile.module.quickexperience.mailerror'));
      return;
    }
    if (!phoneNumber) {
      showMessage(messageType.error, I18n.t('mobile.module.quickexperience.phonenumbernull'));
      return;
    }
    if (!isValidPhoneNumber(phoneNumber)) {
      showMessage(messageType.error, I18n.t('mobile.module.quickexperience.phonenumbererror'));
      return;
    }

    if (!authCode) {
      showMessage(messageType.error, I18n.t('mobile.module.quickexperience.authcodplaceholder'));
      return;
    }

    // 验证短信验证码
    const validateParams = {};
    validateParams.sessionId = this.sessionId;
    validateParams.smsCode = authCode;
    RNManager.showLoading('正在提交');
    GET(validateSMSCode(validateParams), (data) => {
      if (data && data.success) {
        // 提交体验用户信息
        const submitParams = {};
        submitParams.name = name;
        submitParams.companyName = companyName;
        submitParams.phoneNumber = phoneNumber;
        submitParams.email = mail;
        GET(submitExperienceUserInfo(submitParams), (responseData) => {
          if (responseData && responseData.Account && responseData.Pwd) {
            // 获取测试用户的服务器地址
            setCompanyCodeMobileRequest(demoCompanyCode).then(
              (codeData) => {
                // 调用登录接口
                setUserLoginRequest(responseData.Account, responseData.Pwd).then(successData => {
                  RNManager.hideLoading();
                  this.props.navigator.push({
                    component: Tab,
                    gestureDisabled: true,
                  });
                }).catch(message => {
                  this.showErrorMessage(JSON.stringify(message));
                });
              }, (errorMessage) => {
                this.showErrorMessage(errorMessage);
              });
          }
        }, (errorMessage) => {
          this.showErrorMessage(errorMessage);
        }, 'submitExperienceUserInfo');
      }
    }, (errorMessage) => {
      this.showErrorMessage('验证码错误');
    }, 'validateSMSCode');
  }

  /** private methods */

  showErrorMessage(errorMessage) {
    RNManager.hideLoading();
    showMessage(messageType.error, errorMessage);
  }

  /** render methods */

  render() {
    const { buttonDisabled, name, companyName, phoneNumber, authCode, mail, authCodeButtonTitle } = this.state;
    const { navigator } = this.props;
    return (
      <View style={styles.wrapper}>
        <NavBar title={I18n.t('mobile.module.quickexperience.navbartitle')} onPressLeftButton={() => navigator.pop()} />
        <ScrollView style={styles.container} bounces={false}>
          <TextInput
            value={name}
            placeholder={I18n.t('mobile.module.quickexperience.nameplaceholder')}
            onChangeText={(text) => this.onChangeNameText(text)}
          />
          <TextInput
            style={styles.margin}
            value={companyName}
            placeholder={I18n.t('mobile.module.quickexperience.companyplaceholder')}
            onChangeText={(text) => this.onChangeCompanyText(text)}
          />
          <TextInput
            style={styles.margin}
            value={mail}
            placeholder={I18n.t('mobile.module.quickexperience.mailplaceholder')}
            onChangeText={(text) => this.onChangeMailText(text)}
          />
          <TextInput
            value={phoneNumber}
            style={styles.margin}
            placeholder={I18n.t('mobile.module.quickexperience.phonenumberplaceholder')}
            keyboardType="numeric"
            onChangeText={(text) => this.onChangePhoneNumberInputText(text)}
          />
          <TextInput
            style={styles.margin}
            value={authCode}
            placeholder={I18n.t('mobile.module.quickexperience.authcodplaceholder')}
            keyboardType="numeric"
            buttonDisabled={buttonDisabled}
            showButton
            onChangeText={(text) => this.onChangeAuthCodeText(text)}
            onPress={() => this.onPressSMSCodeButton()}
            buttonTitle={authCodeButtonTitle}
          />
          <OthersButton
            title="提交"
            customStyle={styles.otherButton}
            onPressBtn={() => this.onPressSubmitButton()}
          />
        </ScrollView>

        <Message ref={ref => this.errorMessage = ref} />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 30,
  },
  margin: {
    marginTop: 8,
  },
  otherButton: {
    marginTop: 40,
  },
});