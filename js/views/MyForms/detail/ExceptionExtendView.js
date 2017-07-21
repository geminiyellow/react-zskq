/**
 * 异常类型表单折叠控件
 */
import { Text, TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import Line from '@/common/components/Line';
import _ from 'lodash';
import { device } from '@/common/Util';
import Image from '@/common/components/CustomImage';
import I18n from 'react-native-i18n';
import FormDetailStyle from '../FormDetailStyle';
import { getYYYYMMDDFormat, getHHmmFormat } from '@/common/Functions';

const unusualImg = 'unusual';
const arrowDownImg = 'arrow_down';
const arrowUpImg = 'arrow_up';
export default class ExceptionExtendView extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      extend: false,
      Item: null,
    };
  }
  componentWillMount() {
    const temp = this.props.item;
    this.setState({
      Item: temp,
    });
  }

  getModifiedPunchTimeView = () => {
    if (this.state.Item.ModifiedPunchTime && !_.isEmpty(this.state.Item.ModifiedPunchTime)) {
      return (
        <View>
          <View style={FormDetailStyle.rowTagStyle}>
            <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.modifypunchtime')}</Text>
            <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{this.state.Item.ModifiedPunchTime}</Text>
          </View>
          <Line style={FormDetailStyle.lineStyle} />
        </View>
      );
    }
    return null;
  }

  extendViews = () => {
    const Data = getHHmmFormat(this.state.Item.PlanPunchTime);

    if (this.state.extend) {
      return (
        <View>
          <View style={FormDetailStyle.rowTagStyle}>
            <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.exception.checkintime')}</Text>
            <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{`${_.isEmpty(this.state.Item.ActualPunchTime) ? `${I18n.t('mobile.module.verify.exception.nocheckin')}` : Data}`}</Text>
          </View>
          <Line style={FormDetailStyle.lineStyle} />
          <View style={FormDetailStyle.rowTagStyle}>
            <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.exception.shouldpunchclock')}</Text>
            <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{Data}</Text>
          </View >
          <Line style={FormDetailStyle.lineStyle} />
          {this.getModifiedPunchTimeView()}
          <View style={FormDetailStyle.rowTagStyle}>
            <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.leave.appealreason')}</Text>
            <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{this.state.Item.Reason}</Text>
          </View>
          <Line style={FormDetailStyle.lineStyle} />
          <View style={FormDetailStyle.rowTagStyle}>
            <Text allowFontScaling={false} style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.reasondetail')}</Text>
            <Text allowFontScaling={false} style={FormDetailStyle.rowContentValueStyle}>{this.state.Item.ReasonDetail}</Text>
          </View>
          <Line style={FormDetailStyle.lineStyle} />
        </View>
      );
    }
    return null;
  }

  toggleExtend = () => {
    this.setState({
      extend: !this.state.extend,
    });
  }

  render() {
    const startData = getYYYYMMDDFormat(this.state.Item.ExceptionDate);

    return (
      <View style={[{ backgroundColor: 'white' }, this.props.style]}>
        <TouchableOpacity onPress={this.toggleExtend}>
          <View style={{ flexDirection: 'row', paddingTop: 13, paddingBottom: 13, alignItems: 'center' }}>
            <Image source={{ uri: unusualImg }} style={{ width: 44, height: 44 }} />
            <View style={{ flex: 1, flexDirection: 'column', marginLeft: 12 }}>
              <Text allowFontScaling={false} numberOfLines={1} style={FormDetailStyle.rowTagTitleStyle}>{this.state.Item.ExceptionName}</Text>
              <Text allowFontScaling={false} numberOfLines={1} style={[FormDetailStyle.rowContentValueStyle, { textAlign: 'left', marginLeft: 0 }]}>{startData}</Text>
            </View>
            <Image source={{ uri: (this.state.extend) ? arrowUpImg : arrowDownImg }} style={{ width: 14, height: 8, marginRight: 12 }} />
          </View>
        </TouchableOpacity>
        <Line style={FormDetailStyle.lineStyle} />
        {this.extendViews()}
      </View>
    );
  }
}