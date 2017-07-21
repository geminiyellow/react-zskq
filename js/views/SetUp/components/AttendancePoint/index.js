// 设置考勤地点位置 Page

import React, { Component } from 'react';
import { DeviceEventEmitter, NativeModules, View } from 'react-native';
import ModalWithImage from '@/common/components/modal/ModalWithImage';
import NavBar from '@/common/components/NavBar';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import styles from './index.style';
import Token from './Token';
import AllDevice from './Device';
import MessageBar from '../common/MessageBar';
import constant from '../common/constant';
import { showBluetoothMessageBar, showGPSMessageBar } from '../../actions';

const { RNManager } = NativeModules;

class SetUp extends Component {
  mixins: [React.addons.PureRenderMixin]

  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    dispatch(showBluetoothMessageBar(false));
    dispatch(showGPSMessageBar(false));
  }

  componentDidMount() {
    this.showModal();
  }

  componentWillUnmount() {
    this.scanDisabledListener.remove();
  }

  // 显示蓝牙、WiFi未开启提示弹窗
  showModal() {
    const { dispatch } = this.props;
    this.scanDisabledListener = DeviceEventEmitter.addListener(constant.event.SU_SCAN_DISABLED, (data) => {
      // 蓝牙未开启
      if (data.type === 'Bluetooth') {
        if (!global.showBluetoothBar) {
          this.modal.open();
          dispatch(showBluetoothMessageBar(false));
          dispatch(showGPSMessageBar(false));
          global.showBluetoothBar = true;
        } else {
          dispatch(showBluetoothMessageBar(true));
          dispatch(showGPSMessageBar(false));
        }
      }
      // 定位服务不可用
      if (data.type === 'GPS') {
        if (!global.showGPSBar) {
          this.gpsModal.open();
          dispatch(showBluetoothMessageBar(false));
          dispatch(showGPSMessageBar(false));
          global.showGPSBar = true;
        } else {
          dispatch(showBluetoothMessageBar(false));
          dispatch(showGPSMessageBar(true));
        }
      }
    });
  }

  // 检测GPS定位服务是否可用
  GPSEnabled() {
    const { dispatch } = this.props;
    RNManager.GPSEnabled(
      (GPSvalue) => {
        if (GPSvalue) return;
        if (!global.showGPSBar) {
          this.gpsModal.open();
          global.showGPSBar = true;
        } else {
          dispatch(showBluetoothMessageBar(false));
          dispatch(showGPSMessageBar(true));
        }
      },
    );
  }

  render() {
    const { navigator, params, isShowBluetoothMessageBar, isShowGPSMessageBar } = this.props;
    return (
      <View style={[styles.flex, styles.background]}>
        <NavBar title={I18n.t('mobile.module.setup.navbartitle')} onPressLeftButton={() => navigator.pop()} />
        <Token params={params} />
        {isShowBluetoothMessageBar ? <MessageBar style={{ backgroundColor: '#F4A211', position: 'relative', top: 0 }} title={I18n.t('mobile.module.setup.bluetoothdisabledmessage')} /> : null}
        {isShowGPSMessageBar ? <MessageBar style={{ backgroundColor: '#F4A211', position: 'relative', top: 0 }} title={I18n.t('mobile.module.setup.gpsdisabledmessage')} /> : null}
        <AllDevice navigator={navigator} params={params} />
        <ModalWithImage
          ref={modal => this.modal = modal}
          title={I18n.t('mobile.module.setup.openbluetooth')}
          subTitle={I18n.t('mobile.module.setup.openbluetoothdetail')}
          topButtonTitle={I18n.t('mobile.module.setup.ok')}
          topButtonPress={() => {
            this.modal.close();
            this.GPSEnabled();
          }}
        />
        <ModalWithImage
          ref={modal => this.gpsModal = modal}
          title={I18n.t('mobile.module.setup.openlocation')}
          subTitle={I18n.t('mobile.module.setup.opengpsdetail')}
          topButtonTitle={I18n.t('mobile.module.setup.ok')}
          topButtonPress={() => {
            this.gpsModal.close();
          }}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { isShowBluetoothMessageBar, isShowGPSMessageBar } = state.setUpReducer;
  return {
    isShowBluetoothMessageBar,
    isShowGPSMessageBar,
  };
}

export default connect(mapStateToProps)(SetUp);