module.exports = {
  // 获取定位部门列表
  getStoreInfo(companyCode) {
    return (apiAddress, sessionId) => `${apiAddress}Attendance${companyCode}/GetUserAuthorizedBranchInfo?sessionId=${sessionId}`;
  },
  // 获取店铺修改原因
  getStoreModifyReason(companyCode) {
    return (apiAddress) => `${apiAddress}Attendance${companyCode}/GetBranchAddressChangedReasonList`;
  },
  // 提交店铺定位信息
  saveStoreInfo(companyCode) {
    return (apiAddress) => `${apiAddress}Attendance${companyCode}/SubmitPositionInfo`;
  },
};