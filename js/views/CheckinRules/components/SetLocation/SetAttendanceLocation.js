// 设置蓝牙考勤地点

import { Animated, ScrollView, Text, TouchableOpacity, View, NativeModules, InteractionManager } from 'react-native';
import Image from '@/common/components/CustomImage';
import React, { Component } from 'react';
import BaiduMapView from '@/common/components/BaiduMapView';
import NavBarBackText from '@/common/components/NavBarBackText';
import { device } from '@/common/Util';
import Picker from '@/common/components/OptionPicker';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import { POST } from '@/common/Request';
import NavigationBar from '@/common/components/NavigationBar';
import Input from '@/common/components/Input';
import { submitPositionInfo } from '@/common/api';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import { color } from '@/common/Style';

const { RNManager } = NativeModules;
const locateImage = { uri: 'attendance_rule_icon_location_activted' };

export default class SetLocation extends Component {
  mixins: [React.addons.PureRenderMixin]

  /** life cycle */

  constructor(props) {
    super(props);
    this.state = {
      // 是否加载页面
      loaded: false,
      // 是否重新定位 (android)
      relocated: false,
      // 提交考勤地点按钮是否可用
      isBtnActive: true,
      // 地址文本内容
      addressText: null,
      // 误差范围文本
      rangeText: '0',
      annotations: [{
        longitude: 0,
        latitude: 0,
        title: I18n.t('mobile.module.checkinrules.isgettinglocationinfo'),
      }],
      reasonText: null,
      fadeAnim: new Animated.Value(0), // Init opacity 0
    };
  }

