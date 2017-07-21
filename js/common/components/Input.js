import {
  TextInput,
  View,
  Keyboard
} from 'react-native';
import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { color } from '@/common/Style';
import { device } from '../Util';

export default class Input extends Component {
  static defaultProps = {
    autoFocus: false,
    placeholder: '',
    autoCorrect: false,
    keyboardType: 'default',
    maxLength: null,
    placeholderTextColor: '#c9c9c9',
    editable: true,
    multiline: false,
    secureTextEntry: false,
    clearButtonMode: 'while-editing',
  }

  mixins: [React.addons.PureRenderMixin]

  /** Life cycle */

  componentDidMount() {
    this.keyboardDismissListener = Keyboard.addListener('keyboardDidHide', () => {
      Keyboard.dismiss();
    })
  }

  componentWillUnmount() {
    this.keyboardDismissListener.remove();
  }

  /** Render */
  render() {
    const { style, autoFocus, autoCorrect, keyboardType, maxLength, onEndEditing, value, placeholder,
      placeholderTextColor, editable, multiline, secureTextEntry, clearButtonMode, androidStyle, ...props } = this.props;
    if (device.isIos) {
      return (
        <TextInput
          ref={input => {
            if (this.props.refs) this.props.refs(input);
          }}
          enablesReturnKeyAutomatically
          style={[styles.inputText, style]}
          selectionColor={color.mainColorLight}
          autoFocus={autoFocus}
          autoCorrect={autoCorrect}
          keyboardType={keyboardType}
          maxLength={maxLength}
          onChange={e => {
            if (this.props.onChange) this.props.onChange(e);
          }}
          onChangeText={e => {
            if (this.props.onChangeText) this.props.onChangeText(e);
          }}
          onSubmitEditing={e => {
            if (this.props.onSubmitEditing) this.props.onSubmitEditing(e);
          }}
          onEndEditing={onEndEditing}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          editable={editable}
          multiline={multiline}
          secureTextEntry={secureTextEntry}
          clearButtonMode={clearButtonMode}
          onFocus={() => {
            if (this.props.onFocus) this.props.onFocus();
          }}
          onContentSizeChange={e => {
            if (this.props.onContentSizeChange) this.props.onContentSizeChange(e);
          }}
          {...props} />);
    }

    return (
      <View style={[styles.inputWrap, androidStyle]}>
        <TextInput
          ref={input => {
            if (this.props.refs) this.props.refs(input);
          }}
          enablesReturnKeyAutomatically
          style={[styles.inputText, style]}
          selectionColor={color.mainColorLight}
          autoFocus={autoFocus}
          autoCorrect={autoCorrect}
          keyboardType={keyboardType}
          maxLength={maxLength}
          onChange={e => {
            if (this.props.onChange) this.props.onChange(e);
          }}
          onChangeText={e => {
            if (this.props.onChangeText) this.props.onChangeText(e);
          }}
          onSubmitEditing={e => {
            if (this.props.onSubmitEditing) this.props.onSubmitEditing(e);
          }}
          onEndEditing={onEndEditing}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          editable={editable}
          multiline={multiline}
          secureTextEntry={secureTextEntry}
          underlineColorAndroid="transparent"
          onFocus={() => {
            if (this.props.onFocus) this.props.onFocus();
          }}
          onContentSizeChange={e => {
            if (this.props.onContentSizeChange) this.props.onContentSizeChange(e);
          }}
          {...props} />
      </View>);
  }
}

const styles = EStyleSheet.create({
  inputWrap: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    '@media ios': {
      justifyContent: 'center',
    },
    flexGrow: 1,
  },
  inputText: {
    margin: 0,
    padding: 0,
    color: '$input.color',
    fontSize: '$input.fontSize',
    height: '$input.height',
    paddingLeft: 5,
    marginRight: 18,
  },
});