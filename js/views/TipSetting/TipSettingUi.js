/**
 * 提醒设置界面
 */
import { InteractionManager, ListView, ScrollView, TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import Image from '@/common/components/CustomImage';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import Text from '@/common/components/TextField';
import Swipeout from 'react-native-swipeout';
import SwitchCard from '@/common/components/SwitchCard';
import NavBar from '@/common/components/NavBar';
import Picker from '@/common/components/OptionPicker';
import realm from '@/realm';
import Style from '@/common/Style';
import { device } from '@/common/Util';
import Line from '@/common/components/Line';
import UmengAnalysis from '@/common/components/UmengAnalysis';

import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import PushNotificationModule from './PushNotificationModule';


const add = 'alert_icon_add';
const clock = 'alert_icon_clock';
const switchOnImg = 'switch_on';
const switchOffImg = 'switch_off';

const pushNotificationModule = new PushNotificationModule();
let gotoworksRemain = [];
let gooffworksRemain = [];

let pickerData = [];

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
  },
  titleRowStyle: {
    flexDirection: 'row',
    height: 70,
    marginTop: 10,
    backgroundColor: 'white',
    paddingLeft: 18,
    paddingRight: 18,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  addRowStyle: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: 'white',
    paddingLeft: 18,
    paddingRight: 18,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rowMenuTextStyle: {
    fontSize: 17,
    color: '#333333',
  },
  rowsubMenuTextStyle: {
    fontSize: 13,
    color: '#999999',
    marginTop: 8,
    textAlign: 'left',
    width: device.width - 100,
  },
  columnImg: {
    width: device.width,
    height: 220,
    marginVertical: 10,
  },
});

