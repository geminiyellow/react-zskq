/**
 * 加班详情布局
 */
import { Clipboard, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { device, keys } from '@/common/Util';
import { messageType, companyCodeList, moduleList } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import Line from '@/common/components/Line';
import I18n from 'react-native-i18n';
import { getCurrentLanguage, getVersionId } from '@/common/Functions';
import { languages } from '@/common/LanguageSettingData';
import ApproveView from './ApproveFlowView';
import FormDetailStyle from '../FormDetailStyle';
import Constance from '../Constance';
import AttachView from './AttachView';
import MyFormHelper from '../MyFormHelper';
import { getYYYYMMDDFormat, getYYYYMMDDhhmmFormat, getHHmmFormat } from '@/common/Functions';

const myFormHelper = new MyFormHelper();
let currentDetail = null;
// 是否转调休可见
let CompTimeIsVisable = false;
// 用餐时数是否可见
let mealHoursIsVisable = false;
// 餐别列表
let MealTypeList = [];

// 是否显示餐别
let MealTypeVisible = false;

// 是否允许转调休 1: 允许   0： 不允许
let IsCompTime = 1;

let description = '';

export default class OverTimeDetailView extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      language: 0,
    };
    getCurrentLanguage().then(data => {
      const k = languages.indexOf(data);
      if (k == 0) {
        this.setState({
          language: 0,
        });
      } else {
        this.setState({
          language: 1,
        });
      }
    });
  }

  componentWillMount() {
    const types = myFormHelper.getTypes();
    this.companyCode = getVersionId(global.companyResponseData.version, moduleList.overtime);

    if (!_.isEmpty(types)) {
      types.map(item => {
        if (item.Type == Constance.FORMTYPE_PROCESSOVERTIMEFORM) {
          description = item.Description;
        }
      });
    }

    currentDetail = this.props.detail;
    if (currentDetail.formDetail && currentDetail.formDetail.OTSubInfo) {
      CompTimeIsVisable = currentDetail.formDetail.OTSubInfo.CompTimeIsVisable;
      mealHoursIsVisable = currentDetail.formDetail.OTSubInfo.MealHoursIsVisable;
      IsAllowedToModifyCompTime = currentDetail.formDetail.OTSubInfo.IsAllowedToModifyCompTime;
      IsCompTime = currentDetail.formDetail.OTSubInfo.IsCompTime;
      MealTypeVisible = currentDetail.formDetail.OTSubInfo.MealTypeVisible;
      let templist = [];
      if (currentDetail.formDetail.OTSubInfo.MealTypeList && !_.isEmpty(currentDetail.formDetail.OTSubInfo.MealTypeList)) templist = currentDetail.formDetail.OTSubInfo.MealTypeList;
      MealTypeList = [...templist];
    }
  }

  // 获取加班类型 审批布局
  getOverTimeView() {
    if (isOvertimeType) {
      return (
        <View style={{ flexGrow: 2 }}>
          {this.getCompTimeView()}
        </View>
      );
    }
    return null;
  }

  // 获取餐别布局
  getMealTypeView() {
    if (MealTypeVisible) {
      const views = this.getMealTypeListView();
      if (views.length > 0) {
        return (
          <View>
            <View style={FormDetailStyle.rowTagStyle}>
              <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.overtime.meallist')}</Text>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                {[...views]}
              </View>
            </View>
            <Line style={FormDetailStyle.lineStyle} />
          </View>
        );
      }
      return null;
    }
    return null;
  }

  getMealTypeListView() {
    const canbies = [];

    let i = 0;
    for (item of MealTypeList) {
      const startData = getHHmmFormat(item.MealTimeFrom);
      const endData = getHHmmFormat(item.MealTimeTo);
      if (item.IsChecked) {
        canbies.push(
          <Text key={i++} allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{`${item.MealName}: ${startData} -${endData}`}</Text>
        );
      }
    }
    return canbies;
  }

  // 获取转调休布局
  getCompTimeView() {
    if (CompTimeIsVisable) {
      return (
        <View>
          <View style={FormDetailStyle.rowTagStyle}>
            <Text allowFontScaling={false} numberOfLines={2} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.overtime.comptime')}</Text>
            <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{`${IsCompTime == 1 ? I18n.t('mobile.module.verify.overtime.comptime.yes') : I18n.t('mobile.module.verify.overtime.comptime.no')}`}</Text>
          </View>
          <Line style={FormDetailStyle.lineStyle} />
        </View>
      );
    }
    return null;
  }

  getOTHours() {
    if (companyCodeList.standard == this.companyCode) {
      return (
        <View>
          <View >
            <Text allowFontScaling={false} style={{ paddingTop: 22, paddingBottom: 10, paddingLeft: 12, fontSize: 14, color: '#666' }}>{I18n.t('mobile.module.myform.detail.othours')}</Text>
          </View>
          <View style={FormDetailStyle.formdetailsStyle2}>
            <View style={{ paddingLeft: 12, paddingRight: 12 }}>
              <View style={FormDetailStyle.rowTagStyle}>
                <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.myform.detail.appliedhours')}</Text>
                <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{currentDetail.formDetail.AppliedOTHours}{I18n.t('mobile.module.verify.hour')}</Text>
              </View>
            </View>
          </View>
        </View>
      );
    } else { return null; }
  }

  // 加班原因的显示与隐藏
  getovertime() {
    if (companyCodeList.estee == this.companyCode || companyCodeList.gant == this.companyCode) return null;
    return (
      <View>
        <View style={FormDetailStyle.rowTagStyle}>
          <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitle1Style}>{I18n.t('mobile.module.myform.overtime.reason')}</Text>
          <Text allowFontScaling={false} numberOfLines={1} style={FormDetailStyle.rowContentValueTextStyle}>{currentDetail.formDetail.Reason}</Text>
        </View>
        <Line style={FormDetailStyle.lineStyle} />
      </View>
    );
  }

  getMealHoursView() {
    if (mealHoursIsVisable) {
      return (
        <View>
          <View style={FormDetailStyle.rowTagStyle}>
            <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.overtime.overtimeapplymealhour')}</Text>
            <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{`${currentDetail.formDetail.OTSubInfo.MealHours}`}</Text>
          </View>
          <Line style={FormDetailStyle.lineStyle} />
        </View>
      );
    }
    return null;
  }

  copyID = async () => {
    Clipboard.setString(currentDetail.formDetail.FormNumber);
    showMessage(messageType.success, I18n.t('mobile.module.detail.msg.copysuccess'));
  }

  render() {
    const statuscolor = Constance.getStatusColor(currentDetail.formDetail.ApproveState);
    const startData = getYYYYMMDDhhmmFormat(`${currentDetail.formDetail.ActualStartDate} ${currentDetail.formDetail.StartTime}`);
    const endData = getYYYYMMDDhhmmFormat(`${currentDetail.formDetail.ActualEndDate} ${currentDetail.formDetail.EndTime}`);

    const Data = getYYYYMMDDFormat(currentDetail.formDetail.ApplyDate)

    let empName = currentDetail.formDetail.EmpName;
    if (myFormHelper.getLanguage() == 0) {
      empName = _.isEmpty(currentDetail.formDetail.EmpName) ? currentDetail.formDetail.EnglishName : currentDetail.formDetail.EmpName;
    } else {
      empName = _.isEmpty(currentDetail.formDetail.EnglishName) ? currentDetail.formDetail.EmpName : currentDetail.formDetail.EnglishName;
    }
    let showType = true;
    if (!_.isEmpty(global.loginResponseData) && !_.isEmpty(global.loginResponseData.SysParaInfo)) {
      const type = global.loginResponseData.SysParaInfo.IsShowOTType;
      if (_.parseInt(type) == 1) showType = true;
      else showType = false;
    }
    let titleStr = description;
    if (showType) titleStr = currentDetail.formDetail.OverTimeName;
    return (
      <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={FormDetailStyle.container}>
          <View style={FormDetailStyle.rowStyle}>
            <View style={FormDetailStyle.formheadStyle}>
              <Text numberOfLines={1} style={{ flex: 1, textAlign: 'left', fontSize: 18, color: '#333' }}>{titleStr}</Text>
              <View style={FormDetailStyle.statusContainerStyle}>
                <Text numberOfLines={1} allowFontScaling={false} style={[FormDetailStyle.statusStyle, { color: statuscolor }]}>{Constance.getStatusName(currentDetail.formDetail.ApproveState)}</Text>
              </View>
            </View>
            <View style={FormDetailStyle.formoutlineStyle}>
              <View style={{ flexDirection: 'row' }}>
                <Text allowFontScaling={false} numberOfLines={1} style={{ fontSize: 14, color: '#666' }}>{I18n.t('mobile.module.verify.applyname')}: </Text>
                <Text allowFontScaling={false} style={{ fontSize: 14, color: '#666' }}>{empName}</Text>
              </View>
              <TouchableWithoutFeedback onPressIn={this.copyID}>
                <View style={{ flexDirection: 'row', marginTop: 2, alignItems: 'center' }}>
                  <Text allowFontScaling={false} numberOfLines={1} style={{ fontSize: 14, color: '#666' }}>{currentDetail.formDetail.FormNumber}</Text>
                  <Line style={{ marginLeft: 6, marginRight: 6, height: 16, width: 1, backgroundColor: '#666' }} />
                  <Text allowFontScaling={false} style={{ fontSize: 14, color: '#666' }}>{Data}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <Text allowFontScaling={false} style={{ paddingTop: 22, paddingBottom: 10, paddingLeft: 12, fontSize: 14, color: '#666' }}>{I18n.t('mobile.module.myform.detail')}</Text>
            <View style={FormDetailStyle.formdetailsStyle}>
              <View style={{ paddingLeft: 12, paddingRight: 12 }}>
                <View style={FormDetailStyle.rowTagStyle}>
                  <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.starttime')}</Text>
                  <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{startData}</Text>
                </View>
                <Line style={FormDetailStyle.lineStyle} />
                <View style={FormDetailStyle.rowTagStyle}>
                  <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.endtime')}</Text>
                  <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{endData}</Text>
                </View>
                <Line style={FormDetailStyle.lineStyle} />
                {this.getMealHoursView()}

                <View style={FormDetailStyle.rowTagStyle}>
                  <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.myform.overtime.hours')}</Text>
                  <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{`${currentDetail.formDetail.TotalHours}`}</Text>
                </View>
                <Line style={FormDetailStyle.lineStyle} />

                {this.getovertime()}
                {this.getCompTimeView()}

                {this.getMealTypeView()}

                <View style={FormDetailStyle.rowTagStyle}>
                  <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.reasondetail')}</Text>
                  <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{currentDetail.formDetail.ReasonDetail}</Text>
                </View>
                <Line style={FormDetailStyle.lineStyle} />
              </View>
              <AttachView detail={currentDetail} navigator={this.props.navigator} />
            </View>
          </View>
          {this.getOTHours()}
          <View style={{ flexGrow: 1, backgroundColor: '#EDEDF3', paddingBottom: 20 }}>
            <ApproveView detail={currentDetail.formDetail.ApprovalInfoList} />
          </View>
        </View>
      </ScrollView>
    );
  }
}
