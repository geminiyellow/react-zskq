import {
  DeviceEventEmitter,
  View,
  NativeModules,
  KeyboardAvoidingView,
  Keyboard,
  InteractionManager
} from "react-native";

import React, { PureComponent } from 'react';
import I18n from 'react-native-i18n';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device, event } from '@/common/Util';
import NavBar from '@/common/components/NavBar';
import Line from '@/common/components/Line';
import Text from '@/common/components/TextField';
import { getVersionId, getHHmmFormat } from '@/common/Functions';
import Constance from '@/views/Schedule/Constance';
import Picker from '@/common/components/OptionPicker';
import OptionCard from '@/common/components/OptionCard';
import ScrollView from '@/common/components/ScrollView';
import SubmitButton from '@/common/components/SubmitButton';
import AttachmentModal from '@/common/components/Attachment';
import { messageType, companyCodeList, moduleList } from '@/common/Consts';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
import ModalWithImage from '@/common/components/modal/ModalWithImage';
import DatePicker, { datePickerType } from '@/common/components/DatePicker';
import { showMessage } from '@/common/Message';
import { GET, POST, ABORT } from '@/common/Request';
import {
  submitEmployeeExceptionFormRequst,
  getEmployeeExceptionReasonList,
} from '@/common/api';
import Attachment from './Attachment';
import AttachmentDetail from './AttachmentDetail';
import MyFormHelper from '../../MyForms/MyFormHelper';
import ExceptionReason from './ExceptionReason';

const KeyboardAvoiding = device.isIos ? View : KeyboardAvoidingView;
// 导入语言设置信息
const myFormHelper = new MyFormHelper();
// 导入公司代码的数据
const customizedCompanyHelper = new CustomizedCompanyHelper();
const { RNManager } = NativeModules;
// 加载原因的信息
let reasonMap = {};
let reasonDataList = [];
let reasonsList = [];

export default class ExceptionSubmit extends PureComponent {
  constructor(props) {
    super(props);
    this.attendanceItem = this.props.passProps.attendanceData;
    this.state = {
      timePickerShow: false,
      reasonPickerShow: false,
      selectedReason: [],
      selectedReasonTemp: [],
      selectedTime: '',
      selectedTimeTemp: this.attendanceItem.PlanPunchTime,
      reasonLoaded: false,
      AllowedToModify: "N",
      update: true,
      behavior: null
    };
    reasonMap = {};
    reasonDataList = [];
    reasonsList = [];
  }

  /** Life cycle */

  componentWillMount() {
    this.companyCode = getVersionId(
      global.companyResponseData.version,
      moduleList.checkinSummary
    );
  }

  componentDidMount() {
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
    InteractionManager.runAfterInteractions(() => {
      this.fetchEmployeeExceptionReasonList();
    });
  }

  componentWillUnmount() {
    if (!device.isIos) {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }
    ABORT("submitEmployeeExceptionFormRequst");
    ABORT("getEmployeeExceptionReasonList");
  }

  /** Callback */

  onPressLeftButton() {
    Keyboard.dismiss();
    this.props.navigator.pop();
  }

  onTimePickerPress() {
    const { reasonPickerShow } = this.state;
    if (reasonPickerShow) {
      this.reasonPicker.toggle();
    }
    this.timePicker.show();
    this.setState({
      timePickerShow: true,
      reasonPickerShow: false
    });
  }

  onReasonPickerPress() {
    const { timePickerShow } = this.state;
    if (timePickerShow) {
      this.timePicker.show();
    }
    this.reasonPicker.toggle();
    this.setState({
      timePickerShow: false,
      reasonPickerShow: true
    });
  }

