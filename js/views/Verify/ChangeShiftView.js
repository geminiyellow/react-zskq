/**
 * 换班行布局
 */
import { DeviceEventEmitter, TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import I18n from 'react-native-i18n';
import Image from '@/common/components/CustomImage';
import _ from 'lodash';
import Text from '@/common/components/TextField';
import Line from '../../common/components/Line';
import FormDetailUi from './../MyForms/FormDetailUi';
import { device, keys } from '../../common/Util';
import Constance from './../MyForms/Constance';
import FormItemStyle from '../MyForms/FormItemStyle';
import MyFormHelper from '../MyForms/MyFormHelper';
import { getYYYYMMDDFormat, getHHmmFormat } from '@/common/Functions';

const myFormHelper = new MyFormHelper();
const checkboxNormal = 'checkbox_common';
const checkboxChecked = 'checkbox_selected';
// 撤销是否可见
let cacelVisible = true;

// 底部操作是否可见
let bottomMeneVisible = true;
export default class ChangeShiftView extends PureComponent {
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
        if (item.Type == Constance.FORMTYPE_PROCESSTRANSFERSHIFTFORM) {
          description = item.Description;
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
          iscacelVisible: false,
          fromVerify: this.props.fromVerify,
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
    let myName = '';
    let otherName = '';
    if (myFormHelper.getLanguage() == 0) {
      myName = _.isEmpty(this.state.rowData.formDetail.MyName) ? this.state.rowData.formDetail.MyEnglishName : this.state.rowData.formDetail.MyName;
    } else {
      myName = _.isEmpty(this.state.rowData.formDetail.MyEnglishName) ? this.state.rowData.formDetail.MyName : this.state.rowData.formDetail.MyEnglishName;
    }

    if (myFormHelper.getLanguage() == 0) {
      otherName = _.isEmpty(this.state.rowData.formDetail.OtherName) ? this.state.rowData.formDetail.OtherEnglishName : this.state.rowData.formDetail.OtherName;
    } else {
      otherName = _.isEmpty(this.state.rowData.formDetail.OtherEnglishName) ? this.state.rowData.formDetail.OtherName : this.state.rowData.formDetail.OtherEnglishName;
    }

    const leftbackgroundcolor = Constance.getStatusColor(this.state.rowData.formDetail.ApproveState);
    const startData = getYYYYMMDDFormat(`${this.state.rowData.formDetail.MyShiftDate}`);
    const Data = getHHmmFormat(`${this.state.rowData.formDetail.MyShiftFrom}`)
    const endData = getHHmmFormat(`${this.state.rowData.formDetail.MyShiftTo}`)

    const startData1 = getYYYYMMDDFormat(`${this.state.rowData.formDetail.OtherShiftDate}`);
    const Data1 = getHHmmFormat(`${this.state.rowData.formDetail.OtherShiftFrom}`);
    const endData1 = getHHmmFormat(`${this.state.rowData.formDetail.OtherShiftTo}`);
    return (
      <TouchableOpacity style={FormItemStyle.rowStyle} onPress={() => this.ItemClick()}>
        <View style={{ borderTopLeftRadius: 2, borderBottomLeftRadius: 2, backgroundColor: leftbackgroundcolor, width: 5 }} />
        <View style={FormItemStyle.columnStyle}>
          <View style={FormItemStyle.rowTitleStyle}>
            {this.getRadioView()}
            <Text numberOfLines={1} lineBreakMode="tail" style={FormItemStyle.rowTitleTextStyle}>{this.state.Description}</Text>
            <Text style={FormItemStyle.statusStyle}>{Constance.getStatusName(this.state.rowData.formDetail.ApproveState)}</Text>
          </View>
          <Line style={{ height: device.hairlineWidth, width: device.width - 30 }} />
          <View style={FormItemStyle.rowContentStyle}>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.applyname')}: </Text>
              <Text numberOfLines={1} style={FormItemStyle.rowContentValueStyle}>{myName}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.changeshift.shiftname')}: </Text>
              <Text numberOfLines={1} style={FormItemStyle.rowContentValueStyle}>{this.state.rowData.formDetail.MyShiftName}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.detail.changeshift.shifttime')}: </Text>
              <Text numberOfLines={1} style={FormItemStyle.rowContentValueStyle}>{startData} {Data}-{endData}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.myform.changeshift.othername')}: </Text>
              <Text numberOfLines={1} style={FormItemStyle.rowContentValueStyle}>{otherName}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.myform.changeshift.othershiftname')}: </Text>
              <Text numberOfLines={1} style={FormItemStyle.rowContentValueStyle}>{this.state.rowData.formDetail.OtherShiftName}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.myform.changeshift.othershifttime')}: </Text>
              <Text numberOfLines={1} style={FormItemStyle.rowContentValueStyle}>{startData1} {Data1}-{endData1}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}