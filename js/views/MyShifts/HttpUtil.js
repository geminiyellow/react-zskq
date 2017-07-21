import { GET, POST } from '@/common/Request';
import { DeviceEventEmitter, InteractionManager } from 'react-native';
import { messageType, companysCode } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import { GetEmployeeScheduleForFour, GetAttendanceAndSchedule } from '@/common/api';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
const customizedCompanyHelper = new CustomizedCompanyHelper();
import { appVersion } from '@/common/Consts';

module.exports = {
  GetEmployeeSchedule(startDate, endDate) {
    console.log('执行请求=========');
    const params = {};
    params.companyCode = customizedCompanyHelper.getCompanyCode();
    params.appVersion = appVersion;
    params.beginDate = startDate;
    params.endDate = endDate;

    // 请求数据
    GET(GetEmployeeScheduleForFour(params), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        DeviceEventEmitter.emit('SCHEDULE_INFOS', responseData);
      });
    }, (message) => {
      showMessage(messageType.error, JSON.stringify(message));
    }, 'GetEmployeeScheduleForFour');
  },

  GetAttendanceAndSchedule(date) {
    const params = {};
    params.companyCode = customizedCompanyHelper.getCompanyCode();
    params.appVersion = appVersion;
    params.date = date;
    // 请求数据
    GET(GetAttendanceAndSchedule(params), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        DeviceEventEmitter.emit('SCHEDULE', responseData);
      });
    }, (message) => {
      showMessage(messageType.error, JSON.stringify(message));
    }, 'GetAttendanceAndSchedule');
  },
}