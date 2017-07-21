import queryString from 'query-string';
import { companysCode } from '@/common/Consts';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';

const customizedCompanyHelper = new CustomizedCompanyHelper();

module.exports = {
  // 获取我的表单列表
  getMyForms(prefix, params) {
    return (apiAddress, sessionId) => `${apiAddress}History${prefix}/GetMyFormsHeadInfo?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },

  // 获取我的表单列表
  getDirectorForms(params) {
    return (apiAddress, sessionId) => `${apiAddress}Approve/GetDirectorToBeSingnedForms?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },
  // 撤销表单
  cancelMyFormRequest(prefix) {
    return (apiAddress) => `${apiAddress}History${prefix}/CancelMyFormRequest`;
  },
  // 手机 部门信息变更审核接口
  signComToDoList() {
    return (apiAddress) => `${apiAddress}Approve/SignComToDoList`;
  },
  // 设置我的表单已经读过
  SetTheFormHasRead() {
    return (apiAddress) => `${apiAddress}History/SetTheFormHasRead`;
  },
  // 获取表单详情
  getFormsDetailInfo(prefix) {
    return (apiAddress) => `${apiAddress}History${prefix}/GetMyFormDetailInfo`;
  },
  // 乐宁教育表单详情接口
  getFormsDetailInfoByLearning(prefix) {
    return (apiAddress) => `${apiAddress}History${prefix}/GetMyFormDetailInfo_Customer`;
  },
  // 获取表单类型
  getFormTypes() {
    // 三星定制 。请假类型的表单在类型后面+V1
    if (customizedCompanyHelper.getCompanyCode() == companysCode.Samsung) {
      return (apiAddress, sessionId) => `${apiAddress}History_Custom/GetUserAuthorizedForms?sessionId=${sessionId}`;
    }
    return (apiAddress, sessionId) => `${apiAddress}History/GetUserAuthorizedForms?sessionId=${sessionId}`;
  },
};