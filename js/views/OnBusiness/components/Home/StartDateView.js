/** 开始时间 */

import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import Functions from '@/common/Functions';
import EStyleSheet from 'react-native-extended-stylesheet';
import OptionCard from '@/common/components/OptionCard';
import { START_DATE } from './constants.js';
import { getYYYYMMDDhhmmFormat } from '@/common/Functions';

// 设置年月日以及获取日期
const selectedYear = Functions.getYear();
const selectedMonth = Functions.getMonth();
const selectedDay = Functions.getDay();

export default class StartDateView extends Component {

  /** event response */

  onPress() {
    this.props.showDatePicker([selectedYear.toString(), selectedMonth, selectedDay], START_DATE);
  }

  /** render view */

  render() {
    const { startDateValue } = this.props;
    const formatDateTime = getYYYYMMDDhhmmFormat(startDateValue);

    return (
      <OptionCard
        style={styles.container}
        title={I18n.t('mobile.module.onbusiness.startdatetitle')}
        detailText={formatDateTime}
        onPress={() => this.onPress()}
      />
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    marginTop: '$margin',
  },
});