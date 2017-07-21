//
//  ScheduleCalendarViewManager.m
//  ZSKQ
//
//  Created by Andy Wu on 6/26/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "ScheduleCalendarViewManager.h"
#import "ScheduleCalendarView.h"
#import "FSCalendar.h"

@interface ScheduleCalendarViewManager ()

@end

@implementation ScheduleCalendarViewManager

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue {
	return dispatch_get_main_queue();
}

#pragma mark - Accessories
- (UIView *)view {
	ScheduleCalendarView *calendarView = [[ScheduleCalendarView alloc] init];
	[calendarView.calendar selectDate:[[NSDate alloc] init]];
	return calendarView;
}

RCT_EXPORT_VIEW_PROPERTY(scheduleData, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(selectedMonth, NSString)
RCT_EXPORT_VIEW_PROPERTY(scheduledTextColor, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(scheduledTextSize, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(offScheduledTextColor, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(noScheduledTextColor, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(selectedBackgroundColor, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(todayBorderColor, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(todayTextColor, NSInteger)

@end
