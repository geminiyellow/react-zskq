import { getEmployeeAttendanceDetail } from '@/common/api';
import { GET, ABORT } from '@/common/Request';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';

const customizedCompanyHelper = new CustomizedCompanyHelper();

module.exports = {
  // 获取出勤统计数据
  fetchAttendanceDetail(params) {
    return new Promise((resolve, reject) => {
      GET(
        getEmployeeAttendanceDetail(customizedCompanyHelper.getPrefix(), params),
        responseData => resolve(responseData),
        errorMsg => reject(errorMsg),
        'getEmployeeAttendanceDetail',
      );
    })
  },

  abortAttendanceRequest() {
    ABORT('getEmployeeAttendanceDetail');
  }
};