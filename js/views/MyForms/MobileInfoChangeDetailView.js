/**
 * 手机信息变更详情
 */

import { Text, View } from 'react-native';
import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import Image from '@/common/components/CustomImage';
import { device } from '../../common/Util';
import { getYYYYMMDDFormat } from '@/common/Functions';

const mobilechangeicon = 'mobiledetail';

export default class MobileInfoChangeDetailView extends PureComponent {
  componentWillMount() {
    currentDetail = this.props.detail;
    if (currentDetail && currentDetail.formDetail.IsSimVisible == 'N') {
      this.setState({
        IsSimVisible: false,
      });
    } else {
      this.setState({
        IsSimVisible: true,
      });
    }
  }

  getOlderDeviceID() {
    if (this.state.IsVisible) {
      return (
        <View style={styles.rowTagStyle}>
          <Text allowFontScaling={false} style={styles.rowTagTitleStyle}>{I18n.t('mobile.module.verify.devicenum')}:</Text>
          <Text allowFontScaling={false} style={styles.rowContentDateStyle}>{currentDetail.formDetail.OldDeviceNo}</Text>
        </View>
      );
    }
    return null;
  }

  getNewDeviceID() {
    if (this.state.IsVisible) {
      return (
        <View style={styles.rowTagStyle}>
          <Text allowFontScaling={false} style={styles.rowTagTitleStyle}>{I18n.t('mobile.module.verify.devicenum')}:</Text>
          <Text allowFontScaling={false} style={styles.rowContentDateStyle}>{currentDetail.formDetail.NewDeviceNo}</Text>
        </View>
      );
    }
    return null;
  }

  render() {
    const Data = getYYYYMMDDFormat(currentDetail.formDetail.ApplyDate);

    return (
      <View style={styles.container}>
        <View style={styles.rowStyle}>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', height: 70, marginTop: 9, paddingLeft: 18 }}>
            <View style={styles.circleStyle}>
              <Image style={{ width: 25, height: 25 }} source={{ uri: mobilechangeicon }} />
            </View>
            <View style={{ marginLeft: 11, flexDirection: 'column', justifyContent: 'center' }}>
              <Text allowFontScaling={false} numberOfLines={1} style={styles.descriptionRowUserNameStyle}>{currentDetail.formDetail.ToDoTitle}</Text>
              <Text allowFontScaling={false} style={styles.applytimeStyle}>{`${I18n.t('mobile.module.verify.exception.applytime')} :${Data}`}</Text>
            </View>
          </View>

          <View style={styles.rowdividerStyle}>
            <Text allowFontScaling={false} style={styles.rowTagTitleStyle}>{I18n.t('mobile.module.verify.oldmobileinfo')}</Text>
          </View>
          <View style={{ backgroundColor: 'white', paddingTop: 8, paddingBottom: 8 }}>
            <View style={styles.rowTagStyle}>
              <Text allowFontScaling={false} style={styles.rowTagTitleStyle}>{I18n.t('mobile.module.verify.mobile.name')}:</Text>
              <Text allowFontScaling={false} style={styles.rowContentDateStyle}>{currentDetail.formDetail.OldPhoneModel}</Text>
            </View>
            <View style={[styles.rowTagStyle, { marginTop: 9 }]}>
              <Text allowFontScaling={false} style={styles.rowTagTitleStyle}>{I18n.t('mobile.module.verify.mobile.osnum')}:</Text>
              <Text allowFontScaling={false} style={styles.rowContentDateStyle}>{currentDetail.formDetail.OldPhoneSysVer}</Text>
            </View>
            {this.getOlderDeviceID()}
          </View>

          <View style={styles.rowdividerStyle}>
            <Text allowFontScaling={false} style={styles.rowTagTitleStyle}>{I18n.t('mobile.module.verify.newmobileinfo')}</Text>
          </View>
          <View style={{ marginBottom: 10, backgroundColor: 'white', paddingTop: 8, paddingBottom: 8 }}>
            <View style={styles.rowTagStyle}>
              <Text allowFontScaling={false} style={styles.rowTagTitleStyle}>{I18n.t('mobile.module.verify.mobile.name')}:</Text>
              <Text allowFontScaling={false} style={styles.rowContentDateStyle}>{currentDetail.formDetail.NewPhoneModel}</Text>
            </View>
            <View style={[styles.rowTagStyle, { marginTop: 9 }]}>
              <Text allowFontScaling={false} style={styles.rowTagTitleStyle}>{I18n.t('mobile.module.verify.mobile.osnum')}:</Text>
              <Text allowFontScaling={false} style={styles.rowContentDateStyle}>{currentDetail.formDetail.NewPhoneSysVer}</Text>
            </View>
            {this.getNewDeviceID()}
          </View>
        </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
    paddingBottom: 20,
  },
  rowStyle: {
    flex: 1,
    flexDirection: 'column',
  },
  circleStyle: {
    flexDirection: 'column',
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: '#3ED485',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applytimeStyle: {
    marginTop: 9,
    fontSize: 11,
    color: '#999999',
  },
  descriptionRowUserNameStyle: {
    marginRight: 18,
    fontSize: 18,
    width: device.width - 90,
    color: '$color.mainTitleTextColor',
  },
  rowContentDateStyle: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 9,
    marginRight: 9,
  },
  rowTagStyle: {
    flexDirection: 'row',
    paddingLeft: 18,
    paddingRight: 18,
  },
  rowdividerStyle: {
    paddingLeft: 18,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#EFEFF4',
    justifyContent: 'center',
  },
  rowTagTitleStyle: {
    fontSize: 14,
    color: '#999999',
  },
  rowApproveStyle: {
    height: 44,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingLeft: 9,
    paddingRight: 9,
    marginTop: 10,
    marginLeft: 18,
    marginRight: 18,
  },
});
