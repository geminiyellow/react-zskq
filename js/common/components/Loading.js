import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import { device } from '../Util';
import Image from '@/common/components/CustomImage';

export default class Loading extends Component {
  mixins: [React.addons.PureRenderMixin]
  constructor(props) {
    super(props);

    const { loadingText } = this.props;
    this.state = {
      loadingText: loadingText || I18n.t('mobile.module.home.functions.loading'),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      loadingText: nextProps.loadingText || I18n.t('mobile.module.home.functions.loading'),
    });
  }

  renderIcon() {
    const { loadingIcon } = this.props;
    if (loadingIcon) {
      return (
        <Image style={styles.loadingIcon} source={{ uri: loadingIcon }} />
      );
    }
    return null;
  }

  render() {
    const { style } = this.props;
    return (
      <View style={[styles.container, style]}>
        {this.renderIcon()}
        <Text allowFontScaling={false} style={styles.loadingText}>
          {this.state.loadingText}
        </Text>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flexGrow: 1,
    width: device.width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '$loading.backgroundColor',
  },
  loadingText: {
    color: '$loading.textColor',
    fontSize: '$loading.textSize',
    marginTop: 10,
  },
  loadingIcon: {
    width: 40,
    height: 40,
  },
});