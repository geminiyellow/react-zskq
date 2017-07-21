/**
 * 加班行布局
 */
import { DeviceEventEmitter, TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import { device, keys } from '@/common/Util';
import Image from '@/common/components/CustomImage';
import I18n from 'react-native-i18n';
import Line from '@/common/components/Line';
import _ from 'lodash';
import Text from '@/common/components/TextField';
import { messageType, companyCodeList, moduleList } from '@/common/Consts';
import { getVersionId } from '@/common/Functions';
import FormDetailUi from './../MyForms/FormDetailUi';
import FormItemStyle from '../MyForms/FormItemStyle';
import MyFormHelper from '../MyForms/MyFormHelper';
import Constance from '../MyForms/Constance';
import { getYYYYMMDDhhmmFormat } from '@/common/Functions';

const myFormHelper = new MyFormHelper();
const checkboxNormal = 'checkbox_common';
const checkboxChecked = 'checkbox_selected';

// 撤销是否可见
let cacelVisible = true;

// 底部操作是否可见
let bottomMeneVisible = true;

export default class OverTimeView extends PureComponent {
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
        if (item.Type == Constance.FORMTYPE_PROCESSOVERTIMEFORM) {
          description = `${item.Description}`;
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

  getReasonView() {
    if (companyCodeList.estee == this.companyCode) return null;
    if (companyCodeList.gant == this.companyCode) {
      return (
        <View style={FormItemStyle.itemStyle}>
          <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.reasondetail')}: </Text>
          <Text numberOfLines={1} lineBreakMode="tail" style={FormItemStyle.rowContentValueStyle}>{`${this.state.rowData.formDetail.ReasonDetail}`}</Text>
        </View>
      );
    }
    return (
      <View style={FormItemStyle.itemStyle}>
        <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.myform.overtime.reason')}: </Text>
        <Text numberOfLines={1} lineBreakMode="tail" style={FormItemStyle.rowContentValueStyle}>{`${this.state.rowData.formDetail.Reason}`}</Text>
      </View>
    );
  }

  pressRadio = () => {
    const result = this.state.rowData;
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

  render() {
    let empName = this.state.rowData.formDetail.EmpName;
    if (myFormHelper.getLanguage() == 0) {
      empName = _.isEmpty(this.state.rowData.formDetail.EmpName) ? this.state.rowData.formDetail.EnglishName : this.state.rowData.formDetail.EmpName;
    } else {
      empName = _.isEmpty(this.state.rowData.formDetail.EnglishName) ? this.state.rowData.formDetail.EmpName : this.state.rowData.formDetail.EnglishName;
    }
    let showType = true;
    if (!_.isEmpty(global.loginResponseData) && !_.isEmpty(global.loginResponseData.SysParaInfo)) {
      const type = global.loginResponseData.SysParaInfo.IsShowOTType;
      if (_.parseInt(type) == 1) showType = true;
      else showType = false;
    }
    const leftbackgroundcolor = Constance.getStatusColor(this.state.rowData.formDetail.ApproveState);
    const startData = getYYYYMMDDhhmmFormat(`${this.state.rowData.formDetail.ActualStartDate} ${this.state.rowData.formDetail.StartTime}`);
    const endData = getYYYYMMDDhhmmFormat(`${this.state.rowData.formDetail.ActualEndDate} ${this.state.rowData.formDetail.EndTime}`);
    // 加班类型根据配置显示
    let titleStr = ' - ';
    if (showType) titleStr = titleStr + this.state.rowData.formDetail.OverTimeName;
    else titleStr = titleStr + this.state.Description;
    return (
      <TouchableOpacity style={FormItemStyle.rowStyle} onPress={() => this.ItemClick()}>
        <View style={{ borderTopLeftRadius: 2, borderBottomLeftRadius: 2, backgroundColor: leftbackgroundcolor, width: 5 }} />
        <View style={FormItemStyle.columnStyle}>
          <View style={FormItemStyle.rowTitleStyle}>
            {this.getRadioView()}
            <Text numberOfLines={1} lineBreakMode="tail" style={FormItemStyle.rowTitleTextStyle}>{this.state.Description}{titleStr}</Text>
            <Text style={FormItemStyle.statusStyle}>{Constance.getStatusName(this.state.rowData.formDetail.ApproveState)}</Text>
          </View>
          <Line style={{ height: device.hairlineWidth, width: device.width - 30 }} />
          <View style={FormItemStyle.rowContentStyle}>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.applyname')}: </Text>
              <Text numberOfLines={1} style={FormItemStyle.rowContentValueStyle}>{empName}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.starttime')}: </Text>
              <Text style={FormItemStyle.rowContentValueStyle}>{startData}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.endtime')}: </Text>
              <Text style={FormItemStyle.rowContentValueStyle}>{endData}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.myform.overtime.hours')}: </Text>
              <Text style={FormItemStyle.rowContentValueStyle}>{this.state.rowData.formDetail.TotalHours}</Text>
            </View>
            {this.getReasonView()}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
