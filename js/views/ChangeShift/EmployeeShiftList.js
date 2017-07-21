/**
 * 班次列表界面
 */
import { DeviceEventEmitter, InteractionManager, ListView, RefreshControl, TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import Text from '@/common/components/TextField';
import Image from '@/common/components/CustomImage';
import EmptyView from '@/common/components/EmptyView';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import NavBar from '@/common/components/NavBar';
import _ from 'lodash';
import { refreshStyle } from '@/common/Style';
import { getCurrentLanguage } from '@/common/Functions';
import { languages } from '@/common/LanguageSettingData';
import moment from 'moment';
import { GetValidChangeShift, getMyAvailableShift } from './../../common/api';
import { GET, ABORT } from '../../common/Request';
import { device } from '../../common/Util';
import Constance from './../Schedule/Constance';
import ApplyShift from './ApplyShift';
import { showMessage } from '../../common/Message';
import { messageType } from '../../common/Consts';
import { toPage } from './ShiftConst';
import MyFormHelper from '../MyForms/MyFormHelper';
import FlatListView from '@/common/components/FlatListView';
import { getHHmmFormat } from '@/common/Functions';

const myFormHelper = new MyFormHelper();

const checkboxNormal = 'checkbox_common';
const checkboxChecked = 'checkbox_selected';

const nodata = 'empty_myform';
// 要跳转的页面  当前页面有可能会进入提交班次到换班池页面  也可能进入提交换班界面
let currentToPage = -1;

// 保存接口返回的原始数据
let listData = [];

let selectedRowData = null;

let currentShiftDate = null;

let fromPage = '';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
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
  arrimgStyle: {
    width: 22,
    height: 22,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginRight: 12,
  },
  rowMenuTextStyle: {
    marginLeft: 11,
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
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
    height: 65,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    paddingLeft: 18,
    paddingTop: 8,
    paddingBottom: 8,
  },
  emptyRowStyle: {
    height: 50,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
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

export default class EmployeeShiftList extends PureComponent {
  constructor(...args) {
    super(...args);
    this.list = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      language: 0,
      empty: false,
    };
    getCurrentLanguage().then(data => {
      const k = languages.indexOf(data);
      if (k == 0) {
        this.setState({
          language: 0,
        });
      } else {
        this.setState({
          language: 1,
        });
      }
    });
  }

  componentWillMount() {
    currentToPage = this.props.passProps.toPage;
    if (currentToPage == -1) {
      currentShiftDate = this.props.passProps.ShiftDate;
      selectedRowData = currentShiftDate;
    }
    fromPage = this.props.passProps.fromPage;

    listData = [];
  }

  componentDidMount() {
    this.sendRequest();
  }

  componentWillUnmount() {
    ABORT('getMyAvailableShift');
    ABORT('GetValidChangeShift');
    currentShiftDate = null;
    listData = [];
  }

  onRefreshing = () => {
    if (device.isAndroid && this.listView) this.listView.scrollTo({ y: 0 });
    listData = [];
    latestDateTime = '';
    this.sendRequest();
  }

  onDetermine = () => {
    if (_.isEmpty(selectedRowData)) {
      showMessage(messageType.error, I18n.t('mobile.module.changeshift.emptyshift'));
      return;
    }
    if (currentToPage == toPage.ApplyShift) {
      this.props.navigator.push({
        component: ApplyShift,
        passProps: {
          data: selectedRowData,
        },
      });
    } else {
      DeviceEventEmitter.emit('selectMyShift', selectedRowData);
      this.props.navigator.pop();
    }
  }

  sendRequest = () => {
    if (fromPage == 'ApplyShift') {
      const params = {};
      params.currentToday = moment().format('YYYYMMDDHHmmss');
      GET(getMyAvailableShift(params), (responseData) => {
        InteractionManager.runAfterInteractions(() => {
          listData = [...responseData];
          let isempty = false;
          if (listData.length <= 0) isempty = true;
          else {
            listData.map(item => {
              item.selected = false;
            });
          }
          this.flatlist.notifyList(listData, listData.length, true);
        });
      }, (err) => {
        showMessage(messageType.error, err);
      }, 'getMyAvailableShift');
    } else {
      this.GetValidChangeShift(this.props.passProps.otherID);
    }
  }

  GetValidChangeShift(ID) {
    const params = {};
    params.OtherShiftID = ID;
    GET(GetValidChangeShift(params), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        listData = [...responseData];
        let isempty = false;
        if (listData.length <= 0) isempty = true;
        else {
          listData.map(item => {
            item.selected = false;
          });
        }
        this.flatlist.notifyList(listData, listData.length, true);

      });
    }, (err) => {
      showMessage(messageType.error, err);
    }, 'GetValidChangeShift');
  }

  pressItem = (rowData, rowID) => {
    selectedRowData = rowData;
    currentShiftDate = null;
    for (let i = 0; i < listData.length; i++) {
      if (i == rowID) {
        listData[i].selected = true;
      } else {
        listData[i].selected = false;
      }
    }
    this.flatlist.notifyList(listData, listData.length, true);
  }

  inflateItem = (rowData, index) => {
    const date = _.split(rowData.ShiftDate, '-');
    if (!_.isEmpty(currentShiftDate)) {
      if (currentShiftDate.ShiftDate === rowData.ShiftDate) {
        rowData.selected = true;
      }
    }
    let circlebg = styles.circleStyle;
    const startData = getHHmmFormat(rowData.TimeFrom);
    const endData = getHHmmFormat(rowData.TimeTo);
    if ((_.isEmpty(rowData.TimeFrom) && _.isEmpty(rowData.TimeTo))) {
      leaveText = null;
    }
    if (rowData.ShiftType == Constance.ShiftType_HOLIDAY || rowData.ShiftType == Constance.ShiftType_FESTIVAL) {
      circlebg = styles.circleStyleOrange;
    }
    let durationView = null;
    durationView = (<Text style={{ fontSize: 14, color: '#999999' }}>{I18n.t('mobile.module.clock.shifttime')}：{startData}-{endData}{`(${rowData.TotalHours}${I18n.t('mobile.module.changeshift.hour')})`}</Text>);
    const monthText = Constance.getMonth(date[1], myFormHelper.getLanguage());
    return (
      <TouchableOpacity onPress={() => this.pressItem(rowData, index)}>
        <View style={{ height: 10 }} />
        <View style={styles.rowStyle}>
          <View style={circlebg} >
            <Text style={{ fontSize: 16, color: 'white' }}>{date[2]}</Text>
            <Text style={{ fontSize: 11, color: 'white', marginTop: 2 }}>{I18n.t(monthText)}</Text>
          </View>

          <View style={styles.rowTextStyle} >
            <Text style={{ fontSize: 16, color: '#000000' }}>{rowData.ShiftName}</Text>
            {durationView}
          </View>

          <Image style={{ width: 20, height: 20, alignSelf: 'center' }} source={{ uri: rowData.selected == '1' ? checkboxChecked : checkboxNormal }} />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar title={I18n.t('mobile.module.changeshift.myshift')} onPressLeftButton={() => this.props.navigator.pop()} rightContainerLeftButtonTitle={I18n.t('mobile.module.changeshift.deter')} onPressRightContainerLeftButton={() => { this.onDetermine() }} />
        <FlatListView
          needPage={false}
          emptyIcon={nodata}
          ref={(ref) => this.flatlist = ref}
          inflatItemView={this.inflateItem}
          onRefreshCallback={this.onRefreshing}
          disableRefresh={false}
          disableEmptyView={false}
        />
      </View>
    );
  }

}