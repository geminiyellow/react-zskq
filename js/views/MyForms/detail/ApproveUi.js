/**
 * 主管审核表单详情 同意弹窗功能
 */
import { DeviceEventEmitter, ListView, TouchableOpacity, KeyboardAvoidingView, Keyboard, View, NativeModules } from 'react-native';
import { device, event } from '@/common/Util';
import React, { PureComponent } from 'react';
import Text from '@/common/components/TextField';
import _ from 'lodash';
import NavBar from '@/common/components/NavBar';
import ScrollView from '@/common/components/ScrollView';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import { POST } from '@/common/Request';
import { SignOffEmployeeFormRequest } from '@/common/api';
import TextArea from '@/common/components/TextArea';
import Image from '@/common/components/CustomImage';
import Line from '@/common/components/Line';
import { showMessage } from '@/common/Message';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
import { messageType } from '@/common/Consts';
import { color } from '@/common/Style';
import Constance from '../Constance';

const customizedCompanyHelper = new CustomizedCompanyHelper();
const checkboxNormal = 'checkbox_common';
const checkboxChecked = 'checkbox_selected';
const { RNManager } = NativeModules;
let currentDetail = null;
let MealTypeList = [];
// 是否是加班类型
let isOvertimeType = false;
// 是否允许修改转调休
let IsAllowedToModifyCompTime = false;
// 是否允许转调休 1: 允许   0： 不允许
let IsCompTime = 1;
// 是否转调休可见
let CompTimeIsVisable = false;
// 是否显示餐别
let MealTypeVisible = false;

let approveAddvice = null;
// 是否需要审核意见
let IsNeedApproveComment = 'N';
// 是否允许改餐别
let IsAllowedToModifyMealType = false;

const KeyboardAvoiding = device.isIos ? View : KeyboardAvoidingView;

