import {
  View,
} from 'react-native';
import React, { Component } from 'react';

import I18n from 'react-native-i18n';
import PasswordGesture from '@/common/components/GesturePassword';
import Consts, { gesturePwdOperation, messageType, pageOptions } from '@/common/Consts';
import NavBar from '@/common/components/NavBar';
import { showMessage } from '@/common/Message';
import { encrypt } from '@/common/Functions';
import { POST } from '@/common/Request';
import { setUserGesturePassword } from '@/common/api';
import { keys } from '@/common/Util';
import realm from '@/realm';

import Salary from '../Salary';
import GesturePwdHeadCom from './GesturePwdHeadCom';

const leftBack = 'back_white';

export default class GesturePwdCom extends Component {
  constructor(props) {
    super(props);
    this.gesturePwd = this.props.passGesturePwd;
    this.state = {
      message: this.gesturePwd === '' ? I18n.t('mobile.module.salary.setnewgesturepwd') : I18n.t('mobile.module.salary.usepwdtounlock'),
      status: 'normal',
      pwdState: this.props.passGesturePwd,
      navBarTitle: this.gesturePwd === '' ? I18n.t('mobile.module.salary.setnewgesturepwd') : I18n.t('mobile.module.salary.title'),
    };
    this.drawUpdateTimes = 0;
    this.drawFirst = null;
    this.drawSecond = null;
    this.drawOriginalTimes = 0;
  }

  componentDidMount() {
    const configDrawTimes = realm.objects('Config').filtered('name="storageDrawUnlockTimes"');
    if (configDrawTimes.length == 0) {
      realm.write(() => {
        realm.create('Config', { name: 'storageDrawUnlockTimes', value: '0'});
      });
    }
  }

  onEnd(password) {
    if (password.length < 4) {
      this.setState({
        status: 'wrong',
        message: I18n.t('mobile.module.salary.numbers'),
      });
      this.drawUpdateTimes = 0;
      return;
    }
    if (this.gesturePwd == '') {
      if (password.length < 4) {
        this.setState({
          status: 'wrong',
          message: I18n.t('mobile.module.salary.numbers'),
        });
        this.drawUpdateTimes = 0;
        return;
      }
      this.drawOriginalTimes += 1;
      if (this.drawOriginalTimes == 1) {
        this.drawFirst = password;
        this.setState({
          status: 'normal',
          message: I18n.t('mobile.module.salary.drawgesturepwdagain'),
        });
      }
      if (this.drawOriginalTimes == 2) {
        this.drawSecond = password;
        if (this.drawFirst == this.drawSecond) {
          this.setState({
            status: 'normal',
            message: I18n.t('mobile.module.salary.matchgesturepwd'),
          });

          this.saveGesturePwd(password);
        } else {
          this.setState({
            status: 'wrong',
            message: I18n.t('mobile.module.salary.mismatchgesturepwd'),
            navBarTitle: I18n.t('mobile.module.salary.unlock'),
          });
        }
        this.drawOriginalTimes = 1;
      }
      return;
    }

    if (Consts.gesturePwdSelectedOperation == gesturePwdOperation.unlock) {
        const configDrawTimes = realm.objects('Config').filtered('name="storageDrawUnlockTimes"');
        encrypt(password).then(base64Pwd => {
          if (base64Pwd == this.gesturePwd && parseInt(configDrawTimes[0].value) < Consts.gesturePwdDrawMaxTimes) {
            this.setState({
              status: 'right',
              message: I18n.t('mobile.module.salary.rightgesturepwd'),
            });
            
            realm.write(() => {
              const temp = realm.objects('Config').filtered('name="storageDrawUnlockTimes"');
              temp[0].value = "0";
            });
          
            Consts.currentPage = pageOptions.salary;
            this.props.navigator.push({
              component: Salary,
              gestureDisabled: true,
            });
            return;
          } else {
            const drawUnlockTimes = parseInt(configDrawTimes[0].value) <= Consts.gesturePwdDrawMaxTimes ? parseInt(configDrawTimes[0].value) + 1 : parseInt(configDrawTimes[0].value);
            realm.write(() => {
              const temp = realm.objects('Config').filtered('name="storageDrawUnlockTimes"');
              temp[0].value = `${drawUnlockTimes}`;
            });
            if (parseInt(configDrawTimes[0].value) >= Consts.gesturePwdDrawMaxTimes) {
              this.setState({
                status: 'wrong',
                message: I18n.t('mobile.module.salary.maxtimesalert'),
              });
              const configAutoLogin = realm.objects('Config').filtered('name="autoLogin"');
              if (configAutoLogin.length != 0 && configAutoLogin[0].enable) {
                realm.write(() => {
                  const temp = realm.objects('Config').filtered('name="isNeedResetAutoLogin"');
                  temp[0].enable = true;
                });
              } else {
                realm.write(() => {
                  realm.create('Config', { name: 'isNeedResetAutoLogin', enable: true });
                });
              }
              this.resetGesturePwd();
              this.resetGlobalDrawTimes();
              this.props.openParentLoginModal();
              return;
            }
            const remainTimes = Consts.gesturePwdDrawMaxTimes - drawUnlockTimes;
            this.setState({
              status: 'wrong',
              message: `${I18n.t('mobile.module.salary.wrongalertpart1')}${remainTimes}${I18n.t('mobile.module.salary.wrongalertpart2')}`,
            });
          }
        });
    }

    if (Consts.gesturePwdSelectedOperation == gesturePwdOperation.updateOrigin) {
        const configDrawTimes = realm.objects('Config').filtered('name="storageDrawUnlockTimes"');
        const drawUnlockTimes = parseInt(configDrawTimes[0].value) <= Consts.gesturePwdDrawMaxTimes ? parseInt(configDrawTimes[0].value) + 1 : parseInt(configDrawTimes[0].value);
        realm.write(() => {
          const temp = realm.objects('Config').filtered('name="storageDrawUnlockTimes"');
          temp[0].enable = `${drawUnlockTimes}`;
        });

        encrypt(password).then(base64Pwd => {
          if (base64Pwd == this.gesturePwd && drawUnlockTimes < Consts.gesturePwdDrawMaxTimes) {
            this.setState({
              status: 'right',
              message: I18n.t('mobile.module.salary.drawnewpwd'),
              navBarTitle: I18n.t('mobile.module.salary.setnewgesturepwd'),
            });

            realm.write(() => {
              const temp = realm.objects('Config').filtered('name="storageDrawUnlockTimes"');
              temp[0].value = '0';
            });
     
            Consts.gesturePwdSelectedOperation = gesturePwdOperation.updateConfirm;
            return;
          } else {
            if (drawUnlockTimes >= Consts.gesturePwdDrawMaxTimes) {
              this.setState({
                status: 'wrong',
                message: I18n.t('mobile.module.salary.maxtimesalert'),
              });

              realm.write(() => {
                const userArr = realm.objects('User');
                for (let i = 0; i < userArr.length; i ++) {
                  userArr[i].password = '';
                }
              });
              const configAutoLogin = realm.objects('Config').filtered('name="autoLogin"');
              if (configAutoLogin[0].enable) {
                realm.write(() => {
                  const temp = realm.objects('Config').filtered('name="isNeedResetAutoLogin"');
                  temp[0].enable = true;
                });
              }
              this.resetGlobalDrawTimes();
              this.props.openParentLoginModal();
              return;
            }
            const remainTimes = Consts.gesturePwdDrawMaxTimes - drawUnlockTimes;
            this.setState({
              status: 'wrong',
              message: `${I18n.t('mobile.module.salary.wrongalertpart1')}${remainTimes}${I18n.t('mobile.module.salary.wrongalertpart2')}`,
            });
          }
        });
    }

    if (Consts.gesturePwdSelectedOperation == gesturePwdOperation.updateConfirm) {
      if (password.length < 4) {
        this.setState({
          status: 'wrong',
          message: I18n.t('mobile.module.salary.numbers'),
        });
        this.drawUpdateTimes = 0;
        return;
      }
      this.drawUpdateTimes += 1;
      if (this.drawUpdateTimes == 1) {
        this.drawFirst = password;
        this.setState({
          status: 'normal',
          message: I18n.t('mobile.module.salary.drawgesturepwdagain'),
        });
      }
      if (this.drawUpdateTimes == 2) {
        this.drawSecond = password;
        if (this.drawFirst == this.drawSecond) {
          this.setState({
            status: 'normal',
            message: I18n.t('mobile.module.salary.matchgesturepwd'),
          });
          this.saveGesturePwd(password);
        } else {
          this.setState({
            status: 'wrong',
            message: I18n.t('mobile.module.salary.mismatchgesturepwd'),
          });
        }
        this.drawUpdateTimes = 1;
      }
    }
  }

