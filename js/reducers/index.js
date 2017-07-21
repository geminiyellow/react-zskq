import { combineReducers } from 'redux';
import companyCodeReducer from '@/views/CompanyCode/reducers';
import setUpReducer from '@/views/SetUp/reducers';
import mobileCheckInReducer from '@/views/MobileCheckIn/reducers';
import notificationReducer from '@/views/Notification/reducers';
import loveCareReducer from '@/views/LoveCare/reducer';

export default combineReducers({
  // 企业代码页
  companyCodeReducer,
  // 考勤规则(v3.0.2)
  setUpReducer,
  // 蓝牙、地图考勤
  mobileCheckInReducer,
  // 系统的通知(v3.1.2)
  notificationReducer,
  // 爱关怀
  loveCareReducer,
});