// 申请金额

import React, { Component } from 'react';
import { DeviceEventEmitter, Text, TouchableHighlight, View } from 'react-native';
import { event, device } from '@/common/Util';
import I18n from 'react-native-i18n';
import Input from '@/common/components/Input';
import CustomImage from '@/common/components/CustomImage';
import EStyleSheet from 'react-native-extended-stylesheet';
import { CURRENCY } from '../constants.js';
import { font, color } from '../../Style';

const travel_down_img = 'travel_down';

export default class ApplicationAmount extends Component {

  constructor(props) {
    super(props);
    this.state = { value: '' };
  }

  /** life cycle */

  componentWillReceiveProps(nextProps) {
    const { rowData } = nextProps;
    const { value } = this.state;
    if (rowData.CostAmount.toString() === value) return;
    if (rowData.CostAmount == 0) return;
    this.setState({ value: rowData.CostAmount.toFixed(2) });
  }

  /** callback */

  onChangeTextEvent(text) {
    const { rowID } = this.props;
    let amount = parseFloat(text);
    if (text === '' || isNaN(amount)) {
      amount = 0;
      this.setState({ value: '' });
    } else {
      this.setState({ value: amount.toFixed(2) });
    }
    const params = { amount, rowID };
    DeviceEventEmitter.emit(event.OB_SET_AMOUNT, params);
  }

  /** response event */

  onPressCurrencyBtn() {
    const { rowID, currencyData, rowData } = this.props;
    const params = {
      pickerData: currencyData,
      selectedValue: rowData.Currency,
      type: CURRENCY,
      rowID,
    };
    DeviceEventEmitter.emit(event.OB_PICK_CURRENCY, params);
  }

  /** render methods */

  render() {
    const { rowData } = this.props;
    const { value } = this.state;
    const currency = rowData.Currency;
    return (
      <View style={styles.container}>
        <Text allowFontScaling={false} style={styles.title}>{I18n.t('mobile.module.onbusiness.applicationamounttitletext')}</Text>
        <View style={styles.inputContainer}>
          <Input
            style={styles.reasonInput}
            placeholder="0"
            placeholderTextColor={color.placeholderColor}
            keyboardType="numeric"
            value={value}
            onChange={(e) => this.setState({ value: e.nativeEvent.text })}
            onSubmitEditing={(e) => this.onChangeTextEvent(e.nativeEvent.text)}
            onEndEditing={(e) => this.onChangeTextEvent(e.nativeEvent.text)}
          />
        </View>
        <TouchableHighlight
          activeOpacity={0.4}
          underlayColor="#fff"
          onPress={() => this.onPressCurrencyBtn()}
        >
          <View style={styles.currencyButton}>
            <Text allowFontScaling={false} style={styles.currency}>{currency}</Text>
            <CustomImage style={styles.hintImage} source={{uri: travel_down_img}} />
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    height: 48,
    width: device.width,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    marginLeft: 18,
    fontSize: font.titleFontSize,
    color: color.titleColor,
  },
  inputContainer: {
    flex: 1,
  },
  reasonInput: {
    flex: 1,
    fontSize: font.detailFontSize,
    color: '#333333',
    textAlign: 'right',
    marginHorizontal: 5,
    padding: 0,
  },
  currencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currency: {
    color: color.mainColor,
  },
  hintImage: {
    width: 8,
    height: 4,
    marginRight: 16,
    marginLeft: 4,
  },
});