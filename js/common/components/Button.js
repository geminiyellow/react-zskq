import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import RNButton from 'react-native-button';

export default class Button extends Component {
  mixins: [React.addons.PureRenderMixin]

  render() {
    const { textStyle, containerStyle, disabledStyle, onPress, text } = this.props;
    return (
      <RNButton
        style={[styles.textStyle, textStyle]}
        containerStyle={[styles.containerStyle, containerStyle]}
        styleDisabled={[styles.disabledStyle, disabledStyle]}
        onPress={onPress}
      >
        {text}
      </RNButton>
    );
  }
}

const styles = EStyleSheet.create({
  textStyle: {
    fontSize: 17,
    color: '$color.white',
  },
  containerStyle: {
    overflow: 'hidden',
    justifyContent: 'center',
    marginHorizontal: 20,
    height: 44,
    borderRadius: 4,
    backgroundColor: '$color.mainColorLight',
  },
  disabledStyle: {
    backgroundColor: '$color.buttonColorDisable',
  },
});