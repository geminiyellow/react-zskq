import {
  InteractionManager,
  View,
  Text,
  ScrollView,
  ListView,
  RefreshControl,
} from 'react-native';
import React, { Component } from 'React';

import I18n from 'react-native-i18n';
import _ from 'lodash';
import moment from 'moment';
import { GET, ABORT } from '@/common/Request';
import { showMessage } from '@/common/Message';
import Picker, { optionPickerType } from '@/common/components/OptionPicker';
import { messageType, appVersion } from '@/common/Consts';
import UmengAnalysis from '@/common/components/UmengAnalysis';
import { getEmployeePayrollInfo, getEmployeePayrollInfoNew } from '@/common/api';
import Line from '@/common/components/Line';
import Functions, { decrypt, getYYYYMMFormat, getYYYYMMDDFormat } from '@/common/Functions';
import NavBar from '@/common/components/NavBar';
import Tab from '@/views/Tab';
import { device, keys } from '@/common/Util';
import Image from '@/common/components/CustomImage';
import OptionCard from '@/common/components/OptionCard';
import realm from '@/realm';

import WaterMask from './WaterMask';
import styles from './SalaryIndexStyle';

const chooseMonth = 'choose_month';
const salaryWave = 'salary_wave';
let subItemsAddNum = 0;
let subItemsMinusNum = 0;
let monthRan = 0;

export default class Salary extends Component {
  constructor(props) {
    super(props);
    this.dataSource = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
    this.state = {
      maskText: '',
      mySalaryList: null,
      mySalaryNum: 0,
      refreshing: true,
      selectedYear: Functions.getYear(),
      selectedMonth: Functions.getMonth(),
      loaded: false,
    };
  }

  componentWillMount() {
    UmengAnalysis.onPageBegin('MySalary');
  }

  componentDidMount() {
    const monthNum = `${this.state.selectedYear}-${this.state.selectedMonth}`;
    this.getSalaryInformation(monthNum);
  }

  componentWillUnmount() {
    UmengAnalysis.onPageEnd('MySalary');
    ABORT('getEmployeePayrollInfo');
    ABORT('abortGetEmployeePayrollInfoNew');
  }

  onRefresh() {
    this.setState({ refreshing: true });
    const monthNum = `${this.state.selectedYear}-${this.state.selectedMonth}`;
    this.getSalaryInformation(monthNum);
  }

  onSalaryMonthPickerPress() {
    this.SalaryMonthPicker.toggle();
  }

  onBackPressed() {
    this.backToTab();
  }

  getSalaryInformation(date) {
    const companyInfo = realm.objects('Company');
    const params = {};
    params.monthNum = date;
    params.companyCode = companyInfo[0].code;
    params.version = appVersion;
    this.fetchEmployeePayrollInfoNew(params);
  }

  backToTab() {
    const routes = this.props.navigator.state.routeStack;
    for (let i = routes.length - 1; i >= 0; i -= 1) {
      if (routes[i].component === Tab) {
        const destinationRoute = this.props.navigator.getCurrentRoutes()[i];
        this.props.navigator.popToRoute(destinationRoute);
      }
    }
  }

  fetchEmployeePayrollInfo(params) {
    GET(getEmployeePayrollInfo(params), (responseData) => {
      monthRan = responseData.monthRange;
      responseSalaryData = responseData.salaryData;
      if (responseSalaryData.length > 0) {
        responseSalaryData.forEach((item) => {
          decrypt(item.PayRollMoney).then(money => {
            item.PayRollMoney = Functions.format(money);
            if (item.PayRollAddSubjectList.length > 0) {
              subItemsAddNum = item.PayRollAddSubjectList.length;
              item.PayRollAddSubjectList.forEach((subItem, i) => {
                decrypt(subItem.SubMoney).then(value => {
                  subItem.SubMoney = Functions.format(value);
                  if (i == item.PayRollAddSubjectList.length - 1) {
                    if (item.PayRollSubtractSubjectList.length > 0) {
                      subItemsMinusNum = item.PayRollSubtractSubjectList.length;
                      item.PayRollSubtractSubjectList.forEach((subMinusItem, j) => {
                        decrypt(subMinusItem.SubMoney).then(v => {
                          subMinusItem.SubMoney = Functions.format(v);
                          if (j == item.PayRollSubtractSubjectList.length - 1) {
                            this.setState({
                              mySalaryList: this.dataSource.cloneWithRows(responseSalaryData),
                              mySalaryNum: responseSalaryData.length,
                              loaded: true,
                            });
                          }
                        });
                      });
                    } else {
                      this.setState({
                        mySalaryList: this.dataSource.cloneWithRows(responseSalaryData),
                        mySalaryNum: responseSalaryData.length,
                        loaded: true,
                      });
                    }
                  }
                });
              });
            } else {
              this.setState({
                mySalaryList: this.dataSource.cloneWithRows(responseSalaryData),
                mySalaryNum: responseSalaryData.length,
                loaded: true,
              });
            }
          });
        });
      } else {
        this.setState({
          mySalaryNum: 0,
          loaded: true,
        });
      }

      this.setState({ refreshing: false });
      const empName = !_.isUndefined(global.loginResponseData.EmpName) ? global.loginResponseData.EmpName : '';
      const englishName = !_.isUndefined(global.loginResponseData.EnglishName) ? global.loginResponseData.EnglishName : '';
      const nowTime = moment().format('YYYY-MM-DD HH:mm');
      this.setState({
        maskText: `${empName} ${englishName} ${nowTime}  `,
      });
    }, (message) => {
      this.setState({ refreshing: false });
      showMessage(messageType.error, message);
    },
      'getEmployeePayrollInfo');
  }

