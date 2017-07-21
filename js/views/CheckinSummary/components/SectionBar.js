import React from 'react';
import { Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';

export default class SectionBar extends React.Component {
  render() {
    const { title1, title2, title3 } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.title1}>
          <Text
            style={[styles.font, styles.font1]}
            numberOfLines={1}
            allowFontScaling={false}
          >{title1}</Text>
        </View>
        <View style={styles.title2}>
          <Text
            style={[styles.font, styles.font2]}
            numberOfLines={1}
            allowFontScaling={false}
          >{title2}</Text>
        </View>
        <View style={styles.title3}>
          <Text
            style={[styles.font, styles.font3]}
            numberOfLines={1}
            allowFontScaling={false}
          >{title3}</Text>
        </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 34,
    width: device.width,
    alignItems: 'center',
    backgroundColor: '#cccccc',
  },
  font: {
    fontSize: 14,
    color: '#333333',
    fontWeight: 'bold',
  },
  title1: {
    flex: 1,
  },
  title2: {
    flex: 1,
  },
  title3: {
    flex: 1,
  },
  font1: {
    marginLeft: 18,
  },
  font2: {
    textAlign: 'center',
  },
  font3: {
    textAlign: 'right',
    marginRight: 18,
  },
});