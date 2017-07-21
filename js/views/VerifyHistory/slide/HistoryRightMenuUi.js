/**
 * 右侧滑动菜单内容
 */
import { DeviceEventEmitter, ScrollView, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import { device } from '@/common/Util';
import { button } from '@/common/Style';
import Text from '@/common/components/TextField';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
import { companysCode } from '@/common/Consts';
import FilterRadioBtn from './HistoryFilterRadioBtn';
import RangeRadioFilter from './HistoryRangeRadioFilter';
import MyFormHelper from '../../MyForms/MyFormHelper';
import Constance from '../../MyForms/Constance';

const customizedCompanyHelper = new CustomizedCompanyHelper();
const myFormHelper = new MyFormHelper();
let formtype = new Set();
let formstatus = new Set();
let monthIndex = '0';
let paddingtop = 0;
if (device.isIos) {
  paddingtop = 15;
}

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

let bthBg = '#1fd662';
let btnBgClick = button.background.active;

export default class HistoryRightMenuUi extends PureComponent {
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
      if (customizedCompanyHelper.getCompanyCode() == companysCode.Samsung && formtype === Constance.FORMTYPE_PROCESSLEAVEFORM) {
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
              {/*<FilterRadioBtn ref={(ref) => this.radioactive = ref} group={'status'} ID={'All'} style={{ margin: 5 }} textStr={I18n.t('mobile.module.verify.all')} onClick={this.onCheckPress} />*/}
              <FilterRadioBtn ref={(ref) => this.radiocompleted = ref} group={'status'} ID={'COMPLETED'} style={{ margin: 5 }} textStr={I18n.t('mobile.module.verify.handleresult.completed')} onClick={this.onCheckPress} />
              <FilterRadioBtn ref={(ref) => this.radioreject = ref} group={'status'} ID={'REJECT'} style={{ margin: 5 }} textStr={I18n.t('mobile.module.verify.handleresult.reject')} onClick={this.onCheckPress} />
              <FilterRadioBtn ref={(ref) => this.radiocacel = ref} group={'status'} ID={'SKIP'} style={{ margin: 5 }} textStr={I18n.t('mobile.module.verify.handleresult.Skip')} onClick={this.onCheckPress} />
              <FilterRadioBtn ref={(ref) => this.radiocacel = ref} group={'status'} ID={'AUTOCOMPLETED'} style={{ margin: 5 }} textStr={I18n.t('mobile.module.verify.handleresult.autocompleted')} onClick={this.onCheckPress} />
              <FilterRadioBtn ref={(ref) => this.radiocacel = ref} group={'status'} ID={'FORCECOMPLETED'} style={{ margin: 5 }} textStr={I18n.t('mobile.module.verify.handleresult.forcecompleted')} onClick={this.onCheckPress} />
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