export default class TipSettingUi extends PureComponent {
  constructor(...args) {
    super(...args);
    this.list = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.listoff = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      SwitchGotoworks: false,
      SwitchGooffworks: false,
      dataSource: this.list.cloneWithRows([]),
      dataSourceoff: this.listoff.cloneWithRows([]),
    };
    createTime();
  }

  // 初始化。加载本地保存的
  init() {
    const allgotos = realm.objects('Tip').filtered(`tiptype = "0" AND user_id = "${global.loginResponseData.UserID}"`);
    this.setState({
      SwitchGotoworks: allgotos.length == 0 ? false : allgotos[0].enable,
    });

    const allgooffs = realm.objects('Tip').filtered(`tiptype = "1" AND user_id = "${global.loginResponseData.UserID}"`);
    this.setState({
      SwitchGooffworks: allgooffs.length == 0 ? false : allgooffs[0].enable,
    });

    const gotoRemains = realm.objects('Tip').filtered(`tiptype = "2" AND user_id = "${global.loginResponseData.UserID}"`);
    if (gotoRemains.length > 0) {
      gotoworksRemain = [];
      gotoRemains.map(item => {
        gotoworksRemain.push(item.toggletime);
      });
      this.setState({
        dataSource: this.list.cloneWithRows(gotoworksRemain),
      });
    }

    const gooffRemains = realm.objects('Tip').filtered(`tiptype = "3" AND user_id = "${global.loginResponseData.UserID}"`);
    if (gooffRemains.length > 0) {
      gooffworksRemain = [];
      gooffRemains.map(item => {
        gooffworksRemain.push(item.toggletime);
      });
      this.setState({
        dataSourceoff: this.listoff.cloneWithRows(gooffworksRemain),
      });
    }
  }

  // 增加上班提醒
  addGotowork() {
    this.picker.toggle();
  }
  // 增加下班提醒
  addGooffwork() {
    this.gooffpicker.toggle();
  }

  // 添加提醒线缩进
  getlineout() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ width: 18, height: device.hairlineWidth }} />
        <Line />
      </View >
    );
  }

  // 动态添加上班提示列表
  getGotoWorksView() {
    if (this.state.SwitchGotoworks == true) {
      return (
        <View style={{ marginTop: 10 }}>
          <ListView
            dataSource={this.state.dataSource}
            enableEmptySections
            removeClippedSubviews={false}
            showsVerticalScrollIndicator={false}
            renderRow={(rowData, sectionID, rowID, highlightRow) => this.inflateItem(rowData, sectionID, rowID, highlightRow)}
          />
          {this.addGotoView()}

        </View>
      );
    }
    return null;
  }

  addGotoView() {
    if (gotoworksRemain.length < 3) {
      return (
        <View style={{ backgroundColor: 'white' }}>
          <Line />
          <TouchableOpacity onPress={() => this.addGotowork()}>
            <View style={{ flexDirection: 'column' }}>
              <View style={styles.addRowStyle}>
                <Image style={{ width: 17, height: 17 }} source={{ uri: add }} />

                <Text style={{ marginLeft: 11, color: Style.color.mainColorLight }}>{I18n.t('mobile.module.mine.tipsetting.addgotoworks')}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <Line />
        </View>
      );
    }
    return null;
  }

  // 动态添加下班提示列表
  getGooffWorksView() {
    if (this.state.SwitchGooffworks == true) {
      return (
        <View style={{ marginTop: 10 }}>
          <ListView
            dataSource={this.state.dataSourceoff}
            enableEmptySections
            removeClippedSubviews={false}
            showsVerticalScrollIndicator={false}
            renderRow={(rowData, sectionID, rowID, highlightRow) => this.inflateItemOff(rowData, sectionID, rowID, highlightRow)}
          />
          {this.addGooffView()}
        </View>
      );
    }
    return null;
  }

  componentWillMount() {
    UmengAnalysis.onPageBegin('TipSetting');
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.init();
    });
  }

  componentWillUnmount() {
    UmengAnalysis.onPageEnd('TipSetting');
    pickerData = [];
  }

  addGooffView() {
    if (gooffworksRemain.length < 3) {
      return (
        <View style={{ backgroundColor: 'white' }}>
          <Line />
          <TouchableOpacity onPress={() => this.addGooffwork()}>
            <View style={{ flexDirection: 'column' }}>
              <View style={styles.addRowStyle}>
                <Image style={{ width: 17, height: 17 }} source={{ uri: add }} />

                <Text style={{ marginLeft: 11, color: Style.color.mainColorLight }}>{I18n.t('mobile.module.mine.tipsetting.addgoofworks')}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <Line />
        </View>

      );
    }
    return null;
  }

  // 删除上班提醒
  deleteGotoWorks = (rowID) => {
    realm.write(() => {
      const deletedItem = realm.objects('Tip').filtered(`tiptype = "2" AND user_id = "${global.loginResponseData.UserID}" AND toggletime = "${gotoworksRemain[rowID]}"`);
      realm.delete(deletedItem);
    });
    gotoworksRemain.splice(rowID, 1);
    pushNotificationModule.cancelNotificationByID('on', rowID);
    this.setState({
      dataSource: this.list.cloneWithRows(gotoworksRemain),
    });
  }

  // 保存上班提醒到数据库
  saveGotoWorks(value) {
    realm.write(() => {
      realm.create('Tip', { user_id: global.loginResponseData.UserID, toggletime: value, tiptype: 2 });
    });
  }

  // 删除下班提醒
  deleteGooffWorks = (rowID) => {
    realm.write(() => {
      const deletedItem = realm.objects('Tip').filtered(`tiptype = "3" AND user_id = "${global.loginResponseData.UserID}" AND toggletime = "${gooffworksRemain[rowID]}"`);
      realm.delete(deletedItem);
    });
    gooffworksRemain.splice(rowID, 1);
    pushNotificationModule.cancelNotificationByID('off', rowID);
    this.setState({
      dataSourceoff: this.listoff.cloneWithRows(gooffworksRemain),
    });
  }

  // 保存下班提醒到数据库
  saveGooffWorks(value) {
    realm.write(() => {
      realm.create('Tip', { user_id: global.loginResponseData.UserID, toggletime: value, tiptype: 3 });
    });
  }

  // 渲染上班提示行
  inflateItem(rowData, sectionID, rowID, highlightRow) {
    const gotoView = I18n.t('mobile.module.mine.tipsetting.gotoworksitem').replace('{0}', rowData);
    return (
      <Swipeout
        right={[{
          backgroundColor: 'red',
          color: 'white',
          text: I18n.t('mobile.module.mine.tipsetting.delete'),
          onPress: () => this.deleteGotoWorks(rowID),
        }]}>
        {(rowID == 0) ? <Line /> : null}
        <View style={{ flexDirection: 'column', paddingLeft: 18, backgroundColor: 'white' }}>
          {(rowID == 0) ? null : <Line />}
          <View key={`${sectionID}-${rowID}`} style={[styles.addRowStyle, { paddingLeft: 0 }]}>
            <Image style={{ width: 17, height: 17 }} source={{ uri: clock }} />
            <View style={{ flex: 1, marginLeft: 11 }} >
              <Text allowFontScaling={false}>{I18n.t('mobile.module.mine.tipsetting.clock')}</Text>
            </View>
            <Text style={{ marginLeft: 11, color: Style.color.mainColorLight }}>{gotoView}</Text>
          </View>
        </View>
        {
          (rowID == 2) ? <Line /> : null
        }
      </Swipeout>
    );
  }

  // 渲染下班提示行
  inflateItemOff(rowData, sectionID, rowID, highlightRow) {
    const offView = I18n.t('mobile.module.mine.tipsetting.goofworksitem').replace('{0}', rowData);
    return (
      <Swipeout
        right={[{
          backgroundColor: 'red',
          color: 'white',
          text: I18n.t('mobile.module.mine.tipsetting.delete'),
          onPress: () => this.deleteGooffWorks(rowID),
        }]}>
        {(rowID == 0) ? <Line /> : null}
        <View style={{ flexDirection: 'column', paddingLeft: 18, backgroundColor: 'white' }}>
          {(rowID == 0) ? null : <Line />}
          <View key={`${sectionID}-${rowID}`} style={[styles.addRowStyle, { paddingLeft: 0 }]}>
            <Image style={{ width: 17, height: 17 }} source={{ uri: clock }} />
            <View style={{ flex: 1, marginLeft: 11 }} >
              <Text allowFontScaling={false}>{I18n.t('mobile.module.mine.tipsetting.clock')}</Text>
            </View>
            <Text style={{ marginLeft: 11, color: Style.color.mainColorLight }}>{offView}</Text>
          </View>
        </View>
        {
          (rowID == 2) ? <Line /> : null
        }
      </Swipeout>
    );
  }

  onGotoValueChanged(value) {
    this.setState({ SwitchGotoworks: value });

    realm.write(() => {
      const allgotos = realm.objects('Tip').filtered(`tiptype = "0" AND user_id = "${global.loginResponseData.UserID}"`);
      if (allgotos.length == 0) {
        realm.create('Tip', { user_id: global.loginResponseData.UserID, enable: value, tiptype: 0 });
      } else {
        allgotos[0].enable = value;
      }
    });
  }

  onGooffValueChanged(value) {
    this.setState({ SwitchGooffworks: value });

    realm.write(() => {
      const allgooffs = realm.objects('Tip').filtered(`tiptype = "1" AND user_id = "${global.loginResponseData.UserID}"`);
      if (allgooffs.length == 0) {
        realm.create('Tip', { user_id: global.loginResponseData.UserID, enable: value, tiptype: 1 });
      } else {
        allgooffs[0].enable = value;
      }
    });
  }

  getSwitchOnView = () => {
    return (
      <View style={{ marginBottom: 10 }}>
        <Image style={{ width: 36, height: 18 }} source={{ uri: this.state.SwitchGotoworks ? switchOnImg : switchOffImg }} />
      </View>
    );
  }

  getSwitchOffView = () => {
    return (
      <View style={{ marginBottom: 10 }}>
        <Image style={{ width: 36, height: 18 }} source={{ uri: this.state.SwitchGooffworks ? switchOnImg : switchOffImg }} />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>

        <NavBar title={I18n.t('mobile.module.mine.tipsetting.title')} onPressLeftButton={() => this.props.navigator.pop()} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1 }}>
            <View style={{ marginTop: 10 }}>
              <SwitchCard title={I18n.t('mobile.module.mine.tipsetting.gotoworksmenutitle')} bottomLine detailText={I18n.t('mobile.module.mine.tipsetting.gotoworkssubmenutitle')} switchState={this.state.SwitchGotoworks} onPress={() => this.onGotoValueChanged(!this.state.SwitchGotoworks)} />
              {this.getGotoWorksView()}
            </View>
            <View style={{ marginTop: 10 }}>
              <SwitchCard title={I18n.t('mobile.module.mine.tipsetting.goofworksmenutitle')} bottomLine detailText={I18n.t('mobile.module.mine.tipsetting.goofworkssubmenutitle')} switchState={this.state.SwitchGooffworks} onPress={() => this.onGooffValueChanged(!this.state.SwitchGooffworks)} />
              {this.getGooffWorksView()}
            </View>
          </View>
        </ScrollView>

        <Picker
          ref={picker => this.picker = picker}
          pickerBtnText={I18n.t('mobile.module.overtime.pickerconfirm')}
          pickerCancelBtnText={I18n.t('mobile.module.overtime.pickercancel')}
          pickerTitle={I18n.t('mobile.module.mine.tipsetting.pickergototitle')}
          pickerData={pickerData}
          showMask
          selectedValue={['30']}
          onPickerDone={(pickedValue) => {
            if (gotoworksRemain && gotoworksRemain.includes(pickedValue[0])) {
              return;
            }
            gotoworksRemain.push(pickedValue[0]);
            this.saveGotoWorks(pickedValue[0]);
            this.setState({
              dataSource: this.list.cloneWithRows(gotoworksRemain),
            });
            pushNotificationModule.immediatelyToggleGoto(gotoworksRemain);
            showMessage(messageType.success, I18n.t('mobile.module.mine.tipsetting.success'));
          }}
        />

        <Picker
          ref={picker => this.gooffpicker = picker}
          pickerBtnText={I18n.t('mobile.module.overtime.pickerconfirm')}
          pickerCancelBtnText={I18n.t('mobile.module.overtime.pickercancel')}
          pickerTitle={I18n.t('mobile.module.mine.tipsetting.pickergooftitle')}
          pickerData={pickerData}
          selectedValue={['30']}
          showMask
          onPickerDone={(pickedValue) => {
            if (gooffworksRemain && gooffworksRemain.includes(pickedValue[0])) {
              return;
            }
            gooffworksRemain.push(pickedValue[0]);
            this.saveGooffWorks(pickedValue[0]);
            this.setState({
              dataSourceoff: this.listoff.cloneWithRows(gooffworksRemain),
            });
            pushNotificationModule.immediatelyToggleGooff(gooffworksRemain);
            showMessage(messageType.success, I18n.t('mobile.module.mine.tipsetting.success'));
          }}
        />
      </View>
    );
  }
}

function createTime() {
  for (let i = 1; i < 60; i++) {
    pickerData.push(`${i}`);
  }
}