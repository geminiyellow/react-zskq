import {
  TouchableOpacity,
  View,
} from 'react-native';

import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import Modal from 'react-native-modalbox';
import Image from '@/common/components/CustomImage';
import Line from '@/common/components/Line';
import Text from '@/common/components/TextField';
import { device } from '@/common/Util';

export default class ModalWithImage extends Component {
  mixins: [React.addons.PureRenderMixin]

  open() {
    this.modal.open();
  }

  close() {
    this.modal.close();
  }

  render() {
    const { title, subTitle, image, animationDuration, topButtonPress, topButtonTitle, bottomButtonPress, bottomButtonTitle, swipeToClose } = this.props;
    let imgTitle = (
      <Text numberOfLines={1} style={styles.modalTitleStyle}>{title}</Text>
    );
    if (image) {
      imgTitle = (
        <Image source={{ uri: image }} style={styles.modalImage} />
      );
    }

    return (
      <Modal
        ref={modal => this.modal = modal}
        swipeToClose={swipeToClose}
        backdropOpacity={0.4}
        animationDuration={animationDuration}
        style={styles.modalView}
      >
        <View style={styles.modalInnerView}>
          {imgTitle}
          <Text style={styles.modalMessage}>{subTitle}</Text>
          <Line style={styles.lineStyle} />
          <TouchableOpacity
            style={styles.buttonOkStyle}
            onPress={topButtonPress}>
            <Text style={styles.modalOk}>{topButtonTitle}</Text>
          </TouchableOpacity>
          <Line style={styles.lineStyle} />
          <TouchableOpacity
            style={styles.buttonCancleStyle}
            onPress={bottomButtonPress}>
            <Text style={styles.modalCancle}>{bottomButtonTitle}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

const styles = EStyleSheet.create({
  modalView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 38,
    backgroundColor: 'transparent',
  },
  modalInnerView: {
    borderRadius: 4,
    backgroundColor: '$color.white',
  },
  modalImage: {
    height: 43,
    width: 51,
    borderRadius: 4,
    marginTop: 22,
    marginBottom: 10,
    alignSelf: 'center',
  },
  modalTitleStyle: {
    fontWeight: 'bold',
    fontSize: 21,
    marginTop: 36,
    marginBottom: 21,
    width: device.width - 112,
    textAlign: 'center',
    alignSelf: 'center',
    color: '#000',
  },
  modalMessage: {
    fontSize: 18,
    width: device.width - 190,
    textAlign: 'center',
    color: '#333',
    marginBottom: 21,
    marginLeft: 36,
    marginRight: 36,
    alignSelf: 'center',
  },
  lineStyle: {
    alignSelf: 'center',
    width: 210,
  },
  buttonOkStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: 44,
  },
  buttonCancleStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: 46,
  },
  modalOk: {
    color: '#14be4b',
    fontWeight: 'bold',
    fontSize: 21,
    width: device.width - 112,
    textAlign: 'center',
    alignSelf: 'center',
  },
  modalCancle: {
    color: '#14be4b',
    fontSize: 18,
    width: device.width - 112,
    textAlign: 'center',
    alignSelf: 'center',
  },
});
