import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, PanResponder } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { device } from '@/common/Util';
import I18n from 'react-native-i18n';
import { toThousands, thousandBitSeparator } from '@/common/Functions';


const MAX_POINTS = 360;

export default class Circular extends Component {
  static defaultProps = {
    title: '',
    num: '',
  }
  constructor() {
    super();
    this.state = {
      tintColor: null,
    };
  }

  componentWillMount() {
    const { title, num } = this.props;
    this.onRenderC(title, num);
  }


  /**
  * 更新新的状态
  */
  componentWillReceiveProps(newProps) {
    const { title, num } = newProps;
    this.onRenderC(title, num);
  }

  onRenderC(title, num) {
    let fill = 0;
    if (num != 0) {
      fill = title / num * 100;
    }
    if (fill == 0) {
      this.setState({
        tintColor: '#ddd',
      });
    }
    else if (fill > 100) {
      this.setState({
        tintColor: '#FF801A',
      });
    } else {
      this.setState({
        tintColor: '#14BE4B',
      });
    }
  }

  colorChange() {
    const { title, num } = this.props;
    let fill = 0;
    if (num != 0) {
      fill = title / num * 100;
    }
    if (fill > 100) {
      return (
        <View style={styles.points}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 30, color: '#FF801A', textAlign: 'center' }}>{thousandBitSeparator(String(Number((fill).toString().match(/^\d+(?:\.\d{0,2})?/))))}</Text>
            <Text style={{ fontSize: 18, color: '#FF801A', textAlign: 'center', marginTop: 5 }}>%</Text>
          </View>
          <Text style={{ fontSize: 14, color: '#FF801A', textAlign: 'center' }}>{thousandBitSeparator(String(title))}</Text>
          <Text style={styles.textstyle}>{I18n.t('mobile.module.selfperformance.complete')}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.points}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 30, color: '#14BE4B', textAlign: 'center' }}>{thousandBitSeparator(String(Number((fill).toString().match(/^\d+(?:\.\d{0,2})?/))))}</Text>
            <Text style={{ fontSize: 18, color: '#14BE4B', textAlign: 'center', marginTop: 5 }}>%</Text>
          </View>
          <Text style={{ fontSize: 14, color: '#14BE4B', textAlign: 'center' }}>{thousandBitSeparator(String(title))}</Text>
          <Text style={styles.textstyle}>{I18n.t('mobile.module.selfperformance.complete')}</Text>
        </View >
      );
    }
  }

  render() {
    const { title, num } = this.props;
    let fill = 0;
    if (num != 0) {
      fill = title / num * 100;
    }
    return (
      <View
        style={styles.container}
      >
        <AnimatedCircularProgress
          size={device.width * 0.5}
          width={8}
          fill={fill}
          tintColor={this.state.tintColor}
          rotation={230}
          backgroundColor='#ddd'>
          {
            (fill) => (
              this.colorChange()
            )
          }
        </AnimatedCircularProgress>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  points: {
    width: device.width * 0.3,
    alignItems: 'center',
    position: 'absolute',
    marginTop: device.isIos ? device.height * 0.07 : device.height * 0.06,
    marginLeft: device.width * 0.1,
  },
  container: {
    flex: 1,
    marginTop: device.height * 0.05,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textstyle: {
    fontSize: 15,
    marginTop: 5,
    color: '#A5A5A5',
    textAlign: 'center',
  },
});