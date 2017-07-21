// 无搜索历史视图

import React, { Component } from 'react';
import { Text, View } from 'react-native';
import Image from '@/common/components/CustomImage';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';

const emptyImg = 'empty';

export default class EmptyView extends Component {

  render() {
    const { title, detailText } = this.props;
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={{ uri: emptyImg }} />
        <Text allowFontScaling={false} style={styles.titleText}>{title}</Text>
        <Text allowFontScaling={false} style={styles.detailText}>{detailText}</Text>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    width: device.width,
    height: 250,
  },
  image: {
    marginTop: 50,
    width: 80,
    height: 80,
  },
  titleText: {
    marginTop: 20,
    fontSize: 20,
  },
  detailText: {
    marginTop: 6,
    fontSize: 14,
    color: 'gray',
  },
});