import CheckinSummary from './CheckinSummary';
import Home from './Home';
import LanguageSetting from './LanguageSetting';
import LeaveApply from './LeaveApply';
import Login from './Login';
import Notification from './Notification';
import OverTime from './OverTime';
import MobileCheckIn from './MobileCheckIn';
import MyForm from './MyForm';
import Schedule from './Schedule';
import Verify from './Verify';
import Mine from './Mine';
import ChangeShift from './ChangeShift';
import OnBusiness from './OnBusiness';
import MySalary from './MySalary';
import SetUp from './SetUp';
import CheckinRules from './CheckinRules';
import Experience from './Experience';
import MyStore from './MyStore';
import RevokeLeave from './RevokeLeave';
import SelfPerformance from './SelfPerformance';
import CommissionCalculation from './CommissionCalculation';
import TeamPerformance from './TeamPerformance';
import MyShift from './MyShift';

module.exports = {
  ...CheckinSummary,
  ...Home,
  ...LanguageSetting,
  ...LeaveApply,
  ...Login,
  ...MobileCheckIn,
  ...Notification,
  ...OverTime,
  ...MyForm,
  ...Schedule,
  ...Verify,
  ...Mine,
  ...ChangeShift,
  ...OnBusiness,
  ...MySalary,
  // 考勤规则(v3.0.2)
  ...SetUp,
  // 考勤规则(v3.0.1)
  ...CheckinRules,
  ...Experience,
  ...MyStore,
  ...RevokeLeave,
  ...SelfPerformance,
  // 添加SPM的接口
  ...CommissionCalculation,
  ...TeamPerformance,
  ...MyShift,
};