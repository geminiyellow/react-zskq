/**
 * 首次登录 修改密码提示框
 */
import {
  NativeModules,
  Text,
  View,
  ListView,
} from 'react-native';

import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import Modal from 'react-native-modalbox';
import { device } from '@/common/Util';
import I18n from 'react-native-i18n';
import ChangePassword from '@/views/Mine/ChangePassword';
import { appVersion } from '@/common/Consts';
import TouchableHighlight from '@/common/components/CustomTouchableHighlight';
import ForcedUpdate from '@/views/Update/ForcedUpdate';

import Button from '../Button';

const forcedUpdate = new ForcedUpdate();
const { RNManager } = NativeModules;

export default class ChangePwd extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      staffId: '',
    }
  }
  componentDidMount() {
    const needUpdate = forcedUpdate.needForcedUpdate();
    if (needUpdate) {
      this.modalbox.open();
    }
  }

  onPress = () => {
    this.props.navigator.push({
      component: ChangePassword,
      staffId: this.staffId,
      atFirstLogin: true,
    });
    this.modalbox.close();
  }

  close() {
    this.modalbox.close();
  }

  open() {
    this.modalbox.open();
  }

  getStaffId(staffId) {
    this.staffId = staffId;
  }

  inflateItem(rowData, sectionID, rowID, highlightRow) {
    return (
      <Text allowFontScaling={false} style={styles.updatelistStyle}>{rowData}</Text>
    );
  }

  render() {
    return (
      <Modal
        ref={modal => this.modalbox = modal}
        swipeToClose={false}
        backdropOpacity={0.4}
        animationDuration={0}
        style={styles.modalView}
        onClosed={() => {
        }}
      >
        <View style={styles.modalInnerView}>
          <Text allowFontScaling={false} style={styles.titleStyle}>{I18n.t('mobile.module.login.updatepwd')}</Text>
          <Text allowFontScaling={false} style={styles.updateDetail}>{I18n.t('mobile.module.login.firstchange')}</Text>
          <View style={styles.line} />
          <TouchableHighlight style={styles.touchable} onPress={() => this.onPress()}>
            <Text style={styles.textDownload}>{I18n.t('mobile.module.login.go')}</Text>
          </TouchableHighlight>
        </View>
      </Modal>
    );
  }
}

const styles = EStyleSheet.create({
  titleStyle: {
    color: '#030303',
    fontWeight: 'bold',
    fontSize: 17,
    marginTop: 20,
    alignSelf: 'center',
  },
  updateDetail: {
    color: '#030303',
    fontSize: 13,
    marginTop: 8,
    alignSelf: 'center',
    textAlign: 'center',
    marginLeft: 38,
    marginRight: 38,
    // lineHeight: 4,
  },
  cententStyle: {
    fontSize: 12,
    color: '#666666',
  },
  updatelistStyle: {
    fontSize: 14,
    color: '#999999',
  },
  modalView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 38,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalInnerView: {
    // flexGrow: 1,
    borderRadius: 12,
    backgroundColor: '$color.white',
    alignSelf: 'center',
    justifyContent: 'center',
    width: device.width - 104,
    alignItems: 'center',
  },
  line: {
    marginTop: 20,
    backgroundColor: '$color.line',
    width: device.width - 104,
    height: device.hairlineWidth,
  },
  textDownload: {
    marginTop: 7,
    marginBottom: 10,
    fontSize: 17,
    color: '$color.mainColorLight',
    textAlign: 'center',
  },
  touchable: {
    width: 200,
    height: 38,
  },
});