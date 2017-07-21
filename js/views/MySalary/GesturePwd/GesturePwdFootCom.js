import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import React, { Component } from 'React';
import I18n from 'react-native-i18n';
import { device } from '@/common/Util';

export default class GesturePwdFootCom extends Component {
  onForgetGesturePwdClicked() {
    this.props.openParentLoginModal();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text allowFontScaling={false} style={styles.btnText} onPress={this.onForgetGesturePwdClicked.bind(this)}>{I18n.t('mobile.module.salary.forget')}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: (device.height <= 480) ? device.height * 0.1 : device.height * 0.15,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: device.width * 0.1,
    alignItems: 'center',
  },
  btnText: {
    color: '#ffffff',
    opacity: 0.8,
    fontSize: 16,
    backgroundColor: '#ff000000',
  },
});