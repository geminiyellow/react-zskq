import { DeviceEventEmitter, View } from 'react-native';
import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import Image from '@/common/components/CustomImage';
import Text from '@/common/components/TextField';
import I18n from 'react-native-i18n';
import TouchableHighlight from '@/common/components/CustomTouchableHighlight';
import Line from '@/common/components/Line';
import { device } from '@/common/Util';
import _ from 'lodash';

const styles = EStyleSheet.create({
  img_Style: {
    width: 10,
    height: 5,
    marginLeft: 4,
    marginTop: 2,
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

const items = [];

const activepng = 'filter_arrow_up';
const normalpng = 'filter_arrow_down';
// item bg
const linepng = 'line_bg';
const tranglepng = 'trangle_bg';

let onPressItemIndex = 0;

export default class Filter extends PureComponent {
  constructor(...args) {
    super(...args);
    items = this.props.dataSources;
    this.state = {
      change: false,
      isBgShow: false,
    };
  }

  componentWillMount() {
    this.listeners && this.listeners.forEach(listener => listener.remove());
  }

  componentDidMount() {
    this.listeners = [
      DeviceEventEmitter.addListener('INIT_FILTER', (eventBody) => {
        this.onResetType();
      }),
      DeviceEventEmitter.addListener('UPDATE_FILTER_VALUE', (eventBody) => {
        this.onUpdateFilterValue(eventBody);
      }),
    ];
  }


  /**
   * 更新新的状态
   */
  onUpdateDataSource(newProps) {
    items = [];
    items = newProps;
  }

  onPressItem = (index) => {
    onPressItemIndex = index;
    items[index].selected = !items[index].selected;
    for (let i = 0; i < items.length; i++) {
      if (i == index) {
        continue;
      }
      items[i].selected = false;
    }

    this.onUpdateBg(items, index);

    this.setState({
      change: !this.state.change,
    });
    const { onSelect } = this.props;
    onSelect(index, items[index].selected);
    // 执行关闭modal
    const params = {};
    params.index = index;
    params.selected = !items[index].selected;
    params.items = items;
    DeviceEventEmitter.emit('CLOSE_MODAL', params);
  }

  onResetType() {
    items.map(item => item.selected = false);
    this.setState({
      isBgShow: false,
      change: !this.state.change,
    });
  }

  onUpdateFilterValue(value) {
    items[onPressItemIndex].title = value;
    this.setState({
      change: !this.state.change,
    });
  }

  onUpdateFilterValueById(index, value) {
    items[index].title = value;
    this.setState({
      change: !this.state.change,
    });
  }

  onUpdateBg(items, index) {
    let isAllUnSame = false;
    for (let i = 0; i < items.length; i++) {
      if (`${items[0].selected}` == `${items[i].selected}`) {
        isAllUnSame = true;
      } else {
        isAllUnSame = false;
        break;
      }
    }
    if (isAllUnSame) {
      // 全为false
      this.setState({
        isBgShow: false,
      });
    } else {
      this.setState({
        isBgShow: true,
      });
    }
  }

  oninitBg(i) {
    if (this.state.isBgShow) {
      let left = 0;
      let widthAdd = 2;
      if (i === 0) {
        left = -10;
        widthAdd = 12;
      }
      return (
        <Image style={{
          width: (device.width / items.length) + widthAdd,
          height: 40,
          position: 'absolute',
          top: 0,
          left: left,
        }} source={{ uri: items[i].selected ? tranglepng : linepng }} />
      );
    }
  }

  onInitFilterItem(i) {
    let itemWidth = device.width / items.length;
    const title = items[i].title;
    if (i === 0) {
      itemWidth = itemWidth - 12;
    }

    return (
      <View style={{ flexDirection: 'row', width: itemWidth }}>
        <TouchableHighlight onPress={() => this.onPressItem(i)} style={{ flexGrow: 1 }}>
          <View style={{ alignItems: 'center', height: 30 }}>
            <View style={{ flexDirection: 'row', height: 26, width: itemWidth * 0.6, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={[items[i].selected ? styles.textSelected : styles.textUnSelected]} numberOfLines={1}>{title}</Text>
              <Image style={styles.img_Style} source={{ uri: items[i].selected ? activepng : normalpng }} />
            </View>
          </View>
        </TouchableHighlight>
        <Line style={{ height: 30, width: 1 }} />
      </View>
    );
  }

  onInitFilterItemWithoutLine(i) {
    let itemWidth = device.width / items.length;
    const title = items[i].title;
    if (i === 0) {
      itemWidth = itemWidth - 12;
    }
    return (
      <TouchableHighlight onPress={() => this.onPressItem(i)} style={{ flexGrow: 1, width: itemWidth }}>
        <View style={{ alignItems: 'center', height: 30 }}>
          <View style={{ flexDirection: 'row', height: 26, width: itemWidth * 0.6, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[items[i].selected ? styles.textSelected : styles.textUnSelected]} numberOfLines={1}>{title}</Text>
            <Image style={styles.img_Style} source={{ uri: items[i].selected ? activepng : normalpng }} />
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    let filterItems = [];
    for (let i = 0; i < items.length; i++) {
      if (items.length == 1) {
        filterItems.push(
          <View style={{ flexDirection: 'column' }} key={i}>
            {this.onInitFilterItem(0)}
          </View>
        );
      } else {
        if (i == items.length - 1) {
          filterItems.push(
            <View style={{ flexDirection: 'column' }} key={i}>
              {this.onInitFilterItemWithoutLine(i)}
            </View >
          );
        } else {
          filterItems.push(
            <View style={{ flexDirection: 'column' }} key={i}>
              {this.onInitFilterItem(i)}
            </View>
          );
        }
      }
    }

    return (
      <View>
        <View style={{ flexDirection: 'row', padding: 7, backgroundColor: 'white', marginTop: device.hairlineWidth }}>
          {filterItems}
        </View>
        <Line />
      </View>

    );
  }

}
