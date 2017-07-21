/** 项目代码 */

import React, { Component } from 'react';
import { Animated } from 'react-native';
import I18n from 'react-native-i18n';
import EStyleSheet from 'react-native-extended-stylesheet';
import OptionCard from '@/common/components/OptionCard';
import { device } from '@/common/Util';
import { space } from '../Style';

export default class ProjectCode extends Component {

  state = {
    height: new Animated.Value(0),
  };

  /** life cycle */

  componentDidMount() {
    Animated.timing(
      this.state.height,
      { toValue: 48 },
    ).start();
  }

  /** event response */

  onPress() {
    this.props.onPressBtn();
  }

  /** render view */

  render() {
    const { height } = this.state;
    const { value } = this.props;
    return (
      <Animated.View style={[styles.container, { height }]}>
        <OptionCard
          title={I18n.t('mobile.module.onbusiness.projectcode')}
          detailText={value === '' ? I18n.t('mobile.module.onbusiness.expensetypevalue') : value}
          onPress={() => this.onPress()}
          bottomLine
        />
      </Animated.View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: device.width,
    marginTop: space.rowVerticalSpace,
  },
});