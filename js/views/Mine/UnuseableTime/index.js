import React, { Component } from 'react';
import {
  ListView,
  NativeModules,
  View,
  RefreshControl } from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import Swipeout from 'react-native-swipeout';

import { device, keys } from '@/common/Util';
import { ABORT, POST } from '@/common/Request';
import { getNewSetUserPassword } from '@/common/api';
import { messageType } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import NavBar from '@/common/components/NavBar';
import OthersButton from '@/common/components/OthersButton';
import Input from '@/common/components/Input';
import Line from '@/common/components/Line';
import { getCurrentLanguage, encrypt } from '@/common/Functions';
import AddContent from '@/views/Mine/UnuseableTime/AddContent';
import Text from '@/common/components/TextField';

const { RNManager } = NativeModules;
const addImage = 'useless_time_add';
const arrWeek = ['mobile.consts.week.sunday', 'mobile.consts.week.monday', 'mobile.consts.week.tuesday', 'mobile.consts.week.wednesday', 'mobile.consts.week.thurday', 'mobile.consts.week.friday', 'mobile.consts.week.saturday'];
const dataSource = [
  { date: '2017-3-31',
    timeStart: '16:36',
    timeEnd: '16:37',
    weekRepeat: false },
  { date: '2017-4-1',
    timeStart: '18:36',
    timeEnd: '18:37',
    weekRepeat: true },
  { date: '2017-4-2',
    timeStart: '16:36',
    timeEnd: '16:37',
    weekRepeat: false },
  { date: '2017-4-6',
    timeStart: '19:36',
    timeEnd: '1:37',
    weekRepeat: false },
];

export default class UnuseableTime extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows(dataSource),
      inRefreshing: false,
    };
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  onRefresh() {
    this.setState({
      inRefreshing: true,
    });

    this.timer = setTimeout(() => {
      this.setState({
        inRefreshing: false,
      });
    }, 2500);
  }

  onSwipeout(rowID) {
    // console.log('rowID --- - - - - -', rowID);
  }

  actionAddContent() {
    this.props.navigator.push({
      component: AddContent,
    });
  }

  renderRow(rowData, sectionID, rowID) {
    const { weekRepeat, timeStart, timeEnd, date } = rowData;
    const fullDate = date.split('-');
    const day = new Date(fullDate[0], fullDate[1] - 1, fullDate[2], 0, 0, 0);
    const week = arrWeek[day.getDay()];

    return (
      <View>
        <View style={{ width: device.width, height: 10 }} />
        <Swipeout
          right={[{ text: I18n.t('mobile.module.mine.tipsetting.delete'), color: '#fff', backgroundColor: 'red', onPress: () => this.onSwipeout(rowID) }]}
          style={{ backgroundColor: 'transparent' }}>
          <View style={styles.rowWrapper}>
            <Line />

            <View style={{ flex: 1, backgroundColor: '#fff', flexDirection: 'row' }}>
              <View style={{ width: 84, height: 120, justifyContent: 'center' }}>
                <View style={styles.viewIcon}>
                  <Text style={styles.textIcon}>{weekRepeat ? I18n.t('mobile.module.unuseless.weekly') : I18n.t('mobile.module.unuseless.currentday')}</Text>
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.viewContenWrapper}>
                  <Text style={styles.textDetail}>{I18n.t(week)}（{date}）</Text>
                </View>
                <Line style={{ width: device.width - 84 }} />
                <View style={styles.viewContenWrapper}>
                  <Text style={styles.textDetail}>全天</Text>
                </View>
                <Line style={{ width: device.width - 84 }} />
                <View style={styles.viewContenWrapper}>
                  <Text style={styles.textDetail}>描述</Text>
                </View>
              </View>
            </View>

            <Line />
          </View>
        </Swipeout>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar
          title={I18n.t('mobile.module.unuseless.title')}
          rightContainerLeftImage={{ uri: addImage }}
          onPressLeftButton={() => this.props.navigator.pop()}
          onPressRightContainerLeftButton={() => this.actionAddContent()} />

        <ListView
          dataSource={this.state.dataSource}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.inRefreshing}
              onRefresh={() => this.onRefresh()}
              tintColor="#ff0000"
              title="Loading..."
              titleColor="#00ff00"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffff00" />}
          renderRow={(rowData, sectionID, rowID) => this.renderRow(rowData, sectionID, rowID)} />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
  },
  rowWrapper: {
    height: 131,
    width: device.width,
  },
  viewIcon: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: '$color.mainColorLight',
  },
  textIcon: {
    alignSelf: 'center',
    fontSize: 16,
    color: '#fff',
  },
  viewContenWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  textDetail: {
    fontSize: 15,
    color: '$color.mainBodyTextColor',
  },
});