/**
 * 异常行布局
 */
import { DeviceEventEmitter, TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import I18n from 'react-native-i18n';
import Image from '@/common/components/CustomImage';
import _ from 'lodash';
import { device } from '@/common/Util';
import { messageType, companyCodeList, moduleList } from '@/common/Consts';
import { getVersionId } from '@/common/Functions';
import Text from '@/common/components/TextField';
import FormItemStyle from '../MyForms/FormItemStyle';
import FormDetailUi from './../MyForms/FormDetailUi';
import Constance from './../MyForms/Constance';
import Line from '../../common/components/Line';
import MyFormHelper from '../MyForms/MyFormHelper';
import { getYYYYMMDDFormat } from '@/common/Functions';

const myFormHelper = new MyFormHelper();
const checkboxNormal = 'checkbox_common';
const checkboxChecked = 'checkbox_selected';
// 撤销是否可见
let cacelVisible = true;

// 底部操作是否可见
let bottomMeneVisible = true;

export default class ExceptionView extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      checked: false,
      Description: '',
    };
  }

  componentWillMount() {
    this.companyCode = getVersionId(global.companyResponseData.version, moduleList.checkinSummary);
    const { data, ischecked } = this.props;
    bottomMeneVisible = this.props.bottomMeneVisible;
    cacelVisible = this.props.cacelVisible;
    if (typeof (bottomMeneVisible) == 'undefined') {
      bottomMeneVisible = true;
    }
    if (typeof (cacelVisible) == 'undefined') {
      cacelVisible = true;
    }
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
      bottomMenuVisible: bottomMeneVisible,
      iscacelVisible: cacelVisible,
      rowData: data,
      checked: ischecked,
      showRaido: false,
      Description: description,
    });
  }

  componentWillReceiveProps(nextProps) {
    let ischecked = false;
    let needshowRaido = false;
    if (nextProps.data) {
      if (nextProps.data.checked) {
        ischecked = true;
      } else {
        ischecked = false;
      }

      if (nextProps.data.showRaido) {
        needshowRaido = true;
      } else {
        needshowRaido = false;
      }
    }
    this.setState({
      checked: ischecked,
      showRaido: needshowRaido,
    });
  }

  getRadioView() {
    if (this.state.showRaido) {
      return (
        <TouchableOpacity onPress={this.pressRadio}>
          <Image style={{ width: 18, height: 18, marginLeft: 15 }} source={{ uri: this.state.checked ? checkboxChecked : checkboxNormal }} />
        </TouchableOpacity>
      );
    }
    return null;
  }

  pressRadio = () => {
    let result = this.state.rowData;
    if (this.state.checked) {
      result.checked = false;
    } else {
      result.checked = true;
    }
    // 通知父容器刷新界面 和 底部的全选菜单
    DeviceEventEmitter.emit('changeSelect', result);

    this.setState({
      checked: !this.state.checked,
    });
  }

  ItemClick = () => {
    if (this.state.showRaido) {
      this.pressRadio();
    } else {
      this.props.navigator.push({
        component: FormDetailUi,
        passProps: {
          data: this.state.rowData,
          bottomMenuVisible: this.state.bottomMenuVisible,
          iscacelVisible: this.state.iscacelVisible,
        },
      });
    }
  }

  getUnSplitView() {
    if (myFormHelper.getLanguage() == 0) {
      empName = _.isEmpty(this.state.rowData.formDetail.EmpName) ? this.state.rowData.formDetail.EnglishName : this.state.rowData.formDetail.EmpName;
    } else {
      empName = _.isEmpty(this.state.rowData.formDetail.EnglishName) ? this.state.rowData.formDetail.EmpName : this.state.rowData.formDetail.EnglishName;
    }
    const leftbackgroundcolor = Constance.getStatusColor(this.state.rowData.formDetail.ApproveState);
    const startData = getYYYYMMDDFormat(this.state.rowData.formDetail.ExceptionDate);
    
    return (
      <TouchableOpacity style={FormItemStyle.rowStyle} onPress={() => this.ItemClick()}>
        <View style={{ borderTopLeftRadius: 2, borderBottomLeftRadius: 2, backgroundColor: leftbackgroundcolor, width: 5 }} />
        <View style={FormItemStyle.columnStyle}>
          <View style={FormItemStyle.rowTitleStyle}>
            {this.getRadioView()}
            <Text numberOfLines={1} lineBreakMode="tail" style={FormItemStyle.rowTitleTextStyle}>{this.state.Description}{I18n.t('mobile.module.verify.batchexception')}</Text>
            <Text style={FormItemStyle.statusStyle}>{Constance.getStatusName(this.state.rowData.formDetail.ApproveState)}</Text>
          </View>
          <Line style={{ height: device.hairlineWidth, width: device.width - 30 }} />
          <View style={FormItemStyle.rowContentStyle}>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.applyname')}: </Text>
              <Text numberOfLines={1} style={FormItemStyle.rowContentValueStyle}>{empName}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.myform.state.happentime')}: </Text>
              <Text style={FormItemStyle.rowContentValueStyle}>{startData}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.batchcount')}</Text>
              <Text numberOfLines={3} style={FormItemStyle.rowContentValueStyle}>{`${this.state.rowData.formDetail.ItemCounts}`}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  getSplitView() {
    if (myFormHelper.getLanguage() == 0) {
      empName = _.isEmpty(this.state.rowData.formDetail.EmpName) ? this.state.rowData.formDetail.EnglishName : this.state.rowData.formDetail.EmpName;
    } else {
      empName = _.isEmpty(this.state.rowData.formDetail.EnglishName) ? this.state.rowData.formDetail.EmpName : this.state.rowData.formDetail.EnglishName;
    }
    const leftbackgroundcolor = Constance.getStatusColor(this.state.rowData.formDetail.ApproveState);
    const startData = getYYYYMMDDFormat(this.state.rowData.formDetail.ExceptionDate);

    return (
      <TouchableOpacity style={FormItemStyle.rowStyle} onPress={() => this.ItemClick()}>
        <View style={{ borderTopLeftRadius: 2, borderBottomLeftRadius: 2, backgroundColor: leftbackgroundcolor, width: 5 }} />
        <View style={FormItemStyle.columnStyle}>
          <View style={FormItemStyle.rowTitleStyle}>
            {this.getRadioView()}
            <Text numberOfLines={1} lineBreakMode="tail" style={FormItemStyle.rowTitleTextStyle}>{this.state.Description}{this.state.rowData.formDetail.ExceptionName}</Text>
            <Text style={FormItemStyle.statusStyle}>{Constance.getStatusName(this.state.rowData.formDetail.ApproveState)}</Text>
          </View>
          <Line style={{ height: device.hairlineWidth, width: device.width - 30 }} />
          <View style={FormItemStyle.rowContentStyle}>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.applyname')}: </Text>
              <Text numberOfLines={1} style={FormItemStyle.rowContentValueStyle}>{empName}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.myform.state.happentime')}: </Text>
              <Text style={FormItemStyle.rowContentValueStyle}>{startData}</Text>
            </View>
            {
              (companyCodeList.estee == this.companyCode || companyCodeList.gant == this.companyCode) ?
                (
                  <View style={FormItemStyle.itemStyle}>
                    <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.reasondetail')}: </Text>
                    <Text numberOfLines={1} lineBreakMode="tail" style={FormItemStyle.rowContentValueStyle}>{`${this.state.rowData.formDetail.Reason}`}</Text>
                  </View>
                ) :
                (
                  <View style={FormItemStyle.itemStyle}>
                    <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.leave.appealreason')}: </Text>
                    <Text numberOfLines={1} lineBreakMode="tail" style={FormItemStyle.rowContentValueStyle}>{`${this.state.rowData.formDetail.Reason}`}</Text>
                  </View>
                )
            }
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    if (_.parseInt(this.state.rowData.formDetail.ItemCounts) > 1) return this.getUnSplitView();
    return this.getSplitView();
  }
}