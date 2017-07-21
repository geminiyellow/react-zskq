/**
 * 获取月度和部门的信息
 */

import queryString from 'query-string';
import { appVersion, baseUrlSPM } from '@/common/Consts';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
const customizedCompanyHelper = new CustomizedCompanyHelper();

module.exports = {

  // 获取下拉信息
  getSelectInfo() {
    return (apiAddress, sessionId) => `${baseUrlSPM}Commission/selectInfo/${sessionId}/${appVersion}/${customizedCompanyHelper.getCompanyCode()}/`;
  },

  // 获取下拉月度的信息
  getMonthInfo() {
    return (apiAddress, sessionId) => `${baseUrlSPM}personalindicators/monthInfo/${sessionId}/${appVersion}/${customizedCompanyHelper.getCompanyCode()}/`;
  },

  // 获取下拉部门的信息
  getOrganizationInfo(period) {
    return (apiAddress, sessionId) => `${baseUrlSPM}personalindicators/organizationInfo/${sessionId}/${customizedCompanyHelper.getCompanyCode()}/${appVersion}/${period}/`;
  },

  // 直销代表月度规则（佣金）和仪表图
  getCommission(period, organizationId) {
    return (apiAddress, sessionId) => `${baseUrlSPM}personalindicators/commission/${sessionId}/${customizedCompanyHelper.getCompanyCode()}/${appVersion}/${period}/${organizationId}/`;
  },

  //获取计算佣金的结果
  commissionTrial(params) {
    return () => `${baseUrlSPM}individualPerformance/commissionTrial?${queryString.stringify(params)}`;
  },

};