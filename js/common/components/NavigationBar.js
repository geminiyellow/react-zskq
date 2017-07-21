import NavigationBar from 'react-native-navbar';
import React from 'react';
import {
  View,
} from 'react-native';
import Style from '../Style';
import Line from './Line';
import _ from 'lodash';

let acBarBg = '';

module.exports = (Props) => {
  const { ...props } = Props;
  if (_.isEmpty(global.companyResponseData.color.actionBarBg) || _.isUndefined(global.companyResponseData.color.actionBarBg)) {
    if (props.hasOwnProperty('tintColor')) {
      acBarBg = props.tintColor;
    } else {
      acBarBg = Style.navigationBar.background;
    }
  } else {
    acBarBg = global.companyResponseData.color.actionBarBg;
  }
  state = {
    acBg: acBarBg,
  };
  return (
    <View style={props.navBarStyle}>
      <NavigationBar
        statusBar={{
          style: props.style && props.style.backgroundColor ? 'default' : 'default',
          tintColor: props.style && props.style.backgroundColor ? props.style.backgroundColor : Style.navigationBar.background,
        }}
        style={[{ flexGrow: 1, alignItems: 'center', backgroundColor: Style.navigationBar.background }, { backgroundColor: this.state.acBg }]}
        {...props}
        title={{
          title: props.title && props.title.title || '',
          tintColor: props.title && props.title.tintColor || Style.navigationBar.titleColor,
          style: { fontSize: Style.navigationBar.titleFontSize, fontWeight: Style.navigationBar.titleFontWeight, maxWidth: 165, textAlign: 'center', marginRight: 13 },
        }}
      />
      <Line style={{ backgroundColor: props.lineColor ? props.lineColor : Style.navigationBar.bottomLineColor }} />
    </View>
  );
};