/**
 * 加班申请额度界面
 */

import React, { PureComponent } from 'react';
import { View } from 'react-native';
import I18n from 'react-native-i18n';
import Line from '@/common/components/Line';
import Text from '@/common/components/TextField';
import ProgressBar from '@/common/components/ProgressBar';
import styles from '../styles';
import { otModeByAttendance, otModeByQuarter, otModeByYear, otModeBySpecified } from '../constants';

export default class Amount extends PureComponent {

  constructor(...props) {
    super(...props);
    this.state = {
      // 显示审核的额度、安全额度、申请额度
      approvedOTHours: 0,
      securityOTHours: 0,
      applyingOTHours: 0,
      // 显示加班的显示title
      amountTitle: I18n.t('mobile.module.overtime.overtimeamountattendance'),
    };
    // 第二层颜色宽度、第三层颜色宽度（第一层为底层，显示灰色）
    this.widthSecond = 0;
    this.widthThird = 0;
  }

  // 重新加载数据信息
  onResetOvertimeAmount(params) {
    // OTModel, OTModelDate, OTLoopMonth
    const { ApplyingOTHours, ApprovedOTHours, SecurityOTHours, OTModel } = params;
    // 显示加班额度的标题
    if (OTModel) {
      switch (OTModel) {
        case otModeByAttendance:
          this.setState({ amountTitle: I18n.t('mobile.module.overtime.overtimeamountattendance') });
          break;
        case otModeByQuarter:
          this.setState({ amountTitle: I18n.t('mobile.module.overtime.overtimeamountquarter') });
          break;
        case otModeByYear:
          this.setState({ amountTitle: I18n.t('mobile.module.overtime.overtimeamountyear') });
          break;
        case otModeBySpecified:
          this.setState({ amountTitle: I18n.t('mobile.module.overtime.overtimeamountspecified') });
          break;
        default:
          break;
      }
    }
    // 计算已经申请的工时
    if (ApplyingOTHours == undefined || ApplyingOTHours === 0) {
      this.widthSecond = 0;
    } else {
      this.widthSecond = (ApprovedOTHours + ApplyingOTHours) / SecurityOTHours;
    }
    // 计算已经签核的工时
    if (ApprovedOTHours == undefined || ApprovedOTHours === 0) {
      this.widthThird = 0;
    } else {
      this.widthThird = ApprovedOTHours / SecurityOTHours;
    }
    this.setState({
      approvedOTHours: (!ApprovedOTHours) ? 0 : ApprovedOTHours,
      applyingOTHours: (!ApplyingOTHours) ? 0 : ApplyingOTHours,
      securityOTHours: (!SecurityOTHours) ? 0 : SecurityOTHours,
    });
    // 重新加载页面
    if (ApprovedOTHours != undefined && ApplyingOTHours != undefined &&
      SecurityOTHours != undefined && (ApprovedOTHours + ApplyingOTHours) <= SecurityOTHours) {
      if (ApplyingOTHours === 0) {
        this.otPB.onResetData(this.widthThird, this.widthThird, 108);
        return;
      }
      this.otPB.onResetData(this.widthSecond, this.widthThird, 108);
    }
  }

  render() {
    const { approvedOTHours, applyingOTHours, securityOTHours, amountTitle } = this.state;
    return (
      <View>
        {
          // 超过加班额度
          ((approvedOTHours + applyingOTHours) > securityOTHours) ?
            <View style={styles.itemAllView}>
              <Line />
              <View style={styles.otOverView}>
                <Text style={styles.overAmountFontView}>{I18n.t('mobile.module.overtime.overtimeapplyinfof')}{I18n.t('mobile.module.overtime.overtimeapplyinfos')}</Text>
              </View>
            </View> :
            // 签核通过的工时
            <View style={styles.itemAllView}>
              <Line />
              <View style={styles.amountView}>
                <Text style={styles.amountFontView}>{`${amountTitle}`}</Text>
              </View>
              <View style={styles.workingHoursView}>
                <Text style={styles.workingHoursFontView} >{`${approvedOTHours}`}</Text>
                <Text style={styles.workingHoursFontView} >{`${securityOTHours}`}</Text>
              </View>
              <View style={styles.progressBarView}>
                <ProgressBar
                  ref={text => this.otPB = text} widthThird={this.widthThird} colorSecond={'#ffb600'}
                  widthSecond={this.widthSecond} spacing={108} />
              </View>
              <View style={styles.infoPromptView}>
                <Text style={styles.infoPromptFontViewLeft}>{I18n.t('mobile.module.overtime.overtimehasdo')}</Text>
                <Text style={styles.infoPromptFontViewRight}>{I18n.t('mobile.module.overtime.overtimesafelimit')}</Text>
              </View>
              {
                // 显示正在申请的工时
                (applyingOTHours === 0) ? null :
                <View style={styles.infoApplyView}>
                  <Text style={styles.infoApplyFontView}>
                    {`${I18n.t('mobile.module.overtime.overtimehasapply')}${applyingOTHours}${I18n.t('mobile.module.overtime.overtimeapplyunit')}`}
                  </Text>
                </View>
              }
            </View>
        }
        <Line />
      </View>
    );
  }
}