  fetchEmployeePayrollInfoNew(params) {
    GET(getEmployeePayrollInfoNew(params), (responseData) => {
      monthRan = responseData.monthRange;
      responseSalaryData = responseData.salaryData;
      if (responseSalaryData.length > 0) {
        responseSalaryData.forEach((item) => {
          decrypt(item.PayRollMoney).then(money => {
            item.PayRollMoney = Functions.format(money);
            item.AllPayRollSubjectList.forEach(type => {
              decrypt(type.Money).then(moneyL => {
                type.Money = Functions.format(moneyL);
                if (type.Others.length > 0) {
                  type.Others.forEach(detail => {
                    decrypt(detail.Money).then(moneyF => {
                      detail.Money = moneyF;
                      InteractionManager.runAfterInteractions(() => {
                        this.setState({
                          mySalaryList: this.dataSource.cloneWithRows(responseSalaryData),
                          mySalaryNum: responseSalaryData.length,
                          loaded: true,
                        });
                      });
                    });
                  });
                } else {
                  InteractionManager.runAfterInteractions(() => {
                    this.setState({
                      mySalaryList: this.dataSource.cloneWithRows(responseSalaryData),
                      mySalaryNum: responseSalaryData.length,
                      loaded: true,
                    });
                  });
                }
              });
            });
          });
        });
      } else {
        this.setState({
          mySalaryNum: 0,
          loaded: true,
        });
      }

      this.setState({ refreshing: false });
      const empName = !_.isUndefined(global.loginResponseData.EmpName) ? global.loginResponseData.EmpName : '';
      const englishName = !_.isUndefined(global.loginResponseData.EnglishName) ? global.loginResponseData.EnglishName : '';
      const nowTime = moment().format('YYYY-MM-DD HH:mm');
      this.setState({
        maskText: `${empName} ${englishName} ${nowTime}`,
      });
    }, (message) => {
      showMessage(messageType.error, JSON.stringify(message));
    }, 'abortGetEmployeePayrollInfoNew');
  }

  salarySubItems(rowData, sectionID, rowID) {
    const rowArray = [];
    rowData.forEach((item, i) => {
      rowArray.push(
        <View key={`${sectionID}-${rowID}-${i}`} style={styles.salarySubItem}>
          <Text allowFontScaling={false}>{item.SubName}</Text>
          <Text allowFontScaling={false}>{item.SubMoney}</Text>
        </View>,
      );
    });
    return (
      <View>
        {rowArray}
      </View>
    );
  }

  renderSalaryItems(rowData, sectionID, rowID) {
    const j = rowData.length;
    const arrItems = [];
    for (let i = 0; i < j; i += 1) {
      arrItems.push(this.renderSalaryItemsTitle(rowData[i]));
    }

    return arrItems;
  }

  renderSalaryItemsTitle(data) {
    const arrItem = [];
    arrItem.push(
      <View style={{ flexDirection: 'row' }}>
        <Text style={[styles.salaryItemsTitle, { marginLeft: 24 }]}>{data.Name}</Text>
        <View style={{ flex: 1 }} />
        <Text style={[styles.salaryItemsTitle, { marginRight: 24 }]}>{data.Money}</Text>
      </View>);
    if (data.Others) {
      const j = data.Others.length;
      for (let i = 0; i < j; i += 1) {
        arrItem.push(this.renderSalaryItemsDetail(data.Others[i]));
      }
    }
    arrItem.push(
      <View style={{ width: device.width, height: 32 }} />,
    );

    return arrItem;
  }

