import { DeviceEventEmitter, ListView, View } from 'react-native';
import React, { PureComponent } from 'react';

import Image from '@/common/components/CustomImage';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import Modal from 'react-native-modalbox';
import { ABORT } from '@/common/Request';
import Text from '@/common/components/TextField.js';
import { device, event } from '@/common/Util';
import _ from 'lodash';

import ActionBar from './ActionBarItem';
import CreaditsItem from './LeaveCreaditsListItem';
import LeaveUtil from './../../utils/LeaveUtil';

// 取消图片
const cancleImg = 'close';
// 向右的箭头图片
const noDataImg = { uri: 'empty' };

export default class LeaveCreaditsItem extends PureComponent {

  // 初始化
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
  }

  // 组件渲染完成 加载默认值
  componentDidMount() {
    // 请假类型消息监听事件
    this.listeners = [
      // 请假类别
      DeviceEventEmitter.addListener(event.REFRESH_LEAVE_CREADITS_DATA, (eventBody) => {
        if (!_.isEmpty(eventBody)) {
          this.onSetCreaditsData(eventBody);
        } else {
          this.setState({
            dataSource: '',
          });
          this.modalbox.open();
        }
      }),
    ];
  }

  componentWillUnmount() {
    this.listeners && this.listeners.forEach(listener => listener.remove());
    ABORT('getCreadits');
  }

  // 获取额度数据
  onOpenCreaditsModal = () => {
    LeaveUtil.onOpenCreaditsModal();
  }

  onSetCreaditsData = (responseData) => {
    let data = [];
    data = [...responseData];
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(data),
    });
    this.modalbox.open();
  }

  onSetCreaditsItemData = (rowData, sectionID, rowID) => {
    if (`${this.state.dataSource.getRowCount()}` === `${parseInt(rowID) + 1}`) {
      return (
        <CreaditsItem
          rowData={rowData}
          sectionID={sectionID}
          rowID={rowID}
          isNeedLine={false} />
      );
    }

    return (
      <CreaditsItem
        rowData={rowData}
        sectionID={sectionID}
        rowID={rowID}
        isNeedLine />
    );
  }

  // 关闭额度页面
  onDismissCreaditsView() {
    this.modalbox.close();
  }

  getViews() {
    if (!_.isEmpty(this.state.dataSource)) {
      return (
        <ListView
          bounces={false}
          removeClippedSubviews={false}
          dataSource={this.state.dataSource}
          renderRow={(rowData, sectionID, rowID) => this.onSetCreaditsItemData(rowData, sectionID, rowID)}
            />
      );
    }
    return (
      <View style={styles.noDataViewStyle}>
        <Image
          style={{ marginTop: 56, height: 88, width: 88 }}
          source={noDataImg} />
        <Text style={{ fontSize: 21, marginTop: 30, color: '#333333' }} >{I18n.t('mobile.module.leaveapply.leaveapplynodata')}</Text>
        <Text style={{ fontSize: 12, marginTop: 8, color: '#999999' }} >{I18n.t('mobile.module.leaveapply.leaveapplynodatadesc')}</Text>
      </View>
    );
  }

  render() {
    return (
      <Modal
        style={styles.creaditsModalStyle}
        position={'top'}
        swipeToClose={false}
        animationDuration={0}
        backdropPressToClose
        backdropOpacity={0.6}
        ref={box => this.modalbox = box}>

        <ActionBar
          ref={actionbar => this.actionbar = actionbar}
          imgRight={cancleImg}
          onBackAction={() => {
            // 主页面引用调用
            // pop页面，退出请假
            const { onCreaditsBackClick } = this.props;
            onCreaditsBackClick();
          }}
          onShiftAction={() => this.onDismissCreaditsView()} />

        {this.getViews()}
      </Modal>
    );
  }
}

const styles = EStyleSheet.create({
  creaditsModalStyle: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  noDataViewStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    height: ((device.height) * 7) / 12,
  },
});