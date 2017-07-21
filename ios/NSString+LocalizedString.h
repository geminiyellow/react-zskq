//
//  NSString+LocalizedString.h
//  DatePickerDemo
//
//  Created by AndyWu on 1/18/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RNPickerView.h"

@interface NSString (LocalizedString)

+ (NSString *)localizedStringWithKey:(NSString *)key languageType:(LanguageType)languageType;

@end
