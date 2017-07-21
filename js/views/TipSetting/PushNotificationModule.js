import { NativeModules } from 'react-native';
import moment from 'moment';
import _ from 'lodash';
import realm from '@/realm';
import Functions from '@/common/Functions';
import { device } from '@/common/Util';
import { GET } from '@/common/Request';
import { getEmployeeScheduleInfo } from '@/common/api';

let PushNotification;
if (device.isAndroid) {
  PushNotification = require('react-native-push-notification');
}
let gotoworksRemain = [];
let gooffworksRemain = [];
const { RNManager } = NativeModules;
// 保存是否发送了通知KEY
// const KEY_PUSHEDNOTIFICATIONS = 'KEYPUSHEDNOTIFICATIONS';
// 当天排班信息
let currentDayShift = '';

let instance = null;

export default class PushNotificationModule {
  mixins: [React.addons.PureRenderMixin]

  constructor() {
    if (instance == null) {
      instance = this;
    }
    if (device.isAndroid) {
      PushNotification.configure({
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: token => {
        },

        // (required) Called when a remote or local notification is opened or received
        onNotification: notification => {
        },

        // ANDROID ONLY: (optional) GCM Sender ID.
        senderID: 'YOUR GCM SENDER ID',

        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },

        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,

        /**
            * IOS ONLY: (optional) default: true
            * - Specified if permissions will requested or not,
            * - if not, you must call PushNotificationsHandler.requestPermissions() later
            */
        requestPermissions: true,
      });
    }

    return instance;
  }

  // 初始化数据,本地保存的提醒时间
  initDate() {
    gooffworksRemain = [];
    gotoworksRemain = [];
    const toggleGooff = realm.objects('Tip').filtered(`tiptype = "1" AND user_id = "${global.loginResponseData.UserID}"`);

    if (toggleGooff.length > 0 && toggleGooff[0].enable == true) {
      const gooffRemains = realm.objects('Tip').filtered(`tiptype = "3" AND user_id = "${global.loginResponseData.UserID}"`);
      gooffRemains.map(item => {
        gooffworksRemain.push(item.toggletime);
      });
      console.log('gooffworksRemain:: ' + JSON.stringify(gooffworksRemain));
    }
    const toggleGoto = realm.objects('Tip').filtered(`tiptype = "0" AND user_id = "${global.loginResponseData.UserID}"`);

    if (toggleGoto.length > 0 && toggleGoto[0].enable == true) {
      const gotoRemains = realm.objects('Tip').filtered(`tiptype = "2" AND user_id = "${global.loginResponseData.UserID}"`);
      gotoRemains.map(item => {
        gotoworksRemain.push(item.toggletime);
      });
      console.log('gotoworksRemain:: ' + JSON.stringify(gotoworksRemain));
    }
  }

  // 获取今天的排班，并保存数据库
  getTodaySchedule() {
    const params = {};
    params.startDate = `${Functions.getYear()}-${Functions.getMonth()}-${Functions.getDay()}`;
    params.endDate = params.startDate;
    GET(getEmployeeScheduleInfo(params), (responseData) => {
      const result = [...responseData];
      currentDayShift = [...result];
      let tag = false;
      for (item of result) {
        // 有排班并且是正常上班
        if (_.parseInt(item.TotalHours) != 0) {
          console.log('responseData true--- ', true);
          tag = true;
          break;
        }
      }

      if (tag) {
        console.log('responseData true--- ', 'pushSheduleNotifications');
        this.pushSheduleNotifications();
      }
    }, (err) => {
    });
  }

  immediatelyToggleGoto(gotos) {
    gotoworksRemain = [...gotos];
    this.pushSheduleNotifications();
  }

  immediatelyToggleGooff(gooffs) {
    gooffworksRemain = [...gooffs];
    this.pushSheduleNotifications();
  }

  // android 平台发送通知
  pushForAndroidAndIOS(ID, pushmessage, millisecond) {
    console.log('pushForAndroidAndIOS...');
    // 判断平台
    if (device.isAndroid) {
      PushNotification.localNotificationSchedule({
        id: ID,
        message: pushmessage,
        date: new Date(millisecond),
      });
    } else {
      const aps = {};
      aps.fireDate = millisecond;
      aps.alertBody = pushmessage;
      aps.soundName = 'default';
      aps.userInfo = { name: ID };
      aps.applicationIconBadgeNumber = 0;
      // PushNotificationIOS.scheduleLocalNotification(aps);
      RNManager.startALocalNotification(aps);
    }
  }

  // 根据ID 删除提醒   type 标识上班（on）还是下班（off）
  cancelNotificationByID(type, id) {
    if (device.isAndroid) {
      if (type == 'on') {
        PushNotification.cancelLocalNotifications({ id: `10000${id}` });
      } else {
        PushNotification.cancelLocalNotifications({ id: `20000${id}` });
      }
    } else {
      RNManager.cancelALocalNotification({ name: `${type}${id}` });
    }
  }

  prepareDataAndPush() {
    // 加载提醒时间
    const result = [...currentDayShift];
    const shedulesgotos = [];
    const shedulesgooffs = [];
    for (const item of result) {
      shedulesgotos.push(`${item.ShiftDate} ${item.TimeFrom}`);
      shedulesgooffs.push(`${item.ShiftDate} ${item.TimeTo}`);
    }
    console.log('shedulesgotos' + JSON.stringify(shedulesgotos));
    console.log('shedulesgooffs' + JSON.stringify(shedulesgooffs));
    if (device.isIos) {
      RNManager.cancelAllLocalNotifications();
    } else {
      // PushNotification.cancelAllLocalNotifications();
    }
    if (shedulesgotos && shedulesgotos.length > 0) {
      // 上班时间
      for (const t of shedulesgotos) {
        // 上班提醒时间
        let index = 0;
        for (const item of gotoworksRemain) {
          const temp = moment(t) - parseInt(item) * 60 * 1000;
          // 如果提醒时间已经过了。就不要发通知了
          if (moment() < temp) {
            this.pushForAndroidAndIOS(`10000${index}`, '上班提醒', temp);
          }
          index += 1;
        }
      }
    }

    if (shedulesgooffs && shedulesgooffs.length > 0) {
      // 下班时间
      for (const t of shedulesgooffs) {
        let index = 0;
        // 下班提醒时间
        for (const item of gooffworksRemain) {
          const temp = moment(t) + parseInt(item) * 60 * 1000;
          // 如果提醒时间已经过了。就不要发通知了
          if (moment() < temp) {
            this.pushForAndroidAndIOS(`20000${index}`, '下班提醒', temp);
          }
          index += 1;
        }
      }
    }
  }

  // 推送延时消息
  pushSheduleNotifications() {
    this.prepareDataAndPush();
  }
}