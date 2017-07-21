import React, { Component } from 'react';
import {
  BackAndroid,
  NativeAppEventEmitter,
  InteractionManager,
  NativeModules,
  PanResponder,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { AlertManager } from '@/common/components/CustomAlert';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import SplashScreen from 'rn-splash-screen';
import UmengAnalysis from '@/common/components/UmengAnalysis';
import { log } from '@/common/LogHelper';
import Image from '@/common/components/CustomImage';
import Style from '@/common/Style';
import { device } from '@/common/Util';
import {
  getUserClockInAndOutInformation,
  getUserDeterminefAddressIsInRestriction,
  submitEmployeeAttendanceDataByBHT,
  submitLocationPunch,
  getSysParamUUID,
  GetEmployeeScheduleForFour,
} from '@/common/api';
import { GET, POST, ABORT } from '@/common/Request';
import Tab from '@/views/Tab';
import UserShiftInfo from '@/views/MobileCheckIn/components/UserShiftInfo';
import { messageType } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import Beacon from '@/views/SetUp/components/common/Beacon';
import ModalWithImage from '@/common/components/modal/ModalWithImage';
import ModalWithInput from '@/common/components/modal/ModalWithInput';
import ModalWithSuccess from '@/common/components/modal/ModalWithSuccess';
import Text from '@/common/components/TextField';
import Line from '@/common/components/Line';
import NavBar from '@/common/components/NavBar';
import { getHHmmFormat } from '@/common/Functions';
import ClockStatusModul from '@/views/MobileCheckIn/components/ClockStatusModul';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
import { appVersion } from '@/common/Consts';
import TouchableHighlight from '@/common/components/CustomTouchableHighlight';
import ScanQrCheckIn from './ScanQrCheckIn';
import Time from './components/Time';
import { changeUserClockInfo, changeUserWorkingTime, changeUserShift } from './actions';

const { RNManager } = NativeModules;
const customizedCompanyHelper = new CustomizedCompanyHelper();
const workOut = 'work_out';
const bluetooth = 'bluetooth';
const bluetoothOther = 'bluetooth_other';
const noBluetooth = 'no_bluetooth';
const location = 'location';
const notInLocation = 'not_in_area';
const qrcs = 'qrcs';
const fingerMachine = 'finger_machine';
const toastIcon = 'toast_punchline_icon_bluetooth';
const noBluetoothAlert = 'alert';
const errorAddress = 'location_failure';
const noLocImg = 'location_active';
const workIn = 'clock_sun';
const leftBack = 'back_white';
const clockLoading = 'clock_loading';
const clockWarning = 'clock_warning';
const clockConfirm = 'clock_confirm';

let hasBHTPermission = false;
let WiFiNeedShowOnce = true;
let hasGPSPermission = false;
let globalParams;
let currentPage = true;
let couldBackNow = false;
let beaconsGlobal = [];
let beaconsIndex = 0;
let couldScanNow = true;

class MobileCheckIn extends Component {
  mixins: [React.addons.pureRenderMixin]

  constructor(props) {
    super(props);
    this.state = {
      QRCSButtonTitle: '',
      imageState: clockLoading,
      arrSelected: [false, false],
      arrSelectedFour: [false, false, false, false],

      noDevice: '',
      clockAddress: '',
      submitButtonDisabled: true,
      buttonBackgroundColor: '#CCCCCC',
    };
    currentPage = true;
    couldBackNow = false;
    this.fourTypeEnable = false;
    this.showClockInfo = false;
  }

  componentWillMount() {
    UmengAnalysis.onPageBegin('MobileCheckIn');
    if (device.isAndroid) {
      RNManager.changeInputType(1);
    }
    RNManager.startLocationService();
    this.getUserShiftInfo();
  }

  componentDidMount() {
    this.mounted = true;
    InteractionManager.runAfterInteractions(() => {
      SplashScreen.hide();
    });
    this.onCheckQRCSReachable();
    if (device.isAndroid) {
      this.listeners = [
        BackAndroid.addEventListener('hardwareBackPress', () => {
          const alertView = AlertManager.getAlertView();
          if (alertView && alertView.isShow) {
            return true;
          }
          if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            // 最近2秒内按过back键，可以返回。
            return true;
          }
          this.lastBackPressed = Date.now();
          if (this.mounted && couldBackNow) {
            return true;
          }
          if (currentPage) {
            this.backViews();
            return true;
          }
          return false;
        }),
      ];
    } else {
      RNManager.disableKeyboardManager();
    }

    this.beaconsDidRange = NativeAppEventEmitter.addListener('beaconsDidRange', (data) => {
      if (data.beacons.length == 0 || beaconsGlobal.length != 0 || !this.mounted) {
        return;
      }

      beaconsGlobal = this.checkBeaconsVaild(data.beacons);
      if (beaconsGlobal.length == 0) {
        return;
      }
      clearTimeout(this.stopDetectiveBluetooth);
      Beacon.stop();
      this.submitBHTClockInformation(beaconsGlobal[beaconsIndex]);
    });

    this.getLatestUUID();
  }

  componentWillUnmount() {
    UmengAnalysis.onPageEnd('MobileCheckIn');
    if (device.isAndroid) {
      RNManager.changeInputType(0);
    } else {
      RNManager.enableKeyboardManager();
    }
    this.onReset();
  }

  onReset() {
    hasBHTPermission = false;
    WiFiNeedShowOnce = true;
    hasGPSPermission = false;
    couldBackNow = false;
    this.mounted = false;
    beaconsGlobal = [];
    beaconsIndex = 0;
    couldScanNow = true;
    this.beaconsDidRange.remove();
    ABORT('getUserClockInAndOutInformationAbort');
    ABORT('getUserDeterminefAddressIsInRestrictionAbort');
    ABORT('getSysParamUUIDAbort');
    ABORT('AbortGetEmployeeScheduleForFour');
    clearTimeout(this.stopDetectiveBluetooth);
    clearTimeout(this.closeModalTimer);
    Beacon.stop();
    if (device.isAndroid) {
      this.listeners && this.listeners.forEach(listener => listener.remove());
    }
    RNManager.stopLocationService();
  }

  onCheckQRCSReachable() {
    // 用户打卡方式权限处理（判断是否有 蓝牙、定位、扫码打卡的权限）
    const punchTypeList = global.companyResponseData.attendance;
    const appQr = 'APP_QR';
    const appBHT = 'APP_BHT';
    const appGPS = 'APP_GPS';
    for (let i = 0; i < punchTypeList.length; i += 1) {
      if (appQr == punchTypeList[i]) {
        this.setState({
          QRCSButtonTitle: I18n.t('mobile.module.clock.qrcs'),
        });
      }
      if (punchTypeList[i] == appBHT) {
        log('用户拥有蓝牙打卡的权限，且进入蓝牙打卡及定位打卡的页面');
        hasBHTPermission = true;
      }
      if (punchTypeList[i] == appGPS) {
        log('用户拥有定位打卡的权限，且进入蓝牙打卡及定位打卡的页面');
        hasGPSPermission = true;
      }
    }
  }

  onSelected(index, isUnfold) {
    const { arrSelected, arrSelectedFour } = this.state;
    if (this.fourTypeEnable) {
      const temp = arrSelectedFour;
      for (let i = 0; i < 4; i ++) {
        temp[i] = false;
      }
      temp[index] = isUnfold;
      this.setState({ arrSelectedFour: temp });
    } else {
      const temp = arrSelected;
      for(let i = 0; i < 2; i ++) {
        temp[i] = false;
      }
      temp[index] = isUnfold;
      this.setState({ arrSelected: temp });
    }
  }

  getLatestUUID() {
    if (hasBHTPermission) {
      GET(getSysParamUUID(), (uuid) => {
        const { Uuid } = global.loginResponseData;
        if (uuid && (uuid != Uuid)) {
          global.loginResponseData.Uuid = uuid;
        }
      }, (message) => {
      }, 'getSysParamUUIDAbort');
    }
  }

  getUserClockInformation() {
    // 获取用户上下班打卡信息
    const date = new Date();
    const params = {};
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    params.TimeInfo = `${date.getFullYear()}-${month}-${day}`;
    GET(getUserClockInAndOutInformation(params), (responseData) => {
      this.showClockInfo = true;
      this.props.dispatch(
        changeUserClockInfo(
          responseData,
        ),
      );
      if (this.fourTypeEnable) {
        const { arrSelectedFour } = this.state;
        let temp = arrSelectedFour;
        if (responseData.ClockOutTime && responseData.ClockOutTime.length != 0) {
          temp[3] = true;
        } else if (responseData.ClockOutTime1 && responseData.ClockOutTime1.length != 0) {
          temp[2] = true;
        } else if (responseData.ClockInTime1 && responseData.ClockInTime1.length != 0) {
          temp[1] = true;
        } else if (responseData.ClockInTime && responseData.ClockInTime.length != 0) {
          temp[0] = true;
        }
        this.setState({ arrSelectedFour: temp });
      } else {
        const { arrSelected } = this.state;
        let temp = arrSelected;
        if (responseData.ClockOutTime && responseData.ClockOutTime.length != 0) {
          temp[1] = true;
        } else if (responseData.ClockInTime && responseData.ClockInTime.length != 0) {
          temp[0] = true;
        }
        this.setState({ arrSelected: temp });
      }
    }, (error) => {
      showMessage(messageType.error, error);
    }, 'getUserClockInAndOutInformationAbort');

    // 准备扫描蓝牙或者 使用地图考勤
    this.bluetoothReachedDetective();
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
          this.fourTypeEnable = true;
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

      this.getUserClockInformation();
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

  clickActionForClock() {
    if (this.state.buttonBackgroundColor == '#CCCCCC') {
      log('点击打卡按钮（按钮禁用状态）');
      showMessage(messageType.error, I18n.t('mobile.module.clock.cannotclocknow'));
      return;
    }

    log('点击打卡按钮（按钮启用状态）');

    let couldClockNow = '1';
    if (this.state.noDevice.CouldClockNow) {
      couldClockNow = this.state.noDevice.CouldClockNow;
    }

    if (hasBHTPermission) {
      globalParams.Remark = '';
      globalParams.SessionId = global.loginResponseData.SessionId;
      if (((this.state.noDevice.IsThisDep == '0' || (this.state.noDevice.IsThisDep == '1' && this.state.noDevice.InRestricted == '0')) && couldClockNow == '1') || this.fieldPunchRef.getReason().length != 0) {
        if (this.fieldPunchRef.getReason().length != 0) {
          globalParams.Remark = this.fieldPunchRef.getReason();
          this.fieldPunchRef.clearReason();
          this.fieldPunchRef.close();
        } else {
          if (this.state.noDevice.IsThisDep == '1' && this.state.noDevice.InRestricted == '0') {
            this.fieldPunch(I18n.t('mobile.module.clock.exception'), this.state.noDevice.MachineName, toastIcon);
          } else if (this.state.noDevice.IsThisDep == '0' && this.state.noDevice.InRestricted == '0') {
            this.fieldPunch(I18n.t('mobile.module.clock.fieldexception'), this.state.noDevice.MachineName, toastIcon);
          } else {
            this.fieldPunch(I18n.t('mobile.module.clock.fieldpunch'), this.state.noDevice.MachineName, toastIcon);
          }
          return;
        }
      }
      RNManager.showLoading('');
      POST(submitEmployeeAttendanceDataByBHT(), globalParams, (responseData) => {
        if (!this.mounted) {
          return;
        }
        globalParams.Remark = '';
        this.fieldPunchRef.close();
        RNManager.hideLoading();

        switch (responseData.state) {
          // 正常打卡
          case '0':
            this.punchSuccess(I18n.t('mobile.module.clock.punchsuccess'), responseData);
            log('正常打卡成功（蓝牙）');
            break;
          // 正常打卡异常
          case '1':
            this.fieldPunch(I18n.t('mobile.module.clock.exception'), responseData.code);
            log('正常打卡异常（蓝牙）');
            break;
          // 外勤打卡
          case '2':
            this.fieldPunch(I18n.t('mobile.module.clock.fieldpunch'), responseData.code);
            log('外勤打卡（蓝牙）');
            break;
          // 外勤打卡异常
          case '3':
            this.fieldPunch(I18n.t('mobile.module.clock.fieldexception'), responseData.code);
            log('外勤打卡异常（蓝牙）');
            break;

          default:
            break;
        }
        switch (responseData.successCode) {
          // 正常考勤打卡成功
          case '0':
            this.punchSuccess(I18n.t('mobile.module.clock.punchsuccess'), responseData);
            log('正常考勤打卡成功（蓝牙）');
            break;
          // 正常考勤位置异常打卡成功
          case '1':
            this.punchSuccess(I18n.t('mobile.module.clock.punchsuccess'), responseData);
            log('正常考勤位置异常打卡成功（蓝牙）');
            break;
          // 外勤考勤打卡成功
          case '2':
            this.punchSuccess(I18n.t('mobile.module.clock.outworkpunchsuccess'), responseData);
            log('外勤考勤打卡成功（蓝牙）');
            break;
          // 外勤考勤位置异常打卡成功
          case '3':
            this.punchSuccess(I18n.t('mobile.module.clock.outworkpunchsuccess'), responseData);
            log('外勤考勤位置异常打卡成功（蓝牙）');
            break;

          default:
            break;
        }
      }, (message) => {
        RNManager.hideLoading();
        showMessage(messageType.error, JSON.stringify(message));
      });
    } else {
      RNManager.getLocation(info => {
        if (!info.lat && !info.lng) {
          this.locationAccess.open();
          return;
        }
        const params = {};
        params.SessionId = global.loginResponseData.SessionId;
        params.Longitude = info.lng;
        params.Latitude = info.lat;
        params.Address = info.address;
        params.Remark = '';
        params.MachineID = this.state.noDevice.MachineID;
        if ((this.state.noDevice.InRestricted == '0' && couldClockNow == '1') || this.fieldPunchRef.getReason().length != 0) {
          if (this.fieldPunchRef.getReason().length != 0) {
            params.Remark = this.fieldPunchRef.getReason();
            this.fieldPunchRef.clearReason();
            this.fieldPunchRef.close();
          } else {
            this.fieldPunchRef.open(I18n.t('mobile.module.clock.fieldpunch'), params.Address, errorAddress);
            return;
          }
        }
        RNManager.showLoading('');
        POST(submitLocationPunch(), params, (responseData) => {
          if (!this.mounted) {
            return;
          }
          RNManager.hideLoading();
          switch (responseData.successCode) {
            case '0':
              log('打卡成功（定位）');

              this.punchSuccess(I18n.t('mobile.module.clock.punchsuccess'), responseData);
              break;
            case '2':
              log('打卡成功（定位）');

              this.punchSuccess(I18n.t('mobile.module.clock.outworkpunchsuccess'), responseData);
              break;

            case '4':
              log('外勤打卡成功（定位）');

              this.fieldPunchRef.open(I18n.t('mobile.module.clock.punchpositionexception'), globalParams.Address, noLocImg);
              break;

            default:
              break;
          }
        }, (message) => {
          RNManager.hideLoading();
          showMessage(messageType.error, message);
        });
      });
    }
  }

  backViews() {
    if (!this.mounted) {
      return;
    }

    if (this.props.shouldBackHome) {
      currentPage = false;
      this.props.navigator.resetTo({
        component: Tab,
      });
      this.onReset();
    } else {
      this.props.navigator.pop();
    }
  }

  beaconStart() {
    if (!this.mounted) {
      return;
    }

    beaconsGlobal = [];
    beaconsIndex = 0;
    couldScanNow = false;
    Beacon.start();
    this.setState({
      noDevice: 'Scanning...',
      imageState: clockLoading,
      buttonBackgroundColor: '#CCCCCC',
    });
    this.beaconStartTimeOut();
  }

  beaconStartTimeOut() {
    this.stopDetectiveBluetooth = setTimeout(() => {
      Beacon.stop();
      beaconsGlobal = {
        beacons: [{
          major: 99999,
          minor: 99999,
          uuid: 'null',
          accuracy: -1,
          rssi: 0,
          proximity: 'unknown'
        }],
        region: {
          uuid: 'null',
          identifier: 'null'
        }
      };
      this.resetBluetoothDetective();
      couldScanNow = true;
      if (hasGPSPermission) {
        this.useAddressOrNot.open();
      }
    }, 8000);
  }

  bluetoothReachedDetective() {
    if (hasBHTPermission) {
      this.bluetoothDetctive();
    } else {
      RNManager.GPSEnabled(
        (GPSvalue) => {
          if (!GPSvalue) {
            this.GPS.open();
          } else {
            RNManager.wifiEnabled(
              (WiFivalue) => {
                if (!WiFivalue && WiFiNeedShowOnce) {
                  const data = {};
                  this.submitBHTClockInformation(data);
                  WiFiNeedShowOnce = false;
                  this.WiFi.open();
                } else {
                  const data = {};
                  this.submitBHTClockInformation(data);
                }
              },
            );
          }
        },
      );
    }
  }

  bluetoothDetctive() {
    if (!couldScanNow) {
      return;
    }
    this.NoJurisdictionOfBluetooth = true;

    RNManager.bluetoothEnabled(
      (value) => {
        if (!value) {
          this.resetBluetoothDetective();
          this.bluetooth.open();
        } else {
          RNManager.GPSEnabled(
            (GPSvalue) => {
              if (!GPSvalue) {
                this.resetBluetoothDetective();
                this.GPS.open();
              } else {
                RNManager.wifiEnabled(
                  (WiFivalue) => {
                    if (!WiFivalue && WiFiNeedShowOnce) {
                      WiFiNeedShowOnce = false;
                      this.resetBluetoothDetective();
                      this.beaconStart();
                      this.NoJurisdictionOfBluetooth = false;
                      this.WiFi.open();
                    } else {
                      this.beaconStart();
                      this.NoJurisdictionOfBluetooth = false;
                    }
                  },
                );
              }
            },
          );
        }
      },
    );
  }

  useAddressOnly() {
    // 使用地图打卡
    hasBHTPermission = false;
    this.bluetoothReachedDetective();
  }

  checkBeaconsVaild(beacons) {
    const temp = [];
    for (let i = 0; i < beacons.length; i += 1) {
      if (beacons[i].proximity != 'unknown') {
        temp.push(beacons[i]);
      }
    }

    return temp;
  }

  fieldPunch(title, code) {
    // 外勤打卡
    this.fieldPunchRef.open(title, code, toastIcon);
  }

  punchSuccess(title, responseData) {
    // 成功打卡
    couldBackNow = true;
    this.punchSuccessRef.open(I18n.t('mobile.module.clock.punchsuccess'), responseData.timestamp);

    // 3s后返回首页
    this.closeModalTimer = setTimeout(() => {
      this.backViews();
      this.punchSuccessRef.close();
      showMessage(messageType.success, `${I18n.t('mobile.module.clock.punchsuccessprompt')}${responseData.timestamp}`);
    }, 3000);
  }

  submitBHTClockInformation(data) {
    // 获取员工当前的考勤环境（判断此时是否支持打卡）
    RNManager.getLocation(info => {
      if (!info.lat) {
        this.locationAccess.open();
        return;
      }

      const params = {};
      if (hasBHTPermission) {
        params.ClockType = 'APP_BHT';
        if (!data) {
          params.Major = '';
          params.Minor = '';
        } else {
          params.Major = data.major;
          params.Minor = data.minor;
        }
      } else {
        params.ClockType = 'APP_GPS';
        params.Major = '';
        params.Minor = '';
      }
      params.Longitude = info.lng;
      params.Latitude = info.lat;
      globalParams = params;
      globalParams.Address = info.address;
      GET(getUserDeterminefAddressIsInRestriction(params), (responseData) => {
        if (!this.mounted) {
          return;
        }
        couldScanNow = true;

        if (hasBHTPermission) {
          if ((responseData.CouldClockNow == '0' || (responseData.InRestricted == '0' && responseData.Flag == '1')) && beaconsIndex < (beaconsGlobal.length - 1)) {
            beaconsIndex += 1;
            this.submitBHTClockInformation(beaconsGlobal[beaconsIndex]);
            return;
          }
          let buttonColor = Style.color.mainColorLight;
          let imageT = bluetooth;
          if (responseData.Flag == '1' && responseData.InRestricted == '0' && responseData.MachineID != '') {
            buttonColor = '#CCCCCC';
          } else if (responseData.IsThisDep == '0') {
            buttonColor = '#FF943E';
            imageT = bluetoothOther;
          }
          this.setState({
            submitButtonDisabled: false,
            buttonBackgroundColor: buttonColor,
            noDevice: responseData,
            imageState: imageT,
          });
        } else {
          let buttonColor = Style.color.mainColorLight;
          let imageT = location;
          if (responseData.InRestricted == '0' && responseData.Flag == '1') {
            buttonColor = '#CCCCCC';
            imageT = notInLocation;
          } else if (responseData.InRestricted == '0' && responseData.Flag == '2') {
            buttonColor = '#FF943E';
            imageT = notInLocation;
          }
          this.setState({
            submitButtonDisabled: false,
            buttonBackgroundColor: buttonColor,
            noDevice: responseData,
            imageState: clockConfirm,
          });
        }
      }, (error) => {
        couldScanNow = true;
        showMessage(messageType.error, error);
        if (hasBHTPermission) {
          this.resetBluetoothDetective();
        }
      }, 'getUserDeterminefAddressIsInRestrictionAbort');
    });
  }

  takeMeToTheQRCSModule() {
    this.props.navigator.push({
      component: ScanQrCheckIn,
      isComeFromBluetooth: true,
    });
  }

  rePositionAndReScan(isReSet) {
    if (!couldScanNow && !isReSet) {
      return;
    }

    RNManager.startLocationService();
    if (hasBHTPermission) {
      if (this.NoJurisdictionOfBluetooth) {
        this.bluetoothDetctive();
      } else {
        this.beaconStart();
      }
    } else {
      this.bluetoothReachedDetective();
    }
  }

  resetBluetoothDetective() {
    if (!this.mounted) {
      return;
    }
    this.setState({
      buttonBackgroundColor: '#CCCCCC',
      noDevice: '无法获取到周围的蓝牙考勤设备',
      imageState: clockWarning,
    });
  }

  returnItem(title, time, selected, showDetail, machineID, address) {
    // 复用 item 单个打卡数据源
    let item = {};
    item.title = title;
    item.time = time;
    item.selected = selected;
    item.showDetail = showDetail;
    item.machineID = machineID;
    item.address = address;
    return item;
  }

  renderTopView() {
    return (
      <UserShiftInfo />
    );
  }

  renderClockInfo() {
    // 显示用户班别信息
    const { userClockInfo } = this.props;
    const index = this.fourTypeEnable ? 4 : 2;

    return (
      <ScrollView style={{ flex: 1 }} bounces={false}>
        {this.renderClockInfoDetail()}
        <Line />
      </ScrollView>
    );
  }

  renderClockInfoDetail() {
    // 显示用户上下班信息
    const { userClockInfo, userWorkingTime } = this.props;
    if (!this.showClockInfo) return null;
    const { arrSelected, arrSelectedFour } = this.state;
    const length = this.fourTypeEnable ? 4 : 2;
    let arr = [];
    let arrMessage = [];
    if (this.fourTypeEnable) {
      arrMessage.push(this.returnItem('上班打卡1', getHHmmFormat(userClockInfo.ClockInTime), false, arrSelectedFour[0], userClockInfo.ClockInMachine, userClockInfo.ClockInAddress));
      arrMessage.push(this.returnItem('下班打卡1', getHHmmFormat(userClockInfo.ClockInTime1), false, arrSelectedFour[1], userClockInfo.ClockInMachine1, userClockInfo.ClockInAddress1));
      arrMessage.push(this.returnItem('上班打卡2', getHHmmFormat(userClockInfo.ClockOutTime1), false, arrSelectedFour[2], userClockInfo.ClockOutMachine1, userClockInfo.ClockOutAddress1));
      arrMessage.push(this.returnItem('下班打卡2', getHHmmFormat(userClockInfo.ClockOutTime), false, arrSelectedFour[3], userClockInfo.ClockOutMachine, userClockInfo.ClockOutAddress));
    } else {
      arrMessage.push(this.returnItem('上班打卡', getHHmmFormat(userClockInfo.ClockInTime), false, arrSelected[0], userClockInfo.ClockInMachine, userClockInfo.ClockInAddress));
      arrMessage.push(this.returnItem('下班打卡', getHHmmFormat(userClockInfo.ClockOutTime), false, arrSelected[1], userClockInfo.ClockOutMachine, userClockInfo.ClockOutAddress));
    }
    for(let i = 0; i < length; i++) {
      arr.push(
        <ClockStatusModul
          key={i}
          index={i}
          showDetail={arrMessage[i].showDetail}
          title={arrMessage[i].title}
          time={arrMessage[i].time}
          machineID={arrMessage[i].machineID}
          address={arrMessage[i].address}
          onSelected={(index, isUnfold) => this.onSelected(index, isUnfold)} />)
    }
    return arr;
  }

  renderClockStatus() {
    // 渲染当前视图底部的考勤状态 (是否扫描到了考勤设备、是否进入了考勤范围)
    const { noDevice, imageState } = this.state;
    let textLeft = hasBHTPermission ? '扫描周围蓝牙设备中' : '';
    let textRight = '';
    let textBottomLeft = '';     // 例：进入考勤范围：
    let textBottomRight = '';    // 例：江苏省苏州市吴中区竹园路209号创业园
    let colorTop = '#14bE4B';
    let colorBottom = '#14bE4B';
    let imageAddress;
    let imageStateTemp = hasBHTPermission ? imageState : '#EMPTY_EMPTY_EMPTY#';
    if (noDevice == '无法获取到周围的蓝牙考勤设备' && hasBHTPermission) {
      // 有蓝牙权限 && 未搜索到蓝牙设备
      if (hasBHTPermission) {
        textLeft = '无法获取当前考勤设备：';
        textRight = I18n.t('mobile.module.clock.taptoredetective');
      } else {
        textBottomLeft = '当前没有进入考勤范围：';
        textBottomRight = I18n.t('mobile.module.clock.taptoreposition');
      }
    } else if (noDevice.length != 0 && noDevice != 'Scanning...') {
      // 扫描蓝牙设备 或者定位成功
      if (noDevice.InRestricted == '1') {
        // 在位置限制范围内
        textBottomLeft = I18n.t('mobile.module.clock.enterclockposition');
        textBottomRight = noDevice.Address;
        imageAddress = location;
        colorBottom = '#999999';
      } else {
        // 不在位置限制范围内
        textBottomLeft = I18n.t('mobile.module.clock.notenterclockposition');
        textBottomRight = I18n.t('mobile.module.clock.taptoreposition');
        imageAddress = notInLocation;
      }

      if (hasBHTPermission) {
        if (noDevice.CouldClockNow == '1') {
          if (noDevice.IsThisDep == '1') {
            textLeft = I18n.t('mobile.module.clock.catchbledevice');
            textRight = noDevice.MachineName;
            colorTop = '#999999';
          } else {
            textLeft = I18n.t('mobile.module.clock.notselfdepartmachine');
            textRight = noDevice.MachineName;
            colorTop = '#999999';
          }
          
        } else {
          textLeft = '当前设备无法打卡：';
          textRight = I18n.t('mobile.module.clock.taptoredetective');
          textBottomLeft = '';
          textBottomRight = '';
          imageAddress = '#EMPTY_EMPTY_EMPTY#';
        }
      } else {
        if (noDevice.InRestricted == '1') {
          textBottomLeft = '当前已进入考勤范围：';
          textBottomRight = noDevice.Address;
          colorBottom = '#999999';
        } else {
          textBottomLeft = '当前没有进入考勤范围：';
          textBottomRight = I18n.t('mobile.module.clock.taptoreposition');
        }
      }
    }

    if (global.loginResponseData.BackGroundVersion == 'N1') {
      textLeft = '';
      textRight = '';
      textBottomLeft = '';
      textBottomRight = '';
      imageAddress = '#EMPTY_EMPTY_EMPTY#';
      imageStateTemp = '#EMPTY_EMPTY_EMPTY#';
    }

    return (
      <View style={{ marginBottom: 0, height: 65, width: device.width, backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center', marginHorizontal: 18 }}>
          {imageStateTemp != '#EMPTY_EMPTY_EMPTY#' ?
            <Image style={{ height: 14, width: 14 }} source={{ uri: imageStateTemp }}/> : 
            <View style={{ height: 14, width: 14 }} /> }
          <Text style={{ color: '#999', fontSize: 14, marginLeft: 5 }}>{textLeft}</Text>
          
          <TouchableHighlight
            onPress={() => textRight == I18n.t('mobile.module.clock.taptoredetective') ? this.rePositionAndReScan(true) : this.rePositionAndReScan(false)}
            disabled={textRight == I18n.t('mobile.module.clock.taptoredetective') ? false : true}
            style={{ flex: textRight.length > 15 ? 1 : 0, }} >
            <Text numberOfLines={1} style={{ color: colorTop, fontSize: 14 }}>{textRight}</Text>
          </TouchableHighlight>
        </View>

        <View style={{ alignSelf: 'center', alignItems: 'center', marginTop: 12, flexDirection: 'row', marginHorizontal: 18  }}>
          <Image style={{ height: 14, width: 14 }} source={{ uri: imageAddress }} />
          <Text style={{ color: '#999', fontSize: 14, marginLeft: 5 }}>{textBottomLeft}</Text>
          
          <TouchableHighlight
            onPress={() => textBottomRight == I18n.t('mobile.module.clock.taptoreposition') ? this.rePositionAndReScan(true) : this.rePositionAndReScan(false)}
            disabled={textBottomRight == I18n.t('mobile.module.clock.taptoreposition') ? false : true}
            style={{ flex: textBottomRight.length > 15 ? 1 : 0 }} >
            <Text numberOfLines={1} style={{ color: colorBottom, fontSize: 14 }}>{textBottomRight}</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  renderViewOfClockButton() {
    const { buttonBackgroundColor } = this.state;

    return (
      <View style={styles.viewOfClockButton}>
        <TouchableOpacity
          onPress={() => this.clickActionForClock()}
          disabled={this.state.submitButtonDisabled}
          style={[styles.viewOfClocButtonInner, { backgroundColor: buttonBackgroundColor, shadowColor: buttonBackgroundColor }]}>
          <Text style={styles.textClockTitle}>{I18n.t('mobile.module.clock.clock')}</Text>
          <Time />
        </TouchableOpacity>
      </View >
    );
  }

  render() {
    return (
      <View style={{ flexGrow: 1, backgroundColor: '#fff' }}>

        <NavBar
          barStyle="light-content"
          title={I18n.t('mobile.module.clock.navigationbartitlemobilecheckin')}
          titleColor="white"
          lineColor={Style.color.mainColorLight}
          backgroundColor={Style.color.mainColorLight}
          onPressLeftButton={() => this.backViews()}
          rightContainerLeftButtonTitle={this.state.QRCSButtonTitle}
          rightContainerLeftButtonTitleColor="white"
          backImage={leftBack}
          onPressRightContainerLeftButton={() => this.takeMeToTheQRCSModule()} />

        {this.renderTopView()}
        <Line />
        <View style={styles.viewLine} />
        
        <View style={{ flex: 1}}>
          {this.renderClockInfo()}
        </View>

        {this.renderViewOfClockButton()}
        {this.renderClockStatus()}

        <ModalWithImage
          ref={bluetoothRef => this.bluetooth = bluetoothRef}
          title={I18n.t('mobile.module.clock.openble')}
          subTitle={I18n.t('mobile.module.clock.openblesubtitle')}
          topButtonTitle={I18n.t('mobile.module.clock.openble')}
          topButtonPress={() => {
            RNManager.openBluetooth();
            this.bluetooth.close();
          }}
          bottomButtonTitle={I18n.t('mobile.module.clock.homeback')}
          bottomButtonPress={() => this.backViews()}
        />
        <ModalWithImage
          ref={GPS => this.GPS = GPS}
          title={I18n.t('mobile.module.clock.opengps')}
          subTitle={I18n.t('mobile.module.clock.opengpssubtitle')}
          topButtonTitle={I18n.t('mobile.module.clock.opengps')}
          topButtonPress={() => {
            RNManager.openGPS();
            this.GPS.close();
          }}
          onClosed={() => {
            RNManager.startLocationService();
          }}
          bottomButtonTitle={I18n.t('mobile.module.clock.homeback')}
          bottomButtonPress={() => this.backViews()}
        />
        <ModalWithImage
          ref={WiFi => this.WiFi = WiFi}
          title={I18n.t('mobile.module.clock.openwifi')}
          subTitle={I18n.t('mobile.module.clock.openwifisubtitle')}
          topButtonTitle={I18n.t('mobile.module.clock.openwifi')}
          topButtonPress={() => {
            RNManager.openWifi();
            this.WiFi.close();
          }}
          bottomButtonTitle={I18n.t('mobile.module.clock.notopenwifi')}
          bottomButtonPress={() => this.WiFi.close()}
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
              this.resetBluetoothDetective();
            });
          }}
          bottomButtonTitle={I18n.t('mobile.module.clock.homeback')}
          bottomButtonPress={() => {
            this.backViews();
          }}
        />
        <ModalWithInput
          ref={fieldPunch => this.fieldPunchRef = fieldPunch}
          leftButtonTitle={I18n.t('mobile.module.clock.punchagain')}
          rightButtonTitle={I18n.t('mobile.module.clock.fieldinputsubtitle')}
          leftButtonPress={() => {
            this.fieldPunchRef.clearReason();
            this.fieldPunchRef.close();
          }}
          rightButtonPress={() => {
            if (this.fieldPunchRef.getReason().length == 0) {
              showMessage(messageType.error, I18n.t('mobile.module.clock.reasonfieldpunch'));
            } else {
              this.clickActionForClock();
            }
          }}
        />
        <ModalWithImage
          ref={useAddressOrNot => this.useAddressOrNot = useAddressOrNot}
          image={noBluetoothAlert}
          subTitle={I18n.t('mobile.module.clock.useaddressornot')}
          topButtonTitle={I18n.t('mobile.module.clock.use')}
          topButtonPress={() => {
            this.useAddressOrNot.close();
            this.useAddressOnly();
          }}
          bottomButtonTitle={I18n.t('mobile.module.clock.cancel')}
          bottomButtonPress={() => {
            this.useAddressOrNot.close();
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
          bottomButtonPress={() => this.backViews()}
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
  navBar: {
    backgroundColor: Style.color.mainColorLight,
  },

  // viewTop
  viewTop: {
    marginTop: 0,
    width: device.width,
    height: 70,
    backgroundColor: Style.color.mainColorLight,
  },
  viewInfo: {
    marginTop: 16,
    height: 61,
    flexDirection: 'row',
    width: device.width,
  },
  viewSpot: {
    marginLeft: 18,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  textDay: {
    marginTop: 3,
    color: Style.color.mainColorLight,
    fontWeight: 'bold',
    fontSize: 18,
  },
  textMonth: {
    fontSize: 11,
    color: Style.color.mainColorLight,
  },
  viewShift: {
    marginTop: 5,
    marginLeft: 11,
    height: 40,
    width: device.width - 74,
    flexGrow: 1,
  },
  textShift: {
    fontSize: 14,
    color: '#fff',
    justifyContent: 'center',
  },

  // view of clock
  viewOfClock: {
    marginTop: 0,
  },
  viewOfClock2: {
    marginTop: 11,
  },
  viewLine: {
    marginTop: 0,
    width: device.width,
    height: 10,
    backgroundColor: '$color.containerBackground',
  },
  viewClockInfo: {
    marginTop: 11,
    width: device.width,
    height: 27,
    flexDirection: 'row',
  },
  imageIcon: {
    marginLeft: 32.5,
    height: 16,
    width: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  textClock: {
    marginLeft: 11,
    fontSize: 14,
    justifyContent: 'center',
  },
  textClockTime: {
    marginLeft: 6,
    fontSize: 14,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  textClockMachineTitle: {
    marginLeft: 11,
    fontSize: 12,
    justifyContent: 'center',
  },
  textClockMachine: {
    // marginTop: 3.5,
    marginLeft: 6,
    fontSize: 12,
    color: '#B5B5B5',
    justifyContent: 'center',
  },
  textAddressRePosition: {
    // marginTop: 3,
    marginLeft: 6,
    fontSize: 12,
    color: Style.color.mainColorLight,
    justifyContent: 'center',
  },

  // view clock button
  viewOfClockButton: {
    marginBottom: 20,
    height: 140,
    width: 140,
    borderRadius: 70,
    alignSelf: 'center',
    backgroundColor: device.isIos ? 'white' : '#EAEAEA',
  },
  textClockTitle: {
    width: 100,
    marginTop: 40,
    fontSize: 17,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FFF',
    backgroundColor: 'transparent',
  },
  viewOfClocButtonInner: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,

    marginTop: 5,
    width: 130,
    height: 130,
    borderRadius: 65,
    alignSelf: 'center',
    alignItems: 'center',
  },
  whiteEnd: {
    backgroundColor: '#FFF',
    position: 'absolute',
    height: 15,
    width: 18,
    marginLeft: device.width - 18,
  },

  // 上下班打卡时间显示
  viewClockInTime: {
    width: device.width,
    height: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default connect((state) => {
  const { userWorkingTime, userShift, userClockInfo } = state.mobileCheckInReducer;
  return {
    userWorkingTime,
    userShift,
    userClockInfo,
  };
})(MobileCheckIn);
