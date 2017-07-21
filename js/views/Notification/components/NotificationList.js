/**
 * 通知信息的列表组件的页面
 */

import React, { PureComponent } from 'react';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import Image from '@/common/components/CustomImage';
import Line from '@/common/components/Line';
import Text from '@/common/components/TextField';
import { device } from '@/common/Util';
import { getSubInfo, getDateByCompared, getYYYYMMDDhhmmFormat } from '@/common/Functions';
import { isExistAtt, isTop, isLoadNotice, isLoadAuthorization, isLoadAttendance, getMonth } from '../constants';

const rightArrow = 'right_arrow';
const authorization = 'noti_authorization';

export default class NotificationList extends PureComponent {

  onShowTitle() {
    const { Notification, NotiType } = this.props;
    let titleTemp = '';
    if (!Notification.TITLE) {
      titleTemp = '';
    } else {
      switch (NotiType) {
        case isLoadNotice:
          titleTemp = Notification.TITLE;
          break;
        case isLoadAuthorization:
          titleTemp = `${I18n.t('mobile.module.notification.notiauthorization')}:${Notification.TITLE}`;
          break;
        case isLoadAttendance:
          titleTemp = I18n.t('mobile.module.notification.notiattendance');
          break;
        default:
          titleTemp = '';
          break;
      }
    }
    return (
      <View style={styles.titleStyle}>
        <Text style={styles.titleText}>{titleTemp}</Text>
      </View>
    );
  }

  // 显示日期和消息【置顶】【附件】
  onShowDateAndIcon() {
    const { Notification, Language } = this.props;
    let dataText = '';
    if (Notification.EFFECT_DATE) {
      let dataArray;
      if (Notification.TIME && Notification.TIME.length > 10) {
        dataArray = Notification.TIME.substring(0, 10).split('-');
      } else {
        dataArray = Notification.EFFECT_DATE.split('-');
      }
      if (Language == 'EN-US' || Language == 'FR-FR' || Language == 'DE-DE') {
        dataText = `${getMonth(dataArray[1], Language)} ${getSubInfo(dataArray[2], 2)}`;
      } else {
        dataText = `${dataArray[1]}${I18n.t('mobile.module.overtime.datepickermonth')}${getSubInfo(dataArray[2], 2)}${I18n.t('mobile.module.overtime.datepickerday')}`;
      }
    }
    return (
      (!dataText) ?
        null :
        <View style={styles.iconDirection}><Text style={styles.dataText}>{dataText}</Text>
          {
            ((!Notification.SW_PLACED_TOP) || Notification.SW_PLACED_TOP != isTop) ?
              null :
              <Text containerStyle={styles.iconBackgroundTop} style={styles.iconText} numberOfLines={1}>{I18n.t('mobile.module.notification.notitop')}</Text>
          }
          {
            ((!Notification.SW_EXIST_ATT) || Notification.SW_EXIST_ATT != isExistAtt) ?
              null :
              <Text containerStyle={styles.iconBackgroundAtt} style={styles.iconText} numberOfLines={1}>{I18n.t('mobile.module.notification.notiatt')}</Text>
          }
        </View>
    );
  }

  // 显示图片信息
  onShowPicture() {
    const { Notification, NotiType } = this.props;
    // 显示授权信息的图片信息
    if (NotiType === isLoadAuthorization) {
      return (
        <View style={styles.showImageStyle}>
          <Image source={{ uri: authorization }} style={styles.showImage} />
        </View>
      );
    }
    // 显示通知的图片信息
    return (
      <View style={styles.showImageStyle}>
        {
          (!Notification.ATT_URL) ?
            null :
            <Image source={{ uri: Notification.ATT_URL }} style={styles.showImage} />
        }
      </View>
    );
  }

