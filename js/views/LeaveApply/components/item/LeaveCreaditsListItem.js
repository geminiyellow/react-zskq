import {
  View,
} from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import React, { PureComponent } from 'react';

import Text from '@/common/components/TextField';
import ProgressBar from '@/common/components/ProgressBar';
import Line from '@/common/components/Line';
import { device } from '@/common/Util';

export default class CreaditsItem extends PureComponent {

  // 初始化
  constructor(props) {
    super(props);
    this.state = {
      isNeedLine: this.props.isNeedLine,
      rowData: this.props.rowData,
      sectionID: this.props.sectionID,
      rowID: this.props.rowID,
    };
  }

  // 加载申请的表单Item
  onLoadingItem() {
    // 计算进度条 进度
    // LeaveModeUnit 0 天 1 小时
    const RemainHours = parseFloat(this.state.rowData.RemainHours);
    const TotalHours = parseFloat(this.state.rowData.TotalHours);
    const progress = parseFloat((RemainHours / TotalHours).toFixed(2));
    if (this.state.isNeedLine) {
      return (
        <View
          key={`${this.state.sectionID}-${this.state.rowID}`}
          style={styles.modalContainer}>
          <Text style={{ marginLeft: 20, marginBottom: 10, marginTop: 5, color: '#333333' }}>{this.state.rowData.LeaveName}</Text>
          <View style={{ flexDirection: 'row', marginLeft: 2, marginRight: 5 }}>
            <Text style={styles.itemTitleStyle} >{this.state.rowData.RemainHours}{this.state.rowData.LeaveModeUnit === '0' ? `(${I18n.t('mobile.module.leaveapply.leavecreaditunitd')})` : `(${I18n.t('mobile.module.leaveapply.leavecreaditunith')})`}</Text>
            <Text style={styles.itemStrenthStyle} />
            <Text style={styles.itemContentStyle}>{this.state.rowData.TotalHours}{this.state.rowData.LeaveModeUnit === '0' ? `(${I18n.t('mobile.module.leaveapply.leavecreaditunitd')})` : `(${I18n.t('mobile.module.leaveapply.leavecreaditunith')})`}</Text>
          </View>
          <View style={styles.progressBarStyle}>
            <ProgressBar
              widthSecond={progress} spacing={36} />
          </View>
          <View style={{ flexDirection: 'row', marginLeft: 2 }}>
            <Text style={styles.itemCreaditLeftStyle}>{I18n.t('mobile.module.leaveapply.leaveapplytitle')}{this.state.rowData.LeaveModeUnit === '0' ? `(${I18n.t('mobile.module.leaveapply.leavecreaditunitd')})` : `(${I18n.t('mobile.module.leaveapply.leavecreaditunith')})`}</Text>
            <Text style={styles.itemStrenthStyle} />
            <Text style={styles.itemContentStyle} >{I18n.t('mobile.module.leaveapply.leaveapplycreadittotal')}{this.state.rowData.LeaveModeUnit === '0' ? `(${I18n.t('mobile.module.leaveapply.leavecreaditunitd')})` : `(${I18n.t('mobile.module.leaveapply.leavecreaditunith')})`}</Text>
          </View>
          <Line style={{ marginTop: 20, height: 2 }} />
        </View>
      );
    }

    return (
      <View
        key={`${this.state.sectionID}-${this.state.rowID}`}
        style={styles.modalContainer}>
        <Text style={{ marginLeft: 20, marginBottom: 10, marginTop: 5, color: '#333333' }} >{this.state.rowData.LeaveName}</Text>
        <View style={{ flexDirection: 'row', marginLeft: 2, marginRight: 5 }}>
          <Text style={styles.itemTitleStyle} >{this.state.rowData.RemainHours}{this.state.rowData.LeaveModeUnit === '0' ? `(${I18n.t('mobile.module.leaveapply.leavecreaditunitd')})` : `(${I18n.t('mobile.module.leaveapply.leavecreaditunith')})`}</Text>
          <Text style={styles.itemStrenthStyle} />
          <Text style={styles.itemContentStyle} >{this.state.rowData.TotalHours}{this.state.rowData.LeaveModeUnit === '0' ? `(${I18n.t('mobile.module.leaveapply.leavecreaditunitd')})` : `(${I18n.t('mobile.module.leaveapply.leavecreaditunith')})`}</Text>
        </View>
        <View style={styles.progressBarStyle}>
          <ProgressBar
            widthSecond={progress} spacing={36} />
        </View>
        <View style={{ flexDirection: 'row', marginLeft: 2 }}>
          <Text style={styles.itemCreaditLeftStyle} >{I18n.t('mobile.module.leaveapply.leaveapplytitle')}{this.state.rowData.LeaveModeUnit === '0' ? `(${I18n.t('mobile.module.leaveapply.leavecreaditunitd')})` : `(${I18n.t('mobile.module.leaveapply.leavecreaditunith')})`}</Text>
          <Text style={styles.itemStrenthStyle} />
          <Text style={styles.itemContentStyle} >{I18n.t('mobile.module.leaveapply.leaveapplycreadittotal')}{this.state.rowData.LeaveModeUnit === '0' ? `(${I18n.t('mobile.module.leaveapply.leavecreaditunitd')})` : `(${I18n.t('mobile.module.leaveapply.leavecreaditunith')})`}</Text>
        </View>
      </View>
    );
  }

  // showCreaditItem(rowData, sectionID, rowID, isNeedLine) {
  //   this.setState({
  //     rowData,
  //     sectionID,
  //     rowID,
  //     isNeedLine,
  //   });
  // }

  render() {
    return (
      <View>
        {this.onLoadingItem()}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  modalContainer: {
    flexDirection: 'column',
    height: 140,
    width: device.width,
    backgroundColor: 'white',
  },
  itemTitleStyle: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 20,
  },
  itemStrenthStyle: {
    flexGrow: 1,
  },
  itemContentStyle: {
    fontSize: 14,
    color: '#999999',
    marginRight: 8,
  },
  progressBarStyle: {
    marginLeft: 20,
    marginRight: 0,
    marginTop: 10,
    marginBottom: 10,
  },
  itemCreaditLeftStyle: {
    fontSize: 14,
    color: '#999999',
    marginLeft: 20,
  },
});