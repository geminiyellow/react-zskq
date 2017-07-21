import queryString from 'query-string';

module.exports = {
  // 获取我的可换班列表
  getMyAvailableShift(params) {
    return (apiAddress, sessionId) => `${apiAddress}Shifts/GetCanChangeShift?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },
  GetShiftFromDemandPool(params) {
    return (apiAddress, sessionId) => `${apiAddress}Shifts/GetShiftFromDemandPool?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },
  // 将我选择的班次放入换班 需求池
  SubmitShiftDemand() {
    return (apiAddress) => `${apiAddress}Shifts/SubmitShiftDemand`;
  },
  SubmitShiftFormRequest() {
    return (apiAddress) => `${apiAddress}Shifts/SubmitShiftFormRequest`;
  },
  GetValidChangeShift(params) {
    return (apiAddress, sessionId) => `${apiAddress}Shifts/GetValidChangeShift?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },
};