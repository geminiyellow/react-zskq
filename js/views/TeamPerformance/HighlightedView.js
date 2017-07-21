import React from 'react';
import { Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';
import Line from '@/common/components/Line';
import { thousandBitSeparator } from '@/common/Functions';

export default class HighlightedView extends React.Component {
  static defaultProps = {
    xValue: '',
    completedValue: '0',
    targetValue: '0',
    // 完成值Name
    completedName: '',
    // 目标值Name
    targetName: '',
  };

  render() {
    const { dateTime, completedValue, targetValue, xValue, completedName, targetName } = this.props;
    const formatCompleteValue = thousandBitSeparator(`${completedValue}`);
    const formatTargetValue = thousandBitSeparator(`${targetValue}`);
    return (
      <View style={styles.container}>
        <View style={styles.dateView}>
          <View style={styles.hintView}/>
          <Text
            allowFontScaling={false}
            style={styles.dateText}>{xValue}</Text>
        </View>
        <Line/>
        <View style={styles.amountView}>
          <View style={styles.completeView}>
            <Text
              allowFontScaling={false}
              style={styles.completeAmountText}>{formatCompleteValue}</Text>
            <Text
              allowFontScaling={false}
              style={styles.title}>{completedName}</Text>
          </View>
          <View style={styles.partingLine}/>
          <View style={styles.targetView}>
            <Text
              allowFontScaling={false}
              style={styles.targetAmountText}>{formatTargetValue}</Text>
            <Text
              allowFontScaling={false}
              style={styles.title}>{targetName}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    flex: 1,
    height: 132,
    backgroundColor: 'white',
  },
  dateView: {
    flexDirection: 'row',
    width: device.width,
    height: 48,
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 12,
    fontSize: 18,
    color: '#333333',
  },
  amountView: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  completeView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeAmountText: {
    fontSize: 20,
    color: '#14BE4B',
  },
  targetAmountText: {
    fontSize: 20,
    color: '#139CF5',
  },
  title: {
    marginTop: 10,
    fontSize: 13,
    color: '#999999',
  },
  partingLine: {
    width: device.hairlineWidth,
    height: 43,
    backgroundColor: '#CCCCCC',
  },
  hintView: {
    width: 4,
    height: 28,
    backgroundColor: '#14BE4B',
  },
});