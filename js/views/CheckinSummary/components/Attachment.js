/**
 * 异常申请表单附件界面
 */

import {
  ListView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import I18n from 'react-native-i18n';
import Image from '@/common/components/CustomImage';
import Text from '@/common/components/TextField';
import styles from '@/views/OvertimeApply/styles';
import {
  attachmentNumber,
  attachmentNone,
  attachmentSingle,
  attachmentMultiple,
  attachAdd,
} from '../constants';

export default class Attachment extends PureComponent {
  constructor(...props) {
    super(...props);
    this.onInitialization();
    this.state = {
      // 附件显示
      isApplyAttachShow: this.isApplyAttachUploadLimit,
      // 记录附件的数据源
      attDataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      attDataSourceTemp: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      // 添加照片
      attDescription: true,
    };
  }

  // 数据信息的初始化
  onInitialization() {
    // 附件上传限制 默认不可以上传
    this.isApplyAttachUploadLimit = false;
    // 在允许上传的情况下 默认只能上传一张 == 附件上传 个数限制 多张上传 默认最多上传5张
    this.isApplyAttachUploadAmountLimit = true;
    // 定义附件图片数组
    this.attViewArr = [];
    // 定义附件图片Base64数组
    this.attViewBase64Arr = [];
    // 定义附件URI数组
    this.attViewUriArr = [];
    // 附件限制信息
    const { ExceptionAttachmentAmount } = !_.isEmpty(
      global.loginResponseData.SysParaInfo,
    )
      ? global.loginResponseData.SysParaInfo
      : attachmentNone;
    if (!_.isEmpty(ExceptionAttachmentAmount)) {
      if (ExceptionAttachmentAmount === attachmentNone) {
        this.isApplyAttachUploadLimit = false;
      }
      if (ExceptionAttachmentAmount === attachmentSingle) {
        this.isApplyAttachUploadLimit = true;
      }
      if (ExceptionAttachmentAmount === attachmentMultiple) {
        this.isApplyAttachUploadLimit = true;
        this.isApplyAttachUploadAmountLimit = false;
      }
    }
  }

  // 显示图片选择方式
  onShowPhotoPicker = () => {
    const { open } = this.props;
    if (!this.isApplyAttachUploadAmountLimit) {
      open(true);
    } else {
      open(false);
    }
  };

  // 显示附件ListView的缩略图
  onShowAttView(rowData, sectionID, rowID, highlightRow) {
    return (
      <View key={`${sectionID}-${rowID}`} style={styles.itemAttachStyle}>
        <TouchableOpacity onPress={() => this.onScaleAttModal(rowID)}>
          <Image source={{ uri: rowData.path }} style={styles.attachStyle} />
        </TouchableOpacity>
      </View>
    );
  }

  // 打开附件信息
  onScaleAttModal = rowID => {
    const { onScaleAttModal } = this.props;
    onScaleAttModal(rowID);
  };

  // 当附件删除时，刷新ListView
  onSetRefreshListView(attViewArrTemp) {
    if (attViewArrTemp.length == 0) {
      this.setState({
        attDescription: true,
      });
    }
    // 更新附件的数据源
    this.setState({
      attDataSource: this.state.attDataSourceTemp.cloneWithRows(attViewArrTemp),
    });
  }

  // 当附件进行限制时候，满足5个或者是1的时候，显示上传附件的图片
  onSetIsApplyAttachShow(str) {
    this.setState({
      isApplyAttachShow: str,
    });
  }

  // 获取附件的信息
  onGetAttachment() {
    const params = {};
    // 定义附件图片数组
    params.attViewArr = this.attViewArr;
    // 定义附件图片Base64数组
    params.attViewBase64Arr = this.attViewBase64Arr;
    // 定义附件URI数组
    params.attViewUriArr = this.attViewUriArr;
    return params;
  }

  // 加载数据信息
  loadData = response => {
    if (!response.length) {
      this.attViewArr.push(response);
      this.attViewUriArr.push(response.path);
      this.attViewBase64Arr.push(response.data);
    } else {
      for (let i = 0; i < response.length; i += 1) {
        if (this.attViewArr.length <= attachmentNumber - 1) {
          this.attViewArr.push(response[i]);
          this.attViewUriArr.push(response[i].path);
          this.attViewBase64Arr.push(response[i].data);
        }
      }
    }
    if (this.attViewArr.length >= 1) {
      this.setState({
        attDescription: false,
      });
    }
    if (this.attViewArr.length > attachmentNumber - 1) {
      this.setState({
        isApplyAttachShow: false,
      });
    }
    // 增加上传限制 1，单张 2，多张
    if (this.isApplyAttachUploadAmountLimit) {
      // 显示第一张附件  上传单张限制
      this.setState({
        attDataSource: this.state.attDataSourceTemp.cloneWithRows(
          this.attViewArr,
        ),
        isApplyAttachShow: false,
      });
    } else {
      this.setState({
        attDataSource: this.state.attDataSourceTemp.cloneWithRows(
          this.attViewArr,
        ),
      });
    }
  };

  render() {
    const { attDescription, isApplyAttachShow, attDataSource } = this.state;
    return (
      <View
        style={this.isApplyAttachUploadLimit ? styles.attachViewStyle : null}
      >
        {isApplyAttachShow
          ? <View style={styles.itemAttachStyle}>
            <TouchableWithoutFeedback onPress={this.onShowPhotoPicker}>
              <Image source={{ uri: attachAdd }} style={styles.attachStyle} />
            </TouchableWithoutFeedback>
          </View>
          : null}
        {attDescription && isApplyAttachShow
          ? <View style={styles.attDescription}>
            <Text style={styles.attDescriptionFont}>
              {I18n.t('mobile.module.overtime.overtimeapplyattachment')}
            </Text>
          </View>
          : null}
        <ListView
          pageSize={attachmentNumber}
          enableEmptySections
          style={styles.attListViewStyle}
          dataSource={attDataSource}
          contentContainerStyle={styles.attListStyle}
          renderRow={(rowData, sectionID, rowID, highlightRow) =>
            this.onShowAttView(rowData, sectionID, rowID, highlightRow)}
        />
      </View>
    );
  }
}
