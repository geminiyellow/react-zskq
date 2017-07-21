/**
 * Flatlist
 */
import React, { Component } from 'react';
import { RefreshControl, FlatList, Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import Line from '@/common/components/Line';
import EmptyView from '@/common/components/EmptyView';
import { device } from '@/common/Util';

const VIEWABILITY_CONFIG = {
  minimumViewTime: 3000,
  viewAreaCoveragePercentThreshold: 100,
  waitForInteraction: true,
};

export default class FlatListView extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      // 列表数据总数
      total: -1,
      datas: [],
      virtualized: true,
      refreash: true,
      horizontal: false,
      // 空白布局是否可用
      disableemptyview: false,
      // 下拉刷新是否可用
      disablerefresh: false,
      // 是否需要分页
      needpage: false,
      loadmore: false,
      emptytitle: '',
      emptysubtitle: '',
    };
  }

  componentWillMount() {
    let { disableEmptyView, needPage, emptyIcon, emptyTitle, emptySubTitle, disableRefresh, ishorizontal, lineHeight } = this.props;
    this.setState({
      needpage: needPage,
      disableemptyview: disableEmptyView,
      disablerefresh: disableRefresh,
      emptyicon: emptyIcon,
      emptytitle: emptyTitle,
      emptysubtitle: emptySubTitle,
      horizontal: ishorizontal ? ishorizontal : false,
      lineheight: lineHeight ? lineHeight : device.width / 5,
    });
  }
  /**
   * 刷新listview
   * data： 数据集合
   * totalCount：记录总数
   * onrefreshing true: 下拉刷新； false：加载更多 
   */
  notifyList(data, totalCount, onrefreshing) {
    if (onrefreshing) {
      this.setState({
        refreash: false,
        loadmore: false,
        datas: [].concat(data),
        total: totalCount,
      });

    } else {
      this.setState({
        refreash: false,
        loadmore: false,
        datas: this.state.datas.concat(data),
        total: totalCount,
      });
    }

  }

  /**
   * Scrolls to the item at a the specified index such that it is positioned in the viewable area such 
   * that viewPosition 0 places it at the top, 1 at the bottom, and 0.5 centered in the middle.
   */
  scrollToIndex = (indexNumber) => {
    if (!this.state.needpage && this.state.datas.length > 0)
      this.listView.scrollToIndex({ viewPosition: 0.5, index: indexNumber });
  }

  /**
   * 显示加载中
   */
  loading = () => {
    this.setState({
      refreash: true,
      total: -1,
      datas: [],
    });
  }

  _onRefresh = () => {
    let { onRefreshCallback } = this.props;
    if (onRefreshCallback) {
      this.setState({
        refreash: true,
      });
      onRefreshCallback();
    }
  }

  _onLoadMore = () => {
    let { onEndReachedCallback } = this.props;
    if (this.state.needpage == false) return;
    if (this.state.total > this.state.datas.length) {
      this.setState({
        loadmore: true,
      });
      if (onEndReachedCallback)
        onEndReachedCallback();
    }
  }

  _inflatItem = (info) => {
    let { inflatItemView } = this.props;
    const view = inflatItemView(info.item, info.index);
    return view;
  }

  getRefreshView = () => {
    if (this.state.disablerefresh) {
      return null;
    }
    return (
      <RefreshControl
        refreshing={this.state.refreash}
        onRefresh={this._onRefresh}
        enabled
        progressBackgroundColor={'#14BE4B'}
        colors={['white']}
        tintColor={'#14BE4B'}
      />
    );
  }

  render() {
    let { disableEmptyView, inflatItemView } = this.props;
    // 空白布局不可用
    if (this.state.disableemptyview) {
      return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <FlatList
            data={this.state.datas}
            disableVirtualization={!this.state.virtualized}
            horizontal={this.state.horizontal}
            keyExtractor={(item, index) => {
              return index;
            }}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
            legacyImplementation={this.state.needpage}
            getItemLayout={this.state.horizontal ? (data, index) => ({ length: this.state.lineheight, offset: this.state.lineheight * index, index }) : null}
            numColumns={1}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            onEndReached={this._onLoadMore}
            refreshControl={this.getRefreshView()}
            ref={listview => this.listView = listview}
            renderItem={(item, index) => this._inflatItem(item, index)}
            viewabilityConfig={VIEWABILITY_CONFIG}
          />
          {
            (this.state.needpage && this.state.loadmore) ?
              <View style={{ height: 40, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ textAlign: 'center', fontSize: 18, color: 'gray' }}>{I18n.t('mobile.module.myform.loading')}</Text>
              </View> : null
          }
        </View>
      );
    } else {
      // 可以使用空白布局
      if (this.state.total != 0) {
        return (
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <FlatList
              data={this.state.datas}
              disableVirtualization={this.state.virtualized}
              horizontal={this.state.horizontal}
              keyExtractor={(item, index) => {
                return index;
              }}
              ListFooterComponent={null}
              ListHeaderComponent={null}
              ItemSeparatorComponent={null}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              onEndReachedThreshold={10}
              keyboardShouldPersistTaps="always"
              keyboardDismissMode="on-drag"
              legacyImplementation={this.state.needpage}
              numColumns={1}
              onEndReached={this._onLoadMore}
              refreshControl={this.getRefreshView()}
              ref={listview => this.listView = listview}
              renderItem={(item, index) => this._inflatItem(item, index)}
              viewabilityConfig={VIEWABILITY_CONFIG}
            />
            {
              (this.state.needpage && this.state.loadmore) ?
                <View style={{ height: 40, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ textAlign: 'center', fontSize: 18, color: 'gray' }}>{I18n.t('mobile.module.myform.loading')}</Text>
                </View> : null
            }
          </View>
        );
      } else {
        return (
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <EmptyView onRefreshing={this._onRefresh} emptyimg={this.state.emptyicon} emptyTitle={this.state.emptytitle} emptyContent={this.state.emptysubtitle} />
          </View>
        );
      }
    }
  }
}