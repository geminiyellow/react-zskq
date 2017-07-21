import React, { Component } from 'react';
import { TouchableHighlight } from 'react-native';

export default class CustomTouchableHighlight extends Component {
  render() {
    const { ...props } = this.props;
    return (
      <TouchableHighlight activeOpacity={0.35} underlayColor="#fff" {...props} />
    );
  }
}