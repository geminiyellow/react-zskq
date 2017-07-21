/**
 * 销假行布局（审核）
 */
import { DeviceEventEmitter, TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import { device, keys } from '@/common/Util';
import Image from '@/common/components/CustomImage';
import I18n from 'react-native-i18n';
import Line from '@/common/components/Line';
import _ from 'lodash';
import Text from '@/common/components/TextField';
import Constance from './../MyForms/Constance';
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

export default class SickLeaveView extends PureComponent {
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
        if (item.Type == Constance.FORMTYPE_PROCESSCANCELFORM) {
          description = `${item.Description} `;
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

  render() {
    if (myFormHelper.getLanguage() == 0) {
      //获取数据库中的数据
      empName = _.isEmpty(this.state.rowData.formDetail.EmpName) ? this.state.rowData.formDetail.EnglishName : this.state.rowData.formDetail.EmpName;
    } else {
      empName = _.isEmpty(this.state.rowData.formDetail.EnglishName) ? this.state.rowData.formDetail.EmpName : this.state.rowData.formDetail.EnglishName;
    }
    const leftbackgroundcolor = Constance.getStatusColor(this.state.rowData.formDetail.ApproveState);
    const startData = getYYYYMMDDhhmmFormat(`${this.state.rowData.formDetail.BeginDate} ${this.state.rowData.formDetail.BeginTime}`);
    const endData = getYYYYMMDDhhmmFormat(`${this.state.rowData.formDetail.EndDate} ${this.state.rowData.formDetail.EndTime}`);

    return (
      <TouchableOpacity style={FormItemStyle.rowStyle} onPress={() => this.ItemClick()}>
        <View style={{ borderTopLeftRadius: 2, borderBottomLeftRadius: 2, backgroundColor: leftbackgroundcolor, width: 5 }} />
        <View style={FormItemStyle.columnStyle}>
          <View style={FormItemStyle.rowTitleStyle}>
            {this.getRadioView()}
            <Text numberOfLines={1} lineBreakMode="tail" style={FormItemStyle.rowTitleTextStyle}>{this.state.Description}{this.state.rowData.formDetail.LeaveName}</Text>
            <Text style={FormItemStyle.statusStyle}>{Constance.getStatusName(this.state.rowData.formDetail.ApproveState)}</Text>
          </View>
          <Line style={{ height: device.hairlineWidth, width: device.width - 30 }} />
          <View style={FormItemStyle.rowContentStyle}>
            {/*申请人*/}
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.name')}: </Text>
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
            {/*销假时数*/}
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.revoke.revoketime')}: </Text>
              <Text style={FormItemStyle.rowContentValueStyle}>{`${this.state.rowData.formDetail.Hours}`}</Text>
            </View>
            {/*详细说明*/}
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.reasondetail')}: </Text>
              <Text numberOfLines={1} lineBreakMode="tail" style={FormItemStyle.rowContentValueStyle}>{`${this.state.rowData.formDetail.Remark}`}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
