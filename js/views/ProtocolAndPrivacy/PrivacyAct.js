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


export default class PrivacyAct extends Component {
  mixins: [React.addons.PureRenderMixin]

  render() {
    return (
      <View style={{ flexGrow: 1, backgroundColor: '#fff' }}>
        <NavBar
          title={I18n.t('mobile.module.mine.aboutus.privacy')}
          onPressLeftButton={() => this.props.navigator.pop()} />
        <ScrollView style={styles.scrollView}>

          <Text style={[styles.textBold, { top: 30 }]}>{I18n.t('mobile.module.privacy.one.one')}</Text>
          <Text style={[styles.text, { top: 30 }]}>{I18n.t('mobile.module.privacy.one.two')}</Text>
          <Text style={[styles.textBold, { top: 30 }]}>{I18n.t('mobile.module.privacy.one.three')}</Text>

          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.one.four')}</Text>

          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.two.one')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.two.two')}</Text>

          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.three.one')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.three.two')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.three.three')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.three.four')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.three.five')}</Text>

          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.four.one')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.four.two')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.four.three')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.four.four')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.four.five')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.four.six')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.four.seven')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.four.eight')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.four.nine')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.four.ten')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.four.eleven')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.four.twelve')}</Text>

          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.five.one')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.five.two')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.five.three')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.five.four')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.five.five')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.five.six')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.five.seven')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.five.eight')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.five.nine')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.five.ten')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.five.eleven')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.five.twelve')}</Text>

          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.six.one')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.six.two')}</Text>

          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.seven.one')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.seven.two')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.seven.three')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.seven.four')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.seven.five')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.seven.six')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.seven.seven')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.seven.eight')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.seven.nine')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.seven.ten')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.seven.eleven')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.seven.twelve')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.seven.thirteen')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.seven.fourteen')}</Text>

          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.eight.one')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.eight.two')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.eight.three')}</Text>

          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.nine.one')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.nine.two')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.nine.three')}</Text>

          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.ten.one')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.ten.two')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.ten.three')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.ten.four')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.ten.five')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.ten.six')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.ten.seven')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.ten.eight')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.ten.nine')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.ten.ten')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.ten.eleven')}</Text>

          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.eleven.one')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.eleven.two')}</Text>

          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.twelve.one')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.twelve.two')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.twelve.three')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.twelve.four')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.twelve.five')}</Text>
          <Text style={[styles.text, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.twelve.six')}</Text>

          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.thriteen.one')}</Text>
          <Text style={[styles.textBold, { top: 30 + 20 }]}>{I18n.t('mobile.module.privacy.thriteen.two')}</Text>

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
