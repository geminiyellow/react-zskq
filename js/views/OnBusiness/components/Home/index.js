// 出差申请首页

import {
  DeviceEventEmitter, InteractionManager, ListView, NativeModules,
  View, KeyboardAvoidingView, Keyboard
} from 'react-native';
import ScrollView from '@/common/components/ScrollView';
import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import Functions from '@/common/Functions';
import moment from 'moment';
import DatePicker, { datePickerType } from '@/common/components/DatePicker';
import OptionPicker from '@/common/components/OptionPicker';
import { event, keys, device } from '@/common/Util';
import {
  getEmployeeBusinessTravelInitializedInfo, getEmployeeValidTravelHours,
  submitEmployeeBusinessTravelFormRequest
} from '@/common/api';
import { GET, ABORT, POST } from '@/common/Request';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import { LoadingManager } from '@/common/Loading';
import DateHelper from '@/common/DateHelper';
import NavBar from '@/common/components/NavBar';
import UmengAnalysis from '@/common/components/UmengAnalysis';
import Realm from 'realm';
import realm from '@/realm';
import { fetchShiftTime, abort } from '@/views/OnBusiness/fetch';
import { getShiftAndShiftTime } from '@/common/api';
import AddImprestApplicationView from './AddImprestApplicationView';
import DestinationView from './DestinationView';
import Duration from './Duration';
import DetailedItineraryView from './DetailedItineraryView';
import EndDateView from './EndDateView';
import MyLine from './MyLine';
import TravelTypeView from './TravelTypeView';
import TravelReasonView from './TravelReasonView';
import StartDateView from './StartDateView';
import SubmitFormView from './SubmitFormView';
import SummaryView from './SummaryView';
import SpendingApplicationForm from './SpendingApplicationForm';
import ProjectCode from './ProjectCode';
import SearchPage from '../SearchPage';
import styles from './index.style';
import {
  TRAVEL_TYPE, START_DATE, END_DATE, APPLY_START_DATE, APPLY_END_DATE,
  EXPENSE_TYPE, CURRENCY
} from './constants.js';
import Style from '../Style';
const KeyboardAvoiding = device.isIos ? View : KeyboardAvoidingView;
const { RNManager } = NativeModules;
// 项目代码推荐代码数量
const RECOMMEND_CODE_AMOUNT = 3;
// 工时保留小数位数
const HOURS_RESERVED_BITS = 2;
// 当前日期
const selectedDateTemp = Functions.getNowFormatDate();

export default class OnBusiness extends Component {

  constructor(props) {
    super(props);
    // 出差申请初始化数据
    this.travelData = {};
    // 项目代码
    this.projectCodeData = [];
    // 推荐项目代码
    this.recommendCodeArray = [];
    // 备用金申请单数据
    this.travelDetailInfo = [];
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    // 开始日期
    this.startDate = selectedDateTemp;
    // 结束日期
    this.endDate = '';
    // 开始时间
    this.startTime = '00:00';
    // 结束时间
    this.endTime = '';

    this.state = {
      // 备用金申请单数据
      dataSource: this.ds.cloneWithRows(this.travelDetailInfo),
      // Picker 数据
      pickerData: [''],
      // Picker 选中值
      selectedValue: [''],
      // 出差类型
      travelTypeData: [],
      // 选中出差类型 value
      travelTypeValue: '',
      // 是否显示项目代码视图
      isShowProjectCodeView: false,
      // 项目代码
      projectCodeValue: '',
      // 工时
      hours: '0.00',
      // 费用种类
      expenseTypeData: [],
      // 币种
      currencyData: [],
      // 出差'开始时间'
      startDateValue: `${selectedDateTemp} 00:00`,
      // 出差'结束时间'
      endDateValue: '',
      // 是否显示'增加备用金申请'按钮
      isShowAddImprestApplicationBtn: false,
      // 金额汇总数据
      sumArray: [],

      pickerTitle: I18n.t('mobile.module.onbusiness.pickerprompttext'),

      datePickerValue: '',
      datePickerMode: datePickerType.dateHourMinuteMode,
      datePickerTitle: I18n.t('mobile.module.onbusiness.pickerprompttext'),
      behavior: null,
    };
  }

