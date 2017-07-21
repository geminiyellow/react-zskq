import { NativeModules, ScrollView, View, DeviceEventEmitter } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import { device } from '@/common/Util';
import { getUserInfo, getCustomer } from '@/common/api';
import { messageType } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import NavBar from '@/common/components/NavBar';
import { ABORT, GET } from '@/common/Request';
import OptionCard from '@/common/components/OptionCard';
import SwitchCard from '@/common/components/SwitchCard';
import ChangePassword from '@/views/Mine/ChangePassword';
import realm from '@/realm';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';

const customizedCompanyHelper = new CustomizedCompanyHelper();

const { RNManager } = NativeModules;

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
  },
});

export default class Safe extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      EmpID: '',
      switchOpen: false,
      onValue: false,
      fingerPrint: false,
    };
  }

  sendCompany() {
    RNManager.RegistrationId(registId => {
      this.setState({
        Company_code: customizedCompanyHelper.getCompanyCode(),
      });

    });
  }

  sendRequest() {

    console.log('global.companyResponseData: ', global.companyResponseData);
    if (!global.companyResponseData.config.showFingerPrint) {
      return;
    }
    this.setState({
      fingerPrint: global.companyResponseData.config.showFingerPrint ? global.companyResponseData.config.showFingerPrint : false,
    });
  }

  componentWillMount() {
    this.sendRequest();
    this.sendCompany();
    const touchIDEnable = realm.objects('Config').filtered('name="touchIDEnable"');
    if (touchIDEnable.length != 0 && touchIDEnable[0].enable) {
      this.setState({ switchOpen: true });
    }

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
  }


  componentDidMount() {
    this.getUserInfoRequest();
    RNManager.canEvaluatePolicy((value) => {
      this.setState({
        onValue: value ? value : false,
      });
    });
  }

  componentWillUnmount() {
    ABORT('getUserInfoRequest');
  }

  onValueChanged = (SwitchOpen) => {
    realm.write(() => {
      const touchIDEnable = realm.objects('Config').filtered('name="touchIDEnable"');
      if (touchIDEnable.length == 0) {
        realm.create('Config', { name: 'touchIDEnable', enable: SwitchOpen });
      } else {
        touchIDEnable[0].enable = SwitchOpen;
      }
    });

    this.setState({
      switchOpen: SwitchOpen,
      changeswitchOpen: !this.state.changeswitchOpen,
    });
  }

  // 获取用户信息
  getUserInfoRequest() {
      this.setState({
        EmpID: global.loginResponseData.LoginName,
      });
  }

  getOpen() {
    const { fingerPrint, Company_code, onValue } = this.state;
    if (Company_code === 'trial') return null;
    if (!fingerPrint) {
      return null;
    }
    if (!onValue) {
      return null;
    }
    return (
      <View style={{ marginTop: 10 }}>
        <SwitchCard title={I18n.t('mobile.module.mine.contact.hand')} bottomLine detailText={I18n.t('mobile.module.mine.contact.safe')} switchState={this.state.switchOpen} onPress={() => this.onValueChanged(!this.state.switchOpen)} />
      </View>
    );
  }

  gotoChangePassword = () => {
    this.props.navigator.push({
      component: ChangePassword,
    });
  }

  getshowPwd() {
    if (global.companyResponseData.config.showModifyPwd == false) {
      return null;
    } return (
      <View style={{ backgroundColor: 'white', marginTop: 10 }}>
        <OptionCard title={I18n.t('mobile.module.login.changpwd')} bottomLine onPress={this.gotoChangePassword} />
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>

        <NavBar title={I18n.t('mobile.module.mine.contact.account')} onPressLeftButton={() => this.props.navigator.pop()} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ backgroundColor: 'white', marginTop: 10 }}>
            <OptionCard title={I18n.t('mobile.module.login.username')} bottomLine detailText={this.state.EmpID} rightImage={false} />
          </View>
          {this.getshowPwd()}
          {this.getOpen()}
        </ScrollView >
      </View >
    );
  }
}