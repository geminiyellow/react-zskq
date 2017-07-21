import queryString from 'query-string';

module.exports = {
  /**
   * 获取定位部门列表和蓝牙云盒列表
   */
  getUserAuthorizedBranchInfo(params) {
    return (apiAddress, sessionId) => `${apiAddress}Attendance/GetUserAuthorizedBranchInfo?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },
  /**
   * 提交考勤规则接口
   */
  submitPostionLimitedSet() {
    return (apiAddress) => `${apiAddress}Attendance/SubmitPostionLimitedSet`;
  },
  /**
   * 保存部门或蓝牙的定位信息
   */
  submitPositionInfo(params) {
    return (apiAddress) => `${apiAddress}Attendance/SubmitPositionInfo`;
  },
};