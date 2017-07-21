import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import I18n from 'react-native-i18n';

export default class CloseButton extends Component {
  render() {
    const { show, onPress } = this.props;
    if (!show) return null;
    return (
      <TouchableOpacity style={{ marginLeft: 9 }} onPress={() => onPress()}>
        <Text style={{ color: '#1fd662', fontSize: 16 }}>{I18n.t('mobile.module.lovecare.close')}</Text>
      </TouchableOpacity>
    );
  }
}