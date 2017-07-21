
import React, { PureComponent } from 'react';
import I18n from 'react-native-i18n';
import TextArea from '@/common/components/TextArea';

export default class FeedbackContent extends PureComponent {

  constructor(props) {
    super(props);
    this.state = { feedbackContent: null };
  }

  onChangeTextEvent(text) {
    this.setState({ feedbackContent: text });
  }

  render() {
    const { feedbackContent } = this.state;
    return (
      <TextArea
        placeholder={I18n.t('mobile.module.mine.feedback.content')}
        value={feedbackContent}
        onChange={(text) => this.onChangeTextEvent(text)}
        onSubmitEditing={(text) => this.onChangeTextEvent(text)}
        onEndEditing={(text) => this.onChangeTextEvent(text)} />
    );
  }
}