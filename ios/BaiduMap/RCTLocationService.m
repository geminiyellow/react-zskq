//
//  RCTLocationService.m
//  ZSKQ
//
//  Created by Tadas.Gao on 16/7/20.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RCTLocationService.h"

@implementation RCTLocationService

+ (instancetype)sharedInstance {
  static RCTLocationService *sharedInstance = nil;
  
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [[super alloc] init];
  });
  
  return sharedInstance;
}

@end
