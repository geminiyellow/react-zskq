import queryString from 'query-string';

module.exports = {

  // 获取已请假的假期类别 (按天拆分)（GET）
  getEmployeeLeaveInfoByDay() {
    return (apiAddress, sessionId) => `${apiAddress}LeaveDecline/GetEmployeeLeaveInfoByDay?sessionId=${sessionId}`;
  },

  // 提交销假申请 （POST）
  submitLeaveDeclineForm() {
    return (apiAddress) => `${apiAddress}LeaveDecline/SubmintLeaveDeclineForm`;
  },

  // 获取销假时数（GET）
  getEmployeeLeaveDeclineHours(params) {
    return (apiAddress, sessionId) => `${apiAddress}LeaveDecline/GetEmployeeLeaveDeclineHours?sessionId=${sessionId}&${queryString.stringify(params)}`
  }

};