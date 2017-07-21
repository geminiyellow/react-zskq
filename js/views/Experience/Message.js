import React, { Component, PropTypes } from 'react';
import { View, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';

class Message extends Component {

  state = {
    show: false,
    title: '',
  };

  /** life cycle */

  componentWillUnmount() {
    this.timerID && clearTimeout(this.timerID);
  }

  /** callback */

  show(title) {
    this.setState({
      show: true,
      title,
    });
    this.timerID = setTimeout(() => {
      this.setState({ show: false });
    }, 1000);
  }

  /** render method */

  render() {
    const { show, title } = this.state;
    if (!show) return null;
    return (
      <View style={styles.container}>
        <View style={styles.textView}>
          <Text style={styles.text}>{title}</Text>
        </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    position: 'absolute',
    top: 227.5 + 64,
    left: (device.width / 2) - 100,
    width: 200,
    height: 65,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 10,
  },
  textView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 1.0)',
  },
});

export default Message;