export default class ApproveUi extends PureComponent {
  constructor(...args) {
    super(...args);
    this.list = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      checked: false,
      mealtypechecked: false,
      dataSource: this.list.cloneWithRows([]),
      advice: '',
      isCompTime: IsCompTime,
      listheight: 44 * 4,
      update: true,
      behavior: null,
    };
  }

  componentWillMount() {
    currentDetail = this.props.passProps.data;
    if (!currentDetail) return;
    if (currentDetail.formType == Constance.FORMTYPE_PROCESSOVERTIMEFORM) isOvertimeType = true;

    if (currentDetail.formDetail && currentDetail.formDetail.OTSubInfo) {
      CompTimeIsVisable = currentDetail.formDetail.OTSubInfo.CompTimeIsVisable;
      IsAllowedToModifyCompTime = currentDetail.formDetail.OTSubInfo.IsAllowedToModifyCompTime;
      IsAllowedToModifyMealType = currentDetail.formDetail.OTSubInfo.IsAllowedToModifyMealType;
      IsCompTime = currentDetail.formDetail.OTSubInfo.IsCompTime;
      MealTypeVisible = currentDetail.formDetail.OTSubInfo.MealTypeVisible;
      let templist = [];
      if (currentDetail.formDetail.OTSubInfo.MealTypeList && !_.isEmpty(currentDetail.formDetail.OTSubInfo.MealTypeList)) templist = currentDetail.formDetail.OTSubInfo.MealTypeList;

      templist.map(item => {
        const temp = {};
        for (const k in item) {
          temp[k] = item[k];
        }
        MealTypeList.push(temp);
      });
      this.setState({
        isCompTime: IsCompTime,
        dataSource: this.list.cloneWithRows(MealTypeList),
      });
    }
  }

  // 组件渲染完成
  componentDidMount() {
    if (!device.isIos) {
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.setState({ behavior: 'height' }));
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this.setState({ behavior: null }));
    }
  }

  componentWillUnmount() {
    if (!device.isIos) {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }
    MealTypeList = [];
    IsAllowedToModifyCompTime = false;
    IsAllowedToModifyMealType = false;
    isOvertimeType = false;
    approveAddvice = null;
    CompTimeIsVisable = false;
  }

  // 同意审核实现
  onApproveButtonPress() {
    if (IsNeedApproveComment == 'Y' && _.isEmpty(approveAddvice)) {
      showMessage(messageType.error, I18n.t('mobile.module.verify.comment.hint'));
      return;
    }

    // 不是加班类型表单
    if (!isOvertimeType) {
      this.batchRequest(currentDetail.formDetail.WorkItemId, approveAddvice, 'A');
    } else {
      OTParams = {};
      OTParams.PRI_Id = currentDetail.formDetail.ProcessId;
      if (CompTimeIsVisable && IsAllowedToModifyCompTime) {
        // 允许转调休发生变化
        if (this.state.isCompTime != IsCompTime) {
          OTParams.ModifiedCompTime = this.state.isCompTime;
        }
      }

      if (MealTypeList && MealTypeList.length > 0) {
        const ids = [];
        for (item of MealTypeList) {
          if (item.IsChecked) ids.push(item.Id);
        }
        const result = ids.join(',');
        OTParams.ModifiedMealId = result;
      }
      this.batchRequest(currentDetail.formDetail.WorkItemId, approveAddvice, 'A', true, OTParams);
    }
  }

  // 获取餐别布局
  getMealTypeView() {
    let mealtypeTitleView = null;
    if (MealTypeList.length > 0) {
      mealtypeTitleView = (
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#E7E7E7', height: 30, paddingLeft: 18, paddingRight: 16 }}>
          <Text style={{ fontSize: 14, color: '#333' }}>{I18n.t('mobile.module.verify.overtime.meallist')}</Text>
        </View>
      );
    }
    if (isOvertimeType && MealTypeVisible) {
      return (
        <View>
          {mealtypeTitleView}
          {this.getMealTypeListView()}
        </View>
      );
    }
    return null;
  }

  // 获取餐别列表
  getMealTypeListView() {
    let listheighttemp = 44 * 4;
    let allMealListView = null;
    // 餐别列表大于4条数据  并且当前显示4条
    if (MealTypeList.length > 4 && this.state.listheight == 44 * 4) {
      allMealListView = (
        <TouchableOpacity style={{ height: 40, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.allMealList()}>
          <Text style={{ fontSize: 14, color: '#1fd662' }}>{I18n.t('mobile.module.detail.viewall')}</Text>
        </TouchableOpacity>
      );
    } else {
      listheighttemp = MealTypeList.length * 44;
    }
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <ListView
          style={{ backgroundColor: 'white', paddingLeft: 18, paddingRight: 16, paddingBottom: 10, height: listheighttemp }}
          dataSource={this.state.dataSource}
          removeClippedSubviews={false}
          enableEmptySections
          showsVerticalScrollIndicator={false}
          renderRow={(rowData, sectionID, rowID, highlightRow) => this.inflateItem(rowData, sectionID, rowID, highlightRow)}
        />
        {allMealListView}
      </View>
    );
  }

  // 获取转调休布局
  getCompTimeView() {
    if (isOvertimeType && CompTimeIsVisable) {
      return (
        <TouchableOpacity style={{ height: 44, backgroundColor: 'white', paddingLeft: 18, paddingRight: 15, marginTop: 8, flexDirection: 'row', alignItems: 'center' }} onPress={() => this.changeAllowedToModifyCompTime()}>
          <Text numberOfLines={2} style={styles.compTimeStyle}>{I18n.t('mobile.module.verify.overtime.comptime')}</Text>
          <View style={{ flex: 1 }} />
          <Image style={{ width: 20, height: 20 }} source={{ uri: this.state.isCompTime == '1' ? checkboxChecked : checkboxNormal }} />
        </TouchableOpacity>
      );
    }
    return null;
  }
  // 审核意见布局
  getAdviceView() {
    if (!_.isEmpty(global.loginResponseData) && !_.isEmpty(global.loginResponseData.SysParaInfo)) {
      IsNeedApproveComment = global.loginResponseData.SysParaInfo.IsNeedApproveComment;
    }
    return (
      <TextArea
        title={I18n.t('mobile.module.verify.comment')}
        placeholder={I18n.t('mobile.module.verify.comment.hint')}
        value={approveAddvice}
        onChange={(text) => {
          // 去掉
          text = text.replace(/(^\s*)|(\s*$)/g, "")
          approveAddvice = text;
          this.setState({
            update: !this.state.update,
          });
        }}
      />
    );
  }

  // 获取加班类型 审批布局
  getOverTimeView() {
    if (isOvertimeType) {
      return (
        <View>
          {this.getCompTimeView()}

          {this.getMealTypeView()}
        </View>
      );
    }
    return null;
  }

  // 批量审核
  batchRequest(ids, comment, signType, IsOTForm, OTParams) {
    const params = {};
    params.SessionId = global.loginResponseData.SessionId;
    params.WorkItemId = ids;
    params.Comment = comment;
    params.SignType = signType;
    params.IsOTForm = IsOTForm;
    params.OTParams = OTParams;
    const prefix = customizedCompanyHelper.getPrefix();
    POST(SignOffEmployeeFormRequest(prefix), params, (responseData) => {
      RNManager.hideLoading();
      DeviceEventEmitter.emit(event.REFRESH_CORNER_EVENT, true);
      const { callback } = this.props.passProps;
      callback();
      showMessage(messageType.success, I18n.t('mobile.module.verify.messge.success'));
      this.props.navigator.pop();
    }, (err) => {
      RNManager.hideLoading();
      showMessage(messageType.error, err);
    });
    RNManager.showLoading('');
  }

  // 点击餐别列表行
  pressMealType(rowData, rowID) {
    if (!IsAllowedToModifyMealType) return;

    MealTypeList[rowID].IsChecked = !MealTypeList[rowID].IsChecked;

    this.setState({
      dataSource: this.list.cloneWithRows(MealTypeList),
    });
  }

  inflateItem(rowData, sectionID, rowID, highlightRow) {
    return (
      <View style={{ flexDirection: 'column' }}>
        <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', height: 44 }} key={`${sectionID}-${rowID}`} onPress={() => this.pressMealType(rowData, rowID)}>
          <Text style={{ fontSize: 16, color: '#000' }}>{`${rowData.MealName}  ${rowData.MealTimeFrom} - ${rowData.MealTimeTo}`}</Text>
          <View style={{ flex: 1 }} />
          <Image style={{ width: 20, height: 20 }} source={{ uri: rowData.IsChecked ? checkboxChecked : checkboxNormal }} />
        </TouchableOpacity>
        <Line />
      </View>
    );
  }

  changeAllowedToModifyCompTime() {
    if (!IsAllowedToModifyCompTime) return;

    if (this.state.isCompTime == 1) {
      this.setState({
        isCompTime: 0,
      });
    } else {
      this.setState({
        isCompTime: 1,
      });
    }
  }

  allMealList() {
    this.setState({
      listheight: MealTypeList.length * 44,
    });
  }

  render() {
    return (
      <View style={styles.container}>

        <NavBar title={I18n.t('mobile.module.detail.approval.addvice')} onPressLeftButton={() => { Keyboard.dismiss(); this.props.navigator.pop() }} rightContainerLeftButtonTitle={I18n.t('mobile.module.detail.nav.menu.publish')} onPressRightContainerLeftButton={() => this.onApproveButtonPress()} />
        <KeyboardAvoidingView behavior={this.state.behavior} style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <View style={{ flexDirection: 'column' }}>
              {this.getOverTimeView()}
              <View style={{ marginBottom: 20 }}>
                {this.getAdviceView()}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
  },
  // 多行文本框统一加下这个样式
  multilineInput: {
    '@media ios': {
      paddingVertical: 5,
    },
    flex: 1,
    paddingLeft: 0,
    height: 300,
    marginTop: 8,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  compTimeStyle: {
    fontSize: 16,
    color: '#333',
    width: device.width - 90,
  },
});
