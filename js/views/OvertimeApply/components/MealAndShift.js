/**
 * 加班申请表单餐别、用餐时数和转调休界面
 */

import { View } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import I18n from 'react-native-i18n';
import Line from '@/common/components/Line';
import SwitchCard from '@/common/components/SwitchCard';
import Constance from '../constants';
import FormItem from './FormItem';
import styles from '../styles';
// 导入表单类型和餐别样式刷新的方式
const {
  formTypeWordAndInput,
  formTypeWordAndImage,
  mealTypeRefreshIndex,
  mealTypeRefreshSub,
  mealTypeLoadIndex,
  mealTypeLoadSub,
} = Constance;
// 导入图片信息
const { checkBoxUnselected, checkBoxSelected } = Constance;

export default class MealAndShift extends PureComponent {
  constructor(...props) {
    super(...props);
    // 获取传过来的数据
    const { getEmployeeOverTimeRule, getEmployeeActualOTHours } = this.props;
    this.state = {
      getEmployeeOverTimeRuleS: getEmployeeOverTimeRule,
      getEmployeeActualOTHoursS: getEmployeeActualOTHours,
      isShowConfiguration: false,
      isSelectFixed: false,
    };
    // 设置餐别是否选中
    this.isMealClick = [];
    // 餐别的数据
    this.mealData = [];
    // 获取加班时数
    this.totleHours = '';
  }

  // 设置显示的餐别样式
  onSetShowConfiguration(type) {
    const { isShowConfiguration } = this.state;
    switch (type) {
      case mealTypeRefreshIndex:
        if (isShowConfiguration) {
          this.setState({ isShowConfiguration: false });
        }
        break;
      case mealTypeRefreshSub:
        if (!isShowConfiguration) {
          this.setState({ isShowConfiguration: true });
        }
        break;
      default:
        break;
    }
  }

  // 第一次刷新数据----加载加班规则
  onSetFirstRefreshData(getEmployeeOverTimeRuleTemp) {
    // 获取加班的规则
    const {
      MealTypeList,
      IsSelectedAllMeal,
      ManualMealModeVisable,
      MealTypeVisible,
      IsExistsMealType,
    } = getEmployeeOverTimeRuleTemp;
    // 判断是选择餐别还是输入餐别时间
    this.mealType = mealTypeLoadIndex;
    // 设置餐别是否选中
    this.isMealClick = [];
    // 餐别的数据
    this.mealData = [];
    if (!_.isEmpty(MealTypeList)) {
      for (let i = 0; i < MealTypeList.length; i += 1) {
        if (IsSelectedAllMeal) {
          this.mealType = 2;
          this.isMealClick.push(checkBoxSelected);
          // 获取全选餐别的信息
          this.mealData.push(MealTypeList[i].Id);
        } else {
          this.isMealClick.push(checkBoxUnselected);
        }
      }
    }
    // 是否显示餐别的样式
    if (
      !_.isEmpty(getEmployeeOverTimeRuleTemp) &&
      (ManualMealModeVisable || MealTypeVisible || IsExistsMealType)
    ) {
      // 判断是否加载样式信息
      this.onSetShowConfiguration(mealTypeRefreshSub);
    }
    // 设置第一次显示的信息---输入餐别时数或者是选中餐别的信息
    this.setState({
      getEmployeeOverTimeRuleS: getEmployeeOverTimeRuleTemp,
    });
  }

  // 第二次刷新数据----加载加班时数
  onSetSecondRefreshData(getEmployeeActualOTHoursTemp) {
    // 获取加载的state
    const { getEmployeeOverTimeRuleS } = this.state;
    // 获取加班时数
    const {
      CompTimeVisible,
      TotalHours,
      IsCompTime,
    } = getEmployeeActualOTHoursTemp;
    // 是否显示餐别的样式
    if (!_.isEmpty(getEmployeeActualOTHoursTemp) && CompTimeVisible) {
      // 判断是否加载样式信息
      this.onSetShowConfiguration(mealTypeRefreshSub);
    }
    // 显示时长
    if (!_.isEmpty(getEmployeeActualOTHoursTemp)) {
      this.totleHours = TotalHours;
      const { textHoursRefresh } = this.props;
      textHoursRefresh(`${this.totleHours}`);
    }
    // 显示餐别界面信息
    if (
      getEmployeeOverTimeRuleS.MealTypeVisible ||
      getEmployeeOverTimeRuleS.IsExistsMealType
    ) {
      this.textMealType.onSetRefreshInfo(
        this.mealData.length === 0
          ? I18n.t('mobile.module.overtime.overtimeapplymealtype')
          : I18n.t('mobile.module.overtime.overtimeapplymealtypes') +
              this.mealData.length,
      );
    }
    // 显示加班的时数
    this.setState({
      getEmployeeActualOTHoursS: getEmployeeActualOTHoursTemp,
    });
    // 显示转调休
    if (CompTimeVisible) {
      if (IsCompTime === '0') {
        this.setState({ isSelectFixed: false });
      } else {
        this.setState({ isSelectFixed: true });
      }
    }
  }

