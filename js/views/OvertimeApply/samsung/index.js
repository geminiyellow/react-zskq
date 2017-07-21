/**
 * 加班申请界面 -- 三星
 */

import {
  InteractionManager,
  KeyboardAvoidingView,
  Keyboard,
  View,
} from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import I18n from 'react-native-i18n';
import Line from '@/common/components/Line';
import Text from '@/common/components/TextField';
import ScrollView from '@/common/components/ScrollView';
import AttachmentModal from '@/common/components/Attachment';
import { device } from '@/common/Util';
import { messageType } from '@/common/Consts';
import { GET, ABORT } from '@/common/Request';
import { showMessage } from '@/common/Message';
import { LoadingManager } from '@/common/Loading';
import { getOvertimePresetInfo } from '@/common/api';
import { getNowFormatDate } from '@/common/Functions';
import UmengAnalysis from '@/common/components/UmengAnalysis';
import NavBar from '@/common/components/NavBar';
import ModalWithImage from '@/common/components/modal/ModalWithImage';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
import Constance from './../constants';
import FormItem from './../components/FormItem';
import Attachment from './../components/Attachment';
import PickerOption from './../components/PickerOption';
import PickerTime from './../components/PickerTimeOther';
import AttachmentDetail from './../components/AttachmentDetail';
import SubmitSamsung from './../components/SubmitSamsung';
import styles from './../styles';

const KeyboardAvoiding = device.isIos ? View : KeyboardAvoidingView;
// 导入图片信息和表单类型信息
const { formTypeWordAndWord, formTypeWordAndImage, formTypeInput } = Constance;
// 导入picker的类型信息
const { pickerDate, pickerStart, pickerEnd, pickerReason } = Constance;
// 导入公司代码的数据
const customizedCompanyHelper = new CustomizedCompanyHelper();

export default class EsteeOvertimeApply extends PureComponent {
  constructor(...props) {
    super(...props);
    this.state = {
      behavior: null,
    };
    // 接口信息初始化
    this.getOvertimePresetInfo = '';
  }

  componentWillMount() {
    UmengAnalysis.onPageBegin('OvertimeApply');
  }

  // 组件渲染完成
  componentDidMount() {
    this.onGetOvertimePresetInfo(getNowFormatDate());
    if (!device.isIos) {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => this.setState({ behavior: 'height' }),
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => this.setState({ behavior: null }),
      );
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
  }

