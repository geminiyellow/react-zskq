import {
  TouchableHighlight,
  View,
} from 'react-native';
import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

import I18n from 'react-native-i18n';
import { device } from '@/common/Util';
import Line from '@/common/components/Line';
import Text from '@/common/components/TextField';
import Image from '@/common/components/CustomImage';

const forwardImage = 'forward';

export default class LeaveVocationListItem extends PureComponent {

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
    const creaditId = this.state.rowData.creaditId;
    const creaditName = this.state.rowData.creaditName;
    const creaditBranch = this.state.rowData.creaditBranch;
    const creaditApproving = this.state.rowData.creaditApproving;
    let creaditRemain = 0;
    for (i = 0; i < creaditBranch.length; i += 1) {
      creaditRemain += creaditBranch[i].creaditRemain;
    }
    if (creaditBranch[0].creaditUnit === '0') {
      this.unit = I18n.t('mobile.module.leaveapply.leaveapplylastunitbyd');
    }
    if (creaditBranch[0].creaditUnit === '1') {
      this.unit = I18n.t('mobile.module.leaveapply.leaveapplylastunitbyh');
    }
    if (this.state.isNeedLine) {
      return (
        <TouchableHighlight
          onPress={() => {
            const { onItemPress } = this.props;
            onItemPress(creaditId, creaditBranch);
          }}>
          <View>
            <View
              style={styles.modalContainer}>
              <View style={styles.leftContent}>
                <Text style={styles.titleStyle} numberOfLines={1}>{creaditName}</Text>
                <View style={styles.contentStyle}>
                  <Text style={styles.contentRemainStyle}>{`${I18n.t('mobile.module.leaveapply.leaveapplycreaditsleft')}${creaditRemain}${this.unit}`}</Text>
                  <Text style={styles.contentApprovingStyle} numberOfLines={1}>{`${I18n.t('mobile.module.leaveapply.leaveapplycreaditsapprove')}${creaditApproving}${this.unit}`}</Text>
                </View>
              </View>
              <Image style={styles.rightImage} source={{ uri: forwardImage }} />
            </View>
            <Line style={{ height: 0.5 }} />
          </View>
        </TouchableHighlight>
      );
    }

    return (
      <TouchableHighlight
        onPress={() => {
          const { onItemPress } = this.props;
          onItemPress(creaditId, creaditBranch);
        }}>
        <View
          style={styles.modalContainer}>
          <View style={styles.leftContent}>
            <Text style={styles.titleStyle} numberOfLines={1}>{creaditName}</Text>
            <View style={styles.contentStyle}>
              <Text style={styles.contentRemainStyle}>{`${I18n.t('mobile.module.leaveapply.leaveapplycreaditsleft')}${creaditRemain}${this.unit}`}</Text>
              <Text style={styles.contentApprovingStyle} numberOfLines={1}>{`${I18n.t('mobile.module.leaveapply.leaveapplycreaditsapprove')}${creaditApproving}${this.unit}`}</Text>
            </View>
          </View>
          <Image style={styles.rightImage} source={{ uri: forwardImage }} />
        </View>
      </TouchableHighlight>
    );
  }

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
    flexDirection: 'row',
    height: 68,
    width: device.width,
    backgroundColor: 'white',
  },
  leftContent: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 18,
  },
  titleStyle: {
    flex: 1,
    height: 25,
    marginTop: 8,
    marginBottom: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000000',
  },
  contentStyle: {
    flex: 1,
    flexDirection: 'row',
    height: 25,
  },
  contentRemainStyle: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
  },
  contentApprovingStyle: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
  },
  rightImage: {
    height: 26,
    width: 16,
    marginTop: 21,
    marginRight: 18,
  },
});