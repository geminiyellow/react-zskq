import React, { Component } from 'react';
import {
  AppState,
  NativeModules,
  View,
  DeviceEventEmitter,
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import I18n from 'react-native-i18n';
import Image from '@/common/components/CustomImage';
import EStyleSheet from 'react-native-extended-stylesheet';
import LoveCare from '@/views/LoveCare';
import FormDetailUi from '@/views/MyForms/FormDetailUi';
import realm from '@/realm';
import { checkPermissionOfModule, getCurrentLanguage} from '@/common/Functions';
import { moduleList } from '@/common/Consts';
import { validCheckInPage } from '@/views/MobileCheckIn/CheckIn'
import NotificationType from '@/views/Notification/components/NotificationType';
import NotificationDetail from '@/views/Notification/components/NotificationDetail';
import MobileCheckIn from './MobileCheckIn';
import Home from './Home';
import Mine from './Mine';
import Notification from './Notification';
import { tab, tabImages, event, device } from '../common/Util';
import Badge from '../common/components/Badge';
import UpdateModal from './../common/components/modal/UpdateModal';
import ForcedUpdate from '@/views/Update/ForcedUpdate';
import ForcedUpdateModal from '@/common/components/Login/ForcedUpdateModal';
import { setCompanyCodeMobileRequest, getFormSettingInfo, saveUserInfoToMobileCenter } from '@/common/components/Login/LoginRequest';
const forcedUpdate = new ForcedUpdate();
const { RNManager } = NativeModules;
const REMOTE_NOTIFICATION = 'REMOTE_NOTIFICATION';
const REMOTE_NOTIFICATION_BADGE_SYNC = 'REMOTE_NOTIFICATION_BADGE_SYNC';
const ACTIVE = 'active';
const REMOTE = 'remote';
// 定义主页面中的三个界面信息
const TabArr = [
  {
    // 功能
    key: tab.functionTab,
    title: 'mobile.module.home.tab.functionality',
    icon: tabImages.normal.function,
    selectedIcon: tabImages.active.function,
  },
  {
    // 通知
    key: tab.notificationTab,
    title: 'mobile.module.home.tab.notice',
    icon: tabImages.normal.notice,
    selectedIcon: tabImages.active.notice,
  },
  {
    // 我的
    key: tab.mineTab,
    title: 'mobile.module.home.tab.my',
    icon: tabImages.normal.mine,
    selectedIcon: tabImages.active.mine,
  },
];
let currentState = '';

export default class Tab extends Component {
  mixins: [React.addons.PureRenderMixin]

  constructor(...args) {
    super(...args);
    this.state = {
      selectedTab: tab.functionTab,
      showForcedUpdate: false,
    };
    // 获取当前的语言信息
    getCurrentLanguage().then(data => {
      this.language = data;
    });
    currentState = AppState.currentState;
  }

  /** Life cycle */
  componentWillMount() {
    // // 获取表单配置信息
    // getFormSettingInfo().then((data) => { }, (err) => { });
    this.listeners = [
      DeviceEventEmitter.addListener(event.SELECT_TAB, (currentTab) => {
        this.setState({
          selectedTab: currentTab,
        });
      }),
      DeviceEventEmitter.addListener(event.BADGE_TAB, (result) => {
        this.badge.reFreshData(result);
      }),
    ];
  }

  componentDidMount() {
    const updateResult = realm.objects('Config').filtered('name = "uptodate"');
    const uptodataNextStartedResult = realm.objects('Config').filtered('name = "uptodatenextstarted"');
    if (updateResult.length > 0 && updateResult[0].enable == true && uptodataNextStartedResult.length > 0 && uptodataNextStartedResult[0].enable == true) {
      this.updatemodal.open();
    }
    RNManager.remoteNotificatioinInfo((data) => {
      this.handleRemoteNotificationData(data);
      RNManager.emptyNotificationInfo();
    });
    this.remoteNotificationListener = DeviceEventEmitter.addListener(REMOTE_NOTIFICATION, (data) => {
      this.handleRemoteNotificationData(data);
      RNManager.emptyNotificationInfo();
    });
    if (device.isIos) {
      AppState.addEventListener('change', this.actionForForcedUpdate);
    }
    const needUpdate = forcedUpdate.needForcedUpdate();
    if (needUpdate) {
      this.setState({ showForcedUpdate: true });
    }

    this.badgeSyncListener = DeviceEventEmitter.addListener(REMOTE_NOTIFICATION_BADGE_SYNC, (data) => {
      // 这里调用获取九宫格角标接口
      DeviceEventEmitter.emit(event.SYNC_BADGE_EVENT, true);
    });

    // 移动云记录App 信息
    saveUserInfoToMobileCenter().then(data => { }).catch(err => { });
  }

  componentWillUnmount() {
    this.listeners && this.listeners.forEach(listener => listener.remove());
    this.remoteNotificationListener.remove();
    if (device.isIos) {
      AppState.removeEventListener('change', this.actionFor3DTouch);
    }
    this.badgeSyncListener.remove();
  }

  /** Event Response */
  actionForForcedUpdate = (nextAppState) => {
    if (currentState == 'background' && nextAppState == 'active') {
        setCompanyCodeMobileRequest().then((imageUrl) => {
          const needUpdate = forcedUpdate.needForcedUpdate();
          if (needUpdate) {
            this.setState({ showForcedUpdate: needUpdate });
          }
        }).catch((err) => { });
      }
      currentState = nextAppState;
  }

  onPress(selectedTab) {
    DeviceEventEmitter.emit(event.SELECT_TAB, selectedTab);
  }

  /** Private Method */
  handleRemoteNotificationData(notificationData) {
    if (!notificationData) return;
    let data;
    if (device.isIos) {
      data = notificationData;
    } else {
      data = JSON.parse(notificationData);
    }
    const { navigator } = this.props;
    if (data && data.state === 'clock') {
      // 如果首页有移动打卡入口
      if (checkPermissionOfModule(moduleList.mobileCheckIn)) {
        navigator.push({
          component: validCheckInPage(),
        });
      }
      return;
    }

    if (!data || !data.msg) return;
    let message;
    if (device.isIos) {
      message = JSON.parse(data.msg);
    } else {
      message = data.msg;
      message = JSON.parse(message);
    }
    if (!message || !message.type) return;
    if (device.isIos && data.state === ACTIVE) return;
    const type = `${message.type}`;
    switch (type) {
      // 其他推送消息
      case '0':
        break;
      // 表单签核推送消息
      case '1':
        {
          if (device.isIos && data.state === ACTIVE) return;
          const formDetailData = {
            formType: message.extra1,
            formDetail: {
              ProcessId: message.extra2,
              WorkItemId: message.extra3,
            },
          };
          let isHistory = false;
          if (message.extra4) {
            isHistory = true;
          }
          navigator.push({
            component: FormDetailUi,
            passProps: {
              data: formDetailData,
              bottomMenuVisible: !isHistory,
              iscacelVisible: false,
              fromVerify: false,
            },
          });
        }
        break;
      // 爱关怀推送消息
      case '2':
        navigator.push({
          component: LoveCare,
          type: REMOTE,
          aghUrl: message.extra3 ? message.extra3 : null,
        });
        break;
      // 公告推送消息
      case '4':
        navigator.push({
          component: NotificationDetail,
          passProps: {
            notiType: 1,
            notiData: {id: message.extra2},
          },
        });
      break;
      // 打卡成功推送消息
      case '5':
        navigator.push({
          component: NotificationType,
          passProps: {
            notiType: 2,
            language: this.language,
          },
        });
        break;

      default:
        break;
    }
  }

  /** Render methods */

  renderScene() {
    switch (this.state.selectedTab) {
      case tab.functionTab:
        return <Home navigator={this.props.navigator} {...this.props.passProps} />;
      case tab.notificationTab:
        return <Notification navigator={this.props.navigator} />;
      case tab.mineTab:
        return <Mine navigator={this.props.navigator} />;
      default:
        return <Home navigator={this.props.navigator} {...this.props.passProps} />;
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <TabNavigator
          tabBarStyle={styles.tabBar}
        >
          {
            TabArr.map(
              item => {
                return (
                  //页面切换的效果信息
                  <TabNavigator.Item
                    selected={this.state.selectedTab === item.key}
                    title={I18n.t(item.title)}
                    key={item.key}
                    renderIcon={
                      () => <Image
                        style={styles.icon}
                        resizeMode={'cover'}
                        source={{ uri: item.icon }}
                      />
                    }
                    renderSelectedIcon={
                      () => <Image
                        style={styles.icon}
                        resizeMode={'cover'}
                        source={{ uri: item.selectedIcon }}
                      />
                    }
                    renderBadge={() => {
                      if (item.key === tab.notificationTab) {
                        return <Badge ref={ref => { this.badge = ref; }} />;
                      }
                    }}
                    selectedTitleStyle={{ color: '#14BE4B', fontSize: 11 }}
                    titleStyle={{ color: '#999', fontSize: 11 }}
                    onPress={() => {
                      this.onPress(item.key);
                    }}
                  >
                    {this.renderScene()}
                  </TabNavigator.Item>
                );
              },
            )
          }
        </TabNavigator>
        <UpdateModal
          ref={box => this.updatemodal = box}
        />
        {this.state.showForcedUpdate ? <ForcedUpdateModal /> : null}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  tabBar: {
    height: 49,
    overflow: 'hidden',
    backgroundColor: 'white',
    borderTopColor: '$color.line',
    borderTopWidth: device.hairlineWidth,
  },
  //图片的宽高
  icon: {
    width: 25,
    height: 25,
  },
});