  // 获取加班餐别类型信息
  onGetMealType() {
    return this.mealType;
  }

  // 设置加班餐别的数据
  onSetRefreshData(isMealClickTemp, mealDataTemp) {
    this.isMealClick = isMealClickTemp;
    this.mealData = mealDataTemp;
  }

  // 获取加班餐别的数据
  onGetRefreshData() {
    const params = {};
    const { getEmployeeOverTimeRuleS, getEmployeeActualOTHoursS } = this.state;
    params.isMealClick = this.isMealClick;
    params.mealData = this.mealData;
    params.totleHours = this.totleHours;
    params.mealHours = !_.isEmpty(getEmployeeOverTimeRuleS) &&
      getEmployeeOverTimeRuleS.ManualMealModeVisable
      ? this.mealHours.onGetInputInfo()
      : '';
    params.isCompTime = !_.isEmpty(getEmployeeActualOTHoursS) &&
      getEmployeeActualOTHoursS.CompTimeVisible
      ? this.state.isSelectFixed
      : false;
    return params;
  }

  // 设置转调休
  onSelectedTurnOff() {
    this.setState({
      isSelectFixed: !this.state.isSelectFixed,
    });
  }

  // 显示餐别弹出框
  onShowModal() {
    const { showModal } = this.props;
    showModal();
  }

  render() {
    const {
      isShowConfiguration,
      getEmployeeOverTimeRuleS,
      getEmployeeActualOTHoursS,
      isSelectFixed,
    } = this.state;
    return (
      <View style={isShowConfiguration ? styles.mealModalView : null}>
        {
        !_.isEmpty(getEmployeeOverTimeRuleS) &&
          getEmployeeOverTimeRuleS.ManualMealModeVisable
          ? <View>
            <FormItem
              ref={ref => {
                this.mealHours = ref;
              }}
              bottomLine
              bottomLineStyle={styles.lineView}
              onGetEmployeeActualOTHours={() => {
                const { onGetEmployeeActualOTHours } = this.props;
                onGetEmployeeActualOTHours(mealTypeLoadSub);
              }}
              leftTextView={I18n.t(
                  'mobile.module.overtime.overtimeapplymealhour',
                )}
              rightTextView={I18n.t(
                  'mobile.module.overtime.overtimeapplymealhourinput',
                )}
              typeItem={formTypeWordAndInput}
              />
          </View>
          : null}
        {
        !_.isEmpty(getEmployeeOverTimeRuleS) &&
          (getEmployeeOverTimeRuleS.MealTypeVisible ||
            getEmployeeOverTimeRuleS.IsExistsMealType)
          ? <View>
            <FormItem
              ref={ref => {
                this.textMealType = ref;
              }}
              bottomLine
              bottomLineStyle={styles.lineView}
              leftTextView={I18n.t(
                  'mobile.module.overtime.overtimeapplymealtype',
                )}
              typeItem={formTypeWordAndImage}
              onPress={() => this.onShowModal()}
              />
          </View>
          : null}
        {
        !_.isEmpty(getEmployeeActualOTHoursS) &&
          getEmployeeActualOTHoursS.CompTimeVisible
          ? <View>
            {!_.isEmpty(getEmployeeOverTimeRuleS) &&
                (getEmployeeOverTimeRuleS.ManualMealModeVisable ||
                  (getEmployeeOverTimeRuleS.MealTypeVisible ||
                    getEmployeeOverTimeRuleS.IsExistsMealType))
                ? null
                : <Line />}
            <SwitchCard
              title={I18n.t('mobile.module.overtime.overtimeapplyturnoff')}
              topLine={false}
              bottomLine
              switchState={isSelectFixed}
              onPress={() => this.onSelectedTurnOff()}
              />
          </View>
          : null}
      </View>
    );
  }
}