  // 显示底部信息
  onShowBottom(abstract) {
    const { NotiType, Notification } = this.props;
    if (NotiType === isLoadAttendance) {
      let time;
      if (Notification.TIME.length > 10) {
        time = Notification.TIME.substring(10, Notification.TIME.length);
      } else {
        time = Notification.TIME;
      }
      return (
        <View style={[styles.abstractStyle, { marginBottom: 20 }]}>
          <View>
            <Text style={{ color: '#2e4684', fontSize: 15 }} numberOfLines={3}>{abstract}</Text>
          </View>
          <View>
            <Text style={{ color: '#000000' }}>{`${I18n.t('mobile.module.notification.notiattendancedate')}: ${time}`}</Text>
          </View>
        </View>
      );
    }
    return (
      <View>
        <View style={styles.abstractStyle}>
          <Text style={styles.abstractText} numberOfLines={5}>{abstract}</Text>
        </View>
        <View style={styles.lineViewBg}>
          <Line style={styles.lineView} />
        </View>
        <View style={styles.bottomStyle}>
          <Text style={styles.detailText}>
            {
              (NotiType === isLoadAuthorization) ? I18n.t('mobile.module.notification.notisetauthorization') : I18n.t('mobile.module.notification.notidetail')
            }
          </Text>
          <Image source={{ uri: rightArrow }} style={styles.showRightArrow} />
        </View>
      </View>
    );
  }

  render() {
    // 获取显示的列表数据
    const { Notification, Language } = this.props;
    const effectDate = (!Notification.EFFECT_DATE) ? '' : Notification.EFFECT_DATE;
    let abstract = '';
    if (!Notification.ABSTRACT) {
      abstract = (!Notification.DETAILED_CONTENT) ? '' : Notification.DETAILED_CONTENT;
    } else {
      abstract = Notification.ABSTRACT;
    }
    return (
      <View style={styles.viewFlex}>
        <Text style={styles.effectDateText} numberOfLines={1}>{getDateByCompared(effectDate, Language, getYYYYMMDDhhmmFormat)}</Text>
        <View style={styles.contentStyle}>
          {this.onShowTitle()}
          {this.onShowDateAndIcon()}
          {this.onShowPicture()}
          {this.onShowBottom(abstract)}
        </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  viewFlex: {
    flex: 1,
    marginHorizontal: 18,
  },
  // 时间显示
  effectDateText: {
    height: 20,
    fontSize: 10,
    marginTop: 26,
    color: '#c9c9c9',
    alignSelf: 'center',
  },
  // 中间的内容
  contentStyle: {
    marginTop: 8,
    borderRadius: 2,
    width: device.width - 36,
    backgroundColor: '#ffffff',
  },
  // 标题
  titleStyle: {
    marginHorizontal: 11,
  },
  titleText: {
    // flex: 1,
    color: '#000000',
    fontSize: 18,
    marginTop: 14,
  },
  // 小标题
  iconDirection: {
    flexDirection: 'row',
  },
  iconBackgroundTop: {
    backgroundColor: '#1fd662',
    borderRadius: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 11,
    marginTop: 8,
    minWidth: 36,
    height: 14,
  },
  iconBackgroundAtt: {
    backgroundColor: '#f39800',
    borderRadius: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 11,
    marginTop: 8,
    minWidth: 36,
    height: 14,
  },
  iconText: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontSize: 11,
    alignSelf: 'center',
  },
  // 日期
  dataText: {
    marginTop: 8,
    marginLeft: 11,
    fontSize: 14,
    color: '#cccccc',
  },
  // 显示图片信息
  showImageStyle: {
    alignSelf: 'center',
    width: device.width - 58,
    marginTop: 8,
  },
  showImage: {
    alignSelf: 'center',
    width: device.width - 58,
    height: (device.width - 58) * (36 / 65),
    resizeMode: Image.resizeMode.contain,
  },
  // 摘要
  abstractStyle: {
    marginTop: 14,
    marginHorizontal: 11,
  },
  abstractText: {
    color: '#9b9b9b',
    fontSize: 14,
  },
  // 底部的横线
  lineViewBg: {
    alignSelf: 'center',
    width: device.width - 58,
  },
  lineView: {
    width: device.width - 58,
    marginTop: 14,
  },
  // 显示底部
  bottomStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 11,
    height: 44,
  },
  // 查看详情
  detailText: {
    color: '#656566',
    fontSize: 14,
    alignSelf: 'center',
  },
  // 显示右箭头
  showRightArrow: {
    height: 13,
    width: 13,
    alignSelf: 'center',
  },
});