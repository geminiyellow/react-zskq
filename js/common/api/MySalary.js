import queryString from 'query-string';

module.exports = {
  // 修改密码
  setUserGesturePassword() {
    return (apiAddress) => `${apiAddress}Login/ChangeUserGesturePwd`;
  },

  // 获取手势密码
  getGesturePwd() {
    return (apiAddress, sessionId) => `${apiAddress}Login/GetGesturePwd?SessionID=${sessionId}`;
  },

  // 获取薪资包
  getEmployeePayrollInfo(params) {
    return (apiAddress, sessionId) => `${apiAddress}PayRoll/GetEmployeePayrollInfo?SessionID=${sessionId}&${queryString.stringify(params)}`;
  },

  // 获取薪资包（新）
  getEmployeePayrollInfoNew(params) {
    return (apiAddress, sessionId) => `${apiAddress}PayRoll/GetEmployeePayrollInfoNew?SessionID=${sessionId}&${queryString.stringify(params)}`;
  },

};