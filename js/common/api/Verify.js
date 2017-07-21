import queryString from 'query-string';

module.exports = {
  // 获取我的表单列表
  getDirectorFormsNew(prefix, params) {
    return (apiAddress, sessionId) => `${apiAddress}Approve${prefix}/GetDirectorToBeSingnedFormsHeadInfo?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },
  /**
   * 主管签核接口
   */
  SignOffEmployeeFormRequest(prefix) {
    return (apiAddress) => `${apiAddress}Approve${prefix}/SignOffEmployeeFormRequest`;
  },
  // 获取主管审核历史列表
  getDirectorSignedHistoryForms(params) {
    return (apiAddress, sessionId) => `${apiAddress}Approve/GetDirectorSignedHistoryFormsHeadInfo?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },
};