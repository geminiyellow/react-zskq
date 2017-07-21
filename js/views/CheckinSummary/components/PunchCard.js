/** 打卡统计 */

import React from 'react';
import { DeviceEventEmitter, ListView, RefreshControl, ScrollView, Text, View } from 'react-native';
import NavBar from '@/common/components/NavBar';
import EStyleSheet from 'react-native-extended-stylesheet';
import Line from '@/common/components/Line';
import I18n from 'react-native-i18n';
import { device } from '@/common/Util';
import { refreshStyle } from '@/common/Style';
import { showMessage } from '@/common/Message';
import EmptyView from '@/common/components/EmptyView';
import { messageType } from '@/common/Consts';
import { punchDate } from '@/common/DateHelper';
import { getYYYYMMDDFormat } from '@/common/Functions';
import { getHHmmFormat } from '@/common/Functions';
import TopBar from './TopBar';
import SectionBar from './SectionBar';
import { SHOW_PICKER, PUNCH_CARD } from '../constants';
import { fetchPunchTimeInfo, abortPunchTimeInfo } from '../Service/PunchCardRequest';
import { fetchExceptionStatistics } from '../Service/ExceptionRequest';

const filter = 'exception_filter';
const nodata = 'empty';

export default class PunchCard extends React.Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.pickerData = [`${I18n.t('mobile.module.exception.lastpayperiod')}`, `${I18n.t('mobile.module.exception.currentpayperiod')}`];
    this.pickerValue = this.pickerData[0];
    this.period = 1;

    this.state = {
      dataSource: this.ds.cloneWithRows([]),
      refreshing: false,
      isEmpty: false,
      loadTitleView: false,
      workDays: 0,
    };
  }

  /** Life cycle */

  componentDidMount() {
    this.setState({ refreshing: true });
    this.onRefresh();
  }

  componentWillUnmount() {
    abortPunchTimeInfo();
  }

  /** Callback */

  onPickerDone(pickerValue) {
    this.pickerValue = pickerValue[0];

    if (this.pickerValue === this.pickerData[0] && this.exceptionLastPeriod) {
      this.period = -1;
    } else if (this.exceptionCurrentPeriod) {
      this.period = 1;
    }
    this.onRefresh();
  }

  onRefresh() {
    fetchExceptionStatistics(this.period).then(
      responseData => {
        const { WorkDays, ExceptionDay, ExceptionLastPeriod, ExceptionCountList, ExceptionCurrentPeriod } = responseData;
        this.setState({
          workDays: WorkDays,
          refreshing: false,
        });
        let startDate;
        let endDate;

        if (ExceptionLastPeriod && ExceptionCurrentPeriod) {
          this.exceptionLastPeriod = ExceptionLastPeriod;
          this.exceptionCurrentPeriod = ExceptionCurrentPeriod;

          this.lastPeriod = `${I18n.t('mobile.module.exception.lastpayperiod')}(${getYYYYMMDDFormat(ExceptionLastPeriod[0])}${I18n.t('mobile.module.exception.exceto')}${getYYYYMMDDFormat(ExceptionLastPeriod[1])})`;
          this.currentPeriod = `${I18n.t('mobile.module.exception.currentpayperiod')}(${getYYYYMMDDFormat(ExceptionCurrentPeriod[0])}${I18n.t('mobile.module.exception.exceto')}${getYYYYMMDDFormat(ExceptionCurrentPeriod[1])})`;
          this.pickerData = [this.lastPeriod, this.currentPeriod];
        }

        if (this.period == 1 && ExceptionCurrentPeriod) {
          this.pickerValue = this.pickerData[1];
          startDate = ExceptionCurrentPeriod[0];
          endDate = ExceptionCurrentPeriod[1];
        }

        if (this.period == -1 && ExceptionLastPeriod) {
          this.pickerValue = this.pickerData[0];
          startDate = ExceptionLastPeriod[0];
          endDate = ExceptionLastPeriod[1];
        }

        if (startDate && endDate) {
          this.getPunchTimeData(startDate, endDate);
        }
      },
      errorMsg => {
        this.setState({
          refreshing: false,
          isEmpty: true,
        });
        showMessage(messageType.error, errorMsg);
      },
    );
  }

  /** Event response */

  onPressRightButton() {
    const data = {
      type: PUNCH_CARD,
      pickerValue: this.pickerValue,
      pickerData: this.pickerData,
    };
    DeviceEventEmitter.emit(SHOW_PICKER, data);
  }

  /** Fetch data */

  getPunchTimeData(startDate, endDate) {
    const params = {};
    params.beginDate = startDate;
    params.endDate = endDate;
    fetchPunchTimeInfo(params).then(
      responseData => {
        this.setState({ refreshing: false });
        if (Array.isArray(responseData) && responseData.length <= 0) {
          this.setState({ isEmpty: true });
          return;
        }
        this.setState({
          dataSource: this.ds.cloneWithRows(responseData),
          loadTitleView: true,
          isEmpty: false,
        });
      },
      errorMsg => {
        this.setState({
          refreshing: false,
          isEmpty: true,
        });
        showMessage(messageType.error, errorMsg);
      },
    );
  }
  
  /** Render methods */

  render() {
    const { navigator } = this.props;

    return (
      <View style={[styles.flex, styles.container]}>
        <NavBar
          title="考勤统计"
          onPressLeftButton={() => navigator.pop()}
          rightContainerRightImage={{ uri: filter }}
          onPressRightContainerRightButton={() => this.onPressRightButton()}
        />
        {this.renderContentView()}
        {this.renderEmptyView()}
      </View>
    );
  }

  renderContentView() {
    const { dataSource, refreshing, isEmpty, loadTitleView, workDays } = this.state;

    if (isEmpty) return null;

    return (
      <ScrollView
        style={styles.flex}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => this.onRefresh()}
            progressBackgroundColor={refreshStyle.progressBackgroundColor}
            colors={refreshStyle.colors}
            tintColor={refreshStyle.tintColor}
          />}
      >
        {loadTitleView ? <TopBar day={workDays}/> : null}
        {loadTitleView ? <SectionBar title1="日期" title2="上班打卡" title3="下班打卡"/> : null}
        <ListView
          dataSource={dataSource}
          renderRow={(rowData, sectionID, rowID, highlightRow) => this.renderRow(rowData, sectionID, rowID, highlightRow)}
          bounces={false}
          renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this.renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
          enableEmptySections
          removeClippedSubviews={false}
        />
      </ScrollView>
    );
  }

  renderEmptyView() {
    const { isEmpty } = this.state;

    if (!isEmpty) return null;

    return (
      <EmptyView
        style={{ backgroundColor: 'white' }}
        onRefreshing={() => this.onRefresh()}
        emptyimg={nodata}
        emptyTitle="暂无打卡信息"
        emptyContent="这里将展示您的打卡统计信息"
      />
    );
  }

  renderRow(rowData, sectionID, rowID, highlightRow) {
    const date = rowData.CALENDARDATE ? punchDate(rowData.CALENDARDATE) : '';
    let inTime = rowData.TimeFrom ? getHHmmFormat(rowData.TimeFrom) : '';
    let outTime = rowData.TimeTo ? getHHmmFormat(rowData.TimeTo) : '';

    let inTimeTextColor = '#333333';
    let outTimeTextColor = '#333333';
    let dateTextColor = '#333333';
    switch (rowData.FromType) {
      // 迟到
      case 'F':
        inTimeTextColor = '#F20707';
        dateTextColor = '#F20707';
        break;
      // 早退
      case 'G':
        inTimeTextColor = '#F20707';
        dateTextColor = '#F20707';
        break;
      // 未刷卡
      case 'M':
        inTime = '未刷卡';
        inTimeTextColor = '#F20707';
        dateTextColor = '#F20707';
        break;
      // 旷工
      case 'H':
        inTimeTextColor = '#F20707';
        dateTextColor = '#F20707';
        break;
      default:
        break;
    }

    switch (rowData.ToType) {
      // 迟到
      case 'F':
        outTimeTextColor = '#F20707';
        dateTextColor = '#F20707';
        break;
      // 早退
      case 'G':
        outTimeTextColor = '#F20707';
        dateTextColor = '#F20707';
        break;
      // 未刷卡
      case 'M':
        outTime = '未刷卡';
        outTimeTextColor = '#F20707';
        dateTextColor = '#F20707';
        break;
      // 旷工
      case 'H':
        outTimeTextColor = '#F20707';
        dateTextColor = '#F20707';
        break;
      default:
        break;
    }

    return (
      <View style={styles.row}>
        <View style={styles.title1}>
          <Text
            style={[styles.font, styles.font1, { color: dateTextColor }]}
            allowFontScaling={false}
          >{date}</Text>
        </View>
        <View style={styles.title2}>
          <Text
            style={[styles.font, styles.font2, { color: inTimeTextColor }]}
            allowFontScaling={false}
          >{inTime}</Text>
        </View>
        <View style={styles.title3}>
          <Text
            style={[styles.font, styles.font3, { color: outTimeTextColor }]}
            allowFontScaling={false}
          >{outTime}</Text>
        </View>
      </View>
    );
  }

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return <Line/>
  }
}

const styles = EStyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    backgroundColor: '$color.containerBackground',
  },
  row: {
    width: device.width,
    height: 36.5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  font: {
    fontSize: 14,
    color: '#333333',
  },
  title1: {
    flex: 1,
  },
  title2: {
    flex: 1,
  },
  title3: {
    flex: 1,
  },
  font1: {
    marginLeft: 18,
  },
  font2: {
    textAlign: 'center',
  },
  font3: {
    textAlign: 'right',
    marginRight: 23.5,
  },
});