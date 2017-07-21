/**
 * 顶部筛选布局  对外公布props  onTabSelect回调
 */
import { TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import Text from '@/common/components/TextField';
import EStyleSheet from 'react-native-extended-stylesheet';
import Image from '@/common/components/CustomImage';
import I18n from 'react-native-i18n';

const styles = EStyleSheet.create({
  img_Style: {
    width: 30,
    height: 30,
    alignSelf: 'center',
    marginLeft: 1,
  },
  textSelected: {
    color: '#1fd662',
    fontSize: 14,
    textAlign: 'center',
  },
  textUnSelected: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333333',
  },

});

const items =
  [
    {
      id: '0',
      title: 'mobile.module.myform.formtype',
      selected: false,
    },
    {
      id: '2',
      title: 'mobile.module.myform.datasection',
      selected: false,
    },
    {
      id: '1',
      title: 'mobile.module.myform.formstatus',
      selected: false,
    },
  ]
  ;


const activepng = 'pull_up';
const normalpng = 'pull_down';

export default class IndicatorTab extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      change: false,
    };
  }

  onPressFirst = () => {
    items[0].selected = true;
    items[1].selected = false;
    items[2].selected = false;
    this.setState({
      change: !this.state.change,
    });
    const { onTabSelect } = this.props;
    onTabSelect(1);
  }

  onPressSecond = () => {
    items[0].selected = false;
    items[1].selected = false;
    items[2].selected = true;
    this.setState({
      change: !this.state.change,
    });
    const { onTabSelect } = this.props;
    onTabSelect(2);
  }

  onPressDataRange = () => {
    items[0].selected = false;
    items[1].selected = true;
    items[2].selected = false;
    this.setState({
      change: !this.state.change,
    });
    const { onTabSelect } = this.props;
    onTabSelect(3);
  }

  onReset() {
    items.map(item => item.selected = false);
    this.setState({
      change: !this.state.change,
    });
  }

  render() {
    return (
      <View style={{ flexDirection: 'row', padding: 10, backgroundColor: 'white' }}>
        <TouchableOpacity onPress={this.onPressFirst} style={{ flexGrow: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text allowFontScaling={false} style={items[0].selected ? styles.textSelected : styles.textUnSelected}>{I18n.t(items[0].title)}</Text>
          <Image style={styles.img_Style} source={{ uri: items[0].selected ? activepng : normalpng }} />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onPressDataRange} style={{ flexGrow: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text allowFontScaling={false} style={items[1].selected ? styles.textSelected : styles.textUnSelected}>{I18n.t(items[1].title)}</Text>
          <Image style={styles.img_Style} source={{ uri: items[1].selected ? activepng : normalpng }} />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onPressSecond} style={{ flexGrow: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text allowFontScaling={false} style={items[2].selected ? styles.textSelected : styles.textUnSelected}>{I18n.t(items[2].title)}</Text>
          <Image style={styles.img_Style} source={{ uri: items[2].selected ? activepng : normalpng }} />
        </TouchableOpacity>
      </View>
    );
  }

}
