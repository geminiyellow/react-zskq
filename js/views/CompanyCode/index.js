import {
  ScrollView,
  TouchableHighlight,
  View,
  Easing,
  Animated,
  Dimensions,
  Keyboard,
  NativeModules,
  InteractionManager,
} from 'react-native';
import { setCompanyCodeMobileRequest } from '@/common/components/Login/LoginRequest';
import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import SplashScreen from 'rn-splash-screen';
import EStyleSheet from 'react-native-extended-stylesheet';
import { device, keys } from '@/common/Util';
import Input from '@/common/components/Input';
import { showMessage } from '@/common/Message';
import Image from '@/common/components/CustomImage';
import { messageType } from '@/common/Consts';
import OthersButton from '@/common/components/OthersButton';
import Experience from '@/views/Experience';
import realm from '@/realm';
import ForcedUpdateModal from '@/common/components/Login/ForcedUpdateModal';
import Text from '@/common/components/TextField';
import { button } from '@/common/Style';

import { retrieveStorageCompanyCode, changeCompanyCode } from './actions';
import Login from '../Login';

const { RNManager, RNKeychainManager } = NativeModules;
const companyTop = 'company_top';
const KEYBOARD_EVENT_SHOW = device.isIos ? 'keyboardWillShow' : 'keyboardDidShow';
const KEYBOARD_EVENT_HIDE = device.isIos ? 'keyboardWillHide' : 'keyboardDidHide';

class CompanyCode extends Component {
  mixins: [React.addons.PureRenderMixin]

  constructor(props) {
    super(props);
    this.state = {
      marginTop: device.height * 0.22,
      marginLeft: device.width * 0.101,
      marginRight: device.width * 0.099,
      marginBottom: device.height * 0.087,
      height: 126.8,
      width: 300,
      bounceValue: new Animated.Value(1),
      animatedValue: new Animated.Value(0),
      animatedValue2: new Animated.Value(0),

      marginTop: null,
    };
    this.isPusing = false;
  }

