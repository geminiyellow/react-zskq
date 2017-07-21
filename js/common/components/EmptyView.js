/**
 * 空白布局
 */

import React, { PureComponent } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import _ from 'lodash';
import Line from '@/common/components/Line';
import Image from '@/common/components/CustomImage';
import EStyleSheet from 'react-native-extended-stylesheet';
import { refreshStyle } from '@/common/Style';
import { device } from '../../common/Util';

let nodata = 'nodata';

const styles = EStyleSheet.create({
  noDataWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: device.width,
    paddingLeft: 10,
    paddingRight: 10,
  },
  nodataTitle: {
    fontSize: 21,
    color: '#000000',
    marginTop: 40,
    textAlign: 'center',
  },
  nodataSubTitle: {
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default class EmptyView extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      title: '',
      content: '',
      emptyImg: nodata,
      refreshEnabled: true,
    };
  }

  componentWillMount() {
    const { emptyTitle, emptyContent, emptyimg, enabled } = this.props;
    if (!_.isUndefined(enabled)) {
      this.setState({
        refreshEnabled: enabled,
      });
    }
    if (!_.isEmpty(emptyTitle)) {
      this.setState({
        title: emptyTitle,
      });
    }
    if (!_.isEmpty(emptyContent)) {
      this.setState({
        content: emptyContent,
      });
    }
    this.setState({
      emptyImg: emptyimg,
    });
  }

  onRefresh = () => {
    const { onRefreshing } = this.props;
    if (onRefreshing) {
      onRefreshing();
    }
  }

  render() {
    const { style, line } = this.props;
    return (
      <ScrollView
        style={style}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={this.onRefresh}
            progressBackgroundColor={refreshStyle.progressBackgroundColor}
            colors={refreshStyle.colors}
            tintColor={refreshStyle.tintColor}
            enabled={this.state.refreshEnabled}
          />
        }>
        { line ? <Line /> : null}
        <View style={{ flex: 1 }}>
          <View style={styles.noDataWrapper}>
            <Image resizeMode={Image.resizeMode.cover} style={{ width: 80, height: 80, marginTop: device.height / 5 }} source={{ uri: this.state.emptyImg }} />
            <Text allowFontScaling={false} style={styles.nodataTitle}>{this.state.title}</Text>
            <Text allowFontScaling={false} style={styles.nodataSubTitle}>{this.state.content}</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

}