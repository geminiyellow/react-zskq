import React, { Component } from 'react';
import {
  ScrollView,
  View,
} from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import { device } from '@/common/Util';
import Text from '@/common/components/TextField';
import NavBar from '@/common/components/NavBar';


export default class ServiceAgreement extends Component {
  mixins: [React.addons.PureRenderMixin]

  render() {
    return (
      <View style={{ flexGrow: 1, backgroundColor: '#fff' }}>
        <NavBar
          title={I18n.t('mobile.module.mine.aboutus.service')}
          onPressLeftButton={() => this.props.navigator.pop()} />
        <ScrollView style={styles.scrollView}>

          <Text style={[styles.textBold, { top: 30 }]}>{I18n.t('mobile.module.agreement.one.one')}</Text>
          <Text style={[styles.textBold, { top: 30 }]}>{I18n.t('mobile.module.agreement.one.two')}</Text>
          <Text style={[styles.textBold, { top: 30 }]}>{I18n.t('mobile.module.agreement.one.three')}</Text>

          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.two.one')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.two.two')}</Text>
          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.two.three')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.two.four')}</Text>
          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.two.five')}</Text>
          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.two.six')}</Text>

          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.two.seven')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.two.eight')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.two.nine')}</Text>
          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.two.ten')}</Text>

          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.four.one')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.four.two')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.four.three')}</Text>
          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.four.four')}</Text>
          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.four.five')}</Text>

          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.one')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.two')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.three')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.four')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.five')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.six')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.seven')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.eight')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.nine')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.ten')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.eleven')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.twelve')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.thirteen')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.fourteen')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.fifteen')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.sixteen')}</Text>

          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.seventeen')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.eighteen')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.nineteen')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.twenty')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.twenty.one')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.twenty.two')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.twenty.three')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.twenty.four')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.twenty.five')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.twenty.six')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.twenty.seven')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.twenty.eight')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.twenty.nine')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.thirty')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.thirty.one')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.thirty.two')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.thirty.three')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.thirty.four')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.thirty.five')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.thirty.six')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.thirty.seven')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.thirty.eight')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.thirty.nine')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.five.forty')}</Text>

          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.six.one')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.six.two')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.six.three')}</Text>
          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.six.four')}</Text>
          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.six.five')}</Text>

          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.seven.one')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.seven.two')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.seven.three')}</Text>

          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.eight.one')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.eight.two')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.eight.three')}</Text>

          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.nine.one')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.nine.two')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.nine.three')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.nine.four')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.nine.five')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.nine.six')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.nine.seven')}</Text>

          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.ten.one')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.ten.two')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.ten.three')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.ten.four')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.ten.five')}</Text>

          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.eleven.one')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.eleven.two')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.eleven.three')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.eleven.four')}</Text>

          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.twelve.one')}</Text>
          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.twelve.two')}</Text>
          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.twelve.three')}</Text>
          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.twelve.four')}</Text>
          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.twelve.five')}</Text>
          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.twelve.six')}</Text>
          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.twelve.seven')}</Text>
          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.twelve.eight')}</Text>
          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.twelve.nine')}</Text>
          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.twelve.ten')}</Text>
          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.twelve.eleven')}</Text>
          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.twelve.twelve')}</Text>

          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.thirteen.one')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.thirteen.two')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.thirteen.three')}</Text>

          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.fourteen.one')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.fourteen.two')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.fourteen.three')}</Text>

          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.fifteen.one')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.fifteen.two')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.fifteen.three')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.fifteen.four')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.fifteen.five')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.agreement.fifteen.six')}</Text>

          <View style={{ height: 50 + 48, width: device.width - 36 - 37, backgroundColor: 'transparent' }} />

        </ScrollView>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  scrollView: {
    marginBottom: 38,
    left: 36,
    width: device.width - 36 - 37,
    backgroundColor: '#fff',
  },

  text: {
    fontSize: 14,
    color: '#333333',
    backgroundColor: 'transparent',
  },
  textBold: {
    fontSize: 14,
    color: '#333333',
    backgroundColor: 'transparent',
    fontWeight: 'bold',
  },
});
