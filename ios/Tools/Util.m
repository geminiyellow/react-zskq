//
//  Util.m
//  ZSKQ
//
//  Created by Tadas.Gao on 16/8/22.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "Util.h"
#import <CommonCrypto/CommonDigest.h>

@implementation Util

+ (NSString *)md5HexDigest:(NSString *)input {
  const char *str = [input UTF8String];
  unsigned char result[CC_MD5_DIGEST_LENGTH];
  CC_MD5(str, strlen(str), result);
  NSMutableString *ret = [NSMutableString stringWithCapacity:CC_MD5_DIGEST_LENGTH * 2];
  
  for(int i = 0; i < CC_MD5_DIGEST_LENGTH; i++) {
    [ret appendFormat:@"%02x", result[i]];
  }
  
  return ret;
}

+ (NSString *)intToBinary:(int)intValue {
  int byteBlock = 8,
  totalBits = sizeof(int) * byteBlock,
  binaryDigit = 1;
  NSMutableString *binaryStr = [[NSMutableString alloc] init];
  do {
    [binaryStr insertString:((intValue & binaryDigit) ? @"1" : @"0") atIndex:0];
    binaryDigit <<= 1;
  } while (--totalBits);

  return binaryStr;
}

@end
