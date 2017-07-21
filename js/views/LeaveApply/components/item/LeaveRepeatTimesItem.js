import React, { PureComponent } from 'react';
import {
  Text,
  View,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import { device } from '@/common/Util';
import Line from '@/common/components/Line';
import _ from 'lodash';

import Count from "@/common/components/Count";
import { switchCard, color } from '@/common/Style';

export default class LeaveRepeatTimesItem extends PureComponent {

  constructor(props) {
    super(props);
    // state控制
    this.state = {
      textValue: this.props.textValue,
      isShow: this.props.isShow,
    };
  }

  onShowItem(show, value) {
    this.setState({
      textValue: value,
      isShow: show,
    });
  }

  onUp(textValue) {
    const { onUp } = this.props;
    onUp(textValue);
  }

  onDown(textValue) {
    const { onDown } = this.props;
    onDown(textValue);
  }

  onInput(textValue) {
    const { onInput } = this.props;
    onInput(textValue);
  }

  render() {
    if (this.state.isShow) {
      return (
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <Text allowFontScaling={false} numberOfLines={1} style={styles.title}>{I18n.t('mobile.module.leaveapply.leaveapplyisrepeattimes')}</Text>
            <Count
              textValue={this.state.textValue}
              onUp={(textValue) => this.onUp(textValue)}
              onDown={(textValue) => this.onDown(textValue)}
              onInput={(textValue) => this.onInput(textValue)} />
          </View>
          <Line style={styles.bottomLineStyle} />
        </View>
      );
    }
    return null;
  }
}

const styles = EStyleSheet.create({
  container: {
    height: '$switchCard.defaultHeight',
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    flex: 1,
    paddingLeft: 18,
    paddingRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: switchCard.title.fontSize,
    marginRight: 11,
    color: switchCard.title.color,
  },
  bottomLineStyle: {
    width: device.width,
  },
});