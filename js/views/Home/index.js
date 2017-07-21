import React, { PureComponent } from 'react';
import {
  AppState,
  DeviceEventEmitter,
  InteractionManager,
  NativeModules,
  ScrollView,
  Text,
  View,
} from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import SplashScreen from 'rn-splash-screen';
import Popover from 'react-native-popover';

import Line from '@/common/components/Line';
import MyFormHelper from '@/views/MyForms/MyFormHelper';
import PushNotificationModule from '@/views/TipSetting/PushNotificationModule';
import CommissionHelper from '@/views/CommissionCalculation/constants/CommissionHelper';
import PeriodTypeHelper from '@/views/SelfPerformance/PeriodTypeHelper';
import Alert from '@/common/components/Alert';
import MobileCheckIn from '@/views/MobileCheckIn';
import ScanQrCheckIn from '@/views/MobileCheckIn/ScanQrCheckIn';
import MyForms from '@/views/MyForms';
import { device } from '@/common/Util';
import NavBar from '@/common/components/NavBar';
import { navBar } from '@/common/Style';
import { getCurrentLanguage, checkPermissionOfModule } from '@/common/Functions';
import { languages } from '@/common/LanguageSettingData';
import { saveUserInfoToLocal } from '@/common/components/Login/LoginRequest';

import Chart from './Chart';
import List from './List';

const pushNotificationModule = new PushNotificationModule();
const myFormHelper = new MyFormHelper();
const commissionHelper = new CommissionHelper();
const periodTypeHelper = new PeriodTypeHelper();
const { RNManager, RNKeychainManager } = NativeModules;

let currentState = '';

export default class Home extends PureComponent {
  constructor(props) {
    super(props);
    pushNotificationModule.initDate();
    periodTypeHelper.sendRequest();
    periodTypeHelper.sendSelfPerformanceFilterRequest();
    if (!global.loginResponseData.PlatForm) {
      pushNotificationModule.getTodaySchedule();
      myFormHelper.sendRequestFormTypes();
    }
    this.state = {
      companyName: null,
      isVisible: false,
      buttonRect: {},
    };

    this.checkCompanyTitle();
    currentState = AppState.currentState;
  }

  /** life cycle */

  componentDidMount() {
    // if (device.isIos) {
      RNManager.disableAutorotate();
    // }
    // 加载考核期的信息
    commissionHelper.initData();
    // iOS启用键盘与输入框保持间距
    if (device.isIos) RNManager.enableKeyboardManager();
    InteractionManager.runAfterInteractions(() => {
      SplashScreen.hide();
    });

    if (device.isIos) {
      RNManager.resetEntranceType();
      AppState.addEventListener('change', this.actionFor3DTouch);
    }
    this.languageChanged = DeviceEventEmitter.addListener('changeLanguage', (data) => {
      this.checkCompanyTitle();
    });
    this.mounted = true;
    saveUserInfoToLocal(global.loginResponseData);
  }

  componentWillUnmount() {
    if (device.isIos) {
      AppState.removeEventListener('change', this.actionFor3DTouch);
    }
    this.languageChanged.remove();
  }

  /** private methods */

  actionFor3DTouch = (nextAppState) => {
    if (!this.mounted) {
      return;
    }

    RNManager.getEntranceType(info => {
      if (currentState == 'background' && nextAppState == 'active') {
        if (info == 'gaia_clock') {
          this.goMobileCheckInOrMyRequest();
        } else if (info == 'gaia_request') {
          RNManager.resetEntranceType();
          this.props.navigator.push({
            component: MyForms,
          });
        }
      }

      currentState = nextAppState;
    });
  }

  checkCompanyTitle() {
    let companyName = '';
    if (!global.companyResponseData) {
      return;
    }
    companyName = global.companyResponseData.companyName;
    getCurrentLanguage().then(lan => {
      const k = languages.indexOf(lan);
      this.setState({
        companyName: companyName[k],
      });
    });
  }

  goMobileCheckInOrMyRequest() {
    RNManager.resetEntranceType();
    const hasPermission = checkPermissionOfModule('S010010');
    if (!hasPermission) {
      return;
    }
    const punchTypeList = global.companyResponseData ? global.companyResponseData.attendance : null;
    if (punchTypeList.length == 1 && punchTypeList[0] == 'APP_QR') {
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

  showPopover(px, py, width, height) {
    this.setState({
      isVisible: true,
      buttonRect: { x: px, y: py, width, height },
    });
  }

  closePopover() {
    this.setState({ isVisible: false });
  }

  /** render methods */
  //条形图显示
  renderChart() {
    if (global.companyResponseData && global.companyResponseData.config.showChart) {
      return (
        <View>
          <Line />
          <Chart showPopover={(px, py, width, height) => this.showPopover(px, py, width, height)} />
          <Line />
          <View style={{ backgroundColor: '#efeeef', height: 10 }} />
        </View>
      );
    }
  }

  render() {
    const { isVisible, buttonRect, companyName } = this.state;
    const displayArea = { x: 5, y: 20, width: device.width - 10, height: device.height - 25 };
    let temp = companyName;
    if (!temp) {
      temp = I18n.t('mobile.module.clock.navigationbartitlemobilecheckinhome');
    }
    return (
      //主页布局信息
      <View style={styles.wrapper}>
        <NavBar
          barStyle="light-content"
          title={temp}
          leftButton={false}
          backgroundColor={navBar.greenBackground}
          titleColor={navBar.title.whiteColor} />
        {/*//九宫格显示具体功能信息*/}
        <ScrollView style={styles.container}>
          <Alert />
          <View style={{ backgroundColor: '#efeeef', height: 10 }} />
          {this.renderChart()}
          <Line />
          <List navigator={this.props.navigator} />
          <Line />
        </ScrollView>
        {/*控制条形图显示的信息*/}
        <Popover
          isVisible={isVisible}
          fromRect={buttonRect}
          displayArea={displayArea}
          onClose={() => this.closePopover()}>
          <View style={styles.popoverContent}>
            <Text allowFontScaling={false} style={styles.popoverText}>{I18n.t('mobile.module.clock.popchartprompt')}</Text>
          </View>
        </Popover>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    backgroundColor: '$color.containerBackground',
    flexDirection: 'column',
  },
  popoverContent: {
    width: 200,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
  },
  popoverText: {
    color: '#ffffff',
    fontSize: 14,
  },
});
