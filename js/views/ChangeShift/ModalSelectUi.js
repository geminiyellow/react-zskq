/**
 * 筛选菜单弹出层
 */
import { ListView, Text, TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import ModalBox from 'react-native-modalbox';
import { device } from '../../common/Util';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import Image from '@/common/components/CustomImage';
const pitchOff = 'pitch_off';
const pitchOn = 'pitch_on';


const styles = EStyleSheet.create({
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderBottomColor: '#e3e3e3',
    borderBottomWidth: device.hairlineWidth,
  },
});

const modalboxHeight = 44 * 4;

let top = 45;
if (device.isIos) {
  top = 65;
}

const types =
  [
    {
      title: 'mobile.module.changeshift.all',
      selected: true,
      Type: '-1',
    },
    {
      title: 'mobile.module.changeshift.samedept',
      selected: false,
      Type: '0',
    },
    {
      title: 'mobile.module.changeshift.diffposition',
      selected: false,
      Type: '1',
    },
    {
      title: 'mobile.module.changeshift.diffdeptsame',
      selected: false,
      Type: '2',
    },
  ];

export default class ModalSelectUi extends PureComponent {
  constructor(...args) {
    super(...args);
    this.typelist = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      typedataSource: this.typelist.cloneWithRows(types),
    };
  }

  componentWillUnmount() {
    types.map(item => item.selected = false);
    types[0].selected = true;
  }

  onPress(rowData, rowID) {
    if (types[rowID].selected) return;
    const { selectMenu } = this.props;
    selectMenu(1, types[rowID].Type);
    types.map(item => item.selected = false);
    types[rowID].selected = true;
    this.setState({
      typedataSource: this.typelist.cloneWithRows(types),
    });
  }

  open() {
    this.madalbox.open();
  }

  close() {
    this.madalbox.close();
  }

  inflateItemType(rowData, sectionID, rowID, highlightRow) {
    return (
      <TouchableOpacity style={styles.rowStyle} key={`${sectionID}-${rowID}`} onPress={() => this.onPress(rowData, rowID)}>
        <Text allowFontScaling={false} numberOfLines={1} style={{ fontSize: 14, margin: 5, marginLeft: 22, marginRight: 10, color: '#333333', width: device.width * 3 / 4 }}>{I18n.t(rowData.title)}</Text>
        <View style={{ flexGrow: 1 }} />
        <Image style={{ marginRight: 22, width: 20, height: 20 }} source={{ uri: rowData.selected ? pitchOn : pitchOff }} />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <ModalBox
        style={{ height: modalboxHeight }}
        position={'top'}
        swipeToClose={false}
        top={top}
        animationDuration={0}
        backdropPressToClose={true}
        backdropOpacity={0.6}
        onClosed={() => {
          // const { modalclosed } = this.props;
          // modalclosed();
        }}
        ref={box => this.madalbox = box}
      >
        <ListView
          removeClippedSubviews={false}
          dataSource={this.state.typedataSource}
          renderRow={(rowData, sectionID, rowID, highlightRow) => this.inflateItemType(rowData, sectionID, rowID, highlightRow)}
        />
      </ModalBox>
    );
  }
}