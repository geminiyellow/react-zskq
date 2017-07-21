/**
 * 周视图横向列表控件
 */
import { ListView, TouchableHighlight, View } from 'react-native';
import Text from '@/common/components/TextField';
import { device } from '@/common/Util';
import React, { PureComponent } from 'react';
import moment from 'moment';
import Line from '@/common/components/Line';
import Constance from './Constance';

let lists = [];
let selectedIndex = 0;

export default class WeekList extends PureComponent {
  constructor(...args) {
    super(...args);
    this.horizonlist = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      horizonDataSource: this.horizonlist.cloneWithRows([]),
    };
  }

  componentWillMount() {
    const yearMonth = this.props.yearMonth;
    const dateStr = `${yearMonth}-01`;
    const count = moment(dateStr).daysInMonth();
    for (let i = 0; i < count; i++) {
      const itemMoment = moment(dateStr).add(i, 'day');
      if (itemMoment.day() == 1) {
        // 第一项不是星期一
        if (i != 0 && lists.length == 0) {
          const first = {};
          first.index = 0;
          selectedIndex = 0;
          first.start = dateStr;
          first.end = itemMoment.subtract(1, 'day').format('YYYY-MM-DD');
          first.checked = true;
          lists.push(first);
        }

        const temp = {};
        temp.index = i;
        if (lists.length == 0) temp.checked = true;
        else temp.checked = false;
        temp.start = moment(dateStr).add(i, 'day').format('YYYY-MM-DD');
        // 开始时间 + 7天 包含在本月内
        if (moment(temp.start).add(6, 'day').isBefore(moment(`${yearMonth}-${count}`))) {
          temp.end = moment(temp.start).add(6, 'day').format('YYYY-MM-DD');
        } else {
          temp.end = moment(`${yearMonth}-${count}`).format('YYYY-MM-DD');
        }
        lists.push(temp);
      }
    }
    console.log('lists ======', JSON.stringify(lists));
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
      if (item.index == rowData.index) {
        item.checked = true;
        selectedIndex = item.index;
      } else item.checked = false;
    });
    const { pressWeekCallback } = this.props;
    const result = {};
    result.start = rowData.start;
    result.end = rowData.end;
    pressWeekCallback(result);

    this.setState({
      horizonDataSource: this.horizonlist.cloneWithRows(lists),
    });
  }

  inflateHorizonItemView = (rowData, sectionID, rowID, highlightRow) => {
    let bgcolor = 'white';
    if (rowData.checked) bgcolor = '#14BE4B';

    let textColor = '#000';
    if (rowData.checked) textColor = 'white';

    const monthText = Constance.getMonthText(rowData.start);
    return (
      <TouchableHighlight style={{ width: device.width / 5, alignItems: 'center', justifyContent: 'center', backgroundColor: bgcolor, paddingVertical: 4 }} key={`${sectionID}-${rowID}`} onPress={() => this.onPressItem(rowData)} >
        <View style={{ width: device.width / 5, height: 56, alignItems: 'center', justifyContent: 'center', backgroundColor: bgcolor }} >
          <Text style={{ fontSize: 12, color: textColor, marginBottom: 2 }}>{monthText}</Text>
          <Text style={{ fontSize: 18, color: textColor }}>{`${moment(rowData.start).date()}-${moment(rowData.end).date()}`}</Text>
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
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          renderRow={this.inflateHorizonItemView}
        />
        <Line />
      </View>
    );
  }
}