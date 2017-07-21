/** 金额汇总 */

import React, { Component } from 'react';
import { ListView, Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';

// 金额汇总小数保留位数
const CURRENCY_RESERVED_BITS = 2;

export default class SummaryView extends Component {

  constructor(props) {
    super(props);
    this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  }

  /** render methods */

  renderRow(rowData, sectionID, rowID) {
    const amount = parseFloat(rowData.amount).toFixed(CURRENCY_RESERVED_BITS);
    return (
      <View style={styles.rowContainer}>
        {rowID != 0 ? <Text allowFontScaling={false} style={styles.plusFont}>+</Text> : null}
        <Text allowFontScaling={false} style={styles.sumFont}>{amount}</Text>
        <Text allowFontScaling={false} style={styles.currencyFont}>{rowData.currency}</Text>
      </View>
    );
  }

  render() {
    const { sumArray } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Text allowFontScaling={false} style={styles.font}>{I18n.t('mobile.module.onbusiness.summarytitletext')}</Text>
        </View>
        <ListView
          dataSource={this.dataSource.cloneWithRows(sumArray)}
          renderRow={(rowData, sectionID, rowID) => this.renderRow(rowData, sectionID, rowID)}
          removeClippedSubviews={false}
          enableEmptySections
          bounces={false}
          contentContainerStyle={styles.contentContainer}
        />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    height: 60,
    width: device.width,
    backgroundColor: 'white',
    flexDirection: 'row',
    borderTopWidth: device.hairlineWidth,
    borderColor: '$color.line',
  },
  title: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  font: {
    marginLeft: 18,
    fontSize: 16,
    color: '#333333',
  },
  contentContainer: {
    justifyContent: 'center',
    paddingVertical: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    height: 24,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 18,
  },
  plusFont: {
    fontSize: 14,
    color: '#333333',
    marginRight: 5,
    alignSelf: 'flex-start',
    marginTop: -6,
    backgroundColor: 'transparent',
  },
  sumFont: {
    fontSize: 14,
    color: '#333333',
    marginRight: 5,
    backgroundColor: 'transparent',
  },
  currencyFont: {
    color: '#333333',
    fontSize: 14,
    marginLeft: 5,
    backgroundColor: 'transparent',
  },
});