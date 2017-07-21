/**
 *  强制更新 单例
 */

import { appVersion } from '@/common/Consts';

let instance = null;

export default class ForcedUpdate {
  constructor() {
    if (instance == null) {
      instance = this;
    }
  };

  needForcedUpdate() {
    if (!global.companyResponseData || (global.companyResponseData && !global.companyResponseData.appVersion)) {
      return false;
    }
    const temp = global.companyResponseData.appVersion;
    // const temp = '3.4.0';
    const arrTemp = temp.split('.');
    const arrVersion = appVersion.split('.');
    const tempNumber = parseInt(`${arrTemp[0]}${arrTemp[1]}${arrTemp[2]}`);
    const appNumber = parseInt(`${arrVersion[0]}${arrVersion[1]}${arrVersion[2]}`);
    if (isNaN(tempNumber)) {
      return false;
    }
    if (appNumber < tempNumber) {
      return true;
    }
    return false;
  }
}