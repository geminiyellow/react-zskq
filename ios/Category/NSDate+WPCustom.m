//
//  NSDate+WPCustom.m
//  ZSKQ
//
//  Created by Andy Wu on 2017/2/11.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "NSDate+WPCustom.h"
#import "RNPickerView.h"
#import "NSString+LocalizedString.h"

@implementation NSDate (WPCustom)

+ (BOOL)isLeapYear:(NSInteger)year {
  if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
    return YES;
  }
  return NO;
}

+ (NSString*)fromDateToWeek:(NSString*)selectDate languageType:(LanguageType)language {
//  NSInteger yearInt = [selectDate substringWithRange:NSMakeRange(0, 4)].integerValue;
  NSInteger monthInt = [selectDate substringWithRange:NSMakeRange(4, 2)].integerValue;
  NSInteger dayInt = [selectDate substringWithRange:NSMakeRange(6, 2)].integerValue;
	
	NSInteger c = [selectDate substringWithRange:NSMakeRange(0, 2)].integerValue;
	NSInteger y = [selectDate substringWithRange:NSMakeRange(2, 2)].integerValue;
	if (monthInt == 1 || monthInt == 2) {
		monthInt += 12;
		--y;
	}
	NSInteger m = monthInt;
	NSInteger d = dayInt;
	NSInteger w = (y + y/4 + c/4 - 2*c + (26*(m+1)/10) + d - 1) % 7;
	if (w < 0) {
		w += 7;
	}

  NSString *weekDay = @"";
  switch (w) {
    case 0:
      weekDay = [NSString localizedStringWithKey:@"周日" languageType:language];
      break;
    case 1:
      weekDay = [NSString localizedStringWithKey:@"周一" languageType:language];
      break;
    case 2:
      weekDay = [NSString localizedStringWithKey:@"周二" languageType:language];
      break;
    case 3:
      weekDay = [NSString localizedStringWithKey:@"周三" languageType:language];
      break;
    case 4:
      weekDay = [NSString localizedStringWithKey:@"周四" languageType:language];
      break;
    case 5:
      weekDay = [NSString localizedStringWithKey:@"周五" languageType:language];
      break;
    case 6:
      weekDay = [NSString localizedStringWithKey:@"周六" languageType:language];
      break;
    default:
      break;
  }
  return weekDay;
}

@end
