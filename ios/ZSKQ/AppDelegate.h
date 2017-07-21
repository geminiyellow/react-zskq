/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import <UIKit/UIKit.h>
#import <CoreBluetooth/CoreBluetooth.h>
#import <BaiduMapAPI_Base/BMKBaseComponent.h>
#import <CoreTelephony/CTTelephonyNetworkInfo.h>
#import <CoreTelephony/CTCarrier.h>
#import <UMSocialCore/UMSocialCore.h>
#import "RBDMuteSwitch.h"
#import "Fingertips.h"
#import "RootViewController.h"

@interface AppDelegate : UIResponder <UIApplicationDelegate, CBCentralManagerDelegate, RBDMuteSwitchDelegate>

@property (nonatomic, strong) MBFingerTipWindow *window;

@property (nonatomic, strong) CBCentralManager *centralManager;

@property (nonatomic, assign) Boolean bluetoothEnabled;

@property (nonatomic, strong) BMKMapManager *mapManager;

@property (nonatomic, strong) CTTelephonyNetworkInfo *telephonyNetworkInfo;

@property (nonatomic, assign) Boolean telephonyNetworkInfoChanged;

@property (nonatomic, copy) NSString *entranceType;

@property (nonatomic, assign) Boolean hasInitial;

@property (nonatomic, copy) NSString *registrationID;

@property (nonatomic, copy) NSString *shareTitle;

@property (nonatomic, copy) NSString *shareDescription;
/// Root View Controller
@property (nonatomic, strong) RootViewController *rootViewController;
/// 推送内容
@property (nonatomic, copy) NSDictionary *notificationInfo;

@property (nonatomic, assign) BOOL isLandscape;


- (void)startLocationService;
- (void)shareWebPageToPlatformType:(UMSocialPlatformType)platformType;

@end
