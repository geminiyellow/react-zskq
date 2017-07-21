
import {
  BackAndroid,
  NativeModules,
  Text,
  View,
  InteractionManager,
} from 'react-native';
import React, { Component } from 'react';

import Camera from 'react-native-camera';
import EStyleSheet from 'react-native-extended-stylesheet';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import SplashScreen from 'rn-splash-screen';
import realm from '@/realm';
import { showMessage } from '@/common/Message';
import NavBar from '@/common/components/NavBar';
import { GET, POST, ABORT } from '@/common/Request';
import {
  submitEmployeeAttendanceDataByQR,
  getShiftAndShiftTime,
  GetEmployeeScheduleForFour,
} from '@/common/api';
import { log } from '@/common/LogHelper';
import ModalWithImage from '@/common/components/modal/ModalWithImage';
import ModalWithInput from '@/common/components/modal/ModalWithInput';
import ModalWithSuccess from '@/common/components/modal/ModalWithSuccess';
import { device, keys } from '@/common/Util';
import Consts, { messageType, appVersion } from '@/common/Consts';
import Base64 from '@/views/MobileCheckIn/Base64';
import Style from '@/common/Style';
import Tab from '@/views/Tab';
import UserShiftInfo from '@/views/MobileCheckIn/components/UserShiftInfo';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
import CameraForQr from '@/common/components/Camera/CameraForQr';
import QRCodeScanView from '@/common/components/QRCodeScanView';
import { getHHmmFormat } from '@/common/Functions';

import { changeUserWorkingTime, changeUserShift } from './actions';

const errorQR = 'qrcode_failure';
const errorAddress = 'location_failure';
const addressIcon = 'toast_punchline_icon_location';
const leftBack = 'back_white';

let hasResult = false;
let backOnce = false;
let globalParams = {};
let currentPage = true;
let couldBackNow = false;

const { RNManager } = NativeModules;
const customizedCompanyHelper = new CustomizedCompanyHelper();

class ScanQrCheckIn extends Component {
  mixins: [React.addons.pureRenderMixin]

  constructor(props) {
    super(props);
    this.state = {
      camera: {
        aspect: Camera.constants.Aspect.fill,
        captureTarget: Camera.constants.CaptureTarget.cameraRoll,
        type: Camera.constants.Type.back,
        orientation: Camera.constants.Orientation.auto,
        flashMode: Camera.constants.FlashMode.auto,
      },
      needSearchDevice: true,
      torchMode: 'off',
      cameraType: 'back',
      showCamera: false,

      noAddress: true,
      limitedInfo: [],
    };
    this.onBarCodeRead = this.onBarCodeRead.bind(this);
    this.submitMsgToServer = this.submitMsgToServer.bind(this);
    currentPage = true;
    couldBackNow = false;
  }

  componentDidMount() {
    SplashScreen.hide();
    this.getUserShiftInfo();
    if (device.isAndroid) {
      this.listeners = [
        BackAndroid.addEventListener('hardwareBackPress', () => {
          if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            // 最近2秒内按过back键，可以返回。
            return true;
          }
          this.lastBackPressed = Date.now();
          if (this.mounted && couldBackNow) {
            return true;
          }
          if (currentPage) {
            this.backPrevious();
            return true;
          }
          return false;
        }),
      ];
    } else {
      RNManager.disableKeyboardManager();
    }

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

