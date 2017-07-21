import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Image from '@/common/components/CustomImage';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';
import I18n from 'react-native-i18n';

export default class PlainRow extends Component {
  mixins: [React.addons.PureRenderMixin]

  onPressRow() {
    this.props.onPress();
  }

  // 获取误差范围显示文字
  rangeText(range) {
    let rangeText;
    if (isNaN(range)) rangeText = I18n.t('mobile.module.setup.notset');
    else rangeText = `${range} ${I18n.t('mobile.module.setup.meters')}`;
    return rangeText;
  }

  render() {
    const { style, title, detailText, range, fontStyle, noImg } = this.props;
    let disabled = false;
    if (noImg) disabled = true;
    let rangeText = this.rangeText(range);
    return (
      <TouchableOpacity style={[styles.container, style]} disabled={disabled} onPress={() => this.onPressRow()}>
        <View style={styles.location}>
          <Text allowFontScaling={false} style={[styles.font, fontStyle]}>{title}</Text>
          {detailText ? <Text allowFontScaling={false} style={styles.detail}>{detailText}</Text> : null}
        </View>
        {noImg ? null : <Text allowFontScaling={false} style={styles.range} numberOfLines={1}>{rangeText}</Text>}
        {noImg ? null : <Image style={styles.image} source={{ uri: 'forward' }} />}
      </TouchableOpacity>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: device.width,
    height: 60,
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'row',
  },
  location: {
    flexGrow: 1,
    justifyContent: 'center',
    marginLeft: 18,
  },
  font: {
    fontSize: 16,
    color: '#000000',
  },
  detail: {
    marginTop: 6,
    color: '#999999',
    fontSize: 14,
  },
  range: {
    flexGrow: 1,
    color: '#999999',
    fontSize: 14,
    textAlign: 'right',
  },
  image: {
    width: 22,
    height: 22,
    marginRight: 11,
  },
});