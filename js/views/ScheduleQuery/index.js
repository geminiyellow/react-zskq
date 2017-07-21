import React, { Component } from 'react';

import ScheduleListUi from './../Schedule/ScheduleListUi';

export default class ScheduleQuery extends Component {
  mixins: [React.addons.PureRenderMixin]
  render() {
    return (
      <ScheduleListUi navigator={this.props.navigator} />
    );
  }
}
