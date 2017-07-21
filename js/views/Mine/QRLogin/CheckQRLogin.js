import React, { PureComponent } from 'react';
import {
  NativeModules,
  BackAndroid,
  ScrollView,
  View,
  Text
} from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';

import Image from '@/common/components/CustomImage';
import { GET, ABORT } from '@/common/Request';
import { requestCheckQRLogin } from '@/common/api';
import { messageType } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import NavBar from '@/common/components/NavBar';
import OthersButton from '@/common/components/OthersButton';
import TouchableHighlight from '@/common/components/CustomTouchableHighlight';
import Tab from '@/views/Tab';
import { device } from '@/common/Util';

const { RNManager } = NativeModules;
const backIcon = 'qr_determine';

export default class CheckQRLogin extends PureComponent {

  componentWillMount() {
    this.listeners = [
      BackAndroid.addEventListener('hardwareBackPress', () => {
        if (this.lastBackPressed && this.lastBackPressed + 1000 >= Date.now()) {
          // 最近1秒内按过Tab键
          return;
        }
        this.lastBackPressed = Date.now();
        this.backView();
      }),
    ];
  }


  componentWillUnmount() {
    this.listeners && this.listeners.forEach(listener => listener.remove());
    this.props.data.backViewHardWare();
    ABORT('AbortRequestCheckQRLogin');
  }

  setCheckQRLogin(state) {
    const { showExpired, UID, buttonTitle } = this.props.data;
    if (showExpired) {
      this.backView();
      return;
    }

    const params = {};
    params.UId = UID;
    params.State = buttonTitle != 'mobile.module.mine.qr.rescan' ? state : 2;
    RNManager.showLoading('');
    GET(requestCheckQRLogin(params), (responseData) => {
      RNManager.hideLoading();
      if (responseData.state == 1) {
        this.backToTab();
      } else if (responseData.state == 2) {
        this.backToTab();
      } else {
        showMessage(messageType.error, I18n.t('mobile.module.login.servererror'));
      }
    }, (err) => {
      RNManager.hideLoading();
      showMessage(messageType.error, JSON.stringify(err));
    }, 'AbortRequestCheckQRLogin');
  }

  backToTab() {
    const routes = this.props.navigator.state.routeStack;
    for (let i = routes.length - 1; i >= 0; i -= 1) {
      if (routes[i].component === Tab) {
        const destinationRoute = this.props.navigator.getCurrentRoutes()[i];
        this.props.navigator.popToRoute(destinationRoute);
      }
    }
  }

  backView() {
    this.props.navigator.pop();
  }

  render() {
    const { showExpired, buttonTitle, showBottomButton } = this.props.data;

    return (
      <View style={styles.container}>
        <NavBar
          title={I18n.t('mobile.module.mine.qr.title')}
          onPressLeftButton={() => this.backView()} />

        <ScrollView
          style={styles.scrollViewWrapper}
          bounces={false}
          showsVerticalScrollIndicator={false}>
          <Image style={styles.image} source={{ uri: backIcon }} />
          <Text style={styles.textDetermine}>{I18n.t('mobile.module.mine.qr.determine')}</Text>
          {showExpired ? <Text style={styles.textExpired}>{I18n.t('mobile.module.mine.qr.expired')}</Text> : <Text style={styles.textExpired} />}
          <OthersButton
            customStyle={{ marginTop: (96 / 667) * device.height }}
            title={I18n.t(buttonTitle)}
            onPressBtn={() => { this.setCheckQRLogin(1); }} />
          {showBottomButton ?
            <TouchableHighlight onPress={() => this.setCheckQRLogin(2)} underlayColor="#EEE">
              <Text style={styles.textCancel}>{I18n.t('mobile.module.mine.qr.cancel')}</Text>
            </TouchableHighlight> : null}
        </ScrollView>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  scrollViewWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '$color.containerBackground',
  },
  image: {
    marginTop: 142,
    width: 210,
    height: 96,
    alignSelf: 'center',
  },
  textDetermine: {
    marginTop: 18,
    fontSize: 16,
    alignSelf: 'center',
  },
  textExpired: {
    marginTop: 8,
    fontSize: 16,
    color: '$color.mainColorLight',
    alignSelf: 'center',
  },
  textCancel: {
    marginBottom: 40,
    fontSize: 16,
    color: '$color.mainColorLight',
    alignSelf: 'center',
  },
});