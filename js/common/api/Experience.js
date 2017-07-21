import queryString from 'query-string';
import { baseUrlMobile } from '@/common/Consts';

module.exports = {
  // 获取短信验证码
  getSMSCode(params) {
    return () => `${baseUrlMobile}sendSMS?${queryString.stringify(params)}`;
  },
  // 验证短信验证码
  validateSMSCode(params) {
    return () => `${baseUrlMobile}validateSMSCode?${queryString.stringify(params)}`;
  },
  // 提交体验用户信息
  submitExperienceUserInfo(params) {
    return () => `${baseUrlMobile}GetAccountForMobile?${queryString.stringify(params)}`;
  },
};