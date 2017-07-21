/**
 * 异常详情布局
 */
import { Clipboard, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { device, keys } from '@/common/Util';
import { messageType, companyCodeList, moduleList } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import { getCurrentLanguage, getVersionId } from '@/common/Functions';
import Line from '@/common/components/Line';
import I18n from 'react-native-i18n';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
import { languages } from '@/common/LanguageSettingData';
import ApproveView from './ApproveFlowView';
import ExceptionExtendView from './ExceptionExtendView';
import Constance from '../Constance';
import FormDetailStyle from '../FormDetailStyle';
import AttachView from './AttachView';
import MyFormHelper from '../MyFormHelper';
import { getYYYYMMDDFormat, getHHmmFormat } from '@/common/Functions';

let currentDetail = null;
let index = 0;
const myFormHelper = new MyFormHelper();

export default class ExceptionDetailView extends PureComponent {
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
    currentDetail = this.props.detail;
    this.companyCode = getVersionId(global.companyResponseData.version, moduleList.checkinSummary);
    // if (versionData) {
    //   for (let i = 0; i < versionData.length; i += 1) {
    //     if (versionData[i].moduleCode == moduleList.checkinSummary) {
    //       this.companyCode = versionData[i].companyCode;
    //     }
    //   }
    // } else {
    //   this.companyCode = companyCodeList.standard;
    // }
  }

  getModifiedPunchTimeView = (Item) => {
    const should = getHHmmFormat(Item.ModifiedPunchTime);

    if (companyCodeList.estee == this.companyCode || companyCodeList.gant == this.companyCode) return null;
    if (Item.ModifiedPunchTime && !_.isEmpty(Item.ModifiedPunchTime)) {
      return (
        <View>
          <View style={FormDetailStyle.rowTagStyle}>
            <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.modifypunchtime')}</Text>
            <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{should}</Text>
          </View>
          <Line style={FormDetailStyle.lineStyle} />
        </View>
      );
    }
    return null;
  }
  /**
   * 返回带附件的异常项
  */
  getHasAttachmentsItemView(Item) {
    return (
      <View key={`exception-${index++}`}>
        <ExceptionExtendView style={{ paddingLeft: 12, paddingRight: 12 }} item={Item} detail={currentDetail} navigator={this.props.navigator} />
        <AttachView style={{ paddingLeft: 12, paddingRight: 12 }} detail={currentDetail} navigator={this.props.navigator} />
      </View>
    );
  }

  /**
   * 返回不带附件的异常项
  */
  getNotHasAttachmentsItemView(Item) {
    return (
      <ExceptionExtendView style={{ paddingLeft: 12, paddingRight: 12 }} key={`exception-${index++}`} item={Item} navigator={this.props.navigator} />
    );
  }

  getVerifyDetail() {
    if (companyCodeList.estee == this.companyCode || companyCodeList.gant == this.companyCode) return null;
    return (
      <View>
        <View style={FormDetailStyle.rowTagStyle}>
          <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.leave.appealreason')}</Text>
          <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{currentDetail.formDetail.data[0].Reason}</Text>
        </View>
        <Line style={FormDetailStyle.lineStyle} />
      </View>
    );
  }
  getVerifyDetailReason() {
    if (companyCodeList.estee == this.companyCode || companyCodeList.gant == this.companyCode) {
      return (
        <View>
          <View style={FormDetailStyle.rowTagStyle}>
            <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.reasondetail')}</Text>
            <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{currentDetail.formDetail.data[0].Reason}</Text>
          </View>
          <Line style={FormDetailStyle.lineStyle} />
        </View>
      );
    } else if (companyCodeList.samsung == this.companyCode) {
      return null;
    } else {
      return (
        <View>
          <View style={FormDetailStyle.rowTagStyle}>
            <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.reasondetail')}</Text>
            <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{currentDetail.formDetail.data[0].ReasonDetail}</Text>
          </View>
          <Line style={FormDetailStyle.lineStyle} />
        </View>
      );
    }
  }


  getExceptionItemViews() {
    const views = [];
    const length = currentDetail.formDetail.data.length;
    const happen = getYYYYMMDDFormat(currentDetail.formDetail.data[0].ExceptionDate);
    const change = getHHmmFormat(currentDetail.formDetail.data[0].ActualPunchTime);
    const should = getHHmmFormat(currentDetail.formDetail.data[0].PlanPunchTime);

    if (length > 1) {
      for (let i = 0; i < length; i++) {
        if (i == length - 1) {
          views.push(this.getHasAttachmentsItemView(currentDetail.formDetail.data[i]));
        } else {
          views.push(this.getNotHasAttachmentsItemView(currentDetail.formDetail.data[i]));
        }
      }
    } else {
      views.push(
        <View key={`exception-${index++}`} style={FormDetailStyle.formdetailsStyle}>
          <View style={{ backgroundColor: 'white', paddingLeft: 12, paddingRight: 12 }}>
            <View style={FormDetailStyle.rowTagStyle}>
              <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.myform.state.happentime')}</Text>
              <Text allowFontScaling={false} numberOfLines={1} style={FormDetailStyle.rowContentValueStyle}>{happen}</Text>
            </View>
            <Line style={FormDetailStyle.lineStyle} />
            <View style={FormDetailStyle.rowTagStyle}>
              <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.exception.checkintime')}</Text>
              <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{`${_.isEmpty(currentDetail.formDetail.data[0].ActualPunchTime) ? `${I18n.t('mobile.module.verify.exception.nocheckin')}` : change}`}</Text>
            </View>
            <Line style={FormDetailStyle.lineStyle} />
            <View style={FormDetailStyle.rowTagStyle}>
              <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.exception.shouldpunchclock')}</Text>
              <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{should}</Text>
            </View>
            <Line style={FormDetailStyle.lineStyle} />
            {this.getModifiedPunchTimeView(currentDetail.formDetail.data[0])}
            {this.getVerifyDetail()}
            {this.getVerifyDetailReason()}
          </View>
          <AttachView style={{ paddingLeft: 12, paddingRight: 12 }} detail={currentDetail} navigator={this.props.navigator} />
        </View>
      );
    }
    return [...views];
  }

  copyID = async () => {
    Clipboard.setString(currentDetail.formDetail.FormNumber);
    showMessage(messageType.success, I18n.t('mobile.module.detail.msg.copysuccess'));
  }

  getHeadViews() {
    const statuscolor = Constance.getStatusColor(currentDetail.formDetail.ApproveState);
    let empName = currentDetail.formDetail.EmpName;
    if (myFormHelper.getLanguage() == 0) {
      empName = _.isEmpty(currentDetail.formDetail.data[0].EmpName) ? currentDetail.formDetail.data[0].EnglishName : currentDetail.formDetail.data[0].EmpName;
    } else {
      empName = _.isEmpty(currentDetail.formDetail.data[0].EnglishName) ? currentDetail.formDetail.data[0].EmpName : currentDetail.formDetail.data[0].EnglishName;
    }
    ExceptionType = currentDetail.formDetail.data[0].ExceptionType;
    const exceptionDate = currentDetail.formDetail.data[0].ExceptionDate;
    if (!_.isEmpty(exceptionDate)) {
      date = _.split(exceptionDate, '-');
    }
    const length = currentDetail.formDetail.data.length;
    const Data = getYYYYMMDDFormat(currentDetail.formDetail.data[0].ApplyDate);
    if (length > 1) {
      return (
        <View style={FormDetailStyle.rowStyle}>
          <View style={FormDetailStyle.formheadStyle}>
            <Text allowFontScaling={false} numberOfLines={1} style={{ flex: 1, textAlign: 'left', fontSize: 18, color: '#333' }}>{`${empName} ${I18n.t('mobile.module.verify.batchexception')}`}</Text>
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
        </View>
      );
    }
    return (
      <View style={FormDetailStyle.rowStyle}>
        <View style={FormDetailStyle.formheadStyle}>
          <Text allowFontScaling={false} numberOfLines={1} style={{ flex: 1, textAlign: 'left', fontSize: 18, color: '#333' }}>{currentDetail.formDetail.data[0].ExceptionName}</Text>
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
      </View>
    );
  }

  render() {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={FormDetailStyle.container}>
          <View style={FormDetailStyle.rowStyle}>
            {this.getHeadViews()}
            <Text style={{ paddingTop: 22, paddingBottom: 10, paddingLeft: 12, fontSize: 14, color: '#666' }}>{I18n.t('mobile.module.myform.detail')}</Text>
            {this.getExceptionItemViews()}
          </View>
          <View style={{ flexDirection: 'column', backgroundColor: '#EDEDF3', paddingBottom: 20 }}>
            <ApproveView detail={currentDetail.ApprovalInfoList} />
          </View>
        </View>
      </ScrollView>
    );
  }
}
