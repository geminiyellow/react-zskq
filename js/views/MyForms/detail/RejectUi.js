/**
 * 主管审核表单详情 同意弹窗功能
 */
import { DeviceEventEmitter, View, NativeModules } from 'react-native';
import { device, event } from '@/common/Util';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import NavBar from '@/common/components/NavBar';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import { POST } from '@/common/Request';
import { SignOffEmployeeFormRequest } from '@/common/api';
import TextArea from '@/common/components/TextArea';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import { Keyboard } from 'react-native';
import { color } from '@/common/Style';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';

const customizedCompanyHelper = new CustomizedCompanyHelper();
const { RNManager } = NativeModules;
let currentDetail = null;

let rejectAddvice = null;

export default class RejectUi extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      update: true,
    };
  }

  componentWillMount() {
    currentDetail = this.props.passProps.data;
    if (!currentDetail) return;
  }

  componentWillUnmount() {
    rejectAddvice = null;
  }

  onRejectButtonPress = () => {
    let IsNeedRejectComment = 'N';
    if (!_.isEmpty(global.loginResponseData) && !_.isEmpty(global.loginResponseData.SysParaInfo)) {
      IsNeedRejectComment = global.loginResponseData.SysParaInfo.IsNeedRejectComment;
    }
    if (IsNeedRejectComment && IsNeedRejectComment == 'Y') {
      if (_.isEmpty(rejectAddvice)) {
        showMessage(messageType.error, I18n.t('mobile.module.verify.comment.hint'));
        return;
      }
    }
    this.batchRequest(currentDetail.formDetail.WorkItemId, rejectAddvice, 'R');
  }

  // 审核意见布局
  getAdviceView() {
    if (!_.isEmpty(global.loginResponseData) && !_.isEmpty(global.loginResponseData.SysParaInfo)) {
      IsNeedApproveComment = global.loginResponseData.SysParaInfo.IsNeedApproveComment;
    }
    return (
      <TextArea
        title={I18n.t('mobile.module.verify.comment')}
        placeholder={I18n.t('mobile.module.verify.comment.hint')}
        value={rejectAddvice}
        onChange={(text) => {
          // 去掉
          text = text.replace(/(^\s*)|(\s*$)/g, "")
          rejectAddvice = text;
          this.setState({
            update: !this.state.update,
          });
        }}
      />
    );
  }

  // 批量审核
  batchRequest(ids, comment, signType, IsOTForm, OTParams) {
    const params = {};
    params.SessionId = global.loginResponseData.SessionId;
    params.WorkItemId = ids;
    params.Comment = comment;
    params.SignType = signType;
    params.IsOTForm = IsOTForm;
    params.OTParams = OTParams;
    const prefix = customizedCompanyHelper.getPrefix();
    POST(SignOffEmployeeFormRequest(prefix), params, (responseData) => {
      RNManager.hideLoading();
      DeviceEventEmitter.emit(event.REFRESH_CORNER_EVENT, true);
      const { callback } = this.props.passProps;
      callback();
      showMessage(messageType.success, I18n.t('mobile.module.verify.messge.success'));
      this.props.navigator.pop();
    }, (err) => {
      RNManager.hideLoading();
      showMessage(messageType.error, err);
    });
    RNManager.showLoading('');
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar title={I18n.t('mobile.module.detail.reject.addvice')} onPressLeftButton={() => { Keyboard.dismiss(); this.props.navigator.pop() }} rightContainerLeftButtonTitle={I18n.t('mobile.module.detail.nav.menu.publish')} onPressRightContainerLeftButton={() => this.onRejectButtonPress()} />
        <View style={{ flexDirection: 'column' }}>
          {this.getAdviceView()}
        </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '$color.containerBackground',
  },
  // 多行文本框统一加下这个样式
  multilineInput: {
    '@media ios': {
      paddingVertical: 5,
    },
    flexGrow: 1,
    paddingLeft: 0,
    height: 300,
    marginTop: 8,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  compTimeStyle: {
    fontSize: 14,
    color: '#333',
    width: device.width - 90,
  },
});
