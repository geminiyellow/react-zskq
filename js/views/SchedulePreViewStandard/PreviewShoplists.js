/**
 * 部门列表
 */
import { DeviceEventEmitter, InteractionManager, TouchableOpacity, View } from 'react-native';
import { device } from '@/common/Util';
import Text from '@/common/components/TextField';
import React, { PureComponent } from 'react';
import { GET, ABORT } from '@/common/Request';
import NavBar from '@/common/components/NavBar';
import EmptyView from '@/common/components/EmptyView';
import EStyleSheet from 'react-native-extended-stylesheet';
import { getStandardPreviewShoplists } from '@/common/api';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import I18n from 'react-native-i18n';
import Image from '@/common/components/CustomImage';
import FlatListView from '@/common/components/FlatListView';
import _ from 'lodash';
import Line from '@/common/components/Line';
import PreviewShopItemDetail from './PreviewShopItemDetail';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
  },
  arrimgStyle: {
    width: 22,
    height: 22,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginRight: 12,
  },
  shopiconStyle: {
    width: 46,
    height: 46,
    marginRight: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginVertical: 7,
  },
});
const nodata = 'empty_schedule';

const rightarr = 'forward';
const shopicon = 'shopiconstandard';
// 保存接口返回的原始数据
let listData = [];

export default class PreviewShoplists extends PureComponent {

  componentDidMount() {
    this.sendRequest();
    DeviceEventEmitter.addListener('scheduleverify', () => {
      this.onRefreshing();
    });
  }

  componentWillUnmount() {
    ABORT('getShoplists');
  }

  onRefreshing = () => {
    if (device.isAndroid && this.listView) this.listView.scrollTo({ y: 0 });
    listData = [];
    this.sendRequest();
  }

  sendRequest() {
    GET(getStandardPreviewShoplists(), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        listData = [...responseData];
        this.flatlist.notifyList(listData, listData.length, true);
      });
    }, (err) => {
      showMessage(messageType.error, err);
    }, 'getShoplists');
  }

  ItemClick = (rowData) => {
    this.props.navigator.push({
      component: PreviewShopItemDetail,
      passProps: {
        data: rowData,
      },
    });
  }

  inflateItem = (rowData, index) => {
    return (
      <TouchableOpacity style={{ paddingLeft: 18, backgroundColor: '#fff' }} onPress={() => this.ItemClick(rowData)}>
        <View style={{ flexDirection: 'row' }}>
          <Image style={styles.shopiconStyle} source={{ uri: shopicon }} />
          <View style={{ flex: 1, flexDirection: 'column',justifyContent: 'center', }}>
            <Text style={{ color: '#333333', fontSize: 16 }}>{rowData.UNITCODE}</Text>
            <Text style={{ color: '#999999', fontSize: 14 , marginTop: 10 }}>{rowData.UNITNAME}</Text>
          </View>
          <Image style={styles.arrimgStyle} source={{ uri: rightarr }} />
        </View>
        <Line />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar title={'排班查询'} onPressLeftButton={() => this.props.navigator.pop()} />
        <FlatListView
          needPage={false}
          emptyIcon={nodata}
          ref={(ref) => this.flatlist = ref}
          inflatItemView={this.inflateItem}
          onRefreshCallback={this.onRefreshing}
          disableRefresh={false}
          disableEmptyView={false}
          emptyTitle={'暂无组织信息'}
          emptySubTitle={'这里将展示您管理的组织'}
        />
      </View>
    );
  }
}