/**
 * 加班申请表单餐别弹出框界面
 */

import { PixelRatio, ScrollView, TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { device } from '@/common/Util';
import Line from '@/common/components/Line';
import I18n from 'react-native-i18n';
import Image from '@/common/components/CustomImage';
import Text from '@/common/components/TextField';
import Modal from 'react-native-modalbox';
import styles from '../styles';
import { getHHmmFormat } from '@/common/Functions';
import { checkBoxUnselected, checkBoxSelected } from '../constants';

export default class MealModal extends PureComponent {
    constructor(...props) {
        super(...props);
        this.state = {
            getEmployeeOverTimeRule: '',
            // 用餐的图片
            selectedImage: [],
            marginBottom: 0,
            height: 234,
        };
        this.closeCount = 1;
        this.isMealClick = [];
        this.isMealClickTemp = [];
        // 餐别的数据初始化
        this.mealData = [];
        this.mealDataTemp = [];
    }

    // 克隆对象赋值
    onClone(obj) {
        const o = obj instanceof Array ? [] : {};
        for (const k in obj) {
            o[k] = typeof obj[k] === 'object' ? this.onClone(obj[k]) : obj[k];
        }
        return o;
    }

    // 设置刷新的数据
    onSetRefreshData(
        getEmployeeOverTimeRuleTemp,
        selectedImageTemp,
        mealDataTemp,
    ) {
        // 记录餐别的初始数据
        this.isMealClickTemp = this.onClone(selectedImageTemp);
        this.mealDataTemp = this.onClone(mealDataTemp);
        // 给餐别信息赋值
        this.mealData = mealDataTemp;
        this.setState({
            getEmployeeOverTimeRule: getEmployeeOverTimeRuleTemp,
            selectedImage: selectedImageTemp,
        });
    }

    // 加载加班餐弹出框
    onInitMealType = () => {
        // 获取加载的state
        const { getEmployeeOverTimeRule } = this.state;
        // 数据为空不显示
        if (_.isEmpty(getEmployeeOverTimeRule)) {
            return null;
        }
        // 将信息加载到View中
        const mealView = [];
        if (!_.isEmpty(getEmployeeOverTimeRule.MealTypeList)) {
            for (let i = 0; i < getEmployeeOverTimeRule.MealTypeList.length; i += 1) {
                mealView.push(
                    <TouchableOpacity
                        key={i}
                        onPress={() =>
                            this.onGetSelectedMeals(
                                getEmployeeOverTimeRule.MealTypeList[i],
                                i,
                            )}
                        >
                        <View style={styles.mealSubItemView}>
                            {this.onIsAllCheckboxIcon(i)}
                            <Text style={styles.mealSubItemFontView}>
                                {getHHmmFormat(getEmployeeOverTimeRule.MealTypeList[i].MealTimeFrom)}
                                {' - '}
                                {getHHmmFormat(getEmployeeOverTimeRule.MealTypeList[i].MealTimeTo)}
                            </Text>
                        </View>
                        <Line />
                    </TouchableOpacity>,
                );
            }
        }
        return [...mealView];
    };

    // 加载加班餐选中的状态
    onIsAllCheckboxIcon = i => {
        // 获取加载的state
        const { selectedImage } = this.state;
        if (selectedImage[i] === checkBoxSelected) {
            this.isMealClick.splice(i, 1, checkBoxSelected);
        } else {
            this.isMealClick.splice(i, 1, checkBoxUnselected);
        }
        return (
            <Image
                style={styles.mealSubItemIcon}
                source={{ uri: selectedImage[i] }}
                />
        );
    };

    // 获取加班餐弹出框选中的餐别
    onGetSelectedMeals = (selectMeals, i) => {
        if (this.isMealClick[i] === checkBoxSelected) {
            this.isMealClick.splice(i, 1, checkBoxUnselected);
        } else {
            this.isMealClick.splice(i, 1, checkBoxSelected);
        }
        // 获取加班的餐别数据
        if (this.mealData.indexOf(selectMeals.Id) > -1) {
            this.mealData.splice(this.mealData.indexOf(selectMeals.Id), 1);
        } else {
            this.mealData.push(selectMeals.Id);
        }
        // 设置新的数据
        this.setState({
            selectedImage: this.isMealClick.concat([]),
        });
    };

    // 获取选中的餐别信息
    onGetSelectedMealType() {
        // 返回获取的数据
        return this.mealData;
    }

    // 获取选中的餐别图片信息
    onGetSelectedMealTypeImage() {
        return this.isMealClick;
    }

    // 打开餐别弹出框
    open = () => {
        if (device.isAndroid) {
            if (this.closeCount > 1) {
                this.setState({
                    marginBottom: 0,
                    height: 234,
                });
            } else if (PixelRatio.get() < 3) {
                this.setState({
                    marginBottom: 24,
                    height: 210,
                });
            } else if (PixelRatio.get() >= 3) {
                this.setState({
                    marginBottom: 18,
                    height: 216,
                });
            }
        }
        this.modalMeals.open();
    };

    // 关闭餐别弹出框
    close = type => {
        this.closeCount += 1;
        if (type === 1) {
            this.isMealClick = this.onClone(this.isMealClickTemp);
            this.mealData = this.onClone(this.mealDataTemp);
            this.setState({
                selectedImage: this.isMealClick,
            });
            this.modalMeals.close();
            return;
        }
        this.isMealClickTemp = this.onClone(this.isMealClick);
        this.mealDataTemp = this.onClone(this.mealData);
        this.modalMeals.close();
        const { onSetRefreshData } = this.props;
        onSetRefreshData(this.isMealClick, this.mealData);
        // 加载加班的时数
        const { onGetEmployeeActualOTHours } = this.props;
        onGetEmployeeActualOTHours(2);
    };

    render() {
        return (
            <Modal
                style={styles.mealModalViewS}
                position={'bottom'}
                ref={ref => {
                    this.modalMeals = ref;
                } }
                swipeToClose={false}
                animationDuration={300}
                backdropOpacity={0.5}
                onClosed={type => this.close(1)}
                >
                <Line />
                <View style={styles.mealModalHeadView}>
                    <TouchableOpacity
                        onPress={type => this.close(1)}
                        style={styles.mealModalTouchableOpacity}
                        >
                        <Text style={styles.mealModalCancelView}>
                            {I18n.t('mobile.module.overtime.pickercancel')}
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.mealModalTitleView} numberOfLines={1}>
                        {I18n.t('mobile.module.overtime.overtimeapplymealtypet')}
                    </Text>
                    <TouchableOpacity
                        onPress={type => this.close(2)}
                        style={styles.mealModalTouchableOpacity}
                        >
                        <Text style={styles.mealModalConfirmView}>
                            {I18n.t('mobile.module.overtime.pickerconfirm')}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Line />
                <View style={styles.mealView}>
                    <ScrollView style={[styles.mealScrollView, { height: this.state.height, marginBottom: this.state.marginBottom }]}>
                        {this.onInitMealType()}
                    </ScrollView>
                </View>
            </Modal>
        );
    }
}
