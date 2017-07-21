/**  出差目的 */

import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import TextArea from '@/common/components/TextArea';

export default class TravelReasonView extends Component {

  state = {
    value: '',
  };

  /** callback */

  onChangeText(text) {
    this.setState({ value: text });
  }

  /** render view */

  render() {
    const { value } = this.state;
    return (
      <TextArea
        title={I18n.t('mobile.module.onbusiness.travelreasontitletext')}
        placeholder={I18n.t('mobile.module.onbusiness.travelreasonplaceholdertext')}
        value={value}
        onChange={(text) => this.onChangeText(text)}
        onSubmitEditing={(text) => this.onChangeText(text)}
        onEndEditing={(text) => this.onChangeText(text)}
      />
    );
  }
}