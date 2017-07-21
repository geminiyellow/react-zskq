import { actionType } from '../constants';

const initialState = {
  // 加载请求通知数据
  isLoading: true,
  // 显示接口数据的数组
  serverData: '',
  // 获取当前的语言信息
  getLanguage: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionType.IS_NOTIFICATION_LOADING:
      return { ...state, isLoading: action.isLoading };

    case actionType.RECEIVE_DATA_FROM_SERVER:
      return { ...state, serverData: action.serverData };

    case actionType.GET_CURRENT_LANGUAGE_BY_SET:
      return { ...state, getLanguage: action.getLanguage };

    default:
      return state;
  }
}