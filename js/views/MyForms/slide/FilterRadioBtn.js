/**
我的表单筛选 单选控件
选中状态与普通状态背景色不同
 */
import { DeviceEventEmitter, TouchableOpacity } from 'react-native';
import React, { PureComponent } from 'react';
import Text from '@/common/components/TextField';
import _ from 'lodash';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  containerNormalStyle: {
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
    paddingLeft: 18,
    paddingRight: 18,
    borderColor: '#f4f4f4',
    borderWidth: 1,
    borderRadius: 2,
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
let resetListener = null;
export default class FilterRadioBtn extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      selected: false,
      id: '',
    };
  }

  componentWillMount() {
    resetListener = DeviceEventEmitter.addListener('FilterRadioBtnReset', (value) => {
      this.setState({
        selected: false,
      });
    });
    this.setState({
      id: this.props.ID,
      selected: this.props.selected,
    });
  }

  componentWillUnmount() {
    if (resetListener) resetListener.remove();
    resetListener = null;
  }

  onBtnPress = () => {
    this.props.onClick(this.props.group, this.state.id, !this.state.selected);
    this.setState({
      selected: !this.state.selected,
    });
  }

  /**
   * 设置选中状态
   */
  setSelect(select) {
    this.setState({
      selected: select,
    });
  }

  render() {
    const { textStr, style } = this.props;
    return (
      <TouchableOpacity style={[this.state.selected ? styles.containerSelectedStyle : styles.containerNormalStyle, style]} onPress={this.onBtnPress} >
        <Text style={this.state.selected ? styles.bottomBtnSelectedStyle : styles.bottomBtnStyle}>{textStr}</Text>
      </TouchableOpacity>
    );
  }

}