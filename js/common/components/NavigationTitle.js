/** 导航栏标题 */

import React, { Component } from 'react';
import { Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class NavigationTitle extends Component {
  static defaultProps = {
    title: '标题标题标题标题标题标题标题',
  };

  /** render method */

  render() {
    const { title } = this.props;
    return (
      <Text style={styles.text}>{title}</Text>
    );
  }
}

const styles = EStyleSheet.create({
  text: {
    flex: 1,
    fontSize: 19,
    fontWeight: 'bold',
    color: '#000',
  },
});