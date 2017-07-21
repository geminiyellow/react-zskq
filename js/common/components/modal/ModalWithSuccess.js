import {
  Text,
  View,
} from 'react-native';

import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import Modal from 'react-native-modalbox';
import { device } from '@/common/Util';
import Line from '../Line';
import I18n from 'react-native-i18n';
import Image from '@/common/components/CustomImage';

export default class ModalWithSuccess extends Component {
  mixins: [React.addons.PureRenderMixin]
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      time: '',
    };
  }

  open(title, time) {
    this.setState({
      title,
      time,
    });

    this.modal.open();
  }

  close() {
    this.modal.close();
  }

  render() {
    const { swipeToClose, animationDuration } = this.props;
    return (
      <Modal
        ref={modal => this.modal = modal}
        swipeToClose={swipeToClose}
        backdropOpacity={0.4}
        animationDuration={animationDuration}
        style={styles.modalView}
      >
        <View style={styles.modalInnerView}>
          <Image source={{ uri: 'punch_success' }} style={styles.modalImage} />
          <Text allowFontScaling={false} numberOfLines={1} style={styles.modalTitle}>{this.state.title}</Text>
          <Line style={{ marginTop: 28, width: 210, alignSelf: 'center' }} />
          <Text allowFontScaling={false} style={styles.modalTime}>{this.state.time}</Text>
          <Text allowFontScaling={false} style={styles.modalMessage}>{I18n.t('mobile.module.login.punchtime')}</Text>
        </View>
      </Modal>
    );
  }
}

const styles = EStyleSheet.create({
  modalView: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  modalInnerView: {
    borderRadius: 18,
    width: 292,
    backgroundColor: '$color.white',
    alignItems: 'center',
    alignSelf: 'center',
  },
  modalImage: {
    marginTop: 16 + 10,
    width: 80,
    height: 60,
  },
  modalTitle: {
    fontSize: 21,
    color: '#000',
    marginTop: 11 + 10 + 2,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  modalTime: {
    width: 250,
    marginTop: 16,
    fontSize: 30,
    textAlign: 'center',
    color: '$color.mainColorLight',
    fontWeight: '600',
  },
  modalMessage: {
    marginTop: 8,
    marginVertical: 8,
    fontSize: 14,
    color: '#a3a3a3',
    marginBottom: 6,
    alignSelf: 'center',
    fontWeight: '600',
  },
});