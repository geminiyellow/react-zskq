import React, {
  PureComponent,
  PropTypes,
} from 'react';

import {
  View,
  PanResponder,
} from 'react-native';
import { device } from '@/common/Util';
import { toThousands } from '@/common/Functions';
import Text from '@/common/components/TextField';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';

// 设置圆形的直径
const cicleLength = 20;

export default class Progress extends PureComponent {

  // 设置字段的类型
  static propTypes = {
    borderRadius: PropTypes.number,
    colorFirst: PropTypes.string,
    colorSecond: PropTypes.string,
    height: PropTypes.number,
    spacing: PropTypes.number,
    targetNumber: PropTypes.number,
  };

  // 设置字段的默认值
  static defaultProps = {
    borderRadius: 10,
    colorFirst: 'rgba(20,190,75,0.2)',
    height: 10,
    widthFirst: device.width,
    widthSecond: 0.5,
    spacing: 20,
    targetNumber: 1000000.00,
  };

  // 初始化
  constructor(...props) {
    super(...props);
    const { borderRadius, colorFirst, height, widthFirst, widthSecond, spacing, targetNumber } = this.props;
    this.state = {
      borderRadius,
      colorFirst,
      height,
      widthFirst,
      widthSecond,
      spacing,
      targetNumber,
      top: -15,
      left: 20,
      position: 'absolute',
    };
  }

