/**
 * 日志的帮助类
 */
import moment from 'moment';
import realm from '@/realm';
import { messageType, logConsts } from '@/common/Consts';
import { POST, ABORT } from '@/common/LogRequest';
import { sendEvent } from '@/common/api';
import { device } from '@/common/Util';
import { appVersion } from '@/common/Consts';

module.exports = {
  log(content, userInfo) {
    // 获取公共的信息
    let commonData = '';
    // 获取用户名
    let userName = '';
    const user = realm.objects('User');
    if (userInfo) {
      userName = userInfo;
    } else if (user.length != 0) {
      for (let i = 0; i < user.length; i++) {
        if (user[i].password.length != 0) {
          userName = user[i].name;
        }
      }
    }

    // 获取公司代码
    let companyCode = '';
    const company = realm.objects('Company');
    if (company.length != 0) {
      companyCode = company[0].code;
    }
    //提供的公共信息
    commonData = moment().format('YYYY-MM-DD HH:mm') + ',' + `${companyCode}`.toLowerCase() + ',' + userName + ',' + content + ',' + appVersion;
    // 提交log日志的信息
    const { projectId, apiKey } = logConsts;
    const params = {};
    params.userAgent = '';
    params.version = 1;
    params.projectId = projectId;
    // 获取发送的数据
    const data = {};
    params.data = {
      "type": "log",
      "session": userName,
      "@simple_error": {
        "type": "System.Log",
        "session": userName,
        "message": commonData,
      }
    };
    // console.log('commonData --- ', commonData);
    // 发送信息
    POST(sendEvent(projectId, apiKey), params, (responseData) => { }, (message) => { }, 'sendEvent');
  },
};