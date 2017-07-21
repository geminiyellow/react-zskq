import { getEmployeePunchTimeInfo } from '@/common/api';
import { GET, ABORT } from '@/common/Request';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';

const customizedCompanyHelper = new CustomizedCompanyHelper();

module.exports = {
  // 获取打卡统计数据
  fetchPunchTimeInfo(params) {
    return new Promise((resolve, reject) => {
      GET(
        getEmployeePunchTimeInfo(customizedCompanyHelper.getPrefix(), params),
        responseData => resolve(responseData),
        errorMsg => reject(errorMsg),
        'getEmployeePunchTimeInfo',
      );
    })
  },

  abortPunchTimeInfo() {
    ABORT('getEmployeePunchTimeInfo');
  }
};