  /**
   * RNManager.wifiEnabled() - 是否连接WiFi
   * this.annotation - 单个地图标注
   * lng - 经度
   * lat - 纬度
   * address - 地址
   * range - 已维护的误差范围
   */
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => this.setState({ loaded: true }));
    Animated.timing(this.state.fadeAnim, { toValue: 1 }).start();
    const { isConfig, lng, lat, address, range } = this.props;
    // 是否已维护地址 0: 未维护, 1: 已维护
    if (isConfig === '1') {
      const annotation = {
        longitude: parseFloat(lng),
        latitude: parseFloat(lat),
        title: address,
      };
      const myLocation = [];
      myLocation.push(annotation);
      this.setState({
        isBtnActive: false,
        addressText: address,
        rangeText: range,
        annotations: myLocation,
      });
    } else {
      RNManager.startLocationService();
      this.getAddressInfo();
      this.setState({ rangeText: '1000' });
    }
    RNManager.wifiEnabled(
      (value) => {
        if (!value) showMessage(messageType.warning, I18n.t('mobile.module.checkinrules.wifiprompt'));
      },
    );
  }

  componentWillUnmount() {
    RNManager.stopLocationService();
  }

  /** private methods */

  // 获取当前地址信息
  getAddressInfo() {
    RNManager.getLocation((info) => {
      // 地图标注
      const newAnnotation = {};
      const newLocation = [];
      if (!info.lat) {
        newAnnotation.title = I18n.t('mobile.module.checkinrules.openlocationservice');
        newAnnotation.longitude = 0;
        newAnnotation.latitude = 0;
      } else {
        newAnnotation.title = info.address;
        newAnnotation.longitude = info.lng;
        newAnnotation.latitude = info.lat;
      }
      newLocation.push(newAnnotation);
      this.setState({
        relocated: true,
        isBtnActive: true,
        addressText: newAnnotation.title,
        annotations: newLocation,
      });
    });
  }

  /**
   * 提交蓝牙地址变更数据
   * relocated - 是否已重新定位
   * p.UnitId - 部门ID, 可能不是当前部门的蓝牙设备
   * p.Longitude - 经度
   * p.Latitude - 纬度
   * p.Address - 地址
   * p.Remark - 提交定位的原因
   * p.Major - 蓝牙主要值
   * p.Minor - 蓝牙次要值
   * p.AllowedDistance - 误差范围
   * p.Flag - 定位设置类型 '0': 部门定位设置, '1': 蓝牙定位设置
   * departID - 部门ID
   */
  submitPositionData() {
    RNManager.getLocation(info => {
      const { navigator, departID, departName, lng, lat, device, major, minor } = this.props;
      const { relocated, addressText, rangeText, reasonText } = this.state;
      // 提交接口参数对象
      const p = {
        SessionId: global.loginResponseData.SessionId,
        UnitID: departID,
        UnitName: departName,
        Longitude: null,
        Latitude: null,
        Address: addressText,
        BHTName: device,
        Major: major,
        Minor: minor,
        AllowedDistance: rangeText.toString(),
        Flag: '1',
        Remark: reasonText,
      };
      if (!reasonText) {
        showMessage(messageType.error, I18n.t('mobile.module.checkinrules.inputchangereason'));
        return;
      }
      if (!relocated) {
        p.Longitude = lng;
        p.Latitude = lat;
      } else {
        p.Longitude = info.lng.toFixed(6).toString();
        p.Latitude = info.lat.toFixed(6).toString();
      }
      if (p.Longitude === '' || p.Longitude == 0) {
        showMessage(messageType.error, I18n.t('mobile.module.checkinrules.getlocationerror'));
        return;
      }
      RNManager.showLoading('');
      POST(submitPositionInfo(), p, (responseData) => {
        RNManager.hideLoading();
        navigator.pop();
        showMessage(messageType.success, I18n.t('mobile.module.checkinrules.waitcheck'));
        this.props.fetchData();
      }, (message) => {
        RNManager.hideLoading();
        showMessage(messageType.error, message);
      });
    });
  }

  // 显示百度地图
  showMapView(annotations) {
    return (
      <BaiduMapView style={styles.map_container} annotations={annotations} />
    );
  }

  /** render view */

  render() {
    const { loaded, isBtnActive, addressText, rangeText, annotations } = this.state;
    const { navigator, range } = this.props;
    const rightButtonConfig = {
      title: I18n.t('mobile.module.checkinrules.relocate'),
      handler: () => {
        RNManager.GPSEnabled(
          (GPSvalue) => { if (!GPSvalue && device.isIos) showMessage(messageType.warning, I18n.t('mobile.module.checkinrules.openlocationservice')); }
        );
        this.setState({ addressText: '...' });
        RNManager.startLocationService();
        this.getAddressInfo();
      },
      tintColor: color.mainColorLight,
    };
    return (
      <View style={[styles.flex, styles.background]}>
        <NavigationBar
          title={{ title: I18n.t('mobile.module.checkinrules.setpunchlocation') }}
          leftButton={<NavBarBackText onPress={() => navigator.pop()} />}
          rightButton={rightButtonConfig}
        />
        {loaded ?
          <ScrollView>
            <Animated.View style={{ opacity: this.state.fadeAnim }}>
              {this.showMapView(annotations)}
              <View style={styles.grayView} />
              <View style={styles.position_container}>
                <Image source={locateImage} style={styles.locate_image} />
                <Text allowFontScaling={false} style={styles.locate_text}>{I18n.t('mobile.module.checkinrules.punchlocation')}</Text>
                <Text allowFontScaling={false} style={styles.locate_address}>{addressText}</Text>
                <TouchableOpacity onPress={() => this.pickerDistance.toggle()} style={styles.locate_range_container}>
                  <Text allowFontScaling={false} numberOfLines={1} style={styles.locate_range}>{`${I18n.t('mobile.module.checkinrules.deviationrange')}: ${rangeText} ${I18n.t('mobile.module.checkinrules.meter')}`}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.grayView} />
              <View style={styles.reasonTextContainer}>
                <Input
                  style={styles.reasonTextInput}
                  placeholder={I18n.t('mobile.module.checkinrules.placeholdertext')}
                  multiline={false}
                  maxLength={100}
                  value={this.state.reasonText}
                  onChangeText={(text) => { this.setState({ reasonText: text }); }}
                  onSubmitEditing={(event) => this.setState({ reasonText: event.nativeEvent.text })}
                />
              </View>
            </Animated.View>
          </ScrollView> : null}
        {loaded ?
          <TouchableOpacity
            onPress={() => {
              if (!isBtnActive) {
                showMessage(messageType.warning, I18n.t('mobile.module.checkinrules.notmodifylocation'));
                return;
              }
              this.submitPositionData();
            }}
            >
            <Animated.View style={[styles.bottom_container, { opacity: this.state.fadeAnim }]}>
              <Text allowFontScaling={false} style={styles.bottom_text}>{I18n.t('mobile.module.checkinrules.complete')}</Text>
            </Animated.View>
          </TouchableOpacity> : null}

        <Picker
          ref={pickerDistance => this.pickerDistance = pickerDistance}
          pickerBtnText={I18n.t('mobile.module.overtime.pickerconfirm')}
          pickerCancelBtnText={I18n.t('mobile.module.overtime.pickercancel')}
          pickerData={['500', '1000', '1500', '2000', '2500', '3000']}
          selectedValue={[rangeText]}
          pickerTitle={I18n.t('mobile.module.checkinrules.deviationrange')}
          onPickerDone={(pickedValue) => {
            this.pickerDistance.toggle();
            this.setState({ rangeText: pickedValue[0] });
            if (pickedValue[0] !== range) this.setState({ isBtnActive: true });
          }}
        />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  flex: {
    flex: 1,
  },
  background: {
    backgroundColor: '$color.containerBackground',
  },
  columnImg: {
    width: device.width,
    height: 220,
    marginVertical: 10,
  },
  map_container: {
    width: device.width,
    height: 280,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  grayView: {
    width: device.width,
    height: 9,
    backgroundColor: '#f0eff5',
  },
  position_container: {
    backgroundColor: '#f6f6f7',
    width: device.width,
    height: 237,
    alignItems: 'center',
  },
  locate_image: {
    marginTop: 33,
    width: 33,
    height: 33,
  },
  locate_text: {
    color: '#333333',
    fontSize: 16,
    marginTop: 5,
  },
  locate_address: {
    color: '#999999',
    fontSize: 14,
    marginTop: 16,
  },
  locate_range_container: {
    marginTop: 26,
    borderWidth: 0.5,
    borderColor: color.mainColorLight,
    borderRadius: 8,
    width: 120,
    height: 18.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locate_range: {
    color: color.mainColorLight,
    fontSize: 11,
  },
  bottom_container: {
    width: device.width,
    height: 44,
    backgroundColor: color.mainColorLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom_text: {
    fontSize: 17,
    color: '#ffffff',
  },
  pickerTitle: {
    fontSize: 11,
    color: '#999999',
  },
  reasonTextContainer: {
    backgroundColor: '#f6f6f7',
    width: device.width,
    height: 100,
  },
  reasonTextInput: {
    flexGrow: 1,
    marginLeft: 18,
    marginRight: 18,
    marginTop: 5,
    fontSize: 14,
  },
});