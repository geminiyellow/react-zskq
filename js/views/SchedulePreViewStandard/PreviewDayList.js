/**
 * 主管审核表单详情 同意弹窗功能
 */
import { ListView, TouchableHighlight, View } from 'react-native';
import { device } from '@/common/Util';
import Text from '@/common/components/TextField';
import React, { PureComponent } from 'react';
import moment from 'moment';
import Line from '@/common/components/Line';
import Constance from './Constance';

let days = [];
let selectedDay = moment().format('YYYY-MM-DD');
let selectedIndex = 0;

export default class DayList extends PureComponent {
  constructor(...args) {
    super(...args);
    this.horizonlist = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      horizonDataSource: this.horizonlist.cloneWithRows([]),
      yearMonth: selectedDay,
    };
  }

  componentWillMount() {
    const yearmonth = this.props.yearMonth;
    const dateStr = `${yearmonth}-01`;
    const count = moment(dateStr).daysInMonth();
    for (let i = 0; i < count; i++) {
      const temp = {};
      temp.index = i + 1;
      temp.checked = false;
      temp.weekindex = moment(dateStr).add(i, 'day').day();
      temp.day = moment(dateStr).add(i, 'day').format('YYYY-MM-DD');
      if (i === 0) temp.checked = true;
      days.push(temp);
    }
    this.setState({
      horizonDataSource: this.horizonlist.cloneWithRows(days),
      yearMonth: yearmonth,
    });
  }

  componentWillUnmount() {
    days = [];
    selectedIndex = 0;
  }

  onPressItem(rowData) {
    console.log('dayList', rowData);
    const dateStr = `${this.state.yearMonth}-01`;
    selectedDay = moment(dateStr).add(rowData.index - 1, 'day').format('YYYY-MM-DD');
    if (selectedIndex == rowData.index) return;
    days.map(item => {
      if (item.index == rowData.index) {
        item.checked = true;
        selectedIndex = item.index;
      } else item.checked = false;
    });
    const { pressCallback } = this.props;
    pressCallback(selectedDay);

    this.setState({
      horizonDataSource: this.horizonlist.cloneWithRows(days),
    });
  }

  inflateHorizonItemView = (rowData, sectionID, rowID, highlightRow) => {
    let bgcolor = 'white';
    if (rowData.checked) bgcolor = '#14BE4B';

    let textColor = '#000';
    if (moment(rowData.day).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')) textColor = '#14BE4B';
    if (rowData.checked) textColor = 'white';

    const weekText = Constance.getWeekText(rowData.day);
    const monthText = Constance.getMonthText(rowData.day);
    return (
      <TouchableHighlight style={{ width: 55, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, height: 56 }} key={`${sectionID}-${rowID}`} onPress={() => this.onPressItem(rowData)} >
        <View style={{ width: 55, height: 56, alignItems: 'center', justifyContent: 'center', backgroundColor: bgcolor }}>
          <Text style={{ fontSize: 12, color: textColor, marginTop: 2 }}>{weekText}</Text>
          <Text style={{ fontSize: 18, color: textColor }}>{`${rowData.index}`}</Text>
          {
            rowData.checked ? <Text style={{ fontSize: 12, color: textColor, marginBottom: 2 }}>{monthText}</Text> : null
          }
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