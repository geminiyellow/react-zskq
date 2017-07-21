//
//  Util.h
//  ZSKQ
//
//  Created by Tadas.Gao on 16/8/22.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Util : NSObject

+ (NSString *)md5HexDigest:(NSString *)input;

+ (NSString *)intToBinary:(int)intValue;

@end
