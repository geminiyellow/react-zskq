/**
 * 自定义弹窗组件
 */
import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Line from '@/common/components/Line';
import { device } from '@/common/Util';

export default class CustomAlert extends React.Component {
  constructor(props) {
    super(props);
    this.isShow = false;
    this.state = {
      showAlert: false,
    };
  }

  /** Callback */
  onPressBtn() {
    const { onPress } = this.props;
    this.setState({ showAlert: false });
    if (onPress) {
      onPress();
    }
  }

  show() {
    this.setState({ showAlert: true });
  }

  /** Render Methods */
  render() {
    const { showAlert } = this.state;
    if (!showAlert) {
      return null;
    }
    return (
      <View style={styles.container}>
        <View style={styles.alert}>
          <View style={styles.title}>
            <Text
              numberOfLines={2}
              allowFontScaling={false}
              style={styles.titleText}>您的会话已失效，请重新登录。</Text>
          </View>
          <Line style={styles.line}/>
          <TouchableHighlight
            underlayColor="white"
            onPress={() => this.onPressBtn()}
            activeOpacity={0.5}
            style={styles.button}>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={styles.buttonTitle}>立即登录</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: device.width,
    height: device.height,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000099',
  },
  alert: {
    width: 270,
    height: 105,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    // shadow
    shadowColor: '#140000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  title: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  titleText: {
    fontSize: 13,
    color: '#030303',
  },
  line: {
    width: 270,
  },
  button: {
    height: 43,
    backgroundColor: 'white',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: 17,
    color: '#14BE4B',
  },
});