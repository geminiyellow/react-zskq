import { actionType } from '../constants';

const initialState = {
  isShowBluetoothMessageBar: false,
  isShowGPSMessageBar: false,
  time: '00:30:00',
  isEmpty: false,
  isAnimating: true,
  isRefreshing: false,
  devices: '',
  pickerData: ['1'],
  selectedValue: ['1'],
  isShowWiFiBar: false,
  loaded: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionType.IS_SHOW_BLUETOOTH_MESSAGE_BAR:
      return { ...state, isShowBluetoothMessageBar: action.value };
    case actionType.IS_SHOW_GPS_MESSAGE_BAR:
      return { ...state, isShowGPSMessageBar: action.value };
    case actionType.TIME_DATA:
      return { ...state, time: action.time };
    case actionType.IS_EMPTY:
      return { ...state, isEmpty: action.value };
    case actionType.IS_ANIMATING:
      return { ...state, isAnimating: action.value };
    case actionType.IS_REFRESHING:
      return { ...state, isRefreshing: action.value };
    case actionType.DEVICES_DATA:
      return { ...state, devices: action.devices };
    case actionType.SHOW_ANNOTATION:
      return { ...state, annotations: action.annotations };
    case actionType.SET_PICKER_DATA:
      return { ...state, pickerData: action.pickerData };
    case actionType.SET_SELECTED_VALUE:
      return { ...state, selectedValue: action.value };
    case actionType.SET_RANGE_VALUE:
      return { ...state, rangeValue: action.value };
    case actionType.SHOW_WIFI_BAR:
      return { ...state, isShowWiFiBar: action.value };
    case actionType.SET_ADDRESS:
      return { ...state, address: action.value };
    case actionType.LOAD_SET_LOCATION_VIEW:
      return { ...state, loaded: action.value };
    default:
      return state;
  }
}