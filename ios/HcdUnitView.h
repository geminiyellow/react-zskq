//
//  HcdUnitView.h
//  DatePickerDemo
//
//  Created by AndyWu on 1/10/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "HcdDateTimePickerView.h"

@interface HcdUnitView : UIView

#pragma mark - init method

- (instancetype)initWithDatePickerMode:(DatePickerMode)datePickerMode;

- (void)updateFrameWithDatePickerMode:(DatePickerMode)datePickerMode;
- (void)updateTitleLanguage:(LanguageType)languageType;

@end

/// 年份、月份、日、时、分、秒视图
@interface HcdTextView : UIView

/// 日期时间单位文本视图
@property (nonatomic, strong) UILabel *titleLabel;

#pragma mark - init method

- (instancetype)initWithTitle:(NSString *)title;

- (void)updateTitleRect;
- (void)updateTitleWithKey:(NSString *)key Language:(LanguageType)languageType;

@end
