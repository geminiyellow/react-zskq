import * as helper from './helper';
import React, { PropTypes, Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    PanResponder,
    View,
    Text,
} from 'react-native';
import Line from './line';
import Circle from './circle';
import * as Animatable from 'react-native-animatable';
import { device } from '@/common/Util';

// const Width = Dimensions.get('window').width
// const Height = Dimensions.get('window').height
// const Top = (Height - Width)/2.0 * 1.5
// const Radius = Width / 10

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height - Dimensions.get('window').height * 0.1;
const Top = (Dimensions.get('window').height <= 480) ? (Dimensions.get('window').height - Dimensions.get('window').height * 0.71) : (Dimensions.get('window').height - Dimensions.get('window').height * 0.76);
const Radius = Width / 10;

export default class GesturePassword extends Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.lastIndex = -1;
    // 手势结果
    this.sequence = '';
    this.isMoving = false;

    // getInitialState
    const circles = [];
    const Margin = Radius;
    for (let i = 0; i < 9; i++) {
      const p = i % 3;
      const q = parseInt(i / 3);
      circles.push({
        isActive: false,
        x: p * (Radius * 2 + Margin) + Margin + Radius,
        y: q * (Radius * 2 + Margin) + Margin + Radius,
      });
    }

    this.state = {
      circles,
      lines: [],
    };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
        // 要求成为响应者：
      onStartShouldSetPanResponder: (event, gestureState) => true,
      onStartShouldSetPanResponderCapture: (event, gestureState) => true,
      onMoveShouldSetPanResponder: (event, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (event, gestureState) => true,

      // 开始手势操作
      onPanResponderGrant: (event, gestureState) => {
        this.onStart(event, gestureState);
      },
      // 移动操作
      onPanResponderMove: (event, gestureState) => {
        this.onMove(event, gestureState);
      },
      // 释放手势
      onPanResponderRelease: (event, gestureState) => {
        this.onEnd(event, gestureState);
      },
    });
  }

  renderLines() {
    const array = [];
    let color;
    // const { status, wrongColor, rightColor } = this.props;
    const { status, wrongLineColor, rightLineColor } = this.props;

    this.state.lines.forEach(function (l, i) {
      // color = status === 'wrong' ? wrongColor : rightColor;
      color = status === 'wrong' ? wrongLineColor : rightLineColor;

      array.push(
        <Line key={'l_' + i} color={color} start={l.start} end={l.end} />
      );
    });
    return array;
  }

  render() {
    // let color = this.props.status === 'wrong' ? this.props.wrongColor : this.props.rightColor;
    let color = this.props.status === 'wrong' ? this.props.wrongLineColor : this.props.rightLineColor;
    return (
      <View style={[styles.frame, this.props.style, { flexGrow: 1 }]}>
            {this.props.children}

        <View style={styles.message}>
            {this.renderMessage()}
        </View>

        <View style={styles.board} {...this._panResponder.panHandlers}>
            {this.renderCircles()}
            {this.renderLines()}
          <Line ref={(line) => { this.drawLine = line; }} color={color} />
        </View>
      </View>
    );
  }


  setActive(index) {
    this.state.circles[index].isActive = true;
    const circles = this.state.circles;
    this.setState({ circles });
  }

  renderMessage() {
    const color = this.props.status === 'wrong' ? this.props.wrongColor : this.props.rightColor;
    return (
        this.props.status == 'wrong' ?
          <Animatable.Text allowFontScaling={false} animation="shake" iterationCount={1} direction="alternate" style={[styles.msgText, this.props.textStyle, { color }]}>
            {this.state.message || this.props.message}
          </Animatable.Text>
        :
          <Text allowFontScaling={false} style={[styles.msgText, this.props.textStyle, { color }]}>
            {this.state.message || this.props.message}
          </Text>
    );
  }

  getTouchChar(touch) {
    const x = touch.x;
    const y = touch.y;
    for (let i = 0; i < 9; i++) {
      if (helper.isPointInCircle({ x, y }, this.state.circles[i], Radius)) {
        return String(i);
      }
    }
    return false;
  }

  onStart(e, g) {
    const x = e.nativeEvent.pageX;
    const y = e.nativeEvent.pageY - Top;

    const lastChar = this.getTouchChar({ x, y });
    if (lastChar) {
      this.isMoving = true;
      this.lastIndex = Number(lastChar);
      this.sequence = lastChar;
      this.resetActive();
      this.setActive(this.lastIndex);

      const point = {
        x: this.state.circles[this.lastIndex].x,
        y: this.state.circles[this.lastIndex].y,
      };

      this.drawLine.setNativeProps({ start: point, end: point });

      this.props.onStart && this.props.onStart();

      if (this.props.interval > 0) {
        clearTimeout(this.timer);
      }
    }
  }

  getCrossChar(char) {
    const middles = '13457';
    const last = String(this.lastIndex);

    if (middles.indexOf(char) > -1 || middles.indexOf(last) > -1){
      return false;
    }

    const point = helper.getMiddlePoint(this.state.circles[last], this.state.circles[char]);

    for (let i = 0; i < middles.length; i++) {
      const index = middles[i];
      if (helper.isEquals(point, this.state.circles[index])) {
        return String(index);
      }
    }
    return false;
  }

  resetActive() {
    this.state.lines = [];
    for (let i = 0; i < 9; i++) {
      this.state.circles[i].isActive = false;
    }
    const circles = this.state.circles;
    this.setState({ circles });
    this.props.onReset && this.props.onReset();
  }

  renderCircles() {
    // let array = [], fill, color, inner, outer;
    const array = [];
    let fill;
    let color;
    let inner;
    let outer;
    const { status, wrongCirclesColor, rightCirclesColor, innerCircle, outerCircle } = this.props;

    this.state.circles.forEach(function (c, i) {
      fill = c.isActive;
      color = status === 'wrong' ? wrongCirclesColor : rightCirclesColor;
      inner = !!innerCircle;
      outer = !!outerCircle;

      array.push(
        <Circle key={'c_' + i} fill={fill} color={color} x={c.x} y={c.y} r={Radius} inner={inner} outer={outer} />
      );
    });
    return array;
  }


  onMove(e, g) {
    const x = e.nativeEvent.pageX;
    const y = e.nativeEvent.pageY - Top;

    if (this.isMoving) {
      this.drawLine.setNativeProps({ end: { x, y } });
      let lastChar = null;

      if (!helper.isPointInCircle({ x, y }, this.state.circles[this.lastIndex], Radius)) {
        lastChar = this.getTouchChar({ x, y });
      }

      if (lastChar && this.sequence.indexOf(lastChar) === -1) {
        if (!this.props.allowCross) {
          const crossChar = this.getCrossChar(lastChar);
          if (crossChar && this.sequence.indexOf(crossChar) === -1) {
            this.sequence += crossChar;
            this.setActive(Number(crossChar));
          }
        }
        const lastIndex = this.lastIndex;
        const thisIndex = Number(lastChar);
        this.state.lines.push({
          start: {
            x: this.state.circles[lastIndex].x,
            y: this.state.circles[lastIndex].y,
          },
          end: {
            x: this.state.circles[thisIndex].x,
            y: this.state.circles[thisIndex].y,
          },
        });

        this.lastIndex = Number(lastChar);
        this.sequence += lastChar;
        this.setActive(this.lastIndex);

        const point = {
          x: this.state.circles[this.lastIndex].x,
          y: this.state.circles[this.lastIndex].y,
        };

        this.drawLine.setNativeProps({ start: point });
      }
    }
    if (this.sequence.length === 9) this.onEnd();
  }

  onEnd(e, g) {
    if (this.isMoving) {
      const password = helper.getRealPassword(this.sequence);
      this.sequence = '';
      this.lastIndex = -1;
      this.isMoving = false;
      const origin = { x: 0, y: 0 };
      this.drawLine.setNativeProps({ start: origin, end: origin });
      this.props.onEnd && this.props.onEnd(password);

      if (this.props.interval > 0) {
        this.timer = setTimeout(() => this.resetActive(), this.props.interval);
      }
    }
  }

}

