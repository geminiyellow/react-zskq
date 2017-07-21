import React, { Component } from 'react';
import Image from '@/common/components/CustomImage';
import _ from 'lodash';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class NavBarLeftQuit extends Component {
  mixins: [React.addons.PureRenderMixin]
  render() {
    const { leftImg } = this.props;
    if (_.isString(leftImg)) {
      return (
        <Image style={styles.leftImg} source={{ uri: leftImg }} />
      );
    }
    return (
      <Image style={styles.leftImg} source={leftImg} />
    );
  }
}

const styles = EStyleSheet.create({
  leftImg: {
    marginLeft: 18,
    width: 13,
    height: 22,
  },
});

