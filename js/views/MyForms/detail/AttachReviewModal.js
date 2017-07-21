/**
 *  附件预览
 */
import React, { PureComponent } from 'react';
import { device } from '@/common/Util';
import Image from '@/common/components/CustomImage';
import Modal from 'react-native-modalbox';

export default class AttachReviewModal extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      url: '',
    };
  }

  open=(imgurl) => {
    this.modalbox.open();
    this.setState({
      url: imgurl,
    });
  }

  render() {
    return (
      <Modal
        style={{ height: 300 }}
        position={'center'}
        swipeToClose={true}
        animationDuration={0}
        backdropPressToClose={true}
        backdropOpacity={0.8}
        ref={box => this.modalbox = box}
        onClosed={() => {
          const { modalclosed } = this.props;
          modalclosed();
        }}
        >
        <Image style={{ width: device.width, height: 300, resizeMode: Image.resizeMode.contain }} source={{ uri: this.state.url }} />
      </Modal>
    );
  }
}

