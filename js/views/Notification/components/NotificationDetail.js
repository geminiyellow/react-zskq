/**
 * 通知信息的一条通知的详情信息
 */

import { ScrollView, View } from 'react-native';
import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import Image from '@/common/components/CustomImage';
import UmengAnalysis from '@/common/components/UmengAnalysis';
import Line from '@/common/components/Line';
import Text from '@/common/components/TextField';
import NavBar from '@/common/components/NavBar';
import { device } from '@/common/Util';
import { isExistAtt, isTop } from '../constants';
import { showMessage } from "@/common/Message";
import { messageType } from "@/common/Consts";
import { GET, POST, ABORT } from "@/common/Request";
import { getNoticeInfoById, setNoticeInfo } from "@/common/api";
import { getYYYYMMDDFormat } from '@/common/Functions';

const attachmentIcon = "noti_att";

export default class NotificationDetail extends PureComponent {

  constructor(...props) {
    super(...props);
    this.state = {
      detailData: [],
    }
  }


  componentWillMount() {
    UmengAnalysis.onPageBegin('NotificationDetail');
    // 显示推送的通知信息
    if (this.props.passProps) {
      if (!this.props.passProps.notiData.id) return;
      const params = {};
      params.nnid = this.props.passProps.notiData.id;
      GET(
        getNoticeInfoById(params),
        responseData => {
          this.setState({
            detailData: responseData,
          });
        },
        error => {
          showMessage(messageType.error, error);
        },
        "getNoticeInfoById"
      );
    }
  }

  // 更新公告为已读
  onUpdateSetNoticeInfo() {
    const params = {};
    params.Niid = '';
    params.PersonID = global.loginResponseData.PersonID;
    POST(setNoticeInfo(), params, (responseData) => {
    }, (message) => {
      showMessage(messageType.error, message);
    }, 'setNoticeInfo');
  }

  componentWillUnmount() {
    ABORT("getNoticeInfoById");
    ABORT('setNoticeInfo');
    UmengAnalysis.onPageEnd('NotificationDetail');
  }

  onShowDepAndDate() {
    const data = (this.state.detailData.length == 0) ? this.props.params : this.state.detailData[0];
    const {
      RELEASE_DEP,
      EFFECT_DATE,
      SW_PLACED_TOP,
      SW_EXIST_ATT
    } = data;
    // 处理发布部门，当其长度超过2个字节，就截取起本身的信息
    const depTemp = !RELEASE_DEP ? "" : RELEASE_DEP;
    return (
      <View style={styles.depAndDate}>
        <Text style={styles.depText}>{depTemp}</Text>
        <Text style={styles.dateText}>{getYYYYMMDDFormat(EFFECT_DATE)}</Text>
        {!SW_PLACED_TOP || SW_PLACED_TOP != isTop
          ? null
          : <Text
            containerStyle={styles.iconBackgroundTop}
            style={styles.iconText}
            numberOfLines={1}
            >
            {I18n.t('mobile.module.notification.notitop')}
          </Text>}
        {!SW_EXIST_ATT || SW_EXIST_ATT != isExistAtt
          ? null
          : <Text
            containerStyle={styles.iconBackgroundAtt}
            style={styles.iconText}
            numberOfLines={1}
            >
            {I18n.t('mobile.module.notification.notiatt')}
          </Text>}
      </View>
    );
  }

