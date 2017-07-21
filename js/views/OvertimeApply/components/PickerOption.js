/**
 * 加班申请Picker选项界面
 */

import React, { PureComponent } from 'react';
import { View } from 'react-native';
import _ from 'lodash';
import I18n from 'react-native-i18n';
import Picker from '@/common/components/OptionPicker';
import { pickerActualDate, pickerReason } from '../constants';

export default class PickerOption extends PureComponent {
  constructor(...props) {
    super(...props);
    this.state = {
      getOverTimePreSetInfo: this.props.getOverTimePreSetInfo,
      pickerData: [],
      selectValue: [],
      pickerTitle: '',
      pickerValue: '',
    };
    // 时间加班日期的数据
    this.selectActualDateData = new Map();
    this.selectActualDateData.set(
      '-1',
      I18n.t('mobile.module.overtime.overtimeapplyactualdf'),
    );
    this.selectActualDateData.set(
      '0',
      I18n.t('mobile.module.overtime.overtimeapplyactualdc'),
    );
    this.selectActualDateData.set(
      '1',
      I18n.t('mobile.module.overtime.overtimeapplyactualdl'),
    );
    this.selectType = pickerActualDate;
    // 设置加班原因
    this.getReasonList = [];
    this.getEmployeeOverTimeReasonMap = '';
  }

  // 设置刷新信息
  onSetPickerRefresh(getOverTimePreSetInfoTemp) {
    const { DayType, DayTypeId, ReasonList } = getOverTimePreSetInfoTemp;
    // 设置实际加班日期
    if (global.loginResponseData.SysParaInfo.OTDayTypeIsVisible === 'Y') {
      if (DayType) {
        const { actualRefresh } = this.props;
        actualRefresh(this.selectActualDateData.get(DayTypeId));
        this.selectActualDate = this.selectActualDateData.get(DayTypeId);
      }
    }
    // 加载加班原因
    if (!_.isEmpty(ReasonList)) {
      this.getEmployeeOverTimeReasonMap = new Map();
      this.getReasonList = new Array([ReasonList.length]);
      for (let i = 0; i < ReasonList.length; i += 1) {
        this.getReasonList[i] = ReasonList[i].ResonDesc;
        this.getEmployeeOverTimeReasonMap.set(
          ReasonList[i].ResonDesc,
          ReasonList[i],
        );
      }
      // 设置原因初始值
      const { reasonRefresh } = this.props;
      reasonRefresh(this.getReasonList[0]);
      this.selectReason = this.getReasonList[0];
    }
    // 刷新状态
    this.setState({
      getOverTimePreSetInfo: getOverTimePreSetInfoTemp,
    });
  }

  // 获取加班的picker信息
  onGetPickerSelectData() {
    const params = {};
    params.getEmployeeOverTimeReasonMap = this.getEmployeeOverTimeReasonMap;
    params.selectReason = this.selectReason;
    for (const [key, value] of this.selectActualDateData.entries()) {
      if (this.selectActualDate === value) {
        params.dayTypeId = key;
        break;
      }
    }
    return params;
  }

  // 打开选择器
  onOpenPicker = type => {
    // 判断接口的数据是否正常
    const { getOverTimePreSetInfo } = this.state;
    if (_.isEmpty(getOverTimePreSetInfo)) {
      return;
    }
    switch (type) {
      case pickerActualDate:
        if (_.isEmpty(this.selectActualDate)) {
          return;
        }
        this.setState({
          selectValue: this.selectActualDate,
          pickerData: [
            I18n.t('mobile.module.overtime.overtimeapplyactualdf'),
            I18n.t('mobile.module.overtime.overtimeapplyactualdc'),
            I18n.t('mobile.module.overtime.overtimeapplyactualdl')]
          ,
          pickerTitle: I18n.t('mobile.module.overtime.overtimeapplyactualdate'),
        });
        this.selectType = pickerActualDate;
        // 加班选择框的实际加班日期
        this.optionPicker.toggle();
        break;
      case pickerReason:
        if (_.isEmpty(this.selectReason) || _.isEmpty(this.getReasonList)) {
          return;
        }
        this.setState({
          selectValue: this.selectReason,
          pickerData: this.getReasonList,
          pickerTitle: I18n.t('mobile.module.overtime.overtimeapplyreason'),
        });
        this.selectType = pickerReason;
        // 加载选择框加班原因
        this.optionPicker.toggle();
        break;
      default:
        break;
    }
  };

  render() {
    const {
      getOverTimePreSetInfo,
      selectValue,
      pickerData,
      pickerTitle,
      pickerValue,
    } = this.state;
    if (_.isEmpty(getOverTimePreSetInfo)) {
      return null;
    }
    return (
      <Picker
        ref={ref => {
          this.optionPicker = ref;
        } }
        pickerTitle={pickerTitle}
        pickerData={pickerData}
        selectedValue={[selectValue]}
        onPickerDone={pickedValue => {
          this.setState({
            pickerValue: pickedValue[0],
          });
          switch (this.selectType) {
            case pickerActualDate:
              // 显示选择的数据
              const { actualRefresh } = this.props;
              this.selectActualDate = pickedValue[0];
              actualRefresh(pickedValue[0]);
              break;
            case pickerReason:
              // 显示加班原因
              const { reasonRefresh } = this.props;
              this.selectReason = pickedValue[0];
              reasonRefresh(pickedValue[0]);
              break;
            default:
              break;
          }
        }
        }
        />
    );
  }
}
