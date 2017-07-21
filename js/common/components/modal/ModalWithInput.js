import {
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import Modal from 'react-native-modalbox';
import { device } from '@/common/Util';
import Line from '../Line';
import TextArea from '@/common/components/TextArea';
import I18n from 'react-native-i18n';
import Image from '@/common/components/CustomImage';

const KEYBOARD_EVENT_SHOW = device.isIos ? 'keyboardWillShow' : 'keyboardDidShow';
const KEYBOARD_EVENT_HIDE = device.isIos ? 'keyboardWillHide' : 'keyboardDidHide';

export default class ModalWithInput extends Component {
  mixins: [React.addons.PureRenderMixin]
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      message: '',
      image: null,
      reason: '',
      modalJustifyContent: 'center',
    };
  }

  /** life cycle */
  componentDidMount() {
    this.keyboardWillShowListener = Keyboard.addListener(KEYBOARD_EVENT_SHOW, () => this.keyboardWillShow());
    this.keyboardWillHideListener = Keyboard.addListener(KEYBOARD_EVENT_HIDE, () => this.keyboardWillHide());
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  /** callback */

  keyboardWillShow() {
    this.setState({ modalJustifyContent: 'flex-start' });
  }

  keyboardWillHide(text) {
    this.setState({ modalJustifyContent: 'center' });
  }

  getReason() {
    return this.state.reason;
  }

  clearReason() {
    this.state.reason = '';
  }

  open(title, message, image) {
    this.setState({
      title,
      message,
      image,
    });

    this.modal.open();
  }

  close() {
    this.modal.close();
  }

  render() {
    const { animationDuration, leftButtonTitle, leftButtonPress, rightButtonTitle, rightButtonPress } = this.props;
    const { modalJustifyContent } = this.state;
    return (
      <Modal
        ref={modal => this.modal = modal}
        swipeToClose={false}
        backdropOpacity={0.4}
        animationDuration={animationDuration}
        style={[styles.modalView, { justifyContent: modalJustifyContent }]}
      >
        <View style={styles.modalInnerView}>
          <Text allowFontScaling={false} style={styles.modalTitle} numberOfLines={1}>{this.state.title}</Text>
          <View style={styles.modalMessageView}>
            <Image style={styles.modalImage} source={{ uri: this.state.image }} />
            <Text allowFontScaling={false} style={styles.modalMessage} numberOfLines={1}>{this.state.message}</Text>
          </View>
          <View style={{ flexGrow: 1 }}>
            <TextArea
              multiline
              onChangeText={(text) => this.setState({ reason: text })}
              placeholder={I18n.t('mobile.module.login.punchreasonhint')}
              placeholderTextColor={'#999'}
              containerStyle={{ width: device.width - 76 }}
              style={{ width: device.width - 102 }}
              topLine={false}
              bottomLine={false}
              fixedHeight={true}
              fixedInputHeight={95}
            />
          </View>
          <View style={styles.modalButtonView}>
            <TouchableOpacity style={styles.modalButton} onPress={leftButtonPress}>
              <Text allowFontScaling={false} style={styles.modalButtonText} numberOfLines={1}>{leftButtonTitle}</Text>
            </TouchableOpacity>
            <Line style={styles.modalLine} />
            <TouchableOpacity style={styles.modalButton} onPress={rightButtonPress}>
              <Text allowFontScaling={false} style={styles.modalButtonText} numberOfLines={1}>{rightButtonTitle}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = EStyleSheet.create({
  modalView: {
    flex: 1,
    padding: 38,
    backgroundColor: 'transparent',
  },
  modalInnerView: {
    borderRadius: 18,
    backgroundColor: '$color.white',
    '@media android': {
      height: 300,
    },
  },
  modalTitle: {
    padding: 9,
    fontSize: 21,
    color: '#333',
    alignSelf: 'center',
    marginTop: 9,
  },
  modalMessageView: {
    flexDirection: 'row',
    marginBottom: 5,
    justifyContent: 'center',
  },
  modalImage: {
    marginLeft: 35,
    width: 18,
    height: 18,
  },
  modalMessage: {
    fontSize: 14,
    color: '#999',
    marginLeft: 4,
    marginRight: 35,
  },
  modalInput: {
    marginTop: 26,
    height: 200,
    fontSize: 16,
    color: '#999',
    paddingVertical: 14,
    backgroundColor: '#F4F4F4',
    '@media android': {
      flex: 1,
      textAlignVertical: 'top',
    },
  },
  modalButtonView: {
    height: 55,
    flexDirection: 'row',
    marginBottom: 0,
  },
  modalButton: {
    height: 45,
    width: (device.width - 76) / 2 - 0.5,
    justifyContent: 'center',
  },
  modalButtonText: {
    marginHorizontal: 6,
    textAlign: 'center',
    fontSize: 18,
    color: '$color.mainColorLight',
  },
  modalLine: {
    height: 24,
    alignSelf: 'center',
    width: device.hairlineWidth,
    backgroundColor: '$color.mainColorLight',
  },
});