import companyCodeActions from '@/views/CompanyCode/actions';
import setUpActions from '@/views/SetUp/actions';
import notificationActions from '@/views/Notification/actions';
import LoveCare from '@/views/LoveCare/action';

export default {
  // 企业代码页
  ...companyCodeActions,
  // 考勤规则(v3.0.2)
  ...setUpActions,
  // 通知页面(v3.1.2)
  ...notificationActions,
  // 爱关怀
  ...LoveCare,
};