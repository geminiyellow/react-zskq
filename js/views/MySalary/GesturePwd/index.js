import {
  StyleSheet,
} from 'react-native';
import React, { Component } from 'react';

import GesturePwdCom from './GesturePwdCom';
import GesturePwdFootCom from './GesturePwdFootCom';
import Consts, { gesturePwdOperation } from '@/common/Consts';
import ModalWithImage from '@/common/components/modal/ModalWithImage';
import I18n from 'react-native-i18n';
import Login from '@/views/Login';
import { keys, device } from '@/common/Util';
import { POST } from '@/common/Request';
import { setUserGesturePassword } from '@/common/api';
import realm from '@/realm';
import LinearGradient from 'react-native-linear-gradient';

let isResetModalOpen = false;
let isMaxTimesModalOpen = false;

export default class GesturePwd extends Component {
  constructor(props) {
    super(props);
    this.passGesturePwd = this.props.passProps ? this.props.passProps.passGesturePwd : this.props.passGesturePwd;
    this.state = {
      pwdState: this.props.passGesturePwd,
    };
  }

  /** life cycle */

  componentDidMount() {
    Consts.gesturePwdSelectedOperation = gesturePwdOperation.unlock;
  }

  deviceBackBtnClicked() {
    if (isResetModalOpen) {
      this.resetModal.close();
      isResetModalOpen = false;
    } else if (!isMaxTimesModalOpen) {
      this.props.navigator.pop();
    }
    if (isMaxTimesModalOpen) {
      this.resetGesturePwd();
      this.resetRouteToLogin();
      return true;
    }
  }

  /** response event */

  updateGesturePwdCB =() => {
    Consts.gesturePwdSelectedOperation = gesturePwdOperation.updateOrigin;
    this.pwdCom.updateOperation();
    this.setState({
      pwdState: '',
    });
  }

  topResetBtnPressed() {
    this.resetGesturePwd();
    this.resetGlobalDrawTimes();
    this.resetRouteToLogin();
  }

  /** private methods */

  resetGesturePwd() {
    realm.write(() => {
      const userArr = realm.objects('User');
      for (let i = 0; i < userArr.length; i ++) {
        userArr[i].password = '';
      }
    });

    const resetParams = {};
    resetParams.sessionId = global.loginResponseData.SessionId;
    resetParams.newGesturePwd = '';
    POST(setUserGesturePassword(), resetParams, (respData) => {
    }, (message) => {
    });
  }

  resetGlobalDrawTimes() {
    realm.write(() => {
      const temp = realm.objects('Config').filtered('name="storageDrawUnlockTimes"');
      temp[0].value = '0';
    });
  }

  resetRouteToLogin() {
    this.props.navigator.resetTo({
      component: Login,
      passProps: {
        loginPageFrom: Consts.loginPageFromResetGesturePwd,
      },
    });
  }

  /** render view */

  renderFootOperation() {
    if (this.state.pwdState != '') {
      return (
        <GesturePwdFootCom
          updateGesturePwdCB={this.updateGesturePwdCB}
          openParentLoginModal={() => {
            this.resetModal.open();
            isResetModalOpen = true;
          }} />
      );
    }
    return null;
  }

  render() {
    return (
      <LinearGradient colors={['#1fd662', '#00c7e2']} style={styles.backgroundGradient}>
        <GesturePwdCom
          ref={pwd => this.pwdCom = pwd}
          navigator={this.props.navigator}
          passGesturePwd={this.passGesturePwd}
          openParentLoginModal={() => {
            this.maxTimesModal.open();
            isMaxTimesModalOpen = true;
          }} />

        {this.renderFootOperation()}

        <ModalWithImage
          ref={resetModal => this.resetModal = resetModal}
          title={I18n.t('mobile.module.salary.gesturepwdloseeffect')}
          subTitle={I18n.t('mobile.module.salary.gesturepwdloseeffectdesc')}
          topButtonTitle={I18n.t('mobile.module.salary.gesturepwdloseeffectbtntxt')}
          topButtonPress={() => { this.topResetBtnPressed(); }}
          bottomButtonTitle={I18n.t('mobile.module.salary.cancelresetpwd')}
          bottomButtonPress={() => {
            this.resetModal.close();
            isResetModalOpen = false;
          }}
          swipeToClose={false}
        />

        <ModalWithImage
          ref={maxTimesModal => this.maxTimesModal = maxTimesModal}
          title={I18n.t('mobile.module.salary.gesturepwdloseeffect')}
          subTitle={I18n.t('mobile.module.salary.gesturepwdloseeffectdesc')}
          topButtonTitle={I18n.t('mobile.module.salary.gesturepwdloseeffectbtntxt')}
          topButtonPress={() => { this.topResetBtnPressed(); }}
          swipeToClose={false}
        />
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  backgroundGradient: {
    flexGrow: 1,
    width: device.width,
    height: device.height,
  },
});