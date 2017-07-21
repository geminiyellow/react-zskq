import React, { Component } from 'react';
import {
  requireNativeComponent,
} from 'react-native';

const BDMapView = requireNativeComponent('RCTBaiduMapView', BaiduMapView);

export default class BaiduMapView extends Component {
  mixins: [React.addons.PureRenderMixin]
  render() {
    return <BDMapView {...this.props} />;
  }
}
