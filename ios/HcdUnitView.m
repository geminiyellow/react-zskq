//
//  HcdUnitView.m
//  DatePickerDemo
//
//  Created by AndyWu on 1/10/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#define kTopViewHeight 36

#import "HcdUnitView.h"
#import "NSString+LocalizedString.h"
#import "HcdConstant.h"

@interface HcdUnitView ()

/// 年份视图
@property (nonatomic, strong) HcdTextView *yearUnitView;

/// 月份视图
@property (nonatomic, strong) HcdTextView *monthUnitView;

/// 日视图
@property (nonatomic, strong) HcdTextView *dayUnitView;

/// 时视图
@property (nonatomic, strong) HcdTextView *hourUnitView;

/// 分视图
@property (nonatomic, strong) HcdTextView *minuteUnitView;

/// 秒视图
@property (nonatomic, strong) HcdTextView *secondUnitView;

@end

@implementation HcdUnitView

#pragma mark - init methods
- (instancetype)initWithFrame:(CGRect)frame {
  self = [super initWithFrame:frame];
  if (self) {
		[self addSubview:self.yearUnitView];
		[self addSubview:self.monthUnitView];
		[self addSubview:self.dayUnitView];
		[self addSubview:self.hourUnitView];
		[self addSubview:self.minuteUnitView];
		[self addSubview:self.secondUnitView];
  }
  return self;
}

- (instancetype)initWithDatePickerMode:(DatePickerMode)datePickerMode {
  CGRect unitViewRect = CGRectMake(0, kTopViewHeight, kScreen_Width, unitViewHeight);
	self = [self initWithFrame:unitViewRect];
  [self updateFrameWithDatePickerMode:datePickerMode];
  return self;
}

- (void)updateFrameWithDatePickerMode:(DatePickerMode)datePickerMode {
  switch (datePickerMode) {
    case DatePickerDateMode: [self updateTextViewWithDateMode]; // 年月日
      break;
    case DatePickerTimeMode: [self updateTextViewWithTimeMode]; // 时分秒
      break;
    case DatePickerDateTimeMode: [self updateTextViewWithDateTimeMode]; // 年月日时分秒
      break;
    case DatePickerYearMonthMode: [self updateTextViewWithYearMonthMode]; // 年月
      break;
    case DatePickerMonthDayMode: [self updateTextViewWithMonthDayMode]; // 月日
      break;
    case DatePickerHourMinuteMode: [self updateTextViewWithHourMinuteMode]; // 时分
      break;
    case DatePickerDateHourMinuteMode: [self updateTextViewWithDateHourMinuteMode]; // 年月日时分
      break;
    default:
      break;
  }
}

- (void)updateTitleLanguage:(LanguageType)languageType {
  [self.yearUnitView updateTitleWithKey:@"年" Language:languageType];
  [self.monthUnitView updateTitleWithKey:@"月" Language:languageType];
  [self.dayUnitView updateTitleWithKey:@"日" Language:languageType];
  [self.hourUnitView updateTitleWithKey:@"时" Language:languageType];
  [self.minuteUnitView updateTitleWithKey:@"分" Language:languageType];
  [self.secondUnitView updateTitleWithKey:@"秒" Language:languageType];
	[self updateTitle];
}

#pragma mark - private methods
/// DatePickerDateMode = 1
- (void)updateTextViewWithDateMode {
  self.yearUnitView.frame = CGRectMake(0, 0, kScreen_Width*0.34, unitViewHeight);
  self.monthUnitView.frame = CGRectMake(kScreen_Width*0.34, 0, kScreen_Width*0.33, unitViewHeight);
  self.dayUnitView.frame = CGRectMake(kScreen_Width*0.67, 0, kScreen_Width*0.33, unitViewHeight);
  self.hourUnitView.frame = CGRectZero;
  self.minuteUnitView.frame = CGRectZero;
  self.secondUnitView.frame = CGRectZero;
  [self.yearUnitView updateTitleRect];
  [self updateTitle];
}

