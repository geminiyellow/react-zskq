import {
  View,
  ListView,
  TouchableOpacity,
} from 'react-native';
import React, { PureComponent } from 'react';
import I18n from 'react-native-i18n';
import { device } from '@/common/Util';
import Line from '@/common/components/Line';
import Text from '@/common/components/TextField';
import styles from './Feedback.style';

let RECOMMEND_NUMBERS = [{ number: 1, selected: false },
{ number: 2, selected: false },
{ number: 3, selected: false },
{ number: 4, selected: false },
{ number: 5, selected: false },
{ number: 6, selected: false },
{ number: 7, selected: false },
{ number: 8, selected: false },
{ number: 9, selected: false },
{ number: 10, selected: false }];

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

export default class FeedbackRecommend extends PureComponent {
  constructor(props) {
    super(props);
    RECOMMEND_NUMBERS = [{ number: 1, selected: false },
    { number: 2, selected: false },
    { number: 3, selected: false },
    { number: 4, selected: false },
    { number: 5, selected: false },
    { number: 6, selected: false },
    { number: 7, selected: false },
    { number: 8, selected: false },
    { number: 9, selected: false },
    { number: 10, selected: false }];
    this.state = {
      dataSource: ds.cloneWithRows(RECOMMEND_NUMBERS),
      recommendNum: null,
    };
  }

  handleOnPress(rowID) {
    RECOMMEND_NUMBERS.map((item) => {
      if (item.number == (parseInt(rowID) + 1)) {
        item.selected = true;
      } else {
        item.selected = false;
      }
      return null;
    });

    this.setState({
      dataSource: ds.cloneWithRows(RECOMMEND_NUMBERS),
      recommendNum: (parseInt(rowID) + 1).toString(),
    });
  }

  renderRowData(rowData, sectionID, rowID) {
    const marginRight = rowID == 9 ? 0 : (device.width - 272) / 9;
    const backgroundColor = rowData.selected ? '#1fd662' : '#dcdfe5';
    return (
      <TouchableOpacity style={[styles.textWrapper, { marginRight, backgroundColor }]} onPress={() => this.handleOnPress(rowID)}>
        <Text>{`${rowData.number}`}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View>
        <Line style={{ marginTop: 10 }} />
        <View style={styles.recommendWrapper}>
          <Text style={styles.recommendTitle}>{I18n.t('mobile.module.mine.feedback.recommend')}</Text>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData, sectionID, rowID) => this.renderRowData(rowData, sectionID, rowID)}
            horizontal
            style={styles.recommendList}
            removeClippedSubviews={false}
          />
          <View style={styles.recommendTextWrapper}>
            <Text style={styles.recommendText}>{I18n.t('mobile.module.mine.feedback.notrecomm')}</Text>
            <Text style={styles.recommendText}>{I18n.t('mobile.module.mine.feedback.willrecomm')}</Text>
          </View>
        </View>
        <Line />
      </View>
    );
  }
}