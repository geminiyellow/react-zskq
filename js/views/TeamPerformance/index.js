// 团队绩效
import React, { PureComponent } from 'react';
import {
  DeviceEventEmitter,
  NativeModules,
  StatusBar,
  Text,
  View,
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import NavBar from '@/common/components/NavBar';
import { device } from '@/common/Util';
import Image from '@/common/components/CustomImage';
import TouchableHightlight from '@/common/components/CustomTouchableHighlight';
import Filter from '@/common/components/Filter/Filter';
import FilterModal from '@/common/components/Filter/FilterModal';
import StaffTarget from '@/views/TeamPerformance/StaffTarget';
import { GET, ABORT, POST } from '@/common/Request';
import { appVersion } from '@/common/Consts';
import Line from '@/common/components/Line';
import OrganizationTarget from './OrganizationTarget';
import OrganizationGoal from './OrganizationGoal';
import { DEVICE_ORIENTATION_CHANDED } from './constant';
const { RNManager } = NativeModules;
const leftBack = 'back';

export default class TeamPerformance extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      landscape: false,
    };
  }

  /** Life cycle */

  componentDidMount() {
    this.deviceOrientationListener = DeviceEventEmitter.addListener(DEVICE_ORIENTATION_CHANDED, (value) => {
      const { landscape } = this.state;
      this.setState({ landscape: value });
    });
  }

  componentWillUnmount() {
    if (device.isIos) {
      RNManager.rotateScreenPortrait();
    }
    RNManager.disableAutorotate();
    this.deviceOrientationListener.remove();
  }

  /** Callback */

  // 返回到首页
  backView() {
    const { navigator } = this.props;
    navigator.pop();
  }

  handleIndexChange = (index) => {
    // 关闭modal
    if (this.organizationTargetModal){
      this.organizationTargetModal.close();
    }
    if (this.staffTargetModal){
      this.staffTargetModal.close();
    }
    if (this.organizationGoalModal){
      this.organizationGoalModal.close();
    }
    this.setState({
      selectedIndex: index,
    });
  }

  // 显示组织指标Modal
  openOrganizationModal(index) {
    switch (`${index}`) {
      case '0':
        this.organizationTargetModal.onUpdateDataSource(this.organizationTargetView.modalTeamTypeData);
        break;
      case '1':
        this.organizationTargetModal.onUpdateDataSource(this.organizationTargetView.modalPointerTypeData);
        break;
      case '2':
        this.organizationTargetModal.onUpdateDataSource(this.organizationTargetView.modalPeriodTypeData);
        break;
      default:
        break;
    }
    this.organizationTargetModal.open();
  }

  // 选择组织指标Modal
  onSelectOrganizationMenu(item) {
    this.organizationTargetView.onSelectModal(item);
  }

  // 更新组织指标Modal数据
  updateOrganizationModalData(data) {
    this.organizationTargetModal.onUpdateDataSource(data);
  }

  // 显示Modal (人员指标)
  openStaffModal() {
    this.staffTargetModal.open();
  }

  // 获取选中的filter (人员指标)
  onSelectItemStaff(item) {
    this.staffTargetView.updateBarChartRequest(item);
  }

  // 更新Modal 数据 (人员指标)
  updateStaffModal(data) {
    this.staffTargetModal.onUpdateDataSource(data);
  }
  /** Private methods */

  // 从server获取团队类型和指标类型数据
  fetchFilterData() {
    getTeamAndPointerType()
    GET(
      getTeamAndPointerType(2),
      (responseData) => {
        // console.log('getTeamAndPointerType data --- ', responseData);
        this.updateFilterData(responseData);
      },
      (errorMsg) => {
        console.log('errorMsg --- ', errorMsg);
      }, 'getTeamAndPointerType'
    );
  }

  // 更新组织类型、指标类型数据
  updateFilterData(organizeData) {
    if (!organizeData) return;
    // 组织类型
    this.teamTypeData = organizeData.teamType;
    const teamTypeLabels = getTeamTypeLabels(this.teamTypeData);
    this.modalTeamTypeData = filterModalDataFormat(teamTypeLabels);
    // 指针类型
    this.pointerTypeData = organizeData.pointerType;
    const pointerTypeNames = getPointerTypeNames(this.pointerTypeData);
    this.modalPointerTypeData = filterModalDataFormat(pointerTypeNames);
    // 默认显示第一条筛选条件下图表数据
    if (teamTypeLabels && teamTypeLabels.length > 0) {
      const defaultTeamTypeLabel = teamTypeLabels[0];
      this.organizationTargetView.updateFilterViewData(0, defaultTeamTypeLabel);
    }
    if (pointerTypeNames && pointerTypeNames.length > 0) {
      const defaultPointerTypeName = pointerTypeNames[0];
      this.organizationTargetView.updateFilterViewData(1, defaultPointerTypeName);
    }
    // 默认考核期
    let periodTypeId;
    if (this.periodTypeData.length > 0) {
      const defaultPeriodType = this.periodTypeData[0];
      if (defaultPeriodType) {
        const periodTypeLabel = defaultPeriodType.label;
        periodTypeId = getPeriodTypeId(periodTypeLabel, this.periodTypeData);
      }
    }
    const teamTypeId = 'a3b5600a-b57a-4e88-91df-1d268e46ed27';
    if (teamTypeId && periodTypeId) {
      this.organizationTargetView.fetchChartData(teamTypeId, periodTypeId);
    }
  }

  // 组织指标详情

  // 打开组织列表modal
  openModal(data) {
    // 刷新modal数据源
    this.organizationGoalModal.onUpdateDataSource(data);
    // 打开modal
    this.organizationGoalModal.open();
  }

  // 组织指标详情modal列表选中事件
  onOrganizationGodalModalSelected(item) {
    this.organizationGoalView.onModalSelected(item);
  }

  /** Render mothods */

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" style={styles.statusBar} />
        {this.renderHeader()}
        {this.renderDetailView()}
        <FilterModal
          ref={view => this.organizationTargetModal = view}
          dataSources={[]}
          selectMenu={(item) => this.onSelectOrganizationMenu(item)} />
        <FilterModal
          ref={modal => this.staffTargetModal = modal}
          dataSources={[]}
          selectMenu={(item) => this.onSelectItemStaff(item)} />
        <FilterModal
          ref={modal => this.organizationGoalModal = modal}
          dataSources={[]}
          selectMenu={(item) => this.onOrganizationGodalModalSelected(item)} />
      </View>
    );
  }

  renderDetailView() {
    const { selectedIndex } = this.state;
    const { navigator } = this.props;
    let detailView = null;
    switch (selectedIndex) {
      case 0:
        detailView = (
          <OrganizationTarget
            ref={view => this.organizationTargetView = view}
            openModal={(index) => this.openOrganizationModal(index)}
            updateModalData={(data) => this.updateOrganizationModalData(data)}
            navigator={navigator} />);
        break;
      case 1:
        detailView = (<StaffTarget
          ref={view => this.staffTargetView = view}
          openModal={() => this.openStaffModal()}
          updateModalData={(data) => this.updateStaffModal(data)}
          navigator={navigator} />);
        break;
      case 2:
        detailView = (
          <OrganizationGoal
            ref={view => this.organizationGoalView = view}
            openModal={(data) => this.openModal(data)}
            navigator={navigator} />
        );
        break;
      default:
        break;
    }
    return detailView;
  }

  renderHeader() {
    const { selectedIndex, landscape } = this.state;
    if (landscape) return null;
    return (
      <View>
        <View style={[styles.segmentContent]}>
          <View style={styles.navigatorWrapper}>
            <View style={styles.segmentInnerView}>
              <TouchableHightlight style={{ flex: 1 }} onPress={() => this.backView()}>
                <View>
                  <Image style={styles.imageBack} source={{ uri: leftBack }} />
                </View>
              </TouchableHightlight>
              <SegmentedControlTab
                values={[I18n.t('mobile.module.achievements.organization'),
                I18n.t('mobile.module.achievements.personal'),
                I18n.t('mobile.module.achievements.details')]}
                tabsContainerStyle={styles.segmented}
                selectedIndex={selectedIndex}
                onTabPress={this.handleIndexChange}
                tabTextStyle={styles.tabTextStyle}
                activeTabStyle={styles.activeTabStyle}
                tabStyle={styles.tabStyle}
                borderRadius={1} />
              <View style={{ flex: 1 }} />
            </View>
            <View style={{ flex: 1 }} />
            <Line />
          </View>
        </View>
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
  navigatorWrapper: {
    marginTop: device.isIos ? 20 : 0,
    height: 44,
    width: device.width,
  },

  segmentContent: {
    backgroundColor: '#FFF',
  },
  segmentInnerView: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8,
  },
  imageBack: {
    width: 13,
    height: 22,
    marginLeft: 12,
    marginTop: ((29 / 667) * device.height - 22) / 2,
  },
  segmented: {
    width: (277 / 375) * device.width,
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