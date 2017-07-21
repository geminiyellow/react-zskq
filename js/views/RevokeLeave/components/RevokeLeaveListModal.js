import {
  InteractionManager,
  ListView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import ModalBox from 'react-native-modalbox';
import Image from '@/common/components/CustomImage';
import Line from '@/common/components/Line';
import { device } from '@/common/Util';
import TouchableHighlight from '@/common/components/CustomTouchableHighlight';
import { GET, ABORT } from '@/common/Request';
import { getEmployeeLeaveInfoByDay } from '@/common/api';
import { messageType } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import { getYYYYMMDDhhmmFormat, getHHmmFormat } from '@/common/Functions';

const imageLeft = 'icon2';
const emptyImage = 'empty'

export default class RevokeLeaveListModal extends PureComponent {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: this.ds,
    };
    this.listData = [];
    this.isOpenValue = false;
    this.selectLeave = '';
  }

  componentWillMount() {
    GET(getEmployeeLeaveInfoByDay(), (responseData) => {
      this.listData = responseData;
      this.setState({
        dataSource: this.ds.cloneWithRows(responseData),
      });
    }, (err) => {
      showMessage(messageType.error, err);
    }, 'abortgetEmployeeLeaveInfoByDay');
  }

  componentWillUnmount() {
    ABORT('abortgetEmployeeLeaveInfoByDay');
  }

  getSelectLeave() {
    return this.selectLeave;
  }

  open() {
    this.isOpenValue = true;
    this.modal.open();
  }

  close() {
    this.isOpenValue = false;
    this.modal.close();
  }

  isOpen() {
    return this.isOpenValue;
  }

  onPress(rowData) {
    this.selectLeave = rowData;
    this.props.onChildrenPress();
  }

  renderEmptyView() {
    return(
      <View style={styles.emptyView}>
        <Image style={styles.emptyImage} source={{ uri: emptyImage }} />
        <Text style={styles.emptyText}>暂无可销假记录</Text>
      </View>
    );
  }

  renderRow = (rowData) => {
    if (this.listData.length == 0) {
      return;
    }
    const textH = rowData.LIMIT_UNIT == '1' ? 'H' : 'D';
    const startData = getYYYYMMDDhhmmFormat(`${rowData.TIMECARDDATE} ${rowData.STIME}`);
    const endData = getHHmmFormat(rowData.ETIME);
    const hoursLength = (`${rowData.PAYHOURS}`.length - 1) * 2;

    return(
      <TouchableHighlight onPress={() => this.onPress(rowData)}>
        <View style={styles.rowView}>
          <View style={[styles.iconWrapperView, { width: 25 + hoursLength }]}>
            <View style={[styles.iconInnerView, { width: 23 + hoursLength }]}>
              <Text style={styles.textTime}>{rowData.PAYHOURS}{textH}</Text>
            </View>
          </View>

          <View style={styles.detailView}>
            <Text style={styles.textDetailUp} numberOfLines={1}>{rowData.CLASSNAME}</Text>
            <Text style={styles.textDetailDown}>{`${startData}-${endData}`}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
  
  renderSeparator = () => {
    return(
      <View style={styles.lineStyle}>
        <View style={styles.lineRight} />
      </View>
    );
  }

  render() {
    const top = device.isIos ? 20 + 44 + 60 + 1 : 44 + 60 + 1;
    let height = this.listData.length != 0 ? this.listData.length * 60 : 180; 
    height = this.listData.length * 60 > 360 ? 360 : height + this.listData.length;
    return (
      <ModalBox
        style={{ height: height, backgroundColor: 'transparent' }}
        position={'top'}
        top={top}
        swipeToClose={false}
        animationDuration={0}
        backdropPressToClose={'true'}
        backdropOpacity={0.6}
        onClosed={() => {
          this.isOpenValue = false;
          this.props.onChildrenPressBackground();
        }}
        ref={box => this.modal = box} >
        { this.listData.length != 0 ?
        <ListView
          style={styles.listView}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderSeparator={this.renderSeparator}
          removeClippedSubviews={false}
          bounces={false} /> : this.renderEmptyView() }
      </ModalBox>
    );
  }
}

const styles = EStyleSheet.create({
  listView: {
    // height: 200,
    // width: 200,
    // backgroundColor: '$color.white',
  },
  rowView: {
    width: device.width,
    height: 60,
    flexDirection: 'row',
    backgroundColor: '$color.white',
  },
  detailView: {
    marginLeft: 10,
  },
  iconWrapperView: {
    marginLeft: 47,
    width: 25,
    height: 25,
    borderRadius: 4,
    alignSelf: 'center',
    backgroundColor: '$color.mainColorLight',
  },
  iconInnerView: {
    width: 23,
    height: 23,
    borderRadius: 4,
    marginTop: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '$color.white',
  },
  textTime: {
    fontSize: 11,
    alignSelf: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    color: '$color.mainColorLight',
  },
  textDetailUp: {
    marginTop: 12,
    fontSize: 14,
    color: '$color.mainBodyTextColor',
  },
  textDetailDown: {
    marginTop: 4,
    fontSize: 12,
    color: '#666666',
  },

  emptyView: {
    width: device.width,
    height: 180,
    backgroundColor: '$color.white',
  },
  emptyImage: {
    marginTop: 30,
    alignSelf: 'center',
    width: 80,
    height: 80,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 18,
    alignSelf: 'center',
  },
  lineStyle: {
    width: device.width,
    height: device.hairlineWidth,
    flexDirection: 'row',
    backgroundColor: '$color.white',
  },
  lineRight: {
    marginLeft: 18,
    width: device.width - 18,
    height: device.hairlineWidth,
    backgroundColor: '$splitLine.color',
  },
});
