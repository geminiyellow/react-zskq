import { ScrollView } from 'react-native';
import React, { PureComponent } from 'react';

import EStyleSheet from 'react-native-extended-stylesheet';
import NavBar from '@/common/components/NavBar';
import I18n from 'react-native-i18n';
import Modal from 'react-native-modalbox';
import { device } from '@/common/Util';

import Image from '@/common/components/CustomImage';

// 删除图片
const deleteImg = 'delete';
// 附件地址默认值
const defaultImgUri = 'GaiaWorks';

export default class LeaveAttDetailPicker extends PureComponent {

  constructor(...props) {
    super(...props);
    this.state = {
      imgUri: this.props.imgUri,
    };
  }

  // 打开附件详情
  onShowAttDetail(AttUri, imgBase64) {
    Image.getSize(AttUri, (width, height) => {
      this.setState({
        imgUri: AttUri,
      });
    }, (error) => {
      this.setState({
        imgUri: `data:image/jpeg;base64,${imgBase64}`,
      });
    });

    this.attDetailmodal.open();
  }

  // 关闭附件详情
  onCloseAttDetail() {
    this.setState({
      imgUri: defaultImgUri,
    });
    this.attDetailmodal.close();
  }

  render() {
    return (
      <Modal
        ref={modal => this.attDetailmodal = modal}
        style={styles.attDetailModalStyle}
        swipeToClose={false} animationDuration={300} backdropOpacity={0.5}>

        <NavBar
          title={I18n.t('mobile.module.leaveapply.leaveapplyattdetail')}
          onPressLeftButton={() => this.onCloseAttDetail()}
          rightContainerLeftImage={{ uri: deleteImg }}
          onPressRightContainerLeftButton={() => {
            const { onDeleteAttModal } = this.props;
            onDeleteAttModal();
          }} />

        <ScrollView style={{ flexGrow: 1 }}>
          <Image
            source={{ uri: this.state.imgUri }}
            style={{ width: device.width, height: device.height, resizeMode: Image.resizeMode.contain, flexDirection: 'column', alignSelf: 'center' }} />
        </ScrollView>
      </Modal>
    );
  }
}

const styles = EStyleSheet.create({
  attDetailModalStyle: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
});