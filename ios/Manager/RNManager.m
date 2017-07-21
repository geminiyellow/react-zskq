//
//  RNManager.m
//  ZSKQ
//
//  Created by Tadas.Gao on 16/5/16.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <ifaddrs.h>
#import <net/if.h>
#import <SystemConfiguration/CaptiveNetwork.h>
#import <UShareUI/UShareUI.h>

#import "RNManager.h"
#import "AppDelegate.h"
#import "AVFoundation/AVFoundation.h"
#import "UIViewController+HUD.h"
#import "Location.h"
#import "RCTBaiduMapView.h"
#import "JPUSHService.h"
#import "ZSKQ-Swift.h"
#import "IQKeyboardManager.h"

@implementation RNManager

RCT_EXPORT_MODULE();

// 加载中Loading
RCT_REMAP_METHOD(showLoading, showLoading:(NSString *)message) {
  [[self rootController].hudManager showIndeterminateWithMessage:message];
}

// 关闭加载中Loading
RCT_EXPORT_METHOD(hideLoading) {
  [[self rootController].hudManager hide];
}

// 蓝牙是否开启
RCT_REMAP_METHOD(bluetoothEnabled, bluetoothEnabledWithSuccessCallback:(RCTResponseSenderBlock)successBlock) {
  if (!successBlock) {
    return;
  }
  
  AppDelegate *delegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
  
  successBlock(@[@(delegate.bluetoothEnabled)]);
}

// GPS是否开启
RCT_REMAP_METHOD(GPSEnabled, GPSEnabledWithSuccessCallback:(RCTResponseSenderBlock)successBlock) {
  if (!successBlock) {
    return;
  }
  
  if ([CLLocationManager locationServicesEnabled] && ([CLLocationManager authorizationStatus] == kCLAuthorizationStatusAuthorizedWhenInUse ||
                                                      [CLLocationManager authorizationStatus] == kCLAuthorizationStatusAuthorizedAlways)) {
    successBlock(@[@(TRUE)]);
  } else {
    successBlock(@[@(FALSE)]);
  }
}

// WIFI是否开启
RCT_REMAP_METHOD(wifiEnabled, wifiEnabledWithSuccessCallback:(RCTResponseSenderBlock)successBlock) {
  if (!successBlock) {
    return;
  }
  
  NSCountedSet *countedset = [[NSCountedSet alloc] init];
  struct ifaddrs *interfaces;
  if (!getifaddrs(&interfaces))
  {
    for (struct ifaddrs *interface = interfaces; interface; interface = interface -> ifa_next)
    {
      BOOL up = (interface -> ifa_flags & IFF_UP) == IFF_UP;
      if (up)
      {
        [countedset addObject:[NSString stringWithUTF8String:interface -> ifa_name]];
      }
    }
  }
  
  NSInteger number = (int)[countedset countForObject:@"awdl0"];
  if (number == 2)
  {
    successBlock(@[@(true)]);
  } else
  {
    successBlock(@[@(false)]);
  }
}

// 相机是否开启
RCT_REMAP_METHOD(cameraEnabled, cameraEnabledWithSuccessCallback:(RCTResponseSenderBlock)successBlock) {
  if (!successBlock) {
    return;
  }
  
  if ([AVCaptureDevice devicesWithMediaType:AVMediaTypeVideo].count) {
    AVAuthorizationStatus status = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
    BOOL statusAuthorize = false;
    if (status == AVAuthorizationStatusAuthorized || status == AVAuthorizationStatusNotDetermined) {
      statusAuthorize = true;
    }
    successBlock(@[@(statusAuthorize)]);
    
    return;
  }
  
  successBlock(@[@(FALSE)]);
}

// 获取最新位置信息
RCT_REMAP_METHOD(getLocation, getLocationWithSuccessCallback:(RCTResponseSenderBlock)successBlock) {
  if (!successBlock) {
    return;
  }
  
  successBlock(@[[Location sharedInstance].getLocationInfo]);
}

