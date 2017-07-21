
import {
  Text,
} from 'react-native';
import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class LeaveTypeDescItem extends PureComponent {

  constructor(props) {
    super(props);
    // state控制
    this.state = {
      isShow: this.props.isShow,
      leaveTypeDesc: '',
    };
  }

  onShowLeaveTypeDesc(show) {
    this.setState({
      isShow: show,
    });
  }

  omUpdateLeaveTypeDesc(descStr) {
    this.setState({
      leaveTypeDesc: descStr,
    });
  }

  render() {
    if (this.state.isShow) {
      return (
        <Text
          style={styles.textStyle}>
          {this.state.leaveTypeDesc}
        </Text>
      );
    }
    return null;
  }
}

const styles = EStyleSheet.create({
  textStyle: {
    flexGrow: 1,
    marginTop: 10,
    marginLeft: 18,
    marginRight: 18,
    fontSize: 13,
    color: '#999999',
    lineHeight: 18,
  },
});