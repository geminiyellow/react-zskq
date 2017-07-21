import React, { Component } from 'react';
import {
  Text,
  View,
  NativeModules,
} from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';

import OthersButton from '@/common/components/OthersButton';
import Line from '@/common/components/Line';
import Input from '@/common/components/Input';
import NavBar from '@/common/components/NavBar';
import { GET, POST } from '@/common/Request';
import { checkMobileInfoIsMatched, setUserPassword } from '@/common/api';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import { getCurrentLanguage, encrypt } from '@/common/Functions';
import { device } from '@/common/Util';

const { RNManager, RNKeychainManager } = NativeModules;

export default class ForgetPwd extends Component {
  mixins: [React.addons.PureRenderMixin]

  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      newPwd: '',
      confirmPwd: '',
    };
  }

  onButtonPress() {
    const { userName, newPwd, confirmPwd } = this.state;
    if (!userName) {
      showMessage(messageType.error, I18n.t('mobile.module.login.usernamehint'));
      return;
    }

    if (!newPwd) {
      showMessage(messageType.error, I18n.t('mobile.module.login.newpwdhint'));
      return;
    }

    if (!confirmPwd) {
      showMessage(messageType.error, I18n.t('mobile.module.login.confimpwdhint'));
      return;
    }

    if (newPwd != confirmPwd) {
      showMessage(messageType.error, I18n.t('mobile.module.login.inconsistentpwd'));
      return;
    }

    RNManager.showLoading('');
    getCurrentLanguage().then(data => {
      this.language = data;
      RNKeychainManager.getDeviceId(deviceId => {
        const params = {};
        encrypt(userName).then(base64UserName => {
          encrypt(newPwd).then(base64Password => {
            params.loginName = base64UserName;
            params.simId = deviceId;
            params.mobileId = deviceId;
            params.language = data;
            params.passWord = base64Password;
            GET(checkMobileInfoIsMatched(params), () => {
              POST(setUserPassword(), params, () => {
                RNManager.hideLoading();
                this.props.navigator.pop();
                showMessage(messageType.success, I18n.t('mobile.module.login.updatepwdsuccess'));
              }, (message) => {
                showMessage(messageType.error, JSON.stringify(message));
              });
            }, (message) => {
              RNManager.hideLoading();
              showMessage(messageType.error, JSON.stringify(message));
            });
          });
        });
      });
    });
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <NavBar
          title={I18n.t('mobile.module.login.changpwd')}
          onPressLeftButton={() => this.props.navigator.pop()}
        />

        <View style={styles.container}>
          <Text allowFontScaling={false} style={styles.textTitle}>{I18n.t('mobile.module.login.usernametitle')}</Text>
          <View style={{ flexGrow: 1 }}>
            <Line />
            <View style={styles.inputViewWrapper}>
              <Text allowFontScaling={false} numberOfLines={1} style={styles.text}>{I18n.t('mobile.module.login.username')}</Text>
              <Input
                style={styles.textInput}
                onChangeText={(text) => this.setState({ userName: text })}
                placeholder={I18n.t('mobile.module.login.usernamehint')}
              />
            </View>
            <Line />
          </View>
          <Text allowFontScaling={false} style={styles.textTitle}>{I18n.t('mobile.module.login.updatepwd')}</Text>

          <View style={{ flexGrow: 1 }}>
            <Line />
            <View style={styles.inputViewWrapper}>
              <Text allowFontScaling={false} numberOfLines={1} style={styles.text}>{I18n.t('mobile.module.login.newpwd')}</Text>
              <Input
                style={styles.textInput}
                placeholder={I18n.t('mobile.module.login.newpwdhint')}
                secureTextEntry
                onChangeText={(text) => this.setState({ newPwd: text })}
              />
            </View>
          </View>

          <View style={{ backgroundColor: '#ffffff' }}>
            <Line style={{ marginLeft: 18, backgroundColor: '#EBEBEB' }} />
          </View>

          <View style={{ flexGrow: 1 }}>
            <View style={styles.inputViewWrapper}>
              <Text allowFontScaling={false} numberOfLines={1} style={styles.text}>{I18n.t('mobile.module.login.confirmpwd')}</Text>
              <Input
                style={styles.textInput}
                placeholder={I18n.t('mobile.module.login.confimpwdhint')}
                secureTextEntry
                onChangeText={(text) => this.setState({ confirmPwd: text })}
              />
            </View>
            <Line />
          </View>

          <OthersButton
            title={I18n.t('mobile.module.login.forgetpwdsubmit')}
            onPressBtn={() => { this.onButtonPress(); }}
          />
        </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  wrapper: {
    flexGrow: 1,
    backgroundColor: '$color.containerBackground',
  },
  container: {
    backgroundColor: '$color.containerBackground',
  },
  inputViewWrapper: {
    paddingLeft: 18,
    backgroundColor: '$color.white',
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
  },
  textInput: {
    marginLeft: 10,
    width: device.width - 108 - 18,
  },
  text: {
    fontSize: 16,
    color: '#333',
    width: 80,
  },
  textTitle: {
    color: '$color.mainBodyTextColor',
    marginLeft: 18,
    marginBottom: 6,
    marginTop: 10,
    fontSize: 11,
  },
});