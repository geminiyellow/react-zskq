/**
 * 强制更新 modal提示框
 */
import {
  NativeModules,
  Text,
  View,
  ListView,
} from 'react-native';

import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import Modal from 'react-native-modalbox';
import * as Animatable from 'react-native-animatable';
import { device } from '@/common/Util';
import I18n from 'react-native-i18n';
import { appVersion } from '@/common/Consts';
import TouchableHighlight from '@/common/components/CustomTouchableHighlight';
import Image from '@/common/components/CustomImage';
import Button from '@/common/components/Button';

const { RNManager } = NativeModules;
const fingerGreen = 'finger_green';
const fingerRed = 'finger_red';

export default class TryAgainModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imageShow: fingerGreen,
      title: '掌上考勤的指纹',
    };
    this.isOpen = false;
  }

  componentDidMount() {
  }

  isOpen() {
    return this.isOpen;
  }

  onPress() {
    this.modalbox.close();
    this.isOpen = false;
  }

  close() {
    this.modalbox.close();
    this.isOpen = false;
  }

  open() {
    this.setState({
      imageShow: fingerGreen,
      title: '掌上考勤的指纹',
    });
    this.modalbox.open();
    this.isOpen = true;
  }

  changeState() {
    this.setState({
      imageShow: fingerRed,
      title: '再试一次',
    });
   this.titleAnimatable.shake();
  }

  changeStateWait(str) {
    this.setState({
      imageShow: fingerRed,
      title: str,
    });
   this.titleAnimatable.shake();
  }

  changeStateRestart() {
    this.setState({
      imageShow: fingerGreen,
      title: '掌上考勤的指纹',
    });
  }

  inflateItem(rowData, sectionID, rowID, highlightRow) {
    return (
      <Text allowFontScaling={false} style={styles.updatelistStyle}>{rowData}</Text>
    );
  }

  renderTitle() {
    const { title } = this.state;

    if (title == '掌上考勤的指纹') {
      return (
        <Text allowFontScaling={false} style={styles.titleStyle}>{title}</Text>
      );
    }

    return (
      <Animatable.Text ref={titleAnimatable => this.titleAnimatable = titleAnimatable} allowFontScaling={false} animation="shake" iterationCount={1} direction="alternate" style={styles.titleStyle}>
        {title}
      </Animatable.Text>
    );
  }

  render() {
    const { imageShow, title } = this.state;
    return (
      <Modal
        ref={modal => this.modalbox = modal}
        swipeToClose={false}
        backdropOpacity={0.4}
        animationDuration={0}
        style={styles.modalView}
        onClosed={() => {
        }}
      >
        <View style={styles.modalInnerView}>
          <Image style={styles.image} source={{ uri: imageShow }} />
          {this.renderTitle()}
          <Text allowFontScaling={false} style={styles.updateDetail}>请使用已认证指纹</Text>
          <View style={styles.line} />
          <TouchableHighlight style={styles.touchable} onPress={() => this.onPress()}>
            <Text style={styles.textDownload}>取消</Text>
          </TouchableHighlight>
        </View>
      </Modal>
    );
  }
}

const styles = EStyleSheet.create({
  titleStyle: {
    color: '#030303',
    fontWeight: 'bold',
    fontSize: 17,
    marginTop: 8,
    alignSelf: 'center',
    textAlign: 'center',
  },
  updateDetail: {
    color: '#030303',
    fontSize: 13,
    marginTop: 8,
    alignSelf: 'center',
    textAlign: 'center',
  },
  cententStyle: {
    fontSize: 12,
    color: '#666666',
  },
  updatelistStyle: {
    fontSize: 14,
    color: '#999999',
  },
  modalView: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalInnerView: {
    borderRadius: 12,
    backgroundColor: '$color.white',
    alignSelf: 'center',
    justifyContent: 'center',
    width: device.width - 104,
    alignItems: 'center',
  },
  line: {
    marginTop: 16,
    backgroundColor: '$color.line',
    width: device.width - 104,
    height: device.hairlineWidth,
  },
  textDownload: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 17,
    color: '#0076FF',
    textAlign: 'center',
  },
  touchable: {
    width: 200,
    height: 38,
  },

  image: {
    marginTop: 20,
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
});