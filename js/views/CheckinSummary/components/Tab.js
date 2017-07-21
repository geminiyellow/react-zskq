import React from 'react';
import { DeviceEventEmitter, Text, View } from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import Image from '@/common/components/CustomImage';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device, event } from '@/common/Util';
import { showMessage } from '@/common/Message';
import I18n from 'react-native-i18n';
import { messageType } from '@/common/Consts';
import Picker from '@/common/components/OptionPicker';
import NavBar from '@/common/components/NavBar';
import EmptyView from '@/common/components/EmptyView';
import Exception from './Exception';
import Attendance from './Attendance';
import PunchCard from './PunchCard';
import { SHOW_PICKER, EXCEPTION, ATTENDANCE, PUNCH_CARD } from '../constants';
import { fetchExceptionStatistics, abort } from '../Service/ExceptionRequest';

const homeIcon = 'alert_icon_add';
const exceptionOff = 'exception_off';
const exceptionOn = 'exception_on';
const attendanceOff = 'attendance_off';
const attendanceOn = 'attendance_on';
const punchCardOff = 'punch_card_off';
const punchCardOn = 'punch_card_on';
const nodata = 'empty';

export default class Tab extends React.Component {
  constructor(props) {
    super(props);
    // 是否为迭代环境
    this.isIterated = true;
    this.tabBarHeight = 49;

    this.showException = false;
    this.showAttendance = false;
    this.showPunchCard = false;

    if (global.companyResponseData && global.companyResponseData.checkInSummary) {
      const configData = global.companyResponseData.checkInSummary;
      
      if (configData.length <= 1) {
        this.tabBarHeight = 0;
      }

      for (let item of configData) {
        if (item === 'C010010') {
          this.showException = true;
        }

        if (item === 'C010020') {
          this.showAttendance = true;
        }

        if (item === 'C010030') {
          this.showPunchCard = true;
        }
      }
    }

    let selectedTab = 'Exception';

    if (!this.showException && this.showAttendance) {
      selectedTab = 'Attendance';
    } else if (!this.showException && !this.showAttendance && this.showPunchCard) {
      selectedTab = 'PunchCard';
    }

    this.state = {
      selectedTab,
      pickerData: [],
      selectedValue: '',
    };
  }

  /** Life cycle */

  componentWillMount() {
    if (global.loginResponseData.BackGroundVersion === 'N1') {
      this.isIterated = false;
      this.tabBarHeight = 0;
    }
  }

  componentDidMount() {
    this.pickerListener = DeviceEventEmitter.addListener('SHOW_PICKER', (data) => {
      this.showOptionPicker(data);
    });
  }

  componentWillUnmount() {
    this.pickerListener.remove();
    abort();
  }

  /** Callback */

  showOptionPicker(data) {
    if (!data && !data.pickerValue) return;

    this.pickerType = data.type;
    this.setState({
      pickerData: data.pickerData,
      selectedValue: data.pickerValue,
    });
    this.optionPicker.toggle();
  }

  onPickerDone(selectedValue) {
    switch (this.pickerType) {
      case EXCEPTION:
        this.exceptionView.onPickerDone(selectedValue);
        break;
      case ATTENDANCE:
        this.attendanceView.onPickerDone(selectedValue);
        break;
      case PUNCH_CARD:
        this.punchCardView.onPickerDone(selectedValue);
        break;
    
      default:
        break;
    }
  }

  /** Render methods */

