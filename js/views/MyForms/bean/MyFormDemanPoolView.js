/**
 * 我的表单换班需求行布局
 */
import { TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import I18n from 'react-native-i18n';
import Line from '@/common/components/Line';
import Text from '@/common/components/TextField';
import _ from 'lodash';
import { device } from '@/common/Util';
import FormItemStyle from '../FormItemStyle';
import Constance from './../Constance';
import FormDetailUi from './../FormDetailUi';
import MyFormHelper from './../MyFormHelper';
import { getYYYYMMDDFormat, getHHmmFormat } from '@/common/Functions';


const myFormHelper = new MyFormHelper();

export default class MyFormDemanPoolView extends PureComponent {
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
        if (item.Type == Constance.FORMTYPE_PROCESSDEMANDPOOLFORM) {
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
    const startData = getYYYYMMDDFormat(`${this.state.currentDetail.formDetail.MyShiftDate}`);
    const Data = getHHmmFormat(`${this.state.currentDetail.formDetail.MyShiftFrom}`);
    const endData = getHHmmFormat(`${this.state.currentDetail.formDetail.MyShiftTo}`)
    return (
      <TouchableOpacity style={FormItemStyle.rowStyle} onPress={() => this.ItemClick()}>
        <View style={{ borderTopLeftRadius: 2, borderBottomLeftRadius: 2, backgroundColor: leftbackgroundcolor, width: 5 }} />
        <View style={FormItemStyle.columnStyle}>
          <View style={FormItemStyle.rowTitleStyle}>
            <Text numberOfLines={1} lineBreakMode="tail" style={FormItemStyle.rowTitleTextStyle}>{this.state.Description}</Text>
            <Text style={FormItemStyle.statusStyle}>{this.state.currentDetail.formDetail.ApproveState == '0' ? I18n.t('mobile.module.changeshift.pendding') : I18n.t('mobile.module.changeshift.statusstop')}</Text>
          </View>
          <Line style={{ height: device.hairlineWidth, width: device.width - 30 }} />
          <View style={FormItemStyle.rowContentStyle}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.myform.shiftname')}: </Text>
              <Text numberOfLines={1} style={FormItemStyle.rowContentValueStyle}>{this.state.currentDetail.formDetail.MyShiftName}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.myform.shifttime')}: </Text>
              <Text numberOfLines={1} style={FormItemStyle.rowContentValueStyle}>{startData} {Data}-{endData}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}