  onSubmit = () => {
    const { selectedReason, selectedTime } = this.state;
    if (this.companyCode == companyCodeList.standard) {
      if (selectedReason.length < 1) {
        showMessage(
          messageType.error,
          I18n.t('mobile.module.exception.appealreasonhint'),
        );
        return;
      }
    } else if (!this.exceptionReason.state.reasonDetails) {
      showMessage(
        messageType.error,
        I18n.t('mobile.module.exception.reasondetailshint'),
      );
      return;
    }
    const params = {};
    params.SessionId = global.loginResponseData.SessionId;
    params.ExceptionDate = this.attendanceItem.ExceptionDate;
    params.ShiftName = this.attendanceItem.ShiftName;
    params.PlanPunchTime = this.attendanceItem.PlanPunchTime;
    params.ActualPunchTime = this.attendanceItem.ActualPunchTime;
    if (selectedTime != "") {
      params.ModifiedPunchTime = selectedTime;
    } else {
      params.ModifiedPunchTime = this.attendanceItem.PlanPunchTime;
    }
    params.ExceptionCode = this.attendanceItem.ExceptionCode;
    params.ExceptionType = this.attendanceItem.ExceptionType;
    params.ExceptionName = this.attendanceItem.ExceptionName;
    if (this.companyCode == companyCodeList.estee) {
      params.ReasonId = "";
    } else {
      params.ReasonId = reasonMap[selectedReason];
    }
    params.Remark = this.exceptionReason.state.reasonDetails;
    params.AttachmentList = this.attachment.onGetAttachment().attViewBase64Arr
      ? this.attachment.onGetAttachment().attViewBase64Arr
      : '';
    // 进行缓冲
    RNManager.showLoading(I18n.t('mobile.module.exception.submitingappeal'));
    POST(
      submitEmployeeExceptionFormRequst(customizedCompanyHelper.getPrefix()),
      params,
      responseData => {
        RNManager.hideLoading();
        showMessage(
          messageType.success,
          I18n.t('mobile.module.exception.submitsuccess'),
        );
        DeviceEventEmitter.emit(event.UPDATE_EXCEPTION_DATA);
        DeviceEventEmitter.emit(event.REFRESH_CORNER_EVENT, true);
        // 退出当前界面
        this.props.navigator.pop();
      },
      message => {
        RNManager.hideLoading();
        showMessage(messageType.error, message);
      },
      'submitEmployeeExceptionFormRequst',
    );
  };

  fetchEmployeeExceptionReasonList() {
    if (this.companyCode == companyCodeList.standard) {
      GET(
        getEmployeeExceptionReasonList(),
        responseData => {
          reasonDataList.length = 0;
          reasonsList.length = 0;
          for (let i = 0; i < responseData.length; i += 1) {
            reasonDataList.push(responseData[i]);
            reasonsList.push(responseData[i].Reason);
            const key = responseData[i].Reason;
            reasonMap[key] = responseData[i].Id;
          }
          this.setState({
            reasonLoaded: true,
            selectedReasonTemp: reasonsList[0],
          });
        },
        message => {
          showMessage(messageType.error, message);
        },
        'getEmployeeExceptionReasonList'
      );
    }
  }

  renderSelectedTime() {
    const { selectedTime } = this.state;
    if (selectedTime !== "") {
      return getHHmmFormat(selectedTime);
    }
    return null;
  }

  renderColor(rowData) {
    if (rowData.ExceptionType == "F") {
      return "#FFC62D";
    } else if (rowData.ExceptionType == "G") {
      return "#2591FF";
    }
    return "#999999";
  }

  renderChooseReasonBox() {
    const { reasonLoaded, selectedReason, AllowedToModify } = this.state;
    if (reasonLoaded) {
      return (
        <View style={{ flex: 1, backgroundColor: 'white', marginTop: 10 }}>
          <OptionCard
            topLine
            bottomLine={false}
            title={I18n.t('mobile.module.exception.appealreason')}
            detailText={selectedReason}
            onPress={() => this.onReasonPickerPress()}/>
          {AllowedToModify === 'Y'
            ? <Line style={{ marginLeft: 18 }}/>
            : <Line/>}
        </View>
      );
    }
    return null;
  }

  renderChooseActualTime() {
    const { AllowedToModify } = this.state;
    if (AllowedToModify === "Y") {
      return (
        <View style={{ flexGrow: 1, backgroundColor: 'white' }}>
          <OptionCard
            topLine={false}
            bottomLine
            title={I18n.t('mobile.module.exception.shouldupdatetime')}
            detailText={this.renderSelectedTime()}
            onPress={() => this.onTimePickerPress()}
            />
        </View>
      );
    }
    return null;
  }

