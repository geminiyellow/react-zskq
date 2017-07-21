import Device from 'react-native-device-detection';
import DeviceInfo from 'react-native-device-info';
import keyMirror from 'fbjs/lib/keyMirror';
import { StyleSheet } from 'react-native';

module.exports = {
  // 设备信息
  device: {
    width: Device.width,
    height: Device.height,
    isIos: Device.isIos,
    isAndroid: Device.isAndroid,
    isPhone: Device.isPhone,
    isTablet: Device.isTablet,
    mobileName: `${DeviceInfo.getManufacturer()} ${DeviceInfo.getModel()}`,
    deviceName: `${DeviceInfo.getDeviceName()}`,
    mobileOS: `${DeviceInfo.getSystemVersion()}`,
    mobileLocale: `${DeviceInfo.getDeviceLocale().split('-')[0]}`,
    // 单位像素
    hairlineWidth: StyleSheet.hairlineWidth,
  },

  // AsyncStorage的key
  keys: keyMirror({
    // 全局信息: 接口地址、企业名称、企业代码、当前国际化语言
    globalInfo: null,
    // 登录成功后的用户信息：工号、密码
    userInfo: null,
  }),

  event: keyMirror({
    BAIDUMAP_LOCATION_DATA: null,
    UPDATE_EXCEPTION_DATA: null,
    REFRESH_CORNER_EVENT: null,
    SYNC_BADGE_EVENT: null,
    REFRESH_LEAVE_CREADITS_DATA: null,
    REFRESH_LEAVE_TYPE_REQ_DATA: null,
    REFRESH_LEAVE_TYPE_DATA: null,
    REFRESH_LEAVE_DATE: null,
    REFRESH_LEAVE_TIME: null,
    REFRESH_LEAVE_MODAL_DATA: null,
    REFRESH_LEAVE_DURATION_DATA: null,
    REFRESH_LEAVE_REASON_DATA: null,
    REFRESH_LEAVE_SUBMIT: null,
    SELECT_TAB: null,
    BADGE_TAB: null,
    LOGIN_SUCCESS: null,
    // 出差申请
    OB_DELETE_FORM: null,
    OB_PICK_EXPENSE_TYPE: null,
    OB_PICK_START_DATE: null,
    OB_PICK_END_DATE: null,
    OB_PICK_CURRENCY: null,
    OB_SET_AMOUNT: null,
    OB_SET_COST_DESCRIPTION: null,
    OB_SET_PROJECTCODE: null,
    // 退出事件
    EXIT: null,
    // 接收新数据
    GET_COMISSION_DATA: null,
  }),

  // Tab图片
  tabImages: {
    normal: {
      function: 'function',
      notice: 'notice',
      mine: 'mine',
      buetooth: 'buetooth_normal',
      location: 'location_normal',
      qrcode: 'qrcode_normal',
    },
    active: {
      function: 'function_active',
      notice: 'notice_active',
      mine: 'mine_active',
      buetooth: 'buetooth_active',
      location: 'location_active',
      qrcode: 'qrcode_active',
    },
  },

  // Tab
  tab: keyMirror({
    functionTab: null,
    notificationTab: null,
    mineTab: null,
  }),
};
