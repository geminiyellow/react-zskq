// 显示从服务器端获取的所有考勤设备数据列表

import React, { Component } from 'react';
import { ActivityIndicator, DeviceEventEmitter, NativeAppEventEmitter, ListView, RefreshControl, View } from 'react-native';
import MyLine from '../common/MyLine';
import LocationRow from '../common/LocationRow';
import Bar from '../common/Bar';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import { getNeedChangeMachine } from '@/common/api';
import { GET, ABORT } from '@/common/Request';
import EmptyView from '@/common/components/EmptyView';
import Beacon from '../common/Beacon';
import { device } from '@/common/Util';
import { connect } from 'react-redux';
import { showEmptyView, showActivityIndicator, showRefreshControl, showDevicesList } from '../../actions';

const emptyImg = 'empty';

class Device extends Component {
  mixins: [React.addons.PureRenderMixin]

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.devices = [];
    const { dispatch } = this.props;
    dispatch(showEmptyView(false));
    dispatch(showRefreshControl(false));
    dispatch(showActivityIndicator(true));
    dispatch(showDevicesList(
      this.ds.cloneWithRows([])
    ));
  }

  componentDidMount() {
    this.fetchData();
    this.beaconListener();
    this.locationConfigListener = DeviceEventEmitter.addListener('locationDidConfig', (data) => {
      this.fetchData();
    });
  }

  componentWillUnmount() {
    ABORT('getNeedChangeMachine');
    Beacon.stop();
    this.beaconsDidRange.remove();
    this.locationConfigListener.remove();
  }

  // 下拉刷新重新请求数据
  onRefresh() {
    const { dispatch } = this.props;
    dispatch(showRefreshControl(true));
    this.fetchData();
  }

  // 从服务器请求数据
  fetchData() {
    const { params, dispatch } = this.props;
    if (!params) return;
    const TokenID = params.notiData.TOKENID;
    const MachineGroupId = params.notiData.MACHINEGROUPID;
    const language = params.language;
    const p = { MachineGroupId, language, TokenID };
    GET(getNeedChangeMachine(p), (data) => {
      this.devices = data;
      // 数据为空时显示 empty view
      if (this.devices.length < 1) {
        dispatch(showEmptyView(true));
        dispatch(showActivityIndicator(false));
        return;
      }
      dispatch(showDevicesList(
        this.ds.cloneWithRows(this.devices),
      ));
      dispatch(showEmptyView(false));
      dispatch(showActivityIndicator(false));
      dispatch(showRefreshControl(false));
      // 列表里没有蓝牙设备时不扫描蓝牙
      let count = 0;
      this.devices.forEach((item) => {
        if (item.major !== '') {
          count ++;
        }
      });
      if (count > 0) Beacon.scan();
    }, (message) => {
      showMessage(messageType.error, message);
      dispatch(showRefreshControl(false));
      dispatch(showEmptyView(true));
      dispatch(showActivityIndicator(false));
    }, 'getNeedChangeMachine');
  }

  // 检测到Beacon设备时处理
  beaconListener() {
    const { dispatch } = this.props;
    this.beaconsDidRange = NativeAppEventEmitter.addListener('beaconsDidRange', (data) => {
      if (data.beacons.length < 1) return;
      let count = 0;
      data.beacons.forEach(item => {
        this.devices.forEach(device => {
          if (device.major === item.major.toString()) {
            device.proximity = item.proximity;
            count++;
          }
        });
      });
      if (count == 0) return;
      dispatch(showDevicesList(
        this.ds.cloneWithRows(this.devices),
      ));
    });
  }

  // 渲染 ListView 表头视图
  renderHeader() {
    if (this.devices.length > 0) {
      const title = this.devices[0].GroupName;
      return <Bar title={title} />;
    }
    return null;
  }

  // 渲染 ListView 行视图
  renderRow(rowData, sectionID, rowID) {
    const { navigator, params } = this.props;
    return <LocationRow key={`${sectionID}-${rowID}`} data={rowData} navigator={navigator} rowID={rowID} params={params} />;
  }

  // 渲染 ListView 行分割线
  renderSeparator(sectionID, rowID) {
    const { devices } = this.props;
    const lastRow = rowID == (devices.getRowCount() - 1);
    if (!lastRow) return <MyLine key={`${sectionID}-${rowID}`} />;
  }

  render() {
    const { isEmpty, isAnimating, isRefreshing } = this.props;
    let { devices } = this.props;
    if (!devices) devices = this.ds.cloneWithRows([]);
    return (
      <View style={{ flexGrow: 1 }}>
        {isEmpty ? <EmptyView emptyimg={emptyImg} emptyContent=" " onRefreshing={() => this.onRefresh()} /> :
        <ListView
          dataSource={devices}
          renderRow={(rowData, sectionID, rowID) => this.renderRow(rowData, sectionID, rowID)}
          renderSeparator={(sectionID, rowID) => this.renderSeparator(sectionID, rowID)}
          renderHeader={() => this.renderHeader()}
          removeClippedSubviews={false}
          enableEmptySections
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => this.onRefresh()} />}
          />}
        <ActivityIndicator
          style={{ position: 'absolute', top: device.height / 2.0 - 100, left: device.width / 2.0 - 8, transform: [{ scale: 1.3 }] }}
          color="#1FD662"
          animating={isAnimating} />
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { isEmpty, isAnimating, isRefreshing, devices } = state.setUpReducer;
  return {
    isEmpty,
    isAnimating,
    isRefreshing,
    devices,
  };
}

export default connect(mapStateToProps)(Device);