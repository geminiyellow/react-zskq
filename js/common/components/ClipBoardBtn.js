/**
 * 复制内容到剪切板控件
 */
import React, { Component } from 'react';
import { Clipboard, TouchableOpacity, Text } from 'react-native';
import { messageType } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import I18n from 'react-native-i18n';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  wrapStyle: {
    height: 18,
    paddingLeft: 8,
    paddingRight: 8,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#1fd662',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class ClipBoardBtn extends Component {
  mixins: [React.addons.PureRenderMixin]

  constructor(props) {
    super(props);
    this.state = {
      formNum: '',
    };
  }

  componentWillMount() {
    const { formNumber } = this.props;
    this.setState({
      formNum: formNumber,
    });
  }

  onPressBtn= async() => {
    Clipboard.setString(this.state.formNum);
    showMessage(messageType.success, I18n.t('mobile.module.detail.msg.copysuccess'));
  }

  render() {
    return (
      <TouchableOpacity style={styles.wrapStyle} onPress={this.onPressBtn}>
        <Text allowFontScaling={false} style={{ fontSize: 12, color: '#1fd662' }}>{I18n.t('mobile.module.detail.copyid')}</Text>
      </TouchableOpacity>
    );
  }
}