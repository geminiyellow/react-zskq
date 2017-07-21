import queryString from 'query-string';
import { baseUrlMobile } from '../Consts';

module.exports = {
  /** 获取首页图表数据 */
  getEmployeeAttendanceData(params) {
    return (apiAddress, sessionId) => `${apiAddress}Attendance/GetEmployeeAttendanceData?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },

  // 获取系统通知数量
  getSystemNotificationQty() {
    return (apiAddress, sessionId) => `${apiAddress}Other/GetSystemNotificationQty?sessionId=${sessionId}`;
  },

  getFunctionList() {
    return (apiAddress, sessionId) => `${apiAddress}Login/GetFunctionList?SessionID=${sessionId}`;
  },

  getNewFunctionList() {
    return (apiAddress, sessionId) => `${apiAddress}Login/GetNewFunctionList?SessionID=${sessionId}`;
  },
  /**
   * 读取移动云的九宫格接口
   */
  getModulesFromMobileSaas(params) {
    return (sessionId) => `${baseUrlMobile}modules?${queryString.stringify(params)}`;
  },
  getConfiguration(params) {
    return (sessionId) => `${baseUrlMobile}company/showConfiguretion?${queryString.stringify(params)}`;
  },

  //发送log日志
  sendEvent(projectId, apiKey) {
    return () => `https://log.gaiaworkforce.com:50000/api/v1/projects/${projectId}/events?api_key=${apiKey}`;
  },

  // 获取系统表单相关配置信息（GET）
  getSysParaInfo(params) {
    return (apiAddress, sessionId) => `${apiAddress}Other/GetSysParaInfo?${queryString.stringify(params)}`;
  },
};