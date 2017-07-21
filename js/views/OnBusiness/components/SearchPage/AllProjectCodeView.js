// 全部项目代码视图

import React, { Component } from 'react';
import { DeviceEventEmitter, InteractionManager, ListView, Text, TouchableOpacity, View } from 'react-native';
import { event } from '@/common/Util';
import I18n from 'react-native-i18n';
import MyLine from './MyLine';
import styles from './AllProjectCodeView.style';

// 全部项目代码第一部分显示行数
const RECOMMENED_CODE_AMOUNT = 4;

export default class AllProjectCodeView extends Component {

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: this.ds.cloneWithRows([]),
      restCodeDataSource: this.ds.cloneWithRows([]),
      isShowBar: false,
    };
  }

  /** life cycle */

  componentDidMount() {
    const { projectCodeArray } = this.props;
    let dataSource = [];
    let restCodeDataSource = [];
    let isShowBar = false;

    if (projectCodeArray.length > RECOMMENED_CODE_AMOUNT) {
      dataSource = projectCodeArray.slice(0, RECOMMENED_CODE_AMOUNT);
      restCodeDataSource = projectCodeArray.slice(RECOMMENED_CODE_AMOUNT, projectCodeArray.length);
      isShowBar = true;
    } else {
      dataSource = projectCodeArray;
    }
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        isShowBar,
        dataSource: this.ds.cloneWithRows(dataSource),
        restCodeDataSource: this.ds.cloneWithRows(restCodeDataSource),
      });
    });
  }

  /** event response */

  onPressRow(text) {
    const { navigator } = this.props;
    navigator.pop();
    DeviceEventEmitter.emit(event.OB_SET_PROJECTCODE, text);
  }

  /** render method */

  renderSeparator(sectionID, rowID) {
    const { dataSource } = this.state;
    const lastRow = rowID == (dataSource.getRowCount() - 1);
    if (!lastRow) return <MyLine key={`${sectionID}-${rowID}`} />;
  }

  renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableOpacity style={styles.row} key={`${sectionID}-${rowID}`} onPress={() => this.onPressRow(rowData)}>
        <Text allowFontScaling={false} style={styles.rowFont}>{rowData}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { dataSource, restCodeDataSource, isShowBar } = this.state;
    return (
      <View>
        <View style={styles.bar}>
          <Text allowFontScaling={false} style={styles.font}>{I18n.t('mobile.module.onbusiness.allprojectcodesectiontitle')}</Text>
        </View>
        <View>
          <ListView
            dataSource={dataSource}
            renderRow={(rowData, sectionID, rowID) => this.renderRow(rowData, sectionID, rowID)}
            renderSeparator={(sectionID, rowID) => this.renderSeparator(sectionID, rowID)}
            removeClippedSubviews={false}
            enableEmptySections
          />
        </View>
        {isShowBar ? <View style={[styles.bar, { height: 10 }]} /> : null}
        <ListView
          dataSource={restCodeDataSource}
          renderRow={(rowData, sectionID, rowID) => this.renderRow(rowData, sectionID, rowID)}
          renderSeparator={(sectionID, rowID) => this.renderSeparator(sectionID, rowID)}
          removeClippedSubviews={false}
          enableEmptySections
        />
      </View>
    );
  }
}