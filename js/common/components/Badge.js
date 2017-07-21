import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default class Badge extends PureComponent {
  static defaultProps = {
    count: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      count: this.props.count,
    };
  }

  // 重新渲染角标的数据
  reFreshData(result) {
    this.setState({
      count: result,
    });
  }

  render() {
    let count = this.state.count;
    // 根据角标数目的多少来判断显示的宽度
    const style = {};
    if (count <= 99) {
      style.width = 18;
    } else {
      count = `${99}+`;
      style.width = 28;
    }
    return (
      <View>
        {
          (this.state.count === 0) ? null :
          <View style={styles.container}>
            <View style={[styles.numberBg, style]} >
              <Text allowFontScaling={false} style={styles.number}>{`${count}`}</Text>
            </View>
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  numberBg: {
    position: 'absolute',
    height: 18,
    top: -25,
    left: 15,
    backgroundColor: 'red',
    borderRadius: 10,
    borderWidth: 0.5,
    borderStyle: 'solid',
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontSize: 10,
    color: 'white',
  },
});