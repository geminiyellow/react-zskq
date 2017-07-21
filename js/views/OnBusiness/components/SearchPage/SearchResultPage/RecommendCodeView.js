// 推荐客户代码视图

import React, { Component } from 'react';
import { DeviceEventEmitter, ListView, Text, TouchableOpacity, View } from 'react-native';
import { event, device } from '@/common/Util';
import EStyleSheet from 'react-native-extended-stylesheet';
import MyLine from '../MyLine';

export default class RecommendCodeView extends Component {

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  }

  /** event response */

  onPressRow(text) {
    const { navigator } = this.props;
    navigator.pop();
    DeviceEventEmitter.emit(event.OB_SET_PROJECTCODE, text);
  }

  /** render method */

  renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableOpacity style={styles.row} key={`${sectionID}-${rowID}`} onPress={() => this.onPressRow(rowData)}>
        <Text allowFontScaling={false} style={styles.rowFont}>{rowData}</Text>
      </TouchableOpacity>
    );
  }

  renderSeparator(sectionID, rowID) {
    const dataSource = this.ds.cloneWithRows(this.recommendCodeData);
    const lastRow = rowID == (dataSource.getRowCount() - 1);
    if (!lastRow) return <MyLine key={`${sectionID}-${rowID}`} />;
  }

  render() {
    const { sectionTitle, projectCodeArray } = this.props;
    this.recommendCodeData = Array.from(projectCodeArray);
    if (this.recommendCodeData.length >= 4) {
      this.recommendCodeData = this.recommendCodeData.slice(0, 4);
    } else {
      this.recommendCodeData = [];
    }
    const dataSource = this.ds.cloneWithRows(this.recommendCodeData);
    return (
      <View>
        <View style={styles.bar}>
          <Text allowFontScaling={false} style={styles.font}>{sectionTitle}</Text>
        </View>
        <ListView
          dataSource={dataSource}
          renderRow={(rowData, sectionID, rowID) => this.renderRow(rowData, sectionID, rowID)}
          renderSeparator={(sectionID, rowID) => this.renderSeparator(sectionID, rowID)}
          removeClippedSubviews={false}
          enableEmptySections
        />
      </View>
    );
  }
}
const styles = EStyleSheet.create({
  bar: {
    width: device.width,
    height: 28,
    backgroundColor: '#f0eff5',
    justifyContent: 'center',
    paddingLeft: 22,
    marginTop: 20,
  },
  font: {
    fontSize: 14,
    color: '#999999',
  },
  row: {
    height: 44,
    width: device.width,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  rowFont: {
    marginLeft: 22,
    fontSize: 16,
    color: '#1fd662',
  },
});