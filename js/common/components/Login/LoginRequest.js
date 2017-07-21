import { NativeModules } from 'react-native';

import { GET, POST } from '@/common/Request';
import {
  getLoginURL,
  setCompanyCodeMobile,
  getSysParaInfo,
  getLoveCareAddress,
  getUserInfoNew,
  saveAppUserInfo } from '@/common/api';
import { keys, device } from '@/common/Util';
import { log } from '@/common/LogHelper';
import { getCurrentLanguage, encrypt } from '@/common/Functions';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
import Consts, { appVersion } from '@/common/Consts';
import realm from '@/realm';
import moment from 'moment';
import { LoadingManager } from '@/common/Loading';

const customizedCompanyHelper = new CustomizedCompanyHelper();
const { RNManager, RNKeychainManager } = NativeModules;

module.exports = {

  // 公司代码
  setCompanyCodeMobileRequest(companyCode) {
    return new Promise((resolve, reject) => {
      const companyInfo = realm.objects('Company');
      if (companyInfo.length == 0 && !companyCode) {
        reject('Company Code Error');
      }
      let code;
      if (companyInfo.length != 0) {
        code = companyInfo[0].code;
      }
      let tempCode = code;
      if (companyCode) {
        tempCode = companyCode;
      }
      // 记住公司代码
      customizedCompanyHelper.setCompanyCode(tempCode);
      getCurrentLanguage().then(language => {
        GET(setCompanyCodeMobile(tempCode, language), (responseData) => {
          // console.log('setCompanyCodeMobile - - - - - - - - - - - - - - - - ', responseData);
          global.companyResponseData = responseData;
          Consts.apiAddress = responseData.apiAddress;
          const imageUrl = responseData.url.replace(':443', '');

          // 设置loading背景
          LoadingManager.setLoadingBg();

          realm.write(() => {
            const companyInfo = realm.objects('Company');
            if (companyInfo.length == 0) {
              realm.create('Company', { code: tempCode, url: responseData.apiAddress, image_url: imageUrl });
            } else {
              companyInfo[0].code = tempCode;
              companyInfo[0].url = responseData.apiAddress;
              companyInfo[0].image_url = imageUrl;
            }
          });
          resolve(imageUrl);
        }, ((err) => {
          reject(err);
        }));
      }).catch(err => {
        reject(err);
      });
    });
  },

  // 用户登录
  setUserLoginRequest(staffId, password) {
    if (customizedCompanyHelper.getCompanyCode() === 'rohm') {
      RNKeychainManager.getDeviceId(deviceId => {
        const simId = deviceId;
        const phoneModel = device.mobileName;
        const phoneSystemVersion = device.mobileOS;
        const deviceName = device.deviceName;
        const logInfo = `${simId}-${phoneModel}-${phoneSystemVersion}-${deviceName},登录请求`;
        log(logInfo, staffId);
      });
    }

    return new Promise((resolve, reject) => {
      const userInfo = realm.objects('User')
      let userId = '';
      let userPw = '';
      if (userInfo.length != 0) {
        for (let i = 0; i < userInfo.length; i++) {
          if (userInfo[i].password.length != 0) {
            userId = userInfo[i].name.replace(/\#KENG#/g, '\\');
            userPw = userInfo[i].password.replace(/\#KENG#/g, '\\');
          }
        }
      }
      if (staffId && password) {
        userId = staffId;
        userPw = password;
      }
      this.userId = userId;
      this.userPw = userPw;

      RNManager.RegistrationId(registId => {
        Promise.all([encrypt(userId), encrypt(userPw), getCurrentLanguage()]).then((data) => {
          RNKeychainManager.getDeviceId(deviceId => {
            if (device.isIos) {
              RNKeychainManager.getDeviceIdSplit(dicInfo => {
                const logInfo = `SIMID = ${dicInfo.SIMID}  |*|and|*|  DeviceID = ${dicInfo.DeviceID} `;
                log(logInfo, staffId);
              });
            }
            const params = {};
            params.loginName = data[0];
            params.password = data[1];
            params.simId = deviceId;
            params.mobileId = deviceId;
            params.phoneModel = device.mobileName;
            params.phoneSysVersion = device.mobileOS;
            params.appVersion = appVersion;
            params.language = data[2];
            params.isClearGesturePwd = 0;
            params.companyCode = customizedCompanyHelper.getCompanyCode();
            params.registrationId = registId;
            params.resolution = `${device.width / device.hairlineWidth}x${device.height / device.hairlineWidth}`;

            Promise.all([
              new Promise((resolve, reject) => {
                POST(getLoginURL(), params, (responseData) => {
                  resolve(responseData);
                }, (err) => {
                  reject(err);
                });
              }),
              new Promise((resolve, reject) => {
                const params = {};
                params.loginName = this.userId;
                params.appVersion = appVersion;
                params.companyCode = customizedCompanyHelper.getCompanyCode();
                GET(getSysParaInfo(params), (responseData) => {
                  resolve(responseData);
                }, (err) => {
                  reject(err);
                });
              }),
              new Promise((resolve, reject) => {
                const params = {};
                params.loginName = this.userId;
                GET(getUserInfoNew(params), (responseData) => {
                  resolve(responseData);
                }, (error) => {
                  reject(error);
                });
              })
            ]).then(data => {
              global.loginResponseData = data[0];
              global.loginResponseData.SysParaInfo = data[1];
              global.loginResponseData.CompanyName = data[2].CompanyName;
              global.loginResponseData.CompanyEngName = data[2].CompanyEngName;
              global.loginResponseData.LoginName = data[2].LoginName;
              global.loginResponseData.EmpID = data[2].EmpID;
              global.loginResponseData.EmpName = data[2].EmpName;
              global.loginResponseData.EnglishName = data[2].EnglishName;
              global.loginResponseData.DeptName = data[2].DeptName;
              global.loginResponseData.DeptId = data[2].DeptId;
              global.loginResponseData.Gender = data[2].Gender;
              global.loginResponseData.BirthDay = data[2].BirthDay;
              global.loginResponseData.Position = data[2].Position;
              global.loginResponseData.HeadImgUrl = data[2].HeadImgUrl;
              Consts.sessionId = global.loginResponseData.SessionId;
              resolve(data[0]);
            }).catch(err => {
              reject(err)
            });
          });
        }).catch(err => {
          reject(err);
        });
      });
    });
  },

  // 保存用户信息 至 realm
  saveUserInfoToLocal(responseData) {
    realm.write(() => {
      const staffIdT = this.userId.replace(/\\/g, '#KENG#');
      const passwordT = this.userPw.replace(/\\/g, '#KENG#');
      const info = realm.objects('User').filtered(`name="${staffIdT}"`);
      if (info.length == 0) {
        realm.create('User', { user_id: responseData.UserID, name: staffIdT, password: passwordT, emp_id: responseData.EmpID });
      } else {
        const userInfo = realm.objects('User');
        for (let i = 0; i < userInfo.length; i++) {
          userInfo[i].password = '';
        }
        info[0].password = passwordT;
        info[0].emp_name = responseData.EmpName;
        info[0].english_name = responseData.EnglishName;
        info[0].head_url = responseData.HeadImgUrl;
      }
    });
  },

  // 获取各种表单配置信息
  getFormSettingInfo(loginname) {
    return new Promise((resolve, reject) => {
      const params = {};
      params.loginName = loginname;
      params.appVersion = appVersion;
      params.companyCode = customizedCompanyHelper.getCompanyCode();
      GET(getSysParaInfo(params), (responseData) => {
        global.loginResponseData.SysParaInfo = responseData;
        resolve(responseData);
      }, (err) => {
        reject(err);
      });
    });
  },

  // 获取爱关怀链接url
  getLoveCareURL() {
    return new Promise((resolve, reject) => {
      const params = {};
      params.appVersion = appVersion;
      params.companyCode = customizedCompanyHelper.getCompanyCode();
      GET(getLoveCareAddress(params), (responseData) => {
        global.loginResponseData.SysParaInfo = responseData;
        resolve(responseData);
      }, (err) => {
        reject(err);
      });
    });
  },

  // 保存用户信息至移动云
  saveUserInfoToMobileCenter() {
    return new Promise((resolve, reject) => {
      RNKeychainManager.getDeviceId(mobileId => {
        const time = moment();
        const params = {};
        params.loginName = this.userId;
        params.phoneModel = device.mobileName;
        params.mobileId = mobileId;
        params.loginTime = `${time.year()}-${time.month() + 1}-${time.date()} ${time.hour()}:${time.minute()}:${time.second()}`;
        params.companyCode = customizedCompanyHelper.getCompanyCode();
        params.resolvingPower = `${device.width / device.hairlineWidth}x${device.height / device.hairlineWidth}`;
        POST(saveAppUserInfo(), params, (responseData) => {
          resolve(responseData);
        }, (err) => {
          reject(err);
        });
      }); 
    });
  }

};