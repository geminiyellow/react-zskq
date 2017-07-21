import {
  ScrollView,
  View,
} from 'react-native';
import React, { PureComponent } from 'react';

import EStyleSheet from 'react-native-extended-stylesheet';
import NavigationBar from '@/common/components/NavigationBar';
import NavBarLeftBack from '@/common/components/NavBarLeftBack';
import NavBarRightOneIcon from '@/common/components/NavBarRightOneIcon';
import I18n from 'react-native-i18n';
import Modal from 'react-native-modalbox';
import { device } from '@/common/Util';
import Image from '@/common/components/CustomImage';
import LeavePicker from './PickerWheel';

// navigationBar 左边返回按钮图片
const leftBack = 'left_back';
// 删除图片
const deleteImg = 'delete';

export default class Picker extends PureComponent {

  constructor(...props) {
    super(...props);
    this.state = {
      imgUri: this.props.imgUri,
    };
  }

  // 显示picker加载数据源
  onInitLeaveTypePickerData(isShow, dataSource) {
    if (!this.leaveTypePicker) {
      return;
    }
    this.leaveTypePicker.onInitTypePicker(isShow, dataSource);
  }

  // 初始化请假模式弹出框
  onInitLeaveModalPicker(leaveModalPickerData) {
    if (!this.leaveModalPicker) {
      return;
    }
    this.leaveModalPicker.onInitModalPicker(true, leaveModalPickerData);
  }

  onInitLeaveReasonPickerData(dataSource) {
    if (!this.leaveReasonPicker) {
      return;
    }
    this.leaveReasonPicker.onInitReasonPicker(true, dataSource);
  }

  // 弹出picker
  onShowLeaveReasonPicker() {
    this.leaveReasonPicker.onShowReasonPicker();
  }

  // 弹出picker
  onShowLeaveTypePicker() {
    this.leaveTypePicker.onShowTypePicker();
  }

  // 弹出请假模式picker
  onShowLeaveModalPicker() {
    this.leaveModalPicker.onShowModalPicker();
  }

  // 打开附件详情
  onShowAttDetail(AttUri) {
    // 刷新附件uri
    this.setState({
      imgUri: AttUri,
    });

    this.attDetailmodal.open();
  }

  // 关闭附件详情
  onCloseAttDetail() {
    this.attDetailmodal.close();
  }

  // 刷新选中的值
  onRefreshLeaveTypeSelectValue(selectValue) {
    if (!this.leaveTypePicker) {
      return;
    }
    this.leaveTypePicker.onFreshLeaveTypeSelectData(selectValue);
  }

  onRefreshLeaveModalSelectValue(selectValue) {
    if (!this.leaveModalPicker) {
      return;
    }
    this.leaveModalPicker.onFreshLeaveModalSelectData(selectValue);
  }

  onRefreshLeaveReasonSelectValue(selectValue) {
    if (!this.leaveReasonPicker) {
      return;
    }
    this.leaveReasonPicker.onFreshLeaveReasonSelectData(selectValue);
  }

  render() {
    return (
      <View>
        <LeavePicker
          ref={picker => this.leaveTypePicker = picker}
          itemType={'4'}
          leaveTypePickerData={''}
          isTypePickerShow={false}
          onPickerDone={(pickedValue) => {
            const { onLeaveTypePicked } = this.props;
            onLeaveTypePicked(pickedValue);
          }} />
        <LeavePicker
          ref={picker => this.leaveModalPicker = picker}
          itemType={'5'}
          leaveModalPickerData={''}
          isModalPickerShow={false}
          onPickerDone={(pickedValue) => {
            const { onLeaveModalPicked } = this.props;
            onLeaveModalPicked(pickedValue);
          }} />
        <LeavePicker
          ref={picker => this.leaveReasonPicker = picker}
          itemType={'6'}
          leaveReasonPickerData={''}
          isReasonPickerShow={false}
          onPickerDone={(pickedValue) => {
            const { onLeaveReasonPicked } = this.props;
            onLeaveReasonPicked(pickedValue);
          }} />
        <Modal
          ref={modal => this.attDetailmodal = modal}
          style={styles.attDetailModalStyle}
          swipeToClose={false} animationDuration={300} backdropOpacity={0.5}>

          <NavigationBar
            style={{ width: device.width, alignItems: 'center' }}
            title={{ title: I18n.t('mobile.module.leaveapply.leaveapplyattdetail') }}
            leftButton={<NavBarLeftBack
              onPress={() => this.onCloseAttDetail()}
              leftImg={leftBack} />}
            rightButton={
              <NavBarRightOneIcon
                onPress={() => {
                  const { onDeleteAttModal } = this.props;
                  onDeleteAttModal();
                }}
                rightImg={deleteImg} />
            } />
          <ScrollView style={{ flexGrow: 1 }}>
            <Image
              source={{ uri: this.state.imgUri }}
              style={{ width: device.width, height: device.height, resizeMode: Image.resizeMode.contain, flexDirection: 'column', alignSelf: 'center' }} />
          </ScrollView>
        </Modal>
      </View>
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