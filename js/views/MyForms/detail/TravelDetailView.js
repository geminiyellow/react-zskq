/**
 * 出差详情布局
 */
import { Clipboard, ListView, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { device } from '@/common/Util';
import I18n from 'react-native-i18n';
import { messageType } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import { getCurrentLanguage } from '@/common/Functions';
import Image from '@/common/components/CustomImage';
import Line from '@/common/components/Line';
import FormDetailStyle from '../FormDetailStyle';
import { languages } from '@/common/LanguageSettingData';
import Constance from '../Constance';
import ApproveView from './ApproveFlowView';
import MyFormHelper from './../MyFormHelper';
import { getYYYYMMDDFormat, getYYYYMMDDhhmmFormat } from '@/common/Functions';

const travelDown = 'travel_down';
const travelUp = 'travel_up';
const myFormHelper = new MyFormHelper();
let currentDetail = null;

export default class TravelDetailView extends PureComponent {
  constructor(...args) {
    super(...args);
    this.moneylist = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: this.moneylist.cloneWithRows([]),
      showmoneys: false,
      language: 0,
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
    this.setState({
      dataSource: this.moneylist.cloneWithRows(currentDetail.formDetail.Moneys),
    });
  }

  loadAll() {
    this.setState({
      showmoneys: !this.state.showmoneys,
    });
  }

  inflateMoneyItem(rowData, sectionID, rowID, highlightRow) {
    const StartDate = getYYYYMMDDFormat(rowData.StartDate);
    const EndDate = getYYYYMMDDFormat(rowData.EndDate);
    
    return (
      <View key={`${sectionID}-${rowID}`}>
        <Text allowFontScaling={false} style={{ paddingTop: 22, paddingBottom: 10, paddingLeft: 12, fontSize: 14, color: '#666' }}>{`${I18n.t('mobile.module.detail.reservefund')}${parseInt(rowID) + 1}`}</Text>
        <View style={{ backgroundColor: 'white', paddingLeft: 12, paddingRight: 12, paddingBottom: 12 }}>
          <View style={FormDetailStyle.rowTagStyle}>
            <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.detail.cost.type')}</Text>
            <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{rowData.type}</Text>
          </View>
          <Line style={FormDetailStyle.lineStyle} />
          <View style={FormDetailStyle.rowTagStyle}>
            <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.starttime')}</Text>
            <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{StartDate}</Text>
          </View>
          <Line style={FormDetailStyle.lineStyle} />
          <View style={FormDetailStyle.rowTagStyle}>
            <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.endtime')}</Text>
            <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{EndDate}</Text>
          </View>
          <Line style={FormDetailStyle.lineStyle} />
          <View style={FormDetailStyle.rowTagStyle}>
            <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.reasondetail')}</Text>
            <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{rowData.DetailReason}</Text>
          </View>
          <Line style={FormDetailStyle.lineStyle} />
          <View style={FormDetailStyle.rowTagStyle}>
            <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.detail.applycount')}</Text>
            <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{`${rowData.AmountMoney} ${rowData.MoneyType}`}</Text>
          </View>
          <Line style={FormDetailStyle.lineStyle} />
        </View>
      </View>
    );
  }
  getMoneysView() {
    if (this.state.showmoneys) {
      return (
        <ListView
          ref={listview => this.listView = listview}
          dataSource={this.state.dataSource}
          enableEmptySections
          initialListSize={10}
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
          renderRow={(rowData, sectionID, rowID, highlightRow) => this.inflateMoneyItem(rowData, sectionID, rowID, highlightRow)}
        />
      );
    }
    return null;
  }

  getLoadAllView() {
    if (!_.isEmpty(currentDetail.formDetail.Moneys)) {
      return (
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }} onPress={() => this.loadAll()} >
          <Image style={{ width: 8, height: 4 }} source={{ uri: !this.state.showmoneys ? travelDown : travelUp }} />
          <Text allowFontScaling={false} style={FormDetailStyle.allTextStyle}>{(this.state.showmoneys) ? I18n.t('mobile.module.detail.collapse') : I18n.t('mobile.module.detail.expend')}</Text>
        </TouchableOpacity>
      );
    }
  }

  getCustomerView() {
    let CustomerIsVisible = 'N';
    if (!_.isEmpty(global.loginResponseData) && !_.isEmpty(global.loginResponseData.SysParaInfo) && !_.isEmpty(currentDetail.formDetail.Customer)) {
      CustomerIsVisible = global.loginResponseData.SysParaInfo.CustomerIsVisible;
    }
    if (CustomerIsVisible == 'Y') {
      return (
        <View>
          <View style={FormDetailStyle.rowTagStyle}>
            <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.detail.projectcode')}</Text>
            <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{currentDetail.formDetail.Customer}</Text>
          </View>
          <Line style={FormDetailStyle.lineStyle} />
        </View>
      );
    }
    return null;
  }

  copyID = async () => {
    Clipboard.setString(currentDetail.formDetail.FormNumber);
    showMessage(messageType.success, I18n.t('mobile.module.detail.msg.copysuccess'));
  }

  render() {
    let empName = currentDetail.formDetail.EmpName;
    if (myFormHelper.getLanguage() == 0) {
      empName = _.isEmpty(currentDetail.formDetail.EmpName) ? currentDetail.formDetail.EnglishName : currentDetail.formDetail.EmpName;
    } else {
      empName = _.isEmpty(currentDetail.formDetail.EnglishName) ? currentDetail.formDetail.EmpName : currentDetail.formDetail.EnglishName;
    }
    const exceptionDate = currentDetail.formDetail.ExceptionDate;
    let date = [];
    if (!_.isEmpty(exceptionDate)) {
      date = _.split(exceptionDate, '-');
    }
    const statuscolor = Constance.getStatusColor(currentDetail.formDetail.ApproveState);
    const startData = getYYYYMMDDhhmmFormat(`${currentDetail.formDetail.StartDate} ${currentDetail.formDetail.StartTime}`);
    const endData = getYYYYMMDDhhmmFormat(`${currentDetail.formDetail.EndDate} ${currentDetail.formDetail.EndTime}`);
    const Data = getYYYYMMDDFormat(currentDetail.formDetail.ApplyDate);
    return (
      <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={FormDetailStyle.container}>
          <View style={FormDetailStyle.rowStyle}>
            <View style={FormDetailStyle.formheadStyle}>
              <Text numberOfLines={1} style={{ flex: 1, textAlign: 'left', fontSize: 18, color: '#333' }}>{currentDetail.formDetail.TravelName}</Text>
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
          </View>
          <Text allowFontScaling={false} style={{ paddingTop: 22, paddingBottom: 10, paddingLeft: 12, fontSize: 14, color: '#666' }}>{I18n.t('mobile.module.myform.detail')}</Text>
          <View style={[{ backgroundColor: 'white', paddingLeft: 12, paddingRight: 12, paddingBottom: 12 }, FormDetailStyle.formdetailsStyle2]}>
            <View style={FormDetailStyle.rowTagStyle}>
              <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.trave.destination')}</Text>
              <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{currentDetail.formDetail.Destination}</Text>
            </View>
            <Line style={FormDetailStyle.lineStyle} />
            {this.getCustomerView()}
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
            <View style={FormDetailStyle.rowTagStyle}>
              <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.myform.trave.hours')}</Text>
              <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{currentDetail.formDetail.Duration}</Text>
            </View>
            <Line style={FormDetailStyle.lineStyle} />
            <View style={FormDetailStyle.rowTagStyle}>
              <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.onbusiness.travelreasontitletext')}</Text>
              <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{currentDetail.formDetail.Reason}</Text>
            </View>
            <Line style={FormDetailStyle.lineStyle} />
            <View style={FormDetailStyle.rowTagStyle}>
              <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.detail.trip')}</Text>
              <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{currentDetail.formDetail.ReasonDetail}</Text>
            </View>
            {this.getLoadAllView()}
          </View>

          {this.getMoneysView()}

          <View style={{ flexDirection: 'column', backgroundColor: '#EDEDF3', paddingBottom: 20 }}>
            <ApproveView detail={currentDetail.formDetail.ApprovalInfoList} />
          </View>
        </View>
      </ScrollView>
    );
  }
}
