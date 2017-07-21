import React, { Component } from 'react';

import ModalWithImage from '@/common/components/modal/ModalWithImage';
import I18n from 'react-native-i18n';

export default class LeaveCameraAccess extends Component {
  mixins: [React.addons.PureRenderMixin]

  constructor(...props) {
    super(...props);
    this.state = {
      isCamera: 1,
    };
  }

  // 打开相机权限设置对话框
  onOpenCameraAccess(isPickerFromCamera) {
    if (isPickerFromCamera === 1) {
      this.setState({
        isCamera: 1,
      });
    }
    if (isPickerFromCamera === 2) {
      this.setState({
        isCamera: 2,
      });
    }
    this.cameraAlert.open();
  }

  render() {
    if (this.state.isCamera === 1) {
      return (
        <ModalWithImage
          ref={ref => { this.cameraAlert = ref; }} title={I18n.t('AccountCameraTitle')}
          subTitle={I18n.t('AccountCameraSubTitle')} topButtonTitle={I18n.t('"mobile.module.clock.getit"')}
          topButtonPress={() => { this.cameraAlert.close(); }}
          bottomButtonTitle={I18n.t('AccountCameraReject')}
          bottomButtonPress={() => { this.cameraAlert.close(); }}
        />
      );
    }
    if (this.state.isCamera === 2) {
      return (
        <ModalWithImage
          ref={ref => { this.libraryAlert = ref; }} title={I18n.t('AccountLibraryTitle')}
          subTitle={I18n.t('AccountLibrarySubTitle')} topButtonTitle={I18n.t('"mobile.module.clock.getit"')}
          topButtonPress={() => { this.libraryAlert.close(); }}
          bottomButtonTitle={I18n.t('AccountCameraReject')}
          bottomButtonPress={() => { this.libraryAlert.close(); }}
        />
      );
    }
  }
}