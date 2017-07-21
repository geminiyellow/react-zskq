//
//  RCTBaiduMapView.h
//  ZSKQ
//
//  Created by Tadas.Gao on 16/7/14.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RCTViewManager.h"
#import "RCTBridge.h"
#import "RCTBaiduMap.h"
#import "RCTBaiduMapAnnotation.h"

@interface RCTBaiduMapView : RCTViewManager<RCTBridgeModule>

+ (instancetype)sharedInstance;

- (void)startLocationService;

- (void)stopLocationService;

@end
