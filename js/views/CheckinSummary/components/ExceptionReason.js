
import React, { PureComponent } from 'react';
import I18n from 'react-native-i18n';
import TextArea from '@/common/components/TextArea';

export default class ExceptionReason extends PureComponent {

  constructor(props) {
    super(props);
    this.state = { reasonDetails: '' };
  }

  onChangeTextEvent(text) {
    this.setState({ reasonDetails: text });
  }

  render() {
    const { reasonDetails } = this.state;
    return (
      <TextArea
        bottomLine={false}
        title={I18n.t('mobile.module.overtime.detailstitle')}
        placeholder={I18n.t('mobile.module.exception.inputreason')}
        maxLength={40}
        value={reasonDetails}
        onChange={(text) => this.onChangeTextEvent(text)}
        onSubmitEditing={(text) => this.onChangeTextEvent(text)}
        onEndEditing={(text) => this.onChangeTextEvent(text)} />
    );
  }
}