import React, { Component } from 'react';
import {
  InteractionManager,
  TouchableOpacity,
  View,
} from 'react-native';

import I18n from 'react-native-i18n';
import EStyleSheet from 'react-native-extended-stylesheet';
import SplashScreen from 'rn-splash-screen';

import { device } from '@/common/Util';
import Tab from '@/views/Tab';
import MobileCheckIn from '@/views/MobileCheckIn';
import ScanQrCheckIn from '@/views/MobileCheckIn/ScanQrCheckIn';
import Image from '@/common/components/CustomImage';
import Text from '@/common/components/TextField';

import TimeLeave from './components/TimeLeave';

const imageButtonShadow = 'button_shadow';

export default class QuickClock extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      SplashScreen.hide();
    });
  }

  componentWillUnmount() {
  }

  checkOutTime() {
    const now = new Date();
    const timeArr = [`${now.getHours()}`, `${now.getMinutes()}`, `${now.getSeconds()}`];
    for (let i = 0; i < timeArr.length; i += 1) {
      if (timeArr[i].length == 1) {
        timeArr[i] = `0${timeArr[i]}`;
      }
    }
    const timeStr = `${timeArr[0]}:${timeArr[1]}:${timeArr[2]}`;
    return timeStr;
  }

  goClockView() {
    const punchTypeList = global.companyResponseData ? global.companyResponseData.attendance : null;
    if (punchTypeList && punchTypeList.length == 1 && punchTypeList[0] == 'APP_QR') {
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

  goHomeView() {
    this.props.navigator.push({
      component: Tab,
      gestureDisabled: true,
    });
  }

  render() {
    return (
      <View style={{ flexGrow: 1, backgroundColor: '#FFF' }}>
        <TouchableOpacity onPress={() => this.goHomeView()} style={styles.viewTop}>
          <View style={{ flexGrow: 1 }} />
          <Text style={styles.textEnterHome}>{I18n.t('mobile.module.guide.enterhome')}</Text>
        </TouchableOpacity>
        <TimeLeave timeLeft={this.props.timeLeft} navigator={this.props.navigator} />
        <Text style={styles.textTimeToWork}>{I18n.t('mobile.module.guide.timetoclock')}</Text>

        <TouchableOpacity onPress={() => this.goClockView()}>
          <Image style={styles.imageButton} source={{ uri: imageButtonShadow }}>
            <Text style={styles.textClock}>{I18n.t('mobile.module.guide.clocknow')}</Text>
          </Image>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  viewTop: {
    marginTop: 45,
    width: device.width,
    height: 24,
    flexDirection: 'row',
  },
  textEnterHome: {
    marginRight: 48,
    fontSize: 16,
    color: '#1FD662',
  },
  textTimeToWork: {
    marginTop: 18,
    color: '#BFBFBF',
    fontSize: 14,
    alignSelf: 'center',
  },
  imageButton: {
    marginTop: 28,
    width: 280,
    height: 65,
    alignSelf: 'center',
  },
  textClock: {
    marginTop: 11,
    fontSize: 21,
    alignSelf: 'center',
    color: '#FFF',
    backgroundColor: 'transparent',
  },
});