import queryString from 'query-string';

module.exports = {
  // 获取员工出勤统计
  getAttendanceStatistics(companyCode, params) {
    return (apiAddress, sessionId) => `${apiAddress}Exception${companyCode}/GetAttendanceStatistics?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },

  // 获取员工考勤异常数据接口
  getEmployeeExceptionList(companyCode, params) {
    return (apiAddress, sessionId) => `${apiAddress}Exception${companyCode}/GetEmployeeExceptionList?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },

  // 提交员工异常申诉信息接口
  submitEmployeeExceptionFormRequst(companyCode) {
    return (apiAddress) => `${apiAddress}Exception${companyCode}/SubmitEmployeeExceptionFormRequst`;
  },

  // 获取异常申诉原因
  getEmployeeExceptionReasonList() {
    return (apiAddress) => `${apiAddress}Exception/GetEmployeeExceptionReasonList`;
  },

  // 获取出勤统计
  getEmployeeAttendanceDetail(companyCode, params) {
    return (apiAddress, sessionId) => `${apiAddress}Exception${companyCode}/GetEmployeeAttendanceDetail?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },

  // 获取打卡统计
  getEmployeePunchTimeInfo(companyCode, params) {
    return (apiAddress, sessionId) => `${apiAddress}Exception${companyCode}/GetEmployeePunchTimeInfo?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },
};