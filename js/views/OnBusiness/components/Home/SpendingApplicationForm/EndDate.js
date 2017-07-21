/** 备用金申请结束日期 */

import React, { Component } from 'react';
import { DeviceEventEmitter } from 'react-native';
import I18n from 'react-native-i18n';
import Functions from '@/common/Functions';
import { event } from '@/common/Util';
import EStyleSheet from 'react-native-extended-stylesheet';
import OptionCard from '@/common/components/OptionCard';
import { getYYYYMMDDFormat } from '@/common/Functions';
import { APPLY_END_DATE } from '../constants.js';

export default class EndDate extends Component {

  /** event response */

  onPress() {
    const { rowID, rowData } = this.props;
    // 当前日期
    let currentDate = Functions.getNowFormatDate();
    if (rowData) {
      currentDate = rowData.EndDate;
      if (currentDate === '') {
        currentDate = Functions.getNowFormatDate();
      }
    }
    const params = {
      selectedValue: currentDate,
      type: APPLY_END_DATE,
      rowID,
    };
    DeviceEventEmitter.emit(event.OB_PICK_END_DATE, params);
  }

  /** render view */

  render() {
    const { rowData } = this.props;
    const endDate = rowData.EndDate;
    const formatDate = getYYYYMMDDFormat(endDate);

    return (
      <OptionCard
        title={I18n.t('mobile.module.onbusiness.applicationformenddatetitletext')}
        detailText={endDate === '' ? I18n.t('mobile.module.onbusiness.applicationformenddatevalue') : formatDate}
        onPress={() => this.onPress()}
        topLineStyle={styles.topLineStyle}
        bottomLine
        bottomLineStyle={styles.bottomLineStyle}
      />
    );
  }
}

const styles = EStyleSheet.create({
  topLineStyle: {
    marginLeft: 18,
  },
  bottomLineStyle: {
    marginLeft: 18,
  },
});