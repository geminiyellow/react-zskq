// 组织指标
import React from 'react';
import { DeviceEventEmitter, NativeModules, processColor, ScrollView, Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { getTeamAndPointerType, getOrganizationGoal } from '@/common/api';
import { GET, ABORT, POST } from '@/common/Request';
import Filter from '@/common/components/Filter/Filter';
import PeriodTypeHelper from '@/views/SelfPerformance/PeriodTypeHelper';
import { showMessage } from '@/common/Message';
import { messageType } from '@/common/Consts';
import { LoadingManager } from '@/common/Loading';
import EmptyView from '@/common/components/EmptyView';
import { device } from '@/common/Util';
import DataSources from './DataSources';
import LineChart from './LineChart';
import HighlightedView from './HighlightedView';
import { DEVICE_ORIENTATION_CHANDED } from './constant';
import { getFilterDatasource } from './Helpers/filterDataHelper';
import { getXValues, isEmpty } from './Helpers/lineChartDataHelper';
import { getTeamTypeLabels, getPointerTypeNames, getPeriodTypeLabels, getTeamTypeId, getPeriodTypeId, getPointerTypeId } from './Helpers/targetDataHelper';
import { filterModalDataFormat } from './Helpers/filterModalDataHelper';
const periodTypeHelper = new PeriodTypeHelper();
const nodata = 'empty';
const { RNManager } = NativeModules;

export default class OrganizationTarget extends React.Component {
  constructor(props) {
    super(props);
    // Filter数据
    this.filterData = [
      {
        id: '0',
        title: '',
        selected: false,
      },
      {
        id: '1',
        title: '',
        selected: false,
      },
      {
        id: '2',
        title: '',
        selected: false,
      },
    ];
    // 原始团队类型、指标类型、考核期数据
    this.teamTypeData = [];
    this.pointerTypeData = [];
    this.periodTypeData = [];
    // FilterModal团队类型、指标类型、考核期数据
    this.modalTeamTypeData = [];
    this.modalPointerTypeData = [];
    this.modalPeriodTypeData = [];
    // 当前选中的团队类型、指标类型、考核期数据
    this.selectedTeamType = '';
    this.selectedTeamTypeId = '';
    this.selectedPointerType = '';
    this.selectedPointerTypeId = '';
    this.selectedPeriodType = '';
    this.selectedPeriodTypeId = '';
    // 原始完成值、目标值
    this.completedData = [];
    this.targetData = [];
    // Filter选中Index
    this.selectedIndex = '0';
    this.state = {
      completedValue: '0',
      targetValue: '0',
      xValue: '',
      landscape: false,
      // 折线图完成值、目标值、X轴数据
      chartCompletedData: [],
      chartTargetData: [],
      chartXValues: [],
      // FilterData
      filterData: this.filterData,
      // 组织指标完成值Name
      completedName: '',
      // 组织指标目标值Name
      targetName: '',
      loadFilterData: false,
      isFetchingData: false,
      loadLineChartDataFailed: false,
      periodTypeDataEmpty: false,
      teamTypeDataEmpty: false,
      pointerTypeDataEmpty: false,
    };
  }

  /** Life cycle */

  componentDidMount() {
    RNManager.disableAutorotate();
    const { updateModalData } = this.props;
    this.fetchFilterData();
    this.configPeriodType();
    this.deviceOrientationListener = DeviceEventEmitter.addListener(DEVICE_ORIENTATION_CHANDED, (value) => {
      const { landscape } = this.state;
      this.setState({ landscape: value });
    });
  }
  
  componentWillUnmount() {
    RNManager.disableAutorotate();
    LoadingManager.stop();
    this.deviceOrientationListener.remove();
    ABORT('getOrganizationGoal');
    ABORT('getTeamAndPointerType');
  }

  /** Callback */

  onSelectedValue(completedValue, targetValue, xValue) {
    this.setState({
      completedValue: `${completedValue}`,
      targetValue: `${targetValue}`,
      xValue: xValue,
    });
  }

  onSelect(index, isSelected) {
    const { openModal } = this.props;
    this.selectedIndex = `${index}`;
    if (openModal) {
      openModal(index); 
    }
  }

  onSelectModal(item) {
    switch (`${this.selectedIndex}`) {
      case '0':
        this.selectedTeamType = item.Description;
        this.selectedTeamTypeId = getTeamTypeId(this.selectedTeamType, this.teamTypeData);
        this.fetchChartData()
        break;
      case '1':
        this.selectedPointerType = item.Description;
        this.selectedPointerTypeId = getPointerTypeId(this.selectedPointerType, this.pointerTypeData);
        this.setState({
          completedName: `${this.selectedPointerType}完成值`,
          targetName: `${this.selectedPointerType}目标值`,
        });
        this.fetchChartData();
        break;
      case '2':
        this.selectedPeriodType = item.Description;
        this.selectedPeriodTypeId = getPeriodTypeId(this.selectedPeriodType, this.periodTypeData);
        this.fetchChartData();
        break;
      default:
        break;
    }
  }

  /** Private methods */

  // 配置考核期数据
  configPeriodType() {
    const periodTypeData = periodTypeHelper.getPeriodTypes();
    if (!periodTypeData || (Array.isArray(periodTypeData) && periodTypeData.length < 1)) {
      this.setState({ periodTypeDataEmpty: true });
    }
    if (periodTypeData) {
      this.periodTypeData = periodTypeData;
      const periodTypeLabels = getPeriodTypeLabels(this.periodTypeData);
      this.modalPeriodTypeData = filterModalDataFormat(periodTypeLabels);
      // 更新FilterData
      if (periodTypeLabels && periodTypeLabels.length > 0) {
        const defaultPeriodTypeLabel = periodTypeLabels[0];
        this.updateFilterViewData(2, defaultPeriodTypeLabel);
      }
    }
  }

  // 更新组织类型、指标类型数据
  updateFilterData(organizeData) {
    if (!organizeData) return;
    // 组织类型
    this.teamTypeData = organizeData.teamType;
    if (!this.teamTypeData || (Array.isArray(this.teamTypeData) && this.teamTypeData.length < 1)) {
      this.setState({ teamTypeDataEmpty: true });
      return;
    } else {
      this.setState({ teamTypeDataEmpty: false });
    }
    const teamTypeLabels = getTeamTypeLabels(this.teamTypeData);
    this.modalTeamTypeData = filterModalDataFormat(teamTypeLabels);
    // 指标类型
    this.pointerTypeData = organizeData.pointerType;
    if (!this.pointerTypeData || (Array.isArray(this.pointerTypeData) && this.pointerTypeData.length < 1)) {
      this.setState({ pointerTypeDataEmpty: true });
      return;
    } else {
      this.setState({ pointerTypeDataEmpty: false });
    }
    const pointerTypeNames = getPointerTypeNames(this.pointerTypeData);
    this.modalPointerTypeData = filterModalDataFormat(pointerTypeNames);
    // 默认显示第一条筛选条件下图表数据
    if (teamTypeLabels && teamTypeLabels.length > 0) {
      this.selectedTeamType = teamTypeLabels[0];
      this.selectedTeamTypeId = getTeamTypeId(this.selectedTeamType, this.teamTypeData);
      this.updateFilterViewData(0, this.selectedTeamType);
    }
    // 默认显示第一个指标类型
    if (pointerTypeNames && pointerTypeNames.length > 0) {
      const defaultPointerTypeName = pointerTypeNames[0];
      this.selectedPointerType = defaultPointerTypeName;
      this.selectedPointerTypeId = getPointerTypeId(this.selectedPointerType, this.pointerTypeData);
      this.setState({
        completedName: `${this.selectedPointerType}完成值`,
        targetName: `${this.selectedPointerType}目标值`,
      });
      this.updateFilterViewData(1, defaultPointerTypeName);
    }
    // 默认考核期
    if (this.periodTypeData.length > 0) {
      const defaultPeriodType = this.periodTypeData[0];
      if (defaultPeriodType) {
        const periodTypeLabel = defaultPeriodType.label;
        this.selectedPeriodTypeId = getPeriodTypeId(periodTypeLabel, this.periodTypeData);
      }
    }
    if (this.selectedTeamTypeId && this.selectedPeriodTypeId) {
      this.fetchChartData();
    }
  }

  // 更新组织指标Filter数据
  updateFilterViewData(index, title) {
    const filterData = getFilterDatasource(index, title, this.filterData);
    this.setState({ filterData });
  }

  // 计算折线图数据
  calculateLineChartData() {
    // 折线图数据
    let chartCompletedData = this.completedData;
    let chartTargetData = this.targetData;
    if (isEmpty(chartCompletedData, chartTargetData)) {
      this.setState({ loadLineChartDataFailed: true });
      RNManager.disableAutorotate();
      return;
    }
    let chartXValues = getXValues(this.completedData);
    // 折线图底部默认显示第一条数据
    let firstCompletedData = [];
    let firstTargetData = [];
    if (Array.isArray(chartCompletedData) && chartCompletedData.length > 0) {
      firstCompletedData = chartCompletedData[0];
    }
    if (Array.isArray(chartTargetData) && chartTargetData.length > 0) {
      firstTargetData = chartTargetData[0];
    }
    let firstCompletedValue = '0';
    let firstTargetValue = '0';
    let firstXValue = '';
    if (firstCompletedData) {
      firstCompletedValue = firstCompletedData.y;
    }
    if (firstTargetData) {
      firstTargetValue = firstTargetData.y;
    }
    if (Array.isArray(chartXValues) && chartXValues.length > 0) {
      firstXValue = chartXValues[0];
    }
    this.setState({
      chartCompletedData,
      chartTargetData,
      chartXValues,
      completedValue: firstCompletedValue,
      targetValue: firstTargetValue,
      xValue: firstXValue,
    });
    RNManager.supportAutorotate();
  }

  /** Fetch data */

  // 从server获取团队类型和指标类型数据
  fetchFilterData() {
    LoadingManager.start();
    this.setState({ isFetchingData: true });
    GET(
      getTeamAndPointerType(2),
      (responseData) => {
        LoadingManager.done();
        this.setState({
          isFetchingData: false,
          loadFilterData: true,
        });
        this.updateFilterData(responseData);
      }, (errorMsg) => {
        LoadingManager.done();
        this.setState({
          isFetchingData: false,
          loadFilterData: false,
        });
        showMessage(messageType.error, errorMsg);
      }, 'getTeamAndPointerType'
    );
  }

  // 从server获取图表完成值、目标值数据
  fetchChartData() {
    LoadingManager.start();
    // 获取组织指标信息
    GET(
      getOrganizationGoal(this.selectedTeamTypeId, this.selectedPeriodTypeId, this.selectedPointerTypeId),
      (responseData) => {
        this.setState({ loadLineChartDataFailed: false });
        LoadingManager.done();
        this.completedData = responseData.complete;
        this.targetData = responseData.target;
        this.calculateLineChartData();
      }, (errorMsg) => {
        RNManager.disableAutorotate();
        this.setState({ loadLineChartDataFailed: true });
        LoadingManager.done();
        showMessage(messageType.error, errorMsg);
      }, 'getOrganizationGoal'
    );
  }

  /** Render methods */

  render() {
    const { navigator } = this.props;
    const { loadFilterData, isFetchingData, periodTypeDataEmpty, teamTypeDataEmpty, pointerTypeDataEmpty } = this.state;
    if (teamTypeDataEmpty || pointerTypeDataEmpty || periodTypeDataEmpty || !loadFilterData && !isFetchingData) {
      return (
        <EmptyView
          style={{ backgroundColor: 'white' }}
          onRefreshing={() => this.fetchFilterData()}
          emptyimg={nodata}
          emptyTitle="暂无数据"
          emptyContent="这里将展示组织指标完成信息"/>
      );
    }
    return (
      <View style={styles.wrapper}>
        {this.renderFilter()}
        {this.renderContentView()}
      </View>
    );
  }

  // 加载LineChartView和底部HighlightedView
  renderContentView() {
    const { loadLineChartDataFailed, isFetchingData } = this.state;
    if (loadLineChartDataFailed) {
      return (
        <EmptyView
          style={{ backgroundColor: 'white' }}
          onRefreshing={() => this.fetchChartData()}
          emptyimg={nodata}
          emptyTitle="暂无数据"
          emptyContent="这里将展示组织指标完成信息"/>
      );
    }
    return (
      <ScrollView
        style={styles.container}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        {this.renderLineChart()}
        {this.renderHighlightedView()}
      </ScrollView>
    );
  }

  // 加载折线图
  renderLineChart() {
    const { chartCompletedData, chartTargetData, chartXValues, completedName, targetName } = this.state;
    const { navigator } = this.props;
    if (!completedName || !targetName ) {
      return null;
    }
    return (
      <LineChart
        navigator={navigator}
        chartCompletedData={chartCompletedData}
        chartTargetData={chartTargetData}
        chartXValues={chartXValues}
        completedName={completedName}
        targetName={targetName}
        onSelectedValue={(completedValue, targetValue, value) => this.onSelectedValue(completedValue, targetValue, value)}/>
    );
  }

  // 加载FilterView
  renderFilter() {
    const { landscape, filterData, loadFilterData } = this.state;
    if (landscape) return null;
    if (!loadFilterData) {
      return null;
    }
    return (
      <Filter
        ref={view => this.filterView = view}
        dataSources={filterData}
        onSelect={(index, isSelected) => this.onSelect(index, isSelected)}/>
    );
  }

  // 加载HighlightedView
  renderHighlightedView() {
    const { completedValue, targetValue, xValue, landscape, completedName, targetName  } = this.state;
    if (landscape) return null;
    if (!xValue) {
      return null;
    }
    return (
      <HighlightedView
        completedValue={completedValue}
        targetValue={targetValue}
        completedName={completedName}
        targetName={targetName}
        xValue={xValue}/>
    );
  }

}

const styles = EStyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});