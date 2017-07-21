/**
 * 异常统计
 */
import { DeviceEventEmitter, RefreshControl, ScrollView, View } from 'react-native';
import React, { PureComponent } from 'react';
import I18n from 'react-native-i18n';
import EStyleSheet from 'react-native-extended-stylesheet';
import NavBar from '@/common/components/NavBar';
import { device, event } from '@/common/Util';
import { GET, ABORT } from '@/common/Request';
import UmengAnalysis from '@/common/components/UmengAnalysis';
import { showMessage } from '@/common/Message';
import { getVersionId, getYYYYMMDDFormat } from '@/common/Functions';
import EmptyView from '@/common/components/EmptyView';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
import { refreshStyle } from '@/common/Style';
import { messageType, companyCodeList, moduleList } from '@/common/Consts';
import { statisticsTitle, listTitle } from '@/views/CheckinSummary/constants';
import { getAttendanceStatistics, getEmployeeExceptionList } from '@/common/api';
import HintText from './HintText';
import ExceptionList from './ExceptionList';
import ExceptionTitle from './ExceptionTitle';
import ExceptionStatistics from './ExceptionStatistics';
import { SHOW_PICKER, EXCEPTION } from '../constants';
import { fetchExceptionStatistics, fetchExceptionDetailInfo } from '../Service/ExceptionRequest';

const nodata = 'empty';
const filter = 'exception_filter';
// 导入公司代码的数据
const customizedCompanyHelper = new CustomizedCompanyHelper();

export default class Exception extends PureComponent {
  constructor(props) {
    super(props);
    this.workingDays = 0;
    this.unhandleExceptionNum = 0;
    this.lastPeriodList = [`${I18n.t('mobile.module.exception.lastpayperiod')}`];
    this.currentPeriodList = [`${I18n.t('mobile.module.exception.currentpayperiod')}`];
    this.pickerData = [this.lastPeriodList[0], this.currentPeriodList[0]];
    this.pickerValue = this.pickerData[1];
    this.period = 1;

    this.state = {
      isLoadF: false,
      isLoadB: false,
      attendanceStatistics: [],
      unhandledExceptionList: [],
      refreshing: false,
      selectedPeriodList: this.currentPeriodList[0],
      pickerData: [this.lastPeriodList[0], this.currentPeriodList[0]],
      topViewHeight: 200,
    };
  }

  /** Life cycle */

  componentWillMount() {
    UmengAnalysis.onPageBegin('CheckinSummary');
    this.companyCode = getVersionId(
      global.companyResponseData.version,
      moduleList.checkinSummary,
    );
    this.isCustom =
      this.companyCode == companyCodeList.estee ||
      this.companyCode == companyCodeList.gant;
    this.isNavBar =
      this.companyCode == companyCodeList.estee ||
      this.companyCode == companyCodeList.gant ||
      this.companyCode == companyCodeList.samsung;
  }

  componentDidMount() {
    this.loadExceptionStatistics(1);
    this.loadExceptionDetailInfo(1);

    this.listeners = [
      DeviceEventEmitter.addListener(event.UPDATE_EXCEPTION_DATA, () => {
        this.onRefresh();
      }),
    ];
  }

  componentWillUnmount() {
    UmengAnalysis.onPageEnd('CheckinSummary');
    this.listeners && this.listeners.forEach(listener => listener.remove());
    ABORT('getAttendanceStatistics');
  }

  /** Callback */

  onScroll() {
    this.hint.onCloseHint();
  }

  onRefresh() {
    const { selectedPeriodList } = this.state;

    this.setState({ refreshing: true });

    if (selectedPeriodList == this.lastPeriodList[0]) {
      this.loadExceptionStatistics(-1);
      this.loadExceptionDetailInfo(-1);
    } else {
      this.loadExceptionStatistics(1);
      this.loadExceptionDetailInfo(1);
    }
  }

  onShowHint(y) {
    this.setState({ topViewHeight: device.isIos ? y+10 : y+10+20 });
    this.hint.onHint(this.exceptionDay);
  }

