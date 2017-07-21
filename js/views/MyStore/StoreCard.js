import React, { Component } from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import Image from '@/common/components/CustomImage';
import EStyleSheet from 'react-native-extended-stylesheet';
import DetailInfo from './DetailInfo';

const forwardImage = 'store_forward';
const shopImage = 'shopicon';

export default class StoreCard extends Component {
  static defaultProps = {
    navigator: null,
  };

  /** event response */

  onPress() {
    const { navigator, data } = this.props;
    navigator.push({
      component: DetailInfo,
      passProps: {
        storeData: data,
      },
    });
  }

  /** render methods */

  render() {
    const { data } = this.props;
    return (
      <TouchableHighlight
        onPress={() => this.onPress()}
      >
        <View style={styles.container}>
          <View style={styles.leftContainer}>
            <Image style={styles.leftImage} source={{ uri: shopImage }} />
          </View>
          <View style={styles.textContainer}>
            <Text allowFontScaling={false} style={styles.title} numberOfLines={1}>{data.UNITNAME ? data.UNITNAME : ''}</Text>
            <Text allowFontScaling={false} style={styles.detailText} numberOfLines={1}>{`店铺地址：${data.CRNT_ADDRESS ? data.CRNT_ADDRESS : ''}`}</Text>
            <Text allowFontScaling={false} style={styles.detailText} numberOfLines={1}>{`店长：${data.TRUENAME ? data.TRUENAME : ''}`}</Text>
            <Text allowFontScaling={false} style={styles.detailText} numberOfLines={1}>{`误差范围：${data.ALLOWED_DISTANCE ? data.ALLOWED_DISTANCE : ''}`}</Text>
            <Text allowFontScaling={false} style={styles.detailText} numberOfLines={1}>{`修改原因：${data.CONTEXT ? data.CONTEXT : ''}`}</Text>
          </View>
          <View style={styles.rightContainer}>
            <Image style={styles.forwardImage} source={{ uri: forwardImage }} />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    height: 110,
    flex: 1,
    paddingLeft: 18,
    paddingRight: 12,
    flexDirection: 'row',
    backgroundColor: '$color.white',
  },
  leftContainer: {
    marginTop: 7,
  },
  leftImage: {
    width: 46,
    height: 46,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10.5,
    marginRight: 2,
    paddingTop: 4,
    '@media ios': {
      paddingTop: 8,
    },
  },
  title: {
    fontSize: 16,
    color: '#333333',
  },
  detailText: {
    marginTop: 4,
    '@media ios': {
      marginTop: 5,
    },
    fontSize: 12,
    color: '#999999',
  },
  rightContainer: {
    justifyContent: 'center',
  },
  forwardImage: {
    width: 8,
    height: 13,
  },
});