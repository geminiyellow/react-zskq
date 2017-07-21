/**
 * 加班申请表单Item界面
 */

import { View } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import I18n from 'react-native-i18n';
import { messageType } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import TextArea from '@/common/components/TextArea';
import InputCard from '@/common/components/InputCard';
import OptionCard from '@/common/components/OptionCard';
import {
  mealTypeLoadSub,
  formTypeWordAndWord,
  formTypeWordAndImage,
  formTypeWordAndInput,
  formTypeInput,
} from '../constants';
import styles from '../styles';

export default class FormItem extends PureComponent {

  constructor(...props) {
    super(...props);
    // 获取传过来的数据
    const { leftTextView, rightTextView, typeItem, textInput, textInputMultiline } = this.props;
    this.state = {
      leftTextViewS: leftTextView,
      rightTextViewS: rightTextView,
      typeItemS: typeItem,
      textInputS: textInput,
      textInputMultilineS: textInputMultiline,
    };
  }

  // --------------加班【文字 - 文字】设置-----------------
  // 设置页面信息
  onSetRefreshInfo(str) {
    this.setState({
      rightTextViewS: str,
    });
  }

  // 获取刷新的信息
  onGetRefreshInfo() {
    return this.state.rightTextViewS;
  }

  // --------------加班餐时数输入框-----------------------
  // 设置输入框信息
  onInputChange(text) {
    this.setState({ textInputS: text });
  }

  // 当离开输入框的时候
  onSetInputInfo() {
    const { textInputS } = this.state;
    // 判断输入餐别时间是否为空
    if (_.isEmpty(textInputS)) {
      showMessage(messageType.error, I18n.t('mobile.module.overtime.overtimeapplym'));
      return;
    }
    // 判断输入的信息不符合要求
    const regex = /^\d+(\.\d+)?$/;
    if (!textInputS.match(regex)) {
      showMessage(messageType.error, I18n.t('mobile.module.overtime.overtimeapplyinput'));
      return;
    }
    const { onGetEmployeeActualOTHours } = this.props;
    onGetEmployeeActualOTHours(mealTypeLoadSub);
  }

  // 获取输入的信息
  onGetInputInfo() {
    return this.state.textInputS;
  }

  // --------------加班原因详情输入框-------------------
  // 设置详情的输入框信息
  onSetInputDetail(text) {
    this.setState({
      textInputMultilineS: text,
    });
  }

  // 获取详情的输入框信息
  onGetInputDetail() {
    return this.state.textInputMultilineS;
  }

  // 加载申请的表单的各种类型的Item
  onLoadingOvertimeItem() {
    const { typeItemS, leftTextViewS, rightTextViewS, textInputMultilineS } = this.state;
    const { topLine, topLineStyle, bottomLine, bottomLineStyle } = this.props;
    // 带有文字 - 文字
    if (typeItemS === formTypeWordAndWord) {
      return (
        <OptionCard
          topLine={topLine}
          topLineStyle={topLineStyle}
          bottomLine={bottomLine}
          bottomLineStyle={bottomLineStyle}
          rightImage={false}
          disabled
          detailMarginRight={18}
          title={leftTextViewS}
          detailText={rightTextViewS}
        />
      );
    }
    // 带有文字 -（文字-图片）
    if (typeItemS === formTypeWordAndImage) {
      return (
        <OptionCard
          topLine={topLine}
          topLineStyle={topLineStyle}
          bottomLine={bottomLine}
          bottomLineStyle={bottomLineStyle}
          title={leftTextViewS}
          detailText={rightTextViewS}
          onPress={() => this.props.onPress()}
        />
      );
    }
    // 带有文字 - 输入框
    if (typeItemS === formTypeWordAndInput) {
      return (
        <InputCard
          style={styles.container}
          title={leftTextViewS}
          placeholder={rightTextViewS}
          keyboardType={'decimal-pad'}
          topLine={topLine}
          topLineStyle={topLineStyle}
          bottomLine={bottomLine}
          bottomLineStyle={bottomLineStyle}
          onEndEditing={() => this.onSetInputInfo()}
          onSubmitEditing={text => this.onSetInputInfo()}
          onChangeText={text => this.onInputChange(text)}
        />
      );
    }
    // 带有输入框
    if (typeItemS === formTypeInput) {
      return (
        <TextArea
          bottomLine={false}
          title={I18n.t('mobile.module.overtime.detailstitle')}
          placeholder={leftTextViewS}
          value={textInputMultilineS}
          onChange={text => this.onSetInputDetail(text)}
          onSubmitEditing={text => this.onSetInputDetail(text)}
          onEndEditing={text => this.onSetInputDetail(text)}
        />
      );
    }
    return null;
  }

  render() {
    return (
      <View>
        {this.onLoadingOvertimeItem()}
      </View>
    );
  }
}
