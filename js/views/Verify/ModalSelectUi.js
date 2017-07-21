/**
 * 筛选菜单弹出层
 */
import { ListView, TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import ModalBox from 'react-native-modalbox';
import Image from '@/common/components/CustomImage';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import Text from '@/common/components/TextField';
import realm from '@/realm';
import { device } from '@/common/Util';
import Constance from './../MyForms/Constance';

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

let modalboxHeight = 200;
let types = [];

let top = 96;
if (device.isIos) {
  top = 116;
}

export default class ModalSelectUi extends PureComponent {
  constructor(...args) {
    super(...args);
    this.typelist = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      typedataSource: this.typelist.cloneWithRows(types),
    };
  }

  componentWillMount() {
    this.getTypes();
  }

  componentWillUnmount() {
    types = [];
  }

  onPress(rowData, rowID) {
    const { selectMenu } = this.props;
    selectMenu(1, types[rowID].Type);
    if (types[rowID].selected) return;
    types.map(item => item.selected = false);
    types[rowID].selected = true;
    this.setState({
      typedataSource: this.typelist.cloneWithRows(types),
    });
  }

  getTypes() {
    const allTypes = realm.objects('Form');
    const results = allTypes.slice(0, allTypes.length);
    types = [{ Description: I18n.t('mobile.module.myform.all'), Type: 'All', selected: true }];
    results.map(item => {
      const temp = {};
      temp.Description = item.name;
      temp.Type = item.form_type;
      if (temp.Type != Constance.FORMTYPE_PROCESSDEMANDPOOLFORM) types.push(temp);
    });

    if (types.length > 1) {
      modalboxHeight = types.length * 44;
    }
    this.setState({
      typedataSource: this.typelist.cloneWithRows(types),
    });
  }

  open(index) {
    this.madalbox.open();
  }

  close() {
    this.madalbox.close();
  }

  inflateItemType(rowData, sectionID, rowID, highlightRow) {
    return (
      <TouchableOpacity style={styles.rowStyle} key={`${sectionID}-${rowID}`} onPress={() => this.onPress(rowData, rowID)}>
        <Text style={{ fontSize: 14, margin: 5, marginLeft: 22, marginRight: 10, color: '#333333' }}>{rowData.Description}</Text>
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
        backdropPressToClose
        backdropOpacity={0.6}
        onClosed={() => {
          const { modalclosed } = this.props;
          modalclosed();
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