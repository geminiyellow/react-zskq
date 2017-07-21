import queryString from 'query-string';

module.exports = {
  // 获取出差申请初始化信息
  getEmployeeBusinessTravelInitializedInfo(params) {
    return (apiAddress, sessionId) => `${apiAddress}Travel/GetEmployeeBusinessTravelInitializedInfo?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },
  // 获取员工出差
  getEmployeeValidTravelHours(params) {
    return (apiAddress, sessionId) => `${apiAddress}Travel/GetEmployeeValidTravelHours?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },
  // 提交员工出差单申请
  submitEmployeeBusinessTravelFormRequest() {
    return (apiAddress) => `${apiAddress}Travel/SubmitEmployeeBusinessTravelFormRequest`;
  },
};