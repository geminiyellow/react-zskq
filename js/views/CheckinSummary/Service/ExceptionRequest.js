import { getAttendanceStatistics, getEmployeeExceptionList } from '@/common/api';
import { GET, ABORT } from '@/common/Request';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
// 公司代码数据
const customizedCompanyHelper = new CustomizedCompanyHelper();

module.exports = {
  // 获取异常考勤统计数据
  fetchExceptionStatistics(period) {
    const params = {};
    params.period = period;
    return new Promise((resolve, reject) => {
      GET(
        getAttendanceStatistics(customizedCompanyHelper.getPrefix(), params),
        responseData => resolve(responseData),
        message => reject(message),
        'getAttendanceStatistics'
      );
    })
  },

  // 获取详细异常数据
  fetchExceptionDetailInfo(period) {
    const params = {};
    params.period = period;

    return new Promise((resolve, reject) => {
      GET(
        getEmployeeExceptionList(customizedCompanyHelper.getPrefix(), params),
        responseData => resolve(responseData),
        message => reject(message),
        'getEmployeeExceptionList'
      );
    });
  },

  // ABORT
  abort() {
    ABORT('getEmployeeExceptionList');
    ABORT('getAttendanceStatistics');
  },
};