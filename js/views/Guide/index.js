
import {
  PushNotificationIOS,
  InteractionManager,
} from 'react-native';
import React, { Component } from 'react';

import SplashScreen from 'rn-splash-screen';
import CompanyCode from '@/views/CompanyCode';
import { device, keys } from '@/common/Util';
import DisplayGuidePage from '@/views/Guide/DisplayGuidePage';
import { parameterToControlGuideShow } from '@/common/Consts';
import realm from '@/realm';

export default class Guide extends Component {
  mixins: [React.addons.pureRenderMixin]

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      SplashScreen.hide();
      if (device.isIos) {
        PushNotificationIOS.requestPermissions();
      }
    });

    realm.write(() => {
      const parameterAboutGuide = realm.objects('Config').filtered('name="parameterAboutGuide"');
      const language = realm.objects('Config').filtered('name="language"');
      if (parameterAboutGuide.length == 0) {
        realm.create('Config', { name: 'parameterAboutGuide', value: parameterToControlGuideShow });
      } else {
        parameterAboutGuide[0].value = parameterToControlGuideShow;
      }
      if (language.length == 0) {
        realm.create('Config', { name: 'language', value: '0' });
      }
    });
  }

  /**  */
  goNextView() {
    this.props.navigator.push({
      component: CompanyCode,
      gestureDisabled: true,
    });
  }

  render() {
    return (
      <DisplayGuidePage click={() => this.goNextView()} />
    );
  }
}
