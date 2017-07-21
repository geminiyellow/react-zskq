/**
 * 店铺列表
 */

import { DeviceEventEmitter, InteractionManager, ListView, RefreshControl, TouchableOpacity, View } from 'react-native';
import Text from '@/common/components/TextField';
import { device } from '@/common/Util';
import React, { PureComponent } from 'react';
import { GET, ABORT } from '@/common/Request';
import NavBar from '@/common/components/NavBar';
import EmptyView from '@/common/components/EmptyView';
import EStyleSheet from 'react-native-extended-stylesheet';
import { getShoplists } from '@/common/api';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import I18n from 'react-native-i18n';
import { refreshStyle } from '@/common/Style';
import Image from '@/common/components/CustomImage';
import _ from 'lodash';
import Line from '@/common/components/Line';
import ShopItemDetail from './ShopItemDetail';

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
  },
});
const nodata = 'empty_schedule';

const rightarr = 'forward';
const shopicon = 'shopicon';
// 保存接口返回的原始数据
let listData = [];

export default class Shoplists extends PureComponent {
  constructor(...args) {
    super(...args);
    this.list = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      empty: false,
      refreash: true,
      dataSource: this.list.cloneWithRows([]),
    };
  }

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
    this.setState({
      dataSource: this.list.cloneWithRows(listData),
      refreash: true,
    });
    this.sendRequest();
  }

  getContentView() {
    if (!this.state.empty) {
      return (
        <View style={{ flex: 1, marginTop: 10 }}>
          <ListView
            ref={listview => this.listView = listview}
            dataSource={this.state.dataSource}
            enableEmptySections
            initialListSize={10}
            pageSize={3}
            removeClippedSubviews
            showsVerticalScrollIndicator={false}
            renderRow={(rowData, sectionID, rowID, highlightRow) => this.inflateItem(rowData, sectionID, rowID, highlightRow)}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreash}
                onRefresh={this.onRefreshing}
                enabled
                progressBackgroundColor={refreshStyle.progressBackgroundColor}
                colors={refreshStyle.colors}
                tintColor={refreshStyle.tintColor}
              />
            }
          />
        </View>
      );
    }
    return (
      <View style={{ flexGrow: 1, backgroundColor: '#fff' }}>
        <EmptyView emptyimg={nodata} emptyTitle={'这里将展示您需要审批的排班'} emptyContent={'暂无排班需要审批'} />
      </View>
    );
  }

  sendRequest() {
    GET(getShoplists(), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        if (_.isEmpty(responseData)) {
          this.setState({
            empty: true,
            refreash: false,
          });
          return;
        }
        listData = [...responseData];
        this.setState({
          dataSource: this.list.cloneWithRows(listData),
          empty: false,
          refreash: false,
        });
      });
    }, (err) => {
      showMessage(messageType.error, err);
    }, 'getShoplists');
  }

  ItemClick = (rowData) => {
    this.props.navigator.push({
      component: ShopItemDetail,
      passProps: {
        data: rowData,
      },
    });
  }

  inflateItem(rowData, sectionID, rowID, highlightRow) {
    return (
      <TouchableOpacity style={{ paddingLeft: 18, backgroundColor: '#fff' }} key={`${sectionID}-${rowID}`} onPress={() => this.ItemClick(rowData)}>
        <View style={{ flexDirection: 'row', paddingVertical: 11 }}>
          <Image style={styles.shopiconStyle} source={{ uri: shopicon }} />
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{ color: '#333333', fontSize: 14 }}>{rowData.ToDoTitle}</Text>
            <Text style={{ color: '#999999', fontSize: 13, marginTop: 8 }}>店铺地址 : {rowData.ADDRESS}</Text>
            <Text style={{ color: '#999999', fontSize: 13, marginTop: 8 }}>排班月份 : {rowData.YearMonth}</Text>
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
        <NavBar title={'排班审批'} onPressLeftButton={() => this.props.navigator.pop()} />
        {this.getContentView()}
      </View>
    );
  }
}