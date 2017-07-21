// 设置蓝牙地址
import { Animated, NativeAppEventEmitter, ListView, Text, TouchableOpacity, View, NativeModules } from 'react-native';
import Image from '@/common/components/CustomImage';
import React, { Component } from 'react';
import { device } from '@/common/Util';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import { POST } from '@/common/Request';
import Line from '@/common/components/Line';
import { submitPostionLimitedSet } from '@/common/api';
import Style from '@/common/Style';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import SwitchCard from '@/common/components/SwitchCard';
import SetLocation from '../SetLocation/SetAttendanceLocation';
const Beacons = device.isIos ? require('react-native-ibeacon') : require('react-native-beacons-android');
const { RNManager } = NativeModules;
// 信号强弱图片
const strongImg = 'bluetooth_signals_strong';
const normalImg = 'bluetooth_signals_normal';
const weakImg = 'bluetooth_signals_weak';
const nonImg = 'bluetooth_signals_non';
// Switch Image
// const switchOnImg = { uri: 'switch_on' };
// const switchOffImg = { uri: 'switch_off' };

export default class BluetoothLocation extends Component {
  mixins: [React.addons.PureRenderMixin]

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
    this.state = {
      // 是否打开蓝牙打卡地点限制开关
      eventSwitchIsOn: false,
      // 是否显示蓝牙打卡地点限制开关
      isShowSwitch: false,
      // 蓝牙列表Listview数据源
      dataSource: null,
      // 是否正在扫描蓝牙
      isScanning: false,
      // fadeAnim: new Animated.Value(0),
    };
    this.tipOfOpenBluetooth = false;
    this.tipOfOpenLocationService = false;
  }

  /** life cycle */

  componentDidMount() {
    const { bluetoothState, bluetoothData } = this.props;
    // Animated.timing(this.state.fadeAnim, { toValue: 1 }).start();
    this.updateBluetoothListData(bluetoothState, bluetoothData);
    this.listenBeacon();
  }

  componentWillReceiveProps(nextProps) {
    const { bluetoothState, bluetoothData } = nextProps;
    this.updateBluetoothListData(bluetoothState, bluetoothData);
  }

  componentWillUnmount() {
    this.stopScanBeacon();
    this.beaconsDidRange.remove();
  }

  /** response event */

  onPress() {
    const { eventSwitchIsOn, isShowSwitch } = this.state;
    // 蓝牙设备数据列表
    const { bluetoothData } = this.props;
    if (!isShowSwitch) {
      return;
    }
    if (bluetoothData.length == 0) showMessage(messageType.warning, I18n.t('mobile.module.checkinrules.notmaintained'));
    if (eventSwitchIsOn) {
      this.setState({ eventSwitchIsOn: false });
      this.props.resetBleState(false);
      this.submitAttendanceRules(false);
      this.scanEnabled();
    } else {
      this.setState({ eventSwitchIsOn: true });
      this.props.resetBleState(true);
      this.submitAttendanceRules(true);
      bluetoothData.forEach((item) => {
        item.nearby = false;
        item.proximity = 'other';
      });
    }
  }

  // 切换蓝牙地址限制开关
  // onValueChanged(value) {
  //   // 蓝牙设备数据列表
  //   const { bluetoothData } = this.props;
  //   this.setState({ eventSwitchIsOn: value });
  //   this.props.resetBleState(value);
  //   this.submitAttendanceRules(value);
  //   if (bluetoothData.length == 0) showMessage(messageType.warning, I18n.t('mobile.module.checkinrules.notmaintained'));
  //   if (value) {
  //     this.scanEnabled();
  //   } else {
  //     bluetoothData.forEach((item) => {
  //       item.nearby = false;
  //       item.proximity = 'other';
  //     });
  //   }
  // }

  // 点击蓝牙列表行事件
  onPressBluetoothListRow(navigator, rowData) {
    navigator.push({
      component: SetLocation,
      isConfig: rowData.LONGITUDE !== '' && rowData.LONGITUDE != 0 ? '1' : '0',
      address: rowData.CRNT_ADDRESS,
      range: rowData.ALLOWED_DISTANCE,
      lng: rowData.LONGITUDE,
      lat: rowData.LATITUDE,
      major: rowData.MAJOR,
      minor: rowData.MINOR,
      device: rowData.CODE,
      departID: rowData.UNITID,
      departName: rowData.UNITNAME,
      fetchData: () => this.props.fetchData(),
    });
  }

  /** private method */

  // 检测蓝牙、GPS定位服务是否可用
  scanEnabled() {
    // 判断蓝牙是否开启
    RNManager.bluetoothEnabled(
      (value) => {
        if (!value && !this.tipOfOpenBluetooth) {
          showMessage(messageType.warning, I18n.t('mobile.module.checkinrules.scanerror'));
          this.tipOfOpenBluetooth = true;
        } else {
          RNManager.GPSEnabled(
            (GPSvalue) => {
              if (!GPSvalue && !this.tipOfOpenLocationService && device.isIos) {
                showMessage(messageType.warning, I18n.t('mobile.module.checkinrules.openble'));
                this.tipOfOpenLocationService = true;
              }
            },
          );
        }
        this.startScanBeacon();
      },
    );
  }

  // 开始扫描蓝牙设备
  startScanBeacon() {
    this.setState({ isScanning: true });
    this.region = {
      identifier: 'gaiaworks',
      uuid: global.loginResponseData.Uuid,
    };
    if (device.isIos) {
      Beacons.requestWhenInUseAuthorization();
      Beacons.startRangingBeaconsInRegion(this.region);
    } else {
      Beacons.detectIBeacons();
      Beacons.startRangingBeaconsInRegion(this.region);
    }
  }

  // 停止扫描蓝牙设备
  stopScanBeacon() {
    const { isScanning } = this.state;
    if (device.isIos) {
      if (!this.region) return;
      Beacons.stopRangingBeaconsInRegion(this.region);
    } else {
      if (!isScanning) return;
      Beacons.stopRangingBeaconsInRegion(this.region);
    }
    this.setState({ isScanning: false });
  }

  /** render methods */

  /**
   * 显示蓝牙地址限制开关
   * isShowSwitch - 是否显示开关
   * eventSwitchIsOn - 是否打开开关
   */
  /*showSwitchView(isShowSwitch, eventSwitchIsOn) {
    if (isShowSwitch) {
      return (
        <View style={styles.row_right_container}>
          <TouchableOpacity onPress={() => this.onValueChanged(!eventSwitchIsOn)}>
            <Image source={eventSwitchIsOn ? switchOnImg : switchOffImg} style={{ width: 33, height: 33 }} />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }*/

  /**
   * 是否显示蓝牙列表
   * eventSwitchIsOn - 是否打开开关
   * dataSource - Listview数据源
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

  /**
   * 显示蓝牙地址
   * this.configAddress - 是否维护地址 '0': 未维护, '1': 已维护
   */
  showAddress(rowData) {
    if (rowData.LONGITUDE !== '' && rowData.LONGITUDE != 0) return <Text style={styles.list_detail}>{rowData.CRNT_ADDRESS}</Text>;
    return <Text allowFontScaling={false} style={styles.list_detail}>{I18n.t('mobile.module.checkinrules.addressnotset')}</Text>;
  }

  // 显示蓝牙信号强度图片
  showSignalImg(rowData) {
    let signalImg;
    const prox = rowData.proximity;
    switch (prox) {
      case 'immediate':
        signalImg = strongImg;
        break;
      case 'near':
        signalImg = normalImg;
        break;
      case 'far':
        signalImg = normalImg;
        break;
      case 'unknown':
        signalImg = weakImg;
        break;
      default:
        signalImg = nonImg;
        break;
    }
    return <Image source={{ uri: signalImg }} style={styles.list_signalImg} />;
  }

  // 提交考勤规则部门定位地址位置限制变更数据
  submitAttendanceRules(value) {
    // 蓝牙列表数据
    const { bluetoothData } = this.props;
    // 提交接口参数对象
    const p = {
      SessionId: global.loginResponseData.SessionId,
      // 是否开启地址限制 '0': 不限制, '1': 限制
      IsLimited: value ? '1' : '0',
      // 限制类型 'GPS_CONTROL': 部门(定位), 'BHT_CONTROL': 蓝牙
      LimitedType: 'BHT_CONTROL',
      // 一个或多个部门ID, 多个用逗号隔开
      UnitIds: null,
    };
    let departmentID;
    const s = new Set();
    bluetoothData.forEach((item) => s.add(item.UNITID));
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

  // 监听是否扫描到蓝牙设备
  listenBeacon() {
    this.beaconsDidRange = NativeAppEventEmitter.addListener('beaconsDidRange', (data) => {
      if (data.beacons.length < 1) return;
      // 扫描到的蓝牙数量
      let count = 0;
      const { bluetoothData } = this.props;
      bluetoothData.forEach((item) => {
        data.beacons.forEach((target) => {
          if (target.major.toString() === item.MAJOR) {
            // 是否扫描到该蓝牙设备
            item.nearby = true;
            // 蓝牙设备距离手机距离 Android和iOS返回值类型不同，需要判断
            item.proximity = target.proximity;
            count++;
          }
        });
      });
      if (count == 0) return;
      this.setState({ dataSource: this.ds.cloneWithRows(bluetoothData) });
    });
  }

  // 更新蓝牙列表数据
  updateBluetoothListData(bluetoothState, bluetoothData) {
    this.setState({ dataSource: this.ds.cloneWithRows(bluetoothData) });
    switch (bluetoothState) {
      // '0': 不限制
      case '0':
        this.setState({
          eventSwitchIsOn: false,
          isShowSwitch: true,
        });
        break;
      // '1': 限制
      case '1':
        this.setState({
          eventSwitchIsOn: true,
          isShowSwitch: true,
        });
        this.scanEnabled();
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

  /** render view */

  renderRow(rowData, sectionID, rowID) {
    const { navigator } = this.props;
    if (rowData.nearby) {
      return (
        <TouchableOpacity
          key={`${sectionID}-${rowID}`}
          style={[styles.list_container, { backgroundColor: 'white', opacity: 1 }]}
          onPress={() => this.onPressBluetoothListRow(navigator, rowData)}>
          <Image source={{ uri: 'attendance_rule_icon_bluetooth' }} style={styles.list_Image} />
          <View style={styles.list_middle}>
            <View style={styles.list_title_container}>
              <Text allowFontScaling={false} style={styles.list_title}>{rowData.CODE}</Text>
              {this.showSignalImg(rowData)}
            </View>
            {this.showAddress(rowData)}
          </View>
          <View style={styles.list_right_container}>
            <Image source={{ uri: 'forward' }} style={{ width: 22, height: 22 }} />
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <View key={`${sectionID}-${rowID}`} style={[styles.list_container]}>
        <Image source={{ uri: 'bluetooth_not_in_range' }} style={styles.list_no_image} />
        <View style={styles.list_no_middle}>
          <View style={styles.list_title_container}>
            <Text allowFontScaling={false} style={styles.list_title}>{rowData.CODE}</Text>
            <Image source={{ uri: nonImg }} style={styles.list_signalImg} />
          </View>
          {this.showAddress(rowData)}
        </View>
        <View style={styles.list_right_container}>
          <Image source={{ uri: 'forward' }} style={{ width: 22, height: 22 }} />
        </View>
      </View>
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

  /*render() {
    const { isShowSwitch, eventSwitchIsOn, dataSource } = this.state;
    return (
      <Animated.View style={{ opacity: this.state.fadeAnim }}>
        <View style={styles.prompt_container}>
          <Text allowFontScaling={false} style={styles.prompt_text}>{I18n.t('mobile.module.checkinrules.bluetoothpunchaddress')}</Text>
        </View>
        <View style={styles.row_container}>
          <View style={styles.row_text_container}>
            <Text allowFontScaling={false} numberOfLines={1} style={styles.row_title}>{I18n.t('mobile.module.checkinrules.bluetoothpunchlocationlimit')}</Text>
            <Text allowFontScaling={false} numberOfLines={2} style={styles.row_detail}>{I18n.t('mobile.module.checkinrules.bluetoothpunchlocationlimitprompt')}</Text>
          </View>
          {this.showSwitchView(isShowSwitch, eventSwitchIsOn)}
        </View>
        {this.showListView(eventSwitchIsOn, dataSource)}
      </Animated.View>
    );
  }*/

  render() {
    const { isShowSwitch, eventSwitchIsOn, dataSource } = this.state;
    return (
      <View>
        <View style={styles.prompt_container}>
          <Text allowFontScaling={false} style={styles.prompt_text}>{I18n.t('mobile.module.checkinrules.bluetoothpunchaddress')}</Text>
        </View>
        <SwitchCard
          title={I18n.t('mobile.module.checkinrules.bluetoothpunchlocationlimit')}
          detailText={I18n.t('mobile.module.checkinrules.bluetoothpunchlocationlimitprompt')}
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
  prompt_container: {
    height: 30,
    width: device.width,
    justifyContent: 'flex-end',
  },
  prompt_text: {
    fontSize: 11,
    color: '#999999',
    marginLeft: 18,
    marginBottom: 6,
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
  list_container: {
    height: 60,
    width: device.width,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.3,
  },
  separator: {
    marginLeft: 0,
  },
  list_Image: {
    marginLeft: 18,
    width: 33,
    height: 33,
  },
  list_no_image: {
    marginLeft: 22,
    width: 22,
    height: 22,
  },
  list_middle: {
    flex: 5,
    marginLeft: 10,
  },
  list_no_middle: {
    flex: 5,
    marginLeft: 16,
  },
  list_title_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  list_title: {
    fontSize: 16,
    color: '#333333',
  },
  list_signalImg: {
    width: 22,
    height: 22,
    marginLeft: 10,
    marginBottom: 6,
  },
  list_detail: {
    fontSize: 11,
    color: '#999999',
  },
  list_right_container: {
    flex: 0.8,
    alignItems: 'flex-end',
    marginRight: 18,
  },
});