/** 目的地 */

import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import InputCard from '@/common/components/InputCard';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class DestinationView extends Component {

  state = {
    value: '',
  };

  /** callback */

  onChangeText(text) {
    this.setState({ value: text });
  }

  /** render view */

  render() {
    return (
      <InputCard
        style={styles.container}
        title={I18n.t('mobile.module.onbusiness.destinationtitle')}
        placeholder={I18n.t('mobile.module.onbusiness.destinationplaceholdertext')}
        bottomLine
        onChangeText={(text) => this.onChangeText(text)}
      />
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    marginTop: '$margin',
  },
});
