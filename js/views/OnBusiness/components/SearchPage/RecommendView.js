// 推荐项目代码

import React, { Component } from 'react';
import { DeviceEventEmitter, InteractionManager, ListView, Text, TouchableOpacity, View } from 'react-native';
import { event, device } from '@/common/Util';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import MyLine from './MyLine';

export default class RecommendView extends Component {
  mixins: [React.addons.PureRenderMixin]

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = { dataSource: this.ds.cloneWithRows([]) };
  }

  /** life cycle */

  componentDidMount() {
    const { recommendCodeArray } = this.props;
    const array = Array.from(recommendCodeArray);
    InteractionManager.runAfterInteractions(() => {
      this.setState({ dataSource: this.ds.cloneWithRows(array.reverse()) });      
    });
  }

  /** event response */

  onPressRow(text) {
    const { navigator } = this.props;
    navigator.pop();
    DeviceEventEmitter.emit(event.OB_SET_PROJECTCODE, text);
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
    const { dataSource } = this.state;
    return (
      <View>
        <View style={styles.bar}>
          <Text allowFontScaling={false} style={styles.font}>{I18n.t('mobile.module.onbusiness.recommendcodesectiontitle')}</Text>
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