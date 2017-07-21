/**
 * 部门信息变更详情
 */

import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import Image from '@/common/components/CustomImage';
import { device } from '../../common/Util';

const departmentchangeicon = 'departmentdetail';

export default class DepartMentDetailView extends PureComponent {
  componentWillMount() {
    currentDetail = this.props.detail;
  }

  render() {
    let preDeviceTypeView = null;
    if (currentDetail.formDetail.DeviceType == '1') {
      preDeviceTypeView = (
        <View style={styles.rowTagStyle}>
          <Text allowFontScaling={false} style={styles.rowTagTitleStyle}>{I18n.t('mobile.module.verify.devicenumber')}:</Text>
          <Text allowFontScaling={false} style={styles.rowContentDateStyle}>{currentDetail.formDetail.Major}</Text>
        </View>
      );
    }


    return (
      <View style={[styles.container, styles.rowStyle]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', height: 70, marginTop: 9, paddingLeft: 18 }}>
          <View style={styles.circleStyle}>
            <Image style={{ width: 25, height: 25 }} source={{ uri: departmentchangeicon }} />
          </View>
          <View style={{ marginLeft: 11, flexDirection: 'column', justifyContent: 'center' }}>
            <Text allowFontScaling={false} numberOfLines={1} style={styles.descriptionRowUserNameStyle}>{currentDetail.formDetail.ToDoTitle}</Text>
            <Text allowFontScaling={false} style={styles.applytimeStyle}>{`${I18n.t('mobile.module.verify.exception.applytime')}: ${currentDetail.formDetail.ApplyDate}`}</Text>
          </View>
        </View>

        <View style={styles.rowdividerStyle}>
          <Text allowFontScaling={false} style={styles.rowTagTitleStyle}>{I18n.t('mobile.module.verify.olddeptinfo')}</Text>
        </View>
        <View style={{ marginBottom: 10 }}>
          <View style={styles.rowTagStyle}>
            <Text allowFontScaling={false} style={styles.rowTagTitleStyle}>{I18n.t('mobile.module.verify.location.type')}:</Text>
            <Text allowFontScaling={false} style={styles.rowContentDateStyle}>{`${currentDetail.formDetail.DeviceType == '0' ? I18n.t('mobile.module.verify.location.map') : I18n.t('mobile.module.verify.location.bluetooth')}`}</Text>
          </View>
          <View style={styles.rowTagStyle}>
            <Text allowFontScaling={false} style={styles.rowTagTitleStyle}>{I18n.t('mobile.module.verify.oldlng')}:</Text>
            <Text allowFontScaling={false} style={styles.rowContentDateStyle}>{currentDetail.formDetail.PreLng}</Text>
          </View>
          <View style={styles.rowTagStyle}>
            <Text allowFontScaling={false} style={styles.rowTagTitleStyle}>{I18n.t('mobile.module.verify.oldlat')}:</Text>
            <Text allowFontScaling={false} style={styles.rowContentDateStyle}>{currentDetail.formDetail.PreLat}</Text>
          </View>
          <View style={styles.rowTagStyle}>
            <Text allowFontScaling={false} style={styles.rowTagTitleStyle}>{I18n.t('mobile.module.verify.olderrordis')}:</Text>
            <Text allowFontScaling={false} style={styles.rowContentDateStyle}>{currentDetail.formDetail.PreDistance}</Text>
          </View>
          <View style={styles.rowTagStyle}>
            <Text allowFontScaling={false} style={styles.rowTagTitleStyle}>{I18n.t('mobile.module.verify.oldaddress')}:</Text>
            <Text allowFontScaling={false} style={styles.rowContentDateStyle}>{currentDetail.formDetail.PreAddress}</Text>
          </View>
          {preDeviceTypeView}
        </View>

        <View style={styles.rowdividerStyle}>
          <Text allowFontScaling={false} style={styles.rowTagTitleStyle}>{I18n.t('mobile.module.verify.dept.changgeinfo')}</Text>
        </View>
        <View style={{ marginBottom: 10 }}>
          <View style={styles.rowTagStyle}>
            <Text allowFontScaling={false} style={styles.rowTagTitleStyle}>{I18n.t('mobile.module.verify.location.type')}:</Text>
            <Text allowFontScaling={false} style={styles.rowContentDateStyle}>{`${currentDetail.formDetail.DeviceType == '0' ? I18n.t('mobile.module.verify.location.map') : I18n.t('mobile.module.verify.location.bluetooth')}`}</Text>
          </View>
          <View style={styles.rowTagStyle}>
            <Text allowFontScaling={false} style={styles.rowTagTitleStyle}>{I18n.t('mobile.module.verify.newlng')}:</Text>
            <Text allowFontScaling={false} style={styles.rowContentDateStyle}>{currentDetail.formDetail.CrntLng}</Text>
          </View>
          <View style={styles.rowTagStyle}>
            <Text allowFontScaling={false} style={styles.rowTagTitleStyle}>{I18n.t('mobile.module.verify.newlat')}:</Text>
            <Text allowFontScaling={false} style={styles.rowContentDateStyle}>{currentDetail.formDetail.CrntLat}</Text>
          </View>
          <View style={styles.rowTagStyle}>
            <Text allowFontScaling={false} style={styles.rowTagTitleStyle}>{I18n.t('mobile.module.verify.newerrordis')}:</Text>
            <Text allowFontScaling={false} style={styles.rowContentDateStyle}>{currentDetail.formDetail.CrntDistance}</Text>
          </View>
          <View style={styles.rowTagStyle}>
            <Text allowFontScaling={false} style={styles.rowTagTitleStyle}>{I18n.t('mobile.module.verify.newaddress')}:</Text>
            <Text allowFontScaling={false} style={styles.rowContentDateStyle}>{currentDetail.formDetail.CrntAddress}</Text>
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
  circleStyle: {
    flexDirection: 'column',
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: '#5EB8FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowStyle: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
  },
  descriptionRowUserNameStyle: {
    marginRight: 18,
    fontSize: 18,
    width: device.width - 90,
    color: '$color.mainTitleTextColor',
  },
  applytimeStyle: {
    marginTop: 9,
    fontSize: 11,
    color: '#999999',
  },
  rowContentDateStyle: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 9,
    marginRight: 9,
  },
  rowTagStyle: {
    flexDirection: 'row',
    marginTop: 8,
    paddingLeft: 18,
    paddingRight: 18,
  },
  rowdividerStyle: {
    paddingLeft: 18,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#EFEFF4',
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
    borderColor: '#cccccc',
    paddingLeft: 9,
    paddingRight: 9,
    marginTop: 10,
    marginLeft: 18,
    marginRight: 18,
  },
});