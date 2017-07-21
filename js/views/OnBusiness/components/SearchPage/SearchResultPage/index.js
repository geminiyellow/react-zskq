// 搜索结果页面
import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import EmptyView from '@/common/components/EmptyView';
import I18n from 'react-native-i18n';
import EStyleSheet from 'react-native-extended-stylesheet';
import RecommendCodeView from './RecommendCodeView';
import SearchResultView from './SearchResultView';

const emptyImg = 'empty';

export default class SearchPage extends Component {

  render() {
    const { filteredArray, navigator, projectCodeArray } = this.props;
    const sectionTitle = filteredArray.length < 1 ? I18n.t('mobile.module.onbusiness.searchresulttitleF') : I18n.t('mobile.module.onbusiness.searchresulttitleS');
    return (
      <ScrollView style={styles.container}>
        {filteredArray.length < 1 ? <EmptyView emptyimg={emptyImg} emptyTitle={I18n.t('mobile.module.onbusiness.resultemptytitle')} emptyContent={I18n.t('mobile.module.onbusiness.resultemptydetailtext')} /> :
        <SearchResultView filteredArray={filteredArray} navigator={navigator} />}
        <RecommendCodeView sectionTitle={sectionTitle} navigator={navigator} projectCodeArray={projectCodeArray} />
      </ScrollView>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flexGrow: 1,
  },
});