import React, { PureComponent } from 'react';
import {
  BackAndroid,
  InteractionManager,
  NativeModules,
  Text,
  View,
} from 'react-native';

import I18n from 'react-native-i18n';

import ModalWithImage from '@/common/components/modal/ModalWithImage';
import { device, keys } from '@/common/Util';
import { GET, ABORT } from '@/common/Request';
import UmengAnalysis from '@/common/components/UmengAnalysis';
import { requestCheckQRLogin } from '@/common/api';
import { messageType } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import NavBar from '@/common/components/NavBar';
import CheckQRLogin from '@/views/Mine/QRLogin/CheckQRLogin';
import CameraForQr from '@/common/components/Camera/CameraForQr';
import QRCodeScanView from '@/common/components/QRCodeScanView';
import realm from '@/realm';

const { RNManager } = NativeModules;
const leftBack = 'back_white';
const errorQR = 'qrcode_failure';
let shouldResult = true;

export default class QRLogin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showCamera: false,
    };
  }

  componentWillMount() {
    UmengAnalysis.onPageBegin('QRLogin');
    if (device.isIos) {
      RNManager.cameraEnabled(cameraEnabled => {
        if (cameraEnabled) {
          this.setState({
            showCamera: true,
          });
        } else {
          this.cameraAlert.open();
        }
      });
    } else {
      this.setState({
        showCamera: true,
      });
    }
    this.listeners = [
      BackAndroid.addEventListener('hardwareBackPress', () => {
        if (this.lastBackPressed && this.lastBackPressed + 1000 >= Date.now()) {
          this.lastBackPressed = null;
          // 最近1秒内按过Tab键
          return;
        }
        this.lastBackPressed = Date.now();
        this.backView();
      }),
    ];
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    UmengAnalysis.onPageEnd('QRLogin');
    shouldResult = true;
    this.mounted = false;
    clearTimeout(this.timer);
    ABORT('AbortRequestCheckQRLogin');
    this.listeners && this.listeners.forEach(listener => listener.remove());
  }

  onBarCodeRead(result) {
    if (!result || !shouldResult) {
      return;
    }
    shouldResult = false;
    let arr = '';
    if (device.isAndroid) {
      arr = result.split('?');
    }
    if (device.isIos) {
      arr = result.data.split('?');
    }
    if (arr.length != 2 || arr[1].indexOf('UID=') == -1) {
      this.invalidQR.open();
      return;
    }
    RNManager.showLoading('');

    const params = {};
    params.UId = arr[1].replace('UID=', '');
    params.State = 0;
    InteractionManager.runAfterInteractions(() => {
      GET(requestCheckQRLogin(params), (responseData) => {
        RNManager.hideLoading();
        if (!this.mounted) {
          return;
        }
        if (responseData.state == 0) {
          this.props.navigator.push({
            component: CheckQRLogin,
            data: {
              showExpired: false,
              buttonTitle: 'mobile.module.mine.qr.login',
              showBottomButton: true,
              UID: params.UId,
              backViewHardWare: () => this.backViewHardWare(),
            },
          });
        } else {
          this.props.navigator.push({
            component: CheckQRLogin,
            data: {
              showExpired: true,
              buttonTitle: 'mobile.module.mine.qr.rescan',
              showBottomButton: false,
              UID: params.UId,
              backViewHardWare: () => this.backViewHardWare(),
            },
          });
        }
      }, (err) => {
        RNManager.hideLoading();
        this.reSetQRScan();
        showMessage(messageType.error, err);
      }, 'AbortRequestCheckQRLogin');
    });
  }

  backView() {
    if (shouldResult) {
      this.props.navigator.pop();
    }
  }

  backViewHardWare() {
    if (!this.mounted) {
      return;
    }
    this.lastBackPressed = Date.now();
    this.reSetQRScan();
  }

  reSetQRScan() {
    // 重新扫描
    if (device.isAndroid) {
      shouldResult = true;
      this.qrscancode._startScan();
    }
    if (device.isIos) {
      this.timer = setTimeout(() => {
        shouldResult = true;
      }, 1200);
    }
  }

  renderCamera() {
    if (device.isAndroid) {
      return (
        <View>
          <QRCodeScanView
            ref={v => this.qrscancode = v}
            actionBarTitle={I18n.t('mobile.module.mine.qr.title')}
            firstScanDesc={''}
            scanDesc={''}
            showActionBar
            onBarCodeRead={(e) => {
              this.onBarCodeRead(e.nativeEvent.data.code);
            }}
            close={() => this.props.navigator.pop()} />
          <View style={{
            flexGrow: 1,
            width: device.width,
            position: 'absolute',
            left: 0,
            top: device.height / 4 - 44,
            alignItems: 'center',
          }}>
            <Text style={{
              flexDirection: 'row',
              fontSize: 16,
              color: '#ffffff',
              textAlign: 'center',
              paddingLeft: 57,
              paddingRight: 57,
            }}>{I18n.t('mobile.module.mine.qr.accurate')}</Text>
          </View>
        </View>
      );
    }
    if (device.isIos) {
      return (
        <CameraForQr
          title={I18n.t('mobile.module.mine.qr.title')}
          navBackgroundColor="transparent"
          navigator={this.props.navigator}
          textTop=""
          textBottom={I18n.t('mobile.module.mine.qr.accurate')}
          showShift={false}
          backViews={() => this.backView()}
          onBarCodeRead={(ret) => this.onBarCodeRead(ret)} />
      );
    }
  }

  renderNavBar() {
    return (
      <NavBar
        title={I18n.t('mobile.module.mine.qr.title')}
        titleColor="#FFF"
        barStyle="light-content"
        backgroundColor="transparent"
        lineColor="transparent"
        backImage={leftBack}
        onPressLeftButton={() => this.props.navigator.pop()} />
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        {this.state.showCamera ? this.renderCamera() : this.renderNavBar()}
        <ModalWithImage
          ref={invalidQR => this.invalidQR = invalidQR}
          image={errorQR}
          subTitle={I18n.t('mobile.module.clock.invalidqrcode')}
          topButtonTitle={I18n.t('mobile.module.mine.qr.rescan')}
          topButtonPress={() => {
            this.invalidQR.close();
            this.reSetQRScan();
          }}
          bottomButtonTitle={I18n.t('mobile.module.clock.homeback')}
          bottomButtonPress={() => {
            this.props.navigator.pop();
          }}
        />
        <ModalWithImage
          ref={cameraAlert => this.cameraAlert = cameraAlert}
          title={I18n.t('mobile.module.clock.opencamera')}
          subTitle={I18n.t('mobile.module.clock.opencamerasubtitle')}
          topButtonTitle={I18n.t('mobile.module.clock.getit')}
          topButtonPress={() => {
            this.cameraAlert.close();
          }}
          bottomButtonTitle={I18n.t('mobile.module.clock.homeback')}
          bottomButtonPress={() => {
            this.props.navigator.pop();
          }}
        />
      </View>
    );
  }
}
