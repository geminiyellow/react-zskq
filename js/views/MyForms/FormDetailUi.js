/**
 * 表单详情页面  （主管审核表单   我的表单）
 */
import { DeviceEventEmitter, InteractionManager, TouchableOpacity, View, NativeModules } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import Text from '@/common/components/TextField';
import NavBarBackText from '@/common/components/NavBarBackText';
import { device, event } from '@/common/Util';
import EStyleSheet from 'react-native-extended-stylesheet';
import UmengAnalysis from '@/common/components/UmengAnalysis';
import { showMessage } from '@/common/Message';
import NavBar from '@/common/components/NavBar/FormDetailNavBar';
import I18n from 'react-native-i18n';
import { messageType, companysCode, companyCodeList } from '@/common/Consts';
import { POST } from '@/common/Request';
import { cancelMyFormRequest, signComToDoList, getFormsDetailInfo, getFormsDetailInfoByLearning } from '@/common/api';
import CheckButton from '@/common/components/CheckButton';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
// import NavigationBar from '@/common/components/NavigationBar';
import MobileInfoChangeDetailView from './MobileInfoChangeDetailView';
import ApproveUi from './detail/ApproveUi';
import RejectUi from './detail/RejectUi';
import Constance from './Constance';
import OverTimeDetailView from './detail/OverTimeDetailView';
import ChangeShiftDetailView from './detail/ChangeShiftDetailView';
import ChangeShiftRequireDetailView from './ChangeShiftRequireDetailView';
import DepartMentDetailView from './DepartMentDetailView';
import ExceptionDetailView from './detail/ExceptionDetailView';
import SickLeaveDetailView from './detail/SickLeaveDetailView';
import LeaveDetailView from './detail/LeaveDetailView';
import TravelDetailView from './detail/TravelDetailView';

const { RNManager } = NativeModules;
const customizedCompanyHelper = new CustomizedCompanyHelper();

import { appVersion } from '@/common/Consts';

