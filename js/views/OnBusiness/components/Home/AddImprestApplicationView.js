/**
 * 增加备用金申请 View: AddButton
 * 用于添加一条添加备用金申请单
 */

import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Image from '@/common/components/CustomImage';
import I18n from 'react-native-i18n';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';
import { color } from '../Style';

const addImage = 'alert_icon_add';

export default class AddButton extends Component {
  /** event response */

  onPress() {
    this.props.addImprestApplication();
  }

  /** render view */

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={() => this.onPress()}>
          <Image source={{ uri: addImage }} style={styles.image} />
          <Text allowFontScaling={false} style={styles.font}>{I18n.t('mobile.module.onbusiness.addbuttontext')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: device.width,
    height: 48,
    backgroundColor: 'white',
  },
  button: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 22,
    height: 22,
  },
  font: {
    color: color.mainColor,
    marginLeft: 8,
    fontSize: 16,
  },
});