/**
 * 主管审核表单详情 同意弹窗功能
 */
import { ListView, TouchableOpacity, View } from 'react-native';
import Text from '@/common/components/TextField';
import { device } from '@/common/Util';
import React, { PureComponent } from 'react';
import { getDaysAccountForMonth } from '@/common/Functions';
import moment from 'moment';
import Line from '@/common/components/Line';

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
    const count = getDaysAccountForMonth(moment(dateStr));
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
    const dateStr = `${this.state.yearMonth}-01`;
    selectedDay = moment(dateStr).add(rowData.index - 1, 'day').format('YYYY-MM-DD');
    console.log('selectedDay: ' + selectedDay);
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
    if (rowData.checked) textColor = 'white';

    const day = moment(rowData.day).days();
    let weekText = '';
    switch (day) {
      case 0:
        weekText = '日';
        break;
      case 1:
        weekText = '一';
        break;
      case 2:
        weekText = '二';
        break;
      case 3:
        weekText = '三';
        break;
      case 4:
        weekText = '四';
        break;
      case 5:
        weekText = '五';
        break;
      case 6:
        weekText = '六';
        break;
      default:
        weekText = '';
        break;
    }
    const month = moment(rowData.day).month();
    let monthText = '';
    switch (month) {
      case 0:
        monthText = '1月';
        break;
      case 1:
        monthText = '2月';
        break;
      case 2:
        monthText = '3月';
        break;
      case 3:
        monthText = '4月';
        break;
      case 4:
        monthText = '5月';
        break;
      case 5:
        monthText = '6月';
        break;
      case 6:
        monthText = '7月';
        break;
      case 7:
        monthText = '8月';
        break;
      case 8:
        monthText = '9月';
        break;
      case 9:
        monthText = '10月';
        break;
      case 10:
        monthText = '11月';
        break;
      case 11:
        monthText = '12月';
        break;
      default:
        monthText = '';
        break;
    }
    return (
      <TouchableOpacity style={{ width: 55, alignItems: 'center', justifyContent: 'center', backgroundColor: bgcolor, paddingVertical: 4 }} onPress={() => this.onPressItem(rowData)} >
        <Text style={{ fontSize: 12, color: textColor, marginTop: 2 }}>{weekText}</Text>
        <Text style={{ fontSize: 18, color: textColor }}>{`${rowData.index}`}</Text>
        {
          rowData.checked ? <Text style={{ fontSize: 12, color: textColor, marginBottom: 2 }}>{monthText}</Text> : null
        }
      </TouchableOpacity>
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