  // 初始化加班数据
  onGetOvertimePresetInfo = selectDate => {
    // 查询参数
    const params = {};
    params.overtimeDate = selectDate;
    LoadingManager.start();
    GET(
      getOvertimePresetInfo(customizedCompanyHelper.getPrefix(), params),
      responseData => {
        LoadingManager.done();
        InteractionManager.runAfterInteractions(() => {
          // 判断是否render
          if (
            _.isEmpty(this.pickerTime || this.textTotalHours || this.submit)
          ) {
            return;
          }
          // 处理接口返回的数据
          this.getOverTimePreSetInfo = responseData;
          // 加载加班的表单数据
          this.pickerOption.onSetPickerRefresh(this.getOverTimePreSetInfo);
          this.pickerTime.onSetPickerRefresh(this.getOverTimePreSetInfo);
          // 显示加班类型
          if (this.getOverTimePreSetInfo.OTName) {
            this.textType.onSetRefreshInfo(this.getOverTimePreSetInfo.OTName);
          }
          this.submit.onSetData(responseData);
          // 显示加班时长
          this.textTotalHours.onSetRefreshInfo('0.00');
        });
      },
      message => {
        LoadingManager.done();
        showMessage(messageType.error, message);
      },
      'getOvertimePresetInfo',
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <NavBar
          title={I18n.t('mobile.module.overtime.overtimenavigationbartitle')}
          onPressLeftButton={() => { Keyboard.dismiss(); this.props.navigator.pop() } }
          />
        <KeyboardAvoiding
          behavior={this.state.behavior}
          style={{ flex: 1 }}
          >
          <ScrollView style={{ flex: 1 }} behavior={this.state.behavior}>
            <View style={styles.itemAllView}>
              <FormItem
                ref={ref => {
                  this.textDate = ref;
                } }
                topLine
                onPress={type => this.pickerTime.onOpenPicker(pickerDate)}
                leftTextView={I18n.t('mobile.module.overtime.overtimeapplydate')}
                typeItem={formTypeWordAndImage}
                />
              <FormItem
                ref={ref => {
                  this.textType = ref;
                } }
                topLine
                topLineStyle={styles.lineView}
                bottomLine
                leftTextView={I18n.t('mobile.module.overtime.overtimeapplytype')}
                typeItem={formTypeWordAndWord}
                />
            </View>
            <View style={styles.itemAllView}>
              <FormItem
                ref={ref => {
                  this.textStart = ref;
                } }
                topLine
                onPress={type => this.pickerTime.onOpenPicker(pickerStart)}
                leftTextView={I18n.t('mobile.module.overtime.overtimeapplystarttime')}
                typeItem={formTypeWordAndImage}
                />
              <FormItem
                ref={ref => {
                  this.textEnd = ref;
                } }
                topLineStyle={styles.lineView}
                bottomLine
                bottomLineStyle={styles.lineView}
                onPress={type => this.pickerTime.onOpenPicker(pickerEnd)}
                leftTextView={I18n.t('mobile.module.overtime.overtimeapplyendtime')}
                typeItem={formTypeWordAndImage}
                />
              <FormItem
                ref={ref => {
                  this.textTotalHours = ref;
                } }
                topLine={false}
                bottomLine
                leftTextView={I18n.t('mobile.module.overtime.overtimeapplyworkinghour')}
                typeItem={formTypeWordAndWord}
                />
            </View>
            <View style={styles.itemAllView}>
              <FormItem
                ref={ref => {
                  this.textReason = ref;
                } }
                topLine
                bottomLine
                onPress={type => this.pickerOption.onOpenPicker(pickerReason)}
                leftTextView={I18n.t('mobile.module.overtime.overtimeapplyreason')}
                typeItem={formTypeWordAndImage}
                />
            </View>
            <FormItem
              ref={ref => {
                this.textReasonDetails = ref;
              } }
              leftTextView={I18n.t('mobile.module.overtime.overtimeapplyreasondetail')}
              typeItem={formTypeInput}
              />
            <Attachment
              ref={ref => {
                this.attachment = ref;
              } }
              open={multiple => this.attsModal.open(multiple)}
              onScaleAttModal={rowID =>
                this.attachmentDetail.onScaleAttModal(
                  rowID,
                  this.attachment.onGetAttachment(),
                )}
              />
            <Line />
            <Text style={{ marginBottom: 5 }} />
          </ScrollView>
        </KeyboardAvoiding>
        <SubmitSamsung
          ref={ref => {
            this.submit = ref;
          } }
          close={() => this.props.navigator.pop()}
          pickerTime={() => this.pickerTime.onGetPickerSelectData()}
          pickerOption={() => this.pickerOption.onGetPickerSelectData()}
          textReasonDetailsData={() =>
            this.textReasonDetails.onGetInputDetail()}
          attachmentData={() => this.attachment.onGetAttachment()}
          />
        <PickerTime
          ref={ref => {
            this.pickerTime = ref;
          } }
          getOverTimePreSetInfo={this.getOverTimePreSetInfo}
          onGetOvertimePresetInfo={this.onGetOvertimePresetInfo}
          onGetOvertimeRule={this.onGetOvertimeRule}
          dateRefresh={text => this.textDate.onSetRefreshInfo(text)}
          startRefresh={text => this.textStart.onSetRefreshInfo(text)}
          endRefresh={text => this.textEnd.onSetRefreshInfo(text)}
          totalHourRefresh={text => this.textTotalHours.onSetRefreshInfo(text)}
          />
        <PickerOption
          ref={ref => {
            this.pickerOption = ref;
          } }
          reasonRefresh={text => this.textReason.onSetRefreshInfo(text)}
          />
        <AttachmentDetail
          ref={ref => {
            this.attachmentDetail = ref;
          } }
          onSetIsApplyAttachShow={flag =>
            this.attachment.onSetIsApplyAttachShow(flag)}
          onSetRefreshListView={attViewArr =>
            this.attachment.onSetRefreshListView(attViewArr)}
          />
        <ModalWithImage
          ref={ref => {
            this.cameraAlert = ref;
          } }
          title={I18n.t('mobile.module.mine.account.cameratitle')}
          subTitle={I18n.t('mobile.module.mine.account.camerasubtitle')}
          topButtonTitle={I18n.t('mobile.module.clock.getit')}
          topButtonPress={() => {
            this.cameraAlert.close();
          } }
          bottomButtonTitle={I18n.t('mobile.module.mine.account.camerareject')}
          bottomButtonPress={() => {
            this.cameraAlert.close();
          } }
          />
        <ModalWithImage
          ref={ref => {
            this.libraryAlert = ref;
          } }
          title={I18n.t('mobile.module.mine.account.librarytitle')}
          subTitle={I18n.t('mobile.module.mine.account.librarysubtitle')}
          topButtonTitle={I18n.t('mobile.module.clock.getit')}
          topButtonPress={() => {
            this.libraryAlert.close();
          } }
          bottomButtonTitle={I18n.t('mobile.module.mine.account.camerareject')}
          bottomButtonPress={() => {
            this.libraryAlert.close();
          } }
          />
        <AttachmentModal
          ref={ref => {
            this.attsModal = ref;
          } }
          loadData={images => this.attachment.loadData(images)}
          takePhotos={() => this.cameraAlert.open()}
          loadLibrary={() => this.libraryAlert.open()}
          />
      </View>
    );
  }
}
