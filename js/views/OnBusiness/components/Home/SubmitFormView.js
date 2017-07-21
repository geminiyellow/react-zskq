// 表单提交按钮

import React, { Component } from 'react';
import SubmitButton from '@/common/components/SubmitButton';

export default class SubmitFormView extends Component {

  /** event response */

  onPressSubmitButton() {
    this.props.submitForm();
  }

  /** render view */

  render() {
    return <SubmitButton onPressBtn={() => this.onPressSubmitButton()} />;
  }
}