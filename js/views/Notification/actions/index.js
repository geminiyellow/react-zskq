import { actionType } from '../constants';

// 是否加载完成通知信息
export function isNotificationLoading(isLoading) {
  return {
    type: actionType.IS_NOTIFICATION_LOADING,
    isLoading,
  };
}

// 从服务器中接收数据
export function receiveDataFromServer(serverData) {
  return {
    type: actionType.RECEIVE_DATA_FROM_SERVER,
    serverData,
  };
}

// 得到当前的语言
export function getCurrentLanguageBySet(getLanguage) {
  return {
    type: actionType.GET_CURRENT_LANGUAGE_BY_SET,
    getLanguage,
  };
}