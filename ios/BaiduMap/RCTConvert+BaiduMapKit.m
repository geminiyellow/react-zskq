//
//  RCTConvert+BaiduMapKit.m
//  ZSKQ
//
//  Created by Tadas.Gao on 16/7/26.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RCTConvert+BaiduMapKit.h"
#import "RCTConvert+CoreLocation.h"
#import "RCTBaiduMapAnnotation.h"

@implementation RCTConvert (BaiduMapKit)

+ (RCTBaiduMapAnnotation *)RCTBaiduMapAnnotation:(id)json {
  json = [self NSDictionary:json];
  RCTBaiduMapAnnotation *annotation = [RCTBaiduMapAnnotation new];
  annotation.coordinate = [self CLLocationCoordinate2D:json];
  annotation.title = [self NSString:json[@"title"]];
  annotation.subtitle = [self NSString:json[@"subtitle"]];
  
  return annotation;
}

RCT_ARRAY_CONVERTER(RCTBaiduMapAnnotation)

@end
