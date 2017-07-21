import React, { Component } from 'react';
import { TouchableHighlight, Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Input from '@/common/components/Input';
import Line from '@/common/components/Line';
import { button } from '@/common/Style';
import { device } from '@/common/Util';
import I18n from 'react-native-i18n';

export default class TextInput extends Component {
  static defaultProps = {
    placeholder: '',
    showButton: false,
    buttonDisabled: true,
    onChangeText: null,
    value: '',
    keyboardType: 'default',
    onPress: null,
    buttonTitle: null,
  };

  /** callback */

  onChangeText(text) {
    const { onChangeText } = this.props;
    if (onChangeText) {
      onChangeText(text);
    }
  }

  /** response event */

  onPress() {
    const { onPress } = this.props;
    if (onPress) {
      onPress();
    }
  }

  /** render methods */

  renderButton() {
    const { showButton, buttonDisabled, buttonTitle } = this.props;
    const buttonBackgroundColor = buttonDisabled ? button.background.disabled : button.background.normal;
    const title = !buttonTitle ? I18n.t('mobile.module.quickexperience.getauthcode') : buttonTitle;

    if (showButton) {
      return (
        <TouchableHighlight
          style={[styles.button, { backgroundColor: buttonBackgroundColor }]}
          underlayColor="#15A53C"
          disabled={buttonDisabled}
          onPress={() => this.onPress()}
        >
          <Text allowFontScaling={false} numberOfLines={1} style={styles.buttonText}>{title}</Text>
        </TouchableHighlight>
      );
    }
  }

  render() {
    const { placeholder, style, value, keyboardType } = this.props;
    return (
      <View style={style}>
        <View style={styles.inputContainer}>
          <Input
            style={styles.input}
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#BDBDBD"
            onChangeText={text => this.onChangeText(text)}
            keyboardType={keyboardType}
          />
          {this.renderButton()}
        </View>
        <Line style={styles.line} />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  inputContainer: {
    marginHorizontal: 12,
    marginBottom: 7.5,
    flexDirection: 'row',
  },
  input: {
    height: 30,
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  button: {
    height: 30,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  buttonText: {
    fontSize: 13,
    color: '#FFFFFF',
  },
  line: {
    marginHorizontal: 12,
    width: device.width - 24,
  },
});