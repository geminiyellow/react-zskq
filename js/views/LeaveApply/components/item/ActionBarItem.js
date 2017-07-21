import React, { PureComponent } from 'react';

import NavBar from '@/common/components/NavBar';
import I18n from 'react-native-i18n';
import NavBarBackText from '@/common/components/NavBarBackText';
import NavBarRightOneIcon from '@/common/components/NavBarRightOneIcon';


export default class ActionBarItem extends PureComponent {

  // 初始化
  constructor(props) {
    super(props);
    this.state = {
      imgRight: this.props.imgRight,
    };
  }

  render() {
    return (
      <NavBar
        title={I18n.t('mobile.module.leaveapply.leaveapplytitle')}
        onPressLeftButton={() => {
          const { onBackAction } = this.props;
          onBackAction();
        }}
        rightContainerRightImage={{ uri: this.state.imgRight }}
        onPressRightContainerRightButton={() => {
          const { onShiftAction } = this.props;
          onShiftAction();
        }} />
    );
  }
}