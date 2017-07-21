import { GET, ABORT, POST } from '@/common/Request';
import { getShiftAndShiftTime } from '@/common/api';
import Functions from '@/common/Functions';

// 当前日期
const selectedDateTemp = Functions.getNowFormatDate();

// 获取当天排班信息
export function fetchShiftTime() {
  const params = { TimeInfo: selectedDateTemp };
  return new Promise((resolve, reject) => {
    GET(getShiftAndShiftTime(params), (responseData) => {
      if (responseData && responseData.length > 0 && responseData[0].UserWorkingTime) {
        const workTime = responseData[0].UserWorkingTime;
        const array = workTime.split('-');
        if (array && array.length > 0) {
          const startTime = array[0];
          const startDateTime = `${selectedDateTemp} ${startTime}`;

          const data = {
            startDateTime,
            startTime,
          };
          resolve(data);
        }
      }
      reject();
    }, (errorMsg) => {
      reject(errorMsg);
    }, 'getShiftAndShiftTime');
  });
}

export function abort() {
  ABORT('getShiftAndShiftTime');
}