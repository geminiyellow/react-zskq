import {
  DeviceEventEmitter,
  ListView,
  Text,
  View,
  NativeModules,
} from 'react-native';
import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import _ from 'lodash';

import TouchableHighlight from '@/common/components/CustomTouchableHighlight';
import { device, event } from '@/common/Util';
import Loading from '@/common/components/Loading';
import { GET, ABORT } from '@/common/Request';
import Line from '@/common/components/Line';
import { showMessage } from '@/common/Message';
import { getSystemNotificationQty, getModulesFromMobileSaas } from '@/common/api';
import { messageType, sessionId, companyCodeList, companysCode } from '@/common/Consts';
import ScanQrCheckIn from '@/views/MobileCheckIn/ScanQrCheckIn';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
import MyStore from '@/views/MyStore';
import Image from '@/common/components/CustomImage';
import PreviewShoplists from '../SchedulePreView/PreviewShoplists';
import StandardPreviewShoplists from '../SchedulePreViewStandard/PreviewShoplists';
import Shoplists from '../ScheduleVerify/Shoplists';
import CheckinRules from '../CheckinRules';
import LeaveModeHelper from '../Schedule/LeaveModeHelper';
import LoveCare from '../LoveCare';
import CheckinSummary from '../CheckinSummary/components/Tab';
import DirectorApprove from '../DirectorApprove';
import LeaveApply from '../LeaveApply/LeaveReq';
import LeaveApplyEstee from '../LeaveApply/LeaveReqEstee';
import LeaveReqSamsung from '../LeaveApply/LeaveReqSamsung';
import LeaveReqGant from '../LeaveApply/LeaveReqGant';
import MobileCheckIn from '../MobileCheckIn';
import MyForms from '../MyForms';
import OvertimeApply from '../OvertimeApply';
import OvertimeApplyEstee from '../OvertimeApply/estee';
import OvertimeApplySamsung from '../OvertimeApply/samsung';
import ScheduleQuery from '../ScheduleQuery';
import OnBusiness from '../OnBusiness';
import AvailableShift from './../ChangeShift/AvailableShift';
import MySalary from '../MySalary';
import RevokeLeave from '@/views/RevokeLeave';
import TeamPerformance from '@/views/TeamPerformance';
import SelfPerformance from '@/views/SelfPerformance';
import CommissionCalculation from '@/views/CommissionCalculation';
import MyShifts from '@/views/MyShifts';

const leaveModeHelper = new LeaveModeHelper();
// 导入公司代码的数据
const customizedCompanyHelper = new CustomizedCompanyHelper();

const icon1 = 'icon1';
const icon2 = 'icon2';
const icon3 = 'icon3';
const icon4 = 'icon4';
const icon5 = 'icon5';
const icon6 = 'icon6';
const icon7 = 'icon7';
const icon8 = 'icon8';
const icon9 = 'icon9';
const icon10 = 'icon10';
const icon11 = 'icon11';
const icon12 = 'icon12';
const icon13 = 'icon13';
const icon14 = 'icon14';
const icon15 = 'icon15';
const icon16 = 'icon16';
const icon18 = 'icon18';
const icon19 = 'icon19';
const icon20 = 'icon20';

const images = {
  S010010: icon1,
  S010020: icon2,
  S010030: icon3,
  S010040: icon4,
  S010050: icon5,
  S010060: icon6,
  S010070: icon7,
  S010080: icon8,
  S010090: icon9,
  S010100: icon10,
  S010110: icon11,
  S010120: icon12,
  S010130: icon13,
  S010140: icon14,
  S010150: icon15,
  S010160: icon15,
  S010170: icon16,
  S010180: icon18,
  S010190: icon19,
  S010200: icon20,
};

let components;
const { RNManager } = NativeModules;
const componentMap = new Map();

export default class List extends PureComponent {

