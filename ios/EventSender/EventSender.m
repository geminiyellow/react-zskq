//
//  EventSender.m
//  ZSKQ
//
//  Created by Tadas.Gao on 16/5/16.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "EventSender.h"
#import "RCTEventDispatcher.h"

@implementation EventSender

+ (instancetype)sharedInstance {
  static EventSender *sharedInstance = nil;
  
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [[super alloc] init];
  });
  
  return sharedInstance;
}

- (void)sendEventWithName:(NSString *)eventName body:(id)eventBody {
  [self.bridge.eventDispatcher sendDeviceEventWithName:eventName body:eventBody];
}

@end
