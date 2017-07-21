//
//  RCTLocationService.h
//  ZSKQ
//
//  Created by Tadas.Gao on 16/7/20.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <BaiduMapAPI_Base/BMKBaseComponent.h>
#import <BaiduMapAPI_Location/BMKLocationComponent.h>

@interface RCTLocationService : BMKLocationService

+ (instancetype)sharedInstance;

@end
