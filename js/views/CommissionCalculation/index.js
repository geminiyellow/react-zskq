/**
 * 佣金计算界面
 */

import { DeviceEventEmitter, KeyboardAvoidingView, Keyboard, View } from 'react-native';
import React, { PureComponent } from 'react';
import I18n from 'react-native-i18n';
import { device, event } from '@/common/Util';
import { initFilterTitle, initSelectData } from './constants';
import { messageType, appVersion } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import QuotaItem from './components/QuotaItem';
import NavBar from '@/common/components/NavBar';
import Text from '@/common/components/TextField';
import CalcuModal from './components/CalcuModal';
import EmptyView from '@/common/components/EmptyView';
import Filter from '@/common/components/Filter/Filter';
import ScrollView from '@/common/components/ScrollView';
import EStyleSheet from 'react-native-extended-stylesheet';
import SubmitButton from '@/common/components/SubmitButton';
import UmengAnalysis from '@/common/components/UmengAnalysis';
import FilterModal from '@/common/components/Filter/FilterModal';
import { toThousands } from '@/common/Functions';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
import CommissionHelper from '@/views/CommissionCalculation/constants/CommissionHelper';
import { getMonthInfo, getOrganizationInfo, getCommission, abort, commissionTrial } from './service';

const KeyboardAvoiding = device.isIos ? View : KeyboardAvoidingView;
const commissionHelper = new CommissionHelper();
const customizedCompanyHelper = new CustomizedCompanyHelper();

const nodata = 'empty';

export default class CommissionCalculation extends PureComponent {

  constructor(...props) {
    super(...props);
    this.state = {
      behavior: null,
      marginBottom: 0,
      commissionList: [],
      isFinish: false,
      loadData: true,
    };
    // 点击按钮事件
    this.submitAction = 0;
    // 设置选中的index
    this.selectOIndex = 0;
    this.selectTIndex = 0;
    // 记住选中的时间
    this.selectTimeLabel = '';
    this.selectTimeValue = '';
    this.timeData = [];
    // 记住选中的组织
    this.selectOriginLabel = '';
    this.selectOriginValue = '';
    this.originData = [];
    this.getInitData(0, commissionHelper.getSelectData(), 0);
  }

  componentWillMount() {
    UmengAnalysis.onPageBegin('CommissionCalculation');
  }

