import React, { Component } from 'react';
import { InteractionManager, Text, TouchableOpacity, View, WebView } from 'react-native';
import Image from '@/common/components/CustomImage';
import I18n from 'react-native-i18n';
import EStyleSheet from 'react-native-extended-stylesheet';
import { connect } from 'react-redux';
import { LoadingManager } from '@/common/Loading';
import { device } from '@/common/Util';
import NavBar from '@/common/components/NavBar';
import { loadFailed, setLoaded, goBack } from '../action';
import UmengAnalysis from '@/common/components/UmengAnalysis';
import { getLoveCareURL } from '@/common/components/Login/LoginRequest';

const networkErrorImg = 'network_error';
const REMOTE = 'remote';

class LoveCareView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loveCareUrl: '',
    };
    const { dispatch } = this.props;
    dispatch(loadFailed(false));
    dispatch(setLoaded(false));
    dispatch(goBack(false));
  }

  /** Life Cycle */
  componentWillMount() {
    UmengAnalysis.onPageBegin('LoveCare');
  }

  componentDidMount() {
    const { dispatch } = this.props;
    InteractionManager.runAfterInteractions(() => {
      // ...long-running synchronous task...
      dispatch(setLoaded(true));
    });

    // 获取爱关怀的url
    getLoveCareURL().then((data) => {
      this.setState({
        loveCareUrl: data,
      });
    }, (err) => {
    });
  }

  componentWillUnmount() {
    UmengAnalysis.onPageEnd('LoveCare');
    LoadingManager.stop();
  }

  /** Callback */

  onLoadStart() {
    LoadingManager.start();
  }

  onLoad() {
    LoadingManager.done();
  }

  onError(errorInfo) {
    const { dispatch } = this.props;
    dispatch(loadFailed(true));
    LoadingManager.done();
  }

  onLoadEnd() {
  }

  onNavigationStateChange(navState) {
    const { dispatch } = this.props;
    dispatch(goBack(navState.canGoBack));
  }

  /** Response Event */

  onPressBackButton() {
    const { canGoBack } = this.props;
    if (canGoBack) {
      this.webview.goBack();
    } else {
      const { navigator } = this.props;
      navigator.pop();
    }
  }

  reload() {
    const { dispatch } = this.props;
    dispatch(loadFailed(false));
  }

  /** Render View */

  renderErrorView() {
    return (
      <View style={styles.errorView}>
        <View style={styles.errorInfoView}>
          <View style={styles.icon}>
            <Image style={styles.image} source={{ uri: networkErrorImg }} />
          </View>
          <Text style={{ fontSize: 14 }}>{I18n.t('mobile.module.lovecare.errortitle')}</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={() => this.reload()}>
          <Text style={styles.refreshText}>{I18n.t('mobile.module.lovecare.errorbuttontitle')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderWebview() {
    const { loaded, type, aghUrl } = this.props;
    const { loveCareUrl } = this.state;
    if (!loaded) return;
    let url = global.loginResponseData.aghUrl;
    if (type === REMOTE && aghUrl) url = aghUrl;
    if(loveCareUrl.length == 0) {
      return (
        <View style={{ flex: 1 }} />
      );
    }

    return (
      <WebView
        ref={webview => this.webview = webview}
        source={{ uri: loveCareUrl }}
        style={styles.webview}
        onLoadStart={() => this.onLoadStart()}
        onLoad={() => this.onLoad()}
        onError={(errorInfo) => this.onError(errorInfo)}
        onLoadEnd={() => this.onLoadEnd()}
        bounces={false}
        onNavigationStateChange={(navState) => this.onNavigationStateChange(navState)}
        automaticallyAdjustContentInsets={false}
        scalesPageToFit={false}
        javaScriptEnabled
        domStorageEnabled
      />
    );
  }

  render() {
    const { isLoadFailed, navigator, canGoBack } = this.props;
    return (
      <View style={styles.container}>
        <NavBar title={I18n.t('mobile.module.lovecare.navbartitle')} onPressLeftButton={() => this.onPressBackButton()} onPressCloseButton={() => navigator.pop()} closeButton={canGoBack} />
        {isLoadFailed ? this.renderErrorView() : this.renderWebview()}
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { isLoadFailed, loaded, canGoBack } = state.loveCareReducer;
  return {
    isLoadFailed,
    loaded,
    canGoBack,
  };
}

export default connect(mapStateToProps)(LoveCareView);

const styles = EStyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
  webview: {
  },
  errorView: {
    alignItems: 'center',
  },
  errorInfoView: {
    width: device.width,
    height: device.height * (3 / 5.0),
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  image: {
    width: 80,
    height: 80,
  },
  refreshButton: {
    marginTop: 32,
    paddingHorizontal: 40,
    height: 36,
    backgroundColor: '#1fd662',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshText: {
    backgroundColor: 'transparent',
    fontSize: 14,
    color: '#ffffff',
  },
});