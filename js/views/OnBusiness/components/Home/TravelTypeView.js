/** 出差类型 */

import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import OptionCard from '@/common/components/OptionCard';
import EStyleSheet from 'react-native-extended-stylesheet';
import { TRAVEL_TYPE } from './constants.js';

export default class TravelTypeView extends Component {

  /** event response */

  onPress() {
    const { data, value, selectTravelType, showOptionPicker } = this.props;
    if (data.length < 1) return;
    const params = {
      data,
      value,
      type: TRAVEL_TYPE,
    };
    // selectTravelType(params);

    if (showOptionPicker) {
      showOptionPicker(params);
    }
  }

  /** render method */

  render() {
    const { value } = this.props;
    return (
      <OptionCard
        style={styles.container}
        title={I18n.t('mobile.module.onbusiness.traveltypetitletext')}
        detailText={value}
        onPress={() => this.onPress()}
        bottomLine
      />
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    marginTop: '$margin',
  },
});