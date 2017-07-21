/**
 * 加班申请表单附件详情界面
 */

import { ScrollView } from 'react-native';
import React, { PureComponent } from 'react';
import I18n from 'react-native-i18n';
import Modal from 'react-native-modalbox';
import Image from '@/common/components/CustomImage';
import NavBar from '@/common/components/NavBar';
import { device } from '@/common/Util';
import { attachDelete, attachmentNumber } from '../constants';

export default class AttachmentDetail extends PureComponent {

  constructor(...props) {
    super(...props);
    // 获取传过来的数据
    const { attImageUrl, attachParams } = this.props;
    this.state = {
      attImageUrlS: attImageUrl,
      attachParamsS: attachParams,
    };
    // 定义附件图片数组
    this.attViewArr = [];
    // 定义附件URI数组
    this.attViewUriArr = [];
    // 定义附件图片Base64数组
    this.attViewBase64Arr = [];
  }

  // 打开附件，显示附件信息
  onScaleAttModal(rowID, attachParamsS) {
    // 信息初始化
    this.attViewArr = [];
    this.attViewUriArr = [];
    this.attViewBase64Arr = [];
    // 附件信息初始化
    const { attViewArr, attViewUriArr, attViewBase64Arr } = attachParamsS;
    this.attViewArr = attViewArr;
    this.attViewUriArr = attViewUriArr;
    this.attViewBase64Arr = attViewBase64Arr;
    // attImageUrlS 赋值
    Image.getSize(this.attViewUriArr[rowID], (width, height) => {
      this.setState({
        attImageUrlS: this.attViewUriArr[rowID],
      });
    }, (error) => {
      this.setState({
        attImageUrlS: `data:image/jpeg;base64,${this.attViewBase64Arr[rowID]}`,
      });
    });
    // 设置要删除的附件下标
    this.attIndex = rowID;
    this.modalImages.open();
  }

  // 打开附件，删除附件信息
  onDeleteAttModal = () => {
    // 删除数组中的图片数据
    this.attViewArr.splice(this.attIndex, 1);
    this.attViewUriArr.splice(this.attIndex, 1);
    this.attViewBase64Arr.splice(this.attIndex, 1);
    // 更新附件的数据源
    const { onSetRefreshListView } = this.props;
    onSetRefreshListView(this.attViewArr);
    // 当删除第5张图片或者是第一张图片 显示添加按钮图片
    if (this.attViewArr.length === attachmentNumber - 1 || this.attViewArr.length === 0) {
      const { onSetIsApplyAttachShow } = this.props;
      onSetIsApplyAttachShow(true);
    }
    this.onClose();
  }

  onClose() {
    this.modalImages.close();
    this.setState({ attImageUrlS: 'attImageUrlS' });
  }

  render() {
    const { attImageUrlS } = this.state;
    return (
      <Modal
        style={{ top: 0, right: 0, bottom: 0, left: 0, overflow: 'hidden', backgroundColor: 'rgba(0, 0, 0, 0.5)', flexDirection: 'column' }}
        ref={box => this.modalImages = box}
        swipeToClose={false} animationDuration={1} backdropOpacity={0.4} >
        <NavBar title={I18n.t('mobile.module.overtime.overtimeapplyattachmentdetails')} onPressLeftButton={() => this.onClose()} rightContainerLeftImage={{ uri: attachDelete }} onPressRightContainerLeftButton={() => { this.onDeleteAttModal() }} />
        <ScrollView>
          <Image
            source={{ uri: attImageUrlS }}
            style={{
              width: device.width, height: device.height, resizeMode: Image.resizeMode.contain, flexDirection: 'column', alignSelf: 'center',
            }} />
        </ScrollView>
      </Modal>
    );
  }
}