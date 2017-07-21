/**
 * 主管审核界面
 */

import { Animated, DeviceEventEmitter, Keyboard, ScrollView, View, NativeModules, InteractionManager } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { getCurrentLanguage } from '@/common/Functions';
import EmptyView from '@/common/components/EmptyView';
import EStyleSheet from 'react-native-extended-stylesheet';
import Text from '@/common/components/TextField';
import I18n from 'react-native-i18n';
import TextArea from '@/common/components/TextArea';
import ModalBox from 'react-native-modalbox';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
import { getDirectorFormsNew, SignOffEmployeeFormRequest } from '@/common/api';
import Line from '@/common/components/Line';
import NavBar from '@/common/components/NavBar';
import { refreshStyle } from '@/common/Style';
import UmengAnalysis from '@/common/components/UmengAnalysis';
import { languages } from '@/common/LanguageSettingData';
import FlatListView from '@/common/components/FlatListView';
import ModalSelectUi from './ModalSelectUi';
import Button from '@/common/components/ApproveBtn';
import { device, event } from '@/common/Util';
import { GET, POST, ABORT } from '@/common/Request';
import { showMessage } from '@/common/Message';
import { messageType, companysCode } from '@/common/Consts';
import OverTimeView from './OverTimeView';
import TraveView from './TraveView';
import VerifyHistoryUi from './../VerifyHistory/VerifyHistoryUi';
import ExceptionView from './ExceptionView';
import IndicatorContainer from './IndicatorContainer';
import LeaveView from './LeaveView';
import SickLeaveView from './SickLeaveView'
import BottomMenu from './BottomMenu';
import Constance from './../MyForms/Constance';
import ChangeShiftView from './ChangeShiftView';
import DepartmentChangeView from './DepartmentChangeView';
import MobileInfoChangeView from './MobileInfoChangeView';

import MyFormHelper from './../MyForms/MyFormHelper';

const KEYBOARD_EVENT_SHOW = device.isIos ? 'keyboardWillShow' : 'keyboardDidShow';
const KEYBOARD_EVENT_HIDE = device.isIos ? 'keyboardWillHide' : 'keyboardDidHide';

const customizedCompanyHelper = new CustomizedCompanyHelper();
const myFormHelper = new MyFormHelper();
const historyicon = 'history';
const nodata = 'empty_directapprove';
const { RNManager } = NativeModules;
let currentFormType = Constance.FORMSTATUS_ALL;

let approveAddvice = '';
let rejectAddvice = '';

// 分页下标
let pageIndex = 1;
// 每页的数据量
const pageSize = 10;
// 列表记录总数
// let totalCount = 0;

let VerifyRefreashListener = null;

// 保存接口返回的原始数据
let listData = [];

let latestDateTime = '';

// 标示当前是下拉刷新还是loadmore
let state_onRefreshing = false;

