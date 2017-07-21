import React, { Component } from 'react';
import {
  View,
  BackAndroid,
} from 'react-native';
import { AlertManager } from '@/common/components/CustomAlert';
import EStyleSheet from 'react-native-extended-stylesheet';
import GesturePwd from './GesturePwd';
import EmptyGesturePwd from './EmptyGesturePwd';
import { GET } from '@/common/Request';
import { showMessage } from '@/common/Message';
import { getGesturePwd } from '@/common/api';
import { device } from '@/common/Util';
import Consts, { pageOptions, messageType } from '@/common/Consts';
import LinearGradient from 'react-native-linear-gradient';

export default class MySalary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      gesturePwd: '',
    };
    Consts.currentPage = pageOptions.mysalary;
  }

  /** life cycle */

  componentDidMount() {
    this.fetchGesturePwd();
    if (device.isAndroid) {
      this.androidBackHandler = this.onDeviceBackPressed.bind(this);
      BackAndroid.addEventListener('hardwareBackPress', this.androidBackHandler);
    }
  }

  componentWillUnmount() {
    if (device.isAndroid) {
      BackAndroid.removeEventListener('hardwareBackPress', this.androidBackHandler);
    }
  }

  /** private methods */

  onDeviceBackPressed() {
    const alertView = AlertManager.getAlertView();
    if (alertView && alertView.isShow) {
      return true;
    }
    if (Consts.currentPage == pageOptions.mysalary) {
      if (this.state.gesturePwd != '') {
        this.gesPwdCom.deviceBackBtnClicked();
      } else {
        this.props.navigator.pop();
      }
    }
    // 返回true后导致薪资列表页物理返回键无效问题
    // return true;
  }

  fetchGesturePwd() {
    GET(getGesturePwd(), (responseData) => {
      this.setState({
        loaded: true,
        gesturePwd: responseData,
      });
    }, (message) => {
      showMessage(messageType.error, message);
    },
    'getGesturePwd');
  }

  /** render view */

  renderPage() {
    const { loaded, gesturePwd } = this.state;
    if (loaded) {
      if (gesturePwd != '') {
        return (
          <GesturePwd ref={gesPwdCom => this.gesPwdCom = gesPwdCom} navigator={this.props.navigator} passGesturePwd={gesturePwd} />
        );
      }
      return (
        <EmptyGesturePwd navigator={this.props.navigator} passGesturePwd={gesturePwd} />
      );
    }
    return <View />;
  }

  render() {
    return (
      <LinearGradient colors={['#1fd662', '#00c7e2']} style={styles.backgroundGradient}>
        {this.renderPage()}
      </LinearGradient>
    );
  }
}

const styles = EStyleSheet.create({
  backgroundGradient: {
    flexGrow: 1,
    width: device.width,
    height: device.height,
  },
});