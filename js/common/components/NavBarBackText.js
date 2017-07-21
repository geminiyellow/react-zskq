/**
 * 带返回箭头 ，文字提示的返回导航控件
 */
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { Component } from 'react';
import NavBarLeftBack from './NavBarLeftBack';
import I18n from 'react-native-i18n';
import { color } from '@/common/Style';
import _ from 'lodash';
import CloseButton from './CloseButton';

const leftBack = 'back';

export default class NavBarBackText extends Component {
  mixins: [React.addons.PureRenderMixin]
  render() {
    const { backText, textStyle, onPressCloseButton, showCloseButton } = this.props;
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => this.props.onPress()}>
          <NavBarLeftBack
            leftImg={{ uri: _.isUndefined(this.props.leftBack) || ((_.isString(this.props.leftBack) && _.isEmpty(this.props.leftBack))) ? leftBack : this.props.leftBack }}
          />
        </TouchableOpacity>
        <CloseButton show={showCloseButton} onPress={() => onPressCloseButton()} />
      </View>
    );
  }
}