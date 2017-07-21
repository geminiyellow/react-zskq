import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class NavBarLeftQuit extends Component {
  mixins: [React.addons.PureRenderMixin]
  render() {
    const { onPress, leftText } = this.props;
    return (
      <TouchableOpacity onPress={onPress} >
        <View>
          <Text allowFontScaling={false} style={styles.navBarQuit}>{leftText}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = EStyleSheet.create({
  navBarQuit: {
    color: '$navigationBar.leftColor',
    fontSize: '$navigationBar.leftFontSize',
    marginLeft: '$navigationBar.leftMargin',
  },
});