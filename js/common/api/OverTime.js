import queryString from 'query-string';

module.exports = {
  // 获取加班预设信息接口
  getOvertimePresetInfo(companyCode, params) {
    return (apiAddress, sessionId) => `${apiAddress}OverTime${companyCode}/GetOverTimePreSetInfo?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },

  // 获取加班规则
  getOverTimeRule(params) {
    return (apiAddress, sessionId) => `${apiAddress}OverTime/GetEmployeeOverTimeRule?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },

  // 获取员工加班时数
  getEmployeeActualOTHours(params) {
    return (apiAddress, sessionId) => `${apiAddress}OverTime/GetEmployeeActualOTHours?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },

  // 提交加班表单信息
  submitEmployeeOverTimeFormRequest(companyCode) {
    return (apiAddress) => `${apiAddress}OverTime${companyCode}/SubmitEmployeeOverTimeFormRequest`;
  },
};