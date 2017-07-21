//
//  ScheduleCalendarView.m
//  ZSKQ
//
//  Created by Andy Wu on 6/26/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "ScheduleCalendarView.h"
#import "CalendarColors.h"
#import "EventSender.h"
#import "WPCalendarCell.h"
#import "RCTConvert.h"

#define CALENDAR_RECT_WILL_CHANGE @"calendar_Rect_Will_Change"
#define DID_SELECT_DATE @"did_select_date"
#define MONTH_DID_CHANGE @"month_did_change"

static NSString *cellIdentifier = @"cell";
@interface ScheduleCalendarView () <FSCalendarDataSource, FSCalendarDelegate, FSCalendarDelegateAppearance>

/// NSDateFormatter instance
@property (strong, nonatomic) NSDateFormatter *dateFormatter;

/// UIPanGestureRecognizer instance
@property (strong, nonatomic) UIPanGestureRecognizer *scopeGesture;

/// NSDate instance
@property (nonatomic, strong) NSDate *currentPage;

/// NSCalendar instance
@property (nonatomic, strong) NSCalendar *gregorian;

@end

@implementation ScheduleCalendarView

#pragma mark - Object Life Cycle
- (instancetype)initWithFrame:(CGRect)frame
{
	self = [super initWithFrame:frame];
	if (self) {
		[self.calendar registerClass:[WPCalendarCell class] forCellReuseIdentifier:cellIdentifier];
		[self addSubview:self.calendar];
	}
	return self;
}

#pragma mark - FSCalendarDataSource
- (FSCalendarCell *)calendar:(FSCalendar *)calendar cellForDate:(NSDate *)date atMonthPosition:(FSCalendarMonthPosition)position {
	WPCalendarCell *cell = [calendar dequeueReusableCellWithIdentifier:cellIdentifier forDate:date atMonthPosition:position];
	cell.titleLabel.textColor = [UIColor redColor];
	return cell;
}

#pragma mark - FSCalendarDelegate
- (void)calendar:(FSCalendar *)calendar boundingRectWillChange:(CGRect)bounds animated:(BOOL)animated {
	calendar.frame = (CGRect){calendar.frame.origin, bounds.size};
	[self.calendar setNeedsLayout];
	[[EventSender sharedInstance] sendEventWithName:CALENDAR_RECT_WILL_CHANGE body:@{@"height": @(bounds.size.height)}];
//	if (![self.currentPage isEqualToDate:calendar.currentPage]) {
//		self.currentPage = calendar.currentPage;
//		NSLog(@"current page did change --- %@", self.currentPage);
//		NSInteger year = [self.gregorian component:NSCalendarUnitYear fromDate:self.currentPage];
//		NSInteger month = [self.gregorian component:NSCalendarUnitMonth fromDate:self.currentPage];
//		NSString *dateString = [NSString stringWithFormat:@"%ld-%ld", year, month];
//		[[EventSender sharedInstance] sendEventWithName:MONTH_DID_CHANGE body:@{@"month": dateString}];
//	}
}

- (void)calendar:(FSCalendar *)calendar didSelectDate:(NSDate *)date atMonthPosition:(FSCalendarMonthPosition)monthPosition {
	NSString *selectedDateString = [self.dateFormatter stringFromDate:date];
	[[EventSender sharedInstance] sendEventWithName:DID_SELECT_DATE body:@{@"date": selectedDateString}];
}

- (void)calendar:(FSCalendar *)calendar willDisplayCell:(FSCalendarCell *)cell forDate:(NSDate *)date atMonthPosition:(FSCalendarMonthPosition)monthPosition {
}

#pragma mark - FSCalendarDelegateAppearance
- (UIColor *)calendar:(FSCalendar *)calendar appearance:(FSCalendarAppearance *)appearance titleDefaultColorForDate:(NSDate *)date {
	NSString *dateString = [self.dateFormatter stringFromDate:date];
	if (self.scheduleData) {
		NSDictionary *dic = [self.scheduleData valueForKey:dateString];
		if (dic) {
			NSString *hours = dic[@"hours"];
			NSInteger h = hours.integerValue;
			if (h > 0 && self.scheduledTextColor) {
				return UIColorFromRGB(self.scheduledTextColor);
			} else if (h == 0 && self.offScheduledTextColor) {
				return UIColorFromRGB(self.offScheduledTextColor);
			}
		}
	}
	if (self.offScheduledTextColor) {
		return UIColorFromRGB(self.noScheduledTextColor);
	} else {
		return DEFAULT_COLOR;
	}
}

