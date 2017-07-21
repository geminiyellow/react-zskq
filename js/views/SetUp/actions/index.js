// Action Creators

import { actionType } from '../constants';

export function showBluetoothMessageBar(value) {
  return {
    type: actionType.IS_SHOW_BLUETOOTH_MESSAGE_BAR,
    value,
  };
}

export function showGPSMessageBar(value) {
  return {
    type: actionType.IS_SHOW_GPS_MESSAGE_BAR,
    value,
  };
}

export function RefreshTimeData(time) {
  return {
    type: actionType.TIME_DATA,
    time,
  };
}

export function showEmptyView(value) {
  return {
    type: actionType.IS_EMPTY,
    value,
  };
}

export function showActivityIndicator(value) {
  return {
    type: actionType.IS_ANIMATING,
    value,
  };
}

export function showRefreshControl(value) {
  return {
    type: actionType.IS_REFRESHING,
    value,
  };
}

export function showDevicesList(devices) {
  return {
    type: actionType.DEVICES_DATA,
    devices,
  };
}

export function showAnotation(annotations) {
  return {
    type: actionType.SHOW_ANNOTATION,
    annotations,
  };
}

export function setPickerData(pickerData) {
  return {
    type: actionType.SET_PICKER_DATA,
    pickerData,
  };
}

export function setSelectedValue(value) {
  return {
    type: actionType.SET_SELECTED_VALUE,
    value,
  };
}

export function setRangeValue(value) {
  return {
    type: actionType.SET_RANGE_VALUE,
    value,
  };
}

export function showWiFiBar(value) {
  return {
    type: actionType.SHOW_WIFI_BAR,
    value,
  };
}

export function setAddress(value) {
  return {
    type: actionType.SET_ADDRESS,
    value,
  };
}

export function loadSetLocationView(value) {
  return {
    type: actionType.LOAD_SET_LOCATION_VIEW,
    value,
  };
}