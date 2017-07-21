//
//  Keychain.h
//  ZSKQ
//
//  Created by Tadas.Gao on 16/6/24.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Keychain : NSObject

+ (NSMutableDictionary *)getKeychainQuery:(NSString *)service;

+ (void)save:(NSString *)service data:(id)data;

+ (id)load:(NSString *)service;

+ (void)delete:(NSString *)service;

@end
