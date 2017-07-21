/**
 * 加班申请界面
 */

import { InteractionManager, KeyboardAvoidingView, Keyboard, View } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import I18n from 'react-native-i18n';
import Line from '@/common/components/Line';
import Text from '@/common/components/TextField';
import ScrollView from '@/common/components/ScrollView';
import AttachmentModal from '@/common/components/Attachment';
import ModalWithImage from '@/common/components/modal/ModalWithImage';
import NavBar from '@/common/components/NavBar';
import { device } from '@/common/Util';
import { messageType } from '@/common/Consts';
import { GET, ABORT } from '@/common/Request';
import { showMessage } from '@/common/Message';
import { LoadingManager } from '@/common/Loading';
import { getNowFormatDate } from '@/common/Functions';
import UmengAnalysis from '@/common/components/UmengAnalysis';
import { getOvertimePresetInfo, getOverTimeRule, getEmployeeActualOTHours } from '@/common/api';
import Constance from './constants';
import Amount from './components/Amount';
import FormItem from './components/FormItem';
import MealModal from './components/MealModal';
import SubmitForm from './components/SubmitForm';
import Attachment from './components/Attachment';
import PickerTime from './components/PickerTime';
import MealAndShift from './components/MealAndShift';
import PickerOption from './components/PickerOption';
import AttachmentDetail from './components/AttachmentDetail';
import styles from './styles';

const KeyboardAvoiding = device.isIos ? View : KeyboardAvoidingView;

// 导入图片信息和表单类型信息
const { overTimeAmount, mealTypeRefreshIndex, mealTypeLoadSub, formTypeWordAndWord, formTypeWordAndImage, formTypeInput } = Constance;
// 导入picker的类型信息
const { pickerDate, pickerStart, pickerEnd, pickerActualDate, pickerReason, otTypeIsShow } = Constance;

export default class OvertimeApply extends PureComponent {

  constructor(...props) {
    super(...props);
    this.state = {
      messageSubTitle: '',
      behavior: null,
    };
    // 接口信息初始化
    this.getOverTimePreSetInfo = '';
    this.getEmployeeOverTimeRule = '';
    this.getEmployeeActualOTHours = '';
  }

  componentWillMount() {
    UmengAnalysis.onPageBegin('OvertimeApply');
  }

