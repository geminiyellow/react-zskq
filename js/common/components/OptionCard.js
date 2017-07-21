/** 选项卡片 */

import React, { Component } from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import Image from '@/common/components/CustomImage';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';
import { optionCard, color } from '@/common/Style';
import Line from '@/common/components/Line';

const forwardImage = 'forward';

export default class OptionCard extends Component {

  static defaultProps = {
    topLine: true,
    bottomLine: false,
    rightImage: true,
    disabled: false,
    detailMarginRight: 11,
  };

  mixins: [React.addons.PureRenderMixin]

  state = {
    backgroundColor: optionCard.backgroundColor,
  };

  /** callback */

  onShowUnderlay() {
    this.setState({ backgroundColor: color.underlayColor });
  }

  onHideUnderlay() {
    this.setState({ backgroundColor: optionCard.backgroundColor });
  }

  /** envent response */

  onPress() {
    const { onPress } = this.props;
    if (onPress) onPress();
  }

  /** render method */

  renderLeftImage() {
    const { leftImageName } = this.props;
    if (leftImageName) {
      return <Image style={styles.leftImage} source={{ uri: leftImageName }} />;
    }
  }

  renderRightImage() {
    const { rightImage } = this.props;
    if (rightImage) {
      return <Image style={styles.image} source={{ uri: forwardImage }} />;
    }
  }

  render() {
    const { backgroundColor } = this.state;
    const { title, detailText, style, topLine, bottomLine, topLineStyle, bottomLineStyle, disabled, detailMarginRight } = this.props;
    return (
      <TouchableHighlight
        style={[style, { backgroundColor }]}
        onPress={() => this.onPress()}
        underlayColor={color.underlayColor}
        activeOpacity={1.0}
        onShowUnderlay={() => this.onShowUnderlay()}
        onHideUnderlay={() => this.onHideUnderlay()}
        disabled={disabled}
      >
        <View style={styles.container}>
          {topLine ? <Line style={topLineStyle} /> : null}
          <View style={styles.textContainer}>
            {this.renderLeftImage()}
            <Text allowFontScaling={false} style={styles.title}>{title}</Text>
            <View style={[styles.detail, { marginRight: detailMarginRight }]}>
              <Text
                allowFontScaling={false}
                style={styles.detailText}
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {detailText}
              </Text>
              {this.renderRightImage()}
            </View>
          </View>
          {bottomLine ? <Line style={bottomLineStyle} /> : null}
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: device.width,
    height: 48,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftImage: {
    marginRight: 15,
    width: 24,
    height: 24,
  },
  title: {
    backgroundColor: 'transparent',
    fontSize: optionCard.title.fontSize,
    color: optionCard.title.color,
  },
  detail: {
    flex: 1,
    marginLeft: 14,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  detailText: {
    flex: 1,
    fontSize: optionCard.detailText.fontSize,
    color: optionCard.detailText.color,
    textAlign: 'right',
  },
  image: {
    width: 20,
    height: 20,
  },
});