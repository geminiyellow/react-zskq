/**
 * Navigator滑动配置帮助类
 */

import { Navigator } from 'react-native-deprecated-custom-components';

let instance = null;
const config = {};

export default class NavigatorSceneConfigsHelper {
  mixins: [React.addons.PureRenderMixin]

  constructor() {
    if (instance == null) {
      instance = this;
    }
    for (const k in Navigator.SceneConfigs.FloatFromRight) {
      config[k] = Navigator.SceneConfigs.FloatFromRight[k];
    }
    config.gestures = null;
    return instance;
  }

  setConfig(SceneConfig) {
    for (const k in SceneConfig) {
      config[k] = SceneConfig[k];
    }
  }

  /**
   * 设置默认手势 FloatFromRight
   */
  getDefaultSceneConfigs() {
    // console.log(`config :  ${JSON.stringify(config)}`);
    return config;
  }

  /**
   * 清除手势
   */
  resetSceneConfigs() {
    config.gestures = null;
    return config;
  }
}