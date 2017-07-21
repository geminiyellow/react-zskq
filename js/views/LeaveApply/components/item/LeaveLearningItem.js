import React, { Component } from 'react';
import {
  DeviceEventEmitter,
  Text,
  View,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import I18n from 'react-native-i18n';
import Line from '@/common/components/Line';
import { switchCard, color } from '@/common/Style';
import { device } from '@/common/Util';
import Input from '@/views/LeaveApply/components/item/LeaveInput';
import _ from 'lodash';

export default class LeaveLearningItem extends Component {

  constructor(...args) {
    super(...args);
    this.state = {
      textClassValue: 0,
      textOffValue: 0,
      isShowItem: false,
    };
  }

  onRenderItem(isShowBottomLine) {
    if (isShowBottomLine) {
      return (
        <View style={[styles.container, { marginBottom: device.isIos ? 0.5 : 0 }]}>
          <View style={styles.contentContainer}>
            <Text allowFontScaling={false} numberOfLines={1} style={styles.title}>{I18n.t('mobile.module.leaveapply.leaveapplylessonperiod')}</Text>
            <Input
              style={styles.inputStyle}
              value={`${this.state.textClassValue}`}
              keyboardType='numeric'
              multiline={false}
              maxLength={7}
              onChangeText={(inputValue) => this.onTextChange(inputValue, 1)} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ backgroundColor: 'white', width: 20 }} />
            <Line />
          </View>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text allowFontScaling={false} numberOfLines={1} style={styles.title}>{I18n.t('mobile.module.leaveapply.leaveapplyadministrativeoffice')}</Text>
          <Input
            style={styles.inputStyle}
            value={`${this.state.textOffValue}`}
            keyboardType='numeric'
            multiline={false}
            maxLength={7}
            onChangeText={(inputValue) => this.onTextChange(inputValue, 2)} />
        </View>
      </View>
    );
  }

  onTextChange(inputValue, type) {
    const reg = /^([0-9])|([1-9]\d+)\.\d?$/;
    if (_.isEmpty(inputValue)) {
      if (type == 1) {
        this.setState({
          textClassValue: inputValue,
        });
      } else {
        this.setState({
          textOffValue: inputValue,
        });
      }
    } else {
      if (!reg.test(inputValue)) {
        if (type == 1) {
          this.setState({
            textClassValue: '',
          });
          DeviceEventEmitter.emit('CLASS_INPUT_TYPE_ERR', '');
        } else {
          this.setState({
            textOffValue: '',
          });
          DeviceEventEmitter.emit('OFFICE_INPUT_TYPE_ERR', '');
        }
      } else {
        if (inputValue.toString().indexOf('.') == -1) {
          if (parseInt(inputValue) > 9999) {
            return;
          }
          inputValue = parseInt(inputValue);
        } else {
          const hourArr = inputValue.split('.');
          if (!_.isEmpty(hourArr[1]) && hourArr.length <= 2) {
            const re = /^\d+$/;
            if (!re.test(hourArr[1])) {
              if (type == 1) {
                this.setState({
                  textClassValue: '',
                });
                DeviceEventEmitter.emit('CLASS_INPUT_TYPE_ERR', '');
              } else {
                this.setState({
                  textOffValue: '',
                });
                DeviceEventEmitter.emit('OFFICE_INPUT_TYPE_ERR', '');
              }
              return;
            }
          } else {
            // 连续输入小数点处理
            if (hourArr.length > 2) {
              if (_.isEmpty(hourArr[2])) {
                if (type == 1) {
                  this.setState({
                    textClassValue: '',
                  });
                  DeviceEventEmitter.emit('CLASS_INPUT_TYPE_ERR', '');
                } else {
                  this.setState({
                    textOffValue: '',
                  });
                  DeviceEventEmitter.emit('OFFICE_INPUT_TYPE_ERR', '');
                }
                return;
              }
            }
          }
          // 小数位限制
          if (parseInt(hourArr[1]) > 99) {
            return;
          }
        }
        if (type == 1) {
          this.setState({
            textClassValue: inputValue,
          });
        } else {
          this.setState({
            textOffValue: inputValue,
          });
        }
      }
    }
  }

  // 更新view显示
  onUpdateItemShow(isShow) {
    this.setState({
      isShowItem: isShow,
    });
  }

  // 导出课时值
  onExportLeaveClassValue() {
    return this.state.textClassValue;
  }
  //导出行政坐班的值
  onExportLeaveOffValue() {
    return this.state.textOffValue;
  }

  render() {
    if (!this.state.isShowItem) {
      return null;
    }
    return (
      <View style={{ marginTop: 12, marginBottom: 12 }}>
        {this.onRenderItem(true)}
        {this.onRenderItem(false)}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    height: '$switchCard.defaultHeight',
    backgroundColor: 'white',
  },
  contentContainer: {
    flexGrow: 1,
    paddingLeft: 18,
    paddingRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flexGrow: 1,
    fontSize: switchCard.title.fontSize,
    marginRight: 11,
    color: switchCard.title.color,
  },
  topLineStyle: {
    height: 1,
  },
  bottomLineStyle: {
    height: 1,
    marginLeft: 20,
  },
  inputStyle: {
    backgroundColor: 'white',
    height: 20,
    width: 100,
    color: switchCard.title.color,
    textAlign: 'right',
    marginRight: 0,
    fontSize: 14,
  },
});