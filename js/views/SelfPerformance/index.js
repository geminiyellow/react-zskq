
import React, { PureComponent } from 'react';
import {
  StatusBar,
  Text,
  View,
} from 'react-native';

import SegmentedControlTab from 'react-native-segmented-control-tab';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import Line from '@/common/components/Line';
import NavBar from '@/common/components/NavBar';
import { device } from '@/common/Util';
import Image from '@/common/components/CustomImage';
import TouchableHightlight from '@/common/components/CustomTouchableHighlight';
import Filter from '@/common/components/Filter/Filter';
import FilterModal from '@/common/components/Filter/FilterModal';
import DataSources from './DataSources';
import SelfChart from './SelfChart';
import Circular from './Circular';
import SelfCircular from './SelfCircular';

const leftBack = 'back';
let onPressItemIndex = 0;

export default class SelfPerformance extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
    };
  }

  backView() {
    this.props.navigator.pop();
  }

  handleIndexChange = (index) => {
    this.setState({
      selectedIndex: index,
    });
  }

  renderDetailView() {
    const { selectedIndex } = this.state;
    let detailView = null;
    switch (selectedIndex) {
      case 0:
        detailView = (
          <SelfCircular />
        );
        break;
      case 1:
        detailView = (
          <SelfChart />
        );
        break;
      default:
        break;
    }
    return detailView;
  }

  render() {
    const { selectedIndex } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" style={styles.statusBar} />
        <View style={styles.segmentContent}>
          <View style={styles.segmentInnerView}>
            <TouchableHightlight style={{ flex: 1 }} onPress={() => this.backView()}>
              <View>
                <Image style={styles.imageBack} source={{ uri: leftBack }} />
              </View>
            </TouchableHightlight>
            <SegmentedControlTab
              values={[I18n.t('mobile.module.selfperformance.target'), I18n.t('mobile.module.selfperformance.performance')]}
              tabsContainerStyle={styles.segmented}
              selectedIndex={selectedIndex}
              onTabPress={this.handleIndexChange}
              tabTextStyle={styles.tabTextStyle}
              borderRadius={1}
              activeTabStyle={styles.activeTabStyle}
              tabStyle={styles.tabStyle} />
            <View style={{ flex: 1 }} />
          </View>
        </View>
        <Line />
        {this.renderDetailView()}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
  },
  statusBar: {
    height: 20,
    width: device.width,
  },
  segmentContent: {
    backgroundColor: '#FFF',
  },
  segmentInnerView: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: device.isIos ? 20 + 8 : 8,
    marginBottom: 8,
  },
  imageBack: {
    width: 13,
    height: 22,
    marginLeft: 12,
    marginTop: ((29 / 667) * device.height - 22) / 2,
  },
  segmented: {
    width: 0.4 * device.width,
    height: (29 / 667) * device.height,
  },

  tabTextStyle: {
    fontSize: 14,
    color: '$color.mainColorLight',
  },
  activeTabStyle: {
    backgroundColor: '$color.mainColorLight',
  },
  tabStyle: {
    borderColor: '$color.mainColorLight',
  },
});