export default class FormDetailUi extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      currentDetail: '',
      rightButtonTitle: null,
    };
  }

  /** Life cycle */

  componentWillMount() {
    UmengAnalysis.onPageBegin('FormDetail');
  }

  componentDidMount() {
    this.getDetailInfo();
  }

  componentWillUnmount() {
    // 二级页面的判断
    UmengAnalysis.onPageEnd('FormDetail');
  }

  // 提交审核 针对手机和部门变更类型的
  approveForMobileAndDepart(ToDoType, ProcessId, SignType) {
    const params = {};
    params.SessionId = global.loginResponseData.SessionId;
    params.Flag = this.state.currentDetail.flag;
    params.ProcessId = ProcessId;
    params.SignType = SignType;
    params.UnitId = this.state.currentDetail.formDetail.UnitId;
    params.UnitName = this.state.currentDetail.formDetail.UnitName;
    params.ApplierId = this.state.currentDetail.formDetail.PersonId;
    params.comanyCode = customizedCompanyHelper.getCompanyCode();
    if (!_.isEmpty(this.state.currentDetail.formDetail.Major)) params.Major = this.state.currentDetail.formDetail.Major;
    POST(signComToDoList(), params, (responseData) => {
      RNManager.hideLoading();
      showMessage(messageType.success, I18n.t('mobile.module.verify.messge.success'));
      this.props.navigator.pop();
      DeviceEventEmitter.emit(event.REFRESH_CORNER_EVENT, true);
    }, (err) => {
      RNManager.hideLoading();
      showMessage(messageType.error, JSON.stringify(err));
    });
    RNManager.showLoading('');
  }

  pressReject() {
    if (this.state.currentDetail.flag != Constance.FORMTYPE_FLAG_NORMAL) {
      this.approveForMobileAndDepart(this.state.currentDetail.formDetail.DeviceType, this.state.currentDetail.formDetail.ProcessId, 'B');
      return;
    }
    this.props.navigator.push({
      component: RejectUi,
      passProps: {
        data: this.state.currentDetail,
        callback: this.verifyCallbackMethod,
      },
    });
  }

  getTitle(detail) {
    if (this.props.passProps.data.formType == Constance.FORMTYPE_PROCESSDEMANDPOOLFORM) {
      return I18n.t('mobile.module.verify.detail.changeshift.title');
    }
    if (detail.formType == Constance.FORMTYPE_PROCESSOVERTIMEFORM) {
      return I18n.t('mobile.module.verify.detail.overtime.title');
    } else if (detail.formType == Constance.FORMTYPE_ExceptionHandlingprocess) {
      return I18n.t('mobile.module.verify.detail.exception.title');
    } else if (detail.formType == Constance.FORMTYPE_PROCESSLEAVEFORM) {
      return I18n.t('mobile.module.verify.detail.leave.title');
    } else if (detail.formType == Constance.FORMTYPE_PROCESSBUSINESSTRAVELFORM) {
      return I18n.t('mobile.module.verify.detail.trave.title');
    } else if (detail.formType == Constance.FORMTYPE_PROCESSTRANSFERSHIFTFORM) {
      return I18n.t('mobile.module.verify.detail.changeshift.title');
    }//销假 
    else if (detail.formType == Constance.FORMTYPE_PROCESSCANCELFORM) {
      return I18n.t('mobile.module.revoke.detail');
    }
    return I18n.t('mobile.module.verify.detailtitle');
  }

  getDetailInfo() {
    const data = this.props.passProps.data;
    if (this.props.passProps.data.formType == Constance.FORMTYPE_PROCESSDEMANDPOOLFORM) return;
    const bottomMenuVisible = this.props.passProps.bottomMenuVisible;
    const params = {};
    params.SessionId = global.loginResponseData.SessionId;
    if (customizedCompanyHelper.getCompanyCode() == companysCode.Samsung && data.formType === Constance.FORMTYPE_PROCESSLEAVEFORM) params.formType = `${data.formType}V1`;
    else params.formType = data.formType;
    params.processId = data.formDetail.ProcessId;
    params.workItemId = data.formDetail.WorkItemId;
    params.isHistory = !bottomMenuVisible;
    // 乐宁教育表单详情 字段
    const prefix = customizedCompanyHelper.getPrefix();
    if (customizedCompanyHelper.getCompanyCode().toLowerCase() == 'lening') {
      params.appVersion = appVersion;
      params.companyCode = customizedCompanyHelper.getCompanyCode();

      POST(getFormsDetailInfoByLearning(prefix), params, (responseData) => {
        InteractionManager.runAfterInteractions(() => {
          if (!responseData) return;
          this.setState({
            currentDetail: responseData,
            rightButtonTitle: '取消',
          });
        });
      }, (err) => {
        showMessage(messageType.error, JSON.stringify(err));
      });
    } else {
      POST(getFormsDetailInfo(prefix), params, (responseData) => {
        InteractionManager.runAfterInteractions(() => {
          if (!responseData) return;
          this.setState({
            currentDetail: responseData,
            rightButtonTitle: '取消',
          });
        });
      }, (err) => {
        showMessage(messageType.error, JSON.stringify(err));
      });
    }
  }

  verifyCallbackMethod = () => {
    this.props.navigator.pop();
  }

  // 撤销请求
  cacelRequest() {
    const params = {};
    params.SessionId = global.loginResponseData.SessionId;
    params.PriId = this.state.currentDetail.formDetail.ProcessId;
    params.FormType = this.state.currentDetail.formType;
    const prefix = customizedCompanyHelper.getPrefix();
    POST(cancelMyFormRequest(prefix), params, (responseData) => {
      RNManager.hideLoading();
      showMessage(messageType.success, I18n.t('mobile.module.verify.messge.cacelsuccess'));
      this.props.navigator.pop();
      DeviceEventEmitter.emit(event.REFRESH_CORNER_EVENT, true);
    }, (err) => {
      RNManager.hideLoading();
      showMessage(messageType.error, JSON.stringify(err));
    });
    RNManager.showLoading('');
  }

  pressAgree() {
    if (this.state.currentDetail.flag != Constance.FORMTYPE_FLAG_NORMAL) {
      // 提交审核通过
      this.approveForMobileAndDepart(this.state.currentDetail.formDetail.DeviceType, this.state.currentDetail.formDetail.ProcessId, 'A');
      return;
    }

    this.props.navigator.push({
      component: ApproveUi,
      passProps: {
        data: this.state.currentDetail,
        callback: this.verifyCallbackMethod,
      },
    });
  }

  /** Render methods */

  render() {
    const { currentDetail } = this.state;
    const { iscacelVisible } = this.props.passProps;
    let rightButtonTitle = null;
    if (iscacelVisible && iscacelVisible == true && currentDetail && currentDetail.formDetail.ApproveState == Constance.FORMSTATUS_ACTIVE) {
      if (customizedCompanyHelper.getCompanyCode() != companysCode.Samsung && customizedCompanyHelper.getCompanyCode() != companysCode.Estee && customizedCompanyHelper.getCompanyCode() != companysCode.Gant) {
        if (global.loginResponseData.SysParaInfo.IsAllowRevoke == 'N') {
          rightButtonTitle = I18n.t('mobile.module.detail.nav.menu.cancel');
        }
      } else {
        rightButtonTitle = I18n.t('mobile.module.detail.nav.menu.cancel');
      }
    }
    return (
      <View style={styles.container}>
        <NavBar
          title={this.getTitle(currentDetail)}
          onPressLeftButton={() => this.props.navigator.pop()}
          rightButtonTitle={rightButtonTitle}
          onPressRightButton={() => { this.cacelRequest() }} />
        <View style={styles.contentStyle}>
          {this.renderContentView()}
        </View>
        {this.renderBottomBtn()}
      </View>
    );
  }

  renderContentView() {
    if (this.props.passProps.data.formType == Constance.FORMTYPE_PROCESSDEMANDPOOLFORM) {
      return (
        <ChangeShiftRequireDetailView detail={this.props.passProps.data} navigator={this.props.navigator} />
      );
    }
    if (!this.state.currentDetail && this.state.currentDetail.length == 0) return null;
    if (this.state.currentDetail.formType == Constance.FORMTYPE_PROCESSOVERTIMEFORM) {
      return (
        <OverTimeDetailView detail={this.state.currentDetail} navigator={this.props.navigator} />
      );
    }
    //异常详情
    else if (this.state.currentDetail.formType == Constance.FORMTYPE_ExceptionHandlingprocess) {
      return (
        <ExceptionDetailView detail={this.state.currentDetail} navigator={this.props.navigator} />
      );
    } else if (this.state.currentDetail.formType == Constance.FORMTYPE_PROCESSLEAVEFORM) {
      return (
        <LeaveDetailView detail={this.state.currentDetail} navigator={this.props.navigator} />
      );
    } else if (this.state.currentDetail.formType == Constance.FORMTYPE_OTHER && this.state.currentDetail.flag == Constance.FORMTYPE_FLAG_MOBILE) {
      return (
        <MobileInfoChangeDetailView detail={this.state.currentDetail} navigator={this.props.navigator} />
      );
    } else if (this.state.currentDetail.formType == Constance.FORMTYPE_OTHER && (this.state.currentDetail.flag == Constance.FORMTYPE_FLAG_DEPARTMENT || this.state.currentDetail.flag == Constance.FORMTYPE_FLAG_BLUETOOTH)) {
      return (
        <DepartMentDetailView detail={this.state.currentDetail} navigator={this.props.navigator} />
      );
    } else if (this.state.currentDetail.formType == Constance.FORMTYPE_PROCESSBUSINESSTRAVELFORM) {
      return (
        <TravelDetailView detail={this.state.currentDetail} navigator={this.props.navigator} />
      );
    } else if (this.state.currentDetail.formType == Constance.FORMTYPE_PROCESSTRANSFERSHIFTFORM) {
      return (
        <ChangeShiftDetailView fromVerify={this.props.passProps.fromVerify} detail={this.state.currentDetail} navigator={this.props.navigator} />
      );
    }//销假
    else if (this.state.currentDetail.formType == Constance.FORMTYPE_PROCESSCANCELFORM) {
      return (
        <SickLeaveDetailView detail={this.state.currentDetail} navigator={this.props.navigator} />
      );
    }
    return null;
  }

  renderBottomBtn() {
    if (!this.state.currentDetail && this.state.currentDetail.length == 0) return null;
    const bottomMenuVisible = this.props.passProps.bottomMenuVisible;
    if (bottomMenuVisible) {
      return (
        <CheckButton
          disabled={false}
          onPressLeftBtn={() => this.pressAgree()}
          onPressRightBtn={() => this.pressReject()}
        />
      );
    }
    return null;
  }
}

