/**
 * 换班详情布局
 */
import { Clipboard, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { device } from '@/common/Util';
import ScheduleConstance from '@/views/Schedule/Constance';
import { messageType } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import Line from '@/common/components/Line';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import Constance from '../Constance';
import ApproveView from './ApproveFlowView';
import FormDetailStyle from '../FormDetailStyle';
import MyFormHelper from '../MyFormHelper';
import { getYYYYMMDDFormat, getHHmmFormat } from '@/common/Functions';

let currentDetail = null;

const myFormHelper = new MyFormHelper();

export default class ChangeShiftDetailView extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      language: myFormHelper.getLanguage(),
    };
  }

  componentWillMount() {
    currentDetail = this.props.detail;
  }

  myShiftView() {
    let empName = currentDetail.formDetail.EmpName;
    if (myFormHelper.getLanguage() == 0) {
      empName = _.isEmpty(currentDetail.formDetail.MyName) ? currentDetail.formDetail.MyEnglishName : currentDetail.formDetail.MyName;
    } else {
      empName = _.isEmpty(currentDetail.formDetail.MyEnglishName) ? currentDetail.formDetail.MyName : currentDetail.formDetail.MyEnglishName;
    }
    const date = _.split(currentDetail.formDetail.MyShiftDate, '-');
    let circlebg = styles.schedulecircleStyle;
    if (currentDetail.formDetail.MyShiftType == ScheduleConstance.ShiftType_HOLIDAY || currentDetail.formDetail.MyShiftType == ScheduleConstance.ShiftType_FESTIVAL) {
      circlebg = styles.schedulecircleStyleOrange;
    }
    const monthText = ScheduleConstance.getMonth(date[1], myFormHelper.getLanguage());
    const startData = getHHmmFormat(currentDetail.formDetail.MyShiftFrom);
    const endData = getHHmmFormat(currentDetail.formDetail.MyShiftTo);
    return (
      <View style={styles.scheduleRowStyle}>
        <View style={circlebg} >
          <Text allowFontScaling={false} style={{ fontSize: 18, color: 'white' }}>{date[2]}</Text>
          <Text allowFontScaling={false} style={{ fontSize: 12, color: 'white' }}>{I18n.t(monthText)}</Text>
        </View>

        <View style={styles.rowTextStyle} >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text allowFontScaling={false} style={{ fontSize: 14, color: '#030303' }}>{empName}</Text>
            <Line style={{ marginLeft: 6, marginRight: 6, height: 16, width: 1, backgroundColor: '#666' }} />
            <Text allowFontScaling={false} style={{ fontSize: 14, color: '#030303' }}>{currentDetail.formDetail.MyPosition}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text allowFontScaling={false} style={{ fontSize: 14, color: '#666' }}>{currentDetail.formDetail.MyShiftName}</Text>
            <Line style={{ marginLeft: 6, marginRight: 6, height: 16, width: 1, backgroundColor: '#666' }} />
            <Text allowFontScaling={false} style={{ fontSize: 14, color: '#666' }}>{startData}-{endData}</Text>
            <Line style={{ marginLeft: 6, marginRight: 6, height: 16, width: 1, backgroundColor: '#666' }} />
            <Text allowFontScaling={false} style={{ fontSize: 14, color: '#666' }}>{`${currentDetail.formDetail.MyShiftHours}${I18n.t('mobile.module.changeshift.hour')}`}</Text>
          </View>
        </View>
      </View>
    );
  }
  // 换班成功后的我的班次
  myChangedShiftView() {
    let empName = currentDetail.formDetail.EmpName;
    if (myFormHelper.getLanguage() == 0) {
      empName = _.isEmpty(currentDetail.formDetail.MyName) ? currentDetail.formDetail.MyEnglishName : currentDetail.formDetail.MyName;
    } else {
      empName = _.isEmpty(currentDetail.formDetail.MyEnglishName) ? currentDetail.formDetail.MyName : currentDetail.formDetail.MyEnglishName;
    }
    const date = _.split(currentDetail.formDetail.OtherShiftDate, '-');
    let circlebg = styles.schedulecircleStyle;
    if (currentDetail.formDetail.OtherShiftType == ScheduleConstance.ShiftType_HOLIDAY || currentDetail.formDetail.OtherShiftType == ScheduleConstance.ShiftType_FESTIVAL) {
      circlebg = styles.schedulecircleStyleOrange;
    }
    const monthText = ScheduleConstance.getMonth(date[1], myFormHelper.getLanguage());
    const startData = getHHmmFormat(currentDetail.formDetail.OtherShiftFrom);
    const endData = getHHmmFormat(currentDetail.formDetail.OtherShiftTo);
    return (
      <View style={styles.scheduleRowStyle}>
        <View style={circlebg} >
          <Text allowFontScaling={false} style={{ fontSize: 18, color: 'white' }}>{date[2]}</Text>
          <Text allowFontScaling={false} style={{ fontSize: 12, color: 'white' }}>{I18n.t(monthText)}</Text>
        </View>

        <View style={styles.rowTextStyle} >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text allowFontScaling={false} style={{ fontSize: 14, color: '#030303' }}>{empName}</Text>
            <Line style={{ marginLeft: 6, marginRight: 6, height: 16, width: 1, backgroundColor: '#666' }} />
            <Text allowFontScaling={false} style={{ fontSize: 14, color: '#030303' }}>{currentDetail.formDetail.MyPosition}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text allowFontScaling={false} style={{ fontSize: 14, color: '#666' }}>{currentDetail.formDetail.OtherShiftName}</Text>
            <Line style={{ marginLeft: 6, marginRight: 6, height: 16, width: 1, backgroundColor: '#666' }} />
            <Text allowFontScaling={false} style={{ fontSize: 14, color: '#666' }}>{startData}-{endData}</Text>
            <Line style={{ marginLeft: 6, marginRight: 6, height: 16, width: 1, backgroundColor: '#666' }} />
            <Text allowFontScaling={false} style={{ fontSize: 14, color: '#666' }}>{`${currentDetail.formDetail.OtherShiftHours}${I18n.t('mobile.module.changeshift.hour')}`}</Text>
          </View>
        </View>
      </View>
    );
  }

  otherShiftView() {
    let empName = currentDetail.formDetail.EmpName;
    if (myFormHelper.getLanguage() == 0) {
      empName = _.isEmpty(currentDetail.formDetail.OtherName) ? currentDetail.formDetail.OtherEnglishName : currentDetail.formDetail.OtherName;
    } else {
      empName = _.isEmpty(currentDetail.formDetail.OtherEnglishName) ? currentDetail.formDetail.OtherName : currentDetail.formDetail.OtherEnglishName;
    }
    const date = _.split(currentDetail.formDetail.OtherShiftDate, '-');
    let circlebg = styles.schedulecircleStyle;
    if (currentDetail.formDetail.OtherShiftType == ScheduleConstance.ShiftType_HOLIDAY || currentDetail.formDetail.OtherShiftType == ScheduleConstance.ShiftType_FESTIVAL) {
      circlebg = styles.schedulecircleStyleOrange;
    }
    const monthText = ScheduleConstance.getMonth(date[1], myFormHelper.getLanguage());
    const startData = getHHmmFormat(currentDetail.formDetail.OtherShiftFrom);
    const endData = getHHmmFormat(currentDetail.formDetail.OtherShiftTo);
    return (
      <View style={styles.scheduleRowStyle}>
        <View style={circlebg} >
          <Text allowFontScaling={false} style={{ fontSize: 18, color: 'white' }}>{date[2]}</Text>
          <Text allowFontScaling={false} style={{ fontSize: 12, color: 'white' }}>{I18n.t(monthText)}</Text>
        </View>

        <View style={styles.rowTextStyle} >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text allowFontScaling={false} style={{ fontSize: 14, color: '#030303' }}>{empName}</Text>
            <Line style={{ marginLeft: 6, marginRight: 6, height: 16, width: 1, backgroundColor: '#666' }} />
            <Text allowFontScaling={false} style={{ fontSize: 14, color: '#030303' }}>{currentDetail.formDetail.OtherPosition}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text allowFontScaling={false} style={{ fontSize: 14, color: '#666' }}>{currentDetail.formDetail.OtherShiftName}</Text>
            <Line style={{ marginLeft: 6, marginRight: 6, height: 16, width: 1, backgroundColor: '#666' }} />
            <Text allowFontScaling={false} style={{ fontSize: 14, color: '#666' }}>{startData}-{endData}</Text>
            <Line style={{ marginLeft: 6, marginRight: 6, height: 16, width: 1, backgroundColor: '#666' }} />
            <Text allowFontScaling={false} style={{ fontSize: 14, color: '#666' }}>{`${currentDetail.formDetail.OtherShiftHours}${I18n.t('mobile.module.changeshift.hour')}`}</Text>
          </View>
        </View>
      </View>
    );
  }
  // 换班成功后的对方的班次
  otherChangedShiftView() {
    let empName = currentDetail.formDetail.EmpName;
    if (myFormHelper.getLanguage() == 0) {
      empName = _.isEmpty(currentDetail.formDetail.OtherName) ? currentDetail.formDetail.OtherEnglishName : currentDetail.formDetail.OtherName;
    } else {
      empName = _.isEmpty(currentDetail.formDetail.OtherEnglishName) ? currentDetail.formDetail.OtherName : currentDetail.formDetail.OtherEnglishName;
    }
    const date = _.split(currentDetail.formDetail.MyShiftDate, '-');
    let circlebg = styles.schedulecircleStyle;
    if (currentDetail.formDetail.MyShiftType == ScheduleConstance.ShiftType_HOLIDAY || currentDetail.formDetail.MyShiftType == ScheduleConstance.ShiftType_FESTIVAL) {
      circlebg = styles.schedulecircleStyleOrange;
    }
    const monthText = ScheduleConstance.getMonth(date[1], myFormHelper.getLanguage());
    const startData = getHHmmFormat(currentDetail.formDetail.MyShiftFrom);
    const endData = getHHmmFormat(currentDetail.formDetail.MyShiftTo);
    return (
      <View style={styles.scheduleRowStyle}>
        <View style={circlebg} >
          <Text allowFontScaling={false} style={{ fontSize: 18, color: 'white' }}>{date[2]}</Text>
          <Text allowFontScaling={false} style={{ fontSize: 12, color: 'white' }}>{I18n.t(monthText)}</Text>
        </View>

        <View style={styles.rowTextStyle} >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text allowFontScaling={false} style={{ fontSize: 14, color: '#030303' }}>{empName}</Text>
            <Line style={{ marginLeft: 6, marginRight: 6, height: 16, width: 1, backgroundColor: '#666' }} />
            <Text allowFontScaling={false} style={{ fontSize: 14, color: '#030303' }}>{currentDetail.formDetail.OtherPosition}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text allowFontScaling={false} style={{ fontSize: 14, color: '#666' }}>{currentDetail.formDetail.MyShiftName}</Text>
            <Line style={{ marginLeft: 6, marginRight: 6, height: 16, width: 1, backgroundColor: '#666' }} />
            <Text allowFontScaling={false} style={{ fontSize: 14, color: '#666' }}>{startData}-{endData}</Text>
            <Line style={{ marginLeft: 6, marginRight: 6, height: 16, width: 1, backgroundColor: '#666' }} />
            <Text allowFontScaling={false} style={{ fontSize: 14, color: '#666' }}>{`${currentDetail.formDetail.MyShiftHours}${I18n.t('mobile.module.changeshift.hour')}`}</Text>
          </View>
        </View>
      </View>
    );
  }

  copyID = async () => {
    Clipboard.setString(currentDetail.formDetail.FormNumber);
    showMessage(messageType.success, I18n.t('mobile.module.detail.msg.copysuccess'));
  }

  render() {
    let empName = currentDetail.formDetail.EmpName;
    if (myFormHelper.getLanguage() == 0) {
      empName = _.isEmpty(currentDetail.formDetail.MyName) ? currentDetail.formDetail.MyEnglishName : currentDetail.formDetail.MyName;
    } else {
      empName = _.isEmpty(currentDetail.formDetail.MyEnglishName) ? currentDetail.formDetail.MyName : currentDetail.formDetail.MyEnglishName;
    }
    const statuscolor = Constance.getStatusColor(currentDetail.formDetail.ApproveState);
    const Data = getYYYYMMDDFormat(currentDetail.formDetail.ApplyDate);
    return (
      <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={FormDetailStyle.container}>
          <View>
            <View style={FormDetailStyle.formheadStyle}>
              <Text allowFontScaling={false} numberOfLines={1} style={{ flex: 1, textAlign: 'left', fontSize: 18, color: '#333' }}>{I18n.t('mobile.module.home.functions.s010100')}</Text>
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
            <Text allowFontScaling={false} style={styles.divisionBottom}>{`${I18n.t('mobile.module.myform.detail')}(${I18n.t('mobile.module.myform.changeshift.before')})`}</Text>
            {this.myShiftView()}
            <Line />
            <View style={[FormDetailStyle.rowTagStyle, { backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, marginTop: 0 }]}>
              <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.changeshift.reasonhinttab')}</Text>
              <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{currentDetail.formDetail.MyReason}</Text>
            </View>
            <Line />
            {this.otherShiftView()}
            <Line />
            <View style={[FormDetailStyle.rowTagStyle, { backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, marginTop: 0 }]}>
              <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.changeshift.reasonhinttab')}</Text>
              <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{currentDetail.formDetail.OtherReason}</Text>
            </View>
            <Text allowFontScaling={false} style={styles.division}>{I18n.t('mobile.module.detail.afterchangeshift')}</Text>
            {this.myChangedShiftView()}
            <Line />
            {this.otherChangedShiftView()}
            <Line />
            <View style={{ flexDirection: 'column', backgroundColor: '#EDEDF3', paddingBottom: 20 }}>
              <ApproveView detail={currentDetail.formDetail.ApprovalInfoList} formType={currentDetail.formType} />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '$color.containerBackground',
  },
  filletBgStyle: {
    flexDirection: 'column',
    marginLeft: 10,
    marginRight: 10,
    paddingBottom: 26,
    borderColor: '#e3e3e3',
    backgroundColor: 'white',
    borderRadius: 6,
    paddingRight: 56,
    height: 235,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  rowTextStyle: {
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 10,
  },
  schedulecircleStyle: {
    flexDirection: 'column',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1fd662',
    alignItems: 'center',
    justifyContent: 'center',
  },
  schedulecircleStyleOrange: {
    flexDirection: 'column',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffc817',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTagTitleStyle: {
    fontSize: 14,
    color: '#999999',
  },
  allTextStyle: {
    fontSize: 18,
    color: '#32CF78',
  },
  circleStyle: {
    flexDirection: 'column',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#999999',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgStyle: {
    width: 35,
    height: 35,
    alignSelf: 'center',
    borderRadius: 17,
  },
  actorimgStyle: {
    width: 35,
    height: 35,
    alignSelf: 'center',
    borderRadius: 17,
  },
  circleStyleLate: {
    flexDirection: 'column',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFCC00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleStyleEarly: {
    flexDirection: 'column',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0679FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionRowUserNameStyle: {
    marginRight: 18,
    width: device.width - 90,
    fontSize: 18,
    color: '$color.mainTitleTextColor',
  },
  applytimeStyle: {
    marginTop: 9,
    fontSize: 11,
    color: '#999999',
  },
  // 附件列表内容样式
  attListStyle: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rowTagStyle: {
    flexDirection: 'row',
    marginTop: 8,
  },
  rowStyle: {
    flexDirection: 'column',
  },
  scheduleRowStyle: {
    backgroundColor: 'white',
    height: 68,
    flexDirection: 'row',
    padding: 10,
    paddingTop: 8,
    alignItems: 'center',
    paddingBottom: 8,
  },
  rowContentDateStyle: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 9,
    marginRight: 10,
    flex: 1,
  },
  rowApproveStyle: {
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 10,
    paddingLeft: 9,
    paddingRight: 9,
    marginLeft: 18,
    marginRight: 18,
  },
  division: {
    paddingTop: 22,
    paddingBottom: 10,
    paddingLeft: 12,
    fontSize: 14,
    color: '#666',
    borderTopWidth: device.hairlineWidth,
    borderBottomWidth: device.hairlineWidth,
    borderColor: '$color.line',
  },
  divisionBottom: {
    paddingTop: 22,
    paddingBottom: 10,
    paddingLeft: 12,
    fontSize: 14,
    color: '#666',
    borderBottomWidth: device.hairlineWidth,
    borderColor: '$color.line',
  },
});