  componentWillMount() {
    const { spacing, widthSecond } = this.state;
    const allLength = device.width - (cicleLength / 2) - spacing;
    this.setState({
      left: allLength * widthSecond,
    });
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this._top = this.state.top,
          this._left = this.state.left
      },
      onPanResponderMove: (evt, gs) => {
        if (this._left + gs.dx <= -5) {
          this.setState({
            left: 0,
            widthSecond: 0,
          });
          this.props.onRefreshText(0);
          return;
        }
        if (this._left + gs.dx >= allLength) {
          this.setState({
            left: allLength,
            widthSecond: 1,
          });
          this.props.onRefreshText(1);
          return;
        }
        this.setState({
          left: this._left + gs.dx,
          widthSecond: (this._left + gs.dx) / allLength,
        });
        this.props.onRefreshText((this._left + gs.dx) / allLength);
      },
      onPanResponderRelease: (evt, gs) => {
        if (this._left + gs.dx <= -5) {
          this.setState({
            left: 0,
            widthSecond: 0,
          });
          this.props.onRefreshText(0);
          return;
        }
        if (this._left + gs.dx >= allLength) {
          this.setState({
            left: allLength,
            widthSecond: 1,
          });
          this.props.onRefreshText(1);
          return;
        }
        this.setState({
          left: this._left + gs.dx,
          widthSecond: (this._left + gs.dx) / allLength,
        });
        this.props.onRefreshText((this._left + gs.dx) / allLength);
      }
    });
  }

  /**
   * 设置进度条的变化
   */
  onChange(targetValue, completeValue) {
    const targetValues = targetValue * 2;
    const { spacing } = this.state;
    const allLength = device.width - (cicleLength / 2) - spacing;
    const size = completeValue / targetValues;
    if (size >= 1) {
      this.setState({
        targetNumber: targetValues,
        widthSecond: 1,
        left: allLength,
      });
    } else if (size > 0 && size < 1) {
      this.setState({
        targetNumber: targetValues,
        widthSecond: completeValue / targetValues,
        left: (completeValue / targetValues) * allLength,
      });
    } else {
      this.setState({
        targetNumber: targetValues,
        widthSecond: 0,
        left: 0,
      });
    }
  }

  /**
   * 初始化数据
   */
  onInitView = (count, eachLength, marginLength) => {
    if (marginLength != undefined && marginLength != 0) {
      return (
        <View>
          {count == 1 ? <View style={[styles.scaleLine, { marginLeft: marginLength }]} /> : null}
          {count == 2 ? <View style={styles.scaleBg}><View style={[styles.scaleLine, { marginLeft: marginLength }]} /><View style={[styles.scaleLine, { marginLeft: eachLength }]} /></View> : null}
          {count == 3 ? <View style={styles.scaleBg}><View style={[styles.scaleLine, { marginLeft: marginLength }]} /><View style={[styles.scaleLine, { marginLeft: eachLength }]} /><View style={[styles.scaleLine, { marginLeft: eachLength }]} /></View> : null}
        </View>
      );
    }
    return (
      <View>
        {count == 1 ? <View style={[styles.scaleLine, { marginLeft: eachLength }]} /> : null}
        {count == 2 ? <View style={styles.scaleBg}><View style={[styles.scaleLine, { marginLeft: eachLength }]} /><View style={[styles.scaleLine, { marginLeft: eachLength }]} /></View> : null}
        {count == 3 ? <View style={styles.scaleBg}><View style={[styles.scaleLine, { marginLeft: eachLength }]} /><View style={[styles.scaleLine, { marginLeft: eachLength }]} /><View style={[styles.scaleLine, { marginLeft: eachLength }]} /></View> : null}
      </View>
    );

  }

  render() {
    const { borderRadius, height, widthFirst, widthSecond, spacing, colorFirst, targetNumber, top, left, position } = this.state;
    // 总的长度
    const length = widthFirst - spacing;
    // 渐变的背景色的长度
    const secondLength = (widthFirst - spacing) * widthSecond;
    // 每一个模块的长度
    const eachLength = length / 4;
    // 计算渐变的刻度
    let jbCount = parseInt(secondLength / eachLength);
    if (jbCount > 3) {
      jbCount = 3;
    }
    // 计算未渐变的刻度
    const njbCount = 3 - jbCount;
    // 计算距离上一刻度的长度
    const marginLength = eachLength - (secondLength - jbCount * eachLength);
    // 进度条的样式(底部)
    const progressFirstStyle = {
      height: height,
      width: widthFirst - spacing,
      backgroundColor: colorFirst,
      borderRadius: borderRadius,
    };
    // 进度条的样式(中间)
    const progressSecondStyle = {
      width: secondLength,
      height: (height > widthFirst - spacing) ? widthFirst - spacing : height,
      borderRadius: borderRadius,
    };
    return (
      <View style={styles.wrapper}>
        <View style={styles.wrapperFirst,progressFirstStyle}>
          <View style={styles.scaleBg}>
          <LinearGradient
            start={{ x: 0.0, y: 0.5 }}
            end={{ x: 0.5, y: 1.0 }}
            colors={['#89DEA5', '#14BE4B']}
            style={[styles.wrapperSecond, progressSecondStyle]}>
            {this.onInitView(jbCount, eachLength)}
          </LinearGradient>
          {this.onInitView(njbCount, eachLength, marginLength)}
        </View>
      </View>
      <View style={styles.textBg}>
        <Text style={styles.textStyle}>{`${0}.00`}</Text>
        <Text style={styles.textStyle}>{toThousands(parseFloat(targetNumber / 4).toFixed(2))}</Text>
        <Text style={styles.textStyle}>{toThousands(parseFloat(targetNumber / 2).toFixed(2))}</Text>
        <Text style={styles.textStyle}>{toThousands(parseFloat(targetNumber * 0.75).toFixed(2))}</Text>
      </View>
      <View {...this._panResponder.panHandlers} style={[styles.clBg, { top: top, left: left, position: position }]}>
        <View style={styles.linear} />
        <View style={styles.circle} />
      </View>
      </View >
    );
  }
}

const styles = EStyleSheet.create({
  wrapper: {
    marginTop: 17,
    alignSelf: 'center',
    flexDirection: 'column',
  },
  wrapperFirst: {
    alignSelf: 'center',
    flexDirection: 'row',
  },
  wrapperSecond: {
    alignSelf: 'flex-start',
  },
  scaleBg: {
    flexDirection: 'row',
  },
  textBg: {
    flexDirection: 'row',
    marginTop: 3,
  },
  textStyle: {
    flex: 1,
    textAlign: 'left',
    fontSize: 10,
    color: 'rgba(20,190,75,0.6)',
  },
  scaleLine: {
    width: 1,
    height: 8,
    marginTop: 4,
    backgroundColor: '#FFFFFF',
  },
  clBg: {
    width: 4 * cicleLength,
    height: 4 * cicleLength,
    backgroundColor: 'transparent',
  },
  linear: {
    width: 1,
    height: 9,
    marginLeft: 9,
    backgroundColor: 'rgba(22,191,76,1)',
  },
  circle: {
    width: cicleLength,
    height: cicleLength,
    borderRadius: cicleLength,
    backgroundColor: 'rgba(255,255,255,1)',
    shadowColor: '#14BE4B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
});
