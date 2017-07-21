import { BackAndroid, NativeModules } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import Tab from '@/views/Tab';
import Login from '@/views/Login';
import Guide from '@/views/Guide';
import { device } from '@/common/Util';
import MySalary from '@/views/MySalary';
import CompanyCode from '@/views/CompanyCode';
import Launch from '@/views/Launch/Launch';
import Salary from '@/views/MySalary/Salary';
import { navigationBar } from '@/common/Style';
import MobileCheckIn from '@/views/MobileCheckIn';
import GesturePwd from '@/views/MySalary/GesturePwd';
import ScanQrCheckIn from '@/views/MobileCheckIn/ScanQrCheckIn';
import CheckQRLogin from '@/views/Mine/QRLogin/CheckQRLogin';
import QRLogin from '@/views/Mine/QRLogin';
import UmengAnalysis from '@/common/components/UmengAnalysis';

const StatusBarManager = NativeModules.StatusBarManager;
const { RNManager } = NativeModules;
const processColor = require('processColor');
// 记住用户的路径和长度
let navigators;
// 判断用户是否在主页退出
let isBackFromTab = false;
// 判断用户是否在登录页退出
let isBackFromApp = false;
// 判断是否从薪资页面退出
let isSalaryPage = false;
let isAloneUse = false;

export default class Root extends Component {
  mixins: [React.addons.PureRenderMixin]

  /** Life Cycle */
  componentWillMount() {
    UmengAnalysis.onPageBegin('Root');
  }

  componentDidMount() {
    if (device.isAndroid) {
      // 设置最初的软键盘输入模式是adjustResize 
      RNManager.changeInputType(0);
      this.listeners = [
        BackAndroid.addEventListener('hardwareBackPress', () => {
          isBack = true;
          if (this.lastBackPressed && this.lastBackPressed + 1000 >= Date.now()) {
            // 最近1秒内按过back键，可以返回。
            return true;
          }
          this.lastBackPressed = Date.now();
          // 判断是否存在路径信息
          if (!navigators) {
            return false;
          }
          // 判断用户是否在主页、登录页、公司代码页面
          if (isBackFromTab) {
            return false;
          }
          if (isBackFromApp) {
            const routes = navigators.state.routeStack;
            for (let i = routes.length - 2; i >= 0; i -= 1) {
              if (routes[i].component === Login) {
                navigators.pop();
                return true;
              }
              return false;
            }
            return false;
          }
          // 处理薪资页面的
          if (isSalaryPage) {
            const routes = navigators.state.routeStack;
            for (let i = routes.length - 1; i >= 0; i -= 1) {
              if (routes[i].component === Tab) {
                const destinationRoute = navigators.getCurrentRoutes()[i];
                navigators.popToRoute(destinationRoute);
              }
            }
            return true;
          }
          // 这些页面安卓返回键单独处理
          if (isAloneUse) {
            return true;
          }
          // 退出当前页面
          if (navigators.getCurrentRoutes().length > 1) {
            navigators.pop();
            return true;
          }
          return false;
        }),


      ];
    }
  }

  componentWillUnmount() {
    UmengAnalysis.onPageEnd('Root');
    if (device.isAndroid) {
      this.listeners && this.listeners.forEach(listener => listener.remove());
    }
  }


  /** private methods */

  configureScene(route, routeStack) {
    return {
      ...Navigator.SceneConfigs.PushFromRight,
      gestures: route.gestureDisabled ? null : Navigator.SceneConfigs.PushFromRight.gestures,
    };
  }

  /** render methods */

  renderScene(route, navigator) {
    if (device.isAndroid) {
      isBackFromTab = false;
      isBackFromApp = false;
      isSalaryPage = false;
      isAloneUse = false;
      // 处理APP顶部的显示信息和判断用户是否在主页
      if (route.component === Tab) {
        StatusBarManager.setColor(processColor(navigationBar.homeBackgroundColor), true);
        isBackFromTab = true;
      } else if (route.component === MySalary || route.component === GesturePwd ||
        route.component === ScanQrCheckIn || route.component === MobileCheckIn) {
        StatusBarManager.setColor(processColor(navigationBar.homeBackgroundColor), true);
      } else {
        StatusBarManager.setColor(processColor('gray'), true);
      }
      // 退出APP
      if (route.component === Login || route.component === CompanyCode ||　route.component === Guide) {
        isBackFromApp = true;
      }
      // 实现跳转
      if (route.component === Salary) {
        isSalaryPage = true;
      }
      // 单独处理退出操作
      if (route.component === MySalary || route.component === ScanQrCheckIn || route.component === GesturePwd
        || route.component === MobileCheckIn || route.component === CheckQRLogin || route.component === QRLogin) {
        isAloneUse = true;
      }
    }
    navigators = navigator;
    return <route.component navigator={navigator} {...route} {...route.passProps} />;
  }

  render() {
    return (
      <Navigator
        initialRoute={{ component: Launch }}
        configureScene={(route, routeStack) => this.configureScene(route, routeStack)}
        renderScene={this.renderScene}
      />
    );
  }
}

const styles = EStyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: '$color.containerBackground',
  },
});