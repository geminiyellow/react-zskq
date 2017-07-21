/**
 * 详细行程
 */

import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import TextArea from '@/common/components/TextArea';

export default class DetailedItineraryView extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
  }

  /** callback */

  onChangeTextEvent(text) {
    this.setState({ value: text });
  }

  /** render view */

  render() {
    const { value } = this.state;
    return (
      <TextArea
        title={I18n.t('mobile.module.onbusiness.detaileditinerarytitle')}
        placeholder={I18n.t('mobile.module.onbusiness.detailitineraryplaceholdertext')}
        value={value}
        onChange={(text) => this.onChangeTextEvent(text)}
        onSubmitEditing={(text) => this.onChangeTextEvent(text)}
        onEndEditing={(text) => this.onChangeTextEvent(text)}
      />
    );
  }
}