/// DatePickerTimeMode = 2
- (void)updateTextViewWithTimeMode {
  self.yearUnitView.frame = CGRectZero;
  self.monthUnitView.frame = CGRectZero;
  self.dayUnitView.frame = CGRectZero;
  self.hourUnitView.frame = CGRectMake(0, 0, kScreen_Width*0.34, unitViewHeight);
  self.minuteUnitView.frame = CGRectMake(kScreen_Width*0.34, 0, kScreen_Width*0.33, unitViewHeight);
  self.secondUnitView.frame = CGRectMake(kScreen_Width * 0.67, 0, kScreen_Width*0.33, unitViewHeight);
  [self updateTitle];
}

/// DatePickerDateTimeMode = 3
- (void)updateTextViewWithDateTimeMode {
  self.yearUnitView.frame = CGRectMake(0, 0, kScreen_Width*0.25, unitViewHeight);
  self.monthUnitView.frame = CGRectMake(kScreen_Width*0.25, 0, kScreen_Width*0.15, unitViewHeight);
  self.dayUnitView.frame = CGRectMake(kScreen_Width*0.40, 0, kScreen_Width*0.15, unitViewHeight);
  self.hourUnitView.frame = CGRectMake(kScreen_Width*0.55, 0, kScreen_Width*0.15, unitViewHeight);
  self.minuteUnitView.frame = CGRectMake(kScreen_Width*0.70, 0, kScreen_Width*0.15, unitViewHeight);
  self.secondUnitView.frame = CGRectMake(kScreen_Width * 0.85, 0, kScreen_Width*0.15, unitViewHeight);
  [self updateTitle];
}

/// DatePickerYearMonthMode = 4
- (void)updateTextViewWithYearMonthMode {
  self.yearUnitView.frame = CGRectMake(0, 0, kScreen_Width*0.5, unitViewHeight);
  self.monthUnitView.frame = CGRectMake(kScreen_Width*0.5, 0, kScreen_Width*0.5, unitViewHeight);
  self.dayUnitView.frame = CGRectZero;
  self.hourUnitView.frame = CGRectZero;
  self.minuteUnitView.frame = CGRectZero;
  self.secondUnitView.frame = CGRectZero;
  [self updateTitle];
}

/// DatePickerMonthDayMode = 5
- (void)updateTextViewWithMonthDayMode {
  self.yearUnitView.frame = CGRectZero;
  self.monthUnitView.frame = CGRectMake(0, 0, kScreen_Width*0.5, unitViewHeight);
  self.dayUnitView.frame = CGRectMake(kScreen_Width*0.5, 0, kScreen_Width*0.5, unitViewHeight);
  self.hourUnitView.frame = CGRectZero;
  self.minuteUnitView.frame = CGRectZero;
  self.secondUnitView.frame = CGRectZero;
  [self updateTitle];
}

/// DatePickerHourMinuteMode = 6
- (void)updateTextViewWithHourMinuteMode {
  self.yearUnitView.frame = CGRectZero;
  self.monthUnitView.frame = CGRectZero;
  self.dayUnitView.frame = CGRectZero;
  self.hourUnitView.frame = CGRectMake(0, 0, kScreen_Width*0.5, unitViewHeight);
  self.minuteUnitView.frame = CGRectMake(kScreen_Width*0.5, 0, kScreen_Width*0.5, unitViewHeight);
  self.secondUnitView.frame = CGRectZero;
  [self updateTitle];
}

