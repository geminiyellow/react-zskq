//指标完成
import React, { PureComponent } from 'react';
import {
  Text,
  View,
  DeviceEventEmitter,
} from 'react-native';

import SegmentedControlTab from 'react-native-segmented-control-tab';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import _ from 'lodash';
import { messageType } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import NavBar from '@/common/components/NavBar';
import { device, event } from '@/common/Util';
import Line from '@/common/components/Line';
import EmptyView from '@/common/components/EmptyView';
import ScrollView from '@/common/components/ScrollView';
import Image from '@/common/components/CustomImage';
import TouchableHightlight from '@/common/components/CustomTouchableHighlight';
import Filter from '@/common/components/Filter/Filter';
import FilterModal from '@/common/components/Filter/FilterModal';
import { initFilterArr, initSelectData } from './DataSources';
import Circular from './Circular';
import SelfIndex from './SelfIndex';
import UmengAnalysis from '@/common/components/UmengAnalysis';
import { getMonthInfo, getOrganizationInfo, getCommission, abort } from '@/views/CommissionCalculation/service';
import CommissionHelper from '@/views/CommissionCalculation/constants/CommissionHelper';
import { toThousands, thousandBitSeparator } from '@/common/Functions';

const commissionHelper = new CommissionHelper();
const nodata = 'empty';

export default class SelfCircular extends PureComponent {

  constructor(...props) {
    super(...props);
    this.state = {
      commissionList: [],
      commission: '',
      ruleDesc: '',
      //是否加载完
      isFinish: false,
      // 判断筛选框数据是否存在
      loadData: true,
    };
    // 设置选中的index
    this.selectOIndex = 0;
    this.selectTIndex = 0;
    // 记住选中的时间
    this.selectTime = '';
    this.selectTimeValue = '';
    this.timeData = [];
    // 记住选中的组织
    this.selectOriginId = '';
    this.selectOriginIdValue = '';
    this.originData = [];
    this.getInitData(0, commissionHelper.getSelectData(), 0)
  }

  componentWillMount() {
    UmengAnalysis.onPageBegin('SelfCircular');
  }

  // 组件渲染完成
  componentDidMount() {
    if (this.timeData.length == 0) {
      this.selectDataListener = DeviceEventEmitter.addListener(event.GET_COMISSION_DATA, (responseData) => {
        this.timeData = [];
        this.getInitData(0, responseData, 1);
      });
    }
  }

  componentWillUnmount() {
    abort();
    UmengAnalysis.onPageEnd('SelfCircular');
    if (this.timeData.length == 0) {
      this.selectDataListener.remove();
    }
  }

  getInitData(type, data, status) {
    // 获取时间的数据
    this.timeData = data;
    if (this.timeData.length == 0) {
      // 判断考核期是否存在，不存在重新请求接口
      if (status == 0) {
        commissionHelper.initData();
        return;
      }
      this.setState({
        loadData: false
      });
      return
    }
    if (this.timeData.length != 0) {
      this.selectTime = this.timeData[type].label;
      this.selectTimeValue = this.timeData[type].value;
    }
    // 获取组织的数据
    if (this.timeData[0].organizationList.length == 0) return;
    this.originData = this.timeData[type].organizationList;
    if (this.originData.length != 0) {
      this.selectOriginId = this.originData[0].label;
      this.selectOriginIdValue = this.originData[0].value;
    }
    // 获取佣金的数据信息
    getCommission(this.selectTimeValue, this.selectOriginIdValue).then(
      responseData => {
        this.setState({
          commissionList: responseData.options,
          commission: responseData.Commission,
          ruleDesc: responseData.RuleDesc,
          isFinish: true,
        });
      },
      errorMessage => {
        this.setState({
          isFinish: true,
        });
        showMessage(messageType.error, errorMessage);
      }
    );
  }

