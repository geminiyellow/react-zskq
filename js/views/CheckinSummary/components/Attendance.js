/** 出勤统计 */

import React from 'react';
import { DeviceEventEmitter, Image, ListView, RefreshControl, ScrollView, TouchableHighlight, Text, View } from 'react-native';
import NavBar from '@/common/components/NavBar';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';
import Line from '@/common/components/Line';
import { refreshStyle } from '@/common/Style';
import I18n from 'react-native-i18n';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import EmptyView from '@/common/components/EmptyView';
import { getYYYYMMDDFormat } from '@/common/Functions';
import AttendanceDetail from './AttendanceDetail';
import TopBar from './TopBar';
import SectionBar from './SectionBar';
import { SHOW_PICKER, ATTENDANCE } from '../constants';
import { fetchAttendanceDetail, abortAttendanceRequest } from '../Service/AttendanceRequest';
import { AttendanceData } from '../Model/AttendanceData';
import { fetchExceptionStatistics } from '../Service/ExceptionRequest';

const filter = 'exception_filter';
const detailInfo = 'detail_info';
const nodata = 'empty';

export default class Attendance extends React.Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.lastPeriodList = [`${I18n.t('mobile.module.exception.lastpayperiod')}`];
    this.currentPeriodList = [`${I18n.t('mobile.module.exception.currentpayperiod')}`];
    this.pickerData = [this.lastPeriodList[0], this.currentPeriodList[0]];
    this.pickerValue = this.pickerData[1];
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
    abortAttendanceRequest();
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

        if (ExceptionLastPeriod && ExceptionCurrentPeriod) {
          this.exceptionLastPeriod = ExceptionLastPeriod;
          this.exceptionCurrentPeriod = ExceptionCurrentPeriod;

          this.lastPeriod = `${I18n.t('mobile.module.exception.lastpayperiod')}(${getYYYYMMDDFormat(ExceptionLastPeriod[0])}${I18n.t('mobile.module.exception.exceto')}${getYYYYMMDDFormat(ExceptionLastPeriod[1])})`;
          this.currentPeriod = `${I18n.t('mobile.module.exception.currentpayperiod')}(${getYYYYMMDDFormat(ExceptionCurrentPeriod[0])}${I18n.t('mobile.module.exception.exceto')}${getYYYYMMDDFormat(ExceptionCurrentPeriod[1])})`;
          this.pickerData = [this.lastPeriod, this.currentPeriod];
        }
        let startDate;
        let endDate;

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
          this.getAttendanceData(startDate, endDate);
        }
      },
      errorMsg => {
        this.setState({
          refreshing: false,
          isEmpty: true,
        });
        showMessage(messageType.error, errorMsg);
      }
    );
  }

  /** Event response */

  onPress(rowData) {
    const { navigator } = this.props;
    let attendanceDetailData = [];

    if (rowData.attendanceBranch) {
      attendanceDetailData = rowData.attendanceBranch;
    }
    navigator.push({
      component: AttendanceDetail,
      passProps: {
        attendanceDetailData,
      },
    });
  }

  onPressRightBtn() {
    const data = {
      type: ATTENDANCE,
      pickerValue: this.pickerValue,
      pickerData: this.pickerData,
    };
    DeviceEventEmitter.emit(SHOW_PICKER, data);
  }

  /** Fetch data */

  getAttendanceData(startDate, endDate) {
    const params = {};
    params.beginDate = startDate;
    params.endDate = endDate;

    fetchAttendanceDetail(params).then(
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
      }
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
          onPressRightContainerRightButton={() => this.onPressRightBtn()}
        />
        {this.renderContentView()}
        {this.renderEmptyView()}
      </View>
    );
  }

  renderContentView() {
    const { dataSource, refreshing, isEmpty, loadTitleView, workDays } = this.state;
    const { navigator } = this.props;

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
        {loadTitleView ? <TopBar day={workDays} /> : null}
        {loadTitleView ? <SectionBar title1="出勤名称" title2="数值" title3="详细" /> : null}
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

  renderRow(rowData, sectionID, rowID, highlightRow) {
    const name = rowData.attendanceName ? rowData.attendanceName : '';
    const count = rowData.attendanceCount;

    return (
      <View style={styles.row}>
        <View style={styles.title1}>
          <Text
            style={[styles.font, styles.font1]}
            numberOfLines={1}
            allowFontScaling={false}
          >{name}</Text>
        </View>
        <View style={styles.title2}>
          <Text
            style={[styles.font, styles.font2]}
            numberOfLines={1}
            allowFontScaling={false}
          >{`${count}`}</Text>
        </View>
        <TouchableHighlight
          style={styles.title3}
          underlayColor="white"
          activeOpacity={0.5}
          onPress={() => this.onPress(rowData)}
        >
          <Image style={styles.img} source={{ uri: detailInfo }} />
        </TouchableHighlight>
      </View>
    );
  }

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return <Line />
  }

  renderEmptyView() {
    const { isEmpty } = this.state;

    if (!isEmpty) return null;

    return (
      <EmptyView
        style={{ backgroundColor: 'white' }}
        onRefreshing={() => this.onRefresh()}
        emptyimg={nodata}
        emptyTitle="暂无出勤信息"
        emptyContent="这里将展示您的出勤统计信息"
      />
    );
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
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 36.5,
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
  img: {
    marginRight: 22,
    width: 18,
    height: 18,
  },
});