/**
 * 通知信息的主页
 */

import {
  DeviceEventEmitter,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import Line from '@/common/components/Line';
import Text from '@/common/components/TextField';
import Image from '@/common/components/CustomImage';
import NavBar from '@/common/components/NavBar';
import { tab, device, event } from '@/common/Util';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import { GET, ABORT } from '@/common/Request';
import { navigationBar, navBar, refreshStyle } from '@/common/Style';
import { getCurrentLanguage } from '@/common/Functions';
import { getNotificationMessage } from '@/common/api';

import NotificationType from './components/NotificationType';
import NotificationTypeList from './components/NotificationTypeList';
import { isNotificationLoading, receiveDataFromServer, getCurrentLanguageBySet } from './actions';
import { isLoadNotice, isLoadAuthorization, isLoadAttendance, isClickContent } from './constants';

const imageBell = 'no_information';

class Notification extends PureComponent {

  componentDidMount() {
    this.onLoadNotificationMessage();
  }

  componentWillUnmount() {
    ABORT('getNotificationMessage');
  }

  // 更新数据的状态
  onUpdateData(tempData, isLoading) {
    const { dispatch } = this.props;
    dispatch(receiveDataFromServer(tempData));
    dispatch(isNotificationLoading(isLoading));
  }

  // 从接口中获取通知数据
  onLoadNotificationMessage = () => {
    // 获取当前的语言信息
    getCurrentLanguage().then(data => {
      this.props.dispatch(getCurrentLanguageBySet(data));
    });
    GET(
      getNotificationMessage(),
      responseData => {
        if (!responseData) {
          this.onUpdateData('', false);
          return;
        }
        // 发送角标更新通知,显示总的角标信息
        const badge = responseData.totalAmt ? parseInt(responseData.totalAmt) : 0;
        DeviceEventEmitter.emit(event.BADGE_TAB, badge);
        this.onUpdateData(responseData, false);
      },
      error => {
        showMessage(messageType.error, error);
        this.onUpdateData('', false);
      },
      'getNotificationMessage',
    );
  };

  // 解析通知的消息
  onAnalysisMessage() {
    // 是否是第一个
    this.isFirst = false;
    const { serverData, isLoading } = this.props;
    if (!serverData) {
      return;
    }
    const { newNoticeGroupList, tokenList, punchTimeList, totalAmt } = serverData;
    // 当系统刷新或者是数据都不存在的时候，返回null
    if (isLoading || (!newNoticeGroupList && !tokenList && !punchTimeList)) {
      return null;
    }
    const arrShowNotification = [];
    // 显示未读的数目
    const badge = totalAmt ? parseInt(totalAmt) : 0;
    let noticeTotal = 0;
    // 第一种信息: 获取通知的信息
    if (newNoticeGroupList && newNoticeGroupList.length != 0) {
      this.isFirst = true;
      this.times += 1;
      const tempNoticeData = [];
      for (let i = 0; i < newNoticeGroupList.length; i += 1) {
        if (newNoticeGroupList[i].SW_CLICK != isClickContent) {
          noticeTotal += 1;
        }
        tempNoticeData.push(newNoticeGroupList[i]);
      }
      arrShowNotification.push(
        this.onShowDetailNotification(
          true,
          tempNoticeData[0],
          0,
          tempNoticeData,
          noticeTotal,
          isLoadNotice,
        ),
      );
    }
    // 第二种信息: 获取令牌的信息
    if (tokenList && tokenList.length != 0) {
      let isFirstS = false;
      if (!this.isFirst) {
        this.isFirst = true;
        isFirstS = true;
      }
      const tempTokenData = [];
      for (let i = 0; i < tokenList.length; i += 1) {
        const tempData = {};
        tempData.EFFECT_DATE = tokenList[i].EFFECT_DATE;
        tempData.TITLE = `${I18n.t('mobile.module.notification.notisetlocationnext')}${tokenList[i].GroupName} ${tokenList[i].Number}${I18n.t('mobile.module.notification.notisetlocation')}`;
        tempData.ABSTRACT = I18n.t('mobile.module.notification.notiabstract');
        tempData.TOKENID = tokenList[i].TOKENID;
        tempData.MACHINEGROUPID = tokenList[i].MACHINEGROUPID;
        tempData.LAST_UPDATE_DTM = tokenList[i].LAST_UPDATE_DTM;
        tempTokenData.push(tempData);
      }
      arrShowNotification.push(
        this.onShowDetailNotification(
          isFirstS,
          tempTokenData[0],
          1,
          tempTokenData,
          badge - noticeTotal,
          isLoadAuthorization,
        ),
      );
    }
    // 第三种信息：获取打卡通知信息
    if (punchTimeList && punchTimeList.length != 0) {
      let isFirstS = false;
      if (!this.isFirst) {
        this.isFirst = true;
        isFirstS = true;
      }
      const temppunchTimeList = [];
      for (let i = 0; i < punchTimeList.length; i += 1) {
        const tempData = {};
        tempData.EFFECT_DATE = punchTimeList[i].SENTDTM;
        tempData.TITLE = I18n.t('mobile.module.notification.notiattendancesuccess');
        tempData.ABSTRACT = I18n.t('mobile.module.notification.notiattendancesuccess');
        tempData.TIME = punchTimeList[i].TIME;
        temppunchTimeList.push(tempData);
      }
      arrShowNotification.push(
        this.onShowDetailNotification(
          isFirstS,
          temppunchTimeList[0],
          2,
          temppunchTimeList,
          0,
          isLoadAttendance,
        ),
      );
    }
    return arrShowNotification;
  }

  /*
   * 显示不同通知信息的列表
   * aNotification: 一条通知信息的实体类
   * i: 显示要显示的位置
   * tempData:显示不同类型的信息的数据
   * count: 显示未读的数目
   * type: 消息的类型
   */
  onShowDetailNotification(isFirst, aNotification, i, tempData, count, type) {
    const { EFFECT_DATE, TITLE, TIME } = aNotification;
    return (
      <View key={`${i}`} style={{ flex: 1, backgroundColor: 'white' }}>
        <TouchableOpacity onPress={() => this.onGoContentDetail(tempData, type, count)}>
          <NotificationTypeList
            TITLE={TITLE}
            TIME={TIME}
            EFFECTDATE={EFFECT_DATE}
            NUMBERTOTAL={count}
            TEMPDATA={tempData}
            NOTITYPE={type}
            LANGUAGE={this.props.getLanguage}
            ISHEAD={isFirst}
          />
        </TouchableOpacity>
      </View>
    );
  }

  // 查看通知的详情列表信息
  onGoContentDetail(data, type, count) {
    this.props.navigator.push({
      component: NotificationType,
      params: {
        notiData: data,
        notiType: type,
        notiCount: count,
        language: this.props.getLanguage,
        onLoadNotificationMessage: this.onLoadNotificationMessage,
      },
    });
  }

  render() {
    const { serverData, isLoading } = this.props;
    // 判断数据是否存在
    const isFlag = serverData &&
      ((serverData.newNoticeGroupList && serverData.newNoticeGroupList.length != 0) ||
        (serverData.tokenList && serverData.tokenList.length != 0) ||
        (serverData.punchTimeList && serverData.punchTimeList.length != 0));

    return (
      <View style={styles.container}>
        <NavBar
          barStyle="light-content"
          title={I18n.t('mobile.module.notification.notinotification')}
          leftButton={false}
          backgroundColor={navigationBar.homeBackgroundColor}
          titleColor={navBar.title.whiteColor}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          refreshControl={
            (
              <RefreshControl
                refreshing={isLoading}
                onRefresh={() => this.onLoadNotificationMessage()}
                progressBackgroundColor={refreshStyle.progressBackgroundColor}
                colors={refreshStyle.colors}
                tintColor={refreshStyle.tintColor}
              />
            )
          }
        >
          {isLoading || isFlag
            ? <View style={styles.onNoDataBg} />
            : <View style={styles.viewOfBell}>
              <Image style={styles.imageOfBell} source={{ uri: imageBell }} />
              <Text style={styles.textBellowBell}>{I18n.t('mobile.module.notification.notinonotification')}</Text>
              <Text style={styles.textBellowBell2}>{I18n.t('mobile.module.notification.notinonotification2')}</Text>
            </View>}
          {isLoading || isFlag ? <Line /> : null}
          {this.onAnalysisMessage()}
          {isLoading || isFlag ? <Line /> : null}
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
  // 顶部空格的样式
  onNoDataBg: {
    marginTop: 10,
    backgroundColor: '#ffffff',
  },
  // 刷新的scrollview 样式
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  // 没有通知消息时页面的样式
  viewOfBell: {
    height: device.height - 112,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
  },
  // 没有通知消息时图片的样式 🔔
  imageOfBell: {
    marginTop: device.height / 5,
    height: 80,
    width: 80,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  // 没有通知消息时文字样式上面
  textBellowBell: {
    marginHorizontal: 18,
    marginTop: 40,
    fontSize: 21,
    color: '#000000',
    alignSelf: 'center',
  },
  // 没有通知消息时文字样式下面
  textBellowBell2: {
    marginHorizontal: 18,
    marginTop: 8,
    fontSize: 14,
    color: '#999999',
    alignSelf: 'center',
  },
});

export default connect(state => {
  const { isLoading, serverData, getLanguage } = state.notificationReducer;
  return {
    isLoading,
    serverData,
    getLanguage,
  };
})(Notification);
