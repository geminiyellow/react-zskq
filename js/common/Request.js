import {
  NativeModules,
} from 'react-native';
import I18n from 'react-native-i18n';
import fetch from 'react-native-cancelable-fetch';
import _ from 'lodash';
import { requestTimeout, apiAddress, sessionId } from './Consts';
import { device } from '@/common/Util';
import { AlertManager } from '@/common/components/CustomAlert';
import { logRequestErrorInfo } from './Log/requestLogHelper';

// 接口名称
let apiName = '';
const { RNManager } = NativeModules;

function parseJSON(responseData) {
  return responseData.json();
}

function timeout() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject({ message: 'timeOut' });
    }, requestTimeout);
  });
}

function processAPICallBack(responseData, successCallBack, errorCallBack) {
  if (!responseData.hasOwnProperty('result')) {
    if (responseData.id) {
      successCallBack(responseData);
    } else {
      errorCallBack(JSON.stringify(responseData));
      logRequestErrorInfo(apiName);
    }
    return;
  }
  if (responseData != null) {
    if (!responseData.result) {
      if (errorCallBack) {
        // 会话失效
        if (responseData.errorMsg === 'Session expired') {
          AlertManager.show();
          // errorCallBack(I18n.t('mobile.module.login.sessionexpired'));
          errorCallBack();
          logRequestErrorInfo(apiName);
          return;
        }
        if (responseData.errorMsg) {
          errorCallBack(responseData.errorMsg);
          logRequestErrorInfo(apiName);
        } else {
          errorCallBack(responseData.MessageDetail);
          logRequestErrorInfo(apiName);
        }
      }
      return;
    }
  } else {
    errorCallBack(I18n.t('mobile.module.login.servererror'));
    logRequestErrorInfo(apiName);
    return;
  }
  successCallBack(responseData.data);
}

module.exports = {
  GET(urlCallBack, successCallBack, errorCallBack, tag = '') {
    if (!errorCallBack) return;
    const url = urlCallBack(apiAddress, sessionId);

    apiName = url;
    if (device.isAndroid) {
      RNManager.isShiftTSL((response) => {
        if (response) {
          RNManager.RNGet(url, (responseData) => {
            if (!_.isEmpty(responseData)) {
              responseData = eval('(' + responseData + ')');
            }
            processAPICallBack(responseData, successCallBack, errorCallBack);
          });
        } else {
          Promise.race([timeout(), fetch(url, null, tag)])
            .then(parseJSON)
            .then(responseData => processAPICallBack(responseData, successCallBack, errorCallBack))
            .catch((error) => {
              if (error.message == 'Network request failed') {
                errorCallBack(I18n.t('mobile.module.login.neterror'));
                return;
              }
              if (error.message == 'timeOut') {
                errorCallBack(I18n.t('mobile.module.login.neterror'));
                return;
              }
              errorCallBack(String(error.message));
            })
            .done();
        }
      });
    } else {
      Promise.race([timeout(), fetch(url, null, tag)])
        .then(parseJSON)
        .then(responseData => processAPICallBack(responseData, successCallBack, errorCallBack))
        .catch((error) => {
          if (error.message == 'Network request failed') {
            errorCallBack(I18n.t('mobile.module.login.neterror'));
            return;
          }
          if (error.message == 'timeOut') {
            errorCallBack(I18n.t('mobile.module.login.neterror'));
            return;
          }
          errorCallBack(String(error.message));
        })
        .done();
    }
  },

  POST(urlCallBack, data, successCallBack, errorCallBack, tag = '') {
    if (!errorCallBack) return;

    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    const url = urlCallBack(apiAddress, sessionId);
    apiName = url;
    if (device.isAndroid) {
      RNManager.isShiftTSL((response) => {
        if (response) {
          RNManager.RNPost(url, JSON.stringify(data), (responseData) => {
            if (!_.isEmpty(responseData)) {
              responseData = eval('(' + responseData + ')');
            }
            processAPICallBack(responseData, successCallBack, errorCallBack);
          });
        } else {
          Promise.race([timeout(), fetch(url, options, null, tag)])
            .then(parseJSON)
            .then(responseData => processAPICallBack(responseData, successCallBack, errorCallBack))
            .catch((error) => {
              if (error.message == 'Network request failed') {
                errorCallBack(I18n.t('mobile.module.login.neterror'));
                return;
              }
              if (error.message == 'timeOut') {
                errorCallBack('');
                return;
              }
              errorCallBack(String(error.message));
            })
            .done();
        }
      });
    } else {
      Promise.race([timeout(), fetch(url, options, null, tag)])
        .then(parseJSON)
        .then(responseData => processAPICallBack(responseData, successCallBack, errorCallBack))
        .catch((error) => {
          if (error.message == 'Network request failed') {
            errorCallBack(I18n.t('mobile.module.login.neterror'));
            return;
          }
          if (error.message == 'timeOut') {
            errorCallBack('');
            return;
          }
          errorCallBack(String(error.message));
        })
        .done();
    }
  },

  ABORT(tag) {
    fetch.abort(tag);
  },
};