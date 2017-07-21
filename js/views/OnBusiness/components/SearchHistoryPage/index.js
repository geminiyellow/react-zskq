// 搜索历史页面
import React, { Component } from 'react';
import { DeviceEventEmitter, InteractionManager, ListView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Image from '@/common/components/CustomImage';
import Line from '@/common/components/Line';
import EmptyView from '@/common/components/EmptyView';
import NavBar from '@/common/components/NavBar';
import { keys } from '@/common/Util';
import I18n from 'react-native-i18n';
import realm from '@/realm';
import styles from './index.style';
const deleteImg = 'delete_history';
const searchHistory = 'search_history';
const emptyImg = 'empty';

export default class SearchHistoryPage extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    // 历史数据
    this.historyData = [];
    this.state = { dataSource: this.ds.cloneWithRows([]) };
  }

  /** life cycle */
  componentDidMount() {
    const { searchHistoryData } = this.props;
    this.historyData = searchHistoryData;
    InteractionManager.runAfterInteractions(() => {
      this.setState({ dataSource: this.ds.cloneWithRows(searchHistoryData) });
    });
  }

  componentWillUnmount() {
    this.storeHistoryData();
  }

  /** event response */
  onPressRow(text) {
    const { navigator } = this.props;
    navigator.pop();
    DeviceEventEmitter.emit('onPressHistoryData', text);
  }

  onPressDeleteBtn(rowID) {
    this.historyData.splice(rowID, 1);
    this.setState({ dataSource: this.ds.cloneWithRows(this.historyData) });
  }

  /** private method */
  // 存储历史数据
  storeHistoryData() {
    const historyArray = this.historyData.reverse();
    const allHistoryCodes = realm.objects('ProjectCode').filtered('recommend = false');
    realm.write(() => {
      realm.delete(allHistoryCodes);
      for (const historyCode of historyArray) {
        realm.create('ProjectCode', {code: historyCode, recommend: false});
      }
    });
    DeviceEventEmitter.emit('historyDataListener', true);
  }

  /** render method */
  renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableOpacity style={styles.row} key={`${sectionID}-${rowID}`} onPress={() => this.onPressRow(rowData)}>
        <Image style={styles.image} source={{ uri: searchHistory }} />
        <Text allowFontScaling={false} style={styles.rowFont}>{rowData}</Text>
        <TouchableOpacity onPress={() => this.onPressDeleteBtn(rowID)}>
          <Image style={styles.deleteImg} source={{ uri: deleteImg }} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  renderSeparator(sectionID, rowID) {
    const { dataSource } = this.state;
    const lastRow = rowID == (dataSource.getRowCount() - 1);
    return (
      <View style={styles.lineBackground} key={`${sectionID}-${rowID}`}>
        <Line style={!lastRow && styles.line} />
      </View>
    );
  }

  render() {
    const { navigator, searchHistoryData } = this.props;
    const { dataSource } = this.state;
    const length = searchHistoryData.length;
    return (
      <View style={styles.container}>
        <NavBar title={I18n.t('mobile.module.onbusiness.searchhistorybartitle')} onPressLeftButton={() => navigator.pop()} />
        <ScrollView style={styles.listViewContainer}>
          {length < 1 ?
            <EmptyView emptyimg={emptyImg} emptyTitle={I18n.t('mobile.module.onbusiness.emptytitle')} emptyContent={I18n.t('mobile.module.onbusiness.emptydetailtext')} /> :
            <ListView
              style={styles.list}
              dataSource={dataSource}
              renderRow={(rowData, sectionID, rowID) => this.renderRow(rowData, sectionID, rowID)}
              renderSeparator={(sectionID, rowID) => this.renderSeparator(sectionID, rowID)}
              removeClippedSubviews={false}
              enableEmptySections
            />}
        </ScrollView>
      </View>
    );
  }
}