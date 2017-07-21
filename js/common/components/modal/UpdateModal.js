/**
 * 升级modal
 */
import {
  Text,
  View,
  ListView,
} from 'react-native';

import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import Modal from 'react-native-modalbox';
import { device } from '@/common/Util';
import UpdateModule from '@/views/Update/UpdateModule';
import I18n from 'react-native-i18n';
import { getCurrentLanguage } from '@/common/Functions';
import { appVersion, sourceDataZh, sourceDataEn } from '@/common/Consts';
import Button from '../Button';
/**
 * 是否显示审计modal
 */
let showModalTag = false;

const updateModule = new UpdateModule();

const styles = EStyleSheet.create({
  titleStyle: {
    color: '#000000',
    fontSize: 16,
    marginTop: 12,
    alignSelf: 'center',
  },
  versionStyle: {
    color: '#999999',
    fontSize: 11,
    marginTop: 8,
    alignSelf: 'center',
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
    borderRadius: 4,
    backgroundColor: '$color.white',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  modalButtonView: {
    flexGrow: 1,
    height: 96,
    marginTop: 33,
    alignSelf: 'center',
  },
  modalButton: {
    borderTopColor: '$color.line',
    borderTopWidth: device.hairlineWidth,
    height: 48,
    justifyContent: 'center',
  },
  modalButtonText: {
    textAlign: 'center',
    fontSize: 17,
    color: '$color.mainColorLight',
  },
});
export default class UpdateModal extends PureComponent {
  constructor(...args) {
    super(...args);
    this.updatelist = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      updatesdataSource: this.updatelist.cloneWithRows([]),
    };
  }

  componentWillMount() {
    getCurrentLanguage().then(dataLan => {
      if (dataLan == 'EN-US') {
        this.setState({
          updatesdataSource: this.updatelist.cloneWithRows(sourceDataEn),
        });
      } else {
        this.setState({
          updatesdataSource: this.updatelist.cloneWithRows(sourceDataZh),
        });
      }
    });
  }

  onPress() {
    updateModule.reset();
    this.modalbox.close();
  }

  close() {
    this.modalbox.close();
  }

  open() {
    if (showModalTag == false) return;
    this.modalbox.open();
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
          updateModule.reset();
        }}
      >
        <View style={styles.modalInnerView}>
          <Text allowFontScaling={false} style={styles.titleStyle}>{I18n.t('mobile.module.mine.update.title')}</Text>
          <Text allowFontScaling={false} style={styles.versionStyle}>{I18n.t('mobile.module.mine.aboutus.version')} : {appVersion}</Text>
          <View style={{ marginTop: 36, marginLeft: 24, marginRight: 24 }}>
            <Text allowFontScaling={false} style={styles.cententStyle}>{I18n.t('mobile.module.mine.update.desc')}</Text>
            <ListView
              style={{ marginTop: 30, height: 200 }}
              removeClippedSubviews={false}
              dataSource={this.state.updatesdataSource}
              renderRow={(rowData, sectionID, rowID, highlightRow) => this.inflateItem(rowData, sectionID, rowID, highlightRow)}
            />
          </View>
          <View style={styles.modalButtonView}>
            <Button
              containerStyle={{ width: 210 }}
              onPress={() => { this.onPress(); }}
              text={I18n.t('mobile.module.mine.update.iknow')}
            />
          </View>
        </View>
      </Modal>
    );
  }
}