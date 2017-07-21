/**
 * 获取考核期的帮助类
 */
import _ from 'lodash';

import { DeviceEventEmitter } from "react-native";
import { GET } from "@/common/Request";
import { event } from "@/common/Util";
import { getSelectInfo } from '@/common/api';

let instance = null;

export default class CommissionHelper {

  constructor() {
    if (instance == null) {
      instance = this;
    }
    return instance;
  }

  /**
   * 本地保存信息
   */
  initData() {
    this.selectDate = [];
    GET(
      getSelectInfo(),
      responseData => {
        this.selectDate = responseData;
        DeviceEventEmitter.emit(event.GET_COMISSION_DATA, responseData);
      },
      error => {
        DeviceEventEmitter.emit(event.GET_COMISSION_DATA, []);
        this.selectDate = [];
      }
    );
  }

  /**
   * 请求数据
   */
  getData() {
    if (this.selectDate.length != 0) {
      return new Promise((resolve, reject) => {
        resolve(this.selectDate);
      });
    }
    return new Promise((resolve, reject) => {
      GET(
        getSelectInfo(),
        responseData => resolve(responseData),
        message => reject(message),
        'getSelectInfo'
      );
    });
  }

  /**
   * 获取取到的时间的数据
   */
  getSelectData() {
    return this.selectDate;
  }
}