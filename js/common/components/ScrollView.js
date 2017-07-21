/**
 *  滚动视图
 */

import React, { PureComponent } from 'react';
import { Keyboard, ScrollView } from 'react-native';
import { device } from '@/common/Util';

export default class ScrollViewC extends PureComponent {

  // onScrollBeginDrag() {
  //   if (device.isAndroid) {
  //     // 键盘消失
  //     if (this.props.behavior != null) {
  //       Keyboard.dismiss();
  //     }
  //   }
  // }

  render() {
    const { style, children, ...props } = this.props;
    return (
      <ScrollView
        style={style}
        keyboardDismissMode={device.isIos ? 'on-drag' : null}
        {...props}
        >
        {children}
      </ScrollView>
    );
  }
}
