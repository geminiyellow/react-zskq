import {
  DeviceEventEmitter,
} from 'react-native';
import React, { PureComponent } from 'react';

import Barcode from 'react-native-smart-barcode';
import I18n from 'react-native-i18n';
import { device } from '@/common/Util';

export default class QRCodeScanView extends PureComponent {

  constructor(...props) {
    super(...props);
    this.state = {
      actionBarTitle: this.props.actionBarTitle,
      firstScanDesc: this.props.firstScanDesc,
      scanDesc: this.props.scanDesc,
      showActionBar: this.props.showActionBar,
    };
  }

  componentDidMount() {
    // 请假类型消息监听事件
    this.listeners = [
      DeviceEventEmitter.addListener('SCAN_LEFT_ARROW_CLICK', (eventBody) => {
        const { close } = this.props;
        close();
      }),
    ];
  }

  componentWillUnmount() {
    this.listeners && this.listeners.forEach(listener => listener.remove());
  }

  render() {
    return (
      <Barcode
        style={{ height: device.height }}
        ref={component => this._barCode = component}
        actionBarTitle={this.state.actionBarTitle}
        firstScanDesc={this.state.firstScanDesc}
        scanDesc={this.state.scanDesc}
        showActionBar={this.state.showActionBar}
        onBarCodeRead={this._onBarCodeRead} />
    )
  }

  _onBarCodeRead = (e) => {
    this._stopScan();
    const { onBarCodeRead } = this.props;
    onBarCodeRead(e);
  }

  _startScan = (e) => {
    this._barCode.startScan()
  }

  _stopScan = (e) => {
    this._barCode.stopScan()
  }
}