    this.mounted = true;
    log('进入扫码打卡页面');
  }

  componentWillUnmount() {
    this.onReset();
  }

  onReset() {
    if (device.isAndroid) {
      clearTimeout(this.timeForShowCameraLater);
      this.listeners && this.listeners.forEach(listener => listener.remove());
    } else {
      if (!this.props.isComeFromBluetooth) {
        RNManager.enableKeyboardManager();
      }
    }
    this.mounted = false;
    couldBackNow = false;
    hasResult = false;
    clearTimeout(this.time);
    clearTimeout(this.timeResult);
    clearTimeout(this.timeForCamera);
    clearTimeout(this.closeModalTimer);
    RNManager.stopLocationService();
    ABORT('submitEmployeeAttendanceDataByQRAbortSecond');
    ABORT('AbortGetEmployeeScheduleForFour');
  }

  getUserShiftInfo() {
    // 获取员工班别信息
    const date = new Date();
    const params = {};
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    const today = `${date.getFullYear()}-${month}-${day}`;
    params.companyCode = customizedCompanyHelper.getCompanyCode();
    params.appVersion = appVersion;
    params.beginDate = today;
    params.endDate = today;

    GET(GetEmployeeScheduleForFour(params), (responseData) => {
      if (responseData.length != 0 && responseData[0].hours != 0 ) {
        if (responseData[0].startTime1.length == 0 && responseData[0].endTime1.length == 0) {
          const shiftPartOne = `${responseData[0].startTime}`;
          const shiftPartTwo = `${responseData[0].endTime}`;
          const shiftDetail = `${getHHmmFormat(shiftPartOne)}-${getHHmmFormat(shiftPartTwo)}`;
          this.setUserShiftInfo(responseData[0].shiftName, shiftDetail);
        } else {
          // 用户为4笔卡
          const shiftPartOne = getHHmmFormat(`${responseData[0].startTime}`);
          const shiftPartTwo = getHHmmFormat(`${responseData[0].startTime1}`);
          const shiftPartThree = getHHmmFormat(`${responseData[0].endTime1}`);
          const shiftPartFour = getHHmmFormat(`${responseData[0].endTime}`);
          const shiftDetail = `${shiftPartOne}-${shiftPartTwo} | ${shiftPartThree}-${shiftPartFour}`;
          this.setUserShiftInfo(responseData[0].shiftName, shiftDetail);
        }
      } else if (responseData.length == 0) {
        this.setUserShiftInfo(I18n.t('mobile.module.clock.noworktoday'), I18n.t('mobile.module.clock.havegoodtime'));
      } else {
        this.setUserShiftInfo(responseData[0].shiftName, I18n.t('mobile.module.clock.havegoodtime'));
      }
    }, (err) => {
      showMessage(messageType.error, err);
      this.setUserShiftInfo(I18n.t('mobile.module.clock.cannotgetshiftnow'), I18n.t('mobile.module.clock.pleasetrylater'));
    }, 'AbortGetEmployeeScheduleForFour');
  }

  setUserShiftInfo(title, detail) {
    // 设置员工班别信息
    this.props.dispatch(
      changeUserShift(
        title,
      ),
    );
    this.props.dispatch(
      changeUserWorkingTime(
        detail,
      ),
    );
  }

  onBarCodeRead(result) {
    if (result) {
      if (!hasResult) {
        hasResult = true;
        RNManager.GPSEnabled(
          (GPSvalue) => {
            if (!GPSvalue) {
              this.notOpenGPS();
            } else {
              RNManager.wifiEnabled((wifiValue) => {
                if (!wifiValue && this.state.needSearchDevice) {
                  this.notOpenWIFI();
                } else {
                  let str = '';
                  if (device.isAndroid) {
                    str = Base64.decode(result);
                  }
                  if (device.isIos) {
                    str = Base64.decode(result.data);
                  }
                  const arrMsg = str.split('|');
                  if (arrMsg.length == 3) {
                    this.submitMsgToServer(arrMsg);
                  } else {
                    this.invalidQR.open();
                  }
                }
              });
            }
          },
        );
      }
    }
  }

  setScanQrEnabled() {
    if (device.isAndroid) {
      hasResult = false;
      this.qrscancode._startScan();
    } else {
      this.timeResult = setTimeout(() => {
        hasResult = false;
      }, 2400);
    }
  }

  setScanQrEnabledForFieldWork() {
    if (device.isAndroid) {
      hasResult = false;
      this.qrscancode._startScan();
    } else {
      this.timeResult = setTimeout(() => {
        hasResult = false;
      }, 1400);
    }
  }

  setWiFiOpenOnce() {
    this.setState({
      needSearchDevice: false,
    });
  }

  submitMsgToServer(arrMsg) {
    const params = {};
    const sessionID = Consts.sessionId;
    RNManager.GPSEnabled(
      (GPSvalue) => {
        if (!GPSvalue) {
          this.setScanQrEnabledForFieldWork();
          this.notOpenGPS();
        } else {
          RNManager.getLocation(info => {
            if (!info.lat) {
              this.locationAccess.open();
              this.setScanQrEnabledForFieldWork();
              return;
            }
            log('扫码打卡开始请求接口');
            RNManager.showLoading(I18n.t('mobile.module.clock.waitpunch'));
            params.SessionId = sessionID;
            params.Longitude = info.lng;
            params.latitude = info.lat;
            params.UnitID = arrMsg[1];
            params.Address = info.address;
            params.punchDateTime = arrMsg[2];
            params.MachineID = '';
            POST(submitEmployeeAttendanceDataByQR(customizedCompanyHelper.getPrefix()), params, (responseData) => {
              globalParams = params;
              RNManager.hideLoading();
              if (!this.mounted) {
                return;
              }
              switch (responseData.state) {
                // 正常打卡
                case '0':
                  log('正常打卡成功（扫码）');

                  this.punchSuccess(I18n.t('mobile.module.clock.punchsuccess'), responseData);
                  break;
                // 正常打卡异常
                case '1':
                  log('正常打卡异常（扫码）');

                  this.fieldPunch(I18n.t('mobile.module.clock.exception'), responseData.code);
                  break;
                // 外勤打卡
                case '2':
                  log('外勤打卡 (扫码)');

                  this.fieldPunch(I18n.t('mobile.module.clock.fieldpunch'), responseData.code);
                  break;
                // 外勤打卡异常
                case '3':
                  log('外勤打卡异常（扫码）');

                  this.fieldPunch(I18n.t('mobile.module.clock.fieldexception'), responseData.code);
                  break;

                default:
                  break;
              }

              if (responseData.successCode == 0) {
                this.Success.open(I18n.t('mobile.module.clock.successpunch'), responseData.timestamp);
                this.time = setTimeout(() => {
                  this.backPrevious();
                  showMessage(messageType.success, `${I18n.t('mobile.module.clock.punchsuccessprompt')}${responseData.timestamp}`);
                }, 3000);
              } else if (responseData.successCode == 4) {
                this.fieldWork.open(I18n.t('mobile.module.clock.fieldpunch'), params.Address, addressIcon);
              }
            }, (message) => {
              RNManager.hideLoading();
              showMessage(messageType.error, message);
              this.setScanQrEnabled();
            });
          });
        }
      },
    );
  }

  submitMsgToServerFieldWork() {
    const inputString = this.fieldWork.getReason();
    if (inputString.length == 0 || inputString.match(/^\s+$/g)) {
      showMessage(messageType.error, I18n.t('mobile.module.clock.reasonfieldpunch'));
      return;
    }

    this.fieldWork.close();
    RNManager.showLoading(I18n.t('mobile.module.clock.waitfieldpunch'));
    let paramsZ = {};
    paramsZ = globalParams;
    paramsZ.Remark = inputString;
    log('扫码打卡开始请求接口（外勤打卡）')
    POST(submitEmployeeAttendanceDataByQR(customizedCompanyHelper.getPrefix()), paramsZ, (responseData) => {
      RNManager.hideLoading();
      switch (responseData.successCode) {
        // 正常考勤打卡成功
        case '0':
          log('正常考勤打卡成功（扫码）');

          this.punchSuccess(I18n.t('mobile.module.clock.punchsuccess'), responseData);
          break;
        // 正常考勤位置异常打卡成功
        case '1':
          log('正常考勤位置异常打卡成功（扫码）');

          this.punchSuccess(I18n.t('mobile.module.clock.punchsuccess'), responseData);
          break;
        // 外勤考勤打卡成功
        case '2':
          log('外勤考勤打卡成功（扫码）');

          this.punchSuccess(I18n.t('mobile.module.clock.outworkpunchsuccess'), responseData);
          break;
        // 外勤考勤位置异常打卡成功
        case '3':
          log('外勤考勤位置异常打卡成功（扫码）');

          this.punchSuccess(I18n.t('mobile.module.clock.outworkpunchsuccess'), responseData);
          break;

        default:
          break;
      }
    }, (message) => {
      RNManager.hideLoading();
      this.setScanQrEnabled();
      showMessage(messageType.error, message);
    }, 'submitEmployeeAttendanceDataByQRAbortSecond');
  }

  notOpenGPS() {
    // 未启用定位服务
    if (this.mounted) {
      this.GPS.open();
      if (device.isAndroid) {
        hasResult = false;
        this.qrscancode._stopScan();
      }
    }
  }

  notOpenWIFI() {
    // 未开启WiFi
    if (this.mounted) {
      this.WiFi.open();
      if (device.isAndroid) {
        hasResult = false;
        this.qrscancode._stopScan();
      }
    }
  }

  searchDeviceState() {
    // 检测是否开启 定位服务 以及 WiFi
    if (this.state.needSearchDevice) {
      RNManager.GPSEnabled(
        (GPSvalue) => {
          if (!GPSvalue) {
            this.notOpenGPS();
          } else {
            RNManager.wifiEnabled((wifiValue) => {
              if (!wifiValue) {
                this.notOpenWIFI();
              } else {
                hasResult = false;
                this.setState({
                  needSearchDevice: false,
                });
              }
            });
          }
        },
      );
    }
  }

  rednerCamera() {
    if (device.isIos) {
      if (!this.state.showCamera) {
        return (
          <View>
            <NavBar
              barStyle="light-content"
              title={I18n.t('mobile.module.clock.navigationbartitlemobilecheckin')}
              titleColor="white"
              backImage={leftBack}
              backgroundColor={Style.color.mainColorLight}
              lineColor={Style.color.mainColorLight}
              onPressLeftButton={() => this.backPrevious()} />
            <UserShiftInfo />
          </View>
        );
      }
    }
    if (device.isIos) {
      return (
        <CameraForQr
          title={I18n.t('mobile.module.clock.navigationbartitlemobilecheckin')}
          navBackgroundColor={Style.color.mainColorLight}
          navigator={this.props.navigator}
          textTop={I18n.t('mobile.module.clock.pleasealignthescan')}
          textBottom={I18n.t('mobile.module.clock.openwifialert')}
          backViews={() => this.backPrevious()}
          showShift
          onBarCodeRead={(ret) => this.onBarCodeRead(ret)} />
      );
    }
    if (device.isAndroid) {
      return (
        <View>
          <NavBar
            barStyle="light-content"
            title={I18n.t('mobile.module.clock.navigationbartitlemobilecheckin')}
            titleColor="white"
            backImage={leftBack}
            backgroundColor={Style.color.mainColorLight}
            lineColor={Style.color.mainColorLight}
            onPressLeftButton={() => this.backPrevious()} />
          <UserShiftInfo />
          <QRCodeScanView
            ref={v => camera = v}
            actionBarTitle={''}
            firstScanDesc={''}
            scanDesc={''}
            showActionBar={false}
            ref={v => this.qrscancode = v}
            onBarCodeRead={(e) => {
              this.onBarCodeRead(e.nativeEvent.data.code);
            }} />
          <View style={{
            flex: 1,
            width: device.width,
            position: 'absolute',
            left: 0,
            top: device.isIos ? device.height / 3 - 10 : device.height * 0.277,
            alignItems: 'center',
          }}>
            <Text style={{
              flexDirection: 'row',
              fontSize: 16,
              color: '#14BE4B',
              fontWeight: 'bold',
              justifyContent: 'center',
            }}>{I18n.t('mobile.module.clock.pleasealignthescan')}</Text>
          </View>
          <View style={{
            flexGrow: 1,
            flexDirection: 'column',
            width: device.width,
            height: 44,
            position: 'absolute',
            left: 0,
            top: device.isIos ? device.height / 3 + 20 : device.height * 0.322,
            justifyContent: 'center',
          }}>
            <Text style={{
              fontSize: 16,
              color: '#ffffff',
              textAlign: 'center',
              marginTop: 4.8,
              paddingLeft: 57,
              paddingRight: 57,
            }}>{I18n.t('mobile.module.clock.openwifialert')}</Text>
          </View>
        </View>
      );
    }
  }

  backToHomeView() {
    this.backPrevious();
  }

  backPrevious() {
    if (this.props.shouldBackHome) {
      currentPage = false;
      this.props.navigator.push({
        component: Tab,
        gestureDisabled: true,
      });
      this.onReset();
    } else {
      this.props.navigator.pop();
    }
  }

  punchSuccess(title, responseData) {
    // 成功打卡
    couldBackNow = true;
    this.punchSuccessRef.open(I18n.t('mobile.module.clock.punchsuccess'), responseData.timestamp);

    // 3s后返回首页
    this.closeModalTimer = setTimeout(() => {
      this.backPrevious();
      showMessage(messageType.success, `${I18n.t('mobile.module.clock.punchsuccessprompt')}${responseData.timestamp}`);
    }, 3000);
  }

  fieldPunch(title, code) {
    // 外勤打卡
    if (this.mounted) {
      this.fieldWork.open(title, code, addressIcon);
      if (device.isAndroid) {
        this.qrscancode._stopScan();
      }
    }
  }

  renderTopView() {
    return (
      <UserShiftInfo />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.rednerCamera()}
        <ModalWithImage
          ref={GPS => this.GPS = GPS}
          swipeToClose={false}
          title={I18n.t('mobile.module.clock.opengps')}
          subTitle={I18n.t('mobile.module.clock.opengpssubtitle')}
          topButtonTitle={I18n.t('mobile.module.clock.opengps')}
          topButtonPress={() => {
            RNManager.openGPS();
            clearTimeout(this.timeResult);
            this.setScanQrEnabledForFieldWork();
            this.GPS.close();
          }}
          bottomButtonTitle={I18n.t('mobile.module.clock.homeback')}
          bottomButtonPress={() => {
            this.GPS.close();
            this.backPrevious();
          }}
        />
        <ModalWithImage
          ref={WiFi => this.WiFi = WiFi}
          swipeToClose={false}
          title={I18n.t('mobile.module.clock.openwifi')}
          subTitle={I18n.t('mobile.module.clock.openwifisubtitle')}
          topButtonTitle={I18n.t('mobile.module.clock.openwifi')}
          topButtonPress={() => {
            RNManager.openWifi();
            this.setScanQrEnabled();
            this.setWiFiOpenOnce();
            this.WiFi.close();
          }}
          bottomButtonTitle={I18n.t('mobile.module.clock.notopenwifi')}
          bottomButtonPress={() => {
            this.setScanQrEnabled();
            this.setWiFiOpenOnce();
            this.WiFi.close();
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
            this.backPrevious();
          }}
        />
        <ModalWithImage
          ref={invalidQR => this.invalidQR = invalidQR}
          image={errorQR}
          swipeToClose={false}
          subTitle={I18n.t('mobile.module.clock.invalidqrcode')}
          topButtonTitle={I18n.t('mobile.module.clock.punchagain')}
          topButtonPress={() => {
            this.invalidQR.close();
            this.setScanQrEnabled();
          }}
          bottomButtonTitle={I18n.t('mobile.module.clock.homeback')}
          bottomButtonPress={() => {
            this.backToHomeView();
          }}
        />
        <ModalWithImage
          ref={invalidAddress => this.invalidAddress = invalidAddress}
          image={errorAddress}
          subTitle={I18n.t('mobile.module.clock.invalidaddresssubtitle')}
          topButtonTitle={I18n.t('mobile.module.clock.locateagain')}
          topButtonPress={() => {
            InteractionManager.runAfterInteractions(() => {
              RNManager.startLocationService();
              this.invalidAddress.close();
              this.setScanQrEnabled();
            });
          }}
          bottomButtonTitle={I18n.t('mobile.module.clock.homeback')}
          bottomButtonPress={() => {
            this.backPrevious();
          }}
        />
        <ModalWithInput
          ref={fieldWork => this.fieldWork = fieldWork}
          leftButtonTitle={I18n.t('mobile.module.clock.punchagain')}
          leftButtonPress={() => {
            this.setScanQrEnabledForFieldWork();
            this.fieldWork.clearReason();
            this.fieldWork.close();
          }}
          rightButtonTitle={I18n.t('mobile.module.clock.fieldinputsubtitle')}
          rightButtonPress={() => {
            this.submitMsgToServerFieldWork();
          }}
        />
        <ModalWithImage
          ref={locationAccess => this.locationAccess = locationAccess}
          title={I18n.t('mobile.module.clock.locationaccess')}
          subTitle={I18n.t('mobile.module.clock.locationaccesssubtitle')}
          topButtonTitle={I18n.t('mobile.module.language.done')}
          topButtonPress={() => {
            RNManager.startLocationService();
            this.locationAccess.close();
          }}
          bottomButtonTitle={I18n.t('mobile.module.clock.cancel')}
          bottomButtonPress={() => this.backPrevious()}
        />
        <ModalWithSuccess
          ref={Success => this.Success = Success}
          swipeToClose={false}
        />
        <ModalWithSuccess
          ref={punchSuccess => this.punchSuccessRef = punchSuccess}
          time="08:30:00"
          swipeToClose={false}
        />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flexGrow: 1,
    height: device.height,
    backgroundColor: '#000',
  },
  scanImage: {
    top: ((device.height - 144) / 2) - 55,
    width: 170,
    height: 170,
    alignSelf: 'center',
  },

  // camera style new
  preview2: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  scanImage2: {
    marginTop: (device.height / 4) - 70,
    width: 170,
    height: 170,
  },
  textAlert: {
    marginTop: 11,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1fd662',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  workTimeText2: {
    marginTop: 13,
    alignSelf: 'center',
    fontSize: 14,
    color: '#999999',
  },
});

export default connect((state) => {
  const { userWorkingTime, userShift } = state.mobileCheckInReducer;
  return {
    userWorkingTime,
    userShift,
  };
})(ScanQrCheckIn);