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
import { companysCode } from '@/common/Consts';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';

const customizedCompanyHelper = new CustomizedCompanyHelper();

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
      title: 'mobile.module.verify.formtext',
      selected: false,
    },
    {
      id: '1',
      title: 'mobile.module.verify.batch',
      selected: false,
    },
  ];

const activepng = 'pull_up';
const normalpng = 'pull_down';

const piliangSelected = 'batch_actived';
const piliang = 'batch';

export default class IndicatorContainer extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      change: false,
    };
  }

  onPressFirst = () => {
    if (items[1].selected) {
      const { onSelect } = this.props;
      onSelect(2, false);
    }
    items[0].selected = !items[0].selected;
    items[1].selected = false;
    this.setState({
      change: !this.state.change,
    });
    const { onSelect } = this.props;
    onSelect(1, items[0].selected);
  }

  onPressSecond = () => {
    items[0].selected = false;
    items[1].selected = !items[1].selected;
    this.setState({
      change: !this.state.change,
    });
    const { onSelect } = this.props;
    onSelect(2, false);
  }

  onResetType(index) {
    if (index == 0) {
      items[0].selected = false;
    } else if (index == 1) {
      items[1].selected = false;
    } else {
      items.map(item => item.selected = false);
    }
    this.setState({
      change: !this.state.change,
    });
  }
  // 手动触发批量操作
  resetPiliang() {
    if (items[1].selected) {
      this.onPressSecond();
    }
  }

  getBatchView() {
    if (customizedCompanyHelper.getCompanyCode() == companysCode.Estee || customizedCompanyHelper.getCompanyCode() == companysCode.Samsung
    || customizedCompanyHelper.getCompanyCode() == companysCode.Gant) {
      return null;
    } else {
      return (
        <TouchableHighlight onPress={this.onPressSecond} style={{ flexGrow: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={items[1].selected ? styles.textSelected : styles.textUnSelected}>{I18n.t(items[1].title)}</Text>
            <Image style={styles.img_Style} source={{ uri: items[1].selected ? piliangSelected : piliang }} />
          </View>
        </TouchableHighlight>
      );
    }
  }

  render() {
    return (
      <View style={{ flexDirection: 'row', padding: 10, backgroundColor: 'white' }}>
        <TouchableHighlight onPress={this.onPressFirst} style={{ flexGrow: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={items[0].selected ? styles.textSelected : styles.textUnSelected}>{I18n.t(items[0].title)}</Text>
            <Image style={styles.img_Style} source={{ uri: items[0].selected ? activepng : normalpng }} />
          </View>
        </TouchableHighlight>

        {this.getBatchView()}
      </View>
    );
  }

}