  constructor(props) {
    super(props);
    this.dataSource = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
    this.state = {
      value: '',
      loaded: false,
      dataSource: this.dataSource,
      needToSignQty: 0,
      myformChgQty: 0,
      myExceptionQty: 0,
      moduleList: [],
    };
    this.onShiftView(global.companyResponseData.version);
  }

  componentDidMount() {
    components = {
      S010010: MobileCheckIn,
      S010020: this.onGetSchedule(),
      S010030: this.onGetLAFunction(componentMap.get('S010030')),
      S010040: this.onGetOTFunction(componentMap.get('S010040')),
      S010050: OnBusiness,
      S010060: MyForms,
      S010070: DirectorApprove,
      S010080: CheckinSummary,
      S010090: CheckinRules,
      S010100: AvailableShift,
      S010110: MySalary,
      S010120: LoveCare,
      S010130: MyStore,
      S010140: Shoplists,
      S010150: PreviewShoplists,
      S010160: StandardPreviewShoplists,
      S010170: RevokeLeave,
      S010180: CommissionCalculation,
      S010190: TeamPerformance,
      S010200: SelfPerformance,
    };
    const params = {};
    params.companyCode = customizedCompanyHelper.getCompanyCode();
    params.hroneUrl = `Login/GetNewFunctionList?SessionID=${sessionId}`;
    // 添加平台判断
    if (global.loginResponseData.PlatForm) {
      params.platForm = global.loginResponseData.PlatForm;
    }
    GET(getModulesFromMobileSaas(params), (resData) => {
      leaveModeHelper.setAuthorities(resData.ModuleList);
      if (_.isEmpty(resData)) return;
      const tempModuleList = resData.ModuleList;
      let i = tempModuleList.length;
      const results = [];
      tempModuleList.map(item => {
        item.Name = I18n.t('mobile.module.home.functions.' + item.Id.toLowerCase());
        item.icon = images[item.Id];
        item.component = components[item.Id];
        item.badge = 0;
        if (item.component) {
          results.push(item);
        }
        while (!(i -= 1)) {
          this.setState({
            moduleList: results,
            loaded: true,
            dataSource: this.state.dataSource.cloneWithRows(_.chunk(results, 3)),
          });
          this.fetchSystemNotificationQtyBackUp(results);
        }
      });
    }, (message) => {
      showMessage(messageType.error, message);
    },
      'getModulesFromMobileSaas');

    this.listeners = [
      DeviceEventEmitter.addListener(event.REFRESH_CORNER_EVENT, (eventBody) => {
        if (eventBody == true) {
          this.fetchSystemNotificationQty();
        }
      }),
      DeviceEventEmitter.addListener(event.SYNC_BADGE_EVENT, (eventBody) => {
        if (eventBody == true) {
          this.fetchSystemNotificationQty();
        }
      }),
    ];

    this.languageChanged = DeviceEventEmitter.addListener('changeLanguage', (data) => {
      this.state.moduleList.map(item => {
        item.Name = I18n.t('mobile.module.home.functions.' + item.Id.toLowerCase());
        item.icon = images[item.Id];
        item.component = components[item.Id];
        item.badge = 0;
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(_.chunk(this.state.moduleList, 3)),
      });
    });
  }

  componentWillUnmount() {
    this.languageChanged.remove();
    this.listeners && this.listeners.forEach(listener => listener.remove());
    this.requestAnimationFrame && cancelAnimationFrame(this.requestAnimationFrame);
    ABORT('getSystemNotificationQty');
  }

  // 记载加班的页面（根据公司代码的不同而现实不同的页面）
  onGetOTFunction(versionId) {
    if (versionId === companyCodeList.standard) {
      // 标准版
      return OvertimeApply;
    }
    if (versionId === companyCodeList.estee) {
      // 雅诗兰黛
      return OvertimeApplyEstee;
    }
    if (versionId === companyCodeList.gant) {
      // 甘特
      return OvertimeApplyEstee;
    }
    if (versionId === companyCodeList.samsung) {
      // 三星
      return OvertimeApplySamsung;
    }
    // 默认跳转加班
    return OvertimeApply;
  }

