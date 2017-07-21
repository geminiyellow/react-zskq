
import {
  ScrollView,
  View,
} from 'react-native';
import React, { Component } from 'react';

import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import Line from '@/common/components/Line';
import { device } from '@/common/Util';
import { appVersion, sourceDataZh, sourceDataEn, sourceDataKo } from '@/common/Consts';
import { getCurrentLanguage } from '@/common/Functions';
import Image from '@/common/components/CustomImage';
import Text from '@/common/components/TextField';
import NavBar from '@/common/components/NavBar';
import { languages } from '@/common/LanguageSettingData';

const leftBack = 'back_white';

const imageForBottom = 'about_bg';
const imageForTop = 'about_appicon';

export default class AboutUs extends Component {
  mixins: [React.addons.pureRenderMixin]

  constructor(props) {
    super(props);
    this.state = {
      sourceData: [],
    };
  }

  componentWillMount() {
    getCurrentLanguage().then(dataLan => {
      const k = languages.indexOf(dataLan);
      let source = sourceDataEn;
      if (k == 0) {
        source = sourceDataZh;
      }

      this.setState({
        sourceData: source,
      });
    });
  }

  renderUpdateList() {
    const arrList = [];
    for (let i = 0; i < this.state.sourceData.length; i += 1) {
      arrList.push(
        <View key={i}>
          <Text style={styles.textList}>{this.state.sourceData[i]}</Text>
          <View style={styles.rowMargin} />
        </View>,
      );
    }

    return arrList;
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar
          barStyle="light-content"
          backgroundColor="#C65FE2"
          lineColor="#C65FE2"
          backImage={leftBack}
          onPressLeftButton={() => this.props.navigator.pop()} />

        <ScrollView style={styles.scrollView} bounces={false} showsVerticalScrollIndicator={false}>

          <Image style={styles.imageBack} source={{ uri: imageForBottom }}>
            <Image style={styles.imageTop} source={{ uri: imageForTop }} />
            <Text style={styles.textTopName}>{I18n.t('mobile.module.mine.aboutus.onahandle')}</Text>
          </Image>

          <Text style={styles.textName}>{I18n.t('mobile.module.mine.aboutus.onahandleversion')}{appVersion}</Text>

          <View style={styles.thisUpdate}>
            <Line style={styles.updateLine} />
            <Text style={styles.textUpdate}>{I18n.t('mobile.module.mine.aboutus.update')}</Text>
            <Line style={styles.updateLine} />
          </View>

          <View style={{ height: 24 }} />
          {this.renderUpdateList()}
          <View style={{ height: 50 }} />
        </ScrollView>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  navBar: {
    backgroundColor: '#c65fe2',
    alignItems: 'center',
  },
  imageBack: {
    width: device.width,
    height: 230,
  },
  imageTop: {
    top: 22,
    height: 75,
    width: 75,
    alignSelf: 'center',
  },
  textTopName: {
    top: 32,
    fontSize: 17,
    color: '#f4f4f4',
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  textName: {
    width: device.width,
    top: 10,
    color: '#333333',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
  },
  thisUpdate: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 16 + 6,
    flexDirection: 'row',
  },
  updateLine: {
    width: ((device.width - 60) / 2) - 60,
    backgroundColor: '#d2d2d2',
  },
  textUpdate: {
    fontSize: 11,
    marginHorizontal: 6,
    color: '#999999',
  },
  textList: {
    left: 50,
    width: device.width - 96,
    fontSize: 14,
    color: '#999999',
  },
  listView: {
    top: 24,
    marginHorizontal: 40,
    marginBottom: 60,
  },
  rowMargin: {
    height: 22,
  },
  rowMargin2: {
    height: 22,
    width: device.width,
  },

  listRow: {
    flexGrow: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
});
