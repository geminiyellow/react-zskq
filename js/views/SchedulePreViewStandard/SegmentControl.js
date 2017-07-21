import React, { PureComponent } from 'react';
import SegmentedControlTab from 'react-native-segmented-control-tab'
import EStyleSheet from 'react-native-extended-stylesheet';
import { device } from '@/common/Util';

export default class SegmentControl extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      selectedIndex: 0,
    };
  }

  handleIndexChange = (index) => {
    const { tabSelected } = this.props;
    if(tabSelected)
      tabSelected(index);
    this.setState({
      selectedIndex: index,
    });
  }

  render() {
    return (
      <SegmentedControlTab
        values={['月', '周', '天']}
        tabsContainerStyle={styles.tabsContainerStyle}
        tabStyle={styles.tabStyle}
        tabTextStyle={styles.tabTextStyle}
        activeTabStyle={styles.activeTabStyle}
        activeTabTextStyle={styles.activeTabTextStyle}
        selectedIndex={this.state.selectedIndex}
        borderRadius={2}
        onTabPress={this.handleIndexChange}
      />
    );
  }
}

const styles = EStyleSheet.create({
  tabsContainerStyle: {
    width: 151,
    height: 29,
  },
  tabStyle: {
    borderColor: '$color.mainColorLight',
    paddingVertical: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  tabTextStyle: {
    color: '$color.mainColorLight',
    fontSize: 14
  },
  activeTabStyle: {
    backgroundColor: '$color.mainColorLight',
  },
  activeTabTextStyle: {
    color: 'white',
    fontSize: 14
  },
});