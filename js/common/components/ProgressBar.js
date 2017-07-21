import React, {
    PureComponent,
    PropTypes,
} from 'react';

import {
  View,
} from 'react-native';
import { device } from '../Util';

export default class ProgressBar extends PureComponent {

    // 设置字段的类型
  static propTypes = {
    borderRadius: PropTypes.number,
    colorFirst: PropTypes.string,
    colorSecond: PropTypes.string,
    colorThird: PropTypes.string,
    height: PropTypes.number,
    spacing: PropTypes.number,
  };

    // 设置字段的默认值
  static defaultProps = {
    borderRadius: 15,
    colorFirst: '#cccccc',
    colorSecond: '#14BE4B',
    colorThird: '#10c64b',
    height: 16,
    widthFirst: device.width,
    widthSecond: 0,
    widthThird: 0,
    spacing: 20,
  };

  mixins: [React.addons.PureRenderMixin]

   // 初始化
  constructor(props) {
    super(props);
    const { borderRadius, colorFirst, colorSecond, colorThird, height, widthFirst, widthSecond, widthThird, spacing } = this.props;
    this.state = {
      borderRadius,
      colorFirst,
      colorSecond,
      colorThird,
      height,
      widthFirst,
      widthSecond,
      widthThird,
      spacing,
    };
  }

  // 加载数据
  onResetData(widthSecondr, widthThirdr, spacingr) {
    this.setState({
      widthSecond: widthSecondr,
      widthThird: widthThirdr,
      spacing: spacingr,
    });
  }

  render() {
    const progressFirstStyle = {
      height: this.state.height,
      width: this.state.widthFirst - this.state.spacing,
      backgroundColor: this.state.colorFirst,
      borderRadius: this.state.borderRadius,
    };

    const progressSecondStyle = {
      height: this.state.height,
      width: (this.state.widthFirst - this.state.spacing) * this.state.widthSecond,
      backgroundColor: this.state.colorSecond,
      borderRadius: this.state.borderRadius,
    };

    const progressThitdStyle = {
      height: this.state.height,
      width: (this.state.widthFirst - this.state.spacing) * this.state.widthThird,
      backgroundColor: this.state.colorThird,
      borderRadius: this.state.borderRadius,
    };

    return (
      <View style={progressFirstStyle} >
        <View style={progressSecondStyle} >
          <View style={progressThitdStyle} />
        </View>
      </View>
        );
  }
}
