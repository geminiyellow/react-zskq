import {
  View,
  ScrollView,
  ListView,
  Keyboard,
  NativeModules,
} from 'react-native';
import React, { PureComponent } from 'react';
import I18n from 'react-native-i18n';
import { device, keys } from '@/common/Util';
import { POST, ABORT } from '@/common/Request';
import { showMessage } from '@/common/Message';
import { submitAppFeedback } from '@/common/api';
import { messageType } from '@/common/Consts';
import UmengAnalysis from '@/common/components/UmengAnalysis';
import Line from '@/common/components/Line';
import Text from '@/common/components/TextField';
import Image from '@/common/components/CustomImage';
import SubmitButton from '@/common/components/SubmitButton';
import NavBar from '@/common/components/NavBar';
import TouchableHighlight from '@/common/components/CustomTouchableHighlight';
import realm from '@/realm';
import Realm from 'realm';

import styles from './Feedback.style';
import FeedbackContent from './FeedbackContent';
import FeedbackRecommend from './FeedbackRecommend';

const { RNManager } = NativeModules;

const emoticon1Normal = 'emoticon1_normal';
const emoticon2Normal = 'emoticon2_normal';
const emoticon3Normal = 'emoticon3_normal';
const emoticon4Normal = 'emoticon4_normal';
const emoticon5Normal = 'emoticon5_normal';

const emoticon1Opacity = 'emoticon1_opacity';
const emoticon2Opacity = 'emoticon2_opacity';
const emoticon3Opacity = 'emoticon3_opacity';
const emoticon4Opacity = 'emoticon4_opacity';
const emoticon5Opacity = 'emoticon5_opacity';

const NORMAL_URLS = [emoticon1Normal, emoticon2Normal, emoticon3Normal, emoticon4Normal, emoticon5Normal];
const OPACITY_URLS = [emoticon1Opacity, emoticon2Opacity, emoticon3Opacity, emoticon4Opacity, emoticon5Opacity];
let URLS = [emoticon1Normal, emoticon2Normal, emoticon3Normal, emoticon4Normal, emoticon5Normal];
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
let emoticonNum = null;

export default class Feedback extends PureComponent {

  constructor(props) {
    super(props);
    URLS = [emoticon1Normal, emoticon2Normal, emoticon3Normal, emoticon4Normal, emoticon5Normal];
    emoticonNum = null;
    this.state = {
      dataSource: ds.cloneWithRows(URLS),
    };
  }

  componentWillMount() {
    UmengAnalysis.onPageBegin('Feedback');
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    UmengAnalysis.onPageEnd('Feedback');
    ABORT('submitAppFeedback');
  }

  // 返回处理
  onBackPress = () => {
    Keyboard.dismiss();
    this.props.navigator.pop();
  }

  onSubmit() {
    if (this.feedbackContent.state.feedbackContent == null ||
      this.feedbackContent.state.feedbackContent.length == 0 ||
      emoticonNum == null ||
      this.FeedbackRecommend.state.recommendNum == null) {
      showMessage(messageType.error, I18n.t('mobile.module.mine.feedback.fieldsalert'));
      return;
    }
    const feedbackSummary = `移动用户反馈-评价${emoticonNum}-推荐值${this.FeedbackRecommend.state.recommendNum}`;

    let content = this.feedbackContent.state.feedbackContent.replace('\n', '');
    content = content.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5 ]/g, '');

    const companyInfo = realm.objects('Company');
    const staffId = global.loginResponseData.EmpID;
    let userName = global.loginResponseData.EmpName;
    if (!userName) userName = global.loginResponseData.EnglishName;

    if (companyInfo.length != 0) {
      const params = {};
      params.summary = feedbackSummary;
      params.description = content;
      params.companyCode = companyInfo[0].code;
      params.rating = emoticonNum;
      params.nps = this.FeedbackRecommend.state.recommendNum;
      // 工号
      params.staffId = staffId;
      // 用户名
      params.userName = userName;

      // 进行缓冲
      RNManager.showLoading(I18n.t('mobile.module.mine.feedback.subfeedback'));
      POST(submitAppFeedback(), params, (responseData) => {
        RNManager.hideLoading();
        showMessage(messageType.success, I18n.t('mobile.module.mine.feedback.submitSuccess'));
        // 退出当前界面
        this.props.navigator.pop();
      }, () => {
        RNManager.hideLoading();
        showMessage(messageType.error, I18n.t('mobile.module.mine.feedback.submitFailed'));
      },
        'submitAppFeedback');
    } else {
      showMessage(messageType.error, 'Company Code Error !');
    }
  }

  handleOnPress(rowID) {
    emoticonNum = (parseInt(rowID) + 1).toString();
    URLS.map((_, i) => {
      URLS[i] = NORMAL_URLS[i];
      if (String(i) !== String(rowID)) {
        URLS[i] = OPACITY_URLS[i];
      }
      return null;
    });
    this.setState({
      dataSource: ds.cloneWithRows(URLS),
    });
  }

  renderRowData(rowData, sectionID, rowID) {
    const marginRight = rowID == 4 ? 0 : (device.width - 314) / 4;
    return (
      <TouchableHighlight onPress={() => this.handleOnPress(rowID)}>
        <View style={{ flex: 1 }}>
          <Image style={[styles.thumb, { marginRight }]} source={{ uri: rowData }} />
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <NavBar
          title={I18n.t('mobile.module.mine.feedback.title')}
          onPressLeftButton={() => this.onBackPress()} />
        <ScrollView style={styles.container} keyboardDismissMode="on-drag">
          <View style={styles.emoticonLine}>
            <Line />
            <Text style={styles.commentTitle}>{I18n.t('mobile.module.mine.feedback.comment')}</Text>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={(rowData, sectionID, rowID) => this.renderRowData(rowData, sectionID, rowID)}
              horizontal
              style={styles.listView}
              removeClippedSubviews={false}
            />
            <Line />
          </View>
          <FeedbackContent ref={(content) => { this.feedbackContent = content; }} />
          <FeedbackRecommend ref={(recommend) => { this.FeedbackRecommend = recommend; }} />
        </ScrollView>
        <SubmitButton onPressBtn={() => this.onSubmit()} />
      </View>
    );
  }
}