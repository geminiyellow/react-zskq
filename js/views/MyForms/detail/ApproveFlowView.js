/**
表单详情工作流详情
 */
import { View } from 'react-native';
import React, { PureComponent } from 'react';
import ActorImageWrapper from '@/common/components/ImageWrapper';
import Line from '@/common/components/Line';
import _ from 'lodash';
import Text from '@/common/components/TextField';
import { device } from '@/common/Util';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import Constance from '../Constance';
import { getYYYYMMDDhhmmFormat } from '@/common/Functions';

let keys = null;
let i = 1;
export default class ApproveView extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      ApprovalInfoList: null,
    };
  }

  componentWillMount() {
    keys = new Set();
    const approves = this.props.detail;
    approves.map(item => {
      keys.add(item.TaskLevel);
    });
    this.setState({
      ApprovalInfoList: approves,
    });
  }
  //审核流程
  getApproveViews() {
    const views = [];
    if (this.state.ApprovalInfoList) {
      let i = 0;
      for (const item of keys.values()) {
        let lineView = <Line style={{ width: 3 * device.hairlineWidth, height: 22, backgroundColor: '#ffffff', borderColor: '#fff', marginLeft: 45 }} />;
        if (i == 0) lineView = null;
        const values = [];
        this.state.ApprovalInfoList.map(v => {
          if (item == v.TaskLevel) {
            values.push(v);
          }
        });
        views.push(
          <View key={i++} style={{ flexDirection: 'column' }}>
            {lineView}
            {this.getApproveItemView(values, item)}
          </View>
        );
      }
    }

    return [...views];
  }

  getApproveItemView(values, level) {
    // 并签或者会签
    if (values.length > 1) {
      const viewtemp = [];
      let CheckFlagText = I18n.t('mobile.module.detail.countersign');
      if (values[0].CheckFlag == '1') {
        CheckFlagText = I18n.t('mobile.module.detail.parallelsign');
      } else if (values[0].CheckFlag == '2') {
        CheckFlagText = I18n.t('mobile.module.detail.countersign');
      } else {
        CheckFlagText = '';
      }
      values.map(item => {
        let showComment = false;
        let statusContent = item.FlowStatus;
        const Data = getYYYYMMDDhhmmFormat(item.ApproveDate);

        if (!_.isEmpty(item.FlowStatus)) {
          if (item.FlowStatus == '通过' || item.FlowStatus == 'Complete') {
            showComment = true;
          } else if (item.FlowStatus == '驳回' || item.FlowStatus == 'Reject') {
            showComment = true;
          }
        } else {
          const { formType } = this.props;
          if (formType == Constance.FORMTYPE_PROCESSTRANSFERSHIFTFORM || formType == Constance.FORMTYPE_PROCESSDEMANDPOOLFORM) {
            if (level == -1) statusContent = I18n.t('mobile.module.changeshift.status');
          }
        }
        //审核流程布局
        viewtemp.push(
          < View key={`approveview-${i++}`} style={[styles.rowApproveStyle, { marginTop: 6, marginLeft: 0, marginRight: 0 }]}>
            <View style={{ height: 44, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
              <ActorImageWrapper style={styles.actorimgStyle} actor={item.HeadImg} EmpID={item.EmpID} EmpName={item.Approver} EnglishName={item.Approver} />
              <Text numberOfLines={1} lineBreakMode="tail" style={{ fontSize: 14, color: '#333333', marginLeft: 10, flex: 1 }} >{item.Approver}</Text>
              <Text style={{ fontSize: 11, color: '#cccccc', marginLeft: 10, marginRight: 10 }} >{statusContent}</Text>
              <Text style={{ fontSize: 11, color: '#cccccc', marginRight: 10 }} >{Data}</Text>
            </View>
            {
              (showComment && !_.isEmpty(item.Comment)) ?
                <View style={{ flex: 1, width: device.width - 36, height: 82, paddingTop: 12, paddingLeft: 48, paddingRight: 10, paddingBottom: 18, backgroundColor: '#F4F4F4', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                  <Text numberOfLines={3} lineBreakMode="tail" >{item.Comment}</Text>
                </View> : null
            }
          </View >
        );
      });
      const contentView = (
        <View key={`approveview-${i++}`} style={{ borderRadius: 15, borderColor: '#999999', padding: 9, paddingTop: 0, borderWidth: 1, marginLeft: 8, marginRight: 8, borderStyle: 'dashed' }}>
          <View style={{ flexDirection: 'row' }} >
            <View style={{ flex: 1 }} />
            <Text style={{ color: '#999999', fontSize: 14, marginTop: 5, marginRight: 15 }}>{CheckFlagText}</Text>
          </View>
          {[...viewtemp]}
        </View>
      );
      return contentView;
    }
    const item = values[0];
    let showComment = false;
    let statusContent = item.FlowStatus;
    const Data = getYYYYMMDDhhmmFormat(item.ApproveDate);
    if (!_.isEmpty(item.FlowStatus)) {
      if (item.FlowStatus == '通过' || item.FlowStatus == 'Complete') {
        showComment = true;
      } else if (item.FlowStatus == '驳回' || item.FlowStatus == 'Reject') {
        showComment = true;
      }
    } else {
      const { formType } = this.props;
      if (formType == Constance.FORMTYPE_PROCESSTRANSFERSHIFTFORM || formType == Constance.FORMTYPE_PROCESSDEMANDPOOLFORM) {
        if (level == -1) statusContent = I18n.t('mobile.module.changeshift.status');
      }
    }
    return (
      <View key={`approveview-${i++}`} style={styles.rowApproveStyle}>
        <View style={{ height: 44, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
          <ActorImageWrapper style={styles.actorimgStyle} actor={item.HeadImg} EmpID={item.EmpID} EmpName={item.Approver} EnglishName={item.Approver} />
          <Text numberOfLines={1} lineBreakMode="tail" style={{ fontSize: 14, color: '#333333', marginLeft: 10, flex: 1 }} >{item.Approver}</Text>
          <Text style={{ fontSize: 11, color: '#cccccc', marginLeft: 10, marginRight: 10 }} >{statusContent}</Text>
          <Text style={{ fontSize: 11, color: '#cccccc', marginRight: 10 }} >{Data}</Text>
        </View>
        {
          (showComment && !_.isEmpty(item.Comment)) ?
            <View style={{ flex: 1, width: device.width - 36, height: 82, paddingTop: 12, paddingLeft: 48, paddingRight: 10, paddingBottom: 12, backgroundColor: '#F4F4F4', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
              <Text numberOfLines={3} lineBreakMode="tail" >{item.Comment}</Text>
            </View> : null
        }
      </View>
    );
  }

  render() {
    return (
      <View>
        <Text style={{ paddingTop: 22, paddingBottom: 10, paddingLeft: 12, fontSize: 14, color: '#666' }}>{I18n.t('mobile.module.myform.detail.verifyflow')}</Text>
        {this.getApproveViews()}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  actorimgStyle: {
    width: 35,
    height: 35,
    alignSelf: 'center',
    borderRadius: 17,
  },
  rowApproveStyle: {
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 10,
    paddingLeft: 9,
    paddingRight: 9,
    marginLeft: 18,
    marginRight: 18,
  },
});