import I18n from 'react-native-i18n';
import fetch from 'react-native-cancelable-fetch';
import _ from 'lodash';
import { requestTimeout, apiAddress, sessionId } from './Consts';

function parseJSON(responseData) {
  // console.log('parseJSON data --- ', responseData);
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
  // console.log('responseData --- ', responseData);
  if (!responseData.hasOwnProperty('result')) {
    if (responseData.id) {
      successCallBack(responseData);
    } else {
      errorCallBack(JSON.stringify(responseData));
    }
    return;
  }
  if (responseData != null) {
    if (!responseData.result) {
      if (errorCallBack) {
        if (responseData.errorMsg === 'Session expired') {
          // 会话失效
          errorCallBack(I18n.t('SessionExpired'));
          return;
        }
        if (responseData.errorMsg) {
          errorCallBack(responseData.errorMsg);
        } else {
          errorCallBack(responseData.MessageDetail);
        }
      }
      return;
    }
  } else {
    errorCallBack(I18n.t('serverError'));
    return;
  }
  successCallBack(responseData.data);
}

module.exports = {
  GET(urlCallBack, successCallBack, errorCallBack, tag = '') {
    if (!errorCallBack) return;
    const url = urlCallBack(apiAddress, sessionId);
    Promise.race([timeout(), fetch(url, null, tag)])
      .then(parseJSON)
      .then(responseData => processAPICallBack(responseData, successCallBack, errorCallBack))
      .catch((error) => {
        if (error.message == 'Network request failed') {
          errorCallBack(I18n.t('netError'));
          return;
        }
        if (error.message == 'timeOut') {
          errorCallBack(I18n.t('netError'));
          return;
        }
        errorCallBack(String(error.message));
      })
      .done();
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
    Promise.race([timeout(), fetch(url, options, null, tag)])
      .then(parseJSON)
      .then(responseData => processAPICallBack(responseData, successCallBack, errorCallBack))
      .catch((error) => {
        if (error.message == 'Network request failed') {
          errorCallBack(I18n.t('netError'));
          return;
        }
        if (error.message == 'timeOut') {
          errorCallBack('');
          return;
        }
        errorCallBack(String(error.message));
      })
      .done();
  },

  ABORT(tag) {
    fetch.abort(tag);
  },
};