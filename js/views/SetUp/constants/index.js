// Action Type

import keyMirror from 'fbjs/lib/keyMirror';

module.exports = {
  actionType: keyMirror({
    // 是否显示蓝牙未开启提示 View
    IS_SHOW_BLUETOOTH_MESSAGE_BAR: null,
    // 是否显示定位未开启提示 View
    IS_SHOW_GPS_MESSAGE_BAR: null,
    // 倒计时剩余时间
    TIME_DATA: null,
    // 考勤设备列表是否为空
    IS_EMPTY: null,
    // Activity indicator is Animating?
    IS_ANIMATING: null,
    // RefreshControl is refreshing?
    IS_REFRESHING: null,
    // 考勤点列表数据
    DEVICES_DATA: null,
    // 显示地图标注
    SHOW_ANNOTATION: null,
    // 设置 Picker Data
    SET_PICKER_DATA: null,
    // Set picker's selected value.
    SET_SELECTED_VALUE: null,
    // Set range value.
    SET_RANGE_VALUE: null,
    // Show WiFi bar.
    SHOW_WIFI_BAR: null,
    // Set address text.
    SET_ADDRESS: null,
    // Load setLocation view.
    LOAD_SET_LOCATION_VIEW: null,
  }),
};