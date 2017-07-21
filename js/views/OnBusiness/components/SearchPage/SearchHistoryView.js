// 查看搜索历史 View

import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Image from '@/common/components/CustomImage';
import I18n from 'react-native-i18n';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';
import SearchHistoryPage from '../SearchHistoryPage';

// 搜索历史最大显示数量
const HISTORY_MAX_LENGTH = 5;
// Image
const searchHistoryImg = 'search';
const forwardImage = 'forward';

export default class SearchHistoryView extends Component {
  mixins: [React.addons.PureRenderMixin]

  /** event response */

  onPressBtn() {
    const { navigator, searchHistoryData } = this.props;
    let historyData = searchHistoryData.reverse();
    historyData = historyData.slice(0, HISTORY_MAX_LENGTH);
    navigator.push({
      component: SearchHistoryPage,
      passProps: { searchHistoryData: historyData },
    });
  }

  /** render method */

  render() {
    return (
      <View style={styles.rowContainer}>
        <TouchableOpacity style={styles.text} onPress={() => this.onPressBtn()}>
          <Image style={styles.searchImg} source={{ uri: searchHistoryImg }} />
          <Text allowFontScaling={false} style={styles.title} numberOfLines={1}>{I18n.t('mobile.module.onbusiness.searchhistorytitle')}</Text>
          <View style={styles.promptContainer}>
            <Image style={styles.image} source={{ uri: forwardImage }} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  flex: {
    flexGrow: 1,
  },
  rowContainer: {
    marginTop: 11,
    height: 48,
    width: device.width,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  text: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flexGrow: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#000000',
  },
  promptContainer: {
    paddingRight: 10,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchImg: {
    marginLeft: 26,
    width: 22,
    height: 22,
  },
  image: {
    width: 22,
    height: 22,
  },
});