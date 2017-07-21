import {
  View,
  StyleSheet,
} from 'react-native';

import React, { Component } from 'react';
import ActorImageWrapper from '@/common/components/ImageWrapper';
import _ from 'lodash';
import { getCurrentLanguage } from '@/common/Functions';
import { device } from '@/common/Util';
import Image from '@/common/components/CustomImage';
const drawGesturePan = 'draw_gesture_pan';
let actor = '';

export default class GesturePwdHeadCom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pwdState: this.props.passGesturePwd,
    };
  }

  componentWillMount() {
    if (!_.isEmpty(global.loginResponseData)) {
      getCurrentLanguage().then(data => {
        if (data == 'ZH-CN') {
          if (!_.isEmpty(global.loginResponseData.EmpName)) username = global.loginResponseData.EmpName;
        } else {
          if (!_.isEmpty(global.loginResponseData.EnglishName)) username = global.loginResponseData.EnglishName;
        }
      });
      if (!_.isEmpty(global.loginResponseData.Position)) position = global.loginResponseData.Position;

      if (!_.isEmpty(global.loginResponseData.HeadImgUrl)) {
        actor = global.loginResponseData.HeadImgUrl;
        actor = `${actor}?key=${_.now()}`;
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      pwdState: nextProps.passGesturePwd,
    });
  }

  renderHeadIcon() {
    if (this.state.pwdState != '') {
      return (
        <View style={styles.iconWrapper} >
          <ActorImageWrapper style={styles.icon} textStyle={{ fontSize: 30 }} actor={actor} EmpID={global.loginResponseData.EmpID} EmpName={global.loginResponseData.EmpName} EnglishName={global.loginResponseData.EnglishName} />
        </View>
      );
    }
    return (
      <Image style={styles.emptyIcon} source={{ uri: drawGesturePan }} />
    );
  }
  render() {
    return (
      <View style={styles.imgWrapper}>
        {this.renderHeadIcon()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imgWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 62,
    height: 62,
    marginTop: device.height * 0.008,
  },
  icon: {
    width: 62,
    height: 62,
    borderRadius: 30,
  },
  emptyIcon: {
    width: 30,
    height: 30,
    marginTop: device.height * 0.04,
  },
});