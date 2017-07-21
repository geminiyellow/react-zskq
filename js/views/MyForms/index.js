/**
 * 我的表单界面
 */
import { DeviceEventEmitter, View, InteractionManager } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import EmptyView from '@/common/components/EmptyView';
import Text from '@/common/components/TextField';
import { device, event } from '@/common/Util';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import UmengAnalysis from '@/common/components/UmengAnalysis';
import Drawer from 'react-native-drawer';
import NavBar from '@/common/components/NavBar';
import SplashScreen from 'rn-splash-screen';
import { GET, ABORT } from '@/common/Request';
import { messageType } from '@/common/Consts';
import { getMyForms } from '@/common/api';
import { refreshStyle } from '@/common/Style';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
import { showMessage } from '@/common/Message';
import FlatListView from '@/common/components/FlatListView';
import Tab from '@/views/Tab';
import Constance from './Constance';
import MyFormExceptionView from './bean/MyFormExceptionView';
import MyFormTravelView from './bean/MyFormTravelView';
import MyFormOvertimenView from './bean/MyFormOvertimeView';
import MyFormChangeShiftView from './bean/MyFormChangeShiftView';
import MyFormDemanPoolView from './bean/MyFormDemanPoolView';
import MyFormLeaveView from './bean/MyFormLeaveView';
import MyFormSickLeaveView from './bean/MyFormSickLeaveView';
import RightMenuUi from './slide/RightMenuUi';
import MyFormHelper from './MyFormHelper';

const customizedCompanyHelper = new CustomizedCompanyHelper();
const myFormHelper = new MyFormHelper();
let currentFormType = Constance.FORMSTATUS_ALL;
let currentFormStatus = Constance.FORMSTATUS_ALL;
const nodata = 'empty_myform';

let VerifyRefreashListener = null;
// 列表记录总数
// let totalCount = 0;
// 分页下标
let pageIndex = 1;
// 每页的数据量
const pageSize = 10;
// 区间选择
let monthIndex = 0;

let latestDateTime = '';

export default class MyForms extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      reload: false,
      totalCount: 0,
    };
  }

  componentWillMount() {
    UmengAnalysis.onPageBegin('MyForms');
    if (_.isEmpty(myFormHelper.getTypes())) {
      myFormHelper.sendRequestFormTypes(this.getTypesSuccess);
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      SplashScreen.hide();
    });

    this.sendRequest(currentFormType, currentFormStatus);
    VerifyRefreashListener = DeviceEventEmitter.addListener(event.REFRESH_CORNER_EVENT, (success) => {
      if (success == true) {
        this.onRefreshing();
      }
    });
  }
  componentWillUnmount() {
    UmengAnalysis.onPageEnd('MyForms');
    ABORT('getMyForms');
    currentFormType = Constance.FORMSTATUS_ALL;
    currentFormStatus = Constance.FORMSTATUS_ALL;
    monthIndex = 0;
    pageIndex = 1;
    this.state.totalCount = 0;
    latestDateTime = '';
    VerifyRefreashListener.remove();
  }

  onRefreshing = () => {
    pageIndex = 1;
    latestDateTime = '';
    this.sendRequest(currentFormType, currentFormStatus);
  }

  onLoadMore = () => {
    if (pageIndex <= 1) return;
    ABORT('getMyForms');
    this.sendRequest(currentFormType, currentFormStatus);
  }

  onDonePress = (formType, formStatus, monthindex) => {
    ABORT('getMyForms');
    if (this.flatlist) {
      this.flatlist.loading();
    }
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

  getTypesSuccess = () => {
    this.setState({
      reload: !this.state.reload,
    });
  }

  inflateItem = (rowData, index) => {
    if (rowData.formType == Constance.FORMTYPE_PROCESSOVERTIMEFORM) {
      return <MyFormOvertimenView navigator={this.props.navigator} detail={rowData} />;
    } else if (rowData.formType == Constance.FORMTYPE_ExceptionHandlingprocess) {
      return <MyFormExceptionView navigator={this.props.navigator} detail={rowData} />;
    } else if (rowData.formType == Constance.FORMTYPE_PROCESSLEAVEFORM) {
      return <MyFormLeaveView navigator={this.props.navigator} detail={rowData} />;
    } else if (rowData.formType == Constance.FORMTYPE_PROCESSBUSINESSTRAVELFORM) {
      return <MyFormTravelView navigator={this.props.navigator} detail={rowData} />;
    } else if (rowData.formType == Constance.FORMTYPE_PROCESSTRANSFERSHIFTFORM) {
      return <MyFormChangeShiftView navigator={this.props.navigator} detail={rowData} />;
    } else if (rowData.formType == Constance.FORMTYPE_PROCESSDEMANDPOOLFORM) {
      return <MyFormDemanPoolView navigator={this.props.navigator} detail={rowData} />;
    } else if (rowData.formType == Constance.FORMTYPE_PROCESSCANCELFORM) {
      return <MyFormSickLeaveView navigator={this.props.navigator} detail={rowData} />;
    }
    return null;
  }

  sendRequest(formtype, formstatus) {
    const params = {};
    params.formType = formtype;
    params.formStatus = formstatus;
    params.page = pageIndex;
    params.monthIndex = monthIndex;
    params.latestDateTime = latestDateTime;
    params.size = pageSize;
    const prefix = customizedCompanyHelper.getPrefix();
    GET(getMyForms(prefix, params), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        // 返回数据为空
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
    }, 'getMyForms');
  }

  backViews() {
    if (this.props.shouldBackHome) {
      this.props.navigator.resetTo({
        component: Tab,
      });
    } else {
      this.props.navigator.pop();
    }
  }

  menutoggle() {
    this.drawer.open();
  }

  render() {
    const countTextView = I18n.t('mobile.module.myform.count').replace('{0}', this.state.totalCount);
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
          <NavBar
            title={I18n.t('mobile.module.myform.title')} onPressLeftButton={() => this.backViews()} rightContainerLeftButtonTitle={I18n.t('mobile.module.myform.nav.menu.picker')}
            onPressRightContainerLeftButton={() => { this.menutoggle(); }} />
          {
            (this.state.totalCount != 0 && this.state.totalCount != '0') ? <Text style={styles.listHeadStyle}>{countTextView}</Text> : null
          }
          <View style={{ flex: 1 }}>
            <FlatListView
              needPage={true}
              emptyIcon={nodata}
              ref={(ref) => this.flatlist = ref}
              inflatItemView={this.inflateItem}
              onRefreshCallback={this.onRefreshing}
              onEndReachedCallback={this.onLoadMore}
              disableRefresh={false}
              disableEmptyView={false}
              emptyTitle={I18n.t('mobile.module.myform.empty.title')}
              emptySubTitle={I18n.t('mobile.module.myform.empty.subtitle')}
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
  listHeadStyle: {
    fontSize: 11,
    margin: 12,
    color: '#999999',
  },
  drawer: {
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 0,
  },
  columnImg: {
    width: device.width,
    height: 220,
    marginVertical: 10,
  },
  navstyle: {
    backgroundColor: '$navigationBar.background',
    alignItems: 'center',
  },
});