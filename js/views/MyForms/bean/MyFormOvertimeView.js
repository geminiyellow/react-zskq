/**
 * 我的表单加班行布局
 */
import { TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import I18n from 'react-native-i18n';
import Line from '@/common/components/Line';
import Text from '@/common/components/TextField';
import { companyCodeList, moduleList } from '@/common/Consts';
import { getVersionId } from '@/common/Functions';
import _ from 'lodash';
import { device } from '@/common/Util';
import Constance from './../Constance';
import MyFormHelper from './../MyFormHelper';
import FormItemStyle from '../FormItemStyle';
import FormDetailUi from './../FormDetailUi';
import { getYYYYMMDDhhmmFormat } from '@/common/Functions';

const myFormHelper = new MyFormHelper();

export default class MyFormOvertimenView extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      currentDetail: null,
      Description: '',
    };
  }
  componentWillMount() {
    this.companyCode = getVersionId(global.companyResponseData.version, moduleList.overtime);
    const types = myFormHelper.getTypes();
    let description = '';
    if (!_.isEmpty(types)) {
      types.map(item => {
        if (item.Type == Constance.FORMTYPE_PROCESSOVERTIMEFORM) {
          description = `${item.Description}`;
        }
      });
    }
    this.setState({
      currentDetail: this.props.detail,
      Description: description,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.detail) {
      this.setState({
        currentDetail: nextProps.detail,
      });
    }
  }

  ItemClick = () => {
    let iscacelVisibleTemp = true;
    if (this.state.currentDetail.formType == Constance.FORMTYPE_PROCESSTRANSFERSHIFTFORM || this.state.currentDetail.formType == Constance.FORMTYPE_PROCESSDEMANDPOOLFORM) iscacelVisibleTemp = false;

    this.props.navigator.push({
      component: FormDetailUi,
      passProps: {
        data: this.state.currentDetail,
        bottomMenuVisible: false,
        iscacelVisible: iscacelVisibleTemp,
        fromVerify: false,
      },
    });
  }

  //加班原因的显示与隐藏
  getovertime() {
    if (companyCodeList.estee == this.companyCode) return null;
    if (companyCodeList.gant == this.companyCode) {
      return (
        <View style={FormItemStyle.itemStyle}>
          <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.reasondetail')}: </Text>
          <Text numberOfLines={1} lineBreakMode="tail" style={FormItemStyle.rowContentValueStyle}>{`${this.state.currentDetail.formDetail.ReasonDetail}`}</Text>
        </View>
      );
    }
    return (
      <View style={FormItemStyle.itemStyle}>
        <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.myform.overtime.reason')}: </Text>
        <Text numberOfLines={1} lineBreakMode="tail" style={FormItemStyle.rowContentValueStyle}>{`${this.state.currentDetail.formDetail.Reason}`}</Text>
      </View>
    );
  }

  render() {
    const leftbackgroundcolor = Constance.getStatusColor(this.state.currentDetail.formDetail.ApproveState);
    const startData = getYYYYMMDDhhmmFormat(`${this.state.currentDetail.formDetail.ActualStartDate} ${this.state.currentDetail.formDetail.StartTime}`);
    const endData = getYYYYMMDDhhmmFormat(`${this.state.currentDetail.formDetail.ActualEndDate} ${this.state.currentDetail.formDetail.EndTime}`);
    let showType = true;
    if (!_.isEmpty(global.loginResponseData) && !_.isEmpty(global.loginResponseData.SysParaInfo)) {
      const type = global.loginResponseData.SysParaInfo.IsShowOTType;
      if (_.parseInt(type) == 1) showType = true;
      else showType = false;
    }
    let titleStr = ' - ';
    if (showType) titleStr = titleStr + this.state.currentDetail.formDetail.OverTimeName;
    else titleStr = titleStr + this.state.Description;
    return (
      <TouchableOpacity style={FormItemStyle.rowStyle} onPress={() => this.ItemClick()}>
        <View style={{ borderTopLeftRadius: 2, borderBottomLeftRadius: 2, backgroundColor: leftbackgroundcolor, width: 5 }} />
        <View style={FormItemStyle.columnStyle}>
          <View style={FormItemStyle.rowTitleStyle}>
            <Text numberOfLines={1} lineBreakMode="tail" style={FormItemStyle.rowTitleTextStyle}>{this.state.Description}{titleStr}</Text>
            <Text style={FormItemStyle.statusStyle}>{Constance.getStatusName(this.state.currentDetail.formDetail.ApproveState)}</Text>
          </View>
          <Line style={{ height: device.hairlineWidth, width: device.width - 30 }} />
          <View style={FormItemStyle.rowContentStyle}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.starttime')}: </Text>
              <Text numberOfLines={1} style={FormItemStyle.rowContentValueStyle}>{startData}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.endtime')}: </Text>
              <Text numberOfLines={1} style={FormItemStyle.rowContentValueStyle}>{endData}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.myform.overtime.hours')}: </Text>
              <Text numberOfLines={1} style={FormItemStyle.rowContentValueStyle}>{this.state.currentDetail.formDetail.TotalHours}</Text>
            </View>
            {this.getovertime()}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}