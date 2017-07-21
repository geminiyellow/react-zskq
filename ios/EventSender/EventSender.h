//
//  EventSender.h
//  ZSKQ
//
//  Created by Tadas.Gao on 16/5/16.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTBridge.h"

@interface EventSender : NSObject

@property(nonatomic, strong) RCTBridge *bridge;

+ (instancetype)sharedInstance;

- (void)sendEventWithName:(NSString *)eventName body:(id)eventBody;

@end
