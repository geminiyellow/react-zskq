import { log } from '@/common/LogHelper';
import { device } from '@/common/Util';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
import DateHelper from '@/common/DateHelper';
const customizedCompanyHelper = new CustomizedCompanyHelper();

module.exports = {
  // 记录请求失败信息
  // 日志内容包括：接口名称，接口参数，ios系统版本，手机型号
  logRequestErrorInfo(apiName) {
    const content = `${apiName},${device.mobileName},${device.deviceName},${device.mobileOS}`;
    log(content);
  },
  /**
   * mofify by arespan
   * 记录退出日志
   * 2017-06-23 10:51
   */
  appExitLog() {
    const content = `${global.loginResponseData.LoginName},${customizedCompanyHelper.getCompanyCode()},${DateHelper.getNowFormatDate()},${device.mobileName},${device.deviceName},${device.mobileOS},`;
    log(content);
  },
};