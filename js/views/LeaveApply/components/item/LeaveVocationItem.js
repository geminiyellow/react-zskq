import { Animated, DeviceEventEmitter, Easing, ListView, View } from 'react-native';
import React, { PureComponent } from 'react';

import EStyleSheet from 'react-native-extended-stylesheet';
import Modal from 'react-native-modalbox';
import Text from '@/common/components/TextField';
import Image from '@/common/components/CustomImage';
import { event, device } from '@/common/Util';
import { ABORT } from '@/common/Request';
import I18n from 'react-native-i18n';
import _ from 'lodash';

import ActionBar from './ActionBarItem';
import LeaveUtil from './../../utils/LeaveUtil';
import CreaditsItem from './LeaveVocationListItem';
import CreaditsDetailItem from './LeaveVocationDetailListItem';

// 取消图片
const cancleImg = 'close';
// 向右的箭头图片
const noDataImg = { uri: 'empty' };

export default class LeaveVocationItem extends PureComponent {

  // 初始化
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      isListShow: this.props.isListShow,
      creaditId: '',
      branchDataSources: '',
      creaditsBgcolor: 'transparent',
    };
    this.animatedValue = new Animated.Value(0);
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
    this.timer && clearTimeout(this.timer);
    ABORT('getCreadits');
  }

  // 动画
  animate() {
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 200,
        easing: Easing.linear
      }
    ).start();
  }

  rightIn() {
    Animated.timing(
      this.animatedValue,
      {
        toValue: 0,
        duration: 350,
        easing: Easing.linear
      }
    ).start();
  }

  onOpenCreaditsModal(isShow) {
    this.setState({
      isListShow: isShow,
    });
    LeaveUtil.onGetLeaveBalance();
  }

  // 关闭额度页面
  onDismissCreaditsView() {
    this.setState({
      creaditsBgcolor: 'transparent',
    });
    this.modalbox.close();
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
    console.log('==rowData==',rowData);
    if (`${this.state.dataSource.getRowCount()}` === `${parseInt(rowID) + 1}`) {
      return (
        <CreaditsItem
          rowData={rowData}
          sectionID={sectionID}
          rowID={rowID}
          isNeedLine={false}
          onItemPress={(creaditId, branchDataSource) => this.onItemClick(creaditId, branchDataSource)} />
      );
    }

    return (
      <CreaditsItem
        rowData={rowData}
        sectionID={sectionID}
        rowID={rowID}
        isNeedLine
        onItemPress={(id, branchDataSource) => this.onItemClick(id, branchDataSource)} />
    );
  }

  onItemClick(id, branchDataSource) {
    this.animatedValue.setValue(1);
    this.setState({
      isListShow: false,
      creaditId: id,
      branchDataSources: branchDataSource,
      creaditsBgcolor: 'transparent',
    });
    this.rightIn();
  }

  onShowList(bgColor) {
    this.animatedValue.setValue(0);
    this.animate();
    this.timer = setTimeout(() => {
      this.setState({
        isListShow: true,
        creaditsBgcolor: bgColor,
      });
    }, 200);
  }

  getViews() {
    // 默认右侧划入
    let marginLeft = '';
    if (this.state.isListShow) {
      marginLeft = this.animatedValue.interpolate({
        inputRange: [-1, 0],
        outputRange: [400, 0]
      });
    } else {
      marginLeft = this.animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 400]
      });
    }
    if (this.state.isListShow) {
      if (!_.isEmpty(this.state.dataSource)) {
        return (
          <View>
            <ListView
              bounces={false}
              removeClippedSubviews={false}
              dataSource={this.state.dataSource}
              renderRow={(rowData, sectionID, rowID) => this.onSetCreaditsItemData(rowData, sectionID, rowID)}
            />
          </View>
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
    if (!this.state.isListShow) {
      return (
        <Animated.View style={{ marginLeft, flex: 1 }}>
          <CreaditsDetailItem
            creaditId={this.state.creaditId}
            dataSources={this.state.branchDataSources} />
        </Animated.View>
      );
    }
  }

  render() {
    return (
      <Modal
        style={[styles.creaditsModalStyle, { backgroundColor: this.state.creaditsBgcolor }]}
        position={'top'}
        swipeToClose={false}
        animationDuration={0}
        backdropPressToClose
        backdropOpacity={0.6}
        onClose={() => this.onDismissCreaditsView()}
        ref={box => this.modalbox = box}>

        <ActionBar
          ref={actionbar => this.actionbar = actionbar}
          imgRight={cancleImg}
          onBackAction={() => {
            // 主页面引用调用
            // pop页面，退出请假
            // viewType=1 表示额度页面跳转
            const viewType = 1;
            let detailType = 0;
            if (!this.state.isListShow) {
              detailType = 1;
            }
            const { onCreaditsBackClick } = this.props;
            onCreaditsBackClick(viewType, detailType);
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
  },
  noDataViewStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    height: ((device.height) * 7) / 12,
  },
});