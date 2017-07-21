/** 带输入框卡片 */

import React, { Component } from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';
import { inputCard, color } from '@/common/Style';
import Line from '@/common/components/Line';
import Input from '@/common/components/Input';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import I18n from 'react-native-i18n';

export default class InputCard extends Component {

  static defaultProps = {
    placeholder: '',
    maxLength: 10,
    topLine: true,
    bottomLine: false,
    keyboardType: 'default',
    onChangeText: null,
    onEndEditing: null,
    editable: true,
    disabled: false,
  };

  mixins: [React.addons.PureRenderMixin]

  state = {
    value: '',
    backgroundColor: inputCard.backgroundColor,
  };

  /** life cycle */

  componentWillReceiveProps(nextProps) {
    const { value } = this.state;
    if (nextProps.textValue && value !== nextProps.textValue) {
      this.setState({ value: nextProps.textValue });
    }
  }

  /** callback */

  onChangeText(text) {
    const { onChangeText } = this.props;
    const newText = this.overMaxLength(text);
    this.setState({ value: newText });
    if (onChangeText) onChangeText(newText);
  }

  onSubmitEditing(text) {
    const { onSubmitEditing } = this.props;
    if (onSubmitEditing) onSubmitEditing(text);
  }

  onEndEditing(text) {
    const { onEndEditing } = this.props;
    if (onEndEditing) onEndEditing(text);
  }

  onShowUnderlay() {
    this.setState({ backgroundColor: color.underlayColor });
  }

  onHideUnderlay() {
    this.setState({ backgroundColor: inputCard.backgroundColor });
  }

  /** event response */

  onPress() {
    this.input.focus();
  }

  /** private method */

  overMaxLength(text) {
    const { maxLength } = this.props;
    if (text.length > maxLength) {
      showMessage(messageType.error, I18n.t('mobile.module.onbusiness.maxlengthprompttext'));
      return text.substr(0, maxLength);
    }
    return text;
  }

  /** render method */

  renderUnitView() {
    const { unitText } = this.props;
    if (unitText) {
      return <Text allowFontScaling={false} style={styles.unit}>{unitText}</Text>;
    }
  }

  render() {
    const { value, backgroundColor } = this.state;
    const { title, style, placeholder, topLine, bottomLine, topLineStyle, bottomLineStyle, keyboardType, editable, disabled } = this.props;
    return (
      <TouchableHighlight
        style={[style, { backgroundColor }]}
        onPress={() => this.onPress()}
        activeOpacity={1.0}
        underlayColor={color.underlayColor}
        onShowUnderlay={() => this.onShowUnderlay()}
        onHideUnderlay={() => this.onHideUnderlay()}
        disabled={disabled}
      >
        <View style={styles.container}>
          {topLine ? <Line style={topLineStyle} /> : null}
          <View style={styles.textContainer}>
            <Text allowFontScaling={false} style={styles.title}>{title}</Text>
            <View style={styles.detail}>
              <Input
                refs={input => this.input = input}
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={inputCard.input.placeholderColor}
                value={value}
                onChange={(event) => this.onChangeText(event.nativeEvent.text)}
                onSubmitEditing={(event) => this.onSubmitEditing(event.nativeEvent.text)}
                onEndEditing={(event) => this.onEndEditing(event.nativeEvent.text)}
                maxLength={800}
                multiline={false}
                keyboardType={keyboardType}
                returnKeyType="done"
                editable={editable}
              />
            </View>
            {this.renderUnitView()}
          </View>
          {bottomLine ? <Line style={bottomLineStyle} /> : null}
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    paddingRight: 18,
    width: device.width,
    height: 48,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 18,
    fontSize: inputCard.title.fontSize,
    color: inputCard.title.color,
  },
  detail: {
    flex: 1,
    marginLeft: 14,
  },
  input: {
    flex: 1,
    textAlign: 'right',
    fontSize: inputCard.input.fontSize,
    color: '#333333',
  },
  unit: {
    marginLeft: 2,
    fontSize: inputCard.input.fontSize,
    color: inputCard.input.color,
  },
});