  onGetSchedule() {
    if (customizedCompanyHelper.getCompanyCode() === companysCode.Estee || customizedCompanyHelper.getCompanyCode() === companysCode.Gant
      || customizedCompanyHelper.getCompanyCode() === companysCode.Samsung) {
      return ScheduleQuery;
    }
    return MyShifts;
  }

  // 记载请假的页面（根据公司代码的不同而现实不同的页面）
  onGetLAFunction(versionId) {
    if (versionId === companyCodeList.standard) {
      // 标准版
      return LeaveApply;
    }
    if (versionId === companyCodeList.estee) {
      // 雅诗兰黛
      return LeaveApplyEstee;
    }
    if (versionId === companyCodeList.gant) {
      // 甘特
      return LeaveReqGant;
    }
    if (versionId === companyCodeList.samsung) {
      // 三星
      return LeaveReqSamsung;
    }
    // 默认跳转请假
    return LeaveApply;
  }

  // 请假加班跳转
  onShiftView(versions) {
    // 请假 加班跳转
    for (i = 0; i < versions.length; i += 1) {
      // 存入map中
      componentMap.set(versions[i].moduleCode, versions[i].companyCode);
    }
  }

  onItemPressed(rowData) {
    const { needToSignQty, myformChgQty, myExceptionQty } = this.state;
    if (rowData.component == MobileCheckIn) {
      const punchTypeList = global.companyResponseData.attendance;
      if (punchTypeList.length == 1 && punchTypeList[0] == 'APP_QR') {
        rowData.component = ScanQrCheckIn;
      }
      RNManager.startLocationService();
    }

    this.props.navigator.push({
      component: rowData.component,
      passProps: {
        needToSignQty,
        myformChgQty,
        myExceptionQty,
      },
    });
    cancelAnimationFrame(this.requestAnimationFrame);
  }

