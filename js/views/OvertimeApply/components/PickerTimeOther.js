/**
 * 加班申请Picker时间界面
 */

import React, { PureComponent } from 'react';
import _ from 'lodash';
import moment from 'moment';
import I18n from 'react-native-i18n';
import { moduleList } from '@/common/Consts';
import { getNowFormatDate, getVersionId, getHHmmFormat, getYYYYMMDDFormat } from '@/common/Functions';
import DatePicker, { datePickerType } from '@/common/components/DatePicker';
import { pickerDate, pickerStart, pickerEnd } from '../constants';

export default class PickerTimeOther extends PureComponent {

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
    const { EndTime } = getOverTimePreSetInfoTemp;
    // 显示加班的日期
    const { dateRefresh } = this.props;
    dateRefresh(getYYYYMMDDFormat(this.selectDate));
    // 处理加班的开始时间
    if (_.isEmpty(EndTime)) {
      this.selectStart = '00:00';
    } else {
      this.selectStart = EndTime;
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

  onCalucalteTime(startTime, endTime) {
    // 计算日期
    const dateTemp = this.selectDate.split('-');
    const yearTemp = parseInt(dateTemp[0]);
    const monthTemp = parseInt(dateTemp[1]);
    const daySTemp = parseInt(dateTemp[2]);
    // 计算时间
    const startTimeTemp = startTime.split(':');
    const startTimeHTemp = parseInt(startTimeTemp[0]);
    const startTimeMTemp = parseInt(startTimeTemp[1]);
    const endTimeTemp = endTime.split(':');
    const endTimeHTemp = parseInt(endTimeTemp[0]);
    const endTimeMTemp = parseInt(endTimeTemp[1]);
    // 得到时间
    const firstTime = moment(
      new Date(yearTemp, monthTemp, daySTemp, startTimeHTemp, startTimeMTemp),
    );
    let secondTime = moment(new Date(yearTemp, monthTemp, daySTemp, endTimeHTemp, endTimeMTemp));
    // 比较大小
    if (startTimeHTemp > endTimeHTemp) {
      secondTime = moment(secondTime).add(1, 'day');
    }
    if (startTimeHTemp == endTimeHTemp) {
      if (startTimeMTemp > endTimeMTemp) {
        secondTime = moment(secondTime).add(1, 'day');
      }
    }
    return parseFloat(parseInt(secondTime.diff(firstTime, 'minutes')) / 60).toFixed(2);
  }

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
                const { totalHourRefresh } = this.props;
                const timediff = this.onCalucalteTime(this.selectStart, this.selectEnd);
                this.totalHoursTemp = timediff;
                totalHourRefresh(`${timediff}`);
              }
              break;
            case pickerEnd:
              // 加载选择框结束时间
              this.selectEnd = pickedValue;
              this.selectEndTemp = pickedValue;
              this.props.endRefresh(getHHmmFormat(pickedValue));
              this.totalHoursTemp = this.onCalucalteTime(this.selectStart, this.selectEnd);
              this.props.totalHourRefresh(`${this.totalHoursTemp}`);
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
