/** 带开关按钮的卡片 */

import React, { Component } from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';
import Image from '@/common/components/CustomImage';
import Line from '@/common/components/Line';
import { switchCard, color } from '@/common/Style';

const switchOn = 'new_switch_on';
const switchOff = 'new_switch_off';

export default class SwitchCard extends Component {

  static defaultProps = {
    topLine: true,
    bottomLine: false,
    switchState: false,
    showImage: true,
    height: 0,
  };

  mixins: [React.addons.PureRenderMixin]

  state = {
    backgroundColor: switchCard.backgroundColor,
  };

  /** callback */

  onShowUnderlay() {
    this.setState({ backgroundColor: color.underlayColor });
  }

  onHideUnderlay() {
    this.setState({ backgroundColor: switchCard.backgroundColor });
  }

  onLayout(layout) {
    this.setState({ height: layout.height });
  }

  /** event response */

  onPress() {
    const { onPress } = this.props;
    if (onPress) {
      onPress();
    }
  }

  /** render method */

  renderImage() {
    const { switchState, showImage } = this.props;
    if (!showImage) return;

    if (switchState) {
      return <Image style={styles.image} source={{ uri: switchOn }} />;
    }
    return <Image style={styles.image} source={{ uri: switchOff }} />;
  }

  renderDetailView() {
    const { detailText } = this.props;
    const { height } = this.state;
    if (detailText) {
      return (
        <Text
          allowFontScaling={false}
          style={[styles.detailText, { height }]}
          onLayout={(event) => this.onLayout(event.nativeEvent.layout)}
        >
          {detailText}
        </Text>
      );
    }
  }

  render() {
    const { backgroundColor } = this.state;
    const { title, topLine, bottomLine, topLineStyle, bottomLineStyle } = this.props;
    return (
      <View>
        <TouchableHighlight
          style={[styles.wrapper, { backgroundColor }]}
          onPress={() => this.onPress()}
          activeOpacity={1.0}
          underlayColor={color.underlayColor}
          onShowUnderlay={() => this.onShowUnderlay()}
          onHideUnderlay={() => this.onHideUnderlay()}
        >
          <View style={styles.container}>
            {topLine ? <Line style={topLineStyle} /> : null}
            <View style={styles.contentContainer}>
              <Text allowFontScaling={false} numberOfLines={1} style={styles.title}>{title}</Text>
              {this.renderImage()}
            </View>
            {bottomLine ? <Line style={bottomLineStyle} /> : null}
          </View>
        </TouchableHighlight>
        {this.renderDetailView()}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  wrapper: {
    width: device.width,
  },
  container: {
    height: '$switchCard.defaultHeight',
  },
  contentContainer: {
    flex: 1,
    paddingLeft: 18,
    paddingRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: switchCard.title.fontSize,
    marginRight: 11,
    color: switchCard.title.color,
  },
  detailText: {
    height: 30,
    marginTop: 5,
    marginLeft: 18,
    marginRight: 19,
    fontSize: switchCard.detail.fontSize,
    color: switchCard.detail.color,
  },
  image: {
    width: 50,
    height: 30,
  },
});