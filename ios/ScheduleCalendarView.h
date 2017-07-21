//
//  ScheduleCalendarView.h
//  ZSKQ
//
//  Created by Andy Wu on 6/26/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "WPCalendar.h"

#define SCREEN_WIDTH [UIScreen mainScreen].bounds.size.width
#define CALENDAR_RECT CGRectMake(0, 0, SCREEN_WIDTH, 254)

@interface ScheduleCalendarView : UIView

/// FSCalendar instance
@property (strong, nonatomic) WPCalendar *calendar;

/// Schedule data
@property (copy, nonatomic) NSDictionary *scheduleData;

/// 选中的月份
@property (nonatomic, copy) NSString *selectedMonth;

/// 排班的文字颜色 hours > 0
@property (nonatomic, assign) NSInteger scheduledTextColor;

/// 排班的文字大小
@property (nonatomic, assign) CGFloat scheduledTextSize;

/// off班的文字颜色 hours == 0
@property (nonatomic, assign) NSInteger offScheduledTextColor;

/// 未排班的文字颜色
@property (nonatomic, assign) NSInteger noScheduledTextColor;

/// 选中的日期的背景颜色
@property (nonatomic, assign) NSInteger selectedBackgroundColor;

/// 今天的边框样式
@property (nonatomic, assign) NSInteger todayBorderColor;

/// 今天的文字颜色
@property (nonatomic, assign) NSInteger todayTextColor;

@end
