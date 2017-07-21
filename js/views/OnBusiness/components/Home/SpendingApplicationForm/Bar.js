// 备用金申请Bar
import React, { Component } from 'react';
import { DeviceEventEmitter, Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import { event, device } from '@/common/Util';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class Bar extends Component {

  /** event response */

  onPressDeleteBtn() {
    const { rowID } = this.props;
    DeviceEventEmitter.emit(event.OB_DELETE_FORM, rowID);
  }

  /** render method */

  render() {
    const { rowID } = this.props;
    return (
      <View style={styles.container}>
        <Text allowFontScaling={false} style={styles.font}>{I18n.t('mobile.module.onbusiness.bartitletext')} {parseInt(rowID) + 1}</Text>
        <Text allowFontScaling={false} style={styles.button} onPress={() => this.onPressDeleteBtn()}>{I18n.t('mobile.module.onbusiness.deletebuttontitletext')}</Text>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: device.width,
    height: 28,
    backgroundColor: '#f0eff5',
    alignItems: 'flex-end',
    paddingLeft: 18,
    paddingBottom: 6,
    flexDirection: 'row',
  },
  font: {
    fontSize: 14,
    color: '#999999',
    flexGrow: 1,
  },
  button: {
    marginRight: 18,
    color: 'red',
    fontSize: 14,
    justifyContent: 'flex-end',
  },
});