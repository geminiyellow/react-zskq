import React, { Component } from 'react';
import { DeviceEventEmitter, ListView, RefreshControl, View, Keyboard } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import NavBar from '@/common/components/NavBar';
import UmengAnalysis from '@/common/components/UmengAnalysis';
import Line from '@/common/components/Line';
import { GET, ABORT } from '@/common/Request';
import { getStoreInfo } from '@/common/api';
import EmptyView from '@/common/components/EmptyView';
import { device } from '@/common/Util';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
import StoreCard from './StoreCard';
import { FETCH_STORE_DATA } from './constant';
const emptyImg = 'empty';
// 导入公司代码的数据
const customizedCompanyHelper = new CustomizedCompanyHelper();

export default class MyStore extends Component {
  mixins: [React.addons.PureRenderMixin]

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      noData: false,
      dataSource: this.ds.cloneWithRows([]),
      refreshing: false,
    };
  }

  /** life cycle */
  componentWillMount() {
    UmengAnalysis.onPageBegin('MyStore');
  }

  componentDidMount() {
    this.onRefresh();
    this.reloadDataListener = DeviceEventEmitter.addListener(FETCH_STORE_DATA, (data) => { this.onRefresh(); });
  }

  componentWillUnmount() {
    UmengAnalysis.onPageEnd('MyStore');
    ABORT('getStoreInfo');
    this.reloadDataListener.remove();
  }

  /** callback */

  onPressLeftButton() {
    const { navigator } = this.props;

    if (device.isAndroid) {
      Keyboard.dismiss();
    }
    navigator.pop()
  }

  onRefresh() {
    this.fetchStoreDate().then(
      (data) => {
        if (data && data.gpsCode && data.gpsCode.data && Array.isArray) {
          if (data.gpsCode.data.length < 1) {
            this.setState({
              noData: true,
              refreshing: false,
            });
          } else {
            this.setState({
              noData: false,
              dataSource: this.ds.cloneWithRows(data.gpsCode.data),
              refreshing: false,
            });
          }
        }
      }, (errorMessage) => {
        showMessage(messageType.error, errorMessage);
        this.setState({
          noData: true,
          refreshing: false,
        });
      });
  }

  /** private method */

  fetchStoreDate() {
    this.setState({ refreshing: false });
    return new Promise((resolve, reject) => {
      GET(getStoreInfo(customizedCompanyHelper.getPrefix()), (data) => {
        resolve(data);
      }, (errorMessage) => {
        reject(errorMessage);
      }, 'getStoreInfo');
    });
  }

  /** render methods */
  renderListView() {
    const { noData, dataSource, refreshing } = this.state;
    if (noData) {
      return (
        <View style={styles.noDataView}>
          <EmptyView
            emptyimg={emptyImg}
            emptyTitle="暂无数据"
            emptyContent="这里将展示我的店铺信息" />
        </View>
      );
    }
    return (
      <ListView
        style={[styles.listView, { marginTop: device.isAndroid ? 10 : 0 }]}
        dataSource={dataSource}
        renderHeader={() => this.renderHeader()}
        renderRow={(rowData, sectionID, rowID) => this.renderRow(rowData, sectionID, rowID)}
        renderSeparator={(sectionID, rowID) => this.renderSeparator(sectionID, rowID)}
        removeClippedSubviews={false}
        enableEmptySections
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => this.onRefresh()}
          />
        }
      />
    );
  }

  renderHeader() {
    return <Line />;
  }

  renderRow(rowData, sectionID, rowID) {
    const { navigator } = this.props;
    return (
      <StoreCard navigator={navigator} data={rowData} />
    );
  }

  renderSeparator(sectionID, rowID) {
    return <Line key={`${sectionID}-${rowID}`} />;
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar title="我的店铺" onPressLeftButton={() => this.onPressLeftButton()} />
        {this.renderListView()}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
  },
  listView: {
    paddingTop: 10,
  },
  noDataView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    width: device.width,
    height: device.height,
  },
});