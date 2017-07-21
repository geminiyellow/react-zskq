import React, { Component } from 'react';
import {
  Text,
} from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import { getServerTime } from '@/common/api';
import { GET, ABORT } from '@/common/Request';
import { messageType } from '@/common/Consts';
import { showMessage } from '@/common/Message';

let serverTime;

export default class Time extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TimeNow: '',
    };
  }

  componentWillMount() {
    GET(getServerTime(), (responseData) => {
      this.checkOutTime(responseData);
    }, (error) => {
    }, 'getServerTimeAbort');

    this.setState({
      TimeNow: this.getLocalTime(),
    });
    this.timerTime = setInterval(() => {
      this.setState({
        TimeNow: this.getLocalTime(),
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerTime);
    ABORT('getServerTimeAbort');
  }

  getLocalTime() {
    const date = new Date();
    const timeArr = [`${date.getHours()}`, `${date.getMinutes()}`, `${date.getSeconds()}`];
    for (let i = 0; i < timeArr.length; i += 1) {
      if (timeArr[i].length == 1) {
        timeArr[i] = `0${timeArr[i]}`;
      }
    }
    const timeStr = `${timeArr[0]}:${timeArr[1]}:${timeArr[2]}`;
    return timeStr;
  }

  checkOutTime(responseData) {
    const date = new Date();
    const arr = responseData.split(':');
    const numberLocal = (parseInt(date.getHours()) * 3600) + (parseInt(date.getMinutes()) * 60) + parseInt(date.getSeconds());
    const numberServer = (parseInt(arr[0]) * 3600) + (parseInt(arr[1]) * 60) + parseInt(arr[2]);
    const differNumber = Math.abs(numberLocal - numberServer);
    if (differNumber > 180) {
      showMessage(messageType.warning, I18n.t('mobile.module.clock.warning'));
    }
  }

  refreshTime() {
    const arr = serverTime.split(':');
    let number = (parseInt(arr[0]) * 60 * 60) + (parseInt(arr[1]) * 60) + parseInt(arr[2]);
    number += 1;
    let hour = parseInt(number / 3600);
    let minutes = parseInt((number - (hour * 3600)) / 60);
    let seconds = number - (hour * 3600) - (minutes * 60);
    if (hour >= 24) {
      hour = 0;
      minutes = 0;
      seconds = 0;
    }
    serverTime = `${hour}:${minutes}:${seconds}`;
  }

  render() {
    return (
      <Text allowFontScaling={false} style={styles.textTimeNow}>{this.state.TimeNow}</Text>
    );
  }
}

const styles = EStyleSheet.create({
  textTimeNow: {
    marginTop: 12,
    fontSize: 12.5,
    fontWeight: 'bold',
    width: 90,
    textAlign: 'center',
    color: '#FFF',
    opacity: 0.8,
    backgroundColor: 'transparent',
  },
});