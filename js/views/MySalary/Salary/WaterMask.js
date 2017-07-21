import {
  View,
  Text,
} from 'react-native';
import React, { Component } from 'react';
import { device } from '@/common/Util';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class WaterMask extends Component {

  componentWillUnmount() {
    if (device.isAndroid) {
      this.listeners && this.listeners.forEach(listener => listener.remove());
    }
  }

  renderMultiTexts() {
    let multiTexts = '';
    for (let i = 0; i < 3; i++) {
      multiTexts += this.props.maskText;
    }
    return multiTexts;
  }

  renderText() {
    let lines = [];
    for (let i = 0; i < 14; i++) {
      lines.push(
        <View key={i} style={{ flexDirection: 'row' }}>
          <Text allowFontScaling={false} key={i} numberOfLines={1} style={styles.waterMaskText} >{this.renderMultiTexts()}</Text>
        </View>
      );
    }
    return (
      <View>
        {lines}
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container} >
          {this.renderText()}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#ffffff',
  },
  waterMaskText: {
    fontSize: 15,
    marginTop: 40,
    '@media ios': {
      opacity: 0.3,
    },
    '@media android': {
      opacity: 0.2,
    },
    transform: [{ rotate: '-30deg' }],
    marginLeft: -60,
  },
});