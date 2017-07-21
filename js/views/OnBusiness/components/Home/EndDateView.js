/** 结束时间 */

import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import Functions from '@/common/Functions';
import EStyleSheet from 'react-native-extended-stylesheet';
import OptionCard from '@/common/components/OptionCard';
import { getYYYYMMDDhhmmFormat } from '@/common/Functions';
import { END_DATE } from './constants.js';

// 获取年、月、日
const selectedYear = Functions.getYear();
const selectedMonth = Functions.getMonth();
const selectedDay = Functions.getDay();

export default class EndDateView extends Component {

  /** event response */

  onPress() {
    this.props.showDatePicker([selectedYear.toString(), selectedMonth, selectedDay], END_DATE);
  }

  /** render view */

  render() {
    const { endDateValue } = this.props;
    const formatDateTime = getYYYYMMDDhhmmFormat(endDateValue);

    return (
      <OptionCard
        title={I18n.t('mobile.module.onbusiness.enddatetitle')}
        detailText={endDateValue === '' ? I18n.t('mobile.module.onbusiness.applicationformenddatevalue') : formatDateTime}
        onPress={() => this.onPress()}
        topLineStyle={styles.topLine}
        bottomLine
        bottomLineStyle={styles.bottomLine}
      />
    );
  }
}

const styles = EStyleSheet.create({
  topLine: {
    marginLeft: 18,
  },
  bottomLine: {
    marginLeft: 18,
  },
});