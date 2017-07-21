/** 表单审核按钮 */

import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import { TouchableHighlight, Text, View } from 'react-native';
import { button } from '@/common/Style';
import { device } from '../Util';

export default class CheckButton extends Component {
  mixins: [React.addons.PureRenderMixin]

  state = {
    leftTitleColor: button.background.normal,
    rightTitleColor: button.background.normal,
    leftTitle: '',
    rightTitle: '',
    titleFontWeight: 'bold',
  };

  /** Event Response */

  onPressInLeftBtn() {
    this.setState({
      leftTitleColor: button.background.active,
    });
  }

  onPressOutLeftBtn() {
    this.setState({
      leftTitleColor: button.background.normal,
    });
  }

  onPressInRightBtn() {
    this.setState({
      rightTitleColor: button.background.active,
    });
  }

  onPressOutRightBtn() {
    this.setState({
      rightTitleColor: button.background.normal,
    });
  }

  /** Render View */

  render() {
    const { onPressLeftBtn, onPressRightBtn, customStyle, leftTitle, rightTitle, titleFontWeight } = this.props;
    const { leftTitleColor, rightTitleColor } = this.state;
    return (
      <View style={styles.container}>
        <TouchableHighlight
          style={[styles.button, customStyle]}
          onPress={onPressLeftBtn}
          onPressIn={() => this.onPressInLeftBtn()}
          onPressOut={() => this.onPressOutLeftBtn()}
          underlayColor={button.white}
        >
          <Text allowFontScaling={false} style={[styles.title, { color: leftTitleColor, fontWeight: titleFontWeight }]}>{!leftTitle ? I18n.t('mobile.module.verify.bottom.menu.agree') : leftTitle}</Text>
        </TouchableHighlight>
        <View style={styles.lineContainer}>
          <View style={styles.line} />
        </View>
        <TouchableHighlight
          style={[styles.button, customStyle]}
          onPress={onPressRightBtn}
          onPressIn={() => this.onPressInRightBtn()}
          onPressOut={() => this.onPressOutRightBtn()}
          underlayColor={button.white}
        >
          <Text allowFontScaling={false} style={[styles.title, { color: rightTitleColor, fontWeight: titleFontWeight }]}>{!rightTitle ? I18n.t('mobile.module.verify.bottom.menu.reject') : rightTitle}</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: device.width,
    height: 44,
    flexDirection: 'row',
    // shadow
    shadowColor: '#e3e3e3',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 8,
    shadowOpacity: 0.6,
  },
  button: {
    flex: 1,
    backgroundColor: '$button.white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '$button.background.normal',
  },
  lineContainer: {
    backgroundColor: '$button.white',
    justifyContent: 'center',
  },
  line: {
    height: 21,
    width: device.hairlineWidth,
    backgroundColor: '$splitLine.color',
  },
});