  fetchSystemNotificationQty() {
    if (global.loginResponseData.PlatForm) {
      return;
    }
    GET(getSystemNotificationQty(), (responseData) => {
      let i = this.state.moduleList.length;
      this.state.moduleList.map(item => {
        if (item.component === DirectorApprove) {
          item.badge = responseData.needToSignQty;
        }
        if (item.component === MyForms) {
          item.badge = responseData.myformChgQty;
        }

        while (!(i -= 1)) {
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(_.chunk(this.state.moduleList, 3)),
            needToSignQty: responseData.needToSignQty,
            myformChgQty: responseData.myformChgQty,
            myExceptionQty: responseData.myExceptionQty,
          });
        }
      });
    }, (message) => {
      showMessage(messageType.error, message);
    },
      'getSystemNotificationQty');
  }

  fetchSystemNotificationQtyBackUp(tempModuleList) {
    if (global.loginResponseData.PlatForm) {
      return;
    }
    GET(getSystemNotificationQty(), (responseData) => {
      let i = tempModuleList.length;
      tempModuleList.map(item => {
        if (item.component === DirectorApprove) {
          item.badge = responseData.needToSignQty;
        }
        if (item.component === MyForms) {
          item.badge = responseData.myformChgQty;
        }

        while (!(i -= 1)) {
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(_.chunk(tempModuleList, 3)),
            needToSignQty: responseData.needToSignQty,
            myformChgQty: responseData.myformChgQty,
            myExceptionQty: responseData.myExceptionQty,
          });
        }
      });
    }, (message) => {
      showMessage(messageType.error, message);
    },
      'getSystemNotificationQty');
  }

  handleOnPress(rowData) {
    this.requestAnimationFrame = requestAnimationFrame(() => {
      this.onItemPressed(rowData);
    });
  }

  renderBadgeWidth(number) {
    if (number < 10) {
      return 18;
    } else if (number >= 10 && number <= 99) {
      return 24;
    }
    return 28;
  }

  renderBadge(item) {
    const { needToSignQty, myformChgQty, myExceptionQty } = this.state;
    if (item.component === DirectorApprove && needToSignQty > 0) {
      return (
        <View style={[styles.badgeWrapper, { width: this.renderBadgeWidth(needToSignQty) }]}>
          <Text allowFontScaling={false} style={styles.badgeText}>{needToSignQty <= 99 ? needToSignQty : '99+'}</Text>
        </View>
      );
    }
    if (item.component === MyForms && myformChgQty > 0) {
      return (
        <View style={[styles.badgeWrapper, { width: this.renderBadgeWidth(myformChgQty) }]}>
          <Text allowFontScaling={false} style={styles.badgeText}>{myformChgQty}</Text>
        </View>
      );
    }
    if (item.component === CheckinSummary && myExceptionQty > 0) {
      return (
        <View style={[styles.badgeWrapper, { width: this.renderBadgeWidth(myExceptionQty) }]}>
          <Text allowFontScaling={false} style={styles.badgeText}>{myExceptionQty}</Text>
        </View>
      );
    }
    return null;
  }
  renderIconImg(item) {
    return (
      <Image source={{ uri: item.icon }} style={styles.rowItemIcon} />
    );
  }
  renderRowData(rowData, sectionID, rowID) {
    const rowArray = [];

    rowData.forEach((item, i) => {
      rowArray.push(
        <View key={`${sectionID}-${rowID}-${i}`} style={styles.itemWrapper}>
          <TouchableHighlight style={styles.rowItem} onPress={() => this.onItemPressed(item)}>
            <View style={{ width: 56 + 18, height: 56 + 9, alignItems: 'center' }}>
              {this.renderIconImg(item)}
              {this.renderBadge(item)}
            </View>
          </TouchableHighlight>
          <Text allowFontScaling={false} numberOfLines={2} style={styles.rowItemTitle} >{item.Name}</Text>
        </View>
      );
    });

    return (
      <View style={{ flexDirection: 'row' }}>
        {rowArray}
      </View>
    );
  }

  render() {
    const { loaded, dataSource } = this.state;
    if (!loaded) {
      return (
        <View style={styles.listWrapper}>
          <Loading />
        </View>
      );
    }

    return (
      <View style={styles.listWrapper}>
        <View style={styles.myApp}>
          <Line style={styles.leftLine} />
          <Text allowFontScaling={false} style={styles.myAppTitle}>{I18n.t('mobile.module.home.functions.head')}</Text>
          <Line style={styles.rightLine} />
        </View>
        <ListView
          removeClippedSubviews={false}
          pageSize={24}
          dataSource={dataSource}
          renderRow={(rowData, sectionID, rowID) => this.renderRowData(rowData, sectionID, rowID)}
          style={styles.listView}
        />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  listWrapper: {
    backgroundColor: '$color.white',
    alignItems: 'center',
    paddingBottom: 20,
  },
  myApp: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
    marginTop: 10,
  },
  leftLine: {
    width: 90,
    marginRight: 8,
  },
  rightLine: {
    width: 90,
    marginLeft: 8,
  },
  myAppTitle: {
    fontSize: 11,
    color: '$color.titleTextColor',
  },
  listView: {
    width: device.width - 20,
    marginHorizontal: 10,
  },
  itemWrapper: {
    width: (device.width - 20) / 3,
    alignItems: 'center',
  },
  rowItem: {
    width: 76,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  rowItemIcon: {
    marginTop: 8,
    width: 56,
    height: 56,
  },
  rowItemTitle: {
    fontSize: 11,
    marginBottom: 10,
    textAlign: 'center',
  },
  badgeWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 18,
    borderRadius: 10,
    backgroundColor: '#f43530',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  badgeText: {
    color: '$color.white',
    fontSize: 10,
    textAlign: 'center',
  },
});