  // 组件渲染完成
  componentDidMount() {
    this.onGetOvertimePresetInfo(getNowFormatDate());
    if (!device.isIos) {
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.setState({ behavior: 'height' }));
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this.setState({ behavior: null }));
    }
  }

  // 组件卸载之前的操作
  componentWillUnmount() {
    UmengAnalysis.onPageEnd('OvertimeApply');
    if (!device.isIos) {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }
    LoadingManager.stop();
    ABORT('getOvertimePresetInfo');
    ABORT('getOverTimeRule');
    ABORT('getEmployeeActualOTHours');
  }

  // 初始化加班数据
  onGetOvertimePresetInfo = (selectDate) => {
    // 查询参数
    const params = {};
    params.overtimeDate = selectDate;
    LoadingManager.start();
    GET(getOvertimePresetInfo('', params), (responseData) => {
      LoadingManager.done();
      InteractionManager.runAfterInteractions(() => {
        // 判断是否render
        if (_.isEmpty(this.otAmount || this.pickerOption || this.textType
          || this.textTotalHours || this.submit || this.mealAndShift)) { return; }
        // 处理接口返回的数据
        this.getOverTimePreSetInfo = responseData;
        // 显示加班的额度
        this.otAmount.onResetOvertimeAmount(this.getOverTimePreSetInfo);
        // 加载加班的表单数据
        this.pickerOption.onSetPickerRefresh(this.getOverTimePreSetInfo);
        this.pickerTime.onSetPickerRefresh(this.getOverTimePreSetInfo);
        // 显示加班类型
        if (global.loginResponseData && global.loginResponseData.SysParaInfo.IsShowOTType) {
          if (global.loginResponseData.SysParaInfo.IsShowOTType === otTypeIsShow) {
            if (this.getOverTimePreSetInfo.OTName) {
              this.textType.onSetRefreshInfo(this.getOverTimePreSetInfo.OTName);
            }
          }
        }
        // 显示加班时长
        this.textTotalHours.onSetRefreshInfo('0.00');
        // 显示按钮的颜色
        this.submit.onSetButtonColor(this.getOverTimePreSetInfo);
        // 判断是否重新加载页面
        this.mealAndShift.onSetShowConfiguration(mealTypeRefreshIndex);
        this.mealAndShift.onSetFirstRefreshData('');
        this.mealAndShift.onSetSecondRefreshData('');
      });
    }, (message) => {
      LoadingManager.done();
      showMessage(messageType.error, message);
    }, 'getOvertimePresetInfo');
  }

  // 加载加班规则
  onGetOvertimeRule = () => {
    // 判断是否重新加载页面
    this.mealAndShift.onSetShowConfiguration(mealTypeRefreshIndex);
    this.mealAndShift.onSetFirstRefreshData('');
    this.mealAndShift.onSetSecondRefreshData('');
    const params = {};
    // 获取picker选中的值
    const { selectDateTemp, selectStartTemp, selectEndTemp } = this.pickerTime.onGetPickerSelectData();
    params.overTimeDate = selectDateTemp;
    params.overtimeType = this.getOverTimePreSetInfo.OTType;
    params.startTime = selectStartTemp;
    params.endTime = selectEndTemp;
    GET(getOverTimeRule(params), (responseData) => {
      this.getEmployeeOverTimeRule = responseData;
      // 设置加班的餐别
      this.mealAndShift.onSetFirstRefreshData(this.getEmployeeOverTimeRule);
      // 设置加班弹出框的显示数据
      const { isMealClick, mealData } = this.mealAndShift.onGetRefreshData();
      this.mealType.onSetRefreshData(this.getEmployeeOverTimeRule, isMealClick, mealData);
      // 设置加班的时数
      this.onGetEmployeeActualOTHours(this.mealAndShift.onGetMealType());
    }, (message) => {
      showMessage(messageType.error, message);
    }, 'getOverTimeRule');
  }

  // 加载加班的时数
  onGetEmployeeActualOTHours = (type) => {
    const params = {};
    // 获取picker选中的值
    const { selectDateTemp, selectStartTemp, selectEndTemp } = this.pickerTime.onGetPickerSelectData();
    params.overTimeDate = selectDateTemp;
    params.overtimeType = this.getOverTimePreSetInfo.OTType;
    params.startTime = selectStartTemp;
    params.endTime = selectEndTemp;
    // mealId(输入模式下，放空， type为1时，是输入用餐时数，不用加载数据)  mealHours（选择模式下，放0，type为2时，是加载餐别信息）
    const { mealHours, mealData } = this.mealAndShift.onGetRefreshData();
    if (type === mealTypeLoadSub) {
      if (!_.isEmpty(this.getEmployeeOverTimeRule) && this.getEmployeeOverTimeRule.ManualMealModeVisable) {
        if (_.isEmpty(mealHours)) {
          showMessage(messageType.error, I18n.t('mobile.module.overtime.overtimeapplym"'));
          return;
        }
        params.mealHours = mealHours;
      } else {
        if (mealData.length != 0) {
          params.mealId = `${mealData.join(',')},`;
        }
        params.mealHours = 0;
      }
    } else {
      params.mealHours = 0;
    }
    GET(getEmployeeActualOTHours(params), (responseData) => {
      this.getEmployeeActualOTHours = responseData;
      // 设置提交的表单数据
      this.submit.onSetSubmitParams(this.getEmployeeOverTimeRule, this.getEmployeeActualOTHours);
      // 设置加班的转调休和加班时数
      this.mealAndShift.onSetSecondRefreshData(this.getEmployeeActualOTHours);
    }, (message) => {
      showMessage(messageType.error, message);
    }, 'getEmployeeActualOTHours');
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar title={I18n.t('mobile.module.overtime.overtimenavigationbartitle')} onPressLeftButton={() => { Keyboard.dismiss(); this.props.navigator.pop() } } />
        <KeyboardAvoiding behavior={this.state.behavior} style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1 }} behavior={this.state.behavior}>
            <Amount ref={ref => { this.otAmount = ref; } } />
            <View style={styles.itemAllView}>
              <FormItem ref={ref => { this.textDate = ref; } } topLine onPress={(type) => this.pickerTime.onOpenPicker(pickerDate)} leftTextView={I18n.t('mobile.module.overtime.overtimeapplydate')} typeItem={formTypeWordAndImage} />
              {
                (global.loginResponseData.SysParaInfo.IsShowOTType && global.loginResponseData.SysParaInfo.IsShowOTType === otTypeIsShow) ?
                  <View>
                    <FormItem ref={ref => { this.textType = ref; } } topLine topLineStyle={styles.lineView} bottomLine leftTextView={I18n.t('mobile.module.overtime.overtimeapplytype')} typeItem={formTypeWordAndWord} />
                  </View> : <Line />
              }
            </View>
            {
              // 判断是否显示加班实际日期
              (global.loginResponseData.SysParaInfo.OTDayTypeIsVisible && global.loginResponseData.SysParaInfo.OTDayTypeIsVisible === 'Y') ?
                <View style={styles.itemAllView}>
                  <FormItem ref={ref => { this.textActualDate = ref; } } topLine bottomLine onPress={(type) => this.pickerOption.onOpenPicker(pickerActualDate)} leftTextView={I18n.t('mobile.module.overtime.overtimeapplyactualdate')} typeItem={formTypeWordAndImage} />
                </View> : null
            }
            <View style={styles.itemAllView}>
              <FormItem ref={ref => { this.textStart = ref; } } topLine onPress={(type) => this.pickerTime.onOpenPicker(pickerStart)} leftTextView={I18n.t('mobile.module.overtime.overtimeapplystarttime')} typeItem={formTypeWordAndImage} />
              <FormItem ref={ref => { this.textEnd = ref; } } topLineStyle={styles.lineView} bottomLine bottomLineStyle={styles.lineView} onPress={(type) => this.pickerTime.onOpenPicker(pickerEnd)} leftTextView={I18n.t('mobile.module.overtime.overtimeapplyendtime')} typeItem={formTypeWordAndImage} />
              <FormItem ref={ref => { this.textTotalHours = ref; } } topLine={false} bottomLine leftTextView={I18n.t('mobile.module.overtime.overtimeapplyworkinghour')} typeItem={formTypeWordAndWord} />
            </View>
            <MealAndShift
              ref={ref => { this.mealAndShift = ref; } } onGetEmployeeActualOTHours={(type) => this.onGetEmployeeActualOTHours(type)}
              textHoursRefresh={(text) => this.textTotalHours.onSetRefreshInfo(text)} showModal={() => this.mealType.open()} />
            <View style={styles.itemAllView}>
              <FormItem ref={ref => { this.textReason = ref; } } topLine bottomLine onPress={(type) => this.pickerOption.onOpenPicker(pickerReason)} leftTextView={I18n.t('mobile.module.overtime.overtimeapplyreason')} typeItem={formTypeWordAndImage} />
            </View>
            <FormItem ref={ref => { this.textReasonDetails = ref; } } leftTextView={I18n.t('mobile.module.overtime.overtimeapplyreasondetail')} typeItem={formTypeInput} />
            <Attachment
              ref={ref => { this.attachment = ref; } } open={(multiple) => this.attsModal.open(multiple)}
              onScaleAttModal={(rowID) => this.attachmentDetail.onScaleAttModal(rowID, this.attachment.onGetAttachment())}
              />
            <Line />
            <Text style={{ marginBottom: 5 }} />
          </ScrollView>
        </KeyboardAvoiding>
        <SubmitForm
          ref={ref => { this.submit = ref; } } open={(value) => { this.setState({ messageSubTitle: value }); this.message.open(); } }
          close={() => this.props.navigator.pop()} pickerOption={() => this.pickerOption.onGetPickerSelectData()}
          pickerTime={() => this.pickerTime.onGetPickerSelectData()} mealAndShiftData={() => this.mealAndShift.onGetRefreshData()}
          textReasonDetailsData={() => this.textReasonDetails.onGetInputDetail()} attachmentData={() => this.attachment.onGetAttachment()}
          />
        <PickerOption
          ref={ref => { this.pickerOption = ref; } }
          actualRefresh={(text) => this.textActualDate.onSetRefreshInfo(text)} reasonRefresh={(text) => this.textReason.onSetRefreshInfo(text)}
          />
        <PickerTime
          ref={ref => { this.pickerTime = ref; } } getOverTimePreSetInfo={this.getOverTimePreSetInfo}
          onGetOvertimePresetInfo={this.onGetOvertimePresetInfo} onGetOvertimeRule={this.onGetOvertimeRule} dateRefresh={(text) => this.textDate.onSetRefreshInfo(text)}
          startRefresh={(text) => this.textStart.onSetRefreshInfo(text)} endRefresh={(text) => this.textEnd.onSetRefreshInfo(text)}
          />
        <MealModal
          ref={ref => { this.mealType = ref; } } onGetEmployeeActualOTHours={this.onGetEmployeeActualOTHours}
          onSetRefreshData={(isMealClickTemp, mealDataTemp) => this.mealAndShift.onSetRefreshData(isMealClickTemp, mealDataTemp)}
          />
        <AttachmentDetail
          ref={ref => { this.attachmentDetail = ref; } }
          onSetIsApplyAttachShow={(flag) => this.attachment.onSetIsApplyAttachShow(flag)}
          onSetRefreshListView={(attViewArr) => this.attachment.onSetRefreshListView(attViewArr)}
          />
        <ModalWithImage
          ref={ref => { this.message = ref; } } image={overTimeAmount} subTitle={this.state.messageSubTitle} topButtonBackgroundColor={'#ffb600'}
          topButtonTitle={I18n.t('mobile.module.overtime.overtimeapplycontinue')} bottomButtonTitle={I18n.t('mobile.module.overtime.overtimeapplystop')}
          topButtonPress={() => {
            this.message.close();
            this.submit.onSubmitInfo(this.submit.onGetSubmitData());
          } }
          bottomButtonPress={() => { this.message.close(); } }
          />
        <ModalWithImage
          ref={ref => { this.cameraAlert = ref; } } title={I18n.t('mobile.module.mine.account.cameratitle')}
          subTitle={I18n.t('mobile.module.mine.account.camerasubtitle')} topButtonTitle={I18n.t('mobile.module.clock.getit')}
          topButtonPress={() => { this.cameraAlert.close(); } }
          bottomButtonTitle={I18n.t('mobile.module.mine.account.camerareject')}
          bottomButtonPress={() => { this.cameraAlert.close(); } }
          />
        <ModalWithImage
          ref={ref => { this.libraryAlert = ref; } } title={I18n.t('mobile.module.mine.account.librarytitle')}
          subTitle={I18n.t('mobile.module.mine.account.librarysubtitle')} topButtonTitle={I18n.t('mobile.module.clock.getit')}
          topButtonPress={() => { this.libraryAlert.close(); } }
          bottomButtonTitle={I18n.t('mobile.module.mine.account.camerareject')}
          bottomButtonPress={() => { this.libraryAlert.close(); } }
          />
        <AttachmentModal
           ref={ref => { this.attsModal = ref; } }
          loadData={(images) => this.attachment.loadData(images)}
          takePhotos={() => this.cameraAlert.open()}
          loadLibrary={() => this.libraryAlert.open()}
          />
      </View>
    );
  }
}