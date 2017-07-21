import React, { Component } from 'react';
import {
  Animated,
  Text,
 } from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import Camera from 'react-native-camera';

import { device } from '@/common/Util';
import NavBar from '@/common/components/NavBar';
import UserShiftInfo from '@/views/MobileCheckIn/components/UserShiftInfo';
import Image from '@/common/components/CustomImage';

const backImg = 'qr_login_bg';
const leftBack = 'back_white';
const QRImageTop = 'qr_login_top';
const QRImageBottom = 'qr_login_bottom';
const scanLine = 'scan_line';

export default class CameraForQr extends Component {
  mixins: [React.addons.PureRenderMixin]
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
      shouldLineUp: false,
    };
  }

  componentDidMount() {
    this.animationStart();
    this.timeInterval = setInterval(() => {
      this.animationStart();
    }, 3400);
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
  }

  animationStart() {
    let value = (268 / 375) * device.width - 9;

    Animated.timing(
      this.state.fadeAnim,
      { toValue: value,
        duration: 3200 }
    ).start(() => {
      this.setState({ fadeAnim: new Animated.Value(0) });
    });
  }

  render() {
    const { title, navBackgroundColor, navigator, textTop, textBottom, showShift, onBarCodeRead, backViews } = this.props;
    return (
      <Camera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={styles.camera}
        captureAudio={false}
        aspect={Camera.constants.Aspect.fill}
        defaultTouchToFocus
        onBarCodeRead={(ret) => onBarCodeRead(ret)}
      >

        <Image style={styles.imageTop} source={{ uri: QRImageTop }}>
          <NavBar
            title={title}
            titleColor="#FFF"
            barStyle="light-content"
            backgroundColor={navBackgroundColor}
            lineColor={navBackgroundColor}
            backImage={leftBack}
            onPressLeftButton={() => backViews()} />
          {showShift ? <UserShiftInfo /> : null}
          <Text style={styles.textTop}>{textTop}</Text>
          <Text style={styles.text}>{textBottom}</Text>
        </Image>

        <Image style={styles.image} source={{ uri: backImg }}>
          <Animated.Image style={[styles.imageScanLine, { marginTop: this.state.fadeAnim }]} source={{ uri: scanLine }}>
          </Animated.Image>
        </Image>

        <Image style={styles.imageBottom} source={{ uri: QRImageBottom }} />
      </Camera>
    );
  }
}

const styles = EStyleSheet.create({
  camera: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  image: {
    width: device.width,
    height: (268 / 375) * device.width,
    backgroundColor: 'transparent',
    resizeMode: 'contain',
  },
  imageTop: {
    width: device.width,
    // height: 170,
    backgroundColor: 'transparent',
  },
  imageBottom: {
    width: device.width,
    height: device.height - 150 - ((268 / 375) * device.width),
  },

  textTop: {
    marginTop: 50,
    fontSize: 16,
    alignSelf: 'center',
    color: '$color.mainColorLight',
  },
  text: {
    alignSelf: 'center',
    textAlign: 'center',
    width: 280,
    marginTop: 8,
    marginBottom: 10,
    fontSize: (16 / 375) * device.width,
    color: 'white',
    opacity: 0.87,
  },
  imageScanLine: {
    alignSelf: 'center',
    width: 240,
    height: 9,
    resizeMode: 'cover',
  },
});