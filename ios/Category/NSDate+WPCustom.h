//
//  NSDate+WPCustom.h
//  ZSKQ
//
//  Created by Andy Wu on 2017/2/11.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "NSString+LocalizedString.h"

@interface NSDate (WPCustom)

/// 判断是否为平年
+ (BOOL)isLeapYear:(NSInteger)year;

/// 通过日期求星期
+ (NSString*)fromDateToWeek:(NSString*)selectDate languageType:(LanguageType)language;

@end
