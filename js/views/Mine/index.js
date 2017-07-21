import MineUi from './MineUi';
import React, { PureComponent } from 'react';
// import {
//   Text,
// } from 'react-native';


export default class Mine extends PureComponent {
  render() {
    return (
      <MineUi navigator={this.props.navigator} />
    );
  }
}