  renderSalaryItemsDetail(detail) {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Text style={[styles.salaryItemsDetail, { marginLeft: 24 }]}>{detail.Name}</Text>
        <View style={{ flex: 1 }} />
        <Text style={[styles.salaryItemsDetail, { marginRight: 24 }]}>{detail.Money}</Text>
      </View>
    );
  }

  renderSingleItemView() {
    if (this.state.mySalaryNum == 1) {
      const subItemsHeight = (subItemsAddNum + subItemsMinusNum) * 24;
      const totalRowItem = 453 + subItemsHeight;
      if (totalRowItem <= device.height) {
        return (
          <View
            style={{
              height: device.height - totalRowItem,
              width: device.width,
              backgroundColor: '#F0EFF5'
            }} />
        );
      }
      return null;
    }
  }

  renderSeparator(sectionID, rowID) {
    return (
      <View key={`${sectionID}-${rowID}`} style={styles.rowSeperator}>
        <Image source={{ uri: salaryWave }} style={styles.salaryWave} />
        {this.renderSingleItemView()}
      </View>
    );
  }

  renderMySalaryRowData(rowData, sectionID, rowID) {
    const SalaryDateST = getYYYYMMDDFormat(rowData.SalaryDateS);
    const SalaryDateET = getYYYYMMDDFormat(rowData.SalaryDateE);
    return (
      <View key={`${sectionID}-${rowID}`} style={styles.rowItem}>
        <View style={styles.packageNameWrapper}>
          <Text allowFontScaling={false} style={styles.packageNameLabel}>{rowData.PackageName}{I18n.t('mobile.module.salary.packagenamedesc')}</Text>
        </View>
        <View style={styles.payMoneyWrapper}>
          <Text allowFontScaling={false} style={styles.payMoney}>{rowData.PayRollMoney}</Text>
        </View>
        <View style={styles.salaryStageWrapper}>
          <Text allowFontScaling={false} style={styles.salaryStage}>{SalaryDateST} {I18n.t('mobile.module.salary.salaryto')} {SalaryDateET}</Text>
        </View>
        <Line style={styles.separator} />

        {this.renderSalaryItems(rowData.AllPayRollSubjectList, sectionID, rowID)}

        <View style={styles.privacyItemStyle}>
          <Line style={styles.privacyLine} />
          <Text allowFontScaling={false} style={styles.privacyText}>{I18n.t('mobile.module.salary.protectprivacy')}</Text>
          <Line style={styles.privacyLine} />
        </View>
      </View>
    );
  }

  renderListContent() {
    return (
      <View style={{ flex: 1 }}>
        <Line />
        <ListView
          removeClippedSubviews={false}
          enableEmptySections
          dataSource={this.state.mySalaryList}
          bounces={false}
          renderSeparator={(sectionID, rowID) => this.renderSeparator(sectionID, rowID)}
          renderRow={(rowData, sectionID, rowID) => this.renderMySalaryRowData(rowData, sectionID, rowID)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.onRefresh()}
              progressViewOffset={40}
            />
          }
        />
      </View>
    );
  }

  renderEmptyContent() {
    return (
      <ScrollView
        style={styles.container}
        bounces={false}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => this.onRefresh()}
            progressViewOffset={40}
          />
        }>
        <Line />
        <View style={styles.emptyContentWrapper}>
          <Text allowFontScaling={false} style={styles.emptyText}>{I18n.t('mobile.module.salary.nosalarydata')}</Text>
        </View>

        <Line />
        <View style={styles.emptyGrayBg} />
      </ScrollView>
    );
  }

  renderMonthSelection() {
    if (this.state.loaded) {
      const detailText = getYYYYMMFormat(`${this.state.selectedYear}-${this.state.selectedMonth}`);
      return (
        <OptionCard
          style={{ backgroundColor: '#ff000000' }}
          title={I18n.t('mobile.module.salary.salarymonthlabel')}
          detailText={detailText}
          onPress={() => this.onSalaryMonthPickerPress()}
          bottomLine
          leftImageName={chooseMonth}
        />
      );
    }
    return null;
  }

  renderGrayViewSeperator() {
    return (
      <View style={styles.grayViewSeperator} />
    );
  }

  renderMonthPicker() {
    if (this.state.loaded) {
      return (
        <Picker
          ref={picker => this.SalaryMonthPicker = picker}
          pickerTitle={I18n.t('mobile.module.salary.salarymonthlabel')}
          dateData={Functions.createDateDataForSalary(monthRan)}
          component={optionPickerType.mutiMode}
          selectedValue={[`${this.state.selectedYear}`, this.state.selectedMonth]}
          onPickerDone={(pickedValue) => {
            this.setState({
              selectedYear: pickedValue[0],
              selectedMonth: pickedValue[1],
            });
            const monthNum = `${pickedValue[0]}-${pickedValue[1]}`;
            this.getSalaryInformation(monthNum);
          }
          } />
      );
    }
    return null;
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <WaterMask maskText={this.state.maskText} navigator={this.props.navigator} />

        <View style={styles.container}>
          <NavBar
            title={I18n.t('mobile.module.salary.title')}
            onPressLeftButton={() => this.onBackPressed()} />

          {this.renderGrayViewSeperator()}
          {this.renderMonthSelection()}
          {this.renderGrayViewSeperator()}
          {this.state.mySalaryNum > 0 ? this.renderListContent() : this.renderEmptyContent()}

        </View>

        {this.renderMonthPicker()}
      </View>
    );
  }
}
