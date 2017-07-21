// 设置考勤地点 Page

import React, { Component } from 'react';
import { DeviceEventEmitter, InteractionManager, NativeModules, ScrollView, View } from 'react-native';
import I18n from 'react-native-i18n';
import SubmitButton from '@/common/components/SubmitButton';
import BaiduMapView from '@/common/components/BaiduMapView';
import { connect } from 'react-redux';
import Picker from '@/common/components/OptionPicker';
import ModalWithImage from '@/common/components/modal/ModalWithImage';
import { changeMachineInfo } from '@/common/api';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import { POST } from '@/common/Request';
import NavBar from '@/common/components/NavBar';
import Relocate from '../Relocate';
import MessageBar from '../common/MessageBar';
import styles from './index.style';
import PlainRow from '../common/PlainRow';
import MyLine from '../common/MyLine';
import { showAnotation, setPickerData, setSelectedValue, setRangeValue, showWiFiBar, setAddress, loadSetLocationView } from '../../actions';

const { RNManager } = NativeModules;
const questionImg = 'icon_question';
// 考勤设备标识
const APP_BLUETOOTH = 3;
const APP_QRCode = 5;
const APP_GPS = 9;

class SetLocation extends Component {
  mixins: [React.addons.PureRenderMixin]

  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    dispatch(loadSetLocationView(false));
    dispatch(showAnotation(
      [{
        longitude: 0,
        latitude: 0,
        title: I18n.t('mobile.module.setup.locating'),
      }],
    ));
    dispatch(setAddress(''));
    dispatch(setPickerData(['1']));
    dispatch(setSelectedValue(['1']));
    dispatch(setRangeValue(''));
    dispatch(showWiFiBar(false));
  }

  /** life cycle */
  componentDidMount() {
    const { dispatch } = this.props;
    InteractionManager.runAfterInteractions(() => {
      dispatch(loadSetLocationView(true));
      this.setRangeText();
      this.setPickerData();
      this.wifiEnabled();
    });
    this.relocateListener = DeviceEventEmitter.addListener('didRelocate', data => {
      RNManager.startLocationService();
      this.addressInfo();
    });
  }

  componentWillUnmount() {
    this.relocateListener.remove();
    RNManager.stopLocationService();
  }

  /** event response */
  // 点击提交按钮时提交数据到服务器
  onPressBtn() {
    const { navigator, annotations, rangeValue } = this.props;
    const { MachineID, major, minor, params } = this.props.passParams;
    const TokenID = params.notiData.TOKENID;
    const sessionId = global.loginResponseData.SessionId;
    const title = annotations[0].title;
    const longitude = annotations[0].longitude;
    const latitude = annotations[0].latitude;
    if (longitude == 0 || latitude == 0) {
      showMessage(messageType.warning, I18n.t('mobile.module.setup.renolocationinfo'));
      return;
    }
    let range = rangeValue;
    if (isNaN(range)) range = 0;
    const p = {
      TokenID,
      MachineID,
      sessionId,
      title,
      longitude,
      latitude,
      major,
      minor,
      range: range.toString(),
    };
    RNManager.showLoading('');
    POST(changeMachineInfo(), p, (data) => {
      RNManager.hideLoading();
      navigator.pop();
      showMessage(messageType.success, I18n.t('mobile.module.setup.submitsuccess'));
      DeviceEventEmitter.emit('locationDidConfig', true);
    }, (message) => {
      RNManager.hideLoading();
      showMessage(messageType.error, message);
    });
  }

  /** private methods */
  // 修改误差范围
  setRangeText() {
    const { dispatch } = this.props;
    const { range } = this.props.passParams;
    if (range == 0) {
      dispatch(setSelectedValue(I18n.t('mobile.module.setup.notset')));
      dispatch(setRangeValue(I18n.t('mobile.module.setup.notset')));
    } else {
      dispatch(setSelectedValue(range));
      dispatch(setRangeValue(range));
    }
  }

  // 分别设置蓝牙打卡、二维码和定位打卡可设置的误差范围
  setPickerData() {
    const { dispatch } = this.props;
    const bluetoothData = [I18n.t('mobile.module.setup.notset'), '500', '600', '700', '800', '900', '1000', '1100', '1200', '1300', '1400', '1500', '1600', '1700', '1800', '1900', '2000'];
    const locateData = [I18n.t('mobile.module.setup.notset'), '100', '150', '200', '250', '300', '350', '400', '450', '500', '550', '600', '650', '700', '750', '800', '850', '900', '950', '1000'];
    const { type, longitude, latitude, title } = this.props.passParams;
    if (longitude == 0 || latitude == 0) this.relocate();
    if (type == APP_BLUETOOTH) {
      dispatch(showAnotation(
        [{ longitude, latitude, title }],
      ));
      dispatch(setPickerData(bluetoothData));
      dispatch(setAddress(title));
    } else {
      dispatch(showAnotation(
        [{ longitude, latitude, title }],
      ));
      dispatch(setPickerData(locateData));
      dispatch(setAddress(title));
    }
  }

  // 检测WiFi是否开启
  wifiEnabled() {
    RNManager.wifiEnabled(
      (value) => {
        if (!value) {
          const { dispatch } = this.props;
          dispatch(showWiFiBar(true));
        }
      },
    );
  }

  // 重新定位
  relocate() {
    RNManager.GPSEnabled(
      (GPSvalue) => {
        if (!GPSvalue) this.gpsModal.open();
        RNManager.startLocationService();
        this.addressInfo();
      },
    );
  }

  // 获取当前地址信息
  addressInfo() {
    const { dispatch } = this.props;
    RNManager.getLocation((info) => {
      let title = info.address;
      const longitude = info.lng;
      const latitude = info.lat;
      if (longitude == 0 || latitude == 0) {
        title = I18n.t('mobile.module.setup.locatedisabled');
        dispatch(showAnotation(
          [{ longitude, latitude, title }],
        ));
        return;
      }
      dispatch(showAnotation(
        [{ longitude, latitude, title }],
      ));
      dispatch(setAddress(title));
    });
  }

  // 确认选择误差距离
  pickerDone(data) {
    const { dispatch } = this.props;
    const range = data[0];
    dispatch(setSelectedValue(range));
    dispatch(setRangeValue(range));
  }

  // 显示选择误差范围的 Picker
  showPicker() {
    this.picker.toggle();
  }

  /** render methods */

  render() {
    const { navigator, annotations, pickerData, selectedValue, rangeValue, isShowWiFiBar, address, loaded } = this.props;
    const { shop, set } = this.props.passParams;
    return (
      <View style={[styles.flex, styles.background]}>
        <NavBar
          title={I18n.t('mobile.module.setup.slnavbartitle')}
          onPressLeftButton={() => {
            if (set) navigator.pop();
            else this.modal.open();
          }}
          rightContainerLeftImage={{ uri: questionImg }}
          onPressRightContainerLeftButton={() => {
            navigator.push({ component: Relocate });
          }}
        />
        {loaded ?
          <ScrollView>
            <BaiduMapView style={styles.map} annotations={annotations} />
            <PlainRow title={shop} detailText={address} noImg />
            <MyLine />
            <PlainRow style={{ height: 48, marginBottom: 48 }} title={I18n.t('mobile.module.setup.rangetitle')} range={rangeValue} onPress={() => this.showPicker()} />
          </ScrollView> : null}
        {loaded && !set && isShowWiFiBar ?
          <MessageBar
            style={{ backgroundColor: '#F4A211' }}
            title={I18n.t('mobile.module.setup.wifiprompt')} />
          : null}
        {loaded && set ?
          <MessageBar style={{ backgroundColor: '#1FD662' }} title={I18n.t('mobile.module.setup.locationhasset')} />
          : null}
        {loaded ?
          <View style={{ position: 'absolute', bottom: 0, left: 0 }}>
            <SubmitButton customStyle={set && { opacity: 0.4 }} title={I18n.t('mobile.module.setup.done')} disabled={set} onPressBtn={() => this.onPressBtn()} />
          </View> : null}
        
        <Picker
          ref={picker => this.picker = picker}
          pickerData={pickerData}
          selectedValue={[`${selectedValue}`]}
          onPickerDone={(data) => this.pickerDone(data)}
          pickerCancelBtnText={I18n.t('mobile.module.setup.cancelbtntitle')}
          pickerBtnText={I18n.t('mobile.module.setup.confirmbtntitle')}
          pickerTitle={I18n.t('mobile.module.setup.rangetitle')}
        />

        <ModalWithImage
          ref={modal => this.modal = modal}
          title={I18n.t('mobile.module.setup.modaltitle')}
          subTitle={I18n.t('mobile.module.setup.modaldetail')}
          topButtonTitle={I18n.t('mobile.module.setup.modaltopbtntitle')}
          topButtonPress={() => this.modal.close()}
          bottomButtonTitle={I18n.t('mobile.module.setup.modalbottombtntitle')}
          bottomButtonPress={() => navigator.pop()}
          />
        <ModalWithImage
          ref={modal => this.gpsModal = modal}
          title={I18n.t('mobile.module.setup.openlocation')}
          subTitle={I18n.t('mobile.module.setup.opengpsdetail')}
          topButtonTitle={I18n.t('mobile.module.setup.ok')}
          topButtonPress={() => this.gpsModal.close()}
          />
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { annotations, pickerData, selectedValue, rangeValue, isShowWiFiBar, address, loaded } = state.setUpReducer;
  return {
    annotations,
    pickerData,
    selectedValue,
    rangeValue,
    isShowWiFiBar,
    address,
    loaded,
  };
}

export default connect(mapStateToProps)(SetLocation);