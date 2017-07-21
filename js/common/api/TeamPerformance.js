import queryString from 'query-string';

import { appVersion, baseUrlSPM } from '@/common/Consts';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
const customizedCompanyHelper = new CustomizedCompanyHelper();

module.exports = {
  // 获取组织和指标名称
  getTeamAndPointerType(type) {
    return (apiAddress, sessionId) => `${baseUrlSPM}teamAchievements/teamAndPointerType/${sessionId}/${customizedCompanyHelper.getCompanyCode()}/${appVersion}/${type}/`;
  },

  // 获取 人员指标 信息
  getPersonalTarget(orgId, periodType) {
    return (apiAddress, sessionId) => `${baseUrlSPM}teamAchievements/personalTarget/${sessionId}/${customizedCompanyHelper.getCompanyCode()}/${appVersion}/${orgId}/${periodType}/`;
  },

  // 获取组织指标信息
  getOrganizationGoal(orgId, periodTypeId, indicatorId) {
    return (apiAddress, sessionId) => `${baseUrlSPM}teamAchievements/organizationGoal/${sessionId}/${customizedCompanyHelper.getCompanyCode()}/${appVersion}/${orgId}/${periodTypeId}/${indicatorId}/`
  },
  // 获取组织列表内容
  getOrganizationListInfo() {
    return (apiAddress, sessionId) => `${baseUrlSPM}organizationDetail/organizationListInfo/${sessionId}/${appVersion}/${customizedCompanyHelper.getCompanyCode()}/`
  },
  // 获取考核期
  getAssessmentPeriodListInfo() {
    return (apiAddress, sessionId) => `${baseUrlSPM}organizationDetail/assessmentPeriodListInfo/${sessionId}/${appVersion}/${customizedCompanyHelper.getCompanyCode()}/`
  },
  // 获取组织指标详情表头
  getOrganizationTableHeaderInfo() {
    return (apiAddress, sessionId) => `${baseUrlSPM}organizationDetail/organizationTableHeaderInfo/${sessionId}/${appVersion}/${customizedCompanyHelper.getCompanyCode()}/`
  },
  // 获取组织指标详情表头
  getOrganizationTableData(orgId, period) {
    return (apiAddress, sessionId) => `${baseUrlSPM}organizationDetail/organizationTableData/${sessionId}/${customizedCompanyHelper.getCompanyCode()}/${appVersion}/${period}/${orgId}/`
  },
};