  onPickerDone(pickerValue) {
    this.setState({ selectedPeriodList: pickerValue[0] });
    this.pickerValue = pickerValue[0];

    if (this.pickerData && this.pickerValue === this.pickerData[0]) {
      this.period = -1;
    } else if (this.pickerData) {
      this.period = 1;
    }
    this.loadExceptionStatistics(this.period);
    this.loadExceptionDetailInfo(this.period);
  }

  /** Event response */

  onPressRightButton() {
    const { selectedPeriodList } = this.state;
    const data = {
      type: EXCEPTION,
      pickerValue: selectedPeriodList,
      pickerData: this.pickerData,
    };
    DeviceEventEmitter.emit(SHOW_PICKER, data);
  }

  /** Load Data */

  loadExceptionStatistics(period) {
    fetchExceptionStatistics(period).then(
      responseData => {
        this.setState({ refreshing: false, isLoadF: true });
        const { WorkDays, ExceptionDay, ExceptionLastPeriod, ExceptionCountList, ExceptionCurrentPeriod } = responseData;
        this.workingDays = WorkDays;
        this.exceptionDay = 0;

        if (ExceptionDay) {
          this.exceptionDay = ExceptionDay;
        }

        if (ExceptionLastPeriod && ExceptionCurrentPeriod) {
          this.exceptionLastPeriod = ExceptionLastPeriod;
          this.exceptionCurrentPeriod = ExceptionCurrentPeriod;
          this.lastPeriod = `${I18n.t('mobile.module.exception.lastpayperiod')}(${getYYYYMMDDFormat(ExceptionLastPeriod[0])}${I18n.t('mobile.module.exception.exceto')}${getYYYYMMDDFormat(ExceptionLastPeriod[1])})`;
          this.currentPeriod = `${I18n.t('mobile.module.exception.currentpayperiod')}(${getYYYYMMDDFormat(ExceptionCurrentPeriod[0])}${I18n.t('mobile.module.exception.exceto')}${getYYYYMMDDFormat(ExceptionCurrentPeriod[1])})`;
          this.pickerData = [this.lastPeriod, this.currentPeriod];
        }

        if (ExceptionLastPeriod) {
          this.lastPeriodList = [
            `${I18n.t('mobile.module.exception.lastpayperiod')}(${getYYYYMMDDFormat(ExceptionLastPeriod[0])}${I18n.t('mobile.module.exception.exceto')}${getYYYYMMDDFormat(ExceptionLastPeriod[1])})`,
          ];
        }

        if (ExceptionCurrentPeriod) {
          this.currentPeriodList = [
            `${I18n.t('mobile.module.exception.currentpayperiod')}(${getYYYYMMDDFormat(ExceptionCurrentPeriod[0])}${I18n.t('mobile.module.exception.exceto')}${getYYYYMMDDFormat(ExceptionCurrentPeriod[1])})`,
          ];
          if (
            this.state.selectedPeriodList != this.currentPeriodList[0] &&
            this.state.selectedPeriodList != this.lastPeriodList[0]
          ) {
            this.setState({ selectedPeriodList: this.currentPeriodList[0] });
          }
        }
        requestAnimationFrame(() => {
          this.setState({ attendanceStatistics: ExceptionCountList });
        });
      },
      errorMessage => {
        this.setState({ refreshing: false, isLoadF: true });
        showMessage(messageType.error, errorMessage);
      }
    );
  }

  loadExceptionDetailInfo(period) {
    fetchExceptionDetailInfo(period).then(
      (responseData) => {
        this.setState({
          refreshing: false,
          isLoadB: true,
          unhandledExceptionList: responseData,
         })
      },
      (errorMessage) => {
        this.setState({ refreshing: false, isLoadB: true });
        showMessage(messageType.error, errorMessage);
      }
    );
  }

  /** Render methods */

