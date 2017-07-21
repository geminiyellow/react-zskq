import React, { Component } from 'react';
import {
  InteractionManager,
  Text,
  View,
} from 'react-native';

import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';
import Style from '@/common/Style';
import I18n from 'react-native-i18n';
import { getHHmmFormat } from '@/common/Functions';

class UserShiftInfo extends Component {

  render() {
    const date = new Date();
    const loginData = global.loginResponseData ? global.loginResponseData : '';
    const userWorkingTimeS = getHHmmFormat(loginData.timeClassS);
    const userWorkingTimeE = getHHmmFormat(loginData.timeClassE);
    const { userShift, userWorkingTime } = this.props;
    return (
      <View style={styles.viewTop} >
        <View style={styles.viewInfo}>
          <View style={styles.viewSpot}>
            <Text allowFontScaling={false} style={styles.textDay}>{`${date.getDate()}`}</Text>
            <Text allowFontScaling={false} style={styles.textMonth}>{I18n.t(`mobile.module.clock.month${date.getMonth() + 1}`)}</Text>
          </View>

          <View style={styles.viewShift}>
            <View style={{ flexGrow: 1 }}><Text allowFontScaling={false} style={[styles.textShift]}>{userShift}</Text></View>
            <View style={{ flexGrow: 1 }}><Text allowFontScaling={false} style={[styles.textShift]}>{I18n.t('mobile.module.clock.shifttime')}：{userWorkingTime}</Text></View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
    // viewTop
  viewTop: {
    marginTop: 0,
    width: device.width,
    height: 70,
    backgroundColor: Style.color.mainColorLight,
  },
  viewInfo: {
    marginTop: 16,
    height: 61,
    flexDirection: 'row',
    width: device.width,
  },
  viewSpot: {
    marginLeft: 18,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  textDay: {
    marginTop: 3,
    color: Style.color.mainColorLight,
    fontWeight: 'bold',
    fontSize: 18,
  },
  textMonth: {
    fontSize: 11,
    color: Style.color.mainColorLight,
  },
  viewShift: {
    marginTop: 5,
    marginLeft: 11,
    height: 40,
    width: device.width - 74,
    flexGrow: 1,
  },
  textShift: {
    fontSize: 14,
    color: '#fff',
    justifyContent: 'center',
  },
});

export default connect((state) => {
  const { userShift, userWorkingTime } = state.mobileCheckInReducer;
  return {
    userShift,
    userWorkingTime,
  };
})(UserShiftInfo);