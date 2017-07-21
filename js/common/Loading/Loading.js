import React, { Component } from 'react';
import { Animated } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';

export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: new Animated.Value(0),
      hidden: false,
      proBg: '#14BE4B',
    };
  }

  setProBg(bg) {
    this.setState({
      proBg: bg,
    });
  }

  start() {
    this.state.width.setValue(0);
    this.setState({ hidden: false });
    Animated.timing(
      this.state.width,
      {
        toValue: device.width - 20,
        duration: 10000,
      },
    ).start();
  }

  stop() {
    this.state.width.setValue(0);
  }

  done() {
    Animated.timing(
      this.state.width,
      { toValue: device.width },
    ).start((obj) => this.completeAnimation(obj));
  }

  completeAnimation(obj) {
    this.setState({ hidden: true });
  }

  render() {
    const { width, hidden } = this.state;
    if (hidden) return null;
    return (
      <Animated.View style={[styles.loading, { width, backgroundColor: this.state.proBg }]} />
    );
  }
}
const styles = EStyleSheet.create({
  loading: {
    '@media ios': {
      top: 64,
    },
    '@media android': {
      top: 44,
    },
    position: 'absolute',
    left: 0,
    height: 1,
    borderTopRightRadius: 0.5,
    borderBottomRightRadius: 0.5,
    shadowColor: '$loadingLine.color',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
      height: 0.5,
      width: 0,
    },
  },
});