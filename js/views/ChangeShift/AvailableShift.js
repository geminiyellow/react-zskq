/**
 * 换班池界面
 */
import { DeviceEventEmitter, InteractionManager, View, TouchableOpacity } from 'react-native';
import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import Text from '@/common/components/TextField';
import TouchButton from '@/common/components/TouchButton';
import { refreshStyle } from '@/common/Style';
import { getCurrentLanguage } from '@/common/Functions';
import NavigationBar from '@/common/components/NavigationBar';
import Style from '@/common/Style';
import FlatListView from '@/common/components/FlatListView';
import UmengAnalysis from '@/common/components/UmengAnalysis';
import NavBarBackText from '@/common/components/NavBarBackText';
import moment from 'moment';
import NavBar from '@/common/components/NavBar';
import EmptyView from '@/common/components/EmptyView';
import { button } from '@/common/Style';
import Image from '@/common/components/CustomImage';
import { languages } from '@/common/LanguageSettingData';
import _ from 'lodash';
import { device } from '@/common/Util';
import { showMessage } from '../../common/Message';
import { messageType } from '../../common/Consts';
import Constance from './../Schedule/Constance';
import { toPage } from './ShiftConst';
import SubmitShift from './SubmitShift';
import ApplyShift from './ApplyShift';
import { GET, ABORT } from '../../common/Request';
import { GetShiftFromDemandPool } from './../../common/api';
import ModalSelectUi from './ModalSelectUi';
import MyFormHelper from '../MyForms/MyFormHelper';
import { getHHmmFormat } from '@/common/Functions';

const myFormHelper = new MyFormHelper();

const nodata = 'empty';
// 分页下标
let pageIndex = 1;
// 每页的数据量
const pageSize = 10;
// 列表记录总数
let totalCount = 0;

const rightarr = 'forward';
const changeshiftimg = 'changeshift';

let latestDateTime = '';
// 标示当前是下拉刷新还是loadmore
let state_onRefreshing = false;
// 保存接口返回的原始数据
let listData = [];
// 当前换班类型
let currentType = -1;

let currentTitle = 'mobile.module.changeshift.all';

let refreshShiftListListener = null;


export default class AvailableShift extends PureComponent {
  constructor(...args) {
    super(...args);

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
    UmengAnalysis.onPageBegin('AvailableShift');
  }

  componentDidMount() {
    this.sendRequest();
    refreshShiftListListener = DeviceEventEmitter.addListener('refreshShiftList', value => {
      this.onRefreshing();
    });
  }

  componentWillUnmount() {
    UmengAnalysis.onPageEnd('AvailableShift');
    ABORT('GetShiftFromDemandPool');
    pageIndex = 1;
    listData = [];
    totalCount = 0;
    currentType = -1;
    latestDateTime = '';
    currentTitle = 'mobile.module.changeshift.all';
    refreshShiftListListener.remove();
  }

  onRefreshing = () => {
    if (device.isAndroid && this.listView) this.listView.scrollTo({ y: 0 });
    pageIndex = 1;
    listData = [];
    latestDateTime = '';
    totalCount = 0;
    state_onRefreshing = true;
    this.sendRequest();
  }

