// 考勤规则首页
import React, { Component } from 'react';
import { RefreshControl, ScrollView, View, InteractionManager } from 'react-native';
import { device } from '@/common/Util';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import { GET, ABORT } from '@/common/Request';
import UmengAnalysis from '@/common/components/UmengAnalysis';
import { getUserAuthorizedBranchInfo } from '@/common/api';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import NavBar from '@/common/components/NavBar';
import BluetoothLocation from './BluetoothLocation';
import LocationCheckIn from './LocationCheckIn';

export default class CheckInRules extends Component {
  mixins: [React.addons.PureRenderMixin]

  constructor(props) {
    super(props);
    this.state = {
      // 部门定位地址限制开关状态 '0': 关闭开关, '1': 开启开关, '2': 没有权限
      locState: '0',
      // 部门定位地址列表数据
      locData: [],
      // 部门蓝牙地址限制开关状态 '0': 关闭开关, '1': 开启开关, '2': 没有权限
      bleState: '0',
      // 部门蓝牙地址列表数据
      bleData: [],
      refreshing: false,
    };
  }

  /** life cycle */
  componentWillMount() {
    UmengAnalysis.onPageBegin('CheckInRules');
  }
  componentDidMount() {
    this.setState({ refreshing: true });
    this.fetchPositionData();
  }

  componentWillUnmount() {
    UmengAnalysis.onPageEnd('CheckInRules');
    ABORT('getUserAuthorizedBranchInfo');
  }

  /** callback */

  // 下拉刷新时触发
  onRefresh() {
    this.setState({ refreshing: true });
    InteractionManager.runAfterInteractions(() => this.fetchPositionData());
  }

  /** private method */

  // 从服务器获取定位部门列表和蓝牙云盒列表数据
  fetchPositionData() {
    GET(getUserAuthorizedBranchInfo(), (responseData) => {
      this.setState({
        refreshing: false,
        locState: responseData.gpsCode.state,
        locData: responseData.gpsCode.data,
        bleState: responseData.bhtCode.state,
        bleData: responseData.bhtCode.data,
      });
    }, (message) => {
      this.setState({ refreshing: false });
      showMessage(messageType.error, message);
    }, 'getUserAuthorizedBranchInfo');
  }

  // 切换定位地址限制开关状态
  resetLocateState(value) {
    this.setState({ locState: value });
  }

  // 切换蓝牙地址限制开关状态
  resetBleState(value) {
    this.setState({ bleState: value });
  }

  /** render method */

  render() {
    const { locState, locData, bleState, bleData, refreshing } = this.state;
    const { navigator } = this.props;
    return (
      <View style={[styles.flex, styles.background]}>
        <NavBar title={I18n.t('mobile.module.checkinrules.punchruletitle')} onPressLeftButton={() => navigator.pop()} />
        <ScrollView
          style={styles.flex}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => this.onRefresh()} />}
        >
          <LocationCheckIn
            navigator={navigator}
            locationState={locState}
            locationData={locData}
            resetLocateState={(value) => this.resetLocateState(value)}
            fetchData={() => this.onRefresh()} />
          <BluetoothLocation
            navigator={navigator}
            bluetoothState={bleState}
            bluetoothData={bleData}
            resetBleState={(value) => this.resetBleState(value)}
            fetchData={() => this.onRefresh()} />
        </ScrollView>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  flex: {
    flexGrow: 1,
  },
  background: {
    backgroundColor: '$color.containerBackground',
  },
  prompt_container_locate: {
    height: 28,
    width: device.width,
    justifyContent: 'flex-end',
  },
  prompt_container: {
    height: 40,
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
    backgroundColor: '#f6f6f7',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#EBEBEB',
    borderBottomWidth: device.hairlineWidth,
  },
  row_text_container: {
    flexGrow: 3,
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
});