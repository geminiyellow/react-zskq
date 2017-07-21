import queryString from 'query-string';

module.exports = {
  // ==================================请假模块==================================
  // 获取额度
  getCreadits(companyCode) {
    return (apiAddress, sessionId) => `${apiAddress}Leave${companyCode}/GetEmployeeLeaveBalance?sessionId=${sessionId}`;
  },

  // 获取额度新
  getCreaditsNew() {
    return (apiAddress, sessionId) => `${apiAddress}Leave/GetEmployeeLeaveBalanceNew?sessionId=${sessionId}`;
  },

  // 获取请假类别
  getLeaveApplyType(companyCode) {
    return (apiAddress, sessionId) => `${apiAddress}Leave${companyCode}/GetEmployeeCanApplyLeaveTypeList?sessionId=${sessionId}`;
  },

  // 获取员工请假时长
  getLeaveApplyLast(companyCode, params) {
    return (apiAddress, sessionId) => `${apiAddress}Leave${companyCode}/GetEmployeeLeaveTime?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },

  getLeaveApplyLastDD(companyCode, params) {
    return (apiAddress, sessionId) => `${apiAddress}Leave${companyCode}/GetEmployeeLeaveTimeNew?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },

  // 获取员工请假时长
  getEmployeeLeaveReasonList(companyCode) {
    return (apiAddress) => `${apiAddress}Leave${companyCode}/GetEmployeeLeaveReasonList`;
  },

  // 提交请假表单信息
  SubmitEmployeeLeaveFormRequest(companyCode) {
    return (apiAddress) => `${apiAddress}Leave${companyCode}/SubmitEmployeeLeaveFormRequest`;
  },

  SubmitEmployeeLeaveFormRequestDD(companyCode) {
    return (apiAddress) => `${apiAddress}Leave${companyCode}/SubmitEmployeeLeaveFormRequestNew`;
  },

  // 乐宁教育提交接口
  SubmitEmployeeLeaveFormRequestByLearning(companyCode) {
    return (apiAddress) => `${apiAddress}Leave${companyCode}/SubmitEmployeeLeaveFormRequest_Customer`;
  },
};