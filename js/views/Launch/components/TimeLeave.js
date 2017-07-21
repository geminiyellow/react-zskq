import React, { Component } from 'react';
import {} from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';
import Tab from '@/views/Tab';
import Text from '@/common/components/TextField';

let timeLeft;
let enterNumber;
let allNumber;

export default class TimeLeave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TimeNow: '',
    };
    timeLeft = this.props.timeLeft * 60;
    allNumber = this.props.timeLeft * 60;
  }

  componentWillMount() {
    const date = new Date();
    enterNumber = (parseInt(date.getHours()) * 3600) + (parseInt(date.getMinutes()) * 60) + parseInt(date.getSeconds());

    this.setState({
      TimeNow: this.checkOutTime(),
    });
    this.timerTime = setInterval(() => {
      if (timeLeft == 0) {
        this.props.navigator.push({
          component: Tab,
        });
        clearInterval(this.timerTime);
        return;
      }

      this.checkForTrueTime();
      this.setState({
        TimeNow: this.checkOutTime(),
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerTime);
  }

  checkOutTime() {
    // const hour = this.props.timeLeft / 60;
    const hour = parseInt(timeLeft / (60 * 60));
    const minutes = parseInt((timeLeft - (hour * 60 * 60)) / 60);
    const seconds = timeLeft - (hour * 60 * 60) - (minutes * 60);
    const timeArr = [`${hour}`, `${minutes}`, `${seconds}`];
    for (let i = 0; i < timeArr.length; i += 1) {
      if (timeArr[i].length == 1) {
        timeArr[i] = `0${timeArr[i]}`;
      }
    }
    const timeStr = `${timeArr[0]}:${timeArr[1]}:${timeArr[2]}`;
    return timeStr;
  }

  checkForTrueTime() {
    const date = new Date();
    const nowNumber = (parseInt(date.getHours()) * 3600) + (parseInt(date.getMinutes()) * 60) + parseInt(date.getSeconds());
    timeLeft = allNumber - (nowNumber - enterNumber) - 1;
  }

  render() {
    return (
      <Text style={styles.textTimeNow}>{this.state.TimeNow}</Text>
    );
  }
}

const styles = EStyleSheet.create({
  textTimeNow: {
    marginTop: (device.height / 2) - 157,
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1FD662',
    width: 300,
    textAlign: 'center',
    opacity: 0.8,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
});