  /** life cycle */

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(KEYBOARD_EVENT_SHOW, () => this.onShow());
    this.keyboardDidHideListener = Keyboard.addListener(KEYBOARD_EVENT_HIDE, () => this.onHide());
    InteractionManager.runAfterInteractions(() => {
      const companyInfo = realm.objects('Company');
      if (companyInfo.length != 0 && companyInfo[0].code != 'trial') {
        this.props.dispatch(
          retrieveStorageCompanyCode(
            companyInfo[0].code,
          ),
        );
      } else {
        RNKeychainManager.getUserInfo(info => {
          this.props.dispatch(
            retrieveStorageCompanyCode(
              info.companyCode,
            ),
          );
        });
      }
    });
  }

  componentDidMount() {
    if (device.isIos) {
      RNManager.disableAutorotate();
    }
    if (device.isIos) RNManager.disableKeyboardManager();
    InteractionManager.runAfterInteractions(() => {
      SplashScreen.hide();
    });
    this.mounted = true;
  }

  componentWillUnmount() {
    if (device.isIos) RNManager.enableKeyboardManager();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.mounted = false;
  }

  /** response event */

  /** 提交公司代码后，若验证成功进入登录页面 */
  onButtonPress() {
    if (this.isPusing) return;
    const { companyCode } = this.props;
    const temp =companyCode.toLowerCase().trim();

    if (!temp) {
      showMessage(messageType.error, I18n.t('mobile.module.login.codeempty'));
      return;
    }

    this.isPusing = true;
    RNManager.showLoading('');
    InteractionManager.runAfterInteractions(() => {
      setCompanyCodeMobileRequest(temp).then(responseData => {
        RNManager.hideLoading();

        if (device.isIos) RNManager.enableKeyboardManager();
        this.props.navigator.push({
          component: Login,
          params: {
            loginPwd: (this.props.params) ? this.props.params.loginPwd : '',
          },
          gestureDisabled: true,
        });
        this.isPusing = false;
      }).catch(err => {
        this.isPusing = false;
        RNManager.hideLoading();
        showMessage(messageType.error, err);
      });
    });
  }

  onPressExperienceButton() {
    const { navigator } = this.props;
    navigator.push({
      component: Experience,
    });
  }

  onShow() {
    Animated.parallel([
      Animated.timing(
        this.state.bounceValue,
        {
          toValue: 0.84,
          duration: 300,
        },
      ),
      Animated.timing(
        this.state.animatedValue,
        {
          toValue: -75,
          duration: 300,
        }
      ),
      Animated.timing(
        this.state.animatedValue2,
        {
          toValue: -28,
          duration: 300,
        }
      ),
    ]).start()
  }


  onHide() {
    Animated.parallel([
      Animated.timing(
        this.state.bounceValue,
        {
          toValue: 1,
          duration: 300,
        },
      ),
      Animated.timing(
        this.state.animatedValue,
        {
          toValue: 0,
          duration: 300,
        }
      ),
      Animated.timing(
        this.state.animatedValue2,
        {
          toValue: 0,
          duration: 300,
        }
      ),
    ]).start()
  }



  /** render methods */

  render() {
    const { companyCode } = this.props;
    let imageTop = styles.imageTopStyle;
    // 触摸代码编辑框时，图标变小
    let companyCodeUpperCase = companyCode.toLocaleUpperCase();
    if (companyCodeUpperCase == 'TRIAL') {
      companyCodeUpperCase = '';
    }

    return (
      <Animated.View style={[styles.animatedValue, { transform: [{ translateY: this.state.animatedValue }] }]} >

        <ScrollView
          style={{ flex: 1, backgroundColor: '#fff', marginTop: this.state.marginTop }}
          bounces={false}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="never" >
          <View style={styles.wrapper}>
            <Animated.Image
              ref={img => this.image = img}
              style={[imageTop, { transform: [{ scale: this.state.bounceValue },] }]}
              source={{ uri: companyTop }} />
            <Animated.View style={{ transform: [{ translateY: this.state.animatedValue2 }] }} >
              <View style={styles.animatedValuestyle}>
                <Input
                  style={styles.textInputCompany}
                  value={companyCodeUpperCase}
                  placeholder={I18n.t('mobile.module.login.typecompanycode')}
                  onChangeText={(text) => InteractionManager.runAfterInteractions(() => {
                    let tempStr;
                    if ((text.length - companyCode.length) > 1) {
                      tempStr = text.substr(companyCode.length, text.length - companyCode.length);
                    } else {
                      tempStr = text;
                    }
                    this.props.dispatch(changeCompanyCode(tempStr));
                  })}
                  onSubmitEditing={e => {
                    let tempStr;
                    const text = e.nativeEvent.text;
                    if ((text.length - companyCode.length) > 1) {
                      tempStr = text.substr(companyCode.length, text.length - companyCode.length);
                    } else {
                      tempStr = text;
                    }
                    this.props.dispatch(changeCompanyCode(tempStr));
                  }}

                  autoCapitalize="characters"
                  selectionColor="#14BE4B"
                  clearButtonMode="never"
                />
                <View style={styles.textInputLine} />
                <Text style={styles.companyCodeDescription}>{I18n.t('mobile.module.login.codedesc')}</Text>
                <OthersButton
                  title={I18n.t('mobile.module.login.codesubmit')}
                  backgroundColor={button.background.normal}
                  activeBg={button.background.active}
                  onPressBtn={() => { this.onButtonPress(); }} />
              </View>
            </Animated.View>
            <TouchableHighlight
              style={styles.experienceButton}
              onPress={() => this.onPressExperienceButton()}
              activeOpacity={0.5}
              underlayColor="transparent"
            >
              <View>
                <Text allowFontScaling={false} style={styles.experienceButtonText}>{I18n.t('mobile.module.quickexperience.quicklook')}</Text>
              </View>
            </TouchableHighlight>
          </View>
        </ScrollView>
        <ForcedUpdateModal />
      </Animated.View>
    );
  }
}

const styles = EStyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '$color.white',
  },
  animatedValue: {
    height: device.height,
    backgroundColor: '#fff',
  },
  animatedValuestyle: {
    flex: 1,
    flexDirection: 'column',
    width: device.width,
  },
  imageTopStyle: {
    marginTop: device.height * 0.22,
    marginLeft: device.width * 0.101,
    marginRight: device.width * 0.099,
    marginBottom: device.height * 0.087,
    height: device.height * 0.19,
    width: device.width * 0.8,
  },
  textInputCompany: {
    textAlign: 'center',
    width: device.width - 48,
    height: 28,
    marginRight: 24,
    marginLeft: 24,
    fontSize: 20,
    color: '$color.mainBodyTextColor',
  },
  textInputLine: {
    height: 1,
    width: device.width - 48,
    marginTop: 10,
    marginLeft: device.width * 0.064,
    backgroundColor: '$color.line',
  },
  companyCodeDescription: {
    width: device.width - 48,
    fontSize: 12,
    marginLeft: device.width * 0.115,
    marginVertical: 11,
    color: '$color.mainAlertTextColor',
  },
  textInputText: {
    marginLeft: -6,
    fontSize: 20,
    color: '#BDBDBD',
  },
  experienceButton: {
    marginTop: (60 / 667) * device.height,
    alignItems: 'center',
  },
  experienceButtonText: {
    width: device.width,
    fontSize: 13,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#14BE4B',
    textAlign: 'center',
  },
});

export default connect((state) => {
  const { companyCode } = state.companyCodeReducer;
  return {
    companyCode,
  };
})(CompanyCode);