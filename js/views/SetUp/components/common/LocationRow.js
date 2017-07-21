// 设置考勤位置地图下方的行 View

import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Image from '@/common/components/CustomImage';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';
import I18n from 'react-native-i18n';
import { color } from '@/common/Style';
import SetLocation from '../SetLocation';

// 考勤设备分类图标
const bluetoothImg = 'icon_bluetooth';
const invalidImg = 'bluetooth_invalid';
const gpsImg = 'icon_gps';
const qrcodeImg = 'icon_qrcode';
const othersImg = 'others';
// 蓝牙信号图标
const strongImg = 'bluetooth_signals_strong';
const normalImg = 'bluetooth_signals_normal';
const weakImg = 'bluetooth_signals_weak';
const nonImg = 'bluetooth_signals_non';
// 考勤设备标识
const APP_BLUETOOTH = 3;
const APP_QRCode = 5;
const APP_GPS = 9;

export default class PlainRow extends Component {
  mixins: [React.addons.PureRenderMixin]

  // 选中设备信息对应的 row,进入设置考勤位置页面
  onPressRow(data, rowID, set) {
    const { navigator, params } = this.props;
    const passParams = {
      MachineID: data.MachineID,
      shop: data.shop,
      title: data.title,
      longitude: data.longitude,
      latitude: data.latitude,
      major: data.major,
      minor: data.minor,
      range: data.range,
      type: data.type,
      set,
      rowID,
      params, // TokenID
    };
    navigator.push({ component: SetLocation, passParams });
  }

  // 蓝牙、二维码、GPS、其他考勤设备对应显示的图标
  icon(type) {
    let image;
    switch (type) {
      case APP_BLUETOOTH:
        image = bluetoothImg;
        break;
      case APP_QRCode:
        image = qrcodeImg;
        break;
      case APP_GPS:
        image = gpsImg;
        break;
      default:
        image = othersImg;
        break;
    }
    return image;
  }

  // Beacon设备信号强弱指示图标
  signalImg(prox) {
    let image;
    switch (prox) {
      case 'immediate':
        image = strongImg;
        break;
      case 'near':
        image = normalImg;
        break;
      case 'far':
        image = normalImg;
        break;
      case 'unknown':
        image = weakImg;
        break;
      default:
        image = nonImg;
        break;
    }
    return image;
  }

  render() {
    const { data, rowID } = this.props;
    let detailText = data.title;
    if (!data.proximity && data.type == APP_BLUETOOTH) {
      detailText = I18n.t('mobile.module.setup.nobeacon');
    } else if (detailText === '') {
      detailText = I18n.t('mobile.module.setup.nolocationinfo');
    }
    // Beacon设备不在附近事不能点击
    let disabled = false;
    if (!data.proximity && data.type == APP_BLUETOOTH) disabled = true;
    // 标记已设置过位置的设备
    let set = true;
    if (data.isAlreadyChange == 0) set = false;
    // 考勤设备图标
    let icon = this.icon(data.type);
    if (!data.proximity && data.type == APP_BLUETOOTH) icon = invalidImg;
    // 蓝牙考勤设备信号图标
    const signalImg = this.signalImg(data.proximity);
    return (
      <TouchableOpacity style={styles.container} disabled={disabled} onPress={() => this.onPressRow(data, rowID, set)}>
        <Image style={styles.typeImg} source={{ uri: icon }} />
        <View style={styles.info}>
          <View style={styles.shop}>
            <Text allowFontScaling={false} style={[styles.title, disabled && { color: '#999999' }]} numberOfLines={1}>{data.shop}</Text>
            {data.type == APP_BLUETOOTH ? <Image style={[styles.image, styles.signal]} source={{ uri: signalImg }} /> : null}
            {set ?
              <View style={styles.sign}>
                <Text allowFontScaling={false} style={styles.signFont}>{I18n.t('mobile.module.setup.set')}</Text>
              </View> : null}
          </View>
          <Text allowFontScaling={false} style={styles.detailText} numberOfLines={1}>{detailText}</Text>
        </View>
        <Image style={[styles.image, styles.forward]} source={{ uri: 'forward' }} />
      </TouchableOpacity>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: device.width,
    height: 70,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flexGrow: 1,
  },
  shop: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  title: {
    flexGrow: 1,
    fontSize: 16,
    color: '#000000',
    marginBottom: -3,
    backgroundColor: 'transparent',
  },
  detailText: {
    color: '#999999',
    fontSize: 14,
  },
  image: {
    width: 22,
    height: 22,
  },
  typeImg: {
    width: 44,
    height: 44,
    marginLeft: 18,
    marginRight: 11,
  },
  signal: {
    marginLeft: 4,
  },
  forward: {
    marginHorizontal: 11,
  },
  sign: {
    backgroundColor: color.mainColorLight,
    borderRadius: 30,
    marginLeft: 10,
    justifyContent: 'center',
    width: 40,
    height: 14,
  },
  signFont: {
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontSize: 10,
    alignSelf: 'center',
  },
});