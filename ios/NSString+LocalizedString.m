//
//  NSString+LocalizedString.m
//  DatePickerDemo
//
//  Created by AndyWu on 1/18/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "NSString+LocalizedString.h"

@implementation NSString (LocalizedString)

+ (NSString *)localizedStringWithKey:(NSString *)key languageType:(LanguageType)languageType {
  NSString *string;
  switch (languageType) {
    case LanguageTypeChinese: // 中文
      string = NSLocalizedStringFromTable(key, @"Chinese", nil);
      break;
    case LanguageTypeKorean: // 韩语
      string = NSLocalizedStringFromTable(key, @"Korean", nil);
      break;
    case LanguageTypeJapanese: // 日语
      string = NSLocalizedStringFromTable(key, @"Japanese", nil);
      break;
    case LanguageTypeFrench: // 法语
      string = NSLocalizedStringFromTable(key, @"French", nil);
      break;
		case LanguageTypeGerman: // 德语
			string = NSLocalizedStringFromTable(key, @"German", nil);
			break;
		case LanguageTypeThai: // 泰语
			string = NSLocalizedStringFromTable(key, @"Thai", nil);
			break;
		case LanguageTypeTraditionalChinese: // 繁体中文
			string = NSLocalizedStringFromTable(key, @"TraditionalChinese", nil);
			break;
      
    default: // 默认显示英语
      string = NSLocalizedStringFromTable(key, @"English", nil);
      break;
  }
  return string;
}

@end
