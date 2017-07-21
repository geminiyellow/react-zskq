import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  View,
  InteractionManager,
} from 'react-native';

import { keys } from '@/common/Util';
import ActorImageWrapper from '@/common/components/ImageWrapper';
import _ from 'lodash';
import realm from '@/realm';

export default class Head extends Component {
  mixins: [React.addons.PureRenderMixin]

  constructor(props) {
    super(props);
    this.state = {
      headImgUrl: '',
      empName: '',
      englishName: '',
      empID: '',
    };
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      if (!this.props.userName) {
        return;
      }
      const staffId = this.props.userName.replace(/\\/g, '#KENG#');
      const userInfo = realm.objects('User').filtered(`name = "${staffId}"`);
      if (userInfo.length != 0) {
        this.setState({
          headImgUrl: userInfo[0].head_url,
          empName: userInfo[0].emp_name,
          englishName: userInfo[0].english_name,
          empID: userInfo[0].emp_id,
        });
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { headImgUrl, empName, englishName, empID } = this.state;
    return headImgUrl !== nextState.headImgUrl || empName !== nextState.empName || englishName !== nextState.englishName || empID !== nextState.empID;
  }

  renderHeadImg() {
    const { headImgUrl, empName, englishName, empID } = this.state;
    return <ActorImageWrapper style={styles.headImage} textStyle={{ fontSize: 30 }} actor={headImgUrl} EmpID={empID} EmpName={empName} EnglishName={englishName} />;
  }

  render() {
    const { style } = this.props;
    return (
      <View style={[styles.headBg, style]}>
        {this.renderHeadImg()}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  headBg: {
    height: 130,
    justifyContent: 'center',
  },
  headImage: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    borderRadius: 45,
  },
});