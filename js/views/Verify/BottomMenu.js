/**
 * 底部菜单
 */
import { TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import Text from '@/common/components/TextField';
import Image from '@/common/components/CustomImage';

const checkboxNormal = 'checkbox_common';
const checkboxChecked = 'checkbox_selected';

export default class BottomMenu extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      checked: false,
    };
  }

  pressRadio=() => {
    const { selectAll } = this.props;
    if (selectAll) {
      if (this.state.checked) {
        selectAll(false);
      } else {
        selectAll(true);
      }
    }

    this.setState({
      checked: !this.state.checked,
    });
  }

  agreeAll= () => {
    const { agree } = this.props;
    agree();
  }

  rejectAll= () => {
    const { reject } = this.props;
    reject();
  }

  // 列表单行选中改变的时候 ，刷新底部的全选按钮
  refreash(list) {
    let result = true;
    for (item of list) {
      if (!item.checked) {
        result = false;
      }
    }

    if (this.state.checked != result) {
      this.setState({
        checked: result,
      });
    }
  }

  render() {
    return (
      <View style={styles.bottomStyle}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={this.pressRadio}>
            <Image style={{ width: 25, height: 25 }} source={{ uri: this.state.checked ? checkboxChecked : checkboxNormal }} />
          </TouchableOpacity>
          <Text style={{ marginLeft: 8, fontSize: 14 }}>{I18n.t('mobile.module.verify.bottom.menu.all')}</Text>
        </View>

        <View style={{ flexGrow: 1 }} />

        <TouchableOpacity onPress={this.agreeAll}>
          <Text style={{ color: '#37D871', fontSize: 16 }}>{I18n.t('mobile.module.verify.bottom.menu.allagree')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ marginLeft: 15 }} onPress={this.rejectAll}>
          <Text style={{ color: '#37D871', fontSize: 16 }}>{I18n.t('mobile.module.verify.bottom.menu.allreject')}</Text>
        </TouchableOpacity>
      </View>
     );
  }
}
const styles = EStyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '$color.containerBackground',
  },
  bottomStyle: {
    backgroundColor: 'white',
    height: 50,
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
