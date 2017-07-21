import queryString from 'query-string';

module.exports = {
  // ==================================通知接口==================================

  /** 获取通知信息 */
  getNotificationMessage() {
    return (apiAddress, sessionId) => `${apiAddress}Notice/GetNoticeInfoList?sessionId=${sessionId}`;
  },

  /** 跟新消息状态为已读 */
  setNoticeInfo() {
    return (apiAddress) => `${apiAddress}Notice/SetNoticeInfo`;
  },

  /** 更改令牌的生效时间 */
  setTokenTime() {
    return (apiAddress) => `${apiAddress}Notice/SetTokenTime`;
  },

  /** 根据公告的id获取公告的信息 */
  getNoticeInfoById(params) {
    return (apiAddress, sessionId) => `${apiAddress}Notice/GetNoticeInfoById?sessionId=${sessionId}&${queryString.stringify(params)}`;
  },
};