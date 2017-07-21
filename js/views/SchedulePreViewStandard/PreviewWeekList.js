/**
 * 周视图横向列表控件
 */
import { InteractionManager, TouchableHighlight, View } from 'react-native';
import { device } from '@/common/Util';
import Text from '@/common/components/TextField';
import React, { PureComponent } from 'react';
import moment from 'moment';
import { GET, ABORT } from '@/common/Request';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import { getWeekSelect } from '@/common/api';
import FlatListView from '@/common/components/FlatListView';
import Line from '@/common/components/Line';
import Constance from './Constance';

let lists = [];
let selectedIndex = -1;

export default class WeekList extends PureComponent {

  sendRequest() {
    GET(getWeekSelect(), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        lists = [...responseData];
        let index = 0;
        let currentWeekIndex = 0;
        lists.map(item => {
          if (item.isCurrentWeek == '1') {
            item.checked = true;
            currentWeekIndex = index;
            selectedIndex = currentWeekIndex;
          }
          else
            item.checked = false;
          item.index = index++;
        });
        if (this.flatlist)
          this.flatlist.notifyList(lists, lists.length, true);
        window.setTimeout(
          () => { if (this.flatlist) this.flatlist.scrollToIndex(currentWeekIndex) },
          500
        );
      });
    }, (err) => {
      showMessage(messageType.error, err);
    }, 'getWeekSelect');
  }
  componentWillMount() {
    this.sendRequest();
  }

  componentWillUnmount() {
    lists = [];
    selectedIndex = -1;
  }

  onPressItem = (rowData) => {
    if (selectedIndex == rowData.index) return;
    lists.map(item => {
      if (item.index == rowData.index) {
        item.checked = true;
        selectedIndex = item.index;
      } else item.checked = false;
    });
    this.flatlist.notifyList(lists, lists.length, true);
    const { pressWeekCallback } = this.props;
    const result = {};
    result.start = rowData.startDate;
    result.end = rowData.endDate;
    pressWeekCallback(result);
  }

  inflateHorizonItemView = (rowData, index) => {
    let bgcolor = 'white';
    if (rowData.checked) bgcolor = '#14BE4B';

    let textColor = '#000';
    if (rowData.isCurrentWeek == '1') textColor = '#14BE4B';
    if (rowData.checked) textColor = 'white';
    const startmonthText = Constance.getMonthText(rowData.startDate);
    const endmonthText = Constance.getMonthText(rowData.endDate);
    let monthView = <Text style={{ fontSize: 12, color: textColor, marginBottom: 2 }}>{startmonthText}</Text>
    if (startmonthText != endmonthText)
      monthView = <Text style={{ fontSize: 12, color: textColor, marginBottom: 2 }}>{startmonthText}-{endmonthText}</Text>

    return (
      <TouchableHighlight style={{ width: device.width / 5, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, height: 56 }} onPress={() => this.onPressItem(rowData)} >
        <View style={{ width: device.width / 5, height: 56, alignItems: 'center', justifyContent: 'center', backgroundColor: bgcolor }} >
          {monthView}
          <Text style={{ fontSize: 18, color: textColor }}>{`${moment(rowData.startDate).date()}-${moment(rowData.endDate).date()}`}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={{ height: 56 }}>
        <FlatListView
          needPage={false}
          lineHeight={device.width / 5}
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