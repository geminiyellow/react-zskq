/**
 * 我的表单请假行布局
 */
import { TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import I18n from 'react-native-i18n';
import Line from '@/common/components/Line';
import _ from 'lodash';
import { device } from '@/common/Util';
import Text from '@/common/components/TextField';
import Constance from './../Constance';
import { getYYYYMMDDhhmmFormat } from '@/common/Functions';
import FormDetailUi from './../FormDetailUi';
import FormItemStyle from '../FormItemStyle';
import MyFormHelper from './../MyFormHelper';

const myFormHelper = new MyFormHelper();
export default class MyFormLeaveView extends PureComponent {
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
        if (item.Type == Constance.FORMTYPE_PROCESSLEAVEFORM) {
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
    const startData = getYYYYMMDDhhmmFormat(`${this.state.currentDetail.formDetail.StartDate} ${this.state.currentDetail.formDetail.StartTime}`);
    const endData = getYYYYMMDDhhmmFormat(`${this.state.currentDetail.formDetail.EndDate} ${this.state.currentDetail.formDetail.EndTime}`);
    return (
      <TouchableOpacity style={FormItemStyle.rowStyle} onPress={() => this.ItemClick()}>
        <View style={{ borderTopLeftRadius: 2, borderBottomLeftRadius: 2, backgroundColor: leftbackgroundcolor, width: 5 }} />
        <View style={FormItemStyle.columnStyle}>
          <View style={FormItemStyle.rowTitleStyle}>
            <Text numberOfLines={1} lineBreakMode="tail" style={FormItemStyle.rowTitleTextStyle}>{this.state.Description}{this.state.currentDetail.formDetail.LeaveName}</Text>
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
              <Text style={FormItemStyle.rowContentLabelStyle}>{Constance.getLeaveUnit(this.state.currentDetail.formDetail.LeaveUnit)}: </Text>
              <Text numberOfLines={1} style={FormItemStyle.rowContentValueStyle}>{this.state.currentDetail.formDetail.LeaveHours}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.myform.leave.reason')}: </Text>
              <Text numberOfLines={1} lineBreakMode="tail" style={FormItemStyle.rowContentValueStyle}>{this.state.currentDetail.formDetail.Reason}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}