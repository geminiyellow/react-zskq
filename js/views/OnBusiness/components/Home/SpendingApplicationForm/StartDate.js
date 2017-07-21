// 备用金申请开始日期

import React, { Component } from 'react';
import { DeviceEventEmitter } from 'react-native';
import I18n from 'react-native-i18n';
import { event } from '@/common/Util';
import EStyleSheet from 'react-native-extended-stylesheet';
import OptionCard from '@/common/components/OptionCard';
import { getYYYYMMDDFormat } from '@/common/Functions';
import { APPLY_START_DATE } from '../constants.js';

export default class StartDate extends Component {

  /** event response */

  onPress() {
    const { rowID, rowData } = this.props;
    // 当前日期
    let currentDate;
    if (rowData) {
      currentDate = rowData.StartDate;
    }
    const params = {
      slectedValue: currentDate,
      type: APPLY_START_DATE,
      rowID,
    };
    DeviceEventEmitter.emit(event.OB_PICK_START_DATE, params);
  }

  /** render methods */

  render() {
    const { rowData } = this.props;
    const startDate = rowData.StartDate;
    const formatDate = getYYYYMMDDFormat(startDate);

    return (
      <OptionCard
        title={I18n.t('mobile.module.onbusiness.applicationformstartdatetitle')}
        detailText={formatDate}
        onPress={() => this.onPress()}
        topLineStyle={styles.topLineStyle}
      />
    );
  }
}

const styles = EStyleSheet.create({
  topLineStyle: {
    marginLeft: 18,
  },
});