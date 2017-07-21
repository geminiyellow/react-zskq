/**
 * 通知信息的列表组件的页面
 */

import React, { PureComponent } from 'react';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import Image from '@/common/components/CustomImage';
import Text from '@/common/components/TextField';
import { device } from '@/common/Util';
import { getDateByCompared, getYYYYMMDDhhmmFormat } from '@/common/Functions';
import {
  isLoadNotice,
  isLoadAuthorization,
  isLoadAttendance,
} from '../constants';

const noticeImage = 'noti_notice';
const safetyImage = 'noti_authroity';
const attendanceImage = 'noti_attendance';

export default class NotificationTypeList extends PureComponent {

  render() {
    const {
      TITLE,
      EFFECTDATE,
      TIME,
      NUMBERTOTAL,
      NOTITYPE,
      LANGUAGE,
      ISHEAD,
    } = this.props;
    // 超过99，显示99+
    const total = NUMBERTOTAL > 99 ? '99+' : NUMBERTOTAL;
    let widthOfBadge = 28;
    if (NUMBERTOTAL <= 99) {
      widthOfBadge = 18;
    }
    // item的上部显示的信息和图片
    let topTitle = '';
    let imageUrl = '';
    switch (NOTITYPE) {
      case isLoadNotice:
        topTitle = I18n.t('mobile.module.notification.noticompanynotification');
        imageUrl = noticeImage;
        break;
      case isLoadAuthorization:
        topTitle = I18n.t('mobile.module.notification.notiauthorization');
        imageUrl = safetyImage;
        break;
      case isLoadAttendance:
        topTitle = I18n.t('mobile.module.notification.notiattendance');
        imageUrl = attendanceImage;
        break;
      default:
        topTitle = '';
        imageUrl = '';
        break;
    }
    // 显示打卡时间
    let time;
    if (TIME && TIME.length > 10) {
      time = TIME;
    } else {
      time = EFFECTDATE;
    }
    return (
      <View style={styles.viewFlex}>
        {ISHEAD
          ? null
          : <View style={styles.bottomLine}>
            <View style={styles.bottomLineLeft} />
            <View style={styles.bottomLineRight} />
          </View>}
        <View style={styles.systemNotificationContent}>
          <View>
            <View style={styles.companyIconBack}>
              <Image style={styles.companyIcon} source={{ uri: imageUrl }} />
            </View>
            {NUMBERTOTAL != 0
              ? <View style={[styles.badgeWrapper, { width: widthOfBadge }]}>
                <Text style={styles.badgeText}>{total}</Text>
              </View>
              : null}
          </View>
          <View style={styles.companyContent}>
            <View style={styles.systemContentTop}>
              <Text style={styles.systemContentTopTitle} numberOfLines={1}>
                {topTitle}
              </Text>
              <Text style={styles.systemContentTopTime}>
                {getDateByCompared(time, LANGUAGE, getYYYYMMDDhhmmFormat)}
              </Text>
            </View>
            <View style={styles.systemContentDown}>
              <Text style={styles.systemContentDownTitle} numberOfLines={1}>
                {TITLE}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  viewFlex: {
    flex: 1,
  },
  systemNotificationContent: {
    width: device.width,
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  companyIconBack: {
    marginLeft: 18,
    marginTop: 8,
    width: 46,
    height: 46,
    borderRadius: 46 / 2,
    justifyContent: 'center',
  },
  companyIcon: {
    width: 46,
    height: 46,
    alignSelf: 'center',
  },
  // 显示角标
  badgeWrapper: {
    position: 'absolute',
    top: 6,
    right: -8,
    height: 18,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#ffffff',
    borderStyle: 'solid',
    backgroundColor: '#f43530',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  // 显示角标文字
  badgeText: {
    color: '$color.white',
    fontSize: 10,
    textAlign: 'center',
  },
  companyContent: {
    marginLeft: 11,
    flex: 1,
    height: 60,
  },
  systemContentTop: {
    flexDirection: 'row',
    marginTop: 10,
    marginRight: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  systemContentTopTitle: {
    color: '#000000',
    flex: 1,
    fontSize: 17,
    alignSelf: 'center',
  },
  systemContentTopTime: {
    color: '#cccccc',
    fontSize: 11,
  },
  systemContentDown: {
    flexDirection: 'row',
    marginTop: 4,
    marginRight: 18,
  },
  systemContentDownTitle: {
    flex: 1,
    color: '#999999',
    fontSize: 14,
  },
  /** 消息之间的border */
  bottomLine: {
    flexDirection: 'row',
    width: device.width,
    alignSelf: 'center',
    height: 0.5,
    backgroundColor: '#D9D9D9',
  },
  bottomLineLeft: {
    width: 16,
    backgroundColor: 'white',
  },
  bottomLineRight: {
    width: device.width - 16,
    backgroundColor: '#D9D9D9',
  },
});
