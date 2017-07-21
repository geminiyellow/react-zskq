import {
  DeviceEventEmitter,
  View,
} from 'react-native';
import React, { PureComponent } from 'react';

import I18n from 'react-native-i18n';
import { device } from '@/common/Util';
import Line from '@/common/components/Line';
import _ from 'lodash';

import Attach from './../../components/item/AttachItem';

export default class SectionAttachment extends PureComponent {

  // 初始化模态弹出层
  constructor(...props) {
    super(...props);
    // 从个人信息中获取 附件 是否可以上传
    if (!_.isEmpty(global.loginResponseData)) {
      if (global.loginResponseData.SysParaInfo.LeaveAttachmentAmount === '0') {
        this.isLeaveApplyAttachUploadLimit = false;
      }
      if (global.loginResponseData.SysParaInfo.LeaveAttachmentAmount === '1') {
        this.isLeaveApplyAttachUploadLimit = true;
        this.isLeaveApplyAttachUploadAmountLimit = true;
      }
      if (global.loginResponseData.SysParaInfo.LeaveAttachmentAmount === '2') {
        this.isLeaveApplyAttachUploadLimit = true;
        this.isLeaveApplyAttachUploadAmountLimit = false;
      }
    }
  }

  shouldComponentUpdate() {
    this.attach.onInitAttShow(this.isLeaveApplyAttachUploadLimit);
    this.attViewArr = [];
    this.attViewBase64Arr = [];
    this.attViewUriArr = [];
    return true;
  }

  loadData = (response) => {
    if (!response.length) {
      this.attViewArr.push(response);
      this.attViewUriArr.push(response.path);
      this.attViewBase64Arr.push(response.data);
    } else {
      for (let i = 0; i < response.length; i += 1) {
        if (this.attViewArr.length <= 4) {
          this.attViewArr.push(response[i]);
          this.attViewUriArr.push(response[i].path);
          this.attViewBase64Arr.push(response[i].data);
        }
      }
    }
    if (this.attViewArr.length >= 1) {
      this.attach.onInitAttDescShow(false);
    }
    if (this.attViewArr.length <= 0) {
      this.attach.onInitAttDescShow(true);
    }
    if (this.attViewArr.length > 4) {
      this.attach.onInitAttAddShow(false);
    } else {
      this.attach.onInitAttAddShow(!this.isLeaveApplyAttachUploadAmountLimit);
    }
    this.attach.onInitAttListData(this.attViewArr);
  }

  // 刷新附件数据源
  onRefreshAttDataSources(attIndex) {
    // 删除数组中的图片数据
    this.attViewArr.splice(attIndex, 1);
    this.attViewBase64Arr.splice(attIndex, 1);
    this.attViewUriArr.splice(attIndex, 1);
    if (!this.attach) {
      return;
    }
    // 清空datasource
    if (!this.attach.isAttListViewDataSourceesEmpty()) {
      this.attach.onRefreshAttListDataSources();
    }
    // 显示附件说明文字
    if (this.attViewArr.length <= 0) {
      this.attach.onInitAttDescShow(true);
    }

    // 当删除第5张图片时 显示添加按钮图片
    if (this.attViewArr.length == 4 || this.attViewArr.length == 0) {
      this.attach.onInitAttAddShow(true);
    }
    this.attach.onInitAttListData(this.attViewArr);
  }

  onExportLeaveAttUriArr() {
    return this.attViewUriArr;
  }

  onExportLeaveAttBase64Arr() {
    return this.attViewBase64Arr;
  }

  render() {
    return (
      <View>
        <Attach
          ref={attach => this.attach = attach}
          isAttShow={false}
          isAttAddShow
          isAttDescShow
          addImage={() => {
            const { open } = this.props;
            open(!this.isLeaveApplyAttachUploadAmountLimit);
          }}
          showImage={(rowId) => {
            const { onShowAttDetail } = this.props;
            onShowAttDetail(rowId);
          }} />
        <Line />
      </View>
    );
  }
}