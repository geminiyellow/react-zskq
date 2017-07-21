//指标完成
import React, { PureComponent } from 'react';
import {
  StatusBar,
  Text,
  View,
} from 'react-native';

import SegmentedControlTab from 'react-native-segmented-control-tab';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import { messageType } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import NavBar from '@/common/components/NavBar';
import { device } from '@/common/Util';
import Line from '../../common/components/Line';
import ScrollView from '@/common/components/ScrollView';
import Image from '@/common/components/CustomImage';
import TouchableHightlight from '@/common/components/CustomTouchableHighlight';
import Filter from '@/common/components/Filter/Filter';
import FilterModal from '@/common/components/Filter/FilterModal';
import DataSources from './DataSources';
import SelfChart from './SelfChart';
import Circular from './Circular';
import UmengAnalysis from '@/common/components/UmengAnalysis';
import { getMonthInfo, getOrganizationInfo, getCommission, abort } from '@/views/CommissionCalculation/service';
import CommissionHelper from '@/views/CommissionCalculation/constants/CommissionHelper';
import { toThousands, thousandBitSeparator } from '@/common/Functions';

const leftBack = 'back';
let onPressItemIndex = 0;
const commissionHelper = new CommissionHelper();

export default class SelfIndex extends PureComponent {
  constructor(...props) {
    super(...props);
    const { indicatorName, targetValue, completeValue } = this.props;
    this.state = {
      indicatorName: indicatorName,
      targetValue: targetValue,
      completeValue: completeValue,
    };
  }

  /**
  * 更新新的状态
  */
  componentWillReceiveProps(newProps) {
    const { indicatorName, targetValue, completeValue } = newProps;
    this.setState({
      indicatorName: indicatorName,
      targetValue: targetValue,
      completeValue: completeValue,
    });
  }

  render() {
    const { completeValue, targetValue, indicatorName } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <Text style={styles.text}>{indicatorName}</Text>
          <Text style={styles.targetValue}>目标值：{thousandBitSeparator(String(targetValue))}元</Text >
          <Circular
            title={completeValue}
            num={targetValue}
          />
        </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  view: {
    backgroundColor: 'white',
  },
  text: {
    marginLeft: device.width * 0.04,
    marginRight: device.width * 0.04,
    fontSize: 16,
    color: '#111111',
    marginTop: 10,
  },
  targetValue: {
    marginLeft: device.width * 0.04,
    marginTop: 1,
    fontSize: 12,
    color: '#A5A5A5',
  }
});
