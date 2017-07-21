import React, { PureComponent } from 'react';

import I18n from 'react-native-i18n';
import Input from '@/common/components/TextArea';

export default class LeaveRemark extends PureComponent {

  // 初始化
  constructor(props) {
    super(props);
    this.state = {
      leaveApplyRemark: '',
    };
  }

  onInputReasonChange(text) {
    this.setState({
      leaveApplyRemark: text,
    });
  }

  // 导出请假remark
  onExportLeaveRemark() {
    return this.state.leaveApplyRemark;
  }

  render() {
    return (
      <Input
        placeholder={I18n.t('mobile.module.leaveapply.leaveapplyreasondefault')}
        title={I18n.t('mobile.module.overtime.detailstitle')}
        placeholderTextColor={'#c9c9c9'}
        underlineColorAndroid={'transparent'}
        topLine
        bottomLine={false}
        value={this.state.leaveApplyRemark}
        onChange={(text) => this.onInputReasonChange(text)} />
    );
  }
}