- (UIColor *)calendar:(FSCalendar *)calendar appearance:(FSCalendarAppearance *)appearance fillDefaultColorForDate:(NSDate *)date {
	NSString *dateString = [self.dateFormatter stringFromDate:date];
	if (self.scheduleData) {
		NSDictionary *dic = [self.scheduleData valueForKey:dateString];
		if (dic) {
			NSString *hasEvent = dic[@"hasEvent"];
			BOOL h = hasEvent.boolValue;
			if (h) {
				return ORANGE_COLOR;
			}
		}
	}
	return [UIColor whiteColor];
}

#pragma mark - Accessories
- (WPCalendar *)calendar {
	if (_calendar == nil) {
		_calendar = [[WPCalendar alloc] initWithFrame:CALENDAR_RECT];
		_calendar.scope = FSCalendarScopeMonth;
		_calendar.allowsMultipleSelection = false;
		_calendar.firstWeekday = 1;
		_calendar.appearance.selectionColor = GREEN_COLOR;
		_calendar.appearance.todaySelectionColor = GREEN_COLOR;
		_calendar.appearance.borderRadius = 0.3;
		_calendar.placeholderType = FSCalendarPlaceholderTypeNone;
		_calendar.headerHeight = 0;
		_calendar.appearance.titleFont = [UIFont systemFontOfSize:14.0];
		_calendar.clipsToBounds = YES;
		_calendar.appearance.separators = FSCalendarSeparatorNone;
		_calendar.calendarWeekdayView.backgroundColor = [UIColor colorWithRed:245/255.0 green:245/255.0 blue:245/255.0 alpha:1.0];
		_calendar.backgroundColor = [UIColor whiteColor];
		_calendar.appearance.caseOptions = FSCalendarCaseOptionsWeekdayUsesSingleUpperCase;
		_calendar.appearance.todayColor = [UIColor whiteColor];
		_calendar.appearance.titleTodayColor = DEFAULT_COLOR;
		_calendar.scrollEnabled = false;
//		[_calendar addGestureRecognizer:self.scopeGesture];
		_calendar.dataSource = self;
		_calendar.delegate = self;
		_calendar.weekdayHeight = 0;
		_calendar.rowHeight = 42;
		_calendar.pagingEnabled = false;
	}
	return _calendar;
}

- (NSDateFormatter *)dateFormatter {
	if (_dateFormatter == nil) {
		_dateFormatter = [[NSDateFormatter alloc] init];
		_dateFormatter.dateFormat = @"YYYY-MM-dd";
	}
	return _dateFormatter;
}

- (UIPanGestureRecognizer *)scopeGesture {
	if (_scopeGesture == nil) {
		_scopeGesture = [[UIPanGestureRecognizer alloc] initWithTarget:self.calendar action:@selector(handleScopeGesture:)];
	}
	return _scopeGesture;
}

- (NSCalendar *)gregorian {
	if (_gregorian == nil) {
		_gregorian = [NSCalendar calendarWithIdentifier:NSCalendarIdentifierGregorian];
	}
	return _gregorian;
}

- (void)setScheduleData:(NSDictionary *)scheduleData {
	if (scheduleData != nil && scheduleData.count > 0) {
		_scheduleData = scheduleData;
		[self.calendar reloadData];
	}
}

- (void)setScheduledTextSize:(CGFloat)scheduledTextSize {
	if (scheduledTextSize > 0) {
		self.calendar.appearance.titleFont = [UIFont systemFontOfSize:scheduledTextSize];
	}
}

- (void)setSelectedBackgroundColor:(NSInteger)selectedBackgroundColor {
	self.calendar.appearance.selectionColor = UIColorFromRGB(selectedBackgroundColor);
	self.calendar.appearance.todaySelectionColor = UIColorFromRGB(selectedBackgroundColor);
}

- (void)setTodayTextColor:(NSInteger)todayTextColor {
	self.calendar.appearance.titleTodayColor = UIColorFromRGB(todayTextColor);
}

- (void)setScheduledTextColor:(NSInteger)scheduledTextColor {
	_scheduledTextColor = scheduledTextColor;
}

- (void)setOffScheduledTextColor:(NSInteger)offScheduledTextColor {
	_offScheduledTextColor = offScheduledTextColor;
}

- (void)setNoScheduledTextColor:(NSInteger)noScheduledTextColor {
	_noScheduledTextColor = noScheduledTextColor;
}

- (void)setSelectedMonth:(NSString *)selectedMonth {
	if (selectedMonth) {
		NSString *dateString = [NSString stringWithFormat:@"%@-01", selectedMonth];
		NSDate *date = [self.dateFormatter dateFromString:dateString];
		[self.calendar setCurrentPage:date animated:YES];
	}
}

@end
