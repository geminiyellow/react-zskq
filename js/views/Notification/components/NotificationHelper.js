/**
* 在用户登录成功之后加载通知信息的接口信息
*/

import { DeviceEventEmitter } from "react-native";
import { event } from "@/common/Util";
import { GET, POST } from "@/common/Request";
import { getNotificationMessage } from "@/common/api";
import { isLoadAttendance } from "../constants";

let instance = null;

export default class NotificationHelper {
  constructor() {
    if (instance == null) {
      instance = this;
    }
    return instance;
  }

  // 初始化数据,本地保存的提醒时间
  initData() {
    GET(
      getNotificationMessage(),
      responseData => {
        this.returnData = responseData;
        // 发送角标更新通知,显示总的角标信息
        const badge = responseData.totalAmt
          ? parseInt(responseData.totalAmt)
          : 0;
        DeviceEventEmitter.emit(event.BADGE_TAB, badge);
      },
      error => {
        this.returnData = "";
      }
    );
  }

  // 返回加载过的数据
  getData() {
    return this.returnData;
  }

  // 清除加载获取的信息
  clearData() {
    this.returnData = "";
  }

  // 获取打开数据
  loadData() {
    this.loadDatas = [];
    return new Promise((resolve, reject) => {
      GET(
        getNotificationMessage(),
        responseData => {
          // 第三种信息：获取打卡通知信息
          const { punchTimeList } = responseData;
          if (punchTimeList && punchTimeList.length != 0) {
            const temppunchTimeList = [];
            for (let i = 0; i < punchTimeList.length; i += 1) {
              const tempData = {};
              tempData.EFFECT_DATE = punchTimeList[i].SENTDTM;
              tempData.TITLE = I18n.t("Noti_AttendanceSuccess");
              tempData.ABSTRACT = I18n.t("Noti_AttendanceSuccess");
              tempData.TIME = punchTimeList[i].TIME;
              this.loadData.push(tempData);
            }
          }
          resolve(this.loadData);
        },
        error => {
          this.loadDatas = [];
          reject(this.loadData);
        }
      );
    });
  }

  getLoadData() {
    return this.loadDatas;
  }
}
