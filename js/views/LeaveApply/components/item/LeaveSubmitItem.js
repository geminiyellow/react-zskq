import React, { PureComponent } from 'react';

import SubmitButton from '@/common/components/SubmitButton';

export default class LeaveSubmit extends PureComponent {

  render() {
    return (
      <SubmitButton
        onPressBtn={() => {
          const { onSubmitLeaveForm } = this.props;
          onSubmitLeaveForm();
        }} />
    );
  }
}