  renderActualCheckinTime() {
    if (
      this.attendanceItem.ExceptionType === 'M' ||
      this.attendanceItem.ActualPunchTime === ''
    ) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.checkinDetailsLabel} numberOfLines={1}>
            {I18n.t('mobile.module.exception.shouldcheckintime')}
          </Text>
          <Text style={styles.checkinDetailsTime}>
            {getHHmmFormat(this.attendanceItem.PlanPunchTime)}
          </Text>
        </View>
      );
    }

    return (
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.checkinDetailsLabel}>
          {I18n.t('mobile.module.exception.actualcheckintime')}
          <Text style={styles.checkinDetailsTime}>
            {getHHmmFormat(this.attendanceItem.ActualPunchTime)}
          </Text>
        </Text>
        <Text style={styles.checkinDetailsLabel}>
          {` | ${I18n.t('mobile.module.exception.shouldcheckintime')}`}
          <Text style={styles.checkinDetailsTime}>
            {getHHmmFormat(this.attendanceItem.PlanPunchTime)}
          </Text>
        </Text>
      </View>
    );
  }

  render() {
    const {
      reasonLoaded,
      selectedReasonTemp,
      selectedTimeTemp,
      behavior
    } = this.state;
    const { dateColor } = this.props.passProps;

    return (
      <View style={styles.wrapper}>
        <NavBar
          title={I18n.t('mobile.module.exception.appeal')}
          onPressLeftButton={() => this.onPressLeftButton()}
          />
        <KeyboardAvoiding behavior={behavior} style={{ flex: 1 }}>
          <ScrollView style={styles.container}>
            <View style={styles.rowItem}>
              <View style={styles.circleBg}>
                <Text style={[styles.circleMonth, { color: dateColor }]}>
                  {I18n.t(
                    Constance.getMonth(
                      this.attendanceItem.ExceptionMonth,
                      myFormHelper.getLanguage(),
                    ),
                  )}
                </Text>
                <Text style={[styles.circleDay, { color: dateColor }]}>
                  {this.attendanceItem.ExceptionDay}
                </Text>
              </View>
              <View style={styles.rightView}>
                <Text style={styles.exceptionTitle} numberOfLines={1}>
                  {this.attendanceItem.ExceptionName}
                </Text>
                {this.renderActualCheckinTime()}
              </View>
            </View>
            <Line />
            {this.renderChooseReasonBox()}
            {this.renderChooseActualTime()}
            <ExceptionReason
              ref={reason => {
                this.exceptionReason = reason;
              } }
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
          </ScrollView>
        </KeyboardAvoiding>
        <SubmitButton onPressBtn={() => this.onSubmit()} />
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
        <AttachmentDetail
          ref={ref => {
            this.attachmentDetail = ref;
          } }
          onSetIsApplyAttachShow={flag =>
            this.attachment.onSetIsApplyAttachShow(flag)}
          onSetRefreshListView={attViewArr =>
            this.attachment.onSetRefreshListView(attViewArr)}
          />
        {reasonLoaded
          ? <Picker
            ref={picker => this.reasonPicker = picker}
            pickerTitle={I18n.t('mobile.module.exception.appealreason')}
            pickerData={reasonsList}
            selectedValue={[selectedReasonTemp]}
            onPickerCancel={() => {
              this.setState({
                reasonPickerShow: false,
              });
            } }
            onPickerDone={pickedValue => {
              const index = reasonDataList.indexOf(
                reasonDataList.find(item => item.Reason == pickedValue[0]),
              );
              const allowToModify = reasonDataList[index].AllowedToModify;
              this.setState({
                selectedReason: pickedValue[0],
                selectedReasonTemp: pickedValue[0],
                reasonPickerShow: false,
                AllowedToModify: allowToModify,
              });
            } }
            />
          : null}
        {reasonLoaded
          ? <DatePicker
            ref={picker => this.timePicker = picker}
            title={I18n.t('mobile.module.exception.shouldupdatetime')}
            datePickerMode={datePickerType.hourMinuteMode}
            onPickerCancel={() => {
              this.setState({
                timePickerShow: false,
              });
            } }
            selectedValue={selectedTimeTemp}
            onPickerConfirm={pickedValue => {
              this.setState({
                selectedTime: pickedValue,
                selectedTimeTemp: pickedValue,
                timePickerShow: false,
              });
            } }
            />
          : null}
      </View>
    );
  }
}
const styles = EStyleSheet.create({
  wrapper: {
    flexGrow: 1
  },
  container: {
    backgroundColor: "$color.containerBackground",
    flex: 1,
  },
  rowItem: {
    marginTop: 10,
    flexDirection: "row",
    backgroundColor: "$color.white",
    alignItems: "center",
    height: 70,
    borderTopWidth: device.hairlineWidth,
    borderColor: '$color.line',
  },
  circleBg: {
    marginTop: 5,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  circleDay: {
    marginLeft: 18,
    fontSize: 28,
    textAlign: 'center',  
  },
  circleMonth: {
    marginLeft: 20,
    fontSize: 13,
    textAlign: 'center',
  },
  exceptionTitle: {
    marginBottom: 5,
    color: "#000000",
    fontSize: 17,
    fontWeight: "bold",
  },
  checkinDetailsLabel: {
    fontSize: 13,
    color: "#999999",
  },
  checkinDetailsTime: {
    fontSize: 13,
    color: "$color.mainColorLight",
    '@media ios': {
      fontWeight: '500',
    },
  },
  timeSeperator: {
    width: device.hairlineWidth * 2,
    height: 10,
    backgroundColor: "#999999",
    marginHorizontal: 5
  },
  rightView: {
    marginLeft: 11,
    flex: 1,
  },
});
