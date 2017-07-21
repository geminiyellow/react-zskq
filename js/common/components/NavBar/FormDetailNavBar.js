import React, { Component } from 'react';
import { StatusBar, Text, TouchableHighlight, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';
import Image from '@/common/components/CustomImage';
import { navBar } from '@/common/Style';
import _ from 'lodash';

const NAV_BAR_HEIGHT = 44;
const STATUS_BAR_HEIGHT = 20;
const RIGHT_BUTTON_WIDTH = 75;
const leftBack = 'back';

export default class FormDetailNavBar extends React.Component {
  static defaultProps = {
    backgroundColor: navBar.whiteBackground,
    titleColor: navBar.title.color,
    lineColor: '#ccc',
    backImage: leftBack,
    barStyle: 'default',

    leftButton: true,
    closeButton: false,
    title: null,
    rightButtonTitleColor: navBar.button.color,
  };

  constructor(...props) {
    super(...props);
    if (_.isEmpty(global.companyResponseData.color.actionBarBg) || _.isUndefined(global.companyResponseData.color.actionBarBg)) {
      if (props.hasOwnProperty('backgroundColor')) {
        acBarBg = navBar.whiteBackground;
      } else {
        acBarBg = this.props.backgroundColor;
      }
    } else {
      acBarBg = global.companyResponseData.color.actionBarBg;
    }

    this.state = {
      backgroundColor: acBarBg,
    };
  }

  /** Event response */

  onPressLeftButton() {
    const { onPressLeftButton } = this.props;
    if (onPressLeftButton) {
      onPressLeftButton();
    }
  }

  onPressRightButton() {
    const { onPressRightButton } = this.props;
    if (onPressRightButton) {
      onPressRightButton();
    }
  }

  /** Render methods */

  render() {
    const { barStyle, lineColor } = this.props;
    const { backgroundColor } = this.state;

    return (
      <View style={[styles.container, { borderColor: lineColor }]}>
        <StatusBar barStyle={barStyle} />
        {this.renderStatusBar()}
        <View style={[styles.navBar, { backgroundColor: backgroundColor }]}>
          {this.renderLeftButton()}
          {this.renderTitle()}
          {this.renderRightButton()}
        </View>
      </View>
    );
  }

  renderStatusBar() {
    const { backgroundColor } = this.props;

    if (device.isIos) {
      return <View style={[styles.statusBar, { backgroundColor }]} />;
    }
  }

  renderTitle() {
    const { title, titleImage, titleColor } = this.props;
    let disabled = true;

    if (titleImage) {
      disabled = false;
    }

    return (
      <TouchableHighlight
        style={styles.titleContainer}
        activeOpacity={0.5}
        underlayColor="transparent"
        disabled={disabled}
      >
        <View style={styles.title}>
          <Text allowFontScaling={false} numberOfLines={1} style={[styles.titleText, { color: titleColor }]}>{title}</Text>
          {!titleImage ? null : <Image style={styles.titleImage} source={titleImage} />}
        </View>
      </TouchableHighlight>
    );
  }

  renderLeftButton() {
    const { leftButton, backImage } = this.props;

    if (!leftButton) {
      return;
    }

    return (
      <TouchableHighlight
        style={styles.leftButton}
        onPress={() => this.onPressLeftButton()}
        activeOpacity={0.5}
        underlayColor="transparent"
      >
        <View style={styles.button}>
          <Image style={styles.backImage} source={{ uri: backImage }} />
        </View>
      </TouchableHighlight>
    );
  }

  renderRightButton() {
    const { rightButtonTitle, rightButtonTitleColor } = this.props;

    let disabled = false;
    if (!rightButtonTitle) disabled = true;

    return (
      <TouchableHighlight
        style={styles.rightContainerRightButton}
        activeOpacity={0.5}
        underlayColor="transparent"
        onPress={() => this.onPressRightButton()}
        disabled={disabled}
      >
        <View style={styles.rightButton}>
          <Text
            allowFontScaling={false}
            style={[styles.buttonText, { color: rightButtonTitleColor }]}
            numberOfLines={1}>
            {rightButtonTitle}</Text>
        </View>
      </TouchableHighlight>
    );
  }

}

const styles = EStyleSheet.create({
  container: {
    borderBottomWidth: device.hairlineWidth,
  },
  statusBar: {
    width: device.width,
    height: STATUS_BAR_HEIGHT,
  },
  navBar: {
    width: device.width,
    height: NAV_BAR_HEIGHT,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  leftButton: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    paddingLeft: 18,
    width: RIGHT_BUTTON_WIDTH,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  backImage: {
    width: 13,
    height: 22,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 9,
  },
  title: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: '$navBar.title.fontSize',
    fontWeight: '$navBar.title.fontWeight',
    textAlign: 'right',
    '@media android': {
      flex: 1,
      textAlign: 'center',
    },
  },
  titleImage: {
    width: 22,
    height: 22,
  },
  rightContainerRightButton: {
    paddingRight: 12,
    width: RIGHT_BUTTON_WIDTH,
  },
  rightButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  buttonText: {
    fontSize: '$navBar.button.fontSize',
  },
});