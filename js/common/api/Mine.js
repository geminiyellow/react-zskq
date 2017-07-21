import queryString from 'query-string';
import { baseUrlMobile } from '../Consts';

module.exports = {
  // 保存用户头像
  UplaodEmployeeHeadImage() {
    return (apiAddress) => `${apiAddress}Other/UploadEmployeeHeadImage`;
  },
  // 获取用户信息
  getUserInfo() {
    return (apiAddress, sessionId) => `${apiAddress}Login/GetUserBaseInfo?sessionId=${sessionId}`;
  },

  // 新的获取用户信息
  getUserInfoNew(params) {
    return (apiAddress, sessionId) => `${apiAddress}Login/GetUserBaseInfoNew?${queryString.stringify(params)}`;
  },

  // 提交意见反馈
  submitAppFeedback() {
    return () => 'https://mobilesaas.hrone.cn/rest/api/2/issue';
  },

  // 扫码登录 HR ONE  GET
  requestCheckQRLogin(params) {
    return (apiAddress, sessionId) => `${apiAddress}Other/CheckQRLogin?SessionId=${sessionId}&${queryString.stringify(params)}`;
  },

  // 新的修改密码接口  POST
  getNewSetUserPassword(params) {
    return (apiAddress) => `${apiAddress}Login/NewSetUserPassword?${queryString.stringify(params)}`;
  },
  getCustomer(params) {
    return (sessionId) => `${baseUrlMobile}showConfiguration?${queryString.stringify(params)}`;
  },
};