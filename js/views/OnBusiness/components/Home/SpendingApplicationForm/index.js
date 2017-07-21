// 备用金申请单

import React, { Component } from 'react';
import { View } from 'react-native';
import ApplicationAmount from './ApplicationAmount';
import Bar from './Bar';
import CostDescription from './CostDescription';
import ExpenseType from './ExpenseType';
import EndDate from './EndDate';
import MyLine from '../MyLine';
import StartDate from './StartDate';

export default class SpendingApplicationForm extends Component {

  /** render method */

  render() {
    const { rowID, expenseTypeData, currencyData, rowData } = this.props;
    return (
      <View>
        <Bar rowID={rowID} />
        <ExpenseType data={expenseTypeData} rowID={rowID} rowData={rowData} />
        <StartDate rowID={rowID} rowData={rowData} />
        <EndDate rowID={rowID} rowData={rowData} />
        <CostDescription rowID={rowID} rowData={rowData} />
        <MyLine />
        <ApplicationAmount rowID={rowID} rowData={rowData} currencyData={currencyData} />
        <MyLine lineStyle={{ marginLeft: 0 }} />
      </View>
    );
  }
}