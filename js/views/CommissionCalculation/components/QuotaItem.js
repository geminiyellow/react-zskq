/**
 * 个人额度界面
 */

import { View, TouchableHighlight } from 'react-native';
import React, { PureComponent } from 'react';
import I18n from 'react-native-i18n';
import { device } from '@/common/Util';
import Line from '@/common/components/Line';
import Input from '@/common/components/Input';
import { messageType } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import Text from '@/common/components/TextField';
import { toThousands } from '@/common/Functions';
import Image from '@/common/components/CustomImage';
import EStyleSheet from 'react-native-extended-stylesheet';
import Process from './Process';

export default class QuotaItem extends PureComponent {

  constructor(...props) {
    super(...props);
    const { IndicatorName, Target, CompleteValue } = this.props.commissionItem;
    this.state = {
      indicatorName: IndicatorName,
      targetValue: Target,
      completeValue: CompleteValue,
      inputValue: '',
      // 输入框的宽度
      widthInput: 60,
    };
    this.commissionItem = this.props.commissionItem;
  }

  /**
   * 组件渲染完成
   */
  componentDidMount() {
    this.onRefresh();
  }

  /**
   * 更新新的状态
   */
  componentWillReceiveProps(newProps) {
    // 判断数据是否是在刷新
    if (this.commissionItem == newProps.commissionItem) return;
    const { IndicatorName, Target, CompleteValue } = newProps.commissionItem;
    this.setState({
      indicatorName: IndicatorName,
      targetValue: Target,
      completeValue: CompleteValue,
      inputValue: parseInt(CompleteValue).toString(),
      // 输入框的宽度
      widthInput: CompleteValue.toString().length * 10 + 60,
    });
    this.process.onChange(Target, CompleteValue);
    this.commissionItem = newProps.commissionItem;
  }

  /**
   * 刷新数据
   */
  onRefresh() {
    const { targetValue, completeValue } = this.state;
    this.setState({
      inputValue: parseInt(completeValue).toString(),
      widthInput: completeValue.toString().length * 10 + 60,
    });
    this.process.onChange(targetValue, completeValue);
  }

  /**
   * 处理文本框输入之后应该变化的样式（进度条）
   */
  onChangeText(text) {
    const { targetValue } = this.state;
    // 判断输入的信息不符合要求
    const regex = /^\d+(\.\d+)?$/;
    if (!text.match(regex)) {
      this.setState({
        inputValue: '',
        widthInput: 160,
      });
      this.process.onChange(targetValue, 0);
      showMessage(messageType.error, I18n.t('mobile.module.commission.quota.simulatenumber.right'));
      return;
    }
    if (text.length > 10) {
      showMessage(messageType.error, I18n.t('mobile.module.commission.quota.simulatenumber.max'));
      return;
    }
    const textTemp = parseInt(text).toString();
    const lengthOfDevice = (textTemp.toString().length * 10 + 60) > device.width - 24 ? device.width - 24 : textTemp.toString().length * 10 + 60;
    this.setState({
      inputValue: textTemp,
      widthInput: lengthOfDevice,
    });
    this.process.onChange(targetValue, parseInt(text));
  }

  /**
   * 刷新输入框的值
   */
  onRefreshText(text) {
    if (text < 0) {
      this.setState({
        inputValue: `${0}`,
      });
      return;
    }
    const { targetValue } = this.state;
    const inputValueS = (text * targetValue * 2).toFixed(0).toString();
    const lengthOfDevice = (inputValueS.toString().length * 10 + 60) > device.width - 24 ? device.width - 24 : inputValueS.toString().length * 10 + 60;
    this.setState({
      inputValue: inputValueS,
      widthInput: lengthOfDevice,
    });
  }

  /**
   * 获取输入的数据
   */
  onGetInputData() {
    if (!this.state.inputValue) {
      return null;
    }
    const params = {};
    const {IndicatorId, IndicatorName, Target, CompleteValue} = this.props.commissionItem;
    params.IndicatorId = IndicatorId;
    params.IndicatorName = IndicatorName;
    params.Target = Target;
    params.CompleteValue = CompleteValue;
    params.simulationValue = parseInt(this.state.inputValue);
    return params;
  }

  render() {
    const { completeValue, targetValue, indicatorName, inputValue, widthInput } = this.state;
    // 计算水平的间距
    const mhL = ((device.width - widthInput) / 2 < 12) ? 12 : (device.width - widthInput) / 2;
    return (
      <View style={styles.container}>
        <View style={styles.indicatorName}>
          <Text style={styles.indicatorNameText}>{indicatorName}</Text>
        </View>
        <Line />
        <View style={styles.targetBg}>
          <View style={styles.flex}>
            <Text style={styles.targetValue}>{toThousands(targetValue)}</Text>
            <Text style={styles.targetText}>{I18n.t('mobile.module.commission.quota.targetvalue')}</Text>
          </View>
          <View style={styles.flex}>
            <Text style={styles.completeValue}>{toThousands(completeValue)}</Text>
            <Text style={styles.completeText}>{I18n.t('mobile.module.commission.quota.completevalue')}</Text>
          </View>
        </View>
        <Line style={{ marginLeft: 12 }} />
        <Text style={styles.completeValueText}>{I18n.t('mobile.module.commission.quota.simulatenumber')}</Text>
        <Input
          style={styles.inputStyle} keyboardType={'numeric'}
          value={inputValue} selectionColor="#14BE4B" clearButtonMode="never"
          placeholder={I18n.t('mobile.module.commission.quota.simulatenumber.input')}
          placeholderTextColor='#FF801A' onChangeText={(text) => this.onChangeText(text)} />
        <Line style={[styles.liner, { width: widthInput, marginHorizontal: mhL }]} />
        <Process ref={ref => { this.process = ref; } } onRefreshText={(text) => this.onRefreshText(text)} />
        <View style={{ marginBottom: device.isIos ? 0 : 17 }} />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    height: 209,
    width: device.width,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  indicatorName: {
    height: 36.5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  indicatorNameText: {
    color: '#333333',
    fontSize: 14,
    marginLeft: 12,
    marginRight: 12,
  },
  targetBg: {
    height: 66,
    width: device.width,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  targetValue: {
    marginTop: 8,
    fontSize: 20,
    color: '#333333',
    textAlign: 'center',
    paddingLeft: 20,
  },
  targetText: {
    marginTop: 4,
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    paddingLeft: 20,
  },
  completeValue: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    paddingRight: 20,
  },
  completeText: {
    marginTop: 4,
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    paddingRight: 20,
  },
  completeValueText: {
    textAlign: 'center',
    marginTop: 8.5,
    color: '#999999',
    fontSize: 12,
  },
  inputStyle: {
    height: 30,
    width: device.width,
    paddingRight: 3,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FF801A',
    backgroundColor: 'white',
  },
  liner: {
    height: 1,
    backgroundColor: '#14BE4B',
    alignSelf: 'center',
  },
});