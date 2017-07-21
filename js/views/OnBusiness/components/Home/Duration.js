import React, { Component } from 'react';
import { Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import Input from '@/common/components/Input';
import EStyleSheet from 'react-native-extended-stylesheet';
import OptionCard from '@/common/components/OptionCard';
import { font, color } from '../Style';

export default class Duration extends Component {
  render() {
    const { hours } = this.props;
    return (
      <OptionCard
        title={I18n.t('mobile.module.onbusiness.durationtitle')}
        detailText={hours}
        rightImage={false}
        disabled
        topLine={false}
        bottomLine
        detailMarginRight={18}
      />
    );
  }
}