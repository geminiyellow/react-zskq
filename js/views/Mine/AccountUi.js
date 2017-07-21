/**
 * 用户信息界面
 */
import { DeviceEventEmitter, InteractionManager, ScrollView, TouchableWithoutFeedback, View, NativeModules } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import NavBarBackText from '@/common/components/NavBarBackText';
import EStyleSheet from 'react-native-extended-stylesheet';
import Text from '@/common/components/TextField';
import I18n from 'react-native-i18n';
import Image from '@/common/components/CustomImage';
import ActorImageWrapper from '@/common/components/ImageWrapper';
import OptionCard from '@/common/components/OptionCard';
import { getCurrentLanguage } from '@/common/Functions';
import { languages } from '@/common/LanguageSettingData';
import NavigationBar from '@/common/components/NavigationBar';
import NavBar from '@/common/components/NavBar';
import Line from '@/common/components/Line';
import { showMessage } from '@/common/Message';
import { UplaodEmployeeHeadImage, getUserInfo } from '@/common/api';
import { POST, ABORT, GET } from '@/common/Request';
import ModalWithImage from '@/common/components/modal/ModalWithImage';
import { device, keys, event } from '@/common/Util';
import { messageType } from '@/common/Consts';
import AttachmentModal from "@/common/components/Attachment";
import realm from '@/realm';
import MyFormHelper from '../MyForms/MyFormHelper';
import { getYYYYMMDDFormat } from '@/common/Functions';

const myFormHelper = new MyFormHelper();

const arr = 'forward';
const { RNManager } = NativeModules;
let username = '';
let position = '';
let DeptName = '';
let EmpID = '';
let Gender = '';
let BirthDay = '';
let companyName = '';

let actor = '';
const requestName = 'UplaodEmployeeHeadImage';
let userInfo = null;

