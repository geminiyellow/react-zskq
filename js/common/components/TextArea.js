/**
 * 多行文本输入框
 */

import React, { Component } from 'react';
import { Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Input from '@/common/components/Input';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import { textArea } from '@/common/Style';
import I18n from 'react-native-i18n';
import { device } from '../Util';
import Line from './Line';

export default class TextArea extends Component {

  static defaultProps = {
    title: '',
    placeholder: '',
    maxLength: 200,
    topLine: true,
    bottomLine: true,
    fixedHeight: false,
    fixedInputHeight: 65,
  };
  mixins: [React.addons.PureRenderMixin]

  state = {
    textLength: 0,
    value: '',
    textColor: textArea.prompt.normalColor,
    // textInput 高度
    inputHeight: textArea.input.defaultHeight,
    // textArea 高度
    textAreaHeight: textArea.defaultHeight,
  };

  /** life cycle */

  componentDidMount() {
    const { fixedHeight, fixedInputHeight } = this.props;
    if (fixedHeight) {
      this.setState({
        inputHeight: fixedInputHeight,
        textAreaHeight: 130,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { value } = this.state;
    if (nextProps.textValue && nextProps.textValue !== value) {
      this.setState({
        value: nextProps.textValue,
        textLength: nextProps.textValue.length,
      });
    }
  }

  /** Callback */

  onChange(event) {
    const { maxLength } = this.props;
    const newText = this.overMaxLength(event.nativeEvent.text);
    this.setState({
      value: newText,
      textLength: newText.length,
      textColor: newText.length >= maxLength ? textArea.prompt.activeColor : textArea.prompt.normalColor,
    });
    if (device.isAndroid) {
      this.onContentSizeChange(event.nativeEvent.contentSize.height);
    }
    if (this.props.onChange) this.props.onChange(newText);
  }

  onChangeText(text) {
    const { maxLength } = this.props;
    const newText = this.overMaxLength(text);
    this.setState({
      value: newText,
      textLength: newText.length,
      textColor: newText.length >= maxLength ? textArea.prompt.activeColor : textArea.prompt.normalColor,
    });
    if (this.props.onChangeText) this.props.onChangeText(newText);
  }

  onSubmitEditing(text) {
    if (this.props.onSubmitEditing) this.props.onSubmitEditing(text);
  }

  onEndEditing(text) {
    if (this.props.onEndEditing) this.props.onEndEditing(text);
  }

  onContentSizeChange(height) {
    const { fixedHeight } = this.props;
    if (fixedHeight) {
      return;
    }

    let value = height;
    if (height <= textArea.input.defaultHeight) {
      value = textArea.input.defaultHeight;
    }
    if (height >= textArea.input.maxHeight) {
      value = textArea.input.maxHeight;
    }
    this.setState({
      inputHeight: value,
      textAreaHeight: (textArea.defaultHeight - textArea.input.defaultHeight) + value,
    });
  }

  onFocus() {
    const { onFocus } = this.props;
    if (onFocus) {
      onFocus();
    }
  }

  /** Private Method */

  overMaxLength(text) {
    const { maxLength } = this.props;
    if (text.length > maxLength) {
      showMessage(messageType.error, I18n.t('mobile.module.onbusiness.maxlengthprompttext'));
      return text.substr(0, maxLength);
    }
    return text;
  }

  /** render view */

  renderTitle(title) {
    if (title) return <Text allowFontScaling={false} style={styles.title}>{title}</Text>;
  }

  render() {
    const { title, placeholder, style, containerStyle, maxLength, topLine, bottomLine } = this.props;
    const { textLength, value, textColor, inputHeight, textAreaHeight } = this.state;
    const borderBottomWidth = bottomLine ? device.hairlineWidth : 0;

    return (
      <View style={[styles.container, containerStyle, { height: textAreaHeight, borderBottomWidth }]}>
        {topLine ? <Line /> : null}
        {this.renderTitle(title)}
        <Input
          style={[styles.textInput, style, { height: inputHeight }]}
          placeholder={placeholder}
          placeholderTextColor={textArea.input.placeholderColor}
          multiline
          value={value}
          maxLength={10000}
          autoCorrect={false}
          keyboardType="default"
          editable
          autoFocus={false}
          onChange={(event) => this.onChange(event)}
          onChangeText={(text) => this.onChangeText(text)}
          onSubmitEditing={(event) => this.onSubmitEditing(event.nativeEvent.text)}
          onEndEditing={(event) => this.onEndEditing(event.nativeEvent.text)}
          androidStyle={styles.androidStyle}
          onContentSizeChange={(event) => this.onContentSizeChange(event.nativeEvent.contentSize.height)}
          onFocus={() => this.onFocus()}
        />
        <View style={styles.prompt}>
          <Text allowFontScaling={false} style={[styles.font, { color: textColor }]}>{`${textLength} / ${maxLength}`}</Text>
        </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: device.width,
    backgroundColor: '$textArea.backgroundColor',
    paddingRight: 15,
    marginTop: '$margin', 
    borderBottomWidth: device.hairlineWidth,
    borderColor: '$color.line',
  },
  title: {
    marginTop: 14,
    marginLeft: 18,
    fontSize: '$textArea.title.fontSize',
    color: '$textArea.title.color',
  },
  textInput: {
    marginLeft: 18,
    width: device.width - 30,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    fontSize: '$textArea.input.fontSize',
    color: '$textArea.input.color',
    textAlignVertical: 'top',
    '@media ios': {
      marginBottom: 5,
    },
  },
  androidStyle: {
    alignItems: 'flex-start',
  },
  prompt: {
    marginBottom: 10,
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  font: {
    fontSize: '$textArea.prompt.fontSize',
  },
});