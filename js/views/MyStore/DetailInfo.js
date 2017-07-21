import React, { Component } from 'react';
import { DeviceEventEmitter, InteractionManager, Keyboard, NativeModules, ScrollView, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import NavBar from '@/common/components/NavBar';
import OptionCard from '@/common/components/OptionCard';
import CheckButton from '@/common/components/CheckButton';
import TextArea from '@/common/components/TextArea';
import BaiduMapView from '@/common/components/BaiduMapView';
import Picker from '@/common/components/OptionPicker';
import InputCard from '@/common/components/InputCard';
import Line from '@/common/components/Line';
import { device } from '@/common/Util';
import { GET, POST, ABORT } from '@/common/Request';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
import { getStoreModifyReason, saveStoreInfo } from '@/common/api';
import { FETCH_STORE_DATA } from './constant';
import { isSamsung } from './helper';
const { RNManager } = NativeModules;
// 导入公司代码的数据
const customizedCompanyHelper = new CustomizedCompanyHelper();

export default class DetailInfo extends Component {
  mixins: [React.addons.PureRenderMixin]

  constructor(props) {
    super(props);
    this.reasonData = [];
    this.isRelocate = false;
  }

  state = {
    annotations: [
      {
        longitude: 0,
        latitude: 0,
        title: I18n.t('mobile.module.setup.locating'),
      }],
    pickerData: ['无'],
    selectedValue: '无',
    inputCardValue: '',
    reason: '',
    textAreaValue: '',
    loadMap: false,
    disabled: false,
    editable: true,
  };

  /** life cycle */

  componentDidMount() {
    const { storeData } = this.props.passProps;
    // 判断是否为Samsung，若为true则禁止编辑无法距离
    let disabled = false;
    let editable = true;
    if (isSamsung()) {
      disabled = true;
      editable=false;
    }
    this.setState({
      inputCardValue: storeData.ALLOWED_DISTANCE ? storeData.ALLOWED_DISTANCE.toString() : '0',
      textAreaValue: storeData.CRNT_ADDRESS ? storeData.CRNT_ADDRESS : '',
      disabled,
      editable,
    });
    const changeReason = storeData.CONTEXT;
    if (changeReason) {
      this.setState({ selectedValue: changeReason });
    }
    if (!storeData.LONGITUDE || !storeData.LATITUDE) {
      RNManager.startLocationService();
      this.addressInfo();
    } else {
      this.setState({
        annotations: [{
          longitude: parseFloat(storeData.LONGITUDE),
          latitude: parseFloat(storeData.LATITUDE),
          title: storeData.CRNT_ADDRESS,
          subtitle: `经度：${storeData.LONGITUDE} 纬度：${storeData.LATITUDE}`,
        }],
      });
    }

    InteractionManager.runAfterInteractions(() => {
      this.setState({ loadMap: true });
    });

    GET(getStoreModifyReason(customizedCompanyHelper.getPrefix()), (data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        this.reasonData = data;
        const array = data.map((value, index) => {
          if (value && value.Reason) return value.Reason;
          return '';
        });
        this.setState({
          pickerData: array,
        });
        if (!storeData.CONTEXT) {
          this.setState({ selectedValue: array[0] });
        }
      }
    }, (errorMessage) => {
      showMessage(messageType.error, errorMessage);
    }, 'getStoreModifyReason');
  }

  componentWillUnmount() {
    RNManager.stopLocationService();
    ABORT('getStoreModifyReason');
    ABORT('saveStoreInfo');
  }

  /** callback */

  onPickerDone(data) {
    if (data && data[0]) {
      this.setState({ selectedValue: data[0] });
    }
  }

  onChangeAddressText(text) {
    this.setState({ textAreaValue: text });
  }

  onChangeInputCardText(text) {
    const textValue = parseInt(text) ? parseInt(text).toString() : '0';
    this.setState({ inputCardValue: textValue });
  }

  onEndEditingInputCard(text) {
    const textValue = parseInt(text) ? parseInt(text).toString() : '0';
    this.setState({ inputCardValue: textValue });
  }

  /** event response */

  onPressReasonRow() {
    const { selectedValue } = this.state;
    this.setState({ selectedValue });
    this.picker.toggle();
  }

  onPressLeftBtn() {
    RNManager.GPSEnabled((GPSvalue) => {
      if (!GPSvalue) {
        showMessage(messageType.error, '定位服务未开启');
        return;
      }
      RNManager.startLocationService();
      this.addressInfo();
    });
  }

  onPressRightBtn() {
    const { navigator } = this.props;
    RNManager.getLocation((info) => {
      const { storeData } = this.props.passProps;
      const { textAreaValue, inputCardValue, selectedValue } = this.state;
      const params = {};
      params.SessionId = global.loginResponseData.SessionId;
      params.Flag = 0;
      // 部门ID
      params.UnitID = storeData.UNITID ? storeData.UNITID : '';
      // 部门name
      params.UnitName = storeData.UNITNAME ? storeData.UNITNAME : '';
      if (this.isRelocate) {
        params.Longitude = info.lng.toFixed(6).toString();
        params.Latitude = info.lat.toFixed(6).toString();
      } else {
        params.Longitude = storeData.LONGITUDE;
        params.Latitude = storeData.LATITUDE;
      }
      params.AllowedDistance = inputCardValue;
      if (!textAreaValue) {
        showMessage(messageType.error, '请输入店铺地址');
        return;
      }
      params.Address = textAreaValue;
      params.Remark = this.reasonId(selectedValue);
      RNManager.showLoading('');
      POST(saveStoreInfo(customizedCompanyHelper.getPrefix()), params, (data) => {
        RNManager.hideLoading();
        navigator.pop();
        showMessage(messageType.success, '提交成功');
        DeviceEventEmitter.emit(FETCH_STORE_DATA, true);
      }, (errorMessage) => {
        RNManager.hideLoading();
        showMessage(messageType.error, errorMessage);
      }, 'saveStoreInfo');
    });
  }

  onBack() {
    const { navigator } = this.props;

    if (device.isAndroid) {
      Keyboard.dismiss();
    }
    navigator.pop();
  }

  /** private methods */

  // 获取当前地址
  addressInfo() {
    this.isRelocate = true;
    RNManager.getLocation((info) => {
      const newAnnotation = {};
      const newLocation = [];
      if (!info.lng) {
        newAnnotation.longitude = 0;
        newAnnotation.latitude = 0;
        newAnnotation.title = I18n.t('mobile.module.checkinrules.openlocationservice');
        newAnnotation.subtitle = '经度：0 纬度：0';
      } else {
        newAnnotation.longitude = info.lng;
        newAnnotation.latitude = info.lat;
        newAnnotation.title = info.address;
        newAnnotation.subtitle = `经度:${info.lng.toFixed(6).toString()} 纬度:${info.lat.toFixed(6).toString()}`;
      }
      newLocation.push(newAnnotation);
      this.setState({ annotations: newLocation });
    });
  }

  reasonId(reason) {
    if (this.reasonData.length > 0) {
      for (const item of this.reasonData) {
        if (reason === item.Reason) {
          return item.ReasonId;
        }
      }
    }
  }

  /** render methods */

  renderMapView() {
    const { annotations, loadMap } = this.state;
    if (!loadMap) return;

    return (
      <BaiduMapView style={styles.map} annotations={annotations} />
    );
  }

  render() {
    const { navigator } = this.props;
    const { storeData } = this.props.passProps;
    const { pickerData, selectedValue, textAreaValue, inputCardValue, disabled, editable } = this.state;
    return (
      <View style={styles.container}>
        <NavBar
          title="地点详情"
          onPressLeftButton={() => this.onBack()}
        />
        <ScrollView style={styles.contentContainer} bounces={false}>
          <OptionCard
            title="店铺名称"
            detailText={storeData.UNITNAME ? storeData.UNITNAME : ''}
            rightImage={false}
            disabled
            detailMarginRight={18}
          />
          <TextArea
            title="店铺地址"
            placeholder="请输入店铺地址"
            maxLength={50}
            containerStyle={styles.textArea}
            bottomLine={false}
            textValue={textAreaValue}
            onChangeText={text => this.onChangeAddressText(text)}
          />
          <InputCard
            title="误差范围"
            unitText="米"
            placeholder="请输入误差限制距离"
            keyboardType="numeric"
            onChangeText={text => this.onChangeInputCardText(text)}
            textValue={inputCardValue}
            onEndEditing={(text) => this.onEndEditingInputCard(text)}
            disabled={disabled}
            editable={editable}
          />
          <OptionCard
            title="修改原因"
            detailText={selectedValue}
            onPress={() => this.onPressReasonRow()}
          />
          {this.renderMapView()}
          <Line />
        </ScrollView>
        <CheckButton
          leftTitle="定位"
          rightTitle="保存"
          titleFontWeight="normal"
          onPressLeftBtn={() => this.onPressLeftBtn()}
          onPressRightBtn={() => this.onPressRightBtn()}
        />

        <Picker
          ref={picker => this.picker = picker}
          pickerData={pickerData}
          selectedValue={[selectedValue]}
          onPickerDone={(data) => this.onPickerDone(data)}
          pickerCancelBtnText={I18n.t('mobile.module.setup.cancelbtntitle')}
          pickerBtnText={I18n.t('mobile.module.setup.confirmbtntitle')}
          pickerTitle="修改原因"
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
  contentContainer: {
    flex: 1,
    paddingTop: 10,
  },
  textArea: {
    marginTop: 0,
  },
  map: {
    flex: 1,
    height: 307.5,
    backgroundColor: 'red'
  },
});