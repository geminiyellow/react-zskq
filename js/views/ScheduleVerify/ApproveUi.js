/**
 * 主管审核表单详情 同意弹窗功能
 */
import { DeviceEventEmitter, ScrollView, View } from 'react-native';
import { device } from '@/common/Util';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import NavBar from '@/common/components/NavBar';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import { POST } from '@/common/Request';
import { verifyShedule } from '@/common/api';
import TextArea from '@/common/components/TextArea';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';

let approveAddvice = '';
let data = null;

export default class ApproveUi extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
    };
  }

  componentWillMount() {
    data = this.props.passProps.data;
  }

  componentWillUnmount() {
  }

  // 同意审核实现
  onApproveButtonPress() {
    const params = {};
    params.SessionId = global.loginResponseData.SessionId;
    params.loginName = global.loginResponseData.LoginName;
    params.userId = global.loginResponseData.UserID;
    params.todoId = data.ToDoId;
    params.unitId = data.UnitId;
    params.yearMonth = data.YearMonth;
    params.signType = this.props.passProps.verifyType;
    params.reason = approveAddvice;
    POST(verifyShedule(), params, (responseData) => {
      DeviceEventEmitter.emit('scheduleverify', true);
      const { callback } = this.props.passProps;
      callback();
      showMessage(messageType.success, I18n.t('mobile.module.verify.messge.success'));
      this.props.navigator.pop();
    }, (err) => {
      showMessage(messageType.error, err);
    });
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
        value={approveAddvice}
        onChange={(text) => {
          approveAddvice = text;
          this.setState({
            update: !this.state.update,
          });
        }}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>

        <NavBar title={'审批意见'} onPressLeftButton={() => this.props.navigator.pop()} rightContainerLeftButtonTitle={I18n.t('mobile.module.detail.nav.menu.publish')} onPressRightContainerLeftButton={() => this.onApproveButtonPress()} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'column' }}>

            {this.getAdviceView()}
          </View>
        </ScrollView>
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
    fontSize: 16,
    color: '#333',
    width: device.width - 90,
  },
});