  render() {
    const { pickerData, selectedValue } = this.state;
    const { navigator } = this.props;

    if (!this.showException && !this.showAttendance && !this.showPunchCard) {
      return (
        <View style={{ flex: 1 }}>
          <NavBar
            title={I18n.t('mobile.module.exception.navigationbartitle')}
            onPressLeftButton={() => navigator.pop()}
          />
          <View style={{ flex: 1 }}>
            <EmptyView
              style={{ backgroundColor: 'white' }}
              emptyimg={nodata}
              emptyTitle="暂无考勤统计信息"
              emptyContent="这里将会展示您的所有考勤统计信息"
            />
          </View>
        </View>
      );
    }

    return (
        <View style={{ flex: 1 }}>
          <TabNavigator
            tabBarStyle={[styles.tabBar, { height: this.tabBarHeight, overflow: 'hidden' }]}
            sceneStyle={{ paddingBottom: this.tabBarHeight }}
          >
            {this.renderExceptionItem()}
            {this.renderAttendanceItem()}
            {this.renderPunchCardItem()}
          </TabNavigator>

          <Picker
            ref={picker => this.optionPicker = picker}
            pickerTitle={I18n.t('mobile.module.exception.choosepayperiod')}
            pickerData={pickerData}
            selectedValue={[selectedValue]}
            onPickerDone={(data) => this.onPickerDone(data)}
            cancelButtonTitle="取消"
            doneButtonTitle="确认"
          />
        </View>
    );
  }

  // 渲染异常统计
  renderExceptionItem() {
    const { navigator } = this.props;
    const { selectedTab } = this.state;

    if (!this.showException) return null;

    return (
      <TabNavigator.Item
        selected={selectedTab === 'Exception'}
        title="异常统计"
        renderIcon={() => <Image style={styles.icon} source={{uri: exceptionOff}}/>}
        renderSelectedIcon={() => <Image style={styles.icon} source={{uri: exceptionOn}}/>}
        onPress={() => this.setState({ selectedTab: 'Exception' })}
        selectedTitleStyle={{ color: '#14BE4B', fontSize: 11 }}
        titleStyle={{ color: '#999', fontSize: 11 }}
      >
        <Exception
          ref={exception => this.exceptionView = exception}
          navigator={navigator}
          picker={this.optionPicker}
        />
      </TabNavigator.Item>
    );
  }

  renderAttendanceItem() {
    const { navigator } = this.props;
    const { selectedTab } = this.state;

    if (!this.isIterated) return null;

    if (!this.showAttendance) return null;

    return (
      <TabNavigator.Item
        selected={selectedTab === 'Attendance'}
        title="出勤统计"
        renderIcon={() => <Image style={styles.icon} source={{uri: attendanceOff}}/>}
        renderSelectedIcon={() => <Image style={styles.icon} source={{uri: attendanceOn}}/>}
        onPress={() => this.setState({ selectedTab: 'Attendance' })}
        selectedTitleStyle={{ color: '#14BE4B', fontSize: 11 }}
        titleStyle={{ color: '#999', fontSize: 11 }}
      >
        <Attendance
          ref={attendance => this.attendanceView = attendance}
          navigator={navigator}
          picker={this.optionPicker}
        />
      </TabNavigator.Item>
    );
  }

  renderPunchCardItem() {
    const { navigator } = this.props;
    const { selectedTab } = this.state;

    if (!this.isIterated) return null;

    if (!this.showPunchCard) return null;

    return (
      <TabNavigator.Item
        selected={selectedTab === 'PunchCard'}
        title="打卡统计"
        renderIcon={() => <Image style={styles.icon} source={{uri: punchCardOff}}/>}
        renderSelectedIcon={() => <Image style={styles.icon} source={{uri: punchCardOn}}/>}
        onPress={() => this.setState({ selectedTab: 'PunchCard' })}
        selectedTitleStyle={{ color: '#14BE4B', fontSize: 11 }}
        titleStyle={{ color: '#999', fontSize: 11 }}
      >
        <PunchCard
          ref={punchCard => this.punchCardView = punchCard}
          navigator={navigator}
          picker={this.optionPicker}
        />
      </TabNavigator.Item>
    );
  }
}

const styles = EStyleSheet.create({
  icon: {
    width: 25,
    height: 25,
  },
  tabBar: {
    height: 49,
    overflow: 'hidden',
    backgroundColor: 'white',
    borderTopColor: '$color.line',
    borderTopWidth: device.hairlineWidth,
  },
});