// 设置考勤地点导航栏右边自定义带图片按钮

import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Image from '@/common/components/CustomImage';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import { color } from '@/common/Style';

const questionImg = 'icon_question';

export default class RightButton extends Component {
  mixins: [React.addons.PureRenderMixin]

  render() {
    return (
      <TouchableOpacity onPress={() => this.props.onPress()}>
        <View style={styles.container}>
          <Image style={styles.image} source={{ uri: questionImg }} />
          <Text allowFontScaling={false} style={styles.font} numberOfLines={1}>{I18n.t('mobile.module.setup.relocate')}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 11,
  },
  image: {
    width: 22,
    height: 22,
  },
  font: {
    color: color.mainColorLight,
    width: 50,
  },
});