  sendRequest() {
    const params = {};
    params.currentToday = moment().format('YYYYMMDDHHmmss');
    params.latestDateTime = latestDateTime;
    params.page = pageIndex;
    params.size = pageSize;
    params.type = currentType;
    GET(GetShiftFromDemandPool(params), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        // 返回数据为空
        if (!_.isEmpty(responseData) && responseData.count > 0) {
          totalCount = responseData.count;
          const temp = responseData.detail;
          // 设置第一页的第一条记录的申请时间
          if (pageIndex == 1 && temp.length > 0) latestDateTime = temp[0].ApplyDTM;

          listData = [...listData, ...temp];
          let isempty = false;
          if (listData.length > 0) isempty = false;
          else isempty = true;

          this.setState({
            empty: isempty,
          });
          if (this.flatlist)
            this.flatlist.notifyList(listData, totalCount, true);
          pageIndex++;
        } else {
          listData = [...listData];
          let isempty = false;
          if (listData.length > 0) isempty = false;
          else isempty = true;

          this.setState({
            empty: isempty,
          });
          if (this.flatlist)
            this.flatlist.notifyList(listData, totalCount, true);
          pageIndex++;
        }
      });
    }, (err) => {
      showMessage(messageType.error, err);
    }, 'GetShiftFromDemandPool');
  }

  pressItem = (rowData) => {
    this.props.navigator.push({
      component: SubmitShift,
      passProps: {
        data: rowData,
      },
    });
  }

  gotoApplyShift = () => {
    this.props.navigator.push({
      component: ApplyShift,
      passProps: {
        toPage: toPage.ApplyShift,
      },
    });
  }

  inflateItem = (rowData, index) => {
    const date = _.split(rowData.ShiftDate, '-');
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
      <TouchableOpacity onPress={() => this.pressItem(rowData)}>

        <View style={{ height: 10 }} />
        <View style={styles.rowStyle}>
          <View style={circlebg} >
            <Text style={{ fontSize: 16, color: 'white' }}>{date[2]}</Text>
            <Text style={{ fontSize: 11, color: 'white', marginTop: 2 }}>{I18n.t(monthText)}</Text>
          </View>

          <View style={styles.rowTextStyle} >
            <Text style={{ fontSize: 16, color: '#000000' }}>{rowData.PersonName} {rowData.ShiftName}</Text>
            {durationView}
          </View>
          <Image style={[styles.arrimgStyle, { marginRight: 1 }]} source={{ uri: rightarr }} />
        </View>
      </TouchableOpacity>
    );
  }

  titleonPress = () => {
    this.madalSelect.open();
  }

  // 点击筛选条件触发
  onSelectMenu = (TabIndex, MenuIndex) => {
    if (TabIndex == 1) {
      currentType = MenuIndex;
      if (currentType == 0) {
        currentTitle = 'mobile.module.changeshift.samedept';
      } else if (currentType == 1) {
        currentTitle = 'mobile.module.changeshift.diffposition';
      } else if (currentType == 2) {
        currentTitle = 'mobile.module.changeshift.diffdeptsame';
      } else {
        currentTitle = 'mobile.module.changeshift.all';
      }
      this.onRefreshing();
      this.madalSelect.close();
    }
  }

  onLoadMore = () => {
    if (pageIndex <= 1) return;
    ABORT('GetShiftFromDemandPool');
    if (totalCount > listData.length) {
      state_onRefreshing = false;
      this.sendRequest();
    }
  }

  getContentView() {
    if (!this.state.empty) {
      return (
        <View style={{ flex: 1 }}>
          <FlatListView
            needPage={true}
            ref={(ref) => this.flatlist = ref}
            inflatItemView={this.inflateItem}
            onRefreshCallback={this.onRefreshing}
            onEndReachedCallback={this.onLoadMore}
            disableRefresh={false}
            disableEmptyView={true}
          />
          <TouchButton
            style={styles.emptyRowStyle}
            underlayColor={button.background.active}
            onPressBtn={() => this.gotoApplyShift()}
            title={I18n.t('mobile.module.changeshift.provide')}
          />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ height: 3 * device.height / 5 + 15, backgroundColor: '#fff' }}>
          <EmptyView onRefreshing={this.onRefreshing} emptyimg={nodata} emptyTitle={I18n.t('mobile.module.changeshift.empty')} emptyContent={I18n.t('mobile.module.changeshift.emptysub')} />
        </View>
        <TouchButton
          style={[styles.emptyRowStyle, { marginTop: (device.height * 2 / 5 - 48) / 2 - Style.navigationBar.height }]}
          onPressBtn={() => this.gotoApplyShift()}
          underlayColor={button.background.active}
          title={I18n.t('mobile.module.changeshift.provide')}
        />
      </View >
    );
  }

  render() {
    return (
      <View style={styles.container}>

        <NavBar title={I18n.t('mobile.module.changeshift.pool')} onPressLeftButton={() => this.props.navigator.pop()} />
        {this.getContentView()}
        <ModalSelectUi
          ref={box => this.madalSelect = box}
          modalclosed={this.modalclosed}
          selectMenu={this.onSelectMenu}
        />
      </View>
    );
  }

}

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
  },
  changeimgStyle: {
    width: 22,
    height: 22,
    marginLeft: 18,
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  rowMenuTextStyle: {
    flex: 1,
    fontSize: 18,
    marginTop: 10,
    marginBottom: 9,
    marginLeft: 34,
    color: '#FFFFFF',
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
    height: 44,
    marginLeft: 18,
    marginRight: 18,
    borderRadius: 5,
    backgroundColor: '#14BE4B',
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