  render() {
    const data = (this.state.detailData.length == 0) ? this.props.params : this.state.detailData[0];
    if (!data) return null;
    // 获取显示通知的详情信息
    const {
      TITLE,
      DETAILED_CONTENT,
      SW_EXIST_ATT,
      ABSTRACT,
      ATT_URL
    } = data;
    return (
      <View style={styles.container}>
        <NavBar
          title={I18n.t('mobile.module.notification.noticompanynotification')}
          onPressLeftButton={() => this.props.navigator.pop()}
          />
        <ScrollView style={styles.scrollViewStyle}>
          <View style={styles.noticeTitle}>
            <Text style={styles.textTitle} numberOfLines={5}>{TITLE}</Text>
          </View>
          {this.onShowDepAndDate()}
          <View style={styles.abstractBg}>
            <View style={styles.viewBg} />
            <Text style={styles.abstractText} numberOfLines={5}>
              {ABSTRACT}
            </Text>
          </View>
          <Text style={styles.detailText}>{DETAILED_CONTENT}</Text>
          {!ATT_URL
            ? null
            : <View style={styles.showImageStyle}>
              <Image
                source={{ uri: ATT_URL }}
                style={styles.showImageStyle}
                />
            </View>}
        </ScrollView>
        {
          SW_EXIST_ATT === isExistAtt
            ? <View>
              <View style={styles.lineViewBg}>
                <Line style={styles.lineView} />
              </View>
              <View style={styles.attachment}>
                <Image style={styles.attachmentImage} source={{ uri: attachmentIcon }} />
                <Text style={styles.attachmentText} numberOfLines={5}>
                  {I18n.t('mobile.module.notification.notidetailattachmenttip')}
                </Text>
              </View>
            </View>
            : null}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white"
  },
  flexGrow: {
    flexGrow: 1
  },
  scrollViewStyle: {
    marginHorizontal: 18
  },
  noticeTitle: {
    marginTop: 22,
    width: device.width - 36,
    justifyContent: "flex-start"
  },
  textTitle: {
    color: "#000000",
    fontSize: 24
  },
  // 显示部门和时间信息
  depAndDate: {
    flexDirection: "row"
  },
  depText: {
    fontSize: 14,
    marginTop: 14,
    color: "#1fd662"
  },
  dateText: {
    marginLeft: 11,
    fontSize: 14,
    marginTop: 14,
    color: "#8c8c8c"
  },
  // 小标题
  iconBackgroundTop: {
    backgroundColor: "#1fd662",
    borderRadius: 30,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 11,
    minWidth: 36,
    height: 14,
    marginTop: 14
  },
  iconBackgroundAtt: {
    backgroundColor: "#f39800",
    borderRadius: 30,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 11,
    minWidth: 36,
    height: 14,
    marginTop: 14
  },
  iconText: {
    backgroundColor: "transparent",
    color: "#ffffff",
    fontSize: 11,
    alignSelf: "center"
  },
  // 显示摘要信息
  abstractBg: {
    marginTop: 20,
    marginLeft: 6,
    flexDirection: "row"
  },
  viewBg: {
    width: 3,
    backgroundColor: "#ededf3"
  },
  abstractText: {
    flexGrow: 1,
    marginLeft: 5,
    fontSize: 14,
    color: "#8c8c8c"
  },
  // 显示详情信息
  detailText: {
    marginTop: 24,
    marginBottom: 60,
    fontSize: 14,
    color: "#323334"
  },
  // 显示图片信息
  showImageStyle: {
    alignSelf: "center",
    width: device.width - 36
  },
  showImage: {
    alignSelf: "center",
    width: device.width - 36,
    height: (device.width - 36) * (36 / 65),
    resizeMode: Image.resizeMode.contain,
    marginTop: 14
  },
  // 底部的横线
  lineViewBg: {
    alignSelf: "center",
    width: device.width - 36
  },
  lineView: {
    backgroundColor: "#cfcfcf",
    // borderWidth: 0.5,
    width: device.width - 36,
    marginTop: 34
  },
  // 显示底部附件信息
  attachment: {
    bottom: 0,
    height: 60,
    width: device.width,
    flexDirection: "row",
    backgroundColor: "white"
  },
  attachmentImage: {
    alignSelf: "center",
    marginLeft: 24,
    height: 33,
    width: 33
  },
  attachmentText: {
    flex: 1,
    alignSelf: "center",
    marginHorizontal: 18,
    fontSize: 16,
    color: "#666666"
  }
});
