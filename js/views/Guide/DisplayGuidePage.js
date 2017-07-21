import {
  Text,
  View,
} from 'react-native';
import React, { Component } from 'react';

import EStyleSheet from 'react-native-extended-stylesheet';
import AppIntro from 'react-native-app-intro';
import I18n from 'react-native-i18n';
import { device } from '@/common/Util';
import Image from '@/common/components/CustomImage';

const image11 = 'page_1_1';
const image12 = 'page_1_2';
const image13 = 'page_1_3';
const image14 = 'page_1_4';
const image15 = 'page_1_5';

const image21 = 'page_2_1';
const image22 = 'page_2_2';
const image23 = 'page_2_3';
const image24 = 'page_2_4';
const image25 = 'page_2_5';

export default class DisplayGuidePageOne extends Component {
  mixins: [React.addons.pureRenderMixin]

  displayGuidePage1() {
    return (
      <View style={[styles.slide, { backgroundColor: '#fff' }]}>
        <View style={[styles.header, { width: device.width }]}>
          <View
            style={{
              position: 'absolute',
              top: 22,
              width: device.width,
              height: device.height - 22,
              alignItems: 'center',
            }} level={0}>
            <Image style={{ width: device.width * (362 / 375), height: device.width * (362 / 375) }} source={{ uri: image11 }} />
          </View>
          <View
            style={{
              position: 'absolute',
              marginTop: 22,
              left: device.width * (8 / 320),
              width: device.width,
              height: device.height,
            }} level={30}>
            <Image style={{ width: device.width * (58 / 375), height: device.width * (58 / 375) }} source={{ uri: image12 }} />
          </View>
          <View
            style={{
              position: 'absolute',
              top: 14,
              left: device.width * (50 / 320),
              width: device.width,
              height: device.height,
            }} level={25}>
            <Image style={{ width: device.width * (42 / 375), height: device.width * (42 / 375) }} source={{ uri: image13 }} />
          </View>
          <View
            style={{
              position: 'absolute',
              top: 32,
              left: device.width * (98 / 320),
              width: device.width,
              height: device.height,
            }} level={20}>
            <Image style={{ width: device.width * (66 / 375), height: device.width * (66 / 375) }} source={{ uri: image14 }} />
          </View>
          <View
            style={{
              position: 'absolute',
              top: 112,
              left: device.width * (123 / 320),
              width: device.width,
              height: device.height,
            }} level={15}>
            <Image style={{ width: device.width * (48 / 375), height: device.width * (48 / 375) }} source={{ uri: image15 }} />
          </View>
        </View>
        <View style={styles.info}>
          <View level={1}><Text allowFontScaling={false} style={styles.title}>{I18n.t('mobile.module.guide.muiltyclockway')}</Text></View>
          <View level={20}><Text allowFontScaling={false} style={styles.description}>{I18n.t('mobile.module.guide.anyenvironment')}</Text></View>
        </View>
      </View>
    );
  }

  displayGuidePage2() {
    return (
      <View style={[styles.slide, { backgroundColor: '#fff' }]}>
        <View style={[styles.header, { width: device.width }]}>
          <View
            style={{ position: 'absolute', top: 22, width: device.width, height: device.height - 22, alignItems: 'center' }}
            level={0}>
            <Image style={{ width: device.width * (362 / 375), height: device.width * (362 / 375) }} source={{ uri: image21 }} />
          </View>
          <View
            style={{ position: 'absolute', marginTop: 22 + 20, left: device.width * (10 / 320), width: device.width, height: device.height }}
            level={15}>
            <Image style={{ width: device.width * (58 / 375), height: device.width * (58 / 375) }} source={{ uri: image22 }} />
          </View>
          <View
            style={{ position: 'absolute', top: 23, left: device.width * (40 / 320), width: device.width, height: device.height }}
            level={20}>
            <Image style={{ width: device.width * (66 / 375), height: device.width * (66 / 375) }} source={{ uri: image23 }} />
          </View>
          <View
            style={{ position: 'absolute', top: 42, left: device.width * (123 / 320), width: device.width, height: device.height }}
            level={25}>
            <Image style={{ width: device.width * (42 / 375), height: device.width * (42 / 375) }} source={{ uri: image24 }} />
          </View>
          <View
            style={{ position: 'absolute', top: 112, left: device.width * (123 / 320), width: device.width, height: device.height }}
            level={30}>
            <Image style={{ width: device.width * (48 / 375), height: device.width * (48 / 375) }} source={{ uri: image25 }} />
          </View>
        </View>
        <View style={styles.info}>
          <View level={1}><Text allowFontScaling={false} style={styles.title}>{I18n.t('mobile.module.guide.muiltytypes')}</Text></View>
          <View level={20}><Text allowFontScaling={false} style={styles.description}>{I18n.t('mobile.module.guide.anyscenarios')}</Text></View>
        </View>
      </View>
    );
  }

  goNextView = () => {
    const { click } = this.props;
    click();
  }

  render() {
    return (
      <AppIntro
        onSkipBtnClick={() => this.goNextView()}
        onDoneBtnClick={() => this.goNextView()}
        skipBtnLabel={I18n.t('mobile.module.guide.skip')}
        doneBtnLabel={I18n.t('mobile.module.guide.enter')}
        activeDotColor="#1fd762"
        dotColor="#999999"
        rightTextColor="#1fd762"
        leftTextColor="#1fd762"
      >
        {this.displayGuidePage1()}
        {this.displayGuidePage2()}
      </AppIntro>
    );
  }
}

const styles = EStyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9dd6eb',
    padding: 15,
  },
  header: {
    flex: 0.5, justifyContent: 'center', alignItems: 'center',
  },
  text: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
  },
  info: {
    flex: 0.5,
    alignItems: 'center',
    padding: 40,
  },
  title: {
    marginTop: 115,
    color: '#000',
    fontSize: 28,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  description: {
    color: '#999999',
    fontSize: 18,
    backgroundColor: 'transparent',
  },
  pic: {
    width: 75 * 2,
    height: 63 * 2,
  },
});