const styles = EStyleSheet.create({
  columnImg: {
    width: device.width,
    height: 220,
    marginVertical: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
  },
  contentStyle: {
    flex: 1,
  },
  descriptionRowStyle: {
    flexDirection: 'row',
  },
  descriptionRowPositionStyle: {
    fontSize: 18,
    color: '$color.mainTitleTextColor',
  },
  descriptionRowTagStyle: {
    fontSize: 15,
    color: '$color.mainTitleTextColor',
    marginRight: 8,
  },
  enclosureStyle: {
    margin: 10,
  },
  rowStyle: {
    flexDirection: 'column',
    margin: 5,
    marginLeft: 18,
    marginRight: 18,
  },
  rowTitleStyle: {
    height: 33,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  rowTitleTextStyle: {
    color: '#333333',
    fontSize: 16,
  },
  rowContentDateStyle: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 9,
  },
  // 多行文本框统一加下这个样式
  multilineInput: {
    '@media ios': {
      paddingVertical: 5,
    },
    flex: 1,
    paddingLeft: 10,
    height: 200,
    textAlignVertical: 'top',
    width: device.width - 20,
    fontSize: 14,
  },
  rowContentDurationStyle: {
    marginTop: 12,
    fontSize: 15,
    color: '#3E3E3E',
  },
  rowContentReasonStyle: {
    fontSize: 16,
    lineHeight: 23,
    color: '#999999',
  },

});