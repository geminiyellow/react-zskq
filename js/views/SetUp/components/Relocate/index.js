/** 重新定位 */

import React, { Component } from 'react';
import { DeviceEventEmitter, NativeModules, View, Text, TouchableOpacity } from 'react-native';
import Image from '@/common/components/CustomImage';
import I18n from 'react-native-i18n';
import ModalWithImage from '@/common/components/modal/ModalWithImage';
import NavBar from '@/common/components/NavBar';
import styles from './index.style';

const { RNManager } = NativeModules;
const wifiImg = 'icon_wifi';

export default class RelocateView extends Component {
  mixins: [React.addons.PureRenderMixin]

  // 开启WiFi
  openWiFi() {
    RNManager.openWifi();
  }

  // 重新定位
  relocate() {
    const { navigator } = this.props;
    RNManager.GPSEnabled(
      (GPSvalue) => {
        if (!GPSvalue) {
          this.gpsModal.open();
          return;
        }
        DeviceEventEmitter.emit('didRelocate', true);
        navigator.pop();
      },
    );
  }

  render() {
    const { navigator } = this.props;
    return (
      <View style={[styles.flex, styles.background]}>
        <NavBar title={I18n.t('mobile.module.setup.renavbartitle')} onPressLeftButton={() => navigator.pop()} />
        <View style={styles.container}>
          <Image style={styles.image} source={{ uri: wifiImg }} resizeMode="contain" />
          <TouchableOpacity onPress={() => this.openWiFi()}>
            <Text allowFontScaling={false} style={styles.button}>{I18n.t('mobile.module.setup.openwifi')}</Text>
          </TouchableOpacity>
          <Text allowFontScaling={false} style={styles.prompt}>{I18n.t('mobile.module.setup.prompt')}</Text>
          <TouchableOpacity onPress={() => this.relocate()}>
            <Text allowFontScaling={false} style={styles.button}>{I18n.t('mobile.module.setup.rerelocate')}</Text>
          </TouchableOpacity>
        </View>
        <ModalWithImage
          ref={modal => this.gpsModal = modal}
          title={I18n.t('mobile.module.setup.openlocation')}
          subTitle={I18n.t('mobile.module.setup.opengpsdetail')}
          topButtonTitle={I18n.t('mobile.module.setup.ok')}
          topButtonPress={() => this.gpsModal.close()}
        />
      </View>
    );
  }
}