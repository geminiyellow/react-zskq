import queryString from 'query-string';

module.exports = {
  // 提交蓝牙打卡数据
  submitEmployeeAttendanceDataByBHT() {
    return (apiAddress) => `${apiAddress}Attendance/SubmitEmployeeAttendanceDataByBHT`;
  },

  // 提交二维码打卡数据 POST
  submitEmployeeAttendanceDataByQR(companyCode) {
    return (apiAddress, sessionId) => `${apiAddress}Attendance${companyCode}/SubmitEmployeeAttendanceDataByQR?sessionId=${sessionId}`;
  },

  // 提交定位考勤
  submitLocationPunch() {
    return (apiAddress) => `${apiAddress}Attendance/SubmitEmployeeAttendanceDataByMAP`;
  },

  // 获取员工排班信息
  getEmployeeScheduleInfo(params) {
    return (apiAddress, sessionId) => `${apiAddress}Schedule/GetEmployeeScheduleInfo?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },

  // 判断蓝牙、定位打卡是否有限制
  CheckPostionIsLimited(params) {
    return (apiAddress, sessionId) => `${apiAddress}Attendance/CheckPostionIsLimited?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },

  // 获取系统参数UUID
  getSysParamUUID() {
    return (apiAddress, sessionId) => `${apiAddress}Attendance/GetSysParamUUID?sessionId=${sessionId}`;
  },

  // 获取班别和工作时间
  getShiftAndShiftTime(params) {
    return (apiAddress, sessionId) => `${apiAddress}Attendance/GetShifyData?sessionID=${sessionId}&${queryString.stringify(params)}`;
  },

  // 获取员工上下班打卡信息
  getUserClockInAndOutInformation(params) {
    return (apiAddress, sessionId) => `${apiAddress}Attendance/GetAttendanceInfo?sessionID=${sessionId}&${queryString.stringify(params)}`;
  },

  // 判断员工是否在打卡限制位置内
  getUserDeterminefAddressIsInRestriction(params) {
    return (apiAddress, sessionId) => `${apiAddress}Attendance/DetermineAddressIsInRestriction?sessionID=${sessionId}&${queryString.stringify(params)}`;
  },

  // 获取服务器时间
  getServerTime() {
    return (apiAddress) => `${apiAddress}Other/GetServiceTime`;
  },
};
