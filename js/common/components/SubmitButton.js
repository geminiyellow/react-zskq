/** 表单提交按钮 */

import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import { TouchableHighlight, Text } from 'react-native';
import { button } from '@/common/Style';
import { device } from '@/common/Util';
import _ from 'lodash';

let bthBg = button.background.normal;
let btnBgClick = button.background.active;

export default class SubmitButton extends Component {
  static defaultProps = {
    disabled: false,
  };

  mixins: [React.addons.PureRenderMixin]

  constructor(...props) {
    super(...props);
    if (_.isEmpty(global.companyResponseData.color.btnBg) || _.isUndefined(global.companyResponseData.color.btnBg)) {
      bthBg = button.background.normal;
    } else {
      bthBg = global.companyResponseData.color.btnBg;
    }

    if (!_.isEmpty(global.companyResponseData.color.btnBgClick) && !_.isUndefined(global.companyResponseData.color.btnBgClick)) {
      btnBgClick = global.companyResponseData.color.btnBgClick;
    } else {
      btnBgClick = button.background.active;
    }

    this.state = {
      backgroundColor: bthBg,
      btnClickBg: btnBgClick,
    };
  }

  /** Life Cycle */

  componentDidMount() {
    const { disabled } = this.props;
    let btnDisBg = button.background.disabled;
    if (disabled) {
      // 根据配置切换显示背景色
      if (!_.isEmpty(global.companyResponseData.color.btnBgUnClick) && !_.isUndefined(global.companyResponseData.color.btnBgUnClick)) {
        btnDisBg = global.companyResponseData.color.btnBgUnClick;
      } else {
        btnDisBg = button.background.disabled;
      }
      this.setState({
        backgroundColor: btnDisBg,
      });
    }
  }

  onPressOutShiftBg() {
    if (!_.isEmpty(global.companyResponseData.color.btnBg) && !_.isUndefined(global.companyResponseData.color.btnBg)) {
      this.setState({
        backgroundColor: global.companyResponseData.color.btnBg,
      });
    }
  }

  /** Render View */

  render() {
    const { onPressBtn, customStyle, disabled, title } = this.props;
    const { backgroundColor } = this.state;
    return (
      <TouchableHighlight
        style={[styles.container, customStyle, { backgroundColor }]}
        disabled={disabled}
        onPress={onPressBtn}
        underlayColor={this.state.btnClickBg}
        onPressOut={() => this.onPressOutShiftBg}
        >
        <Text allowFontScaling={false} style={styles.title}>{!title ? I18n.t('mobile.module.onbusiness.submitformbuttontitle') : title}</Text>
      </TouchableHighlight>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: device.width,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    width: 200,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});