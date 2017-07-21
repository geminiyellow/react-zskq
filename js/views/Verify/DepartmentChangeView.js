/**
 * 部门信息变更
 */
import { DeviceEventEmitter, TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import Image from '@/common/components/CustomImage';
import Text from '@/common/components/TextField';
import EStyleSheet from 'react-native-extended-stylesheet';
import FormDetailUi from './../MyForms/FormDetailUi';
import { device, keys } from '../../common/Util';
import Line from '../../common/components/Line';

const checkboxNormal = 'checkbox_common';
const checkboxChecked = 'checkbox_selected';
const departmentchangeicon = 'departmentchange';

// 撤销是否可见
let cacelVisible = true;

// 底部操作是否可见
let bottomMeneVisible = true;

export default class DepartmentChangeView extends PureComponent {
  mixins: [React.addons.PureRenderMixin]
  constructor(...args) {
    super(...args);
    this.state = {
      checked: false,
    };
  }

  componentWillMount() {
    const { data, ischecked } = this.props;
    bottomMeneVisible = this.props.bottomMeneVisible;
    cacelVisible = this.props.cacelVisible;
    if (typeof(bottomMeneVisible) == 'undefined') {
      bottomMeneVisible = true;
    }
    if (typeof(cacelVisible) == 'undefined') {
      cacelVisible = true;
    }
    this.setState({
      bottomMenuVisible: bottomMeneVisible,
      iscacelVisible: cacelVisible,
      rowData: data,
      checked: ischecked,
      showRaido: false,
    });
  }

  componentWillReceiveProps(nextProps) {
    let ischecked = false;
    let needshowRaido = false;
    if (nextProps.data) {
      if (nextProps.data.checked) {
        ischecked = true;
      } else {
        ischecked = false;
      }

      if (nextProps.data.showRaido) {
        needshowRaido = true;
      } else {
        needshowRaido = false;
      }
    }
    this.setState({
      checked: ischecked,
      showRaido: needshowRaido,
    });
  }

  getRadioView() {
    if (this.state.showRaido) {
      return (
        <TouchableOpacity onPress={this.pressRadio}>
          <Image style={{ width: 18, height: 18, marginLeft: 15 }} source={{ uri: this.state.checked ? checkboxChecked : checkboxNormal }} />
        </TouchableOpacity>
      );
    }
    return null;
  }

  ItemClick=() => {
    if (this.state.showRaido) {
      this.pressRadio();
    } else {
      this.props.navigator.push({
        component: FormDetailUi,
        passProps: {
          data: this.state.rowData,
          bottomMenuVisible: this.state.bottomMenuVisible,
          iscacelVisible: this.state.iscacelVisible,
        },
      });
    }
  }

  pressRadio = () => {
    let result = this.state.rowData;
    if (this.state.checked) {
      result.checked = false;
    } else {
      result.checked = true;
    }
    // 通知父容器刷新界面 和 底部的全选菜单
    DeviceEventEmitter.emit('changeSelect', result);

    this.setState({
      checked: !this.state.checked,
    });
  }

  render() {
    return (
      <View style={styles.rowStyle}>
        <View style={styles.rowTitleStyle}>
          {this.getRadioView()}
          <View style={styles.circleStyle}>
            <Image style={{ width: 22, height: 22 }} source={{ uri: departmentchangeicon }} />
          </View>
          <Text numberOfLines={1} lineBreakMode="tail" style={styles.rowTitleTextStyle}>{`${this.state.rowData.formDetail.ToDoTitle}`}</Text>
          <Text style={styles.statusStyle}>{this.state.rowData.formDetail.ApplyDate}</Text>
        </View>
        <Line style={{ height: device.hairlineWidth, width: device.width - 30 }} />
        <TouchableOpacity style={styles.rowContentStyle} onPress={() => this.ItemClick()}>
          <Text style={styles.rowContentDateStyle}>{this.state.rowData.formDetail.ToDoTitle}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  rowStyle: {
    flexDirection: 'column',
    margin: 5,
    marginLeft: 11,
    marginRight: 11,
    borderWidth: 3 * device.hairlineWidth,
    borderColor: '#e3e3e3',
    borderRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  circleStyle: {
    flexDirection: 'column',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#5EB8FB',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 11,
  },
  statusStyle: {
    fontSize: 11,
    color: '#cccccc',
    marginRight: 22,
    textAlign: 'center',
  },
  rowTitleStyle: {
    height: 33,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  rowTitleTextStyle: {
    flex: 1,
    marginLeft: 8,
    color: '#333333',
    fontSize: 16,
  },
  rowContentStyle: {
    paddingLeft: 20,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: '#ffffffcc',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  rowContentDateStyle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333333',
  },
  rowContentDurationStyle: {
    marginTop: 12,
    fontSize: 15,
    color: '#3E3E3E',
  },
  rowContentReasonStyle: {
    marginTop: 20,
    fontSize: 13,
    lineHeight: 23,
    color: '#999999',
    marginRight: 20,
  },
});