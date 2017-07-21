import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';
import I18n from 'react-native-i18n';
import Button from '@/common/components/Button';
import Image from '@/common/components/CustomImage';
import NavBar from '@/common/components/NavBar';

import GesturePwd from './GesturePwd';
import styles from './EmptyGesturePwdStyle';

const emptyGesturePan = 'empty_gesture_pan';
const leftBack = 'back_white';

export default class EmptyGesturePwd extends Component {
  onBtnClicked() {
    this.props.navigator.push({
      component: GesturePwd,
      passProps: {
        passGesturePwd: this.props.passGesturePwd,
      },
    });
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <NavBar
          title={I18n.t('mobile.module.salary.draw')}
          titleColor="white"
          backgroundColor="#1FD662"
          lineColor="transparent"
          backImage={leftBack}
          onPressLeftButton={() => this.props.navigator.pop()} />
        <View style={styles.container}>
          <Image style={styles.panImg} source={{ uri: emptyGesturePan }} />
          <Text allowFontScaling={false} style={styles.textTitle}>{I18n.t('mobile.module.salary.startgesturepwd')}</Text>
          <Text allowFontScaling={false} style={styles.textDesc}>{I18n.t('mobile.module.salary.startgesturepwddesc')}</Text>
          <View style={styles.btnRow}>
            <Button
              textStyle={{ color: '#1fd662' }}
              containerStyle={{ backgroundColor: '#ffffff', flexGrow: 1 }}
              text={I18n.t('mobile.module.salary.draw')}
              onPress={() => this.onBtnClicked()} />
          </View>
        </View>
      </View>
    );
  }
}
