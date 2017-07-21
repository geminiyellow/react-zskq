/**
 * 导航栏 右边的图标, 支持原生和js端图片展示
 */
import {
  TouchableOpacity,
  View,
} from 'react-native';
import React, { Component } from 'react';
import _ from 'lodash';
import Image from '@/common/components/CustomImage';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class NavBarRightOneIcon extends Component {
  mixins: [React.addons.PureRenderMixin]
  render() {
    const { onPress, rightImg } = this.props;
    if (_.isString(rightImg)) {
      return (
        <TouchableOpacity onPress={onPress} >
          <View>
            <Image style={styles.rightImg} source={{ uri: rightImg }} />
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={onPress} >
        <View>
          <Image style={styles.rightImg} source={rightImg} />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = EStyleSheet.create({
  rightImg: {
    marginRight: '$navigationBar.rightMargin',
    width: 25,
    height: 25,
  },
});