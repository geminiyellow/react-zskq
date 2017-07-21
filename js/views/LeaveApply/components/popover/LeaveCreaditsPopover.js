import React, { PureComponent } from 'react';
import {
  Text,
  View,
} from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';

import { device } from '@/common/Util';
import I18n from 'react-native-i18n';
import Popover from 'react-native-popover';

export default class LeaveCreaditsPopover extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }

  showPopover(px, py, width, height) {
    this.setState({
      isVisible: true,
      buttonRect: { x: px, y: py, width, height },
    });
  }

  closePopover() {
    this.setState({ isVisible: false });
  }

  render() {
    const { isVisible, buttonRect } = this.state;
    const displayArea = { x: 5, y: 20, width: device.width - 10, height: device.height - 25 };
    return (
      <Popover
        isVisible={isVisible}
        fromRect={buttonRect}
        displayArea={displayArea}
        onClose={() => this.closePopover()}>
        <View style={styles.popoverContent}>
          <Text style={styles.popoverText}>{I18n.t('mobile.module.leaveapply.leavecreaditsdesc')}</Text>
        </View>
      </Popover>
    );
  }
}

const styles = EStyleSheet.create({
  popoverContent: {
    width: 200,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
  },
  popoverText: {
    color: '#ffffff',
    fontSize: 14,
  },
});
