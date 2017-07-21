// 蓝牙扫描

import { DeviceEventEmitter, NativeModules } from 'react-native';
import { device } from '@/common/Util';
import constant from './constant';

const { RNManager } = NativeModules;
const Beacons = device.isIos ? require('react-native-ibeacon') : require('react-native-beacons-android');

let isScanned = false;

module.exports = {
  // 扫描蓝牙前先检测手机蓝牙、定位服务是否开启
  scan() {
    this.start();
    // 检测手机蓝牙是否开启
    RNManager.bluetoothEnabled(
      (value) => {
        if (!value) {
          const data = { type: 'Bluetooth' };
          DeviceEventEmitter.emit(constant.event.SU_SCAN_DISABLED, data);
          return;
        }
        // 检测GPS定位服务是否可用
        RNManager.GPSEnabled(
          (GPSvalue) => {
            if (!GPSvalue) {
              const data = { type: 'GPS' };
              DeviceEventEmitter.emit(constant.event.SU_SCAN_DISABLED, data);
              return;
            }
          }
        );
      }
    );
  },

  // 根据region扫描Beacon设备
  start() {
    this.region = {
      identifier: 'gaiaworks',
      uuid: global.loginResponseData.Uuid,
    };
    if (device.isIos) {
      Beacons.requestWhenInUseAuthorization();
      Beacons.startRangingBeaconsInRegion(this.region);
    } else {
      Beacons.detectIBeacons();
      Beacons.startRangingBeaconsInRegion(this.region);
      isScanned = true;
    }
  },

  // 根据region停止扫描Beacon设备
  stop() {
    if (device.isIos) {
      if (this.region && Beacons) Beacons.stopRangingBeaconsInRegion(this.region);
    } else {
      if (this.region && Beacons) {
        if (isScanned) {
          isScanned = false;
          Beacons.stopRangingBeaconsInRegion(this.region);
        }
      }
    }
  },
};