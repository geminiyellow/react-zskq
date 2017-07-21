/**
 * 导航栏 标题增加点击事件, 支持原生和js端图片展示
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import _ from 'lodash';
import Image from '@/common/components/CustomImage';
import { navigationBar } from '@/common/Style';

export default class NavBarTitleBtn extends Component {
  mixins: [React.addons.PureRenderMixin]
  render() {
    const { tintColor, onPress, titleText, titleimage } = this.props;
    if (_.isString(titleimage)) {
      return (
        <TouchableWithoutFeedback onPress={onPress}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
            <Text allowFontScaling={false} numberOfLines={1} style={[styles.navBarTitle]}>{titleText} </Text>
            <Image style={styles.imageStyle} source={{ uri: titleimage }} />
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Text allowFontScaling={false} numberOfLines={1} style={styles.navBarTitle}>{titleText} </Text>
          <Image style={styles.imageStyle} source={titleimage} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = EStyleSheet.create({
  navBarTitle: {
    color: '#000',
    paddingLeft: 10,
    textAlign: 'center',
    justifyContent: 'flex-start',
    maxWidth: 160,
    fontSize: navigationBar.titleFontSize,
    fontWeight: navigationBar.titleFontWeight,
  },
  imageStyle: {
    width: 30,
    height: 30,
  },
});
