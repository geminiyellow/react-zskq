/**
 * 出差行布局
 */
import { DeviceEventEmitter, TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import I18n from 'react-native-i18n';
import Line from '@/common/components/Line';
import _ from 'lodash';
import { device, keys } from '@/common/Util';
import Text from '@/common/components/TextField';
import Image from '@/common/components/CustomImage';
import Constance from '../MyForms/Constance';
import FormDetailUi from './../MyForms/FormDetailUi';
import FormItemStyle from '../MyForms/FormItemStyle';
import MyFormHelper from '../MyForms/MyFormHelper';
import { getYYYYMMDDhhmmFormat } from '@/common/Functions';

const myFormHelper = new MyFormHelper();
const checkboxNormal = 'checkbox_common';
const checkboxChecked = 'checkbox_selected';
// 撤销是否可见
let cacelVisible = true;

// 底部操作是否可见
let bottomMeneVisible = true;
export default class TraveView extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      checked: false,
      Description: '',
    };
  }

  componentWillMount() {
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
        if (item.Type == Constance.FORMTYPE_PROCESSBUSINESSTRAVELFORM) {
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

  render() {
    let empName = null;
    if (myFormHelper.getLanguage() == 0) {
      empName = _.isEmpty(this.state.rowData.formDetail.EmpName) ? this.state.rowData.formDetail.EnglishName : this.state.rowData.formDetail.EmpName;
    } else {
      empName = _.isEmpty(this.state.rowData.formDetail.EnglishName) ? this.state.rowData.formDetail.EmpName : this.state.rowData.formDetail.EnglishName;
    }
    let moneys = '';
    this.state.rowData.formDetail.Money.map(item => {
      moneys += `${item.AmountMoney}${item.MoneyType} + `;
    });
    if (moneys.length > 0) moneys = moneys.substr(0, moneys.length - 3);
    const leftbackgroundcolor = Constance.getStatusColor(this.state.rowData.formDetail.ApproveState);
    const startData = getYYYYMMDDhhmmFormat(`${this.state.rowData.formDetail.StartDate} ${this.state.rowData.formDetail.StartTime}`);
    const endData = getYYYYMMDDhhmmFormat(`${this.state.rowData.formDetail.EndDate} ${this.state.rowData.formDetail.EndTime}`);

    return (
      <TouchableOpacity style={FormItemStyle.rowStyle} onPress={() => this.ItemClick()}>
        <View style={{ borderTopLeftRadius: 2, borderBottomLeftRadius: 2, backgroundColor: leftbackgroundcolor, width: 5 }} />
        <View style={FormItemStyle.columnStyle}>
          <View style={FormItemStyle.rowTitleStyle}>
            {this.getRadioView()}
            <Text allowFontScaling={false} numberOfLines={1} lineBreakMode="tail" style={FormItemStyle.rowTitleTextStyle}>{this.state.Description}{this.state.rowData.formDetail.TravelName}</Text>
            <Text allowFontScaling={false} style={FormItemStyle.statusStyle}>{Constance.getStatusName(this.state.rowData.formDetail.ApproveState)}</Text>
          </View>
          <Line style={{ height: device.hairlineWidth, width: device.width - 30 }} />
          <View style={FormItemStyle.rowContentStyle}>
            <View style={FormItemStyle.itemStyle}>
              <Text allowFontScaling={false} style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.applyname')}: </Text>
              <Text numberOfLines={1} allowFontScaling={false} style={FormItemStyle.rowContentValueStyle}>{empName}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text allowFontScaling={false} style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.starttime')}: </Text>
              <Text numberOfLines={1} allowFontScaling={false} style={FormItemStyle.rowContentValueStyle}>{startData}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text allowFontScaling={false} style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.endtime')}: </Text>
              <Text numberOfLines={1} allowFontScaling={false} style={FormItemStyle.rowContentValueStyle}>{endData}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text allowFontScaling={false} style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.myform.trave.hours')}: </Text>
              <Text allowFontScaling={false} style={FormItemStyle.rowContentValueStyle}>{`${this.state.rowData.formDetail.Duration}`}</Text>
            </View>
            {
              (!_.isEmpty(global.loginResponseData) && !_.isEmpty(global.loginResponseData.SysParaInfo) && global.loginResponseData.SysParaInfo.CustomerIsVisible == 'Y' && !_.isEmpty(this.state.rowData.formDetail.Customer)) ?
                <View style={FormItemStyle.itemStyle}>
                  <Text allowFontScaling={false} style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.detail.projectcode')}: </Text>
                  <Text numberOfLines={1} allowFontScaling={false} style={FormItemStyle.rowContentValueStyle}>{this.state.rowData.formDetail.Customer}</Text>
                </View> : null
            }
            <View style={FormItemStyle.itemStyle}>
              <Text allowFontScaling={false} style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.trave.destination')}: </Text>
              <Text numberOfLines={1} allowFontScaling={false} style={FormItemStyle.rowContentValueStyle}>{this.state.rowData.formDetail.Destination}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text allowFontScaling={false} style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.onbusiness.travelreasontitletext')}: </Text>
              <Text allowFontScaling={false} numberOfLines={1} lineBreakMode="tail" style={FormItemStyle.rowContentValueStyle}>{this.state.rowData.formDetail.Reason}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
