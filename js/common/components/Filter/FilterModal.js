import { DeviceEventEmitter, ListView, TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import ModalBox from 'react-native-modalbox';
import Image from '@/common/components/CustomImage';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import Text from '@/common/components/TextField';
import { device } from '@/common/Util';
import Line from '@/common/components/Line';
import _ from 'lodash';

const pitchOff = 'checkbox_common';
const pitchOn = 'checkbox_selected';
const textNormalColor = '#333333';
const textselectedColor = '#14be4b';

const styles = EStyleSheet.create({
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44
  },
});

let types = [];

// 距离top的距离
let top = 0;
//  const actionbarHeight = (29 / 667) * device.height + device.hairlineWidth * 3;
// const androidHeight = actionbarHeight + 60;
// const iosHeight = actionbarHeight + 80;
const marginTop = device.isIos ? (108 + device.hairlineWidth * 3 ) : (88 + device.hairlineWidth * 3);

let itemIndex = -1;
let indexTemp = -1;

export default class FilterModal extends PureComponent {

  constructor(...args) {
    super(...args);
    types = this.props.dataSources;
    this.typelist = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      typedataSource: this.typelist.cloneWithRows(types),
      modalboxHeight: 0,
    };
  }

  componentWillMount() {
    top = marginTop;
    this.getTypes();
    this.onUpdateModalHeight();
    this.listeners && this.listeners.forEach(listener => listener.remove());
  }

  componentWillUnmount() {
    types = [];
  }

  componentDidMount() {
    this.listeners = [
      DeviceEventEmitter.addListener('CLOSE_MODAL', (eventBody) => {
        if (_.isEmpty(eventBody)) {
          return;
        }
        if (itemIndex === -1) {
          itemIndex = eventBody.index;
        }
        if (itemIndex === eventBody.index) {
          if (eventBody.selected) {
            if (this.madalbox) {
              this.madalbox.close();
            }
          }
        }
        if (itemIndex !== eventBody.index) {
          itemIndex = eventBody.index;
        }
      }),
    ];
  }

  onUpdateDataSource(data) {
    this.setState({
      typedataSource: this.state.typedataSource.cloneWithRows(JSON.parse(JSON.stringify(data)))
    });
    // 记住传来的数据源
    types = data;
    this.onUpdateModalHeight();
  }

  onPress(rowData, rowID) {
    indexTemp = rowID;
    const { selectMenu } = this.props;
    selectMenu(types[rowID]);
    if (types[rowID].selected) {
      this.madalbox.close();
      return;
    }
    types.map(item => item.selected = false);
    types[rowID].selected = true;
    this.setState({
      typedataSource: this.typelist.cloneWithRows(types),
    });
    // 关闭modal
    this.madalbox.close();
    // 刷新Filter
    DeviceEventEmitter.emit('UPDATE_FILTER_VALUE', types[rowID].Description);
  }

  getTypes() {
    this.setState({
      typedataSource: this.typelist.cloneWithRows(types),
    });
  }

  onUpdateModalHeight() {
    if (types.length >= 1 && types.length <= 7) {
      this.setState({
        modalboxHeight: types.length * 44,
      });
    } else {
      this.setState({
        modalboxHeight: 322,
      });
    }
  }

  open() {
    this.madalbox.open();
  }

  close() {
    this.madalbox.close();
  }

  inflateItemType(rowData, sectionID, rowID, highlightRow) {
    if (rowID === '0') {
      return (
        <TouchableOpacity style={styles.rowStyle} key={`${sectionID}-${rowID}`} onPress={() => this.onPress(rowData, rowID)}>
          <Text style={{ width: device.width * 0.8, fontSize: 14, margin: 5, marginLeft: 18, marginRight: 18, color: rowData.selected ? textselectedColor : textNormalColor }} numberOfLines={1}>{rowData.Description}</Text>
          <Image style={{ marginRight: 18, width: 19, height: 19 }} source={{ uri: rowData.selected ? pitchOn : pitchOff }} />
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={{ flexDirection: 'column' }}>
          <Line style={{ marginLeft: 22 }} />
          <TouchableOpacity style={styles.rowStyle} key={`${sectionID}-${rowID}`} onPress={() => this.onPress(rowData, rowID)}>
            <Text style={{ width: device.width * 0.8, fontSize: 14, margin: 5, marginLeft: 18, marginRight: 18, color: rowData.selected ? textselectedColor : textNormalColor }} numberOfLines={1}>{rowData.Description}</Text>
            <Image style={{ marginRight: 18, width: 19, height: 19 }} source={{ uri: rowData.selected ? pitchOn : pitchOff }} />
          </TouchableOpacity>
        </View>
      );
    }
  }

  render() {
    let { topParams } = this.props;
    if (topParams) top = topParams
    return (
      <ModalBox
        style={{ height: this.state.modalboxHeight }}
        position={'top'}
        swipeToClose={false}
        top={top}
        animationDuration={0}
        backdropPressToClose
        backdropOpacity={0.6}
        onClosed={() => {
          DeviceEventEmitter.emit('INIT_FILTER', true);
        }}
        ref={box => this.madalbox = box}
      >
        <ListView
          dataSource={this.state.typedataSource}
          renderRow={(rowData, sectionID, rowID, highlightRow) => this.inflateItemType(rowData, sectionID, rowID, highlightRow)}
          removeClippedSubviews={false}
          bounces={false}
        />
      </ModalBox>
    );
  }
}