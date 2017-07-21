import React, { Component } from 'react';
import {
  InteractionManager,
  Text,
  View,
} from 'react-native';

import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';
import Style from '@/common/Style';
import I18n from 'react-native-i18n';
import { getHHmmFormat } from '@/common/Functions';
import Line from '@/common/components/Line';
import Image from '@/common/components/CustomImage';
import TouchableHighlight from '@/common/components/CustomTouchableHighlight';

const selectedImageDown = 'clock_down';
const selectedImageUp = 'clock_up';

export default class ClockStatusModul extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUnfold: false,
      selectedImage: selectedImageDown,
    };
  }

  componentWillMount() {
    const { showDetail } = this.props;
    this.setState({
      isUnfold: showDetail,
    });
    // console.log('showDetail is - - - -- - ', showDetail);
  }

  onPress() {
    const { isUnfold } = this.state;
    const { index, showDetail } = this.props;
    this.setState({
      selectedImage: showDetail ? selectedImageDown : selectedImageUp,
      isUnfold: !showDetail,
    });
    this.props.onSelected(index, !showDetail);
  }

  renderDetail() {
    const { machineID, address } = this.props;
    const machinIDTemp = machineID && machineID.length != 0 ? machineID : '';
    const addressTemp = address && address.length != 0 ? address : '';

    return (
      <View style={styles.viewDetail}>
        <Line />
        <Text style={[styles.textTitle, { marginTop: 14 }]}>打卡设备：{machinIDTemp}</Text>
        <Text style={[styles.textTitle, { marginTop: 10 }]}>打卡地点：{addressTemp}</Text>
      </View>
    );
  }

  render() {
    const { title, time, showDetail } = this.props;
    const { isUnfold, selectedImage } = this.state;
    const timeTemp = time && time.length != 0 ? time : '暂未打卡';
    const imageTemp = showDetail ? selectedImageUp : selectedImageDown;

    return (
      <View >
        <Line />

        <TouchableHighlight onPress={() => this.onPress()}>
        <View style={styles.viewTitle}>
          <Text style={[styles.textShift, { marginLeft: 18 }]}>{title}：</Text>
          <Text style={[styles.textShift, { color: '#14BE4B' }]}>{timeTemp}</Text>
          <View style={styles.container} />
          <Image style={styles.imageSelected} source={{ uri: imageTemp }} />
        </View>
        </TouchableHighlight>

        {showDetail ? this.renderDetail() : null}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  viewTitle: {
    width: device.width,
    height: 48,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  textShift: {
    fontSize: 16,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  imageSelected: {
    width: 14,
    height: 8,
    marginRight: 18,
    alignSelf: 'center',
    justifyContent: 'center',
  },


  viewDetail: {
    width: device.width,
    height: 72,
    backgroundColor: '#F7F7F7',
  },
  textTitle: {
    marginLeft: 28,
    fontSize: 14,
    color: '#666666',
  },
});