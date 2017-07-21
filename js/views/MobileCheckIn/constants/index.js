import keyMirror from 'fbjs/lib/keyMirror';

module.exports = {
  actionType: keyMirror({
    // 更改用户的排班时间
    CHANGE_USER_WORKING_TIME: null,
    // 更改用户的班别信息
    CHANGE_USER_SHIFT: null,
    // 更改用户的上下班卡信息
    CHANGE_USER_CLOCK_INFO: null,
  }),
};