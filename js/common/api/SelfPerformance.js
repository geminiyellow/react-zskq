
import { appVersion, baseUrlSPM } from '@/common/Consts';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
const customizedCompanyHelper = new CustomizedCompanyHelper();

module.exports = {
  
  // 获取考核期
  GetPeriodType() {
    return (apiAddress, sessionId) => `${baseUrlSPM}commission/periodType/${sessionId}/${appVersion}/${customizedCompanyHelper.getCompanyCode()}/`;
  },
  // 获取佣金指标类型
  getSelfPerformanceType(periodType) {
    return (apiAddress, sessionId) => `${baseUrlSPM}commission/type/${sessionId}/${customizedCompanyHelper.getCompanyCode()}/${appVersion}/${periodType}/`;
  },
  // 获取图表数据
  getSelfPerformanceChartData(periodType, quotaType) {
    return (apiAddress, sessionId) => `${baseUrlSPM}commission/achievements/${sessionId}/${customizedCompanyHelper.getCompanyCode()}/${appVersion}/${periodType}/${quotaType}/`;
  },
  // 获取个人绩效筛选条件
  getSelfPerformanceFilter() {
    return (apiAddress, sessionId) => `${baseUrlSPM}commission/selfPerformanceFilter/${sessionId}/${appVersion}/${customizedCompanyHelper.getCompanyCode()}/`;
  }
}