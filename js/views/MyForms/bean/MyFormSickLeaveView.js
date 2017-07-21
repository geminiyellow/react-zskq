/**
 * 我的表单销假行布局
 */
import { TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import I18n from 'react-native-i18n';
import Line from '@/common/components/Line';
import _ from 'lodash';
import { device } from '@/common/Util';
import Text from '@/common/components/TextField';
import Constance from './../Constance';
import FormDetailUi from './../FormDetailUi';
import FormItemStyle from '../FormItemStyle';
import MyFormHelper from './../MyFormHelper';
import { getYYYYMMDDhhmmFormat } from '@/common/Functions';
const myFormHelper = new MyFormHelper();

export default class MyFormSickLeaveView extends PureComponent {
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
      //遍历数据库，判断数据库中具体信息，显示当前页面具体表单
      types.map(item => {
        if (item.Type == Constance.FORMTYPE_PROCESSCANCELFORM) {
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
    //判断当前表单的类型
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
    const startData = getYYYYMMDDhhmmFormat(`${this.state.currentDetail.formDetail.BeginDate} ${this.state.currentDetail.formDetail.BeginTime}`);
    const endData = getYYYYMMDDhhmmFormat(`${this.state.currentDetail.formDetail.EndDate} ${this.state.currentDetail.formDetail.EndTime}`);

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
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.starttime')}: </Text>
              <Text numberOfLines={1} style={FormItemStyle.rowContentValueStyle}>{startData}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.endtime')}: </Text>
              <Text numberOfLines={1} style={FormItemStyle.rowContentValueStyle}>{endData}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.revoke.revoketime')}: </Text>
              <Text numberOfLines={1} style={FormItemStyle.rowContentValueStyle}>{`${this.state.currentDetail.formDetail.Hours}`}</Text>
            </View>
            <View style={FormItemStyle.itemStyle}>
              <Text style={FormItemStyle.rowContentLabelStyle}>{I18n.t('mobile.module.verify.reasondetail')}: </Text>
              <Text numberOfLines={1} lineBreakMode="tail" style={FormItemStyle.rowContentValueStyle}>{`${this.state.currentDetail.formDetail.Remark}`}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}