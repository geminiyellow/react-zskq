/**
 * 主管审核历史界面
 */
import { ListView, RefreshControl, View, InteractionManager } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { refreshStyle } from '@/common/Style';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import Text from '@/common/components/TextField';
import Line from '@/common/components/Line';
import UmengAnalysis from '@/common/components/UmengAnalysis';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
import FlatListView from '@/common/components/FlatListView';
import Drawer from 'react-native-drawer';
import NavBar from '@/common/components/NavBar';
import { GET, ABORT } from '@/common/Request';
import { device } from '@/common/Util';
import { getDirectorSignedHistoryForms } from '@/common/api';
import OverTimeView from './../Verify/OverTimeView';
import Constance from './../MyForms/Constance';
import ChangeShiftView from './../Verify/ChangeShiftView';
import ExceptionView from './../Verify/ExceptionView';
import LeaveView from './../Verify/LeaveView';
import SickLeaveView from './../Verify/SickLeaveView'

import { showMessage } from '../../common/Message';
import { messageType, companysCode } from '../../common/Consts';
import TraveView from './../Verify/TraveView';
import RightMenuUi from './slide/HistoryRightMenuUi';

const customizedCompanyHelper = new CustomizedCompanyHelper();
const nodata = 'empty_directapprove';
// 当前表单类型
let currentFormType = Constance.FORMSTATUS_ALL;
// 当前表单状态
let currentFormStatus = Constance.FORMSTATUS_ALL;
// 分页下标
let pageIndex = 1;
// 每页的数据量
const pageSize = 10;
// 列表记录总数
// let totalCount = 0;
// 区间选择
let monthIndex = 0;

let latestDateTime = '';

// 标示当前是下拉刷新还是loadmore
// let state_onRefreshing = false;

export default class VerifyHistoryUi extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      showMenu: false,
      totalCount: 0,
    };
  }

  componentWillMount() {
    UmengAnalysis.onPageBegin('VerifyHistoryUi');
  }

  componentDidMount() {
    this.onRefreshing();
  }

  componentWillUnmount() {
    UmengAnalysis.onPageEnd('VerifyHistoryUi');
    ABORT('getDirectorSignedHistoryForms');
    currentFormType = Constance.FORMSTATUS_ALL;
    currentFormStatus = Constance.FORMSTATUS_ALL;
    monthIndex = 0;
    pageIndex = 1;
    this.state.totalCount = 0;
    state_onRefreshing = false;
    latestDateTime = '';
  }

  onRefreshing = () => {
    state_onRefreshing = true;
    pageIndex = 1;
    latestDateTime = '';
    if (this.flatlist) this.flatlist.loading();
    this.sendRequest(currentFormType);
  }

  onLoadMore = () => {
    if (pageIndex <= 1) return;
    ABORT('getDirectorSignedHistoryForms');
    this.sendRequest(currentFormType);
  }

  sendRequest(formtype) {
    const params = {};
    params.formType = formtype;
    params.formStatus = currentFormStatus;
    params.monthIndex = monthIndex;
    params.latestDateTime = latestDateTime;
    params.page = pageIndex;
    params.size = pageSize;
    GET(getDirectorSignedHistoryForms(params), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        if (this.flatlist == null) return;
        if (!_.isEmpty(responseData) && responseData.count > 0) {
          const temp = responseData.detail;
          // 设置第一页的第一条记录的申请时间
          if (pageIndex == 1 && temp.length > 0) latestDateTime = temp[0].formDetail.ApplyDTM;
          this.setState({
            totalCount: responseData.count,
          })
          if (pageIndex == 1)
            this.flatlist.notifyList(temp, responseData.count, true);
          else
            this.flatlist.notifyList(temp, responseData.count, false);
          pageIndex++;
        } else {
          this.setState({
            totalCount: 0,
          })
          this.flatlist.notifyList([], 0, true);
        }
      });
    }, (err) => {
      if (this.flatlist == null) return;
      showMessage(messageType.error, err);
    }, 'getDirectorSignedHistoryForms');
  }

  inflateItem = (rowData, index) => {
    if (rowData.formType == Constance.FORMTYPE_PROCESSOVERTIMEFORM) {
      return <OverTimeView bottomMeneVisible={false} cacelVisible={false} data={rowData} navigator={this.props.navigator} />;
    } else if (rowData.formType == Constance.FORMTYPE_PROCESSBUSINESSTRAVELFORM) {
      return <TraveView bottomMeneVisible={false} cacelVisible={false} data={rowData} navigator={this.props.navigator} />;
    } else if (rowData.formType == Constance.FORMTYPE_ExceptionHandlingprocess) {
      return <ExceptionView bottomMeneVisible={false} cacelVisible={false} data={rowData} navigator={this.props.navigator} />;
    } else if (rowData.formType == Constance.FORMTYPE_PROCESSLEAVEFORM) {
      return <LeaveView bottomMeneVisible={false} cacelVisible={false} data={rowData} navigator={this.props.navigator} />;
    } else if (rowData.formType == Constance.FORMTYPE_PROCESSTRANSFERSHIFTFORM) {
      return <ChangeShiftView fromVerify={false} bottomMeneVisible={false} cacelVisible={false} data={rowData} navigator={this.props.navigator} />;
    }//销假
    else if (rowData.formType == Constance.FORMTYPE_PROCESSCANCELFORM) {
      return <SickLeaveView bottomMeneVisible={false} cacelVisible={false} data={rowData} navigator={this.props.navigator} />;
    }
    return null;
  }

  onDonePress = (formType, formStatus, monthindex) => {
    ABORT('getMyForms');
    this.drawer.close();
    monthIndex = monthindex;
    currentFormType = formType;
    currentFormStatus = formStatus;
    this.onRefreshing();
  }

  onResetPress = (formType, formStatus, monthindex) => {
    this.drawer.close();
    monthIndex = monthindex;
    currentFormType = formType;
    currentFormStatus = formStatus;
    this.onRefreshing();
  }

  menutoggle() {
    this.drawer.open();
  }

  render() {
    return (
      <Drawer
        ref={(ref) => this.drawer = ref}
        type={'overlay'}
        side={'right'}
        tapToClose
        style={styles.drawer}
        panThreshold={0.1}
        openDrawerOffset={70}
        panOpenMask={0.05}
        captureGestures
        tweenDuration={100}
        tweenHandler={(ratio) => ({
          main: { opacity: (2 - ratio) / 2 },
        })}
        negotiatePan
        content={<RightMenuUi style={{ flex: 1 }} doneCallback={this.onDonePress} resetCallback={this.onResetPress} />}
      >
        <View style={styles.container}>

          <NavBar title={I18n.t('mobile.module.verify.history.title')} onPressLeftButton={() => this.props.navigator.pop()} rightContainerLeftButtonTitle={I18n.t('mobile.module.myform.nav.menu.picker')}
            onPressRightContainerLeftButton={() => { this.menutoggle(); }} />

          <View style={{ flex: 1, }}>
            <FlatListView
              needPage={true}
              emptyIcon={nodata}
              ref={(ref) => this.flatlist = ref}
              inflatItemView={this.inflateItem}
              onRefreshCallback={this.onRefreshing}
              onEndReachedCallback={this.onLoadMore}
              disableRefresh={false}
              disableEmptyView={false}
              emptyTitle={I18n.t('mobile.module.verifyhistory.empty.title')}
              emptySubTitle={I18n.t('mobile.module.verifyhistory.empty.subtitle')}
            />
          </View>
        </View>
      </Drawer>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
  },
  drawer: {
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 0,
  },
});