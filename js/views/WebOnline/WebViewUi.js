/**
 * 打开在线网页WebView
 */

import React, { Component } from 'react';
import {
  View,
  WebView,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import _ from 'lodash';
import { device } from '@/common/Util';
const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
  },
  webView: {
    flex: 1,
  },
});

export default class WebViewUi extends Component {
  mixins: [React.addons.PureRenderMixin]
  render() {
    const { url } = this.props;
    return (
      <View style={styles.container}>
        <WebView
          ref={wb => this.webView = wb}
          automaticallyAdjustContentInsets={false}
          style={styles.webView}
          source={{ uri: url }}
          javaScriptEnabled
          domStorageEnabled
          decelerationRate="normal"
          onNavigationStateChange={this.onNavigationStateChange}
          onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
          startInLoadingState
          scalesPageToFit
            />
      </View>
    );
  }
}