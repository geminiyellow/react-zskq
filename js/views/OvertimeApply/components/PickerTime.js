/**
 * 加班申请Picker时间界面
 */

import React, { PureComponent } from 'react';
import _ from 'lodash';
import I18n from 'react-native-i18n';
import { moduleList } from '@/common/Consts';
import { getNowFormatDate, getVersionId, getHHmmFormat, getYYYYMMDDFormat } from '@/common/Functions';
import DatePicker, { datePickerType } from '@/common/components/DatePicker';
import { pickerDate, pickerStart, pickerEnd } from '../constants';

export default class PickerTime extends PureComponent {

  constructor(...props) {
    super(...props);
    this.state = {
      getOverTimePreSetInfo: this.props.getOverTimePreSetInfo,
      pickerTitle: I18n.t('mobile.module.overtime.overtimeapplydate'),
      pickerMode: datePickerType.dateMode,
      pickerTime: getNowFormatDate(),
    };
    this.selectType = pickerDate;
    this.selectDate = getNowFormatDate();
  }

  componentWillMount() {
    this.companyCode = getVersionId(global.companyResponseData.version, moduleList.overtime);
  }

  // 设置刷新信息
  onSetPickerRefresh(getOverTimePreSetInfoTemp) {
    const { StartTime } = getOverTimePreSetInfoTemp;
    // 显示加班的日期
    const { dateRefresh } = this.props;
    dateRefresh(getYYYYMMDDFormat(this.selectDate));

    // 处理加班的开始时间
    if (_.isEmpty(StartTime)) {
      this.selectStart = '00:00';
    } else {
      this.selectStart = StartTime;
    }
    const { startRefresh } = this.props;
    startRefresh(getHHmmFormat(this.selectStart));
    // 处理加班的结束时间
    this.selectEnd = '00:00';
    this.selectEndTemp = I18n.t('mobile.module.overtime.overtimeapplypicker');
    const { endRefresh } = this.props;
    endRefresh(I18n.t('mobile.module.overtime.overtimeapplypicker'));
    // 刷新状态
    this.setState({
      getOverTimePreSetInfo: getOverTimePreSetInfoTemp,
    });
  }

  // 获取加班的picker信息
  onGetPickerSelectData() {
    const params = {};
    params.selectDateTemp = this.selectDate;
    params.selectStartTemp = this.selectStart;
    params.selectEndTemp = this.selectEndTemp;
    params.totalHoursTemp = this.totalHoursTemp;
    return params;
  }

  // 打开选择器
  onOpenPicker = type => {
    // 判断接口的数据是否正常
    const { getOverTimePreSetInfo } = this.state;
    if (_.isEmpty(getOverTimePreSetInfo)) {
      this.props.onGetOvertimePresetInfo(this.selectDate);
      return;
    }
    switch (type) {
      case pickerDate:
        this.setState({
          pickerMode: datePickerType.dateMode,
          pickerTitle: I18n.t('mobile.module.overtime.overtimeapplydate'),
          pickerTime: this.selectDate,
        });
        // 加载选择框日期
        this.selectType = pickerDate;
        this.picker.show();
        break;
      case pickerStart:
        this.setState({
          pickerMode: datePickerType.hourMinuteMode,
          pickerTitle: I18n.t('mobile.module.overtime.overtimeapplystarttime'),
          pickerTime: this.selectStart,
        });
        // 加载选择框开始时间
        this.selectType = pickerStart;
        this.picker.show();
        break;
      case pickerEnd:
        this.setState({
          pickerMode: datePickerType.hourMinuteMode,
          pickerTitle: I18n.t('mobile.module.overtime.overtimeapplyendtime'),
          pickerTime: this.selectEnd,
        });
        // 加载选择框结束时间
        this.selectType = pickerEnd;
        this.picker.show();
        break;
      default:
        break;
    }
  };

  render() {
    const { getOverTimePreSetInfo, pickerMode, pickerTitle, pickerTime } = this.state;
    if (_.isEmpty(getOverTimePreSetInfo)) {
      return null;
    }
    return (
      <DatePicker
        ref={ref => {
          this.picker = ref;
        }}
        datePickerMode={pickerMode}
        title={pickerTitle}
        selectedValue={pickerTime}
        onPickerConfirm={pickedValue => {
          switch (this.selectType) {
            case pickerDate:
              // 加载选择框日期
              this.selectDate = pickedValue;
              this.props.dateRefresh(getYYYYMMDDFormat(pickedValue));
              this.props.onGetOvertimePresetInfo(pickedValue);
              break;
            case pickerStart:
              // 加载选择框开始时间
              this.selectStart = pickedValue;
              this.props.startRefresh(getHHmmFormat(pickedValue));
              if (this.selectEndTemp != I18n.t('mobile.module.overtime.overtimeapplypicker')) {
                // 加载加班规则
                this.props.onGetOvertimeRule();
              }
              break;
            case pickerEnd:
              // 加载选择框结束时间
              this.selectEnd = pickedValue;
              this.selectEndTemp = pickedValue;
              this.props.endRefresh(getHHmmFormat(pickedValue));
              // 加载加班规则
              this.props.onGetOvertimeRule();
              break;
            default:
              break;
          }
          this.setState({
            pickerTime: pickedValue,
          });
        }}
      />
    );
  }
}
