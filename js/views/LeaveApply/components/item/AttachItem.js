import { ListView, TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';


import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import Image from '@/common/components/CustomImage';
import Text from '@/common/components/TextField.js';

// 附件上传的添加图片
const attachAdd = { uri: 'list_add_pic' };


export default class AttachItem extends PureComponent {

  // 初始化
  constructor(...props) {
    super(...props);
    this.attListView = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      attDataSource: this.attListView.cloneWithRows([]),

      // att显示控制
      isAttShow: this.props.isAttShow,
      // attAdd显示控制
      isAttAddShow: this.props.isAttAddShow,
      // 增加附件说明显示
      isAttDescShow: this.props.isAttDescShow,
    };
  }

  // 加载申请的表单Item
  onLoadingItem() {
    if (this.state.isAttShow) {
      return (
        <View style={styles.attachViewStyle}>
          {this.showLeaveApplyAttachUploadAddView()}
          {this.state.isAttDescShow ? <View style={styles.attDescription}><Text style={styles.attDescriptionFont} >{I18n.t('mobile.module.overtime.overtimeapplyattachment')}</Text></View> : <View />}
          <ListView
            pageSize={5}
            removeClippedSubviews={false}
            enableEmptySections
            style={styles.attListViewStyle}
            dataSource={this.state.attDataSource}
            contentContainerStyle={styles.attListStyle}
            renderRow={(rowData, sectionID, rowID) => this.showAttView(rowData, sectionID, rowID)}
            />
        </View>
      );
    }
    return null;
  }


  // 初始化附件显示
  onInitAttShow(isShow) {
    this.setState({
      isAttShow: isShow,
    });
  }

  // 初始化listview dataSource
  onInitAttListData(dataSources) {
    if (_.isEmpty(dataSources)) {
      return;
    }
    this.setState({
      attDataSource: this.attListView.cloneWithRows(dataSources),
    });
  }

  // 初始化附件添加显示
  onInitAttAddShow(isShow) {
    this.setState({
      isAttAddShow: isShow,
    });
  }

  // 初始化附件说明
  onInitAttDescShow(isShow) {
    this.setState({
      isAttDescShow: isShow,
    });
  }

  // 刷新datasources
  onRefreshAttListDataSources() {
    this.setState({
      attDataSource: this.attListView.cloneWithRows([]),
    });
  }

  // 附件上传模块显示控制
  showLeaveApplyAttachUploadAddView = () => {
    if (this.state.isAttAddShow) {
      return (
        <View style={styles.itemAttachStyle}>
          <TouchableOpacity
            onPress={() => {
              const { addImage } = this.props;
              addImage();
            }}>
            <Image
              source={attachAdd}
              style={styles.attachStyle} />
          </TouchableOpacity>
        </View >
      );
    }
    return null;
  }

  // 显示附件缩略图
  showAttView(rowData, sectionID, rowID) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={styles.itemAttachStyle}>
        <TouchableOpacity
          onPress={() => {
            const { showImage } = this.props;
            showImage(rowID);
          }}>
          <Image
            source={{ uri: rowData.path }}
            style={styles.attachStyle} />
        </TouchableOpacity>
      </View >
    );
  }

  // 判断listdatasource是否为空
  isAttListViewDataSourceesEmpty() {
    return _.isEmpty(this.state.attDataSource);
  }

  render() {
    return (
      <View>
        {this.onLoadingItem()}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  itemAttachStyle: {
    backgroundColor: '#FFFFFF',
    height: 45,
    marginBottom: 18,
    marginTop: 24,
  },
  attachViewStyle: {
    flexGrow: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  attListStyle: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  attListViewStyle: {
    alignSelf: 'center',
  },
  attachStyle: {
    height: 45,
    width: 45,
    marginLeft: 18,
    alignItems: 'center',
  },
  attDescription: {
    height: 50,
    marginLeft: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  attDescriptionFont: {
    color: '#a3a3a3',
  },
});