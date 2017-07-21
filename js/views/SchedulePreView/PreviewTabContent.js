/**
 * 顶部tab控件
 */

import { TouchableOpacity, View } from 'react-native';
import Text from '@/common/components/TextField';
import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import _ from 'lodash';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
  },
  normalbg: {
    flex: 1,
    backgroundColor: 'white',
  },
  selectedbg: {
    flex: 1,
    backgroundColor: '#14BE4B',
  },
  normaltextStyle: {
    fontSize: 16,
    color: '#000',
  },
  selectedtextStyle: {
    fontSize: 16,
    color: '#fff',
  },
});

export default class Shoplists extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      selected: 0,
    };
  }

  ItemClick = (index) => {
    const { tabSelected } = this.props;
    this.setState({
      selected: index,
    });
    tabSelected(index);
  }

  render() {
    return (
      <View style={{ flexDirection: 'row', backgroundColor: 'white' }}>
        <TouchableOpacity style={this.state.selected == 0 ? styles.selectedbg : styles.normalbg} onPress={() => this.ItemClick(0)} >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14 }}>
            <Text style={this.state.selected == 0 ? styles.selectedtextStyle : styles.normaltextStyle}>月视图</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={this.state.selected == 1 ? styles.selectedbg : styles.normalbg} onPress={() => this.ItemClick(1)} >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14 }}>
            <Text style={this.state.selected == 1 ? styles.selectedtextStyle : styles.normaltextStyle}>周视图</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={this.state.selected == 2 ? styles.selectedbg : styles.normalbg} onPress={() => this.ItemClick(2)} >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14 }}>
            <Text style={this.state.selected == 2 ? styles.selectedtextStyle : styles.normaltextStyle}>天视图</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}