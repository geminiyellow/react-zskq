//
//  RCTConvert+BaiduMapKit.h
//  ZSKQ
//
//  Created by Tadas.Gao on 16/7/26.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RCTConvert.h"
#import <BaiduMapAPI_Base/BMKBaseComponent.h>
#import <BaiduMapAPI_Map/BMKMapComponent.h>

@class RCTBaiduMapAnnotation;

@interface RCTConvert (BaiduMapKit)

+ (RCTBaiduMapAnnotation *)RCTBaiduMapAnnotation:(id)json;

@end