  // 渲染统计的信息
  renderAttendanceStatistics() {
    if (this.state.attendanceStatistics.length != 0 && this.isCustom) {
      return (
        <View>
          <ExceptionTitle typeOfTitle={statisticsTitle} workingDays={7} />
          <ExceptionStatistics attendanceStatistics={this.state.attendanceStatistics}/>
        </View>
      );
    }
    if (this.state.attendanceStatistics.length != 0 && this.workingDays != 0) {
      return (
        <View>
          <ExceptionTitle
            typeOfTitle={statisticsTitle}
            workingDays={this.workingDays}
          />
          <ExceptionStatistics attendanceStatistics={this.state.attendanceStatistics}/>
        </View>
      );
    }
    return null;
  }

  // 渲染异常的列表头部信息
  renderExceptionListTitle() {
    const { unhandledExceptionList } = this.state;
    if (unhandledExceptionList.length != 0) {
      return (
        <ExceptionTitle
          typeOfTitle={listTitle}
          onlyApplyDays={this.exceptionDay}
          unhandleExceptionNum={unhandledExceptionList.length}
          onShow={(y) => this.onShowHint(y)}
        />
      );
    }

    return null;
  }

  // 渲染异常的列表信息
  renderExceptionList() {
    if (this.state.unhandledExceptionList.length != 0) {
      return (
        <ExceptionList
          navigator={this.props.navigator}
          unhandledExceptionList={this.state.unhandledExceptionList}
        />
      );
    }
    return null;
  }

  render() {
    const { topViewHeight } = this.state;

    return (
      <View style={styles.wrapper}>
        {this.renderNavBar()}
        {this.renderNoData()}
        {this.renderContentView()}
        <HintText ref={view => this.hint = view} style={[styles.hintStyle, { top: device.isIos ? topViewHeight+20 : topViewHeight }]}/>
      </View>
    );
  }

  // 渲染空的界面
  renderNoData() {
    const { isLoadF, isLoadB, attendanceStatistics, unhandledExceptionList } = this.state;

    if (isLoadF && isLoadB && attendanceStatistics.length == 0 && unhandledExceptionList.length == 0 ) {
      return (
        <EmptyView
          style={{ backgroundColor: 'white' }}
          onRefreshing={() => this.onRefresh()}
          emptyimg={nodata}
          emptyTitle="暂无数据"
          emptyContent="这里将展示考勤统计信息"/>
      );
    }

    return null;
  }

  renderNavBar() {
    const { navigator } = this.props;

    if (this.isNavBar) {
      return (
        <NavBar
          title={I18n.t('mobile.module.exception.navigationbartitle')}
          onPressLeftButton={() => navigator.pop()}
        />
      );
    }

    return (
      <NavBar
        title={I18n.t('mobile.module.exception.navigationbartitle')}
        onPressLeftButton={() => this.props.navigator.pop()}
        rightContainerRightImage={{ uri: filter }}
        onPressRightContainerRightButton={() => {
          this.hint.onCloseHint();
          this.onPressRightButton();
        }}
      />
    );
  }

  renderContentView() {
    const { refreshing, isLoadF, isLoadB, attendanceStatistics, unhandledExceptionList } = this.state;

    if (isLoadF && isLoadB && attendanceStatistics.length == 0 && unhandledExceptionList.length == 0) {
      return null;
    }

    return (
      <ScrollView
        style={styles.container}
        onScroll={() => this.onScroll()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => this.onRefresh()}
            progressBackgroundColor={refreshStyle.progressBackgroundColor}
            colors={refreshStyle.colors}
            tintColor={refreshStyle.tintColor}
          />
        }>
        {this.renderAttendanceStatistics()}
        {this.renderExceptionListTitle()}
        {this.renderExceptionList()}
      </ScrollView>
    );
  }
}

const styles = EStyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    backgroundColor: '$color.containerBackground',
    flexDirection: 'column',
    flex: 1,
  },
  hintStyle: {
    position: 'absolute',
    height: 45,
    width: 199,
    right: 5,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'center',
  },
  nodataWrapper: {
    flex: 1,
    backgroundColor: 'white',
  },
});