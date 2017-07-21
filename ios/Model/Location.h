//
//  Location.h
//  ZSKQ
//
//  Created by Tadas.Gao on 16/7/13.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Location : NSObject

+ (instancetype)sharedInstance;

// 纬度
@property (nonatomic, assign) double lat;

// 经度
@property (nonatomic, assign) double lng;

// 水平精度
@property (nonatomic, assign) double horizontalAccuracy;

// 街道号码
@property (nonatomic, copy) NSString *streetNumber;

// 街道名称
@property (nonatomic, copy) NSString *streetName;

// 区县名称
@property (nonatomic, copy) NSString *districtName;

// 城市名称
@property (nonatomic, copy) NSString *cityName;

// 省份名称
@property (nonatomic, copy) NSString *provinceName;

- (NSDictionary *)getLocationInfo;

@end