GesturePassword.propTypes = {
  message: PropTypes.string,
  rightColor: PropTypes.string,
  wrongColor: PropTypes.string,
  rightLineColor: PropTypes.string,
  wrongLineColor: PropTypes.string,
  status: PropTypes.oneOf(['right', 'wrong', 'normal']),
  onStart: PropTypes.func,
  onEnd: PropTypes.func,
  onReset: PropTypes.func,
  interval: PropTypes.number,
  allowCross: PropTypes.bool,
  innerCircle: PropTypes.bool,
  outerCircle: PropTypes.bool,
};

GesturePassword.defaultProps = {
  message: '',
  rightColor: '#8E91A8',
  wrongColor: '#D93609',
  rightLineColor: '#8E91A8',
  wrongLineColor: '#D93609',
  status: 'normal',
  interval: 0,
  allowCross: false,
  innerCircle: true,
  outerCircle: true,
};

const styles = StyleSheet.create({
  frame: {
    backgroundColor: 'transparent',
  },
  board: {
    position: 'absolute',
    left: 0,
    top: Top,
    width: Width,
    height: Height,
  },
  message: {
    marginTop: device.height * 0.02,
    alignItems: 'center',
  },
  msgText: {
    fontSize: 16,
  },
});

module.exports = GesturePassword;