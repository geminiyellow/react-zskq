/**
 * iOS platform: source={uri: 'name.webp'}
 * Android platform: source={uri: 'name'}
 */

import React, { Component } from 'react';
import { Image } from 'react-native';
import { device } from '@/common/Util';

export default class CustomImage extends Component {
  static resizeMode = Image.resizeMode;
  static getSize(uri, success, failure) {
    Image.getSize(uri, success, failure);
  }

  render() {
    const { source, ...passProps } = this.props;
    let newSource = source;
    // if (device.isIos && source && source.uri) {
    //   if (source.uri.indexOf('http') == -1 && source.uri.indexOf('file:') == -1) {
    //     newSource = { uri: `${source.uri}.webp` };
    //   }
    // }
    return (
      <Image source={newSource} {...passProps} />
    );
  }
}