  /** Life Cycle */

  componentWillMount() {
    UmengAnalysis.onPageBegin('OnBusiness');
  }

  componentDidMount() {
    this.fetchData();
    InteractionManager.runAfterInteractions(() => {
      this.loadRecommendCodeData();
    });
    this.addListeners();

    if (device.isAndroid) {
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.setState({ behavior: 'height' }));
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this.setState({ behavior: null }));
    }

    fetchShiftTime()
    .then((data) => {
      this.setState({ startDateValue: data.startDateTime });
      this.startTime = data.startTime;
    })
    .catch((errorMsg) => console.log('errorMsg - ', errorMsg));
  }

  componentWillUnmount() {
    UmengAnalysis.onPageEnd('OnBusiness');
    this.storeRecommendCodeData();
    this.removeListeners();
    this.abortHttpRequest();
    LoadingManager.stop();
    abort();
  }

  /** Event Response */

  onPressLeftButton() {
    Keyboard.dismiss();
    this.props.navigator.pop();
  }

  // 选中项目代码进入项目代码搜索页面
  onPressProjectCodeBtn() {
    const { navigator } = this.props;
    navigator.push({
      component: SearchPage,
      passProps: {
        projectCodeData: this.projectCodeData,
        recommendCodeArray: this.recommendCodeArray,
      },
    });
  }

  onPickerConfirm(data) {
    switch (this.pickerType) {
      case START_DATE:
        this.setState({ startDateValue: data });
        this.startDate = DateHelper.date(data);
        this.startTime = DateHelper.hourMinute(data);
        this.fetchTravelDurationData();
        break;
      case END_DATE:
        this.setState({ endDateValue: data });
        this.endDate = DateHelper.date(data);
        this.endTime = DateHelper.hourMinute(data);
        this.fetchTravelDurationData();
        break;
      case APPLY_START_DATE: {
        const applyStartDate = data;
        this.travelDetailInfo[this.rowID].StartDate = applyStartDate;
        this.setState({ dataSource: this.ds.cloneWithRows(this.travelDetailInfo) });
      }
        break;
      case APPLY_END_DATE: {
        const applyEndDate = data;
        this.travelDetailInfo[this.rowID].EndDate = applyEndDate;
        this.setState({ dataSource: this.ds.cloneWithRows(this.travelDetailInfo) });
      }
        break;

      default:
        break;
    }
  }

  /** Private Methods */

  // 获取出差 ID
  getTravelId() {
    const { travelTypeValue } = this.state;
    let travelId = '';
    const travelTypeData = this.travelData.travelType;
    if (!travelTypeData || !travelTypeData.length) return;
    for (const item of travelTypeData) {
      if (travelTypeValue === item.TravelName) {
        travelId = item.Id;
        break;
      }
    }
    return travelId;
  }

  // 获取项目代码 ID
  getProjectCodeId() {
    const { projectCodeValue } = this.state;
    let projectCodeId = '';
    const projectCodeData = this.travelData.customerList;
    if (!projectCodeData || !projectCodeData.length) return;
    for (const item of projectCodeData) {
      if (projectCodeValue === item.CustName) {
        projectCodeId = item.CustId;
        break;
      }
    }
    return projectCodeId;
  }

  // 获取费用种类 ID
  getCostCategoryId(costCategory) {
    let costCategoryId = '';
    const costCategoryData = this.travelData.costCategory;
    if (!costCategoryData || !costCategoryData.length) return;
    for (const item of costCategoryData) {
      if (costCategory === item.CostCategory) {
        costCategoryId = item.Id;
        break;
      }
    }
    return costCategoryId;
  }

  // 获取币种 ID
  getCurrencyId(currency) {
    let currencyId = '';
    const currencyData = this.travelData.currency;
    if (!currencyData || !currencyData.length) return;
    for (const item of currencyData) {
      if (currency === item.Currency) {
        currencyId = item.Id;
      }
    }
    return currencyId;
  }

  // 离开页面时撤销网络请求
  abortHttpRequest() {
    ABORT('getEmployeeBusinessTravelInitializedInfo');
    ABORT('getEmployeeValidTravelHours');
  }

  addListeners() {
    // 删除一条备用金申请单
    this.deleteFormListener = DeviceEventEmitter.addListener(event.OB_DELETE_FORM, (data) => {
      this.deleteImprestApplication(data);
    });
    // 费用种类
    this.expenseTypeListener = DeviceEventEmitter.addListener(event.OB_PICK_EXPENSE_TYPE, (params) => {
      this.showOptionPicker(params.pickerData, params.value, params.type, params.rowID);
    });
    // 备用金开始日期
    this.startDateListener = DeviceEventEmitter.addListener(event.OB_PICK_START_DATE, (params) => {
      this.showDatePicker(params.slectedValue, params.type, params.rowID);
    });
    // 备用金结束日期
    this.endDateListener = DeviceEventEmitter.addListener(event.OB_PICK_END_DATE, (params) => {
      this.showDatePicker(params.selectedValue, params.type, params.rowID);
    });
    // 备用金申请金额
    this.applicationAmountListener = DeviceEventEmitter.addListener(event.OB_PICK_CURRENCY, (params) => {
      this.showOptionPicker(params.pickerData, params.selectedValue, params.type, params.rowID);
    });
    // 设置备用金申请金额
    this.setAmountListener = DeviceEventEmitter.addListener(event.OB_SET_AMOUNT, (params) => {
      this.travelDetailInfo[params.rowID].CostAmount = params.amount;
      this.amountSummary();
    });
    // 设置备用金详细描述
    this.setCostDescriptionListener = DeviceEventEmitter.addListener(event.OB_SET_COST_DESCRIPTION, (params) => {
      this.travelDetailInfo[params.rowID].Agenda = params.text;
    });
    // 设置项目代码
    this.setProjectCodeListener = DeviceEventEmitter.addListener(event.OB_SET_PROJECTCODE, (text) => {
      this.setState({ projectCodeValue: text });
      this.filterRecommendCodeArray(text);
    });
  }

  removeListeners() {
    this.deleteFormListener.remove();
    this.expenseTypeListener.remove();
    this.startDateListener.remove();
    this.endDateListener.remove();
    this.applicationAmountListener.remove();
    this.setAmountListener.remove();
    this.setCostDescriptionListener.remove();
    this.setProjectCodeListener.remove();

    if (device.isAndroid) {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }
  }

  // 过滤推荐代码数据
  filterRecommendCodeArray(text) {
    let array = this.recommendCodeArray;
    array.push(text);
    array = array.reverse();
    const items = new Set(array);
    array = Array.from(items);
    if (array.length > RECOMMEND_CODE_AMOUNT) array = array.slice(0, RECOMMEND_CODE_AMOUNT);
    array = array.reverse();
    this.recommendCodeArray = array;
  }

  // 获取出差申请初始化信息
  fetchData() {
    LoadingManager.start();
    GET(getEmployeeBusinessTravelInitializedInfo(), (responseData) => {
      LoadingManager.done();
      // 出差申请数据
      this.travelData = responseData;
      const travelTypeData = [];
      for (const item of responseData.travelType) {
        travelTypeData.push(item.TravelName);
      }
      const projectCodeData = [];
      for (const item of responseData.customerList) {
        projectCodeData.push(item.CustName);
      }
      this.projectCodeData = projectCodeData;
      const length = this.projectCodeData.length;
      // 项目代码是否可见
      const customerIsVisible = global.loginResponseData.SysParaInfo.CustomerIsVisible;
      let isVisible = false;
      if (customerIsVisible === 'Y') isVisible = true;
      const isShowProjectCodeView = isVisible && length > 0;
      // 费用种类数据
      const expenseTypeData = [];
      for (const item of responseData.costCategory) {
        expenseTypeData.push(item.CostCategory);
      }
      // 币种数据
      const currencyData = [];
      for (const item of responseData.currency) {
        currencyData.push(item.Currency);
      }
      const isShowAddImprestApplicationBtn = responseData.showApplyForm;
      InteractionManager.runAfterInteractions(() => {
        this.setState({
          isShowProjectCodeView,
          travelTypeData,
          travelTypeValue: travelTypeData[0],
          expenseTypeData,
          currencyData,
          isShowAddImprestApplicationBtn,
        });
      });
    }, (message) => {
      LoadingManager.done();
      showMessage(messageType.error, message);
    }, 'getEmployeeBusinessTravelInitializedInfo');
  }

  // 获取出差时数
  fetchTravelDurationData() {
    // 出差 ID
    const travelId = this.getTravelId();
    // 开始日期
    const startDate = this.startDate;
    // 结束日期
    const endDate = this.endDate;
    // 开始时间
    const startTime = this.startTime;
    // 结束时间
    const endTime = this.endTime;

    if (endDate === '' || endTime === '') return;
    const params = { travelId, startDate, endDate, startTime, endTime };
    GET(getEmployeeValidTravelHours(params), (responseData) => {
      const hours = responseData.toFixed(HOURS_RESERVED_BITS);
      this.setState({ hours });
    }, (message) => {
      showMessage(messageType.error, message);
      const hours = '0.00';
      this.setState({ hours });
    }, 'getEmployeeValidTravelHours');
  }

  // 存储推荐项目代码数据
  storeRecommendCodeData() {
    const recommendCodeData = this.recommendCodeArray.slice(0, RECOMMEND_CODE_AMOUNT);
    let allRecommendCodes = realm.objects('ProjectCode').filtered('recommend = true');
    realm.write(() => {
      realm.delete(allRecommendCodes);
      for (const recomendCode of recommendCodeData) {
        realm.create('ProjectCode', { code: recomendCode, recommend: true });
      }
    });
  }

  // 加载推荐项目代码数据
  loadRecommendCodeData() {
    const projectCodeData = realm.objects('ProjectCode');
    const recommendCodeData = projectCodeData.filtered('recommend = true').slice(0, RECOMMEND_CODE_AMOUNT);
    recommendCodeData.forEach((value) => {
      if (value && value.code) {
        this.recommendCodeArray.push(value.code);
      }
    });
  }

  // 提交出差申请表单数据
  submitTravelForm() {
    const { hours, travelTypeValue, isShowProjectCodeView, projectCodeValue } = this.state;
    const SessionId = global.loginResponseData.SessionId;
    // 出差 ID
    const Id = this.getTravelId();
    // 出差名称
    const Name = travelTypeValue;
    if (travelTypeValue === '') {
      showMessage(messageType.error, I18n.t('mobile.module.onbusiness.noprojectcodeprompttext'));
      return;
    }
    // 目的地
    const Destination = this.destinationView.state.value;
    if (Destination === '') {
      showMessage(messageType.error, I18n.t('mobile.module.onbusiness.nodestinationprompttext'));
      return;
    }
    // 项目代码 ID
    let CustId = '';
    if (isShowProjectCodeView) {
      if (projectCodeValue === '') {
        showMessage(messageType.error, I18n.t('mobile.module.onbusiness.noprojectcodeprompttext'));
        return;
      }
      CustId = this.getProjectCodeId();
      if (CustId === '') {
        showMessage(messageType.error, I18n.t('mobile.module.onbusiness.projectcodefailureprompttext'));
        return;
      }
    }
    // 出差开始日期
    const StartDate = this.startDate;
    // 出差结束日期
    const EndDate = this.endDate;
    // 出差开始时间
    const StartTime = this.startTime;
    // 出差结束时间
    const EndTime = this.endTime;
    if (EndDate === '' || EndTime === '') {
      showMessage(messageType.error, I18n.t('mobile.module.onbusiness.noenddatetimeprompttext'));
      return;
    }
    const startDateTime = `${StartDate} ${StartTime}`;
    const endDateTime = `${EndDate} ${EndTime}`;
    if (moment(endDateTime).isBefore(startDateTime)) {
      showMessage(messageType.error, I18n.t('mobile.module.onbusiness.endtimegreaterthanstarttime'));
      return;
    }
    // 出差时长
    const TotalHours = hours;
    if (!hours || parseFloat(hours) <= 0) {
      showMessage(messageType.error, I18n.t('mobile.module.onbusiness.durationnil'));
      return;
    }

    // 出差目的
    const Purpose = this.travelReasonView.state.value;
    if (Purpose === '') {
      showMessage(messageType.error, I18n.t('mobile.module.onbusiness.notravelreasonprompttext'));
      return;
    }
    // 行程描述
    const TripDescription = this.detailedItineraryView.state.value;
    if (TripDescription === '') {
      showMessage(messageType.error, I18n.t('mobile.module.onbusiness.notraveldetailinfoprompttext'));
      return;
    }
    // 出差细节
    const TravelDetailList = this.travelDetailInfo;
    if (!this.checkApplyForm(TravelDetailList)) return;
    const params = {
      SessionId,
      Id,
      Name,
      CustId,
      Destination,
      Purpose,
      TripDescription,
      StartDate,
      EndDate,
      StartTime,
      EndTime,
      TotalHours,
      TravelDetailList
    };
    RNManager.showLoading('');
    POST(submitEmployeeBusinessTravelFormRequest(), params, (responseData) => {
      RNManager.hideLoading();
      const { navigator } = this.props;
      navigator.pop();
      showMessage(messageType.success, I18n.t('mobile.module.onbusiness.applysuccessprompttext'));
    }, (message) => {
      RNManager.hideLoading();
      showMessage(messageType.error, message);
    });
  }

  // 检查备用金申请单
  checkApplyForm(travelDetailInfo) {
    for (const item of travelDetailInfo) {
      if (item.CostCategory === '') {
        showMessage(messageType.error, I18n.t('mobile.module.onbusiness.noexpensetypeprompttext'));
        return false;
      }
      if (item.EndDate === '') {
        showMessage(messageType.error, I18n.t('mobile.module.onbusiness.noapplyenddatetimeprompttext'));
        return false;
      }
      if (moment(item.EndDate).isBefore(item.StartDate)) {
        showMessage(messageType.error, I18n.t('mobile.module.onbusiness.applyformdateerrorprompttext'));
        return false;
      }
      if (moment(item.StartDate).isBefore(this.startDate)) {
        showMessage(messageType.error, I18n.t('mobile.module.onbusiness.applyfromstartdatelessthanstartdate'));
        return false;
      }
      if (moment(item.EndDate).isAfter(this.endDate)) {
        showMessage(messageType.error, I18n.t('mobile.module.onbusiness.applyformenddatemorethanenddate'));
        return false;
      }
      // if (!item.CostAmount || parseFloat(item.CostAmount) <= 0) {
      //   showMessage(messageType.error, '备用金申请金额不能为0');
      //   return false;
      // }
    }
    return true;
  }

  // 显示新的日期时间选择器
  showDatePicker(selectedValue, pickerType, rowID) {
    this.pickerType = pickerType;
    // 备用金申请单 rowID
    this.rowID = rowID;
    const { startDateValue, endDateValue } = this.state;

    switch (pickerType) {
      case START_DATE:
        this.setState({
          datePickerValue: startDateValue,
          datePickerMode: datePickerType.dateHourMinuteMode,
          datePickerTitle: I18n.t('mobile.module.onbusiness.startdatetitle'),
        });
        break;
      case END_DATE:
        if (endDateValue === '') {
          this.setState({
            datePickerValue: `${selectedDateTemp} 00:00`,
            datePickerMode: datePickerType.dateHourMinuteMode,
            datePickerTitle: I18n.t('mobile.module.onbusiness.enddatetitle'),
          });
        } else {
          this.setState({
            datePickerValue: endDateValue,
            datePickerMode: datePickerType.dateHourMinuteMode,
            datePickerTitle: I18n.t('mobile.module.onbusiness.enddatetitle'),
          });
        }
        break;
      case APPLY_START_DATE:
        this.setState({
          datePickerValue: selectedValue,
          datePickerMode: datePickerType.dateMode,
          datePickerTitle: I18n.t('mobile.module.onbusiness.applicationformstartdatetitle'),
        });
        break;
      case APPLY_END_DATE:
        this.setState({
          datePickerValue: selectedValue,
          datePickerMode: datePickerType.dateMode,
          datePickerTitle: I18n.t('mobile.module.onbusiness.applicationformenddatetitletext'),
        });
        break;

      default:
        break;
    }
    this.datePicker.show();
  }

  showOptionPicker(pickerData, selectedValue, pickerType, rowID) {
    this.pickerType = pickerType;
    // 备用金申请单 rowID
    this.rowID = rowID;
    const { startDateValue, endDateValue } = this.state;

    if (pickerType === TRAVEL_TYPE) {
      this.setState({
        pickerData,
        selectedValue,
        pickerTitle: I18n.t('mobile.module.onbusiness.traveltypetitletext'),
      });
    }

    if (pickerType === EXPENSE_TYPE) {
      let value = selectedValue;
      if (selectedValue == '' && pickerData.length > 0) {
        value = pickerData[0];
      }
      this.setState({
        pickerData,
        selectedValue: value,
        pickerTitle: I18n.t('mobile.module.onbusiness.expensetypetitle'),
      });
    }

    if (pickerType === CURRENCY) {
      this.setState({
        pickerData,
        selectedValue,
        pickerTitle: I18n.t('mobile.module.onbusiness.applicationamounttitletext'),
      });
    }
    this.optionPicker.toggle();
  }

  onOptionPickerDone(data) {
    if (data && data.length < 1) return;

    switch (this.pickerType) {
      // 出差类型
      case TRAVEL_TYPE:
        this.setState({
          travelTypeValue: data[0],
          selectedValue: data[0],
        });
        break;
      // 费用种类
      case EXPENSE_TYPE:
        {
          const costCategory = data[0];
          const costCategoryId = this.getCostCategoryId(costCategory);
          this.travelDetailInfo[this.rowID].CostCategoryId = costCategoryId;
          this.travelDetailInfo[this.rowID].CostCategory = costCategory;
          const dataSource = this.ds.cloneWithRows(this.travelDetailInfo);
          this.setState({ dataSource });
        }
        break;
      // 备用金币种
      case CURRENCY:
        {
          const currency = data[0];
          this.travelDetailInfo[this.rowID].Currency = currency;
          // 应该是 CurrencyId 后台拼写错误
          this.travelDetailInfo[this.rowID].CurrenyId = this.getCurrencyId(currency);

          const dataSource = this.ds.cloneWithRows(this.travelDetailInfo);
          this.setState({ dataSource });
          this.amountSummary();
        }
        break;

      default:
        break;
    }
  }

  // 增加一条备用金申请单
  addImprestApplication() {
    const { currencyData } = this.state;
    // 币种
    const Currency = currencyData[0];
    // 币种ID
    const CurrenyId = this.getCurrencyId(Currency);
    const data = {
      CostCategoryId: '',
      // 费用种类
      CostCategory: '',
      // 开始日期
      StartDate: selectedDateTemp,
      // 结束日期
      EndDate: '',
      // 费用详细描述
      Agenda: '',
      // 申请金额
      CostAmount: 0,
      // 币种ID
      CurrenyId,
      // 币种
      Currency,
    };
    this.travelDetailInfo.push(data);
    this.setState({ dataSource: this.ds.cloneWithRows(this.travelDetailInfo) });
  }

  // 删除一条备用金申请单
  deleteImprestApplication(rowID) {
    this.travelDetailInfo.splice(rowID, 1);
    this.setState({ dataSource: this.ds.cloneWithRows(this.travelDetailInfo) });
    this.amountSummary();
  }

  // 金额汇总
  amountSummary() {
    const { currencyData } = this.state;
    const sumArray = [];
    for (const item of currencyData) {
      const tempArray = [];
      for (const form of this.travelDetailInfo) {
        if (form.Currency === item) tempArray.push(form.CostAmount);
      }
      let amount = 0;
      if (tempArray.length > 0) amount = tempArray.reduce((total, num) => total + num);
      if (amount == 0) continue;
      const object = {
        amount,
        currency: item,
      };
      sumArray.push(object);
    }
    this.setState({ sumArray });
  }

  /** render methods */

  // 渲染 ListView 行数据
  renderRow(rowData, sectionID, rowID) {
    const { expenseTypeData, currencyData } = this.state;
    return (
      <SpendingApplicationForm key={`${sectionID}-${rowID}`} rowID={rowID} expenseTypeData={expenseTypeData} currencyData={currencyData} rowData={rowData} />
    );
  }

  renderProjectCodeView() {
    const { isShowProjectCodeView, projectCodeValue } = this.state;
    if (isShowProjectCodeView) {
      return <ProjectCode onPressBtn={() => this.onPressProjectCodeBtn()} value={projectCodeValue} />;
    }
  }

  render() {
    const { dataSource, pickerData, selectedValue, isShowAddImprestApplicationBtn, sumArray, datePickerValue,
      datePickerMode, datePickerTitle, pickerTitle } = this.state;

    return (
      <View style={styles.container}>
        <NavBar title={I18n.t('mobile.module.onbusiness.navbartitle')} onPressLeftButton={() => this.onPressLeftButton()}/>
        <KeyboardAvoiding behavior={this.state.behavior} style={{ flex: 1 }}>
        <ListView
          style={{ flex: 1 }}
          dataSource={dataSource}
          renderHeader={() => this.renderHeader()}
          renderFooter={() => this.renderFooter()}
          renderRow={(rowData, sectionID, rowID) => this.renderRow(rowData, sectionID, rowID)}
          removeClippedSubviews={false}
          enableEmptySections
          keyboardDismissMode={device.isIos ? "on-drag" : "none"}
        />
        </KeyboardAvoiding>
        
        {isShowAddImprestApplicationBtn && sumArray.length > 0 ? <SummaryView sumArray={sumArray} /> : null}
        <SubmitFormView submitForm={() => this.submitTravelForm()} />
        <DatePicker
          ref={picker => this.datePicker = picker}
          datePickerMode={datePickerMode}
          title={datePickerTitle}
          selectedValue={datePickerValue}
          onPickerConfirm={(data) => this.onPickerConfirm(data)}
        />
        <OptionPicker
          ref={picker => this.optionPicker = picker}
          pickerData={pickerData}
          selectedValue={[selectedValue]}
          pickerTitle={pickerTitle}
          onPickerDone={(data) => this.onOptionPickerDone(data)}
          pickerCancelBtnText={I18n.t('mobile.module.onbusiness.cancelbuttontext')}
          pickerBtnText={I18n.t('mobile.module.onbusiness.confirmbuttontext')}
        />
      </View>
    );
  }

  // 渲染ListView头部View
  renderHeader() {
    const { travelTypeData, travelTypeValue, startDateValue, endDateValue, hours } = this.state;

    return (
      <View>
        <TravelTypeView
          data={travelTypeData}
          value={travelTypeValue}
          selectTravelType={(params) => this.showPicker(params.data, params.value, params.type)}
          showOptionPicker={(params) => this.showOptionPicker(params.data, params.value, params.type)}/>
        <DestinationView ref={destinationView => this.destinationView = destinationView} />
        {this.renderProjectCodeView()}
        <StartDateView
          startDateValue={startDateValue}
          showDatePicker={(value, type, rowID) => this.showDatePicker(value, type, rowID)}/>
        <EndDateView
          endDateValue={endDateValue}
          showDatePicker={(value, type, rowID) => this.showDatePicker(value, type, rowID)}/>
        <Duration hours={hours}/>
        <TravelReasonView ref={travelReasonView => this.travelReasonView = travelReasonView} />
        <DetailedItineraryView ref={detailedItineraryView => this.detailedItineraryView = detailedItineraryView} />
      </View>
    );
  }

  // 渲染ListView尾部View
  renderFooter() {
    const { isShowAddImprestApplicationBtn } = this.state;

    if (!isShowAddImprestApplicationBtn) return null;

    return (
      <View>
        <MyLine style={{ marginTop: Style.space.rowVerticalSpace }} lineStyle={{ marginLeft: 0 }} />
        <AddImprestApplicationView addImprestApplication={(data) => this.addImprestApplication(data)} />
        <MyLine style={{ marginBottom: Style.space.rowVerticalSpace }} lineStyle={{ marginLeft: 0 }} />
      </View>
    );
  }

}