/**
 * 排班请假权限判断
 */
import _ from 'lodash';
let instance = null;
let authorities = null;

export default class LeaveModeHelper {
  mixins: [React.addons.PureRenderMixin]

  constructor() {
    if (instance == null) {
      instance = this;
    }

    return instance;
  }

  /**
   * 获取用户的权限列表
   */
  setAuthorities(resData) {
    authorities = resData;
  }

  hasLeaveAuthority() {
    if (authorities != null) {
      for (let i = 0; i < authorities.length; i++) {
        if (authorities[i].Id == 'S010030') {
          return true;
        }
      }
      return false;
    }
    return false;
  }
}