/**
图片预览控件
 */
import { View } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import React, { PureComponent } from 'react';
import NavigatorSceneConfigsHelper from '@/common/NavigatorSceneConfigsHelper';
import AttachReviewModal from './AttachReviewModal';

const navigatorSceneConfigsHelper = new NavigatorSceneConfigsHelper();
export default class PreViewImageUi extends PureComponent {
  componentWillMount() {
    Navigator.SceneConfigs.FadeAndroid.gestures = null;
    navigatorSceneConfigsHelper.setConfig(Navigator.SceneConfigs.FadeAndroid);
  }
  componentDidMount() {
    this.attmodal.open(this.props.passProps.Url);
  }

  componentWillUnmount() {
    Navigator.SceneConfigs.FloatFromRight.gestures = null;
    navigatorSceneConfigsHelper.setConfig(Navigator.SceneConfigs.FloatFromRight);
  }

  modalClosed=() => {
    this.props.passProps.Navigator.pop();
  }

  render() {
    return (
      <View style={{ flexGrow: 1 }}>
        <AttachReviewModal
          ref={modal => this.attmodal = modal}
          modalclosed={this.modalClosed}
          />
      </View>
    );
  }

 }