export default class AccountUi extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      avatarSource: '',
      language: 0,
      refresh: true,
    };

    getCurrentLanguage().then(data => {
      const k = languages.indexOf(data);
      if (k == 0) {
        this.setState({
          language: 0,
        });
      } else {
        this.setState({
          language: 1,
        });
      }
    });
  }

  loadData = (response) => {
    let pathStr = '';
    let base64Str = '';
    if (!response.length) {// 相机进入
      pathStr = response.path;
      base64Str = response.data;
    } else { // 相册进入
      if (response.length > 0) {
        pathStr = response[0].path;
        base64Str = response[0].data;
      }
    }

    const source = { uri: pathStr, isStatic: true };

    const entity = {};
    if (!_.isEmpty(userInfo)) {
      entity.personId = userInfo.PersonID;
      entity.base64Data = base64Str;
    }

    RNManager.showLoading(I18n.t('mobile.module.mine.account.changehead'));
    // 发送更换头像接口
    POST(UplaodEmployeeHeadImage(), entity, (responseData) => {
      //将头像传入到global中
      global.loginResponseData.HeadImgUrl = responseData;
      realm.write(() => {
        const users = realm.objects('User').filtered(`user_id = "${global.loginResponseData.UserID}"`);
        if (users.length != 0) {
          users[0].head_url = responseData;
        }
      });
      RNManager.hideLoading();

      DeviceEventEmitter.emit('updateActorCallBack', responseData);
      showMessage(messageType.success, I18n.t('mobile.module.mine.account.changesuccess'));
    }, (message) => {
      RNManager.hideLoading();
      showMessage(messageType.error, message);
    }, requestName);

    this.setState({
      avatarSource: source,
    });
  };

  changeActor = () => {
    // 添加平台判断
    if (global.loginResponseData.PlatForm) {
      return;
    }


    this.attsModal.open(false);
  }

  // 获取用户信息
  getUserInfoRequest() {
    if (!_.isEmpty(global.loginResponseData)) {
      //用户信息缓存
      userInfo = global.loginResponseData;

      if (myFormHelper.getLanguage() == 0) {
        username = _.isEmpty(global.loginResponseData.EmpName) ? global.loginResponseData.EnglishName : global.loginResponseData.EmpName;
      } else {
        username = _.isEmpty(global.loginResponseData.EnglishName) ? global.loginResponseData.EmpName : global.loginResponseData.EnglishName;
      }
      if (!_.isEmpty(global.loginResponseData.Position)) position = global.loginResponseData.Position;

      if (!_.isEmpty(global.loginResponseData.DeptName)) DeptName = global.loginResponseData.DeptName;

      if (!_.isEmpty(global.loginResponseData.EmpID)) EmpID = global.loginResponseData.EmpID;

      if (!_.isEmpty(global.loginResponseData.Gender)) Gender = global.loginResponseData.Gender;

      if (!_.isEmpty(global.loginResponseData.BirthDay)) BirthDay = global.loginResponseData.BirthDay;
      if (!_.isEmpty(global.loginResponseData.HeadImgUrl)) {
        actor = global.loginResponseData.HeadImgUrl;
      }
      if (!_.isEmpty(global.companyResponseData.description)) companyName = global.companyResponseData.description;
      this.setState({
        refresh: !this.state.refresh,
      });
    }
  }

  componentDidMount() {
    this.getUserInfoRequest();
    this.clean();
  }

  clean() {
    this.listeners =
      DeviceEventEmitter.addListener(event.EXIT, (result) => {
        if (result == true) {
          userInfo = null;
          username = '';
          position = '';
          DeptName = '';
          EmpID = '';
          Gender = '';
          BirthDay = '';
          companyName = '';
          actor = '';
        }
      });
  }

  componentWillUnmount() {
    ABORT(requestName);
    ABORT('getUserInfoRequest');
  }

  getActor() {
    if (_.isEmpty(this.state.avatarSource)) {
      if (_.isEmpty(userInfo)) return null;
      return (
        <ActorImageWrapper actor={actor} EmpID={EmpID} EmpName={userInfo.EmpName} EnglishName={userInfo.EnglishName} />
      );
    }
    return (
      <Image style={styles.actorImagStyle} source={this.state.avatarSource} />
    );
  }

  render() {
    const Data = getYYYYMMDDFormat(BirthDay);
    return (
      <View style={styles.container}>

        <NavBar title={I18n.t('mobile.module.mine.account.title')} onPressLeftButton={() => this.props.navigator.pop()} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Line style={{ marginTop: 10 }} />
          <TouchableWithoutFeedback onPress={this.changeActor}>
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 60, backgroundColor: 'white', paddingLeft: 18 }}>
              <View style={{ flexDirection: 'column' }}>
                <Text style={{ fontSize: 17, color: '#000000' }}>{username}</Text>
                <Text style={{ marginTop: 5, fontSize: 13, color: '#9F9F9F', textAlign: 'center' }}>{position}</Text>
              </View>
              <View style={{ flex: 1 }} />

              {this.getActor()}

              <Image style={{ marginRight: 11 }} source={{ uri: arr }} />
            </View>
          </TouchableWithoutFeedback>
          <Line />

          <View style={{ backgroundColor: 'white', marginTop: 10 }}>
            <OptionCard title={I18n.t('mobile.module.mine.account.sex')} detailText={Gender} disabled rightImage={false} />
            <OptionCard topLineStyle={{ marginLeft: 18 }} bottomLine title={I18n.t('mobile.module.mine.account.birthday')} detailText={Data} disabled rightImage={false} />
          </View>

          <View style={{ backgroundColor: 'white', marginTop: 10 }}>
            <OptionCard title={I18n.t('mobile.module.mine.account.depart')} detailText={DeptName} disabled rightImage={false} />
            <OptionCard topLineStyle={{ marginLeft: 18 }} title={I18n.t('mobile.module.mine.account.number')} detailText={EmpID} disabled rightImage={false} />
            <OptionCard topLineStyle={{ marginLeft: 18 }} bottomLine title={I18n.t('mobile.module.mine.account.companyname')} detailText={companyName} disabled rightImage={false} />
          </View>
        </ScrollView>

        <ModalWithImage
          ref={ref => { this.cameraAlert = ref; }} title={I18n.t('mobile.module.mine.account.cameratitle')}
          subTitle={I18n.t('mobile.module.mine.account.camerasubtitle')} topButtonTitle={I18n.t('mobile.module.clock.getit')}
          topButtonPress={() => { this.cameraAlert.close(); }}
          bottomButtonTitle={I18n.t('mobile.module.mine.account.camerareject')}
          bottomButtonPress={() => { this.cameraAlert.close(); }}
        />
        <ModalWithImage
          ref={ref => { this.libraryAlert = ref; }} title={I18n.t('mobile.module.mine.account.librarytitle')}
          subTitle={I18n.t('mobile.module.mine.account.librarysubtitle')} topButtonTitle={I18n.t('mobile.module.clock.getit')}
          topButtonPress={() => { this.libraryAlert.close(); }}
          bottomButtonTitle={I18n.t('mobile.module.mine.account.camerareject')}
          bottomButtonPress={() => { this.libraryAlert.close(); }}
        />
        <AttachmentModal
          ref={ref => { this.attsModal = ref; }} loadData={images => this.loadData(images)}
          takePhotos={() => this.cameraAlert.open()　}
          loadLibrary={() => this.libraryAlert.open()}
        />
      </View>
    );
  }

}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    paddingLeft: 18,
    paddingRight: 18,
    height: 48,
  },
  rowLeftTextStyle: {
    fontSize: 17,
    color: '#000000',
  },
  rowRightTextStyle: {
    flex: 1,
    fontSize: 14,
    color: '#999999',
    justifyContent: 'flex-end',
    textAlign: 'right',
  },
  actorImagStyle: {
    width: 46,
    height: 46,
    alignSelf: 'center',
    borderRadius: 23,
  },
  columnImg: {
    width: device.width,
    height: 220,
    marginVertical: 10,
  },
});

