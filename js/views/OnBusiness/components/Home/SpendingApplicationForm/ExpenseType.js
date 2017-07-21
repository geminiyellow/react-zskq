/** 费用种类 */

import React, { Component } from 'react';
import { DeviceEventEmitter } from 'react-native';
import I18n from 'react-native-i18n';
import { event } from '@/common/Util';
import OptionCard from '@/common/components/OptionCard';
import { EXPENSE_TYPE } from '../constants.js';

export default class ExpenseType extends Component {

  /** event response */

  onPress() {
    const { data, rowID, rowData } = this.props;
    if (data.length <= 0) return;
    const params = {
      pickerData: data,
      value: rowData.CostCategory,
      type: EXPENSE_TYPE,
      rowID: parseInt(rowID),
    };
    DeviceEventEmitter.emit(event.OB_PICK_EXPENSE_TYPE, params);
  }

  /** render method */

  render() {
    const { rowData } = this.props;
    const costCategory = rowData.CostCategory;
    return (
      <OptionCard
        title={I18n.t('mobile.module.onbusiness.expensetypetitle')}
        detailText={costCategory === '' ? I18n.t('mobile.module.onbusiness.expensetypevalue') : costCategory}
        onPress={() => this.onPress()}
      />
    );
  }
}
