/**
 * 主管审核表单详情 同意弹窗功能
 */
import { DeviceEventEmitter, ScrollView, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import { device } from '@/common/Util';
import Text from '@/common/components/TextField';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
import { companysCode } from '@/common/Consts';
import { button } from '@/common/Style';
import FilterRadioBtn from './FilterRadioBtn';
import RangeRadioFilter from './RangeRadioFilter';
import MyFormHelper from '../MyFormHelper';
import Constance from './../Constance';

const customizedCompanyHelper = new CustomizedCompanyHelper();
const myFormHelper = new MyFormHelper();
let formtype = new Set();
let formstatus = new Set();
let monthIndex = '0';
let paddingtop = 0;
if (device.isIos) {
  paddingtop = 15;
}

let bthBg = '#1fd662';
let btnBgClick = button.background.active;

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    paddingTop: paddingtop,
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  menuTitleStyle: {
    marginLeft: 18,
    marginTop: 22,
    color: 'black',
    fontSize: 18,
  },
  bottomStyle: {
    height: 44,
    flexDirection: 'row',
    borderTopColor: '#e3e3e3',
    borderTopWidth: device.hairlineWidth,
  },
  resetContainerStyle: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmContainerStyle: {
    flex: 1,
    backgroundColor: '#1fd662',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBtnStyle: {
    fontSize: 17,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confirmBtnStyle: {
    fontSize: 17,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default class RightMenuUi extends PureComponent {
  constructor(...args) {
    super(...args);
    if (_.isEmpty(global.companyResponseData.color.btnBg) || _.isUndefined(global.companyResponseData.color.btnBg)) {
      bthBg = button.background.normal;
    } else {
      bthBg = global.companyResponseData.color.btnBg;
    }

    if (!_.isEmpty(global.companyResponseData.color.btnBgClick) && !_.isUndefined(global.companyResponseData.color.btnBgClick)) {
      btnBgClick = global.companyResponseData.color.btnBgClick;
    } else {
      btnBgClick = button.background.active;
    }
    this.state = {
      reset: true,
      backgroundColor: bthBg,
      btnClickBg: btnBgClick,
    };
  }

  componentWillUnmount() {
    formtype = new Set();
    formstatus = new Set();
    monthIndex = '0';
  }

  onCheckPress(group, btnID, checked) {
    // console.log(`btnID : ${btnID}  checked: ${checked}`);
    if (!_.isEmpty(btnID)) {
      if (group == 'type') {
        if (checked) formtype.add(btnID);
        else formtype.delete(btnID);
      } else if (group == 'status') {
        if (checked) formstatus.add(btnID);
        else formstatus.delete(btnID);
      }
    }
  }

  getFormTypeViews() {
    const views = [];
    const types = myFormHelper.getTypes();
    let i = 0;
    for (const type of types) {
      i = i + 1;
      views.push(
        <FilterRadioBtn key={`index-${i}`} group={'type'} ID={type.Type} style={{ margin: 5 }} textStr={type.Description} onClick={this.onCheckPress} />
      );
    }
    return [...views];
  }

  /**
   * 确定按钮事件
   */
  onDonePress = () => {
    let formType = '';
    let formStatus = '';
    for (let t of formtype) {
      let samsung = '';
      // 三星定制 请假类型表单 。在表单类型后面加V1
      if (customizedCompanyHelper.getCompanyCode() == companysCode.Samsung && t === Constance.FORMTYPE_PROCESSLEAVEFORM) {
        samsung = 'V1';
      }
      formType += t + samsung + '|';
    }
    formType = formType.substring(0, formType.length - 1);
    for (let t of formstatus) {
      formStatus += t + '|';
    }
    formStatus = formStatus.substring(0, formStatus.length - 1);
    const doneCallback = this.props.doneCallback;
    if (_.isEmpty(formType)) formType = 'All';
    if (_.isEmpty(formStatus)) formStatus = 'All';
    if (_.isEmpty(monthIndex)) monthIndex = '0';
    doneCallback(formType, formStatus, monthIndex);
  }

  /**
   * 确定按钮事件
   */
  onResetPress = () => {
    formtype.clear();
    formstatus.clear();
    const formType = 'All';
    const formStatus = 'All';
    const resetCallback = this.props.resetCallback;
    monthIndex = '0';
    DeviceEventEmitter.emit('FilterRadioBtnReset', true);
    this.rangefilter.onReset();

    resetCallback(formType, formStatus, monthIndex);
  }

  onRangePress(index) {
    monthIndex = index;
  }

  onPressOutShiftBg() {
    if (!_.isEmpty(global.companyResponseData.color.btnBg) && !_.isUndefined(global.companyResponseData.color.btnBg)) {
      this.setState({
        backgroundColor: global.companyResponseData.color.btnBg,
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Text style={styles.menuTitleStyle}>{I18n.t('mobile.module.myform.formtype')}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingLeft: 15, paddingRight: 5, paddingTop: 9 }}>
              {this.getFormTypeViews()}
            </View>
            <Text style={styles.menuTitleStyle}>{I18n.t('mobile.module.myform.formstatus')}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingLeft: 15, paddingRight: 5, paddingTop: 9 }}>
              <FilterRadioBtn ref={(ref) => this.radioactive = ref} group={'status'} ID={'ACTIVE'} style={{ margin: 5 }} textStr={I18n.t('mobile.module.myform.state.verifying')} onClick={this.onCheckPress} />
              <FilterRadioBtn ref={(ref) => this.radiocompleted = ref} group={'status'} ID={'COMPLETED'} style={{ margin: 5 }} textStr={I18n.t('mobile.module.myform.state.completed')} onClick={this.onCheckPress} />
              <FilterRadioBtn ref={(ref) => this.radioreject = ref} group={'status'} ID={'REJECT'} style={{ margin: 5 }} textStr={I18n.t('mobile.module.myform.state.rejected')} onClick={this.onCheckPress} />
              <FilterRadioBtn ref={(ref) => this.radiocacel = ref} group={'status'} ID={'CANCEL'} style={{ margin: 5 }} textStr={I18n.t('mobile.module.myform.state.canceled')} onClick={this.onCheckPress} />
            </View>
            <Text style={styles.menuTitleStyle}>{I18n.t('mobile.module.myform.datasection')}</Text>
            <RangeRadioFilter ref={ref => this.rangefilter = ref} rangePress={this.onRangePress} />
          </View>
        </ScrollView>
        <View style={styles.bottomStyle}>
          <TouchableOpacity style={styles.resetContainerStyle} onPress={this.onResetPress} >
            <Text numberOfLines={1} style={styles.bottomBtnStyle}>{I18n.t('mobile.module.myform.reset')}</Text>
          </TouchableOpacity>
          <TouchableHighlight
            style={[styles.confirmContainerStyle, { backgroundColor: this.state.backgroundColor }]}
            onPress={this.onDonePress}
            underlayColor={this.state.btnClickBg}
            onPressOut={() => this.onPressOutShiftBg} >
            <Text numberOfLines={1} style={styles.confirmBtnStyle}>{I18n.t('mobile.module.myform.done')}</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}