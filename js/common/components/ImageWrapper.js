/**
 * 头像图片组件
 */
import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import _ from 'lodash';
import { actorColors } from '@/common/Consts';
import { getCurrentLanguage } from '@/common/Functions';
import { languages } from '@/common/LanguageSettingData';

import {
  DeviceEventEmitter,
  View,
  Text,
} from 'react-native';
import Image from '@/common/components/CustomImage';
import MyFormHelper from '@/views/MyForms/MyFormHelper';

const myFormHelper = new MyFormHelper();
const defaultactor = 'default_avatar';

export default class ActorImageWrapper extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      language: myFormHelper.getLanguage(),
    };
  }

  componentWillMount() {
    this.languageChanged = DeviceEventEmitter.addListener('changeLanguage', (selectedIndex) => {
      getCurrentLanguage().then(dataLan => {
        const k = languages.indexOf(dataLan);
        if (k == 0) {
          this.setState({
            language: 0,
          });
        } else {
          this.setState({
            language: 1,
          });
        }
      });
    });
  }

  componentWillUnmount() {
    this.languageChanged.remove();
  }

  getContent() {
    const { style, actor, EmpID, EmpName, EnglishName, textStyle } = this.props;
    if (!_.isEmpty(actor)) {
      return (
        <Image style={[styles.actorImagStyle, style]} source={{ uri: actor }} />
      );
    } else if (!_.isEmpty(EmpID)) {
      let backgroundcolor = actorColors[0];
      let lastnum = parseInt(EmpID.substr(EmpID.length - 1, 1));
      if (_.isNaN(lastnum)) {// 非数字
        backgroundcolor = actorColors[0];
      } else
        backgroundcolor = actorColors[parseInt(EmpID.substr(EmpID.length - 1, 1))];
      let name = '';
      if (this.state.language == '0') {
        if (!_.isEmpty(EmpName)) {
          name = EmpName.substr(EmpName.length - 1, 1);
        } else {
          if (!_.isEmpty(EnglishName)) {
            name = EnglishName.substr(0, 1);
          }
        }
      } else {
        if (!_.isEmpty(EnglishName)) {
          name = EnglishName.substr(0, 1);
        } else {
          if (!_.isEmpty(EmpName)) {
            name = EmpName.substr(EmpName.length - 1, 1);
          }
        }
      }
      if (!_.isEmpty(name)) {
        return (
          <View style={[styles.actorWrapperStyle, { backgroundColor: backgroundcolor }, style]}>
            <Text allowFontScaling={false} style={[{ fontSize: 14, color: '#ffffff', alignSelf: 'center', justifyContent: 'center' }, textStyle]}>{name}</Text>
          </View>
        );
      }
      return (
        <Image style={[styles.actorImagStyle, style]} source={{ uri: defaultactor }} />
      );
    }
    return (
      <Image style={[styles.actorImagStyle, style]} source={{ uri: defaultactor }} />
    );
  }
  render() {
    return (
      <View>
        {this.getContent()}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  actorImagStyle: {
    width: 46,
    height: 46,
    alignSelf: 'center',
    borderRadius: 23,
  },
  actorWrapperStyle: {
    width: 46,
    height: 46,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 23,
  },
});