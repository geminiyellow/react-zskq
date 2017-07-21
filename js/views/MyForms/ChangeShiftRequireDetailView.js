/**
 * 换班需求详情布局
 */
import { ScrollView, Text, View } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { device } from '@/common/Util';
import { getCurrentLanguage } from '@/common/Functions';
import EStyleSheet from 'react-native-extended-stylesheet';
import ActorImageWrapper from '@/common/components/ImageWrapper';
import I18n from 'react-native-i18n';
import ScheduleConstance from './../Schedule/Constance';
import Line from '../../common/components/Line';
import { languages } from '@/common/LanguageSettingData';
import MyFormHelper from './MyFormHelper';
import { getHHmmFormat, getYYYYMMDDFormat } from '@/common/Functions';

const myFormHelper = new MyFormHelper();
let currentDetail = null;

export default class ChangeShiftRequireDetailView extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      language: 0,
    };
    getCurrentLanguage().then(data => {
      const k = languages.indexOf(data);
      if (k == 0) {
        this.setState({
          language: 0,
        });
      } else {
        this.setState({
          language: 1,
        });
      }
    });
  }

  componentWillMount() {
    currentDetail = this.props.detail;
  }

  getDetailView() {
    return this.getApprovaledDetailView();
  }

  // 获取审核完成状态下的表单详情
  getApprovaledDetailView() {
    let empName = currentDetail.formDetail.MyName;
    if (myFormHelper.getLanguage() == 0) {
      empName = _.isEmpty(currentDetail.formDetail.MyName) ? currentDetail.formDetail.MyEnglishName : currentDetail.formDetail.MyName;
    } else {
      empName = _.isEmpty(currentDetail.formDetail.MyEnglishName) ? currentDetail.formDetail.MyName : currentDetail.formDetail.MyEnglishName;
    }
    return (
      <View>
        <View style={{ flexGrow: 1 }}>
          <Text allowFontScaling={false} style={{ margin: 11, marginLeft: 18 }}>{empName} {I18n.t('mobile.module.changeshift.offer')}</Text>
          {this.myShiftView()}

        </View>
        {this.getApproveViews()}
      </View>
    );
  }

  getApproveViews() {
    let empName = currentDetail.formDetail.MyName;
    const Data = getYYYYMMDDFormat(currentDetail.formDetail.ApplyDate);

    if (myFormHelper.getLanguage() == 0) {
      empName = _.isEmpty(currentDetail.formDetail.MyName) ? currentDetail.formDetail.MyEnglishName : currentDetail.formDetail.MyName;
    } else {
      empName = _.isEmpty(currentDetail.formDetail.MyEnglishName) ? currentDetail.formDetail.MyName : currentDetail.formDetail.MyEnglishName;
    }
    const views = [];
    if (currentDetail) {
      let i = 0;
      views.push(
        <View key={i++} style={{ flexDirection: 'column' }}>
          <Line style={{ width: 3 * device.hairlineWidth, height: 22, backgroundColor: '#ffffff', borderColor: '#fff', marginLeft: 45 }} />
          <View style={styles.rowApproveStyle}>
            <ActorImageWrapper style={styles.imgStyle} actor={global.loginResponseData.HeadImgUrl} EmpID={global.loginResponseData.EmpID} EmpName={global.loginResponseData.EmpName} EnglishName={global.loginResponseData.EnglishName} />
            <Text allowFontScaling={false} style={{ fontSize: 14, color: '#333333', marginLeft: 10 }} >{empName}</Text>
            <Text allowFontScaling={false} style={{ fontSize: 11, color: '#cccccc', marginLeft: 10 }} >{currentDetail.formDetail.ApproveState == '0' ? I18n.t('mobile.module.changeshift.pendding') : I18n.t('mobile.module.changeshift.statusstop')}</Text>
            <View style={{ flexGrow: 1 }} />
            <Text allowFontScaling={false} style={{ fontSize: 11, color: '#cccccc' }} >{Data}</Text>
          </View>
        </View>
      );
    }

    return [...views];
  }

  myShiftView() {
    const date = _.split(currentDetail.formDetail.MyShiftDate, '-');
    const startData = getHHmmFormat(currentDetail.formDetail.MyShiftFrom);
    const endData = getHHmmFormat(currentDetail.formDetail.MyShiftTo);
    let circlebg = styles.schedulecircleStyle;
    if (currentDetail.formDetail.MyShiftType == ScheduleConstance.ShiftType_HOLIDAY || currentDetail.formDetail.MyShiftType == ScheduleConstance.ShiftType_FESTIVAL) {
      circlebg = styles.schedulecircleStyleOrange;
    }
    let durationView = null;
    durationView = (<Text allowFontScaling={false} style={{ fontSize: 14, color: '#999999' }}>{I18n.t('mobile.module.clock.shifttime')}：{startData}-{endData}{`(${currentDetail.formDetail.MyShiftHours}${I18n.t('mobile.module.changeshift.hour')})`}</Text>);
    const monthText = ScheduleConstance.getMonth(date[1], this.state.language);
    return (
      <View style={styles.scheduleRowStyle}>
        <View style={circlebg} >
          <Text allowFontScaling={false} style={{ fontSize: 16, color: 'white' }}>{date[2]}</Text>
          <Text allowFontScaling={false} style={{ fontSize: 11, color: 'white' }}>{I18n.t(monthText)}</Text>
        </View>

        <View style={styles.rowTextStyle} >
          <Text allowFontScaling={false} style={{ fontSize: 16, color: '#000000' }}>{currentDetail.formDetail.MyShiftName}</Text>
          {durationView}
        </View>
      </View>
    );
  }

  render() {
    return (
      <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {this.getDetailView()}
        </View>
      </ScrollView>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '$color.containerBackground',
  },
  rowTextStyle: {
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 11,
  },
  schedulecircleStyle: {
    flexDirection: 'column',
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#1fd662',
    alignItems: 'center',
    justifyContent: 'center',
  },
  schedulecircleStyleOrange: {
    flexDirection: 'column',
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#ffc817',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTagTitleStyle: {
    fontSize: 14,
    color: '#999999',
  },
  allTextStyle: {
    fontSize: 18,
    color: '#32CF78',
  },
  imgStyle: {
    width: 35,
    height: 35,
    alignSelf: 'center',
    borderRadius: 17,
  },
  rowStyle: {
    flexDirection: 'column',
  },
  scheduleRowStyle: {
    backgroundColor: 'white',
    height: 65,
    flexDirection: 'row',
    padding: 18,
    paddingTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 8,
  },
  rowApproveStyle: {
    height: 44,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingLeft: 9,
    paddingRight: 9,
    marginLeft: 18,
    marginRight: 18,
  },
});
