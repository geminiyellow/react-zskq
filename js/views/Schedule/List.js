import { TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import moment from 'moment';
import _ from 'lodash';
import Text from '@/common/components/TextField';
import { companyCodeList } from '@/common/Consts';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import { getCurrentLanguage } from '@/common/Functions';
import FlatListView from '@/common/components/FlatListView';
import { device } from '@/common/Util';
import { getHHmmFormat } from '@/common/Functions';
import Constance from './Constance';
import LeaveApply from './../LeaveApply/LeaveReq';
import LeaveApplyEstee from './../LeaveApply/LeaveReqEstee';
import LeaveApplySamsung from './../LeaveApply/LeaveReqSamsung';
import LeaveApplyGant from './../LeaveApply/LeaveReqGant';
import LeaveModeHelper from './LeaveModeHelper';

const nodata = 'empty_schedule';

const leaveModeHelper = new LeaveModeHelper();

const componentMap = new Map();

const styles = EStyleSheet.create({
  container: {
    backgroundColor: '$color.containerBackground',
  },
  circleGrayStyle: {
    flexDirection: 'column',
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#999999',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleStyle: {
    flexDirection: 'column',
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#1fd662',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleStyleOrange: {
    flexDirection: 'column',
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#ffc817',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTextStyle: {
    fontSize: 15,
    color: '#999999',
    marginLeft: 18,
    marginTop: 10,
    marginBottom: 10,
  },
  rowStyle: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    paddingTop: 8,
    paddingBottom: 8,
  },
  rowTextStyle: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 11,
  },
  columnImg: {
    width: device.width,
    height: 220,
    marginVertical: 10,
  },
});

let schedules = [];

export default class List extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      language: 0,
    };
    getCurrentLanguage().then(data => {
      if (data == 'ZH-CN') {
        this.setState({
          language: 0,
        });
      } else if (data == 'EN-US') {
        this.setState({
          language: 1,
        });
      } else {
        this.setState({
          language: 2,
        });
      }
    });
    this.onShiftView(global.companyResponseData.version);
  }

  componentDidMount() {
    schedules = [...this.props.datas];
    this.flatlist.notifyList(schedules, schedules.length, true);
  }

  // 刷新列表
  refrashList(lists) {
    schedules = [...lists];
    this.flatlist.notifyList(schedules, schedules.length, true);
  }

  // 跳转到请假页面
  gotoLeaveApply = (shift) => {
    this.props.navigator.push({
      component: this.onGetLeaveReqView(componentMap.get('S010030')),
      passProps: {
        data: shift,
      },
    });
  }

  inflateItem = (rowData, index) => {
    let todayIndex = 0;
    const date = _.split(rowData.ShiftDate, '-');
    const today = moment().format('YYYY-MM-DD');
    if (rowData.ShiftDate == today) {
      todayIndex = index;
    }

    let circlebg = styles.circleStyle;
    // 之前的也不显示
    const front = moment(moment().format('YYYY-MM-DD')) > moment(rowData.ShiftDate) ? true : false;
    let leaveText = (
      <TouchableOpacity style={{ width: 60, height: 30, justifyContent: 'center', alignItems: 'center', marginLeft: 10, borderWidth: 1, borderColor: '#1fd762', borderRadius: 3 }} onPress={() => this.gotoLeaveApply(rowData)}>
        <Text allowFontScaling={false} style={{ fontSize: 14, color: '#1fd662' }}>{I18n.t('mobile.module.myschedule.lisitem.leave')}</Text>
      </TouchableOpacity>
    );

    if (front || (_.parseInt(rowData.TotalHours) == 0)) {
      leaveText = null;
    }
    if (leaveModeHelper && !leaveModeHelper.hasLeaveAuthority()) {
      leaveText = null;
    }
    if (rowData.ShiftType == Constance.ShiftType_HOLIDAY || rowData.ShiftType == Constance.ShiftType_FESTIVAL) {
      circlebg = styles.circleStyleOrange;
    }
    if (front) {
      circlebg = styles.circleGrayStyle;
    }
    let durationView = null;
    if (!_.isEmpty(rowData.TimeFrom) && !_.isEmpty(rowData.TimeTo)) {
      durationView = (<Text allowFontScaling={false} style={{ fontSize: 14, color: '#ADADAD', marginTop: 2 }}>{I18n.t('mobile.module.myschedule.lisitem.shifttime')}：{getHHmmFormat(rowData.TimeFrom)}-{getHHmmFormat(rowData.TimeTo)}</Text>);
    }
    if (_.parseInt(rowData.TotalHours) == 0) {
      durationView = null;
    }
    const monthText = Constance.getWeekIndex(rowData.ShiftDate, this.state.language);
    return (
      <View>
        <View style={{ height: 10 }} />
        <View style={styles.rowStyle}>
          <View style={circlebg} >
            <Text allowFontScaling={false} style={{ fontSize: 16, color: 'white' }}>{date[2]}</Text>
            <Text allowFontScaling={false} style={{ fontSize: 11, color: 'white', marginTop: 2 }}>{I18n.t(monthText)}</Text>
          </View>

          <View style={styles.rowTextStyle} >
            <Text allowFontScaling={false} style={{ fontSize: 16, color: '#000000' }}>{rowData.ShiftName}</Text>
            {durationView}
          </View>
          {leaveText}
        </View>
      </View>
    );
  }

  onGetLeaveReqView(versionId) {
    if (versionId === companyCodeList.standard) {
      // 标准版
      return LeaveApply;
    }
    if (versionId === companyCodeList.estee) {
      // 雅诗兰黛
      return LeaveApplyEstee;
    }
    if (versionId === companyCodeList.gant) {
      // 甘特
      return LeaveApplyGant;
    }
    if (versionId === companyCodeList.samsung) {
      // 三星
      return LeaveApplySamsung;
    }
    // 默认跳转请假
    return LeaveApply;
  }

  // 请假加班跳转
  onShiftView(versions) {
    // 请假 加班跳转
    for (i = 0; i < versions.length; i += 1) {
      // 存入map中
      componentMap.set(versions[i].moduleCode, versions[i].companyCode);
    }
  }

  render() {
    return (
      <FlatListView
        needPage={false}
        emptyIcon={nodata}
        disableRefresh
        ref={(ref) => this.flatlist = ref}
        inflatItemView={this.inflateItem}
        disableEmptyView={false}
        emptyTitle={I18n.t('mobile.module.myschedule.empty.title')}
        emptySubTitle={I18n.t('mobile.module.myschedule.empty.subtitle')}
      />
    );
  }
}