  /**
 * 获取选中的数据
 */
  getSelectData(type) {
    this.selectOriginId = this.originData[type].label;
    this.selectOriginIdValue = this.originData[type].value;
    // 获取佣金的数据信息
    getCommission(this.selectTimeValue, this.selectOriginIdValue).then(
      responseData => {
        this.setState({
          commissionList: responseData.options,
          commission: responseData.Commission,
          ruleDesc: responseData.RuleDesc,
          isFinish: true,
        });
      },
      errorMessage => {
        this.setState({
          isFinish: true,
        });
        showMessage(messageType.error, errorMessage);
      }
    );
  }


  /**
   * 显示item的个数
   */
  onShowSelfIndex() {
    const { commissionList } = this.state;
    if (commissionList.length == 0) {
      // 显示空界面
      return null;
    } else {
      const commissionItem = [];
      for (let i = 0; i < commissionList.length; i++) {
        const { IndicatorName, Target, CompleteValue, } = commissionList[i];
        commissionItem.push(
          <SelfIndex
            ref={`selfindex${i}`} key={`${i}`}
            indicatorName={IndicatorName} targetValue={Target} completeValue={CompleteValue}
            commissionItem={commissionList[i]}
          />
        );
      }
      return [...commissionItem];
    }
  }

  onSelect = (index, isSelected) => {
    if (index == 1) {
      this.filterModal.onUpdateDataSource(initSelectData(this.originData, index, this.selectOIndex));
    } else {
      this.filterModal.onUpdateDataSource(initSelectData(this.timeData, index, this.selectTIndex));
    }
    this.filterModal.open();
  }

  onShow() {
    const { commissionList, commission, isFinish, ruleDesc } = this.state;
    //未加载完不显示
    if (!isFinish) {
      return null;
    }
    return (
      < View >
        <View style={styles.view}>
          <Text style={styles.text1}>{thousandBitSeparator(String(commission))}</Text>
          <Text style={styles.text3}>{String(ruleDesc)}</Text>
        </View>
      </View >
    );
  }

  render() {
    const { commissionList, commission, isFinish, ruleDesc, loadData } = this.state;
    // 渲染空界面
    if (this.timeData.length == 0 && !this.selectTimeValue) {
      return (
        <View style={styles.container}>
          {
            loadData ? null :
              < EmptyView
                style={{ backgroundColor: 'white' }}
                emptyimg={nodata}
                refreshEnabled={false}
                emptyTitle={I18n.t('mobile.module.achievements.null')}
                emptyContent={I18n.t('mobile.module.selfperformance.target.title')}
                content={''}
              />
          }
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Filter
          ref={item => this.filter = item}
          dataSources={initFilterArr(this.selectTime, this.selectOriginId)}
          onSelect={this.onSelect} />
        {
          (commissionList.length == 0 && isFinish) || !this.selectOriginIdValue ?
            <EmptyView
              style={{ backgroundColor: 'white' }}
              emptyimg={nodata}
              refreshEnabled={false}
              emptyTitle={I18n.t('mobile.module.achievements.null')}
              emptyContent={I18n.t('mobile.module.selfperformance.target.title')}
              content={''}
            /> :
            <View style={styles.container}>
              {this.onShow()}
              <ScrollView >
                {this.onShowSelfIndex()}
              </ScrollView>
            </View>
        }
        <FilterModal
          ref={modal => this.filterModal = modal}
          topParams={45}
          dataSources={[]}
          selectMenu={(item) => {
            // 0: 表示考核期， 1： 表示组织
            if (item.Type == 0) {
              this.getInitData(item.Index, commissionHelper.getSelectData(), 1);
              this.selectTIndex = item.Index;
              this.selectOIndex = 0;
            } else {
              this.getSelectData(item.Index);
              this.selectOIndex = item.Index;
            }
            // 刷新数据信息
            this.filter.onUpdateDataSource(initFilterArr(this.selectTime, this.selectOriginId));
            this.filterModal.close();
          }} />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  view: {
    marginTop: 0.3,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection: 'column'
  },
  text1: {
    marginTop: device.height * 0.023,
    color: '#111111',
    fontSize: 36,
  },
  text3: {
    color: '#737373',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 8,
    width: device.width * 0.78,
    marginBottom: 20,
  },
});
