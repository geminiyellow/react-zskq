/**
 * 请假详情布局
 */
import { Clipboard, ListView, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { device, keys } from '@/common/Util';
import { messageType, companyCodeList, moduleList } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import { getCurrentLanguage, getVersionId } from '@/common/Functions';
import I18n from 'react-native-i18n';
import Image from '@/common/components/CustomImage';
import Line from '@/common/components/Line';
import { languages } from '@/common/LanguageSettingData';
import ApproveView from './ApproveFlowView';
import FormDetailStyle from '../FormDetailStyle';
import AttachView from './AttachView';
import Constance from '../Constance';
import MyFormHelper from '../MyFormHelper';
import { getYYYYMMDDFormat, getYYYYMMDDhhmmFormat } from '@/common/Functions';

import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
const customizedCompanyHelper = new CustomizedCompanyHelper();

const myFormHelper = new MyFormHelper();
let currentDetail = null;
let annualLeaveHours = 0;
const travelDown = 'travel_down';
const travelUp = 'travel_up';

export default class LeaveDetailView extends PureComponent {
  constructor(...args) {
    super(...args);
    this.periodList = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: this.periodList.cloneWithRows([]),
      language: 0,
      showperiod: false,
      isShowCreadits: false,
      hours: '',
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
    this.companyCode = getVersionId(global.companyResponseData.version, moduleList.leave);
    if (companyCodeList.estee == this.companyCode) {
      annualLeaveHours = currentDetail.formDetail.AnnualLeaveHours;
      if (companyCodeList.estee == this.companyCode) {
        if (annualLeaveHours > 0) {
          this.setState({
            isShowCreadits: true,
          });
        }
      }
    }
    if (global.loginResponseData.BackGroundVersion.indexOf('Y') != -1) {
      if (companyCodeList.estee != this.companyCode && companyCodeList.samsung != this.companyCode && companyCodeList.gant != this.companyCode) {
        this.setState({
          dataSource: this.periodList.cloneWithRows(currentDetail.formDetail.LeaveFormDetail),
        });
      }
    }
    if (currentDetail.formDetail.LeaveUnit == 'H') {
      this.setState({
        hours: I18n.t('mobile.module.verify.hour')
      })
    } else if (currentDetail.formDetail.LeaveUnit == 'D') {
      this.setState({
        hours: I18n.t('mobile.module.verify.day')
      })
    }
  }

  getLeave() {
    if (companyCodeList.estee == this.companyCode || companyCodeList.samsung == this.companyCode || companyCodeList.gant == this.companyCode) {
      return (
        <View>
          <View style={FormDetailStyle.rowTagStyle}>
            <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.detail.leave.mode')}</Text>
            <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{currentDetail.formDetail.LeaveMode}</Text>
          </View>
          <Line style={FormDetailStyle.lineStyle} />
        </View>
      );
    } else {
      return (
        <View>
          <View style={FormDetailStyle.rowTagStyle}>
            <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.detail.leave.mode')}</Text>
            <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{Constance.getLeaveMode(currentDetail.formDetail.LeaveMode)}</Text>
          </View>
          <Line style={FormDetailStyle.lineStyle} />
        </View>
      );
    }
  }


  copyID = async () => {
    Clipboard.setString(currentDetail.formDetail.FormNumber);
    showMessage(messageType.success, I18n.t('mobile.module.detail.msg.copysuccess'));
  }

  /**
   * 添加乐宁教育 行政坐班/课时 item
   * modify by arespan
   * modify date 2017-07-14
   */
  onRenderLearningItem() {
    if (customizedCompanyHelper.getCompanyCode().toLowerCase() == 'lening') {
      this.employeeType = global.loginResponseData.EmployeeTypeId;
      this.leaveName = currentDetail.formDetail.LeaveName;
      switch (this.employeeType) {
        case '16_0':
        case '16_2':
          if (this.leaveName == '事假Personal Leave' || this.leaveName == '病假Sick Leave') {
            return (
              <View>{this.onShowLearningView()}</View>
            );
          } else {
            return null;
          }
          break;
        case '16_1':
          if (this.leaveName == '病假Sick Leave') {
            return (
              <View>{this.onShowLearningView()}</View>
            );
          } else {
            return null;
          }
          break;
        default:
          return null;
          break;
      }
    } else {
      return (
        <View>
          {this.getRepeatView()}
        </View>
      );
    }
  }

  onShowLearningView() {
    return (
      <View>
        <View style={FormDetailStyle.rowTagStyle}>
          <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.leaveapply.leaveapplylessonperiod')}</Text>
          <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{currentDetail.formDetail.ClassHours}</Text>
        </View>
        <Line style={FormDetailStyle.lineStyle} />
        <View style={FormDetailStyle.rowTagStyle}>
          <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.leaveapply.leaveapplyadministrativeoffice')}</Text>
          <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{currentDetail.formDetail.AdministrativeOffice}</Text>
        </View>
        <Line style={FormDetailStyle.lineStyle} />
      </View>
    );
  }


  /**
   * 添加额度模块
   * modify by arespan
   * modify date 2017-06-30
   */
  onRenderCreadits() {
    if (companyCodeList.estee == this.companyCode) {
      if (this.state.isShowCreadits) {
        return (
          <View>
            <View style={{ flexGrow: 1, height: 52 }}>
              <Text style={{ fontSize: 14, color: '#666666', height: 24, marginLeft: 12, marginTop: 22, marginBottom: 10 }}>{I18n.t('mobile.module.verify.detail.leave.quota')}</Text>
            </View>
            <View style={{ backgroundColor: '#ffffff', height: 30, justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 14, color: '#030303', marginLeft: 12 }}>{I18n.t('mobile.module.leaveapply.leaveapplycreaditleft')}</Text>
                <Text style={{ flexGrow: 1 }}></Text>
                <Text style={{ fontSize: 14, color: '#666666', marginRight: 12 }}>{`${annualLeaveHours}${I18n.t('mobile.module.verify.hour')}`}</Text>
              </View>
            </View>
          </View>
        );
      }
      return null;
    } else if (companyCodeList.standard == this.companyCode) {
      if (currentDetail.formDetail.UsedHours >= 0 && currentDetail.formDetail.ApprovingHours >= 0 && currentDetail.formDetail.RemainHours >= 0) {
        return (
          <View>
            <View >
              <Text allowFontScaling={false} style={{ paddingTop: 22, paddingBottom: 10, paddingLeft: 12, fontSize: 14, color: '#666' }}>{I18n.t('mobile.module.verify.detail.leave.quota')}</Text>
            </View>
            <View style={FormDetailStyle.formdetailsStyle2}>
              <View style={{ paddingLeft: 12, paddingRight: 12 }}>
                <View style={FormDetailStyle.rowTagStyle}>
                  <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.myform.detail.usedhours')}</Text>
                  <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{currentDetail.formDetail.UsedHours}{this.state.hours}</Text>
                </View>
                <Line style={FormDetailStyle.lineStyle} />
                <View style={FormDetailStyle.rowTagStyle}>
                  <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.myform.detail.approvinghours')}</Text>
                  <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{currentDetail.formDetail.ApprovingHours}{this.state.hours}</Text>
                </View>
                <Line style={FormDetailStyle.lineStyle} />
                <View style={FormDetailStyle.rowTagStyle}>
                  <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.leaveapply.leaveapplycreaditleft')}</Text>
                  <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{currentDetail.formDetail.RemainHours}{this.state.hours}</Text>
                </View>
              </View>
            </View>
          </View>
        );
      } return null;
    } return null;
  }

  loadAll() {
    this.setState({
      showperiod: !this.state.showperiod,
    });
  }

  onRenderLeavePeriod() {
    // 只有迭代版本才有
    if (global.loginResponseData.BackGroundVersion.indexOf('Y') == -1) {
      return null;
    }
    // 公司代码不是 三星 甘特 雅诗兰黛
    if (companyCodeList.estee == this.companyCode || companyCodeList.samsung == this.companyCode || companyCodeList.gant == this.companyCode) {
      return null;
    }
    const version = global.loginResponseData.BackGroundVersion;
    if (version.indexOf('Y') == -1) {
      return null;
    }
    if (this.state.showperiod) {
      return (
        <ListView
          ref={listview => this.listView = listview}
          dataSource={this.state.dataSource}
          enableEmptySections
          initialListSize={10}
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
          renderRow={(rowData, sectionID, rowID, highlightRow) => this.onRenderPeriodListItem(rowData, sectionID, rowID, highlightRow)}
        />
      );
    }
  }

  getRepeatView() {
    if (global.loginResponseData.BackGroundVersion.indexOf('Y') == -1) {
      return null;
    }
    if (companyCodeList.estee == this.companyCode || companyCodeList.samsung == this.companyCode || companyCodeList.gant == this.companyCode) {
      return null;
    }
    if (_.isEmpty(currentDetail.formDetail.FixedCount) || currentDetail.formDetail.FixedCount === '0' || currentDetail.formDetail.FixedCount === 0) {
      return (
        <View>
          <View style={FormDetailStyle.rowTagStyle}>
            <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.leaveapply.leaveapplyisrepeat')}</Text>
            <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{I18n.t('mobile.module.leaveapply.leaveapplyisrepeatno')}</Text>
          </View>
          <Line style={FormDetailStyle.lineStyle} />
        </View>
      );
    }

    return (
      <View>
        <View style={FormDetailStyle.rowTagStyle}>
          <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.leaveapply.leaveapplyisrepeat')}</Text>
          <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{I18n.t('mobile.module.leaveapply.leaveapplyisrepeatyes')}</Text>
        </View>
        <Line style={FormDetailStyle.lineStyle} />
        <View style={FormDetailStyle.rowTagStyle}>
          <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.leaveapply.leaveapplyisrepeattimes')}</Text>
          <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{currentDetail.formDetail.FixedCount}</Text>
        </View>
        <Line style={FormDetailStyle.lineStyle} />
      </View>
    );
  }

  getLoadAllView() {
    // 时段不为空
    if (companyCodeList.estee == this.companyCode || companyCodeList.samsung == this.companyCode || companyCodeList.gant == this.companyCode) {
      return null;
    }
    if (_.isEmpty(currentDetail.formDetail.FixedCount)) {
      return null;
    }
    if (currentDetail.formDetail.FixedCount === '0') {
      return null;
    }
    return (
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', paddingTop: 10, paddingBottom: 10 }} onPress={() => this.loadAll()} >
        <Image style={{ width: 8, height: 4 }} source={{ uri: !this.state.showperiod ? travelDown : travelUp }} />
        <Text allowFontScaling={false} style={FormDetailStyle.allTextStyle}>{(this.state.showperiod) ? I18n.t('mobile.module.detail.collapse') : I18n.t('mobile.module.detail.expend')}</Text>
      </TouchableOpacity>
    );
  }

  onRenderPeriodListItem(rowData, sectionID, rowID, highlightRow) {
    const startTime = getYYYYMMDDhhmmFormat(rowData.startTime);
    const endTime = getYYYYMMDDhhmmFormat(rowData.endTime);

    return (
      <View key={`${sectionID}-${rowID}`}>
        <Text allowFontScaling={false} style={{ paddingTop: 22, paddingBottom: 10, paddingLeft: 12, fontSize: 14, color: '#666' }}>{`${I18n.t('mobile.module.leaveapply.leaveapplyrecord')}${parseInt(rowID) + 1}`}</Text>
        <View style={{ backgroundColor: 'white', paddingLeft: 12, paddingRight: 12, paddingBottom: 12 }}>
          <View style={FormDetailStyle.rowTagStyle}>
            <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.leaveapply.leaveapplystarttime')}</Text>
            <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{startTime}</Text>
          </View>
          <Line style={FormDetailStyle.lineStyle} />
          <View style={FormDetailStyle.rowTagStyle}>
            <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.leaveapply.leaveapplyendtime')}</Text>
            <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{endTime}</Text>
          </View>
          <Line style={FormDetailStyle.lineStyle} />
          <View style={FormDetailStyle.rowTagStyle}>
            <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{Constance.getLeaveUnit(currentDetail.formDetail.LeaveUnit)}</Text>
            <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{rowData.hours}</Text>
          </View>
          <Line style={FormDetailStyle.lineStyle} />
        </View>
      </View>
    );
  }

  render() {
    const statuscolor = Constance.getStatusColor(currentDetail.formDetail.ApproveState);
    const startData = getYYYYMMDDhhmmFormat(`${currentDetail.formDetail.StartDate} ${currentDetail.formDetail.StartTime}`);
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
              <Text allowFontScaling={false} numberOfLines={1} style={{ flex: 1, textAlign: 'left', fontSize: 18, color: '#333' }}>{currentDetail.formDetail.LeaveName}</Text>
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
            <View style={FormDetailStyle.formdetailsStyle}>
              <View style={{ paddingLeft: 12, paddingRight: 12 }}>
                {this.getLeave()}
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
                  <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{Constance.getLeaveUnit(currentDetail.formDetail.LeaveUnit)}</Text>
                  <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{`${currentDetail.formDetail.LeaveHours}`}</Text>
                </View>
                <Line style={FormDetailStyle.lineStyle} />
                {this.onRenderLearningItem()}
                <View style={FormDetailStyle.rowTagStyle}>
                  <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.myform.leave.reason')}</Text>
                  <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{currentDetail.formDetail.Reason}</Text>
                </View>
                <Line style={FormDetailStyle.lineStyle} />
                {
                  (companyCodeList.gant == this.companyCode) ? null :
                    (
                      <View>
                        <View style={FormDetailStyle.rowTagStyle}>
                          <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.reasondetail')}</Text>
                          <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{currentDetail.formDetail.ReasonDetail}</Text>
                        </View>
                        <Line style={FormDetailStyle.lineStyle} />
                      </View>
                    )
                }
              </View>
              <AttachView detail={currentDetail} navigator={this.props.navigator} />
            </View>
            {this.getLoadAllView()}
          </View>
          {this.onRenderLeavePeriod()}
          {this.onRenderCreadits()}

          <View style={{ flexDirection: 'column', backgroundColor: '#EDEDF3', paddingBottom: 20 }}>
            <ApproveView detail={currentDetail.formDetail.ApprovalInfoList} />
          </View>
        </View>
      </ScrollView>
    );
  }
}