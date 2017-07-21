// 倒计时令牌

import React, { Component } from 'react';
import { DeviceEventEmitter, Text, View } from 'react-native';
import Image from '@/common/components/CustomImage';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import BackgroundTimer from 'react-native-background-timer';
import { RefreshTimeData } from '../../actions';

const shieldImg = 'shield';

class Token extends Component {
  mixins: [React.addons.PureRenderMixin]

  constructor(props) {
    super(props);
    if (global.leftTime) time = global.leftTime;
  }

  /** life cycle */

  componentWillMount() {
    const { params } = this.props;
    if (params) this.timerConfig(params);
  }

  componentDidMount() {
    this.mounted = true;
    const { dispatch } = this.props;
    this.timerListener = DeviceEventEmitter.addListener('timer', (time) => {
      if (this.mounted) dispatch(RefreshTimeData(time));
      global.leftTime = time;
    });
  }

  componentWillUnmount() {
    this.mounted = false;
    this.timerListener.remove();
    this.clearTimer();
  }

  /** private methods */

  // 令牌倒计时
  timerConfig(params) {
    let minute = parseInt(params.leftMinute);
    let second = parseInt(params.leftSecond);
    this.timer = BackgroundTimer.setInterval(() => {
      if (second == 0) {
        second = 60;
        minute -= 1;
      }
      second -= 1;
      if (second < 10) second = `0${second}`;
      if (minute < 10) minute = `0${minute}`;
      const time = `00:${minute}:${second}`;
      DeviceEventEmitter.emit('timer', time);
      second = parseInt(second);
      minute = parseInt(minute);
      if (minute == 0 && second == 0) {
        this.clearTimer();
      }
    }, 1000);
  }

  // 清除令牌倒计时
  clearTimer() {
    this.timer && BackgroundTimer.clearInterval(this.timer);
  }

  /** render methods */

  render() {
    const { time } = this.props;
    return (
      <View style={styles.bar}>
        <View style={styles.text}>
          <Text allowFontScaling={false} style={styles.title}>{I18n.t('mobile.module.setup.failuretime')}</Text>
          <Text allowFontScaling={false} style={styles.detail}>{time}</Text>
        </View>
        <Image style={styles.image} source={{ uri: shieldImg }} />
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { time } = state.setUpReducer;
  return {
    time,
  };
}

export default connect(mapStateToProps)(Token);

const styles = EStyleSheet.create({
  bar: {
    width: device.width,
    height: 80,
    backgroundColor: '#282f39',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    marginLeft: 35,
  },
  title: {
    fontSize: 16,
    color: '#ffffff',
  },
  image: {
    width: 65,
    height: 65,
    marginRight: 50,
    marginLeft: 10,
  },
  detail: {
    marginTop: 6,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});