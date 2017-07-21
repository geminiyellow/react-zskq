//
//  RCTBaiduMapView.m
//  ZSKQ
//
//  Created by Tadas.Gao on 16/7/14.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RCTBaiduMapView.h"

@implementation RCTBaiduMapView

+ (instancetype)sharedInstance {
  static RCTBaiduMapView *sharedInstance = nil;
  
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [[super alloc] init];
  });
  
  return sharedInstance;
}

RCT_EXPORT_MODULE();

- (void)startLocationService {
  [[RCTBaiduMap sharedInstance] startLocationService];
}

- (void)stopLocationService {
  [[RCTBaiduMap sharedInstance] stopLocationService];
}

- (UIView *)view {
  return [[RCTBaiduMap sharedInstance] initWithZoomLevel:18];
}

RCT_EXPORT_VIEW_PROPERTY(annotations, NSArray<RCTBaiduMapAnnotation *>)

@end
