/**
 * 通知信息的不同类型通知信息列表页面
 */

import { BackAndroid, NativeModules, ScrollView, TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import I18n from 'react-native-i18n';
import EStyleSheet from 'react-native-extended-stylesheet';
import NavBar from '@/common/components/NavBar';
import SetUp from '@/views/SetUp';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import { GET, POST, ABORT } from '@/common/Request';
import { setNoticeInfo, setTokenTime, getNotificationMessage } from '@/common/api';
import { device } from '@/common/Util';
import NotificationList from './NotificationList';
import NotificationDetail from './NotificationDetail';
import { isLoadNotice, isLoadAuthorization, isLoadAttendance } from '../constants';

const { RNManager } = NativeModules;

export default class NotificationType extends PureComponent {

  constructor(...props) {
    super(...props);
    // 获取当前的语言信息
    this.language = this.props.params != undefined ? this.props.params.language : this.props.passProps.language;
    // 更新公告为已读
    this.onUpdateSetNoticeInfo();
    // 判断是否加载完
    this.mount = false;
    this.state = {
      punchList: [],
    }
  }

  componentWillMount() {
    if (this.props.passProps) {
      this.onGetDataFromServer();
    }
  }

  componentDidMount() {
    if (device.isAndroid) {
      this.listeners = [
        BackAndroid.addEventListener('hardwareBackPress', () => {
          if (this.lastBackPressed && this.lastBackPressed + 1000 >= Date.now()) {
            // 最近1秒内按过back键，不可以返回。
            return true;
          }
          this.lastBackPressed = Date.now();
          if (this.mount) {
            return true;
          }
          this.props.navigator.pop();
          return true;
        }),
      ];
    }
  }

  componentWillUnmount() {
    this.mount = false;
    if (device.isAndroid) {
      this.listeners && this.listeners.forEach(listener => listener.remove());
    }
    ABORT('setNoticeInfo');
    ABORT('setTokenTime');
    ABORT('getNotificationMessage');
  }

  // 更新公告为已读
  onUpdateSetNoticeInfo() {
    if (this.props.params != undefined && this.props.params.notiType == isLoadNotice
      && this.props.params.notiCount > 0) {
      const params = {};
      params.Niid = '';
      params.PersonID = global.loginResponseData.PersonID;
      POST(setNoticeInfo(), params, (responseData) => {
        const { onLoadNotificationMessage } = this.props.params;
        onLoadNotificationMessage();
      }, (message) => {
        const { onLoadNotificationMessage } = this.props.params;
        onLoadNotificationMessage();
        showMessage(messageType.error, message);
      }, 'setNoticeInfo');
    }
  }

  onGetDataFromServer() {
    if (this.props.passProps) {
      // 根据传递的内容的不同来显示不同的数据
      this.notiData = [];
      GET(
        getNotificationMessage(),
        responseData => {
          // 第三种信息：获取打卡通知信息
          const { punchTimeList } = responseData;
          if (punchTimeList && punchTimeList.length != 0) {
            const temppunchTimeList = [];
            for (let i = 0; i < punchTimeList.length; i += 1) {
              const tempData = {};
              tempData.EFFECT_DATE = punchTimeList[i].SENTDTM;
              tempData.TITLE = I18n.t("mobile.module.notification.notiattendancesuccess");
              tempData.ABSTRACT = I18n.t("mobile.module.notification.notiattendancesuccess");
              tempData.TIME = punchTimeList[i].TIME;
              this.notiData.push(tempData);
            }
            this.setState({
              punchList: this.notiData,
            });
          }
        }, (message) => {
          showMessage(messageType.error, message);
        }, 'getNotificationMessage');
    }
  }

  // 解析通知的消息
  onAnalysisMessageFromServer() {
    // 根据传递的内容的不同来显示不同的数据
    this.notiData = [];
    if (this.props.passProps) {
      this.notiType = this.props.passProps.notiType;
      const arrShowNotification = [];
      for (let i = 0; i < this.state.punchList.length; i += 1) {
        arrShowNotification.push(this.onShowDetailNotification(this.state.punchList[i], i, this.notiType));
      }
      return arrShowNotification;
    }
    if (this.props.params) {
      this.notiData = this.props.params.notiData;
      this.notiType = this.props.params.notiType;
      const arrShowNotification = [];
      for (let i = 0; i < this.notiData.length; i += 1) {
        arrShowNotification.push(this.onShowDetailNotification(this.notiData[i], i, this.notiType));
      }
      return arrShowNotification;
    }
    return null;

  }

  // 显示不同通知信息的列表
  onShowDetailNotification(aNotification, i, type) {
    if (type === isLoadAttendance) {
      return (
        <NotificationList
          key={`${i}`}
          Notification={aNotification}
          Language={this.language}
          NotiType={type}
          />
      );
    }
    return (
      <TouchableOpacity
        key={`${i}`}
        onPress={() => this.onGoContentDetail(i, type)}>
        <NotificationList
          Notification={aNotification}
          Language={this.language}
          NotiType={type}
          />
      </TouchableOpacity>
    );
  }

  // 查看通知的详情信息
  onGoContentDetail(i, type) {
    if (type === isLoadAuthorization) {
      this.mount = true;
      this.onSetAuthorization(i);
      return;
    }
    this.props.navigator.push({
      component: NotificationDetail,
      params: this.notiData[i],
    });
  }

  // 设置考勤点
  onSetAuthorization(i) {
    const { TOKENID } = this.notiData[i];
    if (!TOKENID) {
      return;
    }
    // 提交信息
    const params = {};
    params.TokenID = TOKENID;
    params.language = this.language;
    RNManager.showLoading('');
    POST(setTokenTime(), params, (responseData) => {
      RNManager.hideLoading();
      const { onLoadNotificationMessage } = this.props.params;
      onLoadNotificationMessage();
      if (!responseData) {
        return;
      }
      const timeData = responseData.split('.')[0];
      const timeDataArray = timeData.split(':');
      // 表明授权时间结束
      if (timeDataArray[1] == '00' && timeDataArray[2] == '00') {
        // 返回到上一层的界面
        this.props.navigator.pop();
        // 提示操作令牌临时授权时间已超时，请重新授权
        showMessage(messageType.error, I18n.t('mobile.module.notification.notitokentime'));
        return;
      }
      // 跳转设置考勤点信息
      if (this.mount) {
        this.props.navigator.push({
          component: SetUp,
          params: {
            notiData: this.notiData[i],
            language: this.language,
            leftMinute: timeDataArray[1],
            leftSecond: timeDataArray[2],
          },
        });
      }
      this.mount = false;
    }, (message) => {
      this.mount = false;
      RNManager.hideLoading();
      const { onLoadNotificationMessage } = this.props.params;
      onLoadNotificationMessage();
      showMessage(messageType.error, message);
    }, 'setTokenTime');
  }

  render() {
    let titleType = '';
    const type = this.props.params ? this.props.params.notiType : this.props.passProps.notiType;
    switch (type) {
      case isLoadNotice:
        titleType = I18n.t('mobile.module.notification.noticompanynotification'); break;
      case isLoadAuthorization:
        titleType = I18n.t('mobile.module.notification.notiauthorization'); break;
      case isLoadAttendance:
        titleType = I18n.t('mobile.module.notification.notiattendancetitle'); break;
      default:
        titleType = '';
        break;
    }

    return (
      <View style={styles.container}>
        <NavBar title={titleType} onPressLeftButton={() => this.props.navigator.pop()} />
        <ScrollView
          showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {this.onAnalysisMessageFromServer()}
        </ScrollView>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  // 页面的样式
  container: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
  },
  // 刷新的scrollview 样式
  scrollView: {
    flex: 1,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
});