  onReset() {
    this.setState({
      status: 'normal',
      message: 'Please input your password (again).',
    });
  }

  saveGesturePwd(password) {
    const params = {};
    params.sessionId = global.loginResponseData.SessionId;
    encrypt(password).then(base64Password => {
      params.newGesturePwd = base64Password;
      POST(setUserGesturePassword(), params, (data) => {
        showMessage(messageType.success, I18n.t('mobile.module.salary.matchgesturepwd'));
        realm.write(() => {
          const temp = realm.objects('Config').filtered('name="storageDrawUnlockTimes"');
          temp[0].value = '0';
        });


        Consts.currentPage = pageOptions.salary;
        this.props.navigator.push({
          component: Salary,
          gestureDisabled: true,
        });
      }, (message) => {
        showMessage(messageType.error, message);
      });
    });
  }

  updateOperation() {
    this.drawUpdateTimes = 0;
    this.setState({
      status: 'normal',
      message: I18n.t('mobile.module.salary.typeoriginalpwd'),
      pwdState: '',
      navBarTitle: I18n.t('mobile.module.salary.updategesturepwdtitle'),
    });
  }

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
    realm.write(() => {
      const temp = realm.objects('Config').filtered('name="autoLogin"');
      if (temp.length == 0) {
        realm.create('Config', { name: 'autoLogin', enable: false });
      } else {
        temp[0].enable = false;
      }
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

  renderHead() {
    return (
      <View>
        <NavBar
          title={I18n.t('mobile.module.salary.title')}
          titleColor="white"
          backgroundColor="#1FD662"
          lineColor="#1FD662"
          backImage={leftBack}
          onPressLeftButton={() => this.props.navigator.pop()} />
        <GesturePwdHeadCom passGesturePwd={this.state.pwdState} />
      </View>
    );
  }

  render() {
    return (
      <View style={{ flexGrow: 1 }}>
        <PasswordGesture
          ref="pg"
          status={this.state.status}
          message={this.state.message}
          onEnd={(password) => this.onEnd(password)}
          innerCircle
          outerCircle
          children={this.renderHead()}
          textStyle={{ color: '#ffffff' }}
          rightColor="#ffffff"
          wrongColor="#ffffff"
          rightLineColor="#ffffff"
          wrongLineColor="#13837c"
          rightCirclesColor="#ffffff"
          wrongCirclesColor="#13837c"
          interval={1000}
          />
      </View>
    );
  }
}