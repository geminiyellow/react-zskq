/**
 * 顶部筛选布局
 */
import { View } from 'react-native';
import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import Image from '@/common/components/CustomImage';
import Text from '@/common/components/TextField';
import I18n from 'react-native-i18n';
import TouchableHighlight from '@/common/components/CustomTouchableHighlight';

const styles = EStyleSheet.create({
  img_Style: {
    width: 25,
    height: 25,
    alignSelf: 'flex-start',
  },
  textSelected: {
    color: '#1fd662',
    fontSize: 14,
    maxWidth: 90,
    textAlign: 'center',
  },
  textUnSelected: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333333',
    maxWidth: 90,
  },
  tabItemStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

});

const items =
  [
    {
      id: '0',
      title: 'mobile.module.verify.formtext',
      selected: false,
    },
    {
      id: '2',
      title: 'mobile.module.myform.datasection',
      selected: false,
    },
    {
      id: '1',
      title: 'mobile.module.verify.handleresult',
      selected: false,
    },
  ];

const activepng = 'pull_up';
const normalpng = 'pull_down';

export default class IndicatorContainer extends PureComponent {
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
    const { onSelect } = this.props;
    onSelect(1);
  }

  onPressSecond = () => {
    items[0].selected = false;
    items[1].selected = false;
    items[2].selected = true;
    this.setState({
      change: !this.state.change,
    });
    const { onSelect } = this.props;
    onSelect(2);
  }

  onPressDataRange = () => {
    items[0].selected = false;
    items[1].selected = true;
    items[2].selected = false;
    this.setState({
      change: !this.state.change,
    });
    const { onSelect } = this.props;
    onSelect(3);
  }

  onReset() {
    items.map(item => item.selected = false);
    this.setState({
      change: !this.state.change,
    });
  }

  render() {
    return (
      <View style={{ flexDirection: 'row', height: 48, paddingVertical: 10, backgroundColor: 'white' }}>
        <TouchableHighlight onPress={this.onPressFirst} style={{ flex: 1 }}>
          <View style={styles.tabItemStyle}>
            <Text numberOfLines={1} style={items[0].selected ? styles.textSelected : styles.textUnSelected}>{I18n.t(items[0].title)}</Text>
            <Image style={styles.img_Style} source={{ uri: items[0].selected ? activepng : normalpng }} />
          </View>
        </TouchableHighlight>

        <TouchableHighlight onPress={this.onPressDataRange} style={{ flex: 1 }}>
          <View style={styles.tabItemStyle}>
            <Text numberOfLines={1} style={items[1].selected ? styles.textSelected : styles.textUnSelected}>{I18n.t(items[1].title)}</Text>
            <Image style={styles.img_Style} source={{ uri: items[1].selected ? activepng : normalpng }} />
          </View>
        </TouchableHighlight>

        <TouchableHighlight onPress={this.onPressSecond} style={{ flex: 1 }}>
          <View style={styles.tabItemStyle}>
            <Text numberOfLines={1} style={items[2].selected ? styles.textSelected : styles.textUnSelected}>{I18n.t(items[2].title)}</Text>
            <Image style={styles.img_Style} source={{ uri: items[2].selected ? activepng : normalpng }} />
          </View>
        </TouchableHighlight>
      </View>
    );
  }

}
