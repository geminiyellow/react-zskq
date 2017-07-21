/**
 * 单行文本输入框
 */

import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';

export default class TextField extends PureComponent {

  propTypes: {
    numberOfLines: React.PropTypes.number,
  }

  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }

  render() {
    const { containerStyle, style, numberOfLines, children, ...props } = this.props;
    if (containerStyle) {
      return (
        <View style={containerStyle}>
          <Text
            ref={component => this._root = component}
            style={style}
            allowFontScaling={false}
            numberOfLines={numberOfLines}
            {...props}>
            {children}
          </Text>
        </View>
      );
    }
    return (
      <Text
        style={style}
        ref={component => this._root = component}
        allowFontScaling={false}
        numberOfLines={numberOfLines}
        {...props}>
        {children}
      </Text>
    );
  }
}