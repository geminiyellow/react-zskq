import ScanQrCheckIn from '@/views/MobileCheckIn/ScanQrCheckIn';
import MobileCheckIn from '@/views/MobileCheckIn';

// 返回有效的移动打卡方式
export function validCheckInPage() {
  const punchTypeList = global.companyResponseData ? global.companyResponseData.attendance : null;
  if (punchTypeList && punchTypeList.length == 1 && punchTypeList[0] == 'APP_QR') {
    return ScanQrCheckIn;
  } else {
    return MobileCheckIn;
  }
}