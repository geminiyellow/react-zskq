// 设置定位考勤地点

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

export default class SetLocatePosition extends Component {
  mixins: [React.addons.PureRenderMixin]

  constructor(props) {
    super(props);
    this.state = {
      // 是否显示页面
      loaded: false,
      relocated: false,
      isBtnActive: true,
      // 地址显示文本
      addressText: null,
      // 误差大小
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

  /** life cycle */

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => this.setState({ loaded: true }));
    Animated.timing(this.state.fadeAnim, { toValue: 1 }).start();
    const { isConfig, lng, lat, address, range } = this.props;
    // 是否已维护地址 '0': 系统未维护地址, '1': 已维护地址
    if (isConfig === '1') {
      // 单个地图标注
      const annotation = {
        longitude: parseFloat(lng),
        latitude: parseFloat(lat),
        title: address,
      };
      const myLocation = [];
      myLocation.push(annotation);
      this.setState({
        addressText: address,
        rangeText: range,
        isBtnActive: false,
        annotations: myLocation,
      });
    } else {
      RNManager.startLocationService();
      this.getAddressInfo();
      this.setState({ rangeText: '500' });
    }
    // WiFi是否可用
    RNManager.wifiEnabled(
      (value) => { if (!value) showMessage(messageType.warning, I18n.t('mobile.module.checkinrules.wifiprompt')); },
    );
  }

  componentWillUnmount() {
    RNManager.stopLocationService();
  }

  // 获取当前地址
  getAddressInfo() {
    RNManager.getLocation((info) => {
      const newAnnotation = {};
      const newLocation = [];
      if (!info.lng) {
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

  // 显示百度地图
  showMapView(annotations) {
    return <BaiduMapView style={styles.map_container} annotations={annotations} />;
  }

  /**
   * 提交定位地址变更
   * relocated - 是否已重新定位
   * p.UnitId - 选中部门ID
   * p.Remark - 提交定位原因
   * p.AllowedDistance - 误差范围
   * p.Flag '0': 部门定位设置, '1': 蓝牙定位设置
   * departmentName - 部门
   */
  submitPositionData() {
    RNManager.getLocation(info => {
      const { relocated, addressText, rangeText, reasonText } = this.state;
      const { departmentID, departmentName, lng, lat, navigator } = this.props;
      // 提交接口参数对象
      const p = {
        SessionId: global.loginResponseData.SessionId,
        UnitID: departmentID,
        UnitName: departmentName,
        Longitude: null,
        Latitude: null,
        Address: addressText,
        AllowedDistance: rangeText.toString(),
        Flag: '0',
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

  // Picker 选中操作
  onPickerDone(pickedValue) {
    const { range } = this.props;
    this.pickerDistance.toggle();
    this.setState({ rangeText: pickedValue[0] });
    if (pickedValue[0] !== range) this.setState({ isBtnActive: true });
  }

  /** render method */

  render() {
    const { loaded, isBtnActive, addressText, rangeText, annotations } = this.state;
    const { navigator } = this.props;
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
            }}>
            <Animated.View style={[styles.bottom_container, { opacity: this.state.fadeAnim }]}>
              <Text allowFontScaling={false} style={styles.bottom_text}>{I18n.t('mobile.module.checkinrules.complete')}</Text>
            </Animated.View>
          </TouchableOpacity> : null}
        
        <Picker
          ref={pickerDistance => this.pickerDistance = pickerDistance}
          pickerData={['100', '200', '300', '400', '500', '600', '700', '800', '900', '1000', '1100', '1200', '1300', '1400', '1500']}
          selectedValue={[rangeText]}
          pickerBtnText={I18n.t('mobile.module.overtime.pickerconfirm')}
          pickerCancelBtnText={I18n.t('mobile.module.overtime.pickercancel')}
          pickerTitle={I18n.t('mobile.module.checkinrules.deviationrange')}
          onPickerDone={(pickedValue) => this.onPickerDone(pickedValue)}
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
    height: 200,
    alignItems: 'center',
  },
  reasonTextContainer: {
    backgroundColor: '#f6f6f7',
    width: device.width,
    height: 100,
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
    marginLeft: 12,
    marginRight: 12,
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
  reasonTextInput: {
    flexGrow: 1,
    marginLeft: 18,
    marginRight: 18,
    marginTop: 5,
    fontSize: 14,
  },
});