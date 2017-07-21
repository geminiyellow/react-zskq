/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import "EventSender.h"
#import "IQKeyBoardManager.h"
#import "RCTBaiduMapView.h"
#import "UMMobClick/MobClick.h"
#import "JPUSHService.h"
#import "EBForeNotification.h"
#import "RCTSplashScreen.h"
#import <CodePush/CodePush.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RootViewController.h"

#define REMOTE_NOTIFICATION @"REMOTE_NOTIFICATION"
#define SHARE_CODE @"SHARE_CODE"
#define REMOTE_NOTIFICATION_BADGE_SYNC @"REMOTE_NOTIFICATION_BADGE_SYNC"
#define NATIVE_DEVICE_DID_CHANGE_LISTENER @"native_device_orientation_did_change_listener"

@implementation AppDelegate

#pragma mark - UIApplicationDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  NSURL *jsCodeLocation;
  
  RCTBundleURLProvider *provider = [RCTBundleURLProvider sharedSettings];
  
  [provider setDefaults];

  #ifdef DEBUG
    [provider setJsLocation:@"localhost"];
    jsCodeLocation = [provider jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  #else
    jsCodeLocation = [CodePush bundleURL];
  #endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"ZSKQ"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  [RCTSplashScreen show:rootView];
  
  [EventSender sharedInstance].bridge = rootView.bridge;

	self.window = [[MBFingerTipWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
	self.window.strokeColor = [UIColor colorWithRed:102/255.0 green:102/255.0 blue:102/255.0 alpha:1.0];
	self.rootViewController = [RootViewController new];
  self.rootViewController.view = rootView;
  self.window.rootViewController = self.rootViewController;
  
  self.centralManager = [[CBCentralManager alloc] initWithDelegate:self queue:dispatch_get_main_queue() options:nil];

  [self.window makeKeyAndVisible];
  self.hasInitial = false;
  self.registrationID = @"";
  self.isLandscape = NO;

  // 注册键盘事件
  [[IQKeyboardManager sharedManager] setEnable:false];
  [[IQKeyboardManager sharedManager] setKeyboardDistanceFromTextField:120];
  [[IQKeyboardManager sharedManager] setEnableAutoToolbar:YES];
  [[IQKeyboardManager sharedManager] setShouldResignOnTouchOutside:YES];
  
  // 静音检测
  [[RBDMuteSwitch sharedInstance] setDelegate:self];
  [[RBDMuteSwitch sharedInstance] detectMuteSwitch];
  
  // 注册友盟服务
  UMConfigInstance.appKey = UMENG_KEY;
  UMConfigInstance.channelId = @"App Store";
  [MobClick startWithConfigure:UMConfigInstance];
  [[UMSocialManager defaultManager] openLog:YES];
  [[UMSocialManager defaultManager] setUmSocialAppkey:UMENG_KEY];
  [self configUSharePlatforms];
  [self configUShareSettings];
  
  // SIM卡变更检测
  NSMutableDictionary *dic = (NSMutableDictionary *)[Keychain load:KEY_SIM_ID_IN_KEYCHAIN];
  if (!dic) {
    NSTimeInterval time = [[NSDate date] timeIntervalSince1970];
    long long int date = (long long int)time;
    NSMutableDictionary *dict = [NSMutableDictionary dictionary];
    dict[KEY_SIM_ID] = [NSString stringWithFormat:@"%d%@%lld", 0, [Util intToBinary:0], date];
    [Keychain save:KEY_SIM_ID_IN_KEYCHAIN data:dict];
  }
  
  self.telephonyNetworkInfo = [[CTTelephonyNetworkInfo alloc] init];
  CTCarrier *carrier = [self.telephonyNetworkInfo subscriberCellularProvider];
  NSMutableDictionary *dict = [NSMutableDictionary dictionary];
  dict[KEY_SIM_ID] = [NSString stringWithFormat:@"%@%@%@", carrier.mobileCountryCode, carrier.mobileNetworkCode, carrier.isoCountryCode];
  [Keychain save:KEY_SIM_ID_IN_KEYCHAIN data:dict];
  __weak __typeof(&*self)weakSelf = self;
  self.telephonyNetworkInfo.subscriberCellularProviderDidUpdateNotifier = ^(CTCarrier *carrier) {
    dispatch_async(dispatch_get_main_queue(), ^{
      weakSelf.telephonyNetworkInfoChanged = TRUE;
      
      NSTimeInterval time = [[NSDate date] timeIntervalSince1970];
      long long int date = (long long int)time;
      NSMutableDictionary *dict = [NSMutableDictionary dictionary];
      dict[KEY_SIM_ID] = [NSString stringWithFormat:@"%d%@%lld", weakSelf.telephonyNetworkInfoChanged, [Util intToBinary:INT_MAX], date];
      [Keychain save:KEY_SIM_ID_IN_KEYCHAIN data:dict];
    });
  };
	
	// 启动JPush SDK
  [JPUSHService setupWithOption:launchOptions
												 appKey:JPUSH_APPKEY
                        channel:@"App Store"
               apsForProduction:true
          advertisingIdentifier:nil];
  
  self.entranceType = @"normal";
  
  NSDictionary *remoteNotification = [launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
  if (remoteNotification && remoteNotification.count > 0) {
    NSMutableDictionary *dic = [NSMutableDictionary dictionaryWithDictionary:remoteNotification];
    [dic setValue:@"else" forKey:@"state"];
    self.notificationInfo = dic;
  }
	
	[[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(eBBannerViewDidClick:) name:EBBannerViewDidClick object:nil];
	[[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(deviceOrientationDidChange) name:UIDeviceOrientationDidChangeNotification object:nil];
	
  return YES;
}

- (void)application:(UIApplication *)application
didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [JPUSHService registerDeviceToken:deviceToken];
  [JPUSHService registrationIDCompletionHandler:^(int resCode, NSString *registrationID) {
    self.registrationID = registrationID;
  }];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {

	[[EventSender sharedInstance] sendEventWithName:REMOTE_NOTIFICATION_BADGE_SYNC body:@{}];
	
  NSMutableDictionary *dic = [NSMutableDictionary dictionaryWithDictionary:userInfo];
	if (application.applicationState == UIApplicationStateActive) {
		[EBForeNotification handleRemoteNotification:userInfo soundID:1312];
    [dic setValue:@"active" forKey:@"state"];
    [[EventSender sharedInstance] sendEventWithName:REMOTE_NOTIFICATION body:dic];
	} else {
		[JPUSHService handleRemoteNotification:userInfo];
    [dic setValue:@"else" forKey:@"state"];
    [[EventSender sharedInstance] sendEventWithName:REMOTE_NOTIFICATION body:dic];
	}
}

// local notification
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
	NSMutableDictionary *dic = [NSMutableDictionary dictionary];
	[dic setValue:@"clock" forKey:@"state"];
	[[EventSender sharedInstance] sendEventWithName:REMOTE_NOTIFICATION body:dic];
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
	// 清除角标
	[UIApplication sharedApplication].applicationIconBadgeNumber = 0;
}

// 3D Touch
- (void)application:(UIApplication *)application performActionForShortcutItem:(nonnull UIApplicationShortcutItem *)shortcutItem completionHandler:(nonnull void (^)(BOOL))completionHandler {
  self.entranceType = shortcutItem.type;
}

- (BOOL)application:(UIApplication *)application openURL:(nonnull NSURL *)url sourceApplication:(nullable NSString *)sourceApplication annotation:(nonnull id)annotation{
  BOOL result = [[UMSocialManager defaultManager] handleOpenURL:url sourceApplication:sourceApplication annotation:annotation];
  if (!result) {
    // 其他如支付等SDK 的回调
  }
  return result;
}

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window
{
  // 横屏之后切到后台，再切到前台保持横屏（图表）
  if (_isLandscape) {
    UIDeviceOrientation orientation = [UIDevice currentDevice].orientation;
    if (orientation == UIDeviceOrientationLandscapeLeft || orientation == UIDeviceOrientationLandscapeRight) {
      return UIInterfaceOrientationMaskLandscape;
    } else { // 横屏后旋转屏幕变为竖屏
      return UIInterfaceOrientationMaskPortrait;
    }
    
    return UIInterfaceOrientationMaskLandscape;
  } else {
    return UIInterfaceOrientationMaskAllButUpsideDown;
  }
}

#pragma mark - CBCentralManagerDelegate

- (void)centralManagerDidUpdateState:(CBCentralManager *)central {
	if(central.state == CBManagerStatePoweredOn) {
		self.bluetoothEnabled = TRUE;
	} else {
		self.bluetoothEnabled = FALSE;
	}
}

#pragma mark - RBDMuteSwitchDelegate

- (void)isMuted:(BOOL)muted {
  const float systemVersionNumber = [[UIDevice currentDevice].systemVersion floatValue];

  if (muted) {
    // 注册JPUSH服务
    if (systemVersionNumber >= 8.0) {
      [JPUSHService registerForRemoteNotificationTypes:(UIUserNotificationTypeBadge |
                                                        UIUserNotificationTypeAlert)
                                            categories:nil];
    } else {
      [JPUSHService registerForRemoteNotificationTypes:(UIRemoteNotificationTypeBadge |
                                                        UIRemoteNotificationTypeAlert)
                                            categories:nil];
    }
  } else {
    // 注册JPUSH服务
    if (systemVersionNumber >= 8.0) {
      [JPUSHService registerForRemoteNotificationTypes:(UIUserNotificationTypeBadge |
                                                        UIUserNotificationTypeSound |
                                                        UIUserNotificationTypeAlert)
                                            categories:nil];
    } else {
      [JPUSHService registerForRemoteNotificationTypes:(UIRemoteNotificationTypeBadge |
                                                        UIRemoteNotificationTypeSound |
                                                        UIRemoteNotificationTypeAlert)
                                            categories:nil];
    }
  }
}

#pragma mark - private methods

// 启动定位服务
- (void)startLocationService
{
  if (self.hasInitial)
  {
    return;
  }
  self.mapManager = [[BMKMapManager alloc] init];
  [self.mapManager start:BAIDU_MAP_KEY generalDelegate:nil];
  [[RCTBaiduMapView sharedInstance] startLocationService];
  self.hasInitial = true;
}

- (void)eBBannerViewDidClick: (NSNotification *)notification {
	NSMutableDictionary *dic = [NSMutableDictionary dictionaryWithDictionary:(NSDictionary *)notification.object];
	[dic setValue:@"touch" forKey:@"state"];
	[[EventSender sharedInstance] sendEventWithName:REMOTE_NOTIFICATION body:dic];
}

// UShare
- (void)configUShareSettings
{
  
}

- (void)configUSharePlatforms
{
  // QQ
  [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_QQ appKey:@"1102858930" appSecret:nil redirectURL:@"http://mobile.umeng.com/social"];
  // weixin
  [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_WechatSession appKey:@"wx97df38719ecdb6c3" appSecret:@"589204ce8d949bfd384d050a1ba9ec5f" redirectURL:@"http://mobile.umeng.com/social"];
}

- (void)shareWebPageToPlatformType:(UMSocialPlatformType)platformType
{
  UMSocialMessageObject *messageObject = [UMSocialMessageObject messageObject];
  UIImage *thumbImage = [UIImage imageNamed:@"share_icon"];
  UMShareWebpageObject *shareObject = [UMShareWebpageObject shareObjectWithTitle:self.shareTitle descr:self.shareDescription thumImage:thumbImage];
  shareObject.webpageUrl = @"https://mobilecenter.gaiaworkforce.com/download.jsp";
  messageObject.shareObject = shareObject;
  
  // 调用分享接口
  [[UMSocialManager defaultManager] shareToPlatform:platformType messageObject:messageObject currentViewController:nil completion:^(id result, NSError *error)
   {
     if (error)
     {
       UMSocialLogInfo(@"************Share fail with error %@*********", error);
       [[EventSender sharedInstance] sendEventWithName:SHARE_CODE body:@"3"];
     }
     else
     {
       if ([result isKindOfClass:[UMSocialShareResponse class]])
       {
         UMSocialShareResponse *resp = result;
         UMSocialLogInfo(@"response message is %@", resp.message);
         UMSocialLogInfo(@"response originalResponse data is %@",resp.originalResponse);
         [[EventSender sharedInstance] sendEventWithName:SHARE_CODE body:@"0"];
       }
       else
       {
         UMSocialLogInfo(@"response data is %@", result);
         [[EventSender sharedInstance] sendEventWithName:SHARE_CODE body:@"2"];
       }
     }
   }];
}

// 监听设备方向切换
- (void)deviceOrientationDidChange {
	if (UIDevice.currentDevice.orientation == UIDeviceOrientationLandscapeLeft || UIDevice.currentDevice.orientation == UIDeviceOrientationLandscapeRight) {
		NSDictionary *dictionary = @{@"orientation": @"landscape"};
		[[EventSender sharedInstance] sendEventWithName:NATIVE_DEVICE_DID_CHANGE_LISTENER body:dictionary];
    self.isLandscape = YES;
	} else if (UIDevice.currentDevice.orientation == UIDeviceOrientationPortrait) {\
		NSDictionary *dictionary = @{@"orientation": @"portrait"};
		[[EventSender sharedInstance] sendEventWithName:NATIVE_DEVICE_DID_CHANGE_LISTENER body:dictionary];
    self.isLandscape = NO;
	}
}

@end
