// 组织指标
import React from 'react';
import { DeviceEventEmitter, NativeModules, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Filter from '@/common/components/Filter/Filter';
import { ABORT } from '@/common/Request';
import LockedTableView from '@/common/components/LockedTableView';
import { device } from '@/common/Util';
import DataSources from './DataSources';
import _ from 'lodash';
import OrganizationGoalHelper from './Helpers/OrganizationGoalHelper';
import EmptyView from '@/common/components/EmptyView';
const nodata = 'empty';

import httpHelper from './HttpHelpers';

export default class OrganizationGoal extends React.Component {
  constructor(props) {
    super(props);
    httpHelper.onGetOrganizationListInfo();
    this.state = {
      isEmptyViewShow: false,
      isFilterShow: false,
      isShowTable: false,
      tableData: '',
      origanizationListData: '',
      periodListData: '',
      tableHeadData: '',
      tableData: '',
    };
    this.orid = 0;
    this.perid = 0;
  }

  componentDidMount() {
    this.listeners = [
      DeviceEventEmitter.addListener('FRESH_ORGANIZATION_LIST_MODAL_DATA', (eventBody) => {
        if (!_.isEmpty(eventBody)) {
          this.setState({
            origanizationListData: OrganizationGoalHelper.onGetOrganizationListInfo(eventBody),
          });
          httpHelper.getAssessmentPeriodListInfo();
        } else {
          this.setState({
            isFilterShow: false,
            isEmptyViewShow: true,
          });
        }
      }),
      DeviceEventEmitter.addListener('FRESH_PERIOD_LIST_MODAL_DATA', (eventBody) => {
        if (!_.isEmpty(eventBody.options)) {
          this.setState({
            isFilterShow: true,
            periodListData: OrganizationGoalHelper.onGetPeriodListInfo(eventBody),
          });
          // 刷新Filter显示
          this.filterView.onUpdateFilterValueById(0, this.state.origanizationListData[0].Description);
          this.filterView.onUpdateFilterValueById(1, this.state.periodListData[0].Description);
          this.orid = this.state.origanizationListData[0].value;
          this.perid = this.state.periodListData[0].Description;
          httpHelper.getOrganizationTableHeaderInfo();
        } else {
          this.setState({
            isFilterShow: false,
            isEmptyViewShow: true,
          });
        }
      }),
      DeviceEventEmitter.addListener('FRESH_TABLE_HEAD_DATA', (eventBody) => {
        if (!_.isEmpty(eventBody)) {
          this.setState({
            tableHeadData: eventBody,
          });
          httpHelper.getOrganizationTableData(this.orid, this.perid);
        } else {
          this.setState({
            isShowTable: false,
          });
        }
      }),
      DeviceEventEmitter.addListener('FRESH_TABLE_DATA', (eventBody) => {
        if (_.isEmpty(eventBody)) {
          this.setState({
            isShowTable: false,
          });
        } else {
          this.setState({
            tableData: eventBody,
            isShowTable: true,
          });
        }

      }),
    ];
  }

  componentWillUnmount() {
    ABORT('getOrganizationListInfo');
    ABORT('getAssessmentPeriodListInfo');
    ABORT('getOrganizationTableHeaderInfo');
    ABORT('getOrganizationTableData');
    this.listeners && this.listeners.forEach(listener => listener.remove());
  }

  onSelect = (index, isSelected) => {
    if (index === 0) {
      if (_.isEmpty(this.state.origanizationListData) || _.isUndefined(this.state.origanizationListData)) {
        return;
      }
      const { openModal } = this.props;
      openModal(this.state.origanizationListData);
    }
    if (index === 1) {
      if (_.isEmpty(this.state.periodListData) || _.isUndefined(this.state.periodListData)) {
        return;
      }
      const { openModal } = this.props;
      openModal(this.state.periodListData);
    }
  }

  onModalSelected(item) {
    if (item.Type === 0) {
      this.orid = item.value;
    }
    if (item.Type === 1) {
      this.perid = item.Description;
    }
    this.setState({
      isShowTable: false,
    });
    httpHelper.getOrganizationTableData(this.orid, this.perid);
  }

  fetchTableData() {

  }

  onInitTableView() {
    if (this.state.isShowTable) {
      const tableInfo = {};
      tableInfo.tableHeadData = JSON.stringify(this.state.tableHeadData);
      tableInfo.tableData = JSON.stringify(this.state.tableData);
      return (
        <LockedTableView
          style={{
            width: device.width,
            flex: 1,
          }}
          tableHeadData={JSON.stringify(this.state.tableHeadData)}
          tableData={JSON.stringify(this.state.tableData)}
          tableInfo={tableInfo} />
      );
    } else {
      return (
        <EmptyView
          style={{ backgroundColor: 'white' }}
          onRefreshing={() => this.fetchTableData()}
          emptyimg={nodata}
          emptyTitle="暂无数据"
          emptyContent="这里将展示指标详情信息" />
      );
    }
  }

  onTableMarginShow() {
    if (this.state.isShowTable) {
      return (<View style={{ width: device.width, height: 10, backgroundColor: '#EEEEEE' }} />);
    }
  }

  render() {
    if (this.state.isEmptyViewShow) {
      return (
        <EmptyView
          style={{ backgroundColor: 'white' }}
          onRefreshing={() => this.fetchTableData()}
          emptyimg={nodata}
          emptyTitle="暂无数据"
          emptyContent="这里将展示指标详情信息" />
      );
    }
    return (
      <View style={styles.wrapper}>
        {this.renderFilter()}
        {this.onTableMarginShow()}
        {this.onInitTableView()}
      </View>
    );
  }

  // 加载FilterView
  renderFilter() {
    if (this.state.isFilterShow) {
      return (
        <Filter
          ref={view => this.filterView = view}
          dataSources={DataSources.initOrganizationGoalFilterArr()}
          onSelect={this.onSelect} />
      );
    }
  }
}

const styles = EStyleSheet.create({
  wrapper: {
    flex: 1,
  },
});