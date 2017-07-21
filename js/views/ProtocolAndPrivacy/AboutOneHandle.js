import React, { Component } from 'react';
import {
  View,
} from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';

import Image from '@/common/components/CustomImage';
import AboutUs from '@/views/ProtocolAndPrivacy/AboutUs.js';
import PrivacyAct from '@/views/ProtocolAndPrivacy/PrivacyAct.js';
import ServiceAgreement from '@/views/ProtocolAndPrivacy/ServiceAgreement.js';
import { device } from '@/common/Util';
import { appVersion } from '@/common/Consts';
import NavBar from '@/common/components/NavBar';
import Text from '@/common/components/TextField';
import OptionCard from '@/common/components/OptionCard';

const icon = 'icon_logo';

const listName = ['mobile.module.mine.aboutus.updatehistory', 'mobile.module.mine.aboutus.service', 'mobile.module.mine.aboutus.privacy'];
const detailName = [AboutUs, ServiceAgreement, PrivacyAct];

export default class AboutOneHandle extends Component {
  mixins: [React.addons.PureRenderMixin]

  constructor(props) {
    super(props);
    this.state = {
    };
    this.initialFunction();
  }

  componentDidMount() {
  }

  initialFunction() {
    this.iconAndVersion = (
      <View
        style={{
          width: device.width,
          height: 196,
          backgroundColor: 'transparent',
          alignItems: 'center' }}>
        <Image style={styles.icon} source={{ uri: icon }} />
        <Text style={styles.text}>{I18n.t('mobile.module.mine.aboutus.onahandle')}</Text>
        <Text style={styles.textVersion}>{I18n.t('mobile.module.mine.aboutus.version')} {appVersion}</Text>
      </View>);

    this.displayWorkTimeMaster = (
      <View style={styles.bottomView}>
        <Text style={styles.workMaster}>{I18n.t('mobile.module.mine.aboutus.time')}</Text>
      </View>);
  }

  displayContent() {
    const arr = [];
    for (let i = 0; i < 3; i += 1) {
      arr.push(this.displayContentDetail(i));
    }
    return arr;
  }

  displayContentDetail(i) {
    const name = listName[i];
    let showBottomLine = false;
    let topLineLeft = 11;
    if (i == 2) {
      showBottomLine = true;
    }
    if (i == 0) {
      topLineLeft = 0;
    }
    return (
      <OptionCard
        key={i}
        title={I18n.t(name)}
        onPress={() => this.goNextView(i)}
        bottomLine={showBottomLine}
        topLineStyle={{ marginLeft: topLineLeft }} />
    );
  }

  goNextView(i) {
    this.props.navigator.push({
      component: detailName[i],
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar
          title={I18n.t('mobile.module.mine.aboutus.title')}
          onPressLeftButton={() => this.props.navigator.pop()} />
        {this.iconAndVersion}
        {this.displayContent()}
        {this.displayWorkTimeMaster}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '$color.containerBackground',
  },
  icon: {
    top: 25,
    width: 80,
    height: 84,
  },
  text: {
    top: 25 + 15,
    color: '#000',
    fontSize: 18,
  },
  textVersion: {
    top: 50,
    color: '#999999',
    fontSize: 14,
  },

  content: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    width: device.width,
    backgroundColor: '#fff',
  },
  textContent: {
    left: 26,
    color: '#000',
    fontSize: 17,
  },
  forward: {
    width: 22,
    height: 22,
    left: (device.width / 2) - 30,
  },
  border: {
    flexGrow: 1,
    height: 0.5,
    backgroundColor: '$color.line',
  },

  bottomView: {
    top: device.height - 456,
    width: device.width,
    height: 15,
    backgroundColor: 'transparent',
  },
  workMaster: {
    color: '#d6dadf',
    fontSize: 11,
    alignSelf: 'center',
  },
});