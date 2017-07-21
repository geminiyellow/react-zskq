/**
 * 月视图横向列表控件
 */
import { TouchableHighlight, View } from 'react-native';
import { device } from '@/common/Util';
import Text from '@/common/components/TextField';
import React, { PureComponent } from 'react';
import FlatListView from '@/common/components/FlatListView';
import moment from 'moment';
import Line from '@/common/components/Line';
import Constance from './Constance';

let lists = [];
let selectedIndex = 0;

export default class MonthList extends PureComponent {

  componentDidMount() {
    yearMonth = this.props.yearMonth;
    const months = [];
    months.push(moment().subtract(6, 'months').format('YYYY-MM'));
    months.push(moment().subtract(5, 'months').format('YYYY-MM'));
    months.push(moment().subtract(4, 'months').format('YYYY-MM'));
    months.push(moment().subtract(3, 'months').format('YYYY-MM'));
    months.push(moment().subtract(2, 'months').format('YYYY-MM'));
    months.push(moment().subtract(1, 'months').format('YYYY-MM'));
    months.push(moment().format('YYYY-MM'));
    months.push(moment().add(1, 'months').format('YYYY-MM'));
    months.push(moment().add(2, 'months').format('YYYY-MM'));
    months.push(moment().add(3, 'months').format('YYYY-MM'));
    months.push(moment().add(4, 'months').format('YYYY-MM'));
    months.push(moment().add(5, 'months').format('YYYY-MM'));
    months.push(moment().add(6, 'months').format('YYYY-MM'));
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
    if (this.flatlist)
      this.flatlist.notifyList(lists, lists.length, true);
    window.setTimeout(
      () => { if (this.flatlist) this.flatlist.scrollToIndex(selectedIndex) },
      500
    );
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
    this.flatlist.notifyList(lists, lists.length, true);
    const { pressMonthCallback } = this.props;
    pressMonthCallback(rowData.day);
  }

  inflateHorizonItemView = (rowData, index) => {
    let bgcolor = 'white';
    if (rowData.checked) bgcolor = '#14BE4B';

    let textColor = '#000';
    if (moment(rowData.day).format('YYYY-MM') == moment().format('YYYY-MM')) {
      textColor = '#14BE4B';
    }
    if (rowData.checked) textColor = 'white';

    const monthText = Constance.getMonthText(rowData.day);
    return (
      <TouchableHighlight style={{ width: device.width / 6, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, height: 56 }} onPress={() => this.onPressItem(rowData)} >
        <View style={{ width: device.width / 6, alignItems: 'center', justifyContent: 'center', backgroundColor: bgcolor, height: 56 }} >
          {
            (rowData.checked) ?
              <Text style={{ fontSize: 12, color: textColor, marginBottom: 2 }}>{moment(rowData.day).year()}</Text>
              : null
          }
          <Text style={{ fontSize: 17, color: textColor, marginBottom: 2 }}>{monthText}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={{ height: 56 }}>
        <FlatListView
          needPage={false}
          lineHeight={device.width / 6}
          ref={(ref) => this.flatlist = ref}
          inflatItemView={this.inflateHorizonItemView}
          ishorizontal
          disableRefresh
          disableEmptyView
        />
        <Line />
      </View>
    );
  }
}