// 开启蓝牙
RCT_EXPORT_METHOD(openBluetooth) {
  NSURL *url = [NSURL URLWithString:@"prefs:root=Bluetooth"];
  
  UIApplication *application = [UIApplication sharedApplication];
  if ([application canOpenURL:url]) {
    [application openURL:url];
  }
}

// 开启GPS
RCT_EXPORT_METHOD(openGPS) {
  NSURL *url = [NSURL URLWithString:@"prefs:root=LOCATION_SERVICES"];
  
  UIApplication *application = [UIApplication sharedApplication];
  if ([application canOpenURL:url]) {
    [application openURL:url];
  }
}

// 开启WIFI
RCT_EXPORT_METHOD(openWifi) {
  NSURL *url = [NSURL URLWithString:@"prefs:root=WIFI"];
  
  UIApplication *application = [UIApplication sharedApplication];
  if ([application canOpenURL:url]) {
    [application openURL:url];
  }
}

// 开始定位
RCT_EXPORT_METHOD(startLocationService) {
  [[RCTBaiduMapView sharedInstance] startLocationService];
}

// 停止定位
RCT_EXPORT_METHOD(stopLocationService) {
  [[RCTBaiduMapView sharedInstance] stopLocationService];
}

// 保存登录用户的PersonID
RCT_REMAP_METHOD(savePersonID, savePersonID:(NSString *)personId) {
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  [defaults setObject:personId forKey:@"PersonID"];
  [defaults synchronize];
}

- (UIViewController *)rootController {
  AppDelegate *delegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
  UIViewController *rootViewController = (UIViewController *)delegate.window.rootViewController;
  
  return rootViewController;
}

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}


// 开启一个本地通知
RCT_EXPORT_METHOD(startALocalNotification:(NSDictionary *)dic)
{
  UILocalNotification *localNotification = [[UILocalNotification alloc] init];
  NSDate *date = [NSDate dateWithTimeIntervalSince1970:([[dic objectForKey:@"fireDate"] unsignedLongLongValue] / 1000)];
	
  localNotification.fireDate = date;
  localNotification.timeZone = [NSTimeZone defaultTimeZone];
  localNotification.alertBody = [dic objectForKey:@"alertBody"];
  localNotification.applicationIconBadgeNumber = [[dic objectForKey:@"applicationIconBadgeNumber"] intValue];
  localNotification.soundName = UILocalNotificationDefaultSoundName;
  localNotification.userInfo = [dic objectForKey:@"userInfo"];
  
  [[UIApplication sharedApplication] scheduleLocalNotification:localNotification];
}

// 关闭一个本地通知
RCT_EXPORT_METHOD(cancelALocalNotification:(NSDictionary *)userInfo)
{
  NSArray *array = [[UIApplication sharedApplication] scheduledLocalNotifications];
  for (UILocalNotification *obj in array)
  {
    if ([[obj.userInfo objectForKey:@"name"] isEqualToString:[userInfo objectForKey:@"name"]])
    {
      [[UIApplication sharedApplication] cancelLocalNotification:obj];
    }
  }
}

// 关闭全部本地通知
RCT_EXPORT_METHOD(cancelAllLocalNotifications)
{
  [[UIApplication sharedApplication] cancelAllLocalNotifications];
}

// 监测是否由3D Touch启动App
RCT_REMAP_METHOD(getEntranceType, getEntranceTypeWithSuccessCallback:(RCTResponseSenderBlock)successBlock) {
  if (!successBlock) {
    return;
  }
  
  AppDelegate *appDelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
  successBlock(@[appDelegate.entranceType]);
}

// 初始化3D Touch携带的参数
RCT_EXPORT_METHOD(resetEntranceType)
{
  AppDelegate *appDelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
  appDelegate.entranceType = @"normal";
}

// 初始化定位服务
RCT_EXPORT_METHOD(startBaiduMapLocationService)
{
  AppDelegate *appDelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
  [appDelegate startLocationService];
}

