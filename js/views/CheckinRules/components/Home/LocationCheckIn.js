// 设置定位(部门)地址

import { ListView, Text, TouchableOpacity, View, NativeModules } from 'react-native';
import Image from '@/common/components/CustomImage';
import React, { Component } from 'react';
import { device } from '@/common/Util';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import { POST } from '@/common/Request';
import { submitPostionLimitedSet } from '@/common/api';
import Style from '@/common/Style';
import Line from '@/common/components/Line';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import SwitchCard from '@/common/components/SwitchCard';
import SetLocatePosition from '../SetLocation/SetLocatePosition';

const { RNManager } = NativeModules;

export default class LocationCheckIn extends Component {
  mixins: [React.addons.PureRenderMixin]

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
    this.state = {
      eventSwitchIsOn: false,
      // 是否显示定位打卡地点限制开关
      isShowSwitch: false,
      // 部门定位地址列表ListView数据源
      dataSource: null,
    };
  }

  /** life cycle */

  componentDidMount() {
    const { locationState, locationData } = this.props;
    this.updateLocationList(locationState, locationData);
  }

  componentWillReceiveProps(nextProps) {
    const { locationState, locationData } = nextProps;
    this.updateLocationList(locationState, locationData);
  }

  /** event response */

  onPress() {
    const { eventSwitchIsOn, isShowSwitch } = this.state;
    if (!isShowSwitch) {
      return;
    }
    if (eventSwitchIsOn) {
      this.setState({ eventSwitchIsOn: false });
      this.props.resetLocateState(false);
      this.submitAttendanceRules(false);
    } else {
      this.setState({ eventSwitchIsOn: true });
      this.props.resetLocateState(true);
      this.submitAttendanceRules(true);
    }
  }

  // 点击部门地址行事件
  onPressConfigRow(navigator, rowData) {
    navigator.push({
      component: SetLocatePosition,
      isConfig: rowData.LONGITUDE !== '' && rowData.LONGITUDE != 0 ? '1' : '0',
      address: rowData.CRNT_ADDRESS,
      range: rowData.ALLOWED_DISTANCE,
      lng: rowData.LONGITUDE,
      lat: rowData.LATITUDE,
      departmentID: rowData.UNITID,
      departmentName: rowData.UNITNAME,
      fetchData: () => this.props.fetchData(),
    });
  }

  // 刷新定位地址列表数据
  updateLocationList(locationState, locationData) {
    this.setState({ dataSource: this.ds.cloneWithRows(locationData) });
    // 部门定位地址限制权限
    switch (locationState) {
      // '0': 关闭限制
      case '0':
        this.setState({
          eventSwitchIsOn: false,
          isShowSwitch: true,
        });
        break;
      // '1': 开启限制
      case '1':
        this.setState({
          eventSwitchIsOn: true,
          isShowSwitch: true,
        });
        break;
      // '2': 没有权限
      case '2':
        this.setState({
          eventSwitchIsOn: false,
          isShowSwitch: false,
        });
        break;
      default:
        break;
    }
  }

  // 提交考勤规则部门定位地址位置限制变更数据
  submitAttendanceRules(value) {
    const { locationData } = this.props;
    // 提交接口参数对象
    const p = {
      SessionId: global.loginResponseData.SessionId,
      // 是否开启地址限制 '0': 不限制, '1': 限制
      IsLimited: value ? '1' : '0',
      // 限制类型 'GPS_CONTROL': 部门(定位), 'BHT_CONTROL': 蓝牙
      LimitedType: 'GPS_CONTROL',
      //  一个或多个部门ID, 多个部门ID用逗号隔开
      UnitIds: null,
    };
    let departmentID;
    const s = new Set();
    locationData.forEach((item) => s.add(item.UNITID));
    for (item of s) {
      if (!departmentID) {
        departmentID = item;
      } else {
        departmentID = `${departmentID},${item}`;
      }
    }
    if (!departmentID) departmentID = global.loginResponseData.DeptId;
    p.UnitIds = departmentID;
    RNManager.showLoading('');
    POST(submitPostionLimitedSet(), p, (responseData) => {
      RNManager.hideLoading();
    }, (message) => {
      RNManager.hideLoading();
      showMessage(messageType.error, message);
      this.setState({ eventSwitchIsOn: !value });
    });
  }

  /** render methods */

  /**
   * 显示地址信息
   * this.configAddress '0': 未维护地址, '1': 已维护地址
   */
  showAddress(rowData) {
    if (rowData.LONGITUDE !== '') {
      return <Text allowFontScaling={false} style={styles.list_detail}>{rowData.CRNT_ADDRESS}</Text>;
    }
    return <Text allowFontScaling={false} style={styles.list_detail}>{I18n.t('mobile.module.checkinrules.addressnotset')}</Text>;
  }

  /**
   * 显示定位地址列表
   * eventSwitchIsOn - 是否打开开关
   * dataSource - 部门定位地址列表数据
   */
  showListView(eventSwitchIsOn, dataSource) {
    if (eventSwitchIsOn) {
      return (
        <ListView
          dataSource={dataSource}
          renderRow={(rowData, sectionID, rowID) => this.renderRow(rowData, sectionID, rowID)}
          renderSeparator={(sectionID, rowID) => this.renderSeparator(sectionID, rowID)}
          removeClippedSubviews={false}
          enableEmptySections
        />
      );
    }
    return null;
  }

  renderRow(rowData, sectionID, rowID) {
    const { navigator } = this.props;
    return (
      <TouchableOpacity
        key={`${sectionID}-${rowID}`}
        style={styles.list_container}
        onPress={() => this.onPressConfigRow(navigator, rowData)}>
        <Image source={{ uri: 'attendance_rule_icon_location_activted' }} style={styles.list_Image} />
        <View style={styles.list_middle}>
          <Text allowFontScaling={false} style={styles.list_title}>{rowData.UNITNAME}</Text>
          {this.showAddress(rowData)}
        </View>
        <View style={styles.list_right_container}>
          <Image source={{ uri: 'forward' }} style={{ width: 22, height: 22 }} />
        </View>
      </TouchableOpacity>
    );
  }

  renderSeparator(sectionID, rowID) {
    const { dataSource } = this.state;
    const lastRow = rowID == (dataSource.getRowCount() - 1);
    return (
      <View key={`${sectionID}-${rowID}`} style={{ backgroundColor: Style.color.white }}>
        <Line style={[!lastRow && styles.separator, { backgroundColor: '#EBEBEB' }]} />
      </View>
    );
  }

  render() {
    const { isShowSwitch, eventSwitchIsOn, dataSource } = this.state;
    return (
      <View style={styles.flex}>
        <View style={styles.prompt_container}>
          <Text allowFontScaling={false} style={styles.prompt_text}>{I18n.t('mobile.module.checkinrules.locatepunchaddress')}</Text>
        </View>
        <SwitchCard
          title={I18n.t('mobile.module.checkinrules.locatepunchaddresslimt')}
          detailText={I18n.t('mobile.module.checkinrules.locatepunchaddresslimtprompt')}
          switchState={eventSwitchIsOn}
          showImage={isShowSwitch}
          onPress={() => this.onPress()}
        />
        {this.showListView(eventSwitchIsOn, dataSource)}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  flex: {
    flex: 1,
  },
  prompt_container: {
    height: 28,
    width: device.width,
    justifyContent: 'flex-end',
  },
  prompt_text: {
    fontSize: 11,
    color: '#999999',
    marginBottom: 6,
    marginLeft: 18,
  },
  row_container: {
    height: 60,
    width: device.width,
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#EBEBEB',
    borderBottomWidth: device.hairlineWidth,
  },
  row_text_container: {
    flex: 3,
  },
  row_title: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 18,
  },
  row_detail: {
    fontSize: 11,
    color: '#999999',
    marginLeft: 18,
    marginTop: 8,
  },
  row_right_container: {
    flex: 0.8,
    marginRight: 17,
    alignItems: 'flex-end',
  },
  add_container: {
    height: 48,
    width: device.width,
    backgroundColor: '#f6f6f7',
  },
  row_touchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  add_Image: {
    marginLeft: 22,
  },
  add_Text: {
    fontSize: 16,
    color: '#1fd662',
    marginLeft: 15,
  },
  list_container: {
    height: 60,
    width: device.width,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    marginLeft: 0,
  },
  list_Image: {
    marginLeft: 18,
    width: 33,
    height: 33,
  },
  list_middle: {
    flex: 5,
    marginLeft: 10,
  },
  list_title: {
    fontSize: 16,
    color: '#333333',
  },
  list_detail: {
    fontSize: 11,
    color: '#999999',
    marginTop: 6,
  },
  list_right_container: {
    flex: 0.8,
    alignItems: 'flex-end',
    marginRight: 18,
  },
});