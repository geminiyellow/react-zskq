import queryString from 'query-string';

module.exports = {
  GetEmployeeScheduleForFour(params) {
    return (apiAddress, sessionId) => `${apiAddress}Schedule/GetEmployeeScheduleForFour?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },
  GetAttendanceAndSchedule(params) {
    return (apiAddress, sessionId) => `${apiAddress}Schedule/GetAttendanceAndSchedule?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },
};