// 退出登录时 清楚JPush 关联
RCT_EXPORT_METHOD(stopJPushService)
{
  [[NSUserDefaults standardUserDefaults] setObject:@"" forKey:@"PersonID"];
  [[NSUserDefaults standardUserDefaults] synchronize];
  [JPUSHService registerDeviceToken:nil];
  [JPUSHService setTags:nil alias:nil fetchCompletionHandle:nil];
}

// 检测是否通过点击推送消息进入（App未在后台运行时）
RCT_EXPORT_METHOD(remoteNotificatioinInfo:(RCTResponseSenderBlock)callback)
{
  if (!callback) {
    return;
  }
  
  AppDelegate *appDelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
  NSDictionary *dic = appDelegate.notificationInfo;
  if (!dic) {
    return;
  }
  callback(@[appDelegate.notificationInfo]);
}

RCT_EXPORT_METHOD(emptyNotificationInfo)
{
  AppDelegate *appDelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
  appDelegate.notificationInfo = nil;
}

RCT_EXPORT_METHOD(resumePush)
{
  UIApplication *application = [UIApplication sharedApplication];
  [application registerForRemoteNotifications];
}

RCT_EXPORT_METHOD(shareApp:(NSString *)title shareAppDesc:(NSString *)desc)
{
  AppDelegate *delegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
  delegate.shareTitle = title;
  delegate.shareDescription = desc;
  // 分享掌上考勤
  [UMSocialUIManager setPreDefinePlatforms:@[@(UMSocialPlatformType_QQ), @(UMSocialPlatformType_WechatSession), @(UMSocialPlatformType_Sms)]];
  [UMSocialUIManager showShareMenuViewInWindowWithPlatformSelectionBlock:^(UMSocialPlatformType platformType, NSDictionary *userInfo) {
    AppDelegate *delegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
        [delegate shareWebPageToPlatformType:platformType];
  }];
}

RCT_EXPORT_METHOD(canEvaluatePolicy:(RCTResponseSenderBlock)successBlock) {
	TouchIDManager *myManager = [[TouchIDManager alloc] init];
	Boolean canEvaluatePolicy = [myManager canEvaluatePolicy];
	successBlock(@[@(canEvaluatePolicy)]);
}

RCT_EXPORT_METHOD(evaluatePolicy:(NSString *)title) {
	TouchIDManager *myManager = [[TouchIDManager alloc] init];
	[myManager evaluatePolicy:title];
}

RCT_EXPORT_METHOD(RegistrationId:(RCTResponseSenderBlock)successBlock) {
  AppDelegate *delegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
  successBlock(@[delegate.registrationID]);
}

RCT_EXPORT_METHOD(TelePhone:(NSString *)phoneNumber) {
  [[UIApplication sharedApplication] openURL:[NSURL URLWithString:[NSString stringWithFormat:@"tel://%@", phoneNumber]]];
}

RCT_EXPORT_METHOD(openURL:(NSString *)url) {
  [[UIApplication sharedApplication] openURL:[NSURL URLWithString:url]];
}

// 禁用IQKeyboardManager
RCT_EXPORT_METHOD(disableKeyboardManager) {
	[[IQKeyboardManager sharedManager] setEnable:false];
}

// 启用IQKeyboardManager
RCT_EXPORT_METHOD(enableKeyboardManager) {
	[[IQKeyboardManager sharedManager] setEnable:true];
}

/// 旋转屏幕-横屏
RCT_EXPORT_METHOD(rotateScreenLandscape) {
	[[UIDevice currentDevice] setValue:@(UIInterfaceOrientationLandscapeRight) forKey:@"orientation"];
}

/// 旋转屏幕-竖屏
RCT_EXPORT_METHOD(rotateScreenPortrait) {
	[[UIDevice currentDevice] setValue:@(UIInterfaceOrientationPortrait) forKey:@"orientation"];
}

/// 支持屏幕自动旋转
RCT_EXPORT_METHOD(supportAutorotate) {
	AppDelegate *delegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
	delegate.rootViewController.supportAutorotate = true;
}

/// 禁用屏幕自动旋转
RCT_EXPORT_METHOD(disableAutorotate) {
	AppDelegate *delegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
	delegate.rootViewController.supportAutorotate = false;
}

@end
