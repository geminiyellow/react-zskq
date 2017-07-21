/**
 * 我的表单帮助类,单例
 */
import { DeviceEventEmitter } from 'react-native';
import { getCurrentLanguage } from '@/common/Functions';
import { device } from '@/common/Util';
import { GET } from '@/common/Request';
import { getFormTypes } from '@/common/api';
import realm from '@/realm';

let instance = null;
let language = 0;
let languageChanged = null;
let types = '';

export default class MyFormHelper {
  constructor() {
    if (instance == null) {
      instance = this;
      language = 0;
      languageChanged = null;
      this.init();
      this.addListener();
    }
    return instance;
  }
  /**
  读取本地的语言
   */
  init() {
    getCurrentLanguage().then(dataLan => {
      if (!dataLan) {
        switch (device.mobileLocale) {
          case 'zh':
            language = 0;
            break;
          case 'ko':
            language = 2;
            break;
          default:
            language = 1;
            break;
        }
        return;
      }
      if (dataLan == 'EN-US') {
        language = 1;
      } else if (dataLan == 'KO-KR') {
        language = 2;
      } else language = 0;
    });
  }

  addListener() {
    languageChanged = DeviceEventEmitter.addListener('changeLanguage', (selectedIndex) => {
      getCurrentLanguage().then(dataLan => {
        if (dataLan == 'EN-US') {
          language = 1;
        } else if (dataLan == 'KO-KR') {
          language = 2;
        } else language = 0;
      });
    });
  }

  /**
    获取当前的语言环境
   */
  getLanguage() {
    return language;
  }

  // 请求获取我的表单类型
  sendRequestFormTypes(callback) {
    GET(getFormTypes(), (responseData) => {
      types = responseData;
      if (callback) callback();
      realm.write(() => {
        const allTypes = realm.objects('Form');
        realm.delete(allTypes);

        types.map(item => {
          realm.create('Form', {
            name: item.Description,
            form_type: item.Type,
          });
        });
      });
      // const objects = realm.objects('Form');
      // const results = objects.slice(0, objects.length);
      // console.log('realm types:   ', JSON.stringify(results));
      // console.log('length : ', results.length);
    }, (err) => {
    });
  }

  getTypes() {
    return types;
  }
}