  // 组件渲染完成
  componentDidMount() {
    if (this.timeData.length == 0) {
      this.selectDataListener = DeviceEventEmitter.addListener(event.GET_COMISSION_DATA, (responseData) => {
        this.timeData = [];
        this.getInitData(0, responseData, 1);
      });
    }
    if (!device.isIos) {
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.setState({ behavior: 'height', marginBottom: 20 }));
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this.setState({ behavior: null, marginBottom: 0 }));
    }
  }

  componentWillUnmount() {
    abort();
    UmengAnalysis.onPageEnd('CommissionCalculation');
    if (this.timeData.length == 0) {
      this.selectDataListener.remove();
    }
    if (!device.isIos) {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }
  }

  /**
   * 初始化数据
   */
  getInitData(type, data, status) {
    // 获取时间的数据
    this.timeData = data;
    if (this.timeData.length == 0) {
      if (status == 0) {
        commissionHelper.initData();
        return;
      }
      this.setState({ loadData: false });
      return;
    }
    if (this.timeData.length != 0) {
      this.selectTimeLabel = this.timeData[type].label;
      this.selectTimeValue = this.timeData[type].value;
    }
    // 获取组织的数据
    if (this.timeData[0].organizationList.length == 0) return;
    this.originData = this.timeData[type].organizationList;
    if (this.originData.length != 0) {
      this.selectOriginLabel = this.originData[0].label;
      this.selectOriginValue = this.originData[0].value;
    }
    // 获取佣金的数据信息
    getCommission(this.selectTimeValue, this.selectOriginValue).then(
      responseData => {
        this.setState({
          commissionList: responseData.options,
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
    this.selectOriginLabel = this.originData[type].label;
    this.selectOriginValue = this.originData[type].value;
    // 获取佣金的数据信息
    getCommission(this.selectTimeValue, this.selectOriginValue).then(
      responseData => {
        this.setState({
          commissionList: responseData.options,
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
   * 显示modal
   */
  onSelect = (index, isSelected) => {
    // 设置弹出的数据源 1: 表示组织， 0： 表示考核期
    if (index == 1) {
      this.filterModal.onUpdateDataSource(initSelectData(this.originData, index, this.selectOIndex));
    } else {
      this.filterModal.onUpdateDataSource(initSelectData(this.timeData, index, this.selectTIndex));
    }
    Keyboard.dismiss();
    this.filterModal.open();
  }

  /**
   * 显示item的个数
   */
  onShowQuotaItem() {
    const { commissionList } = this.state;
    if (commissionList.length == 0) {
      // 显示空界面
      return null;
    }
    const commissionItem = [];
    for (let i = 0; i < commissionList.length; i++) {
      commissionItem.push(
        <QuotaItem
          ref={`quotaItem${i}`} key={`${i}`} commissionItem={commissionList[i]}
          />);
    }
    return [...commissionItem];
  }

  /**
   * 计算佣金
   */
  onSubmit() {
    if (this.submitAction > 0) {
      return;
    }
    this.submitAction++;
    const { commissionList } = this.state;
    const params = {};
    params.sessionId = global.loginResponseData.SessionId;
    params.companyCode = customizedCompanyHelper.getCompanyCode();
    params.appVersion = appVersion;
    params.period = this.selectTimeValue;
    params.organizationId = this.selectOriginValue;
    const list = [];
    for (let i = 0; i < commissionList.length; i++) {
      if (!this.refs[`quotaItem${i}`].onGetInputData()) {
        this.submitAction = 0;
        showMessage(messageType.error, I18n.t('mobile.module.commission.quota.simulatenumber.right'));
        return;
      }
      list.push(this.refs[`quotaItem${i}`].onGetInputData());
    }
    commissionTrial(params, list).then(
      responseData => {
        this.submitAction = 0;
        this.modal.openModal(toThousands(responseData.commision));
      },
      errorMessage => {
        this.submitAction = 0;
        showMessage(messageType.error, errorMessage);
      }
    );
  }

  render() {
    const { marginBottom, behavior, commissionList, isFinish, loadData  } = this.state;

    // 渲染空界面
    if (!this.selectTimeValue && this.timeData.length == 0) {
      return (
        <View style={styles.container}>
          <NavBar title={I18n.t('mobile.module.commission.navbar.title')} onPressLeftButton={() => { Keyboard.dismiss(); this.props.navigator.pop(); } } />
          {
            loadData ? null :
              <EmptyView
                style={{ backgroundColor: 'white' }}
                emptyimg={nodata} refreshEnabled={false}
                emptyTitle={I18n.t('mobile.module.achievements.null')}
                emptyContent={I18n.t('mobile.module.commission.nodata')}
                />
          }
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <NavBar title={I18n.t('mobile.module.commission.navbar.title')} onPressLeftButton={() => { Keyboard.dismiss(); this.props.navigator.pop(); } } />
        <Filter
          ref={item => this.filter = item}
          dataSources={initFilterTitle(this.selectOriginLabel, this.selectTimeLabel)}
          onSelect={this.onSelect} />
        {
          (commissionList.length == 0 && isFinish) || !this.selectOriginValue ?
            <EmptyView
              style={{ backgroundColor: 'white' }}
              emptyimg={nodata} refreshEnabled={false}
              emptyTitle={I18n.t('mobile.module.achievements.null')}
              emptyContent={I18n.t('mobile.module.commission.nodata')}
              /> :
            <KeyboardAvoiding behavior={behavior} style={{ flex: 1 }}>
              <ScrollView style={{ flex: 1, marginTop: 10, marginBottom: marginBottom }} behavior={behavior}>
                {this.onShowQuotaItem()}
              </ScrollView>
            </KeyboardAvoiding>
        }
        {
          (commissionList.length == 0 && isFinish) || !isFinish || !this.selectOriginValue ? null :
            <SubmitButton title={I18n.t('mobile.module.commission.quota.button')} onPressBtn={() => this.onSubmit()} />
        }
        <CalcuModal ref={ref => { this.modal = ref; } } />
        <FilterModal
          ref={modal => this.filterModal = modal}
          dataSources={[]}
          selectMenu={(item) => {
            // 1: 表示组织， 0： 表示考核期
            if (item.Type == 0) {
              this.getInitData(item.Index, commissionHelper.getSelectData(), 1);
              this.selectTIndex = item.Index;
              this.selectOIndex = 0;
            } else {
              this.getSelectData(item.Index);
              this.selectOIndex = item.Index;
            }
            // 刷新数据信息
            this.filter.onUpdateDataSource(initFilterTitle(this.selectOriginLabel, this.selectTimeLabel));
            this.filterModal.close();
          } } />

      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
    flexDirection: 'column',
  },
});