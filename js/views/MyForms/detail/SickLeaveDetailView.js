/**
 * 销假详情布局（表单，审核）
 */
import { Clipboard, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { device, keys } from '@/common/Util';
import { messageType, companyCodeList, moduleList } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import { getCurrentLanguage, getVersionId } from '@/common/Functions';
import I18n from 'react-native-i18n';
import Line from '@/common/components/Line';
import { languages } from '@/common/LanguageSettingData';
import ApproveView from './ApproveFlowView';
import FormDetailStyle from '../FormDetailStyle';
import AttachView from './AttachView';
import Constance from '../Constance';
import MyFormHelper from '../MyFormHelper';
import { getYYYYMMDDFormat, getYYYYMMDDhhmmFormat } from '@/common/Functions';

const myFormHelper = new MyFormHelper();
let currentDetail = null;
let description = '';

export default class SickLeaveDetailView extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      language: 0,
      time: '',
    };
    getCurrentLanguage().then(data => {
      const k = languages.indexOf(data);
      if (k == 0) {
        this.setState({
          language: 0,
        });
      } else {
        this.setState({
          language: 1,
        });
      }
    });
  }

  componentWillMount() {
    currentDetail = this.props.detail;
    const types = myFormHelper.getTypes();
    this.companyCode = getVersionId(global.companyResponseData.version, moduleList.leave);

    if (!_.isEmpty(types)) {
      types.map(item => {
        if (item.Type == Constance.FORMTYPE_PROCESSCANCELFORM) {
          description = item.Description;
        }
      });
    }
  }

  copyID = async () => {
    Clipboard.setString(currentDetail.formDetail.FormNumber);
    showMessage(messageType.success, I18n.t('ClipSuccessText'));
  }

  getTime() {
    if (currentDetail.formDetail.IsFixed == 1) {
      return (
        <View>
          <View style={FormDetailStyle.rowTagStyle}>
            <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.leaveapply.leaveapplyflextime')}</Text>
            <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{I18n.t('mobile.module.verify.overtime.comptime.yes')}</Text>
          </View>

          <Line style={FormDetailStyle.lineStyle} />
        </View>
      );
    } return null;
  }

  render() {
    //获取数据库中具体信息中的表单状态
    const statuscolor = Constance.getStatusColor(currentDetail.formDetail.ApproveState);
    const startData = getYYYYMMDDhhmmFormat(`${currentDetail.formDetail.BeginDate} ${currentDetail.formDetail.BeginTime}`);
    const endData = getYYYYMMDDhhmmFormat(`${currentDetail.formDetail.EndDate} ${currentDetail.formDetail.EndTime}`);
    const Data = getYYYYMMDDFormat(currentDetail.formDetail.ApplyDate);
    let empName = currentDetail.formDetail.EmpName;
    if (myFormHelper.getLanguage() == 0) {
      empName = _.isEmpty(currentDetail.formDetail.EmpName) ? currentDetail.formDetail.EnglishName : currentDetail.formDetail.EmpName;
    } else {
      empName = _.isEmpty(currentDetail.formDetail.EnglishName) ? currentDetail.formDetail.EmpName : currentDetail.formDetail.EnglishName;
    }
    return (
      <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={FormDetailStyle.container}>
          <View style={FormDetailStyle.rowStyle}>
            <View style={FormDetailStyle.formheadStyle}>
              <Text allowFontScaling={false} numberOfLines={1} style={{ flex: 1, textAlign: 'left', fontSize: 18, color: '#333' }}>{description}</Text>
              <View style={FormDetailStyle.statusContainerStyle}>
                <Text numberOfLines={1} allowFontScaling={false} style={[FormDetailStyle.statusStyle, { color: statuscolor }]}>{Constance.getStatusName(currentDetail.formDetail.ApproveState)}</Text>
              </View>
            </View>
            <View style={FormDetailStyle.formoutlineStyle}>
              <View style={{ flexDirection: 'row' }}>
                <Text allowFontScaling={false} numberOfLines={1} style={{ fontSize: 14, color: '#666' }}>{I18n.t('mobile.module.verify.applyname')}: </Text>
                <Text allowFontScaling={false} style={{ fontSize: 14, color: '#666' }}>{empName}</Text>
              </View>
              <TouchableWithoutFeedback onPressIn={this.copyID}>
                <View style={{ flexDirection: 'row', marginTop: 2, alignItems: 'center' }}>
                  <Text allowFontScaling={false} numberOfLines={1} style={{ fontSize: 14, color: '#666' }}>{currentDetail.formDetail.FormNumber}</Text>
                  <Line style={{ marginLeft: 6, marginRight: 6, height: 16, width: 1, backgroundColor: '#666' }} />
                  <Text allowFontScaling={false} style={{ fontSize: 14, color: '#666' }}>{Data}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <Text allowFontScaling={false} style={{ paddingTop: 22, paddingBottom: 10, paddingLeft: 12, fontSize: 14, color: '#666' }}>{I18n.t('mobile.module.myform.detail')}</Text>
            <View style={FormDetailStyle.formdetailsStyle2}>
              <View style={{ paddingLeft: 12, paddingRight: 12 }}>

                {/*销假时数'*/}
                <View style={FormDetailStyle.rowTagStyle}>
                  <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.revoke.revoketime')}</Text>
                  <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{`${currentDetail.formDetail.Hours}`}</Text>
                </View>
                <Line style={FormDetailStyle.lineStyle} />
                <View style={FormDetailStyle.rowTagStyle}>
                  <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.starttime')}</Text>
                  <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{startData}</Text>
                </View>
                <Line style={FormDetailStyle.lineStyle} />
                <View style={FormDetailStyle.rowTagStyle}>
                  <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.endtime')}</Text>
                  <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{endData}</Text>
                </View>
                <Line style={FormDetailStyle.lineStyle} />
                {this.getTime()}
                {/*详细说明*/}
                <View style={FormDetailStyle.rowTagStyle}>
                  <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.reasondetail')}</Text>
                  <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{currentDetail.formDetail.Remark}</Text>
                </View>

              </View>
              {/*附件*/}
              {/*<AttachView detail={currentDetail} navigator={this.props.navigator} />*/}
            </View>
            {/*审核流程*/}
          </View>
          <View style={{ flexDirection: 'column', backgroundColor: '#EDEDF3', paddingBottom: 20 }}>
            <ApproveView detail={currentDetail.formDetail.ApprovalInfoList} />
          </View>
        </View>
      </ScrollView>
    );
  }
}