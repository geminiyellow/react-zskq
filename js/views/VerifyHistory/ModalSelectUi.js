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
import { device } from '@/common/Util';
import realm from '@/realm';
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

const status =
  [
    {
      title: 'mobile.module.verify.all',
      selected: true,
    },
    {
      title: 'mobile.module.verify.handleresult.completed',
      selected: false,
    },
    {
      title: 'mobile.module.verify.handleresult.reject',
      selected: false,
    },
    {
      title: 'mobile.module.verify.handleresult.Skip',
      selected: false,
    },
    {
      title: 'mobile.module.verify.handleresult.autocompleted',
      selected: false,
    },
    {
      title: 'mobile.module.verify.handleresult.forcecompleted',
      selected: false,
    },
  ];

const ranges =
  [
    {
      title: 'mobile.module.myform.currentmonth',
      selected: true,
      index: '0',
    },
    {
      title: 'mobile.module.myform.lastmonth',
      selected: false,
      index: '-1',
    },
  ];

export default class ModalSelectUi extends PureComponent {
  constructor(...args) {
    super(...args);
    this.typelist = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.statuslist = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.rangelist = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      showType: true,
      showStatus: false,
      showRange: false,
      typedataSource: this.typelist.cloneWithRows(types),
      statusdataSource: this.statuslist.cloneWithRows(status),
      rangedataSource: this.rangelist.cloneWithRows(ranges),
    };
  }

  componentWillMount() {
    this.getTypes();
  }

  componentWillUnmount() {
    status.map(item => item.selected = false);
    status[0].selected = true;

    ranges.map(item => item.selected = false);
    ranges[0].selected = true;
  }

  onPress(rowData, rowID) {
    if (this.state.showType) {
      if (types[rowID].selected) return;
      const { selectMenu } = this.props;
      selectMenu(1, types[rowID].Type);
      types.map(item => item.selected = false);
      types[rowID].selected = true;
      this.setState({
        typedataSource: this.typelist.cloneWithRows(types),
      });
    } else if (this.state.showStatus) {
      if (status[rowID].selected) return;
      const { selectMenu } = this.props;
      selectMenu(2, status[rowID].title);
      status.map(item => item.selected = false);
      status[rowID].selected = true;
      this.setState({
        statusdataSource: this.statuslist.cloneWithRows(status),
      });
    } else {
      if (ranges[rowID].selected) return;
      const { selectMenu } = this.props;
      selectMenu(3, ranges[rowID].index);
      ranges.map(item => item.selected = false);
      ranges[rowID].selected = true;
      this.setState({
        rangedataSource: this.rangelist.cloneWithRows(ranges),
      });
    }
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

  // 得到表单类别数据
  getTypeList() {
    return (
      <ListView
        removeClippedSubviews={false}
        dataSource={this.state.typedataSource}
        renderRow={(rowData, sectionID, rowID, highlightRow) => this.inflateItemType(rowData, sectionID, rowID, highlightRow)}
      />
    );
  }

  // 得到表单类别数据
  getStatusList() {
    return (
      <ListView
        removeClippedSubviews={false}
        dataSource={this.state.statusdataSource}
        renderRow={(rowData, sectionID, rowID, highlightRow) => this.inflateItemStatus(rowData, sectionID, rowID, highlightRow)}
      />
    );
  }

  getRangeList() {
    return (
      <ListView
        removeClippedSubviews={false}
        dataSource={this.state.rangedataSource}
        renderRow={(rowData, sectionID, rowID, highlightRow) => this.inflateItemRange(rowData, sectionID, rowID, highlightRow)}
      />
    );
  }

  getPopList() {
    if (this.state.showType) {
      return this.getTypeList();
    } else if (this.state.showStatus) {
      return this.getStatusList();
    }
    return this.getRangeList();
  }

  inflateItemType(rowData, sectionID, rowID, highlightRow) {
    return (
      <TouchableOpacity style={styles.rowStyle} key={`${sectionID}-${rowID}`} onPress={() => this.onPress(rowData, rowID)}>
        <Text allowFontScaling={false} style={{ fontSize: 14, margin: 5, marginLeft: 22, marginRight: 10, color: '#333333' }}>{rowData.Description}</Text>
        <View style={{ flexGrow: 1 }} />
        <Image style={{ marginRight: 22, width: 20, height: 20 }} source={{ uri: rowData.selected ? pitchOn : pitchOff }} />
      </TouchableOpacity>
    );
  }

  // 填充表单类别数据
  inflateItemStatus(rowData, sectionID, rowID, highlightRow) {
    return (
      <TouchableOpacity style={styles.rowStyle} key={`${sectionID}-${rowID}`} onPress={() => this.onPress(rowData, rowID)}>
        <Text allowFontScaling={false} style={{ fontSize: 14, margin: 5, marginLeft: 22, marginRight: 10, color: '#333333' }}>{I18n.t(rowData.title)}</Text>
        <View style={{ flexGrow: 1 }} />
        <Image style={{ marginRight: 22, width: 20, height: 20 }} source={{ uri: rowData.selected ? pitchOn : pitchOff }} />
      </TouchableOpacity>
    );
  }

  inflateItemRange(rowData, sectionID, rowID, highlightRow) {
    return (
      <TouchableOpacity style={styles.rowStyle} key={`${sectionID}-${rowID}`} onPress={() => this.onPress(rowData, rowID)}>
        <Text allowFontScaling={false} style={{ fontSize: 14, margin: 5, marginLeft: 22, marginRight: 10, color: '#333333' }}>{I18n.t(rowData.title)}</Text>
        <View style={{ flexGrow: 1 }} />
        <Image style={{ marginRight: 22, width: 20, height: 20 }} source={{ uri: rowData.selected ? pitchOn : pitchOff }} />
      </TouchableOpacity>
    );
  }

  close() {
    this.madalbox.close();
  }

  // 打开modal
  open(index) {
    if (index == 1) {
      if (this.state.typedataSource.getRowCount() > 0) {
        modalboxHeight = this.state.typedataSource.getRowCount() * 44;
      }
      this.setState({
        showType: true,
        showStatus: false,
      });
    } else if (index == 2) {
      if (this.state.statusdataSource.getRowCount() > 0) {
        modalboxHeight = this.state.statusdataSource.getRowCount() * 44;
      }
      this.setState({
        showType: false,
        showStatus: true,
      });
    } else if (index == 3) {
      if (this.state.rangedataSource.getRowCount() > 0) {
        modalboxHeight = this.state.rangedataSource.getRowCount() * 44;
      }
      this.setState({
        showType: false,
        showStatus: false,
        showRange: true,
      });
    }
    this.madalbox.open();
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
          const { modalclosed } = this.props;
          modalclosed();
        }}
        ref={box => this.madalbox = box}
      >
        {this.getPopList()}
      </ModalBox>
    );
  }
}