/**
 * 我的表单换班行布局
 */
import { TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import I18n from 'react-native-i18n';
import _ from 'lodash';
import Text from '@/common/components/TextField';
import Line from '@/common/components/Line';
import { device } from '@/common/Util';
import Constance from './../Constance';
import FormDetailUi from './../FormDetailUi';
import FormItemStyle from '../FormItemStyle';
import MyFormHelper from './../MyFormHelper';
import { getYYYYMMDDFormat, getHHmmFormat } from '@/common/Functions';

const myFormHelper = new MyFormHelper();

export default class MyFormChangeShiftView extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      currentDetail: null,
      Description: '',
    };
  }
  componentWillMount() {
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

  render() {
    const leftbackgroundcolor = Constance.getStatusColor(this.state.currentDetail.formDetail.ApproveState);
    const startData = getYYYYMMDDFormat(`${this.state.currentDetail.formDetail.OtherShiftDate}`);
    const Data = getHHmmFormat(`${this.state.currentDetail.formDetail.OtherShiftFrom}`);
    const endData = getHHmmFormat(`${this.state.currentDetail.formDetail.OtherShiftTo}`);
    const startData1 =getYYYYMMDDFormat(`${this.state.currentDetail.formDetail.MyShiftDate}`)
    const Data1 = getHHmmFormat(`${this.state.currentDetail.formDetail.MyShiftFrom}`);
    const endData1 = getHHmmFormat(`${this.state.currentDetail.formDetail.MyShiftTo}`);
    let otherName = null;
    if (myFormHelper.getLanguage() == 0) {
      otherName = _.isEmpty(this.state.currentDetail.formDetail.OtherName) ? this.state.currentDetail.formDetail.OtherEnglishName : this.state.currentDetail.formDetail.OtherName;
    } else {
      otherName = _.isEmpty(this.state.currentDetail.formDetail.OtherEnglishName) ? this.state.currentDetail.formDetail.OtherName : this.state.currentDetail.formDetail.OtherEnglishName;
    }
    return (
      <TouchableOpacity style={FormItemStyle.rowStyle} onPress={() => this.ItemClick()}>
        <View style={{ borderTopLeftRadius: 2, borderBottomLeftRadius: 2, backgroundColor: leftbackgroundcolor, width: 5 }} />
        <View style={FormItemStyle.columnStyle}>
          <View style={FormItemStyle.rowTitleStyle}>
            <Text numberOfLines={1} lineBreakMode="tail" style={FormItemStyle.rowTitleTextStyle}>{this.state.Description}</Text>
            <Text style={FormItemStyle.statusStyle}>{Constance.getStatusName(this.state.currentDetail.formDetail.ApproveState)}</Text>
          </View>
          <Line style={{ height: device.hairlineWidth, width: device.width - 30 }} />
          <View style={FormItemStyle.rowContentStyle}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.changeshift.shiftname')}: </Text>
              <Text numberOfLines={1} style={FormItemStyle.rowContentValueStyle}>{this.state.currentDetail.formDetail.MyShiftName}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.detail.changeshift.shifttime')}: </Text>
              <Text numberOfLines={1} style={FormItemStyle.rowContentValueStyle}>{startData1} {Data1}-{endData1}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.myform.changeshift.othername')}: </Text>
              <Text numberOfLines={1} style={FormItemStyle.rowContentValueStyle}>{otherName}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.myform.changeshift.othershiftname')}: </Text>
              <Text numberOfLines={1} style={FormItemStyle.rowContentValueStyle}>{this.state.currentDetail.formDetail.OtherShiftName}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.myform.changeshift.othershifttime')}: </Text>
              <Text numberOfLines={1} style={FormItemStyle.rowContentValueStyle}>{startData} {Data}-{endData}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}