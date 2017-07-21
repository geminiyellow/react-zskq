/**
 * 我的表单异常行布局
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
import FormDetailUi from './../FormDetailUi';
import FormItemStyle from '../FormItemStyle';
import MyFormHelper from './../MyFormHelper';
import { getYYYYMMDDFormat } from '@/common/Functions';

const myFormHelper = new MyFormHelper();

export default class MyFormExceptionView extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      currentDetail: null,
      Description: '',
    };
  }
  componentWillMount() {
    this.companyCode = getVersionId(global.companyResponseData.version, moduleList.checkinSummary);
    const types = myFormHelper.getTypes();
    let description = '';
    if (!_.isEmpty(types)) {
      types.map(item => {
        if (item.Type == Constance.FORMTYPE_ExceptionHandlingprocess) {
          description = `${item.Description} - `;
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

  getDesView() {
    if (companyCodeList.estee == this.companyCode || companyCodeList.gant == this.companyCode) {
      return (
        <View style={FormItemStyle.itemStyle}>
          <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.reasondetail')}: </Text>
          <Text numberOfLines={1} lineBreakMode="tail" style={FormItemStyle.rowContentValueStyle}>{`${this.state.currentDetail.formDetail.Reason}`}</Text>
        </View>
      );
    } else {
      return (
        <View style={FormItemStyle.itemStyle}>
          <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.leave.appealreason')}: </Text>
          <Text numberOfLines={1} lineBreakMode="tail" style={FormItemStyle.rowContentValueStyle}>{`${this.state.currentDetail.formDetail.Reason}`}</Text>
        </View>
      );
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

  render() {
    const leftbackgroundcolor = Constance.getStatusColor(this.state.currentDetail.formDetail.ApproveState);
    const startData = getYYYYMMDDFormat(this.state.currentDetail.formDetail.ExceptionDate);
    if (_.parseInt(this.state.currentDetail.formDetail.ItemCounts) > 1) {
      return (
      <TouchableOpacity style={FormItemStyle.rowStyle} onPress={() => this.ItemClick()}>
        <View style={{ borderTopLeftRadius: 2, borderBottomLeftRadius: 2, backgroundColor: leftbackgroundcolor, width: 5 }} />
        <View style={FormItemStyle.columnStyle}>
          <View style={FormItemStyle.rowTitleStyle}>
            <Text numberOfLines={1} lineBreakMode="tail" style={FormItemStyle.rowTitleTextStyle}>{this.state.Description}{I18n.t('mobile.module.verify.batchexception')}</Text>
            <Text style={FormItemStyle.statusStyle}>{Constance.getStatusName(this.state.currentDetail.formDetail.ApproveState)}</Text>
          </View>
          <Line style={{ height: device.hairlineWidth, width: device.width - 30 }} />
          <View style={FormItemStyle.rowContentStyle}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.myform.state.happentime')}: </Text>
              <Text style={FormItemStyle.rowContentValueStyle}>{startData}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.batchcount')}</Text>
              <Text numberOfLines={3} style={FormItemStyle.rowContentValueStyle}>{`${this.state.currentDetail.formDetail.ItemCounts}`}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity style={FormItemStyle.rowStyle} onPress={() => this.ItemClick()}>
        <View style={{ borderTopLeftRadius: 2, borderBottomLeftRadius: 2, backgroundColor: leftbackgroundcolor, width: 5 }} />
        <View style={FormItemStyle.columnStyle}>
          <View style={FormItemStyle.rowTitleStyle}>
            <Text numberOfLines={1} lineBreakMode="tail" style={FormItemStyle.rowTitleTextStyle}>{this.state.Description}{this.state.currentDetail.formDetail.ExceptionName}</Text>
            <Text style={FormItemStyle.statusStyle}>{Constance.getStatusName(this.state.currentDetail.formDetail.ApproveState)}</Text>
          </View>
          <Line style={{ height: device.hairlineWidth, width: device.width - 30 }} />
          <View style={FormItemStyle.rowContentStyle}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.myform.state.happentime')}: </Text>
              <Text numberOfLines={1} style={FormItemStyle.rowContentValueStyle}>{startData}</Text>
            </View>
            {this.getDesView()}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}