import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import EStyleSheet from 'react-native-extended-stylesheet';
import codePush from 'react-native-code-push';
import React, { Component } from 'react';
import Root from './js/views/Root';
import Style from './js/common/Style';
import UpdateModule from './js/views/Update/UpdateModule';
import { Provider } from 'react-redux';
import configureStore from '@/configureStore';
import { Loading, LoadingManager } from '@/common/Loading';
import { Alert, AlertManager } from '@/common/components/CustomAlert';
import { setUserLoginRequest } from '@/common/components/Login/LoginRequest';
import { BackHandler, View, NativeModules } from 'react-native';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import { device } from '@/common/Util';
import './js/common/Message';
import './js/common/I18n';
const { RNManager } = NativeModules;
const updateModule = new UpdateModule();
const store = configureStore();
EStyleSheet.build(Style);

class App extends Component {
  mixins: [React.addons.PureRenderMixin]

  /** Life cycle */
  componentDidMount() {
    console.disableYellowBox = true;
    // console.ignoredYellowBox = ["Setting a timer"];
    MessageBarManager.registerMessageBar(this.messageBar);
    LoadingManager.register(this.loading);
    AlertManager.register(this.alert);
    if (device.isAndroid) {
      BackHandler.addEventListener('hardwareBackPress', (data) => {
        if (this.alert && this.alert.isShow) {
          return true;
        }
      });
    }
  }

  componentWillUnmount() {
    MessageBarManager.unregisterMessageBar();
    LoadingManager.unregister();
    AlertManager.unregister();
    if (device.isAndroid) {
      BackHandler.removeEventListener();
    }
  }

  /** Callback */
  reLogin() {
    this.alert.isShow = false;
    RNManager.showLoading('');
    setUserLoginRequest()
    .then(responseData => {
      RNManager.hideLoading();
    })
    .catch(errorMsg => {
      RNManager.hideLoading();
      showMessage(messageType.error, errorMsg);
    });
  }

  codePushStatusDidChange(status) {
    switch (status) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        break;
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        updateModule.upToDate();
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        break;
      case codePush.SyncStatus.UP_TO_DATE:
        updateModule.showTipModal();
        break;
      case codePush.SyncStatus.UPDATE_INSTALLED:
        break;
      default:
        break;
    }
  }

  codePushDownloadDidProgress(progress) {
  }

  render() {
    return (
      <Provider store={store}>
        <View style={{ flexGrow: 1 }}>
          <Root />
          <MessageBar ref={(messageBar) => { this.messageBar = messageBar; }} />
          <Loading ref={loading => this.loading = loading} />
          <Alert ref={alert => this.alert = alert} onPress={() => this.reLogin()}/>
        </View>
      </Provider>
    );
  }
}

export default codePush({ checkFrequency: codePush.CheckFrequency.ON_APP_RESUME, installMode: codePush.InstallMode.ON_NEXT_RESUME })(App);
