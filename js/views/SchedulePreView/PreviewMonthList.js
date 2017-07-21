/**
 * 月视图横向列表控件
 */
import { ListView, TouchableHighlight, View } from 'react-native';
import { device } from '@/common/Util';
import Text from '@/common/components/TextField';
import React, { PureComponent } from 'react';
import moment from 'moment';
import Line from '@/common/components/Line';
import Constance from './Constance';

let lists = [];
let selectedIndex = 0;

export default class MonthList extends PureComponent {
  constructor(...args) {
    super(...args);
    this.horizonlist = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      horizonDataSource: this.horizonlist.cloneWithRows([]),
    };
  }

  componentWillMount() {
    yearMonth = this.props.yearMonth;
    console.log('componentWillMount =====', yearMonth);
    const months = [];
    months.push(moment().subtract(5, 'months').format('YYYY-MM'));
    months.push(moment().subtract(4, 'months').format('YYYY-MM'));
    months.push(moment().subtract(3, 'months').format('YYYY-MM'));
    months.push(moment().subtract(2, 'months').format('YYYY-MM'));
    months.push(moment().subtract(1, 'months').format('YYYY-MM'));
    months.push(moment().format('YYYY-MM'));
    months.push(moment().add(1, 'months').format('YYYY-MM'));
    months.push(moment().add(2, 'months').format('YYYY-MM'));
    months.push(moment().add(3, 'months').format('YYYY-MM'));
    for (let i = 0; i < months.length; i++) {
      const temp = {};
      const dateStr = `${months[i]}-01`;
      const count = moment(dateStr).daysInMonth();
      temp.day = dateStr;
      temp.checked = false;
      temp.count = count;
      temp.index = i;
      if (moment(yearMonth).format('YYYY-MM') === months[i]) {
        temp.checked = true;
        selectedIndex = i;
      }
      lists.push(temp);
    }
    this.setState({
      horizonDataSource: this.horizonlist.cloneWithRows(lists),
    });
  }

  componentWillUnmount() {
    lists = [];
    selectedIndex = 0;
  }

  onPressItem(rowData) {
    if (selectedIndex == rowData.index) return;
    lists.map(item => {
      if (rowData.index === item.index) {
        item.checked = true;
        selectedIndex = item.index;
      } else item.checked = false;
    });
    const { pressMonthCallback } = this.props;
    pressMonthCallback(rowData.day);

    this.setState({
      horizonDataSource: this.horizonlist.cloneWithRows(lists),
    });
  }

  inflateHorizonItemView = (rowData, sectionID, rowID, highlightRow) => {
    let bgcolor = 'white';
    if (rowData.checked) bgcolor = '#14BE4B';

    let textColor = '#000';
    if (rowData.checked) textColor = 'white';

    const monthText = Constance.getMonthText(rowData.day);
    return (
      <TouchableHighlight key={`${sectionID}-${rowID}`} style={{ width: device.width / 6, alignItems: 'center', justifyContent: 'center', backgroundColor: bgcolor, paddingVertical: 4 }} onPress={() => this.onPressItem(rowData)} >
        <View style={{ width: device.width / 6, alignItems: 'center', justifyContent: 'center', backgroundColor: bgcolor, height: 56 }} >
          <Text style={{ fontSize: 17, color: textColor, marginBottom: 2 }}>{monthText}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={{ height: 56 }}>
        <ListView
          ref={listview => this.listView = listview}
          horizontal
          dataSource={this.state.horizonDataSource}
          enableEmptySections
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          renderRow={this.inflateHorizonItemView}
        />
        <Line />
      </View>
    );
  }
}