/**
 * 右侧菜单的时间区间，单选控件
 */

import { TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import Text from '@/common/components/TextField';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';

const styles = EStyleSheet.create({
  containerNormalStyle: {
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
    paddingLeft: 18,
    paddingRight: 18,
    borderRadius: 2,
    borderColor: '#f4f4f4',
    borderWidth: 1,
    margin: 5,
  },
  containerSelectedStyle: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
    paddingLeft: 18,
    paddingRight: 18,
    borderColor: '#1fd662',
    borderWidth: 1,
    borderRadius: 2,
    margin: 5,
  },
  bottomBtnStyle: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  bottomBtnSelectedStyle: {
    fontSize: 12,
    color: '#1fd662',
    textAlign: 'center',
  },
});

export default class RangeRadioFilter extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      cutselected: true,
      lastselected: false,
    };
  }

  onBtnCutPress = () => {
    if (this.state.cutselected) return;
    const rangePress = this.props.rangePress;
    rangePress('0');
    this.setState({
      cutselected: true,
      lastselected: false,
    });
  }

  onBtnLastPress = () => {
    if (this.state.lastselected) return;
    const rangePress = this.props.rangePress;
    rangePress('-1');
    this.setState({
      cutselected: false,
      lastselected: true,
    });
  }

  onReset() {
    this.setState({
      cutselected: true,
      lastselected: false,
    });
  }

  render() {
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingLeft: 15, paddingRight: 5, paddingTop: 9 }}>
        <TouchableOpacity style={this.state.cutselected ? styles.containerSelectedStyle : styles.containerNormalStyle} onPress={this.onBtnCutPress} >
          <Text style={this.state.cutselected ? styles.bottomBtnSelectedStyle : styles.bottomBtnStyle}>{I18n.t('mobile.module.myform.currentmonth')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={this.state.lastselected ? styles.containerSelectedStyle : styles.containerNormalStyle} onPress={this.onBtnLastPress} >
          <Text style={this.state.lastselected ? styles.bottomBtnSelectedStyle : styles.bottomBtnStyle}>{I18n.t('mobile.module.myform.lastmonth')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

}