export default class ManagerVerifyUi extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      showMenu: false,
      checked: false,
      language: 0,
      reload: false,
      totalCount: 0,
      modalMarginTop: new Animated.Value(200),
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
    UmengAnalysis.onPageBegin('ManagerVerify');

    DeviceEventEmitter.addListener('changeSelect', value => {
      if (!value) return;
      for (item of listData) {
        if (value.formDetail.WorkItemId == item.WorkItemId) {
          item.checked = value.checked;
        }
      }
      if (this.bottomMenu) {
        this.bottomMenu.refreash(listData);
      }
    });

    VerifyRefreashListener = DeviceEventEmitter.addListener(event.REFRESH_CORNER_EVENT, value => {
      if (value == true) {
        this.onRefreshing();
      }
    });

    if (_.isEmpty(myFormHelper.getTypes())) {
      myFormHelper.sendRequestFormTypes(this.getTypesSuccess);
    }
  }

  componentDidMount() {
    this.onRefreshing();
    this.keyboardShowListener = Keyboard.addListener(KEYBOARD_EVENT_SHOW, () => this.keyboardWillShow());
    this.keyboardHideListener = Keyboard.addListener(KEYBOARD_EVENT_HIDE, () => this.keyboardWillHide());
  }

  componentWillUnmount() {
    UmengAnalysis.onPageEnd('ManagerVerify');
    ABORT('getDirectorFormsNew');
    this.indicatorTab.onResetType(-1);
    this.madalSelect.close();
    currentFormType = Constance.FORMSTATUS_ALL;
    pageIndex = 1;
    listData = [];
    latestDateTime = '';
    VerifyRefreashListener.remove();
    this.keyboardShowListener.remove();
    this.keyboardHideListener.remove();
  }

  /** callback */

  keyboardWillShow() {
    Animated.timing(
      this.state.modalMarginTop,
      {
        toValue: device.isIos ? 150 : 130,
        duration: 400,
      }
    ).start();
  }

  keyboardWillHide() {
    Animated.timing(
      this.state.modalMarginTop,
      {
        toValue: 200,
        duration: 400,
      }
    ).start();
  }

  // 点击筛选按钮触发
  onSelectTab = (index, checked) => {
    if (index == 1) {
      if (checked == true)
        this.madalSelect.open(index);
      else
        this.madalSelect.close();
      this.setState({
        showMenu: false,
      });
    }
    // 点击批量操作按钮
    if (index == 2) {
      if (this.madalSelect) this.madalSelect.close();
      // 取消选中批量操作菜单。隐藏列表的单选按钮
      if (this.state.showMenu) {
        if (listData) {
          listData.map(item => {
            //item 当前数据库中所有数据
            item.showRaido = false;
            item.checked = false;
          });
          this.setState({
            showMenu: !this.state.showMenu,
          });
          this.flatlist.notifyList(listData, this.state.totalCount, true);
        }
      } else {
        if (listData) {
          listData.map(item => item.showRaido = true);
          this.setState({
            showMenu: !this.state.showMenu,
          });
          this.flatlist.notifyList(listData, this.state.totalCount, true);
        }
      }
    }
  }

  // 点击筛选条件触发
  onSelectMenu = (TabIndex, MenuIndex) => {
    if (TabIndex == 1) {
      if (currentFormType != MenuIndex) {
        ABORT('getDirectorFormsNew');
        currentFormType = MenuIndex;
        // 三星定制 。请假类型的表单在类型后面+V1
        if (customizedCompanyHelper.getCompanyCode() == companysCode.Samsung && currentFormType === Constance.FORMTYPE_PROCESSLEAVEFORM) {
          currentFormType = `${currentFormType}V1`;
        }
        this.onRefreshing();
      }
      this.madalSelect.close();
    }
  }

  sendRequest(formtype) {
    const params = {};
    params.formType = formtype;
    params.latestDateTime = latestDateTime;
    params.page = pageIndex;
    params.size = pageSize;
    const prefix = customizedCompanyHelper.getPrefix();
    GET(getDirectorFormsNew(prefix, params), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        if (this.flatlist == null) return;
        // 返回数据为空
        if (!_.isEmpty(responseData) && responseData.count > 0) {
          const temp = responseData.detail;
          // 设置第一页的第一条记录的申请时间
          if (pageIndex == 1 && temp.length > 0) {
            latestDateTime = temp[0].formDetail.ApplyDTM;
            listData = [];
          }
          this.setState({
            totalCount: responseData.count,
          })
          listData = [...listData, ...temp];
          if (pageIndex == 1)
            this.flatlist.notifyList(temp, responseData.count, true);
          else
            this.flatlist.notifyList(temp, responseData.count, false);
          pageIndex++;
        } else {
          this.setState({
            totalCount: 0,
          })
          listData = [...listData];
          this.flatlist.notifyList(listData, this.state.totalCount, state_onRefreshing);
        }
      });
    }, (err) => {
      if (this.flatlist == null) return;
      showMessage(messageType.error, err);
    }, 'getDirectorFormsNew');
  }

  // 点击全选按钮触发
  selectAll = (all) => {
    if (listData) {
      for (item of listData) {
        item.checked = all;
        this.setState({
          reload: !this.state.reload,
        });
      }
    }
  }

  inflateItem = (rowData, index) => {
    if (rowData.formType == Constance.FORMTYPE_PROCESSOVERTIMEFORM) {
      return <OverTimeView bottomMeneVisible cacelVisible={false} data={rowData} navigator={this.props.navigator} language={this.state.language} />;
    } else if (rowData.formType == Constance.FORMTYPE_PROCESSBUSINESSTRAVELFORM) {
      return <TraveView bottomMeneVisible cacelVisible={false} data={rowData} navigator={this.props.navigator} language={this.state.language} />;
    } else if (rowData.formType == Constance.FORMTYPE_ExceptionHandlingprocess) {
      return <ExceptionView bottomMeneVisible cacelVisible={false} data={rowData} navigator={this.props.navigator} language={this.state.language} />;
    } else if (rowData.formType == Constance.FORMTYPE_PROCESSLEAVEFORM) {
      return <LeaveView bottomMeneVisible cacelVisible={false} data={rowData} navigator={this.props.navigator} language={this.state.language} />;
    } else if (rowData.formType == Constance.FORMTYPE_PROCESSTRANSFERSHIFTFORM) {
      return <ChangeShiftView fromVerify bottomMeneVisible cacelVisible={false} data={rowData} navigator={this.props.navigator} language={this.state.language} />;
    } else if (rowData.formType == Constance.FORMTYPE_OTHER && rowData.flag == Constance.FORMTYPE_FLAG_MOBILE) {
      return <MobileInfoChangeView bottomMeneVisible cacelVisible={false} data={rowData} navigator={this.props.navigator} language={this.state.language} />;
    } else if (rowData.formType == Constance.FORMTYPE_OTHER && (rowData.flag == Constance.FORMTYPE_FLAG_DEPARTMENT || rowData.flag == Constance.FORMTYPE_FLAG_BLUETOOTH)) {
      return <DepartmentChangeView bottomMeneVisible cacelVisible={false} data={rowData} navigator={this.props.navigator} language={this.state.language} />;
    }
    //销假
    else if (rowData.formType == Constance.FORMTYPE_PROCESSCANCELFORM) {
      return <SickLeaveView bottomMeneVisible cacelVisible={false} data={rowData} navigator={this.props.navigator} language={this.state.language} />;
    }
    return null;
  }

  modalclosed = () => {
    this.indicatorTab.onResetType(0);
  }

  // 批量审核
  batchRequest = (ids, comment, signType) => {
    const params = {};
    params.SessionId = global.loginResponseData.SessionId;
    params.WorkItemId = ids;
    params.Comment = comment;
    params.SignType = signType;
    const prefix = customizedCompanyHelper.getPrefix();
    POST(SignOffEmployeeFormRequest(prefix), params, (responseData) => {
      DeviceEventEmitter.emit(event.REFRESH_CORNER_EVENT, true);
      RNManager.hideLoading();
      showMessage(messageType.success, I18n.t('mobile.module.verify.messge.success'));
      // this.onRefreshing();
    }, (err) => {
      RNManager.hideLoading();
      showMessage(messageType.error, err);
    });
    RNManager.showLoading('');
  }

  // 批量同意
  agreeAll = () => {
    const ids = [];
    listData.map(item => {
      if (item.checked) {
        ids.push(item.formDetail.WorkItemId);
      }
    });
    if (ids.length <= 0) {
      showMessage(messageType.error, I18n.t('mobile.module.verify.messge.batch.hint'));
      return;
    }

    this.approvemadalbox.open();
  }
  // 批量驳回
  rejectAll = () => {
    const ids = [];
    for (item of listData) {
      if (item.checked) {
        ids.push(item.formDetail.WorkItemId);
      }
    }
    if (ids.length <= 0) {
      showMessage(messageType.error, I18n.t('mobile.module.verify.messge.batch.hint'));
      return;
    }

    this.rejectmadalbox.open();
  }

  onApproveButtonPress() {
    let IsNeedApproveComment = 'N';
    if (!_.isEmpty(global.loginResponseData) && !_.isEmpty(global.loginResponseData.SysParaInfo)) {
      IsNeedApproveComment = global.loginResponseData.SysParaInfo.IsNeedApproveComment;
    }

    if (IsNeedApproveComment == 'Y' && _.isEmpty(approveAddvice.replace(/(^\s*)|(\s*$)/g, ""))) {
      showMessage(messageType.error, I18n.t('mobile.module.verify.comment.hint'));
      return;
    }
    const ids = [];
    for (item of listData) {
      if (item.checked) {
        ids.push(item.formDetail.WorkItemId);
      }
    }
    const result = ids.join(',');
    this.batchRequest(result, approveAddvice, 'A');
    this.approvemadalbox.close();
  }

  onRejectButtonPress() {
    let IsNeedRejectComment = 'N';
    if (!_.isEmpty(global.loginResponseData) && !_.isEmpty(global.loginResponseData.SysParaInfo)) {
      IsNeedRejectComment = global.loginResponseData.SysParaInfo.IsNeedRejectComment;
    }

    if (IsNeedRejectComment == 'Y' && _.isEmpty(rejectAddvice.replace(/(^\s*)|(\s*$)/g, ""))) {
      showMessage(messageType.error, I18n.t('mobile.module.verify.comment.hint'));
      return;
    }
    const ids = [];
    for (item of listData) {
      if (item.checked) {
        ids.push(item.formDetail.WorkItemId);
      }
    }
    const result = ids.join(',');
    this.batchRequest(result, rejectAddvice, 'R');
    this.rejectmadalbox.close();
  }


  getBottomMenuView() {
    if (this.state.showMenu) {
      return (
        <BottomMenu
          ref={menu => this.bottomMenu = menu}
          data={listData}
          agree={this.agreeAll}
          reject={this.rejectAll}
          selectAll={this.selectAll} />
      );
    }
    return null;
  }

  onLoadMore = () => {
    if (pageIndex <= 1) return;
    ABORT('getDirectorFormsNew');
    // 批量操作的时候不继续加载更多
    if (!this.state.showMenu) {
      state_onRefreshing = false;
      this.sendRequest(currentFormType);
    }
  }

  onRefreshing = () => {
    if (device.isAndroid && this.listView) this.listView.scrollTo({ y: 0 });
    pageIndex = 1;
    listData = [];
    latestDateTime = '';
    if (this.indicatorTab) this.indicatorTab.resetPiliang();
    state_onRefreshing = true;
    if (this.flatlist) this.flatlist.loading();
    this.sendRequest(currentFormType);
  }

  getTypesSuccess() {
    this.setState({
      reload: !this.state.reload,
    });
  }

  getContentView() {
    const countTextView = I18n.t('mobile.module.verify.count').replace('{0}', this.state.totalCount);
    return (
      <View style={{ flex: 1 }}>
        {
          (this.state.totalCount != 0 && this.state.totalCount != '0') ? <Text style={styles.listHeadStyle}>{countTextView}</Text> : null
        }
        <FlatListView
          needPage={true}
          emptyIcon={nodata}
          ref={(ref) => this.flatlist = ref}
          inflatItemView={this.inflateItem}
          onRefreshCallback={this.onRefreshing}
          onEndReachedCallback={this.onLoadMore}
          disableRefresh={false}
          disableEmptyView={false}
          emptyTitle={I18n.t('mobile.module.verify.empty.title')}
          emptySubTitle={I18n.t('mobile.module.verify.empty.subtitle')}
        />
      </View>
    );
  }

  getNavView() {
    if (customizedCompanyHelper.getCompanyCode() == companysCode.Estee || customizedCompanyHelper.getCompanyCode() == companysCode.Samsung
      || customizedCompanyHelper.getCompanyCode() == companysCode.Gant) {
      return (
        <NavBar title={I18n.t('mobile.module.verify.title')} onPressLeftButton={() => this.props.navigator.pop()} />
      );
    }
    return (
      <NavBar
        title={I18n.t('mobile.module.verify.title')} onPressLeftButton={() => this.props.navigator.pop()} rightContainerRightImage={{ uri: historyicon }}
        onPressRightContainerRightButton={() => { this.indicatorTab.resetPiliang(); this.props.navigator.push({ component: VerifyHistoryUi }) }} />
    );
  }
  render() {
    const { modalMarginTop } = this.state;
    return (
      <View style={styles.container}>
        {this.getNavView()}
        <IndicatorContainer
          ref={tab => this.indicatorTab = tab}
          onSelect={this.onSelectTab} />
        <Line />

        <View style={{ flex: 1 }}>

          {this.getContentView()}

          {this.getBottomMenuView()}

        </View>

        <ModalSelectUi
          ref={modal => this.madalSelect = modal}
          modalclosed={this.modalclosed}
          selectMenu={this.onSelectMenu}
        />

        <ModalBox
          style={{ height: 230, marginTop: modalMarginTop }}
          position="top"
          swipeToClose={false}
          animationDuration={400}
          backdropPressToClose={'true'}
          backdropOpacity={0.6}
          onClosed={() => {
            approveAddvice = '';
            modalMarginTop.setValue(200);
          }}
          ref={box => this.approvemadalbox = box}
        >
          <View style={{ flexDirection: 'column' }}>
            <View>
              <TextArea
                multiline
                title={I18n.t('mobile.module.verify.comment')}
                placeholder={I18n.t('mobile.module.verify.comment.hint')}
                value={approveAddvice}
                fixedHeight={true}
                onChange={(text) => {
                  approveAddvice = text;
                  this.setState({
                    update: !this.state.update,
                  });
                }}
              />
            </View>
            <Button
              customStyle={{ marginTop: 15, marginRight: 20, marginBottom: 15, marginLeft: 20, borderRadius: 4 }}
              title={I18n.t('mobile.module.verify.bottom.menu.allagree')}
              onPressBtn={() => { this.onApproveButtonPress(); }}
            />
          </View>
        </ModalBox>

        <ModalBox
          style={{ height: 230, marginTop: modalMarginTop }}
          position="top"
          swipeToClose={false}
          animationDuration={400}
          backdropPressToClose={'true'}
          backdropOpacity={0.6}
          onClosed={() => {
            rejectAddvice = '';
            modalMarginTop.setValue(200);
          }}
          ref={box => this.rejectmadalbox = box}
        >
          <View style={{ flexDirection: 'column' }}>
            <View>
              <TextArea
                title={I18n.t('mobile.module.verify.comment')}
                placeholder={I18n.t('mobile.module.verify.comment.hint')}
                value={rejectAddvice}
                fixedHeight={true}
                onChange={(text) => {
                  rejectAddvice = text;
                  this.setState({
                    update: !this.state.update,
                  });
                }}
              />
            </View>
            <Button
              customStyle={{ marginTop: 15, marginRight: 20, marginBottom: 15, marginLeft: 20, borderRadius: 4 }}
              title={I18n.t('mobile.module.verify.bottom.menu.allreject')}
              onPressBtn={() => { this.onRejectButtonPress(); }}
            />
          </View>
        </ModalBox>
      </View>
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
});