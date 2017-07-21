/**
 * 强制更新 modal提示框
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
import { appVersion } from '@/common/Consts';
import TouchableHighlight from '@/common/components/CustomTouchableHighlight';
import ForcedUpdate from '@/views/Update/ForcedUpdate';

import Button from '../Button';

const forcedUpdate = new ForcedUpdate();
const { RNManager } = NativeModules;

export default class ForcedUpdateModal extends PureComponent {

  componentDidMount() {
    const needUpdate = forcedUpdate.needForcedUpdate();
    if (needUpdate) {
      this.modalbox.open();
    }
  }

  onPress() {
    RNManager.openURL('http://a.app.qq.com/o/simple.jsp?pkgname=com.gaiaworks.gaiaonehandle');
  }

  close() {
    this.modalbox.close();
  }

  open() {
    this.modalbox.open();
  }

  inflateItem(rowData, sectionID, rowID, highlightRow) {
    return (
      <Text allowFontScaling={false} style={styles.updatelistStyle}>{rowData}</Text>
    );
  }

  render() {
    const msg = global.companyResponseData ? global.companyResponseData.appInfo.updateDesc : null;
    const str = '    ';
    const strMsg = str.concat(msg);
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
          <Text allowFontScaling={false} style={styles.titleStyle}>更新提示</Text>
          <Text allowFontScaling={false} style={styles.updateDetail}>{strMsg}</Text>
          <View style={styles.line} />
          <TouchableHighlight style={styles.touchable} onPress={() => this.onPress()}>
            <Text style={styles.textDownload}>立即下载</Text>
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
    marginTop: 10,
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