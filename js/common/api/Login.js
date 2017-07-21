import queryString from 'query-string';
import { baseUrl, baseUrlMobile } from '../Consts';

module.exports = {
  // 设置企业代码
  setCompanyCode(appCode, language) {
    return () => `${baseUrl}/AppCode/GetAppInfo?appCode=${appCode}&lan=${language}`;
  },

  // 设置企业代码（移动云）
  setCompanyCodeMobile(appCode, language) {
    return () => `${baseUrlMobile}showNewConfig?code=${appCode}&language=${language}`;
  },

  // 登录
  getLoginURL() {
    return (apiAddress) => `${apiAddress}Login/ValidateUser`;
  },

  // 提交手机变更申请
  submitSIMChange() {
    return (apiAddress) => `${apiAddress}Login/SubmitEmployeePhoneChangedReuqest`;
  },

  // 验证员工手机信息是否匹配
  checkMobileInfoIsMatched(params) {
    return (apiAddress, sessionId) => `${apiAddress}Login/CheckMobileInfoIsMatched?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },

  // 修改密码
  setUserPassword() {
    return (apiAddress) => `${apiAddress}Login/SetUserPassword`;
  },

  // 移动云收集用户信息
  saveAppUserInfo() {
    return () => `${baseUrlMobile}appUserInfo/saveAppUserInfo`;
  },

  // 获取爱关怀接口地址 (GET)
  getLoveCareAddress(params) {
    return (apiAddress, sessionId) => `${apiAddress}Login/GetAghUrl?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },
};