/// DatePickerDateHourMinuteMode = 7
- (void)updateTextViewWithDateHourMinuteMode {
  self.yearUnitView.frame = CGRectMake(0, 0, kScreen_Width * YEAR_WIDTH_PERCENT, unitViewHeight);
  self.monthUnitView.frame = CGRectMake(kScreen_Width * YEAR_WIDTH_PERCENT, 0, kScreen_Width * MONTH_WIDTH_PERCENT, unitViewHeight);
  self.dayUnitView.frame = CGRectMake(kScreen_Width * (YEAR_WIDTH_PERCENT + MONTH_WIDTH_PERCENT), 0, kScreen_Width * DAY_WIDTH_PERCENT, unitViewHeight);
  self.hourUnitView.frame = CGRectMake(kScreen_Width * (YEAR_WIDTH_PERCENT + MONTH_WIDTH_PERCENT + DAY_WIDTH_PERCENT), 0, kScreen_Width * HOUR_WIDTH_PERCENT, unitViewHeight);
  self.minuteUnitView.frame = CGRectMake(kScreen_Width * (YEAR_WIDTH_PERCENT + MONTH_WIDTH_PERCENT + DAY_WIDTH_PERCENT + HOUR_WIDTH_PERCENT), 0, kScreen_Width * MINUTE_WIDTH_PERCENT, unitViewHeight);
  [self updateTitle];
}

- (void)updateTitle {
  [self.yearUnitView updateTitleRect];
  [self.monthUnitView updateTitleRect];
  [self.dayUnitView updateTitleRect];
  [self.hourUnitView updateTitleRect];
  [self.minuteUnitView updateTitleRect];
  [self.secondUnitView updateTitleRect];
}

#pragma mark - getters and setters
- (HcdTextView *)yearUnitView {
	if (_yearUnitView == nil) {
		_yearUnitView = [[HcdTextView alloc] initWithTitle:@"年"];
	}
	return _yearUnitView;
}

- (HcdTextView *)monthUnitView {
	if (_monthUnitView == nil) {
		_monthUnitView = [[HcdTextView alloc] initWithTitle:@"月"];
	}
	return _monthUnitView;
}

- (HcdTextView *)dayUnitView {
	if (_dayUnitView == nil) {
		_dayUnitView = [[HcdTextView alloc] initWithTitle:@"日"];
	}
	return _dayUnitView;
}

- (HcdTextView *)hourUnitView {
	if (_hourUnitView == nil) {
		_hourUnitView = [[HcdTextView alloc] initWithTitle:@"时"];
	}
	return _hourUnitView;
}

- (HcdTextView *)minuteUnitView {
	if (_minuteUnitView == nil) {
		_minuteUnitView = [[HcdTextView alloc] initWithTitle:@"分"];
	}
	return _minuteUnitView;
}

- (HcdTextView *)secondUnitView {
	if (_secondUnitView == nil) {
		_secondUnitView = [[HcdTextView alloc] initWithTitle:@"秒"];
	}
	return _secondUnitView;
}

@end

@implementation HcdTextView

#pragma mark - init methods
- (instancetype)initWithFrame:(CGRect)frame {
  self = [super initWithFrame:frame];
  if (self) {
		[self addSubview:self.titleLabel];
  }
  return self;
}

- (instancetype)initWithTitle:(NSString *)title {
	self = [self initWithFrame:CGRectZero];
  self.titleLabel.text = title;
  return self;
}

#pragma mark - private methods
- (void)updateTitleRect {
  if (self.frame.size.width == 0 || self.frame.size.height == 0) {
    self.titleLabel.hidden = YES;
    return;
  }
  self.titleLabel.hidden = NO;
  NSDictionary *dic = @{NSFontAttributeName: REGULAR_FONT};
  CGSize titleSize = [self.titleLabel.text sizeWithAttributes:dic];
  self.titleLabel.frame = CGRectMake((self.bounds.size.width - titleSize.width) / 2.0,
                                     (self.bounds.size.height - titleSize.height), titleSize.width, titleSize.height);
}

- (void)updateTitleWithKey:(NSString *)key Language:(LanguageType)languageType {
  self.titleLabel.text = [NSString localizedStringWithKey:key languageType:languageType];
}

#pragma mark - getters and setters
- (UILabel *)titleLabel {
	if (_titleLabel == nil) {
		_titleLabel = [[UILabel alloc] init];
		_titleLabel.font = REGULAR_FONT;
		_titleLabel.textColor = [UIColor blackColor];
	}
	return _titleLabel;
}

@end
