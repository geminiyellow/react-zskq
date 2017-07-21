//
//  RNSearchCoreManager.h
//  ZSKQ
//
//  Created by AndyWu on 12/13/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"

@interface RNSearchCoreManager : NSObject<RCTBridgeModule>

@property (strong, nonatomic) NSMutableDictionary *allProjectCodes;
@property (strong, nonatomic) NSMutableArray *searchByCode;
@property (strong, nonatomic) NSMutableArray *searchByPhone;

@end
