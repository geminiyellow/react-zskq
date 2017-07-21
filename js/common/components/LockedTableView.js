import React, {
  Component,
  PropTypes,
  View
} from 'react';
import {
  Dimensions,
  requireNativeComponent,
} from 'react-native';

import { device } from '@/common/Util';

const FixTableView = device.isIos ? requireNativeComponent('RNFormView', LockedTableView) : requireNativeComponent('RCTTableView', LockedTableView);

export default class LockedTableView extends React.Component {

  static defaultProps = {
    tableHeadData: '',
    tableData: '',
    tableInfo: '',
  }

  static propTypes = {
    tableHeadData: PropTypes.string,
    tableData: PropTypes.string,
    tableInfo: PropTypes.object,
  }

  render() {
    return (
      <FixTableView
        {...this.props}
        style={{
          flex: 1,
        }} />
    );
  }
}