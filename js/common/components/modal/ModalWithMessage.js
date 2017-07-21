import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import Modal from 'react-native-modalbox';
import Line from '@/common/components/Line';
import I18n from 'react-native-i18n';

export default class ModalWithMessage extends Component {
  mixins: [React.addons.PureRenderMixin]

  open() {
    this.modal.open();
  }

  close() {
    this.modal.close();
  }

  render() {
    const { title, message } = this.props;
    return (
      <Modal
        ref={modal => this.modal = modal}
        swipeToClose
        backdropOpacity={0.4}
        animationDuration={0}
        style={styles.modalView}
      >
        <View style={styles.modalInnerView}>
          <Text style={styles.modalTitleStyle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <Line style={styles.lineStyle} />
          <TouchableOpacity
            style={styles.buttonOkStyle}
            onPress={() => {
              const { confirmPress } = this.props;
              confirmPress();
            }}>
            <Text style={styles.modalOk}>{I18n.t('mobile.module.onbusiness.confirmbuttontext')}</Text>
          </TouchableOpacity>
          <Line style={styles.lineStyle} />
          <TouchableOpacity
            style={styles.buttonCancleStyle}
            onPress={() => {
              const { canclePress } = this.props;
              canclePress();
            }}>
            <Text style={styles.modalCancle}>{I18n.t('mobile.module.onbusiness.cancelbuttontext')}</Text>
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
  modalTitleStyle: {
    fontWeight: 'bold',
    fontSize: 21,
    marginTop: 36,
    alignSelf: 'center',
    color: '#000',
  },
  modalMessage: {
    fontSize: 18,
    color: '#333',
    marginTop: 21,
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
    alignSelf: 'center',
  },
  modalCancle: {
    color: '#14be4b',
    fontSize: 18,
    alignSelf: 'center',
  },
});