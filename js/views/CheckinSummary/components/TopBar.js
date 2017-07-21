import React from 'react';
import { Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';

export default class TopBar extends React.Component {
  render() {
    const { day } = this.props;

    return (
      <View style={styles.container}>
        <Text
          style={styles.font}
          allowFontScaling={false}
        >本考勤周期应考勤</Text>
        <Text
          style={styles.dayFont}
          allowFontScaling={false}
        >{day}</Text>
        <Text
          style={styles.font}
          allowFontScaling={false}
        >天</Text>
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
    marginHorizontal: 18,
  },
  font: {
    fontSize: 14,
    color: '#000000',
  },
  dayFont: {
    fontSize: 14,
    color: '#14BE4B',
    '@media ios': {
      fontWeight: '500',
    },
  }
});