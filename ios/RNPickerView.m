//
//  RNPickerView.m
//  DatePickerDemo
//
//  Created by AndyWu on 2016/12/27.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RNPickerView.h"
#import "HcdDateTimePickerView.h"
#import "CommonColor.h"

@interface RNPickerView ()

@property (nonatomic, strong) HcdDateTimePickerView *picker;

@end

@implementation RNPickerView

#pragma mark - init methods
- (instancetype)initWithFrame:(CGRect)frame {
  self = [super initWithFrame:frame];
  if (self) {
		[self addSubview:self.picker];
		[self.picker showHcdDateTimePicker];
  }
  return self;
}

#pragma mark - private methods
- (NSDate *)dateFromString:(NSString *)string {
  NSDateFormatter *dateFormatter = [NSDateFormatter new];
  dateFormatter.dateFormat = @"YYYY-MM-dd HH:mm:ss";
  NSDate *date = [dateFormatter dateFromString:string];
  return date;
}

#pragma mark - getters and setters
- (HcdDateTimePickerView *)picker {
	if (_picker == nil) {
		_picker = [[HcdDateTimePickerView alloc] initWithDatePickerMode:DatePickerDateMode defaultDateTime:[[NSDate alloc] initWithTimeIntervalSinceNow:0]];
		_picker.topViewColor = [UIColor whiteColor];
		_picker.titleColor = kTitleColor;
		_picker.buttonTitleColor = kButtonNormalColor;

		__weak RNPickerView *weakSelf = self;
		_picker.clickedOkBtn = ^(NSString * datetimeStr) {
			RNPickerView *innerself = weakSelf;
			NSDictionary *params = @{@"data": datetimeStr};
			innerself.onPickerConfirm(params);
		};

		_picker.clickedCancelButton = ^{
			RNPickerView *innerSelf = weakSelf;
			NSDictionary *params = @{@"data": @"0"};
			innerSelf.onPickerCancel(params);
		};
	}
	return _picker;
}

- (void)setMinYear:(NSInteger)minYear {
  _picker.minYear = minYear;
}

- (NSInteger)minYear {
  return _picker.minYear;
}

- (void)setMaxYear:(NSInteger)maxYear {
  _picker.maxYear = maxYear;
}

- (NSInteger)maxYear {
  return _picker.maxYear;
}

- (void)setDatePickerMode:(NSInteger)datePickerMode {
  switch (datePickerMode) {
    case 1:
      _picker.datePickerMode = DatePickerDateMode;
      break;
    case 2:
      _picker.datePickerMode = DatePickerTimeMode;
      break;
    case 3:
      _picker.datePickerMode = DatePickerDateTimeMode;
      break;
    case 4:
      _picker.datePickerMode = DatePickerYearMonthMode;
      break;
    case 5:
      _picker.datePickerMode = DatePickerMonthDayMode;
      break;
    case 6:
      _picker.datePickerMode = DatePickerHourMinuteMode;
      break;
    case 7:
      _picker.datePickerMode = DatePickerDateHourMinuteMode;
      break;

    default:
      _picker.datePickerMode = DatePickerDateMode;
      break;
  }
}

- (NSInteger)datePickerMode {
  return _picker.datePickerMode;
}

- (void)setDefaultTime:(NSString *)defaultTime {
  NSDate *date = [self dateFromString:defaultTime];
  if (date) {
    _picker.defaultDate = date;
  }
}

- (void)setTitle:(NSString *)title {
  _picker.title = title;
}

- (void)setLanguageType:(LanguageType)languageType {
  switch (languageType) {
    case LanguageTypeChinese:
      _picker.language = LanguageTypeChinese;
      break;
    case LanguageTypeKorean:
      _picker.language = LanguageTypeKorean;
      break;
    case LanguageTypeJapanese:
      _picker.language = LanguageTypeJapanese;
      break;
    case LanguageTypeFrench:
      _picker.language = LanguageTypeFrench;
      break;
		case LanguageTypeGerman:
			_picker.language = LanguageTypeGerman;
			break;
		case LanguageTypeThai:
			_picker.language = LanguageTypeThai;
			break;
		case LanguageTypeTraditionalChinese:
			_picker.language = LanguageTypeTraditionalChinese;
			break;
      
    default:
      _picker.language = LanguageTypeEnglish;
      break;
  }
}

@end
