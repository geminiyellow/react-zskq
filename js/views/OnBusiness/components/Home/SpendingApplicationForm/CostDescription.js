// 费用详细描述

import React, { Component } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { event, device } from '@/common/Util';
import I18n from 'react-native-i18n';
import EStyleSheet from 'react-native-extended-stylesheet';
import TextArea from '@/common/components/TextArea';

export default class CostDescription extends Component {

  /** callback */

  onChangeTextEvent(text) {
    const { rowID } = this.props;
    const params = { text, rowID };
    DeviceEventEmitter.emit(event.OB_SET_COST_DESCRIPTION, params);
  }

  /** render method */

  render() {
    const { rowData } = this.props;
    return (
      <TextArea
        containerStyle={styles.textArea}
        title={I18n.t('mobile.module.onbusiness.costdescriptiontitle')}
        placeholder={I18n.t('mobile.module.onbusiness.costdescriptionplaceholdertext')}
        textValue={rowData ? rowData.Agenda : ''}
        onChange={(text) => this.onChangeTextEvent(text)}
        onSubmitEditing={(text) => this.onChangeTextEvent(text)}
        onEndEditing={(text) => this.onChangeTextEvent(text)}
        topLine={false}
        bottomLine={false}
      />
    );
  }
}

const styles = EStyleSheet.create({
  textArea: {
    marginTop: 0,
  },
  input: {
    '@media ios': {
      paddingVertical: 5,
    },
    flexGrow: 1,
    width: device.width - 32,
    fontSize: 14,
    color: '#000000',
    textAlignVertical: 'top',
    margin: 0,
    padding: 0,
  },
});