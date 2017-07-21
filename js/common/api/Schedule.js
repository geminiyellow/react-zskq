import queryString from 'query-string';

module.exports = {
  // 获取员工排班信息
  getEmployeeScheduleInfo(params) {
    return (apiAddress, sessionId) => `${apiAddress}Schedule/GetEmployeeScheduleInfo?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },
  // 排班审批 begin
  // 获取店铺列表
  getShoplists() {
    return (apiAddress, sessionId) => `${apiAddress}Schedule_Estee/GetAllPreSchedulesToDoList?sessionId=${sessionId}`;
  },
  // 获取店铺详情
  getShopDetail(params) {
    return (apiAddress, sessionId) => `${apiAddress}Schedule_Estee/GetEmployeesPreScheduleDetailList?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },

  // 审批排班接口
  verifyShedule() {
    return (apiAddress) => `${apiAddress}Schedule_Estee/SignEmployeesPreScheduleRequest`;
  },
  // 排班审批 end

  // 排班查询 begin
  // 获取店铺列表
  getPreviewShoplists() {
    return (apiAddress, sessionId) => `${apiAddress}Schedule_Estee/GetAllUnitsInfoList?sessionId=${sessionId}`;
  },
  // 获取店铺排班详情
  getPreviewShopDetail(params) {
    return (apiAddress, sessionId) => `${apiAddress}Schedule_Estee/GetEmployeesScheduleDetailList?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },

  // 排班查询 begin
  // 获取店铺列表
  getStandardPreviewShoplists() {
    return (apiAddress, sessionId) => `${apiAddress}Schedule/GetEmployeeBranchInfo?sessionId=${sessionId}`;
  },
  // 获取多人排班详情
  getStandardPreviewShopDetail(params) {
    return (apiAddress, sessionId) => `${apiAddress}Schedule/GetEmployeeStandardScheduleInfo?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },
  // 获取周选择器数据
  getWeekSelect() {
    return (apiAddress, sessionId) => `${apiAddress}Schedule/WeekSelect?sessionId=${sessionId}`;
  }
};