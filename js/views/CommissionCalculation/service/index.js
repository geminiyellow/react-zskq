/**
 * 处理相同的spm的接口信息
 */
import { getMonthInfo, getOrganizationInfo, getCommission, commissionTrial } from '@/common/api';
import { GET, POST, ABORT } from '@/common/Request';

module.exports = {
  // 获取下拉部门的信息
  getOrganizationInfo(period) {
    return new Promise((resolve, reject) => {
      GET(
        getOrganizationInfo(),
        responseData => resolve(responseData),
        message => reject(message),
        'getOrganizationInfo'
      );
    });
  },

  // 直销代表月度规则（佣金）和仪表图
  getCommission(period, organizationId) {
    return new Promise((resolve, reject) => {
      GET(
        getCommission(period, organizationId),
        responseData => resolve(responseData),
        message => reject(message),
        'getCommission'
      );
    });
  },

  // 获取佣金的信息
  commissionTrial(params, list) {
    return new Promise((resolve, reject) => {
      POST(
        commissionTrial(params), list,
        responseData => resolve(responseData),
        message => reject(message),
        'commissionTrial'
      );
    });
  },

  // 取消提交的信息
  abort() {
    ABORT('getOrganizationInfo');
    ABORT('getCommission');
    ABORT('commissionTrial');
  },

};