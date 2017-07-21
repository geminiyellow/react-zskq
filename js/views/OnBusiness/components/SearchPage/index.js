// 搜索项目代码页面

import React, { Component } from 'react';
import { DeviceEventEmitter, InteractionManager, ListView, NativeModules, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { keys, event } from '@/common/Util';
import Realm from 'realm';
import AllProjectCodeView from './AllProjectCodeView';
import MyLine from './MyLine';
import RecommendView from './RecommendView';
import SearchBar from './SearchBar';
import SearchHistoryView from './SearchHistoryView';
import SearchResultPage from './SearchResultPage';
import styles from './index.style';
import realm from '@/realm';

const { RNSearchCoreManager } = NativeModules;
// 搜索历史最大显示数量
const HISTORY_MAX_LENGTH = 5;

export default class SearchPage extends Component {
  mixins: [React.addons.PureRenderMixin]

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    // 搜索历史数据
    this.searchHistoryArray = [];
    this.state = {
      dataSource: this.ds.cloneWithRows([]),
      // 显示快速搜索结果视图
      isShowQuickResultView: false,
      // 显示搜索结果视图
      isShowSearchResultView: false,
      // 搜索结果
      filteredArray: [],
      // 搜索历史数据
      searchHistoryData: [],
    };
  }

  /** life cycle */

  componentDidMount() {
    this.projectCodeArray = this.props.passProps.projectCodeData;
    InteractionManager.runAfterInteractions(() => {
      this.loadHistoryData();
    });
    this.loadHistoryDataListener = DeviceEventEmitter.addListener('historyDataListener', (data) => {
      if (data) this.loadHistoryData();
    });
    // 添加项目代码到搜索库
    RNSearchCoreManager.addAllCodes(this.projectCodeArray);
  }

  componentWillUnmount() {
    this.storeHistoryData();
    this.loadHistoryDataListener.remove();
  }

  /** callback */

  onSubmitSearchAction(text) {
    if (text === '') return;
    RNSearchCoreManager.searchCode(text, (filteredArray) => {
      this.setState({
        isShowQuickResultView: false,
        isShowSearchResultView: true,
        filteredArray,
      });
    });
    this.getSearchHistoryData(text);
  }

  /** event response */

  onPressRow(text) {
    const { navigator } = this.props;
    navigator.pop();
    DeviceEventEmitter.emit(event.OB_SET_PROJECTCODE, text);
  }

  /** private methods */

  // 搜索历史
  getSearchHistoryData(text) {
    this.searchHistoryArray.push(text);
    this.searchHistoryArray.reverse();
    const items = new Set(this.searchHistoryArray);
    this.searchHistoryArray = Array.from(items);
    this.searchHistoryArray.reverse();
    this.setState({ searchHistoryData: this.searchHistoryArray });
  }

  // 加载历史数据
  loadHistoryData() {
     const historyData = realm.objects('ProjectCode').filtered('recommend = false');
     const searchHistoryCodes = [];
     historyData.forEach((value) => {
       searchHistoryCodes.push(value.code);
     });
    if (!this.searchHistoryArray) return;
    this.setState({ searchHistoryData: searchHistoryCodes });
  }

  // 存储历史数据
  storeHistoryData() {
    const historyData = this.searchHistoryArray.slice(0, HISTORY_MAX_LENGTH);
    const allHistoryCodes = realm.objects('ProjectCode').filtered('recommend = false');
    realm.write(() => {
      realm.delete(allHistoryCodes);
      for (const historyCode of historyData) {
        realm.create('ProjectCode', {code: historyCode, recommend: false});
      }
    });
  }

  // 搜索项目代码
  searchCode(text) {
    if (text === '') {
      this.setState({
        isShowQuickResultView: false,
        isShowSearchResultView: false,
      });
      return;
    }
    RNSearchCoreManager.searchCode(text, (filteredArray) => {
      const dataSource = this.ds.cloneWithRows(filteredArray);
      this.setState({
        isShowQuickResultView: true,
        isShowSearchResultView: false,
        dataSource,
      });
    });
  }

  /** render methods */

  renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableOpacity style={styles.row} key={`${sectionID}-${rowID}`} onPress={() => this.onPressRow(rowData)}>
        <Text allowFontScaling={false} style={styles.rowFont}>{rowData}</Text>
      </TouchableOpacity>
    );
  }

  renderSeparator(sectionID, rowID) {
    const { dataSource } = this.state;
    const lastRow = rowID == (dataSource.getRowCount() - 1);
    if (!lastRow) return <MyLine key={`${sectionID}-${rowID}`} />;
  }

  render() {
    const { navigator, passProps } = this.props;
    const { dataSource, isShowSearchResultView, isShowQuickResultView, filteredArray, searchHistoryData } = this.state;
    const projectCodeArray = passProps.projectCodeData;
    const recommendCodeArray = passProps.recommendCodeArray;
    const length = recommendCodeArray.length;

    return (
      <View style={styles.container}>
        <View style={styles.status} />
        <SearchBar navigator={navigator} searchCode={(text) => this.searchCode(text)} onSubmitSearchAction={(text) => this.onSubmitSearchAction(text)} />
        {isShowQuickResultView && !isShowSearchResultView ?
          <ScrollView>
            <ListView
              dataSource={dataSource}
              renderRow={(rowData, sectionID, rowID) => this.renderRow(rowData, sectionID, rowID)}
              renderSeparator={(sectionID, rowID) => this.renderSeparator(sectionID, rowID)}
              removeClippedSubviews={false}
              enableEmptySections
            />
          </ScrollView> : null}
        {!isShowQuickResultView && !isShowSearchResultView ?
          <ScrollView>
            <SearchHistoryView navigator={navigator} searchHistoryData={searchHistoryData} />
            {length < 1 ? null :
            <RecommendView recommendCodeArray={recommendCodeArray} navigator={navigator} />}
            <AllProjectCodeView projectCodeArray={projectCodeArray} navigator={navigator} />
          </ScrollView> : null}
        {!isShowQuickResultView && isShowSearchResultView ?
          <SearchResultPage filteredArray={filteredArray} navigator={navigator} projectCodeArray={projectCodeArray} /> : null}
      </View>
    );
  }
}