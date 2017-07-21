import queryString from 'query-string';

module.exports = {
  // 根据令牌获取要修改的设备组
  getNeedChangeMachine(params) {
    return (apiAddress, sessionId) => `${apiAddress}Attendance/GetNeedChangeMachine?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },

  // 更改考勤设备位置信息
  changeMachineInfo(params) {
    return (apiAddress) => `${apiAddress}Attendance/ChangeMachineInfo`;
  },
};