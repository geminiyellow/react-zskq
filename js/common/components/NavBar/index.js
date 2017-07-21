import React, { Component } from 'react';
import { StatusBar, Text, TouchableHighlight, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';
import Image from '@/common/components/CustomImage';
import { navBar } from '@/common/Style';
import _ from 'lodash';

const NAV_BAR_HEIGHT = 44;
const STATUS_BAR_HEIGHT = 20;
const leftBack = 'back';
const closeImage = 'close';

let acBarBg = '';

export default class NavBar extends Component {
  static defaultProps = {
    backgroundColor: navBar.whiteBackground,
    titleColor: navBar.title.color,
    lineColor: '#ccc',
    backImage: leftBack,
    barStyle: 'default',

    leftButton: true,
    closeButton: false,
    title: null,
    // 44 x 44 px @2x
    titleImage: null,
    // 50 x 50 px
    rightContainerLeftImage: null,
    rightContainerLeftButtonTitle: null,
    rightContainerLeftButtonTitleColor: navBar.button.color,
    // 50 x 50 px
    rightContainerRightImage: null,

    onPressLeftButton: null,
    onPressCloseButton: null,
    onPressTitle: null,
    onPressRightContainerLeftButton: null,
    onPressRightContainerRightButton: null,
  };

  constructor(...props) {
    super(...props);
    if (!_.isEmpty(global.companyResponseData) && !_.isUndefined(global.companyResponseData)) {
      if (_.isEmpty(global.companyResponseData.color.actionBarBg) || _.isUndefined(global.companyResponseData.color.actionBarBg)) {
        if (props.hasOwnProperty('backgroundColor')) {
          acBarBg = navBar.whiteBackground;
        } else {
          acBarBg = this.props.backgroundColor;
        }
      } else {
        acBarBg = global.companyResponseData.color.actionBarBg;
      }
    } else {
      if (props.hasOwnProperty('backgroundColor')) {
        acBarBg = navBar.whiteBackground;
      } else {
        acBarBg = this.props.backgroundColor;
      }
    }

    this.state = {
      backgroundColor: acBarBg,
    };
  }

  state = {
    leftWidthMoreThanRight: true,
    leftContainerWidth: null,
    rightContainerWidth: null,
  };

  /** callback */

  onLeftContainerViewLayout(layout) {
    if (this.leftButtonCountMoreThanRight()) {
      this.setState({ rightContainerWidth: layout.width });
    }
  }

  onRightContainerViewLayout(layout) {
    if (!this.leftButtonCountMoreThanRight()) {
      this.setState({ leftContainerWidth: layout.width });
    }
  }

  /** event response */

  onPressLeftButton() {
    const { onPressLeftButton } = this.props;
    if (onPressLeftButton) {
      onPressLeftButton();
    }
  }

  onPressTitle() {
    const { onPressTitle } = this.props;
    if (onPressTitle) {
      onPressTitle();
    }
  }

  onPressCloseButton() {
    const { onPressCloseButton } = this.props;
    if (onPressCloseButton) {
      onPressCloseButton();
    }
  }

  onPressRightContainerLeftButton() {
    const { onPressRightContainerLeftButton } = this.props;
    if (onPressRightContainerLeftButton) {
      onPressRightContainerLeftButton();
    }
  }

  onPressRightContainerRightButton() {
    const { onPressRightContainerRightButton } = this.props;
    if (onPressRightContainerRightButton) {
      onPressRightContainerRightButton();
    }
  }

  /** private methods */

  leftButtonCountMoreThanRight() {
    const { leftButton, closeButton, rightContainerLeftImage, rightContainerLeftButtonTitle, rightContainerRightImage } = this.props;
    let leftButtonCount = 0;
    let rightButtonCount = 0;
    if (leftButton) leftButtonCount += 1;
    if (closeButton) leftButtonCount += 1;
    if (rightContainerLeftImage || rightContainerLeftButtonTitle) rightButtonCount += 1;
    if (rightContainerRightImage) rightButtonCount += 1;
    if (leftButtonCount > rightButtonCount) {
      return true;
    }
    return false;
  }

  /** render methods */

  renderStatusBar() {
    const { backgroundColor } = this.props;
    if (device.isIos) {
      return <View style={[styles.statusBar, { backgroundColor }]} />;
    }
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

  renderCloseButton() {
    const { closeButton } = this.props;
    if (!closeButton) {
      return;
    }

    return (
      <TouchableHighlight
        style={styles.closeButtonContainer}
        activeOpacity={0.5}
        underlayColor="transparent"
        onPress={() => this.onPressCloseButton()}
      >
        <View style={styles.closeButton}>
          <Image style={styles.closeImage} source={{ uri: closeImage }} />
        </View>
      </TouchableHighlight>
    );
  }

  renderRightContainerLeftButton() {
    const { rightContainerLeftImage, rightContainerLeftButtonTitle, rightContainerLeftButtonTitleColor } = this.props;
    if (!rightContainerLeftImage && !rightContainerLeftButtonTitle) {
      return;
    }

    return (
      <TouchableHighlight
        style={styles.rightContainerLeftButton}
        activeOpacity={0.5}
        underlayColor="transparent"
        onPress={() => this.onPressRightContainerLeftButton()}
      >
        <View style={styles.rightButton}>
          {!rightContainerLeftImage ? null : <Image style={styles.rightButtonImage} source={rightContainerLeftImage} />}
          {!rightContainerLeftButtonTitle ? null : <Text allowFontScaling={false} style={[styles.buttonText, { color: rightContainerLeftButtonTitleColor }]} numberOfLines={1}>{rightContainerLeftButtonTitle}</Text>}
        </View>
      </TouchableHighlight>
    );
  }

  renderRightContainerRightButton() {
    const { rightContainerRightImage } = this.props;
    if (!rightContainerRightImage) {
      return;
    }

    return (
      <TouchableHighlight
        style={styles.rightContainerRightButton}
        activeOpacity={0.5}
        underlayColor="transparent"
        onPress={() => this.onPressRightContainerRightButton()}
      >
        <View style={styles.rightButton}>
          {!rightContainerRightImage ? null : <Image style={styles.rightButtonImage} source={rightContainerRightImage} />}
        </View>
      </TouchableHighlight>
    );
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
        onPress={() => this.onPressTitle()}
      >
        <View style={styles.title}>
          <Text allowFontScaling={false} numberOfLines={1} style={[styles.titleText, { color: titleColor }]}>{title}</Text>
          {!titleImage ? null : <Image style={styles.titleImage} source={titleImage} />}
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    const { leftContainerWidth, rightContainerWidth, backgroundColor } = this.state;
    const { lineColor, barStyle } = this.props;
    return (
      <View style={[styles.container, { borderColor: lineColor }]}>
        <StatusBar barStyle={barStyle} />
        {this.renderStatusBar()}
        <View style={[styles.navBar, { backgroundColor: backgroundColor }]}>
          <View style={[styles.leftContainer, { width: leftContainerWidth }]} onLayout={event => this.onLeftContainerViewLayout(event.nativeEvent.layout)}>
            {this.renderLeftButton()}
            {this.renderCloseButton()}
          </View>
          {this.renderTitle()}
          <View style={[styles.rightContainer, { width: rightContainerWidth }]} onLayout={event => this.onRightContainerViewLayout(event.nativeEvent.layout)}>
            {this.renderRightContainerLeftButton()}
            {this.renderRightContainerRightButton()}
          </View>
        </View>
      </View>
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
  },
  leftContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  leftButton: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    paddingLeft: 18,
    paddingRight: 12,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  closeButtonContainer: {
    justifyContent: 'center',
    paddingLeft: 9,
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 12,
    height: 7,
  },
  backImage: {
    width: 13,
    height: 22,
  },
  closeImage: {
    width: 22,
    height: 22,
  },
  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  rightContainerLeftButton: {
    paddingRight: 12,
    justifyContent: 'center',
  },
  rightButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: '$navBar.button.fontSize',
  },
  rightContainerRightButton: {
    paddingRight: 12,
  },
  rightButtonImage: {
    width: 25,
    height: 25,
  },
});