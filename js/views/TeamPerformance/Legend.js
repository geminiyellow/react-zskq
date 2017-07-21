import React from 'react';
import { DeviceEventEmitter, Image, NativeModules, StatusBar, Text, TouchableHighlight, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';
import HorizontalLineChart from './HorizontalLineChart';
import { DEVICE_ORIENTATION_CHANDED, NATIVE_DEVICE_DID_CHANGE_LISTENER } from './constant';

const organizationComplete = 'chart_legend_completed_icon';
const organizationTarget = 'chart_legend_target_icon';
const landscape = 'landscape';
const portrait = 'portrait';

const SPACE_WIDTH = 50;
const { RNManager } = NativeModules;

export default class Legend extends React.Component {
  static defaultProps = {
    // 完成值Name
    completedName: '',
    // 目标值Name
    targetName: '',
  };

  constructor(props) {
    super(props);
    this.isLandscape = false;
    this.state = {
      rotateImage: landscape,
      isLandscape: false,
    };
  }

  /** Life cycle */

  componentDidMount() {
    const { onRotateScreen } = this.props;
    this.nativeDeviceOrientationListener = DeviceEventEmitter.addListener(NATIVE_DEVICE_DID_CHANGE_LISTENER, (data) => {
      let deviceOrientation;
      if (device.isIos) {
        deviceOrientation = data.orientation;
      } else {
        const tempData = JSON.parse(data);
        if (tempData) {
          deviceOrientation = tempData.orientation;
        }
      }
      if (deviceOrientation === 'landscape') {
        // 横屏
        this.setState({
          rotateImage: portrait,
          isLandscape: true,
        });
        this.isLandscape = true;
        StatusBar.setHidden(true);
      } else {
        // 竖屏
        this.setState({
          rotateImage: landscape,
          isLandscape: false,
        });
        this.isLandscape = false;
        StatusBar.setHidden(false);
      }
      DeviceEventEmitter.emit(DEVICE_ORIENTATION_CHANDED, this.isLandscape);
      if (onRotateScreen) {
        onRotateScreen(this.isLandscape);
      }
    });
  }

  componentWillUnmount() {
    this.nativeDeviceOrientationListener.remove();
  }
  /** Callback */

  onPressRotateBtn() {
    const { rotateImage } = this.state;
    const { onRotateScreen } = this.props;
    if (rotateImage === landscape) {
      // 竖屏切换到横屏
      RNManager.rotateScreenLandscape();
    } else {
      // 横屏切换到竖屏
      RNManager.rotateScreenPortrait();
    }
  }

  /** Render Method */

  render() {
    const { rotateImage, isLandscape } = this.state;
    const { completedName, targetName } = this.props;
    return (
      <View style={styles.container}>
        {isLandscape ? null : <View style={styles.leftView}/>}
        <View style={[styles.legendView, { marginLeft: isLandscape ? 24 : 0 }]}>
          {this.renderLegendTitle()}
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.legendView1}>
              <Image style={styles.complete} source={{ uri: organizationComplete}}/>
              <Text allowFontScaling={false} style={styles.title}>{completedName}</Text>
            </View>
            <View style={styles.legendView2}>
              <Image style={styles.target} source={{ uri: organizationTarget }}/>
              <Text allowFontScaling={false} style={styles.title}>{targetName}</Text>
            </View>
          </View>
        </View>
        <TouchableHighlight
          onPress={() => this.onPressRotateBtn()}
          activeOpacity={0.5}
          underlayColor="transparent"
          style={styles.rightView}>
          <Image style={styles.rotate} source={{ uri: rotateImage }}/>
        </TouchableHighlight>
      </View>
    );
  }

  // 加载图例顶部标题
  renderLegendTitle() {
    const { isLandscape } = this.state;
    if (!isLandscape) {
      return null;
    }
    return (
      <View style={styles.legendTitleView}>
        <Text
          style={styles.legendTitleText}
          allowFontScaling={false}>组织指标走势图</Text>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 10,
    color: '#999999',
  },
  legendView: {
    flex: 1,
  },
  legendView1: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendView2: {
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  complete: {
    marginTop: 3,
    width: 32,
    height: 22,
  },
  target: {
    marginTop: 3,
    width: 32,
    height: 22,
  },
  rotate: {
    width: 22,
    height: 22,
  },
  leftView: {
    width: SPACE_WIDTH,
  },
  rightView: {
    width: SPACE_WIDTH,
    height: 30,
    alignItems: 'flex-end',
    paddingRight: 12,
    marginBottom: 8,
  },
  legendTitleView: {
    marginBottom: 5,
  },
  legendTitleText: {
    fontSize: 18,
    color: '#333333',
  },
});