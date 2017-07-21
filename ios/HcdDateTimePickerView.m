/// 确定按钮 Tag 值
#define kOKBtnTag 101
/// 取消按钮 Tag 值
#define kCancleBtnTag 100

#import "HcdDateTimePickerView.h"
#import "UIColor+HcdCustom.h"
#import "HcdUnitView.h"
#import "NSString+LocalizedString.h"
#import "NSDate+WPCustom.h"
#import "CommonColor.h"
#import "NSDate+WPCustom.h"
#import "HcdConstant.h"

/// 日期选择器高度
CGFloat const kDatePickerHeight = 266.0;

/// 顶部标题栏高度
CGFloat const kTopViewHeight = 36.0;

/// 年月日时分秒单位视图高度
CGFloat const unitViewHeight = 30.0;

/// 滚轮Y值
CGFloat const kCycleValueY = (kTopViewHeight + unitViewHeight + 10.0);

/// 滚轮高度
CGFloat kCycleHeight = 180.0;

@interface HcdDateTimePickerView()<UIGestureRecognizerDelegate>
{
  /// 年份滚动视图
  MXSCycleScrollView *yearScrollView;
	/// 月份滚动视图
  MXSCycleScrollView *monthScrollView;
	
	/// 日滚动视图
  MXSCycleScrollView *dayScrollView;
	
	/// 时滚动视图
  MXSCycleScrollView *hourScrollView;
	
	/// 分滚动视图
  MXSCycleScrollView *minuteScrollView;
	
	/// 秒滚动视图
  MXSCycleScrollView  *secondScrollView;

  NSString *dateTimeStr;
}

/// 定时播放显示视图
@property (nonatomic, strong) UIView *timeBroadcastView;

/// 顶部按钮 + 标题视图
@property (nonatomic, strong) UIView *topView;

/// 当前年
@property (nonatomic,assign) NSInteger curYear;

/// 当前月
@property (nonatomic,assign) NSInteger curMonth;

/// 当前日
@property (nonatomic,assign) NSInteger curDay;

/// 当前小时
@property (nonatomic,assign) NSInteger curHour;

/// 当前分
@property (nonatomic,assign) NSInteger curMin;

/// 当前秒
@property (nonatomic,assign) NSInteger curSecond;

/// 显示日期时间单位的视图
@property (nonatomic, strong) HcdUnitView *unitView;

/// 确认按钮
@property (nonatomic, strong) UIButton *okBtn;

/// 取消按钮
@property (nonatomic, strong) UIButton *cancleBtn;

/// 顶部标题文本视图
@property (nonatomic, strong) UILabel *titleLbl;

/// picker 选中日期高亮背景视图
@property (nonatomic, strong) UIView *middleSepView;

@end

@implementation HcdDateTimePickerView

#pragma mark - init methods
- (instancetype)initWithFrame:(CGRect)frame {
	self = [super initWithFrame:frame];
	if (self) {
		self.frame = CGRectMake(0, 0, kScreen_Width, kScreen_Height);
		self.backgroundColor = [UIColor clearColor];
		[self addSubview:self.timeBroadcastView];
	}
	return self;
}

- (instancetype)initWithDatePickerMode:(DatePickerMode)datePickerMode defaultDateTime:(NSDate *)dateTime
{
  self = [self initWithFrame:CGRectZero];
  if (self) {
    self.defaultDate = dateTime;
    if (!self.defaultDate) {
        self.defaultDate = [NSDate date];
    }
    self.datePickerMode = datePickerMode;

    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
    dateTimeStr = [dateFormatter stringFromDate:self.defaultDate];
    
    [self updateDateMode];
    [self reloadTopView];
  }
  return self;
}

#pragma mark - mxccyclescrollview databasesource
- (NSInteger)numberOfPages:(MXSCycleScrollView *)scrollView {
  if (scrollView == yearScrollView) {
    if (self.datePickerMode == DatePickerDateMode || self.datePickerMode == DatePickerDateTimeMode || self.datePickerMode == DatePickerDateHourMinuteMode || self.datePickerMode == DatePickerYearMonthMode) {
      return self.maxYear - self.minYear + 1;
    }
    return 299;
  } else if (scrollView == monthScrollView) {
    return 12;
  } else if (scrollView == dayScrollView) {
    if (self.datePickerMode == DatePickerMonthDayMode) {
      return 29;
    }
    
    if (self.curMonth == 1 || self.curMonth == 3 || self.curMonth == 5 ||
        self.curMonth == 7 || self.curMonth == 8 || self.curMonth == 10 ||
        self.curMonth == 12) {
      return 31;
    } else if (self.curMonth == 2) {
      if ([NSDate isLeapYear:self.curYear]) {
        return 29;
      } else {
        return 28;
      }
    } else {
      return 30;
    }
  } else if (scrollView == hourScrollView) {
    return 24;
  } else if (scrollView == minuteScrollView) {
//    return 60;
    return 12;
	}
  return 60;
}

- (UIView *)pageAtIndex:(NSInteger)index andScrollView:(MXSCycleScrollView *)scrollView {
  UILabel *l = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, scrollView.bounds.size.width, scrollView.bounds.size.height / 5)];
  l.tag = index + 1;
  
  if (scrollView == yearScrollView) {
		if (self.datePickerMode == DatePickerDateHourMinuteMode) {
			l.text = [NSString stringWithFormat:@"  %ld", (long)(self.minYear + index)];
		} else {
			l.text = [NSString stringWithFormat:@"%ld", (long)(self.minYear + index)];
		}
  } else if (scrollView == monthScrollView) {
    l.text = [NSString stringWithFormat:@"%ld", (long)(1 + index)];
  } else if (scrollView == dayScrollView) {
		NSInteger day = 1 + index;
		NSString *dateStr = [NSString stringWithFormat:@"%04ld%02ld%02ld", self.curYear, self.curMonth, day];
		NSString *week = [NSDate fromDateToWeek:dateStr languageType:self.language];
    l.text = [NSString stringWithFormat:@"%ld %@", (long)(1 + index), week];
  } else if (scrollView == hourScrollView) {
    if (index < 10) {
      l.text = [NSString stringWithFormat:@"0%ld", (long)index];
    } else {
      l.text = [NSString stringWithFormat:@"%ld", (long)index];
    }
  } else if (scrollView == minuteScrollView) {
    NSInteger value = index * 5;
    if (value < 10) {
      l.text = [NSString stringWithFormat:@"  0%ld", (long)value];
    } else {
      l.text = [NSString stringWithFormat:@"  %ld", (long)value];
    }
	}
	else {
    if (index < 10) {
      l.text = [NSString stringWithFormat:@"0%ld", (long)index];
    } else {
      l.text = [NSString stringWithFormat:@"%ld", (long)index];
    }
  }
	
	l.font = REGULAR_FONT;
  [l setTextColor:[UIColor colorWithRed:0 / 255.0 green:0 / 255.0 blue:0 / 255.0 alpha:0.4]];
  l.textAlignment = NSTextAlignmentCenter;
  l.backgroundColor = [UIColor clearColor];
  return l;
}

#pragma mark - mxccyclescrollview delegate
/// 滚动时上下标签显示(当前时间和是否为有效时间)
- (void)scrollviewDidChangeNumber
{
  UILabel *yearLabel = [[(UILabel*)[[yearScrollView subviews] objectAtIndex:0] subviews] objectAtIndex:3];
  UILabel *monthLabel = [[(UILabel*)[[monthScrollView subviews] objectAtIndex:0] subviews] objectAtIndex:3];
  UILabel *dayLabel = [[(UILabel*)[[dayScrollView subviews] objectAtIndex:0] subviews] objectAtIndex:3];
  UILabel *hourLabel = [[(UILabel*)[[hourScrollView subviews] objectAtIndex:0] subviews] objectAtIndex:3];
  UILabel *minuteLabel = [[(UILabel*)[[minuteScrollView subviews] objectAtIndex:0] subviews] objectAtIndex:3];
  UILabel *secondLabel = [[(UILabel*)[[secondScrollView subviews] objectAtIndex:0] subviews] objectAtIndex:3];
  
  NSInteger month = monthLabel.tag;
  NSInteger year = yearLabel.tag + self.minYear - 1;
  if (month != self.curMonth) {
    self.curMonth = month;
		
		NSInteger dayCount = [self numberOfPages:dayScrollView];
		if (self.curDay > dayCount) {
			self.curDay = 1;
		}
		
		[dayScrollView setCurrentSelectPage:self.curDay-3];
		[dayScrollView reloadData];
    [self setAfterScrollShowView:dayScrollView andCurrentPage:1];
  }
	
  if (year != self.curYear) {
    self.curYear = year;
    [dayScrollView reloadData];
    [dayScrollView setCurrentSelectPage:(self.curDay - 3)];
    [self setAfterScrollShowView:dayScrollView andCurrentPage:1];
  }
  
  self.curMonth = monthLabel.tag;
  self.curDay = dayLabel.tag;
  self.curHour = hourLabel.tag - 1;
  self.curMin = (minuteLabel.tag - 1) * 5;
  self.curSecond = secondLabel.tag - 1;
  
  NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
  [dateFormatter setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
  NSString *selectTimeString = [NSString stringWithFormat:@"%ld-%02ld-%02ld %02ld:%02ld:%02ld",(long)self.curYear, (long)self.curMonth, (long)self.curDay, (long)self.curHour, (long)self.curMin, (long)self.curSecond];
  [self selectedDateString];
  NSDate *selectDate = [dateFormatter dateFromString:selectTimeString];
  NSDate *nowDate = self.defaultDate;
  NSString *nowString = [dateFormatter stringFromDate:nowDate];
  NSDate *nowStrDate = [dateFormatter dateFromString:nowString];
	
	// 选择的时间与当前系统时间做比较
  if (NSOrderedAscending == [selectDate compare:nowStrDate]) {
    [self.okBtn setEnabled:YES];
  } else {
    [self.okBtn setEnabled:YES];
  }
}

#pragma mark - Event Response
- (void)showHcdDateTimePicker
{
  typeof(self) __weak weakSelf = self;
  [UIView animateWithDuration:0.3f delay:0 usingSpringWithDamping:0.8f initialSpringVelocity:0 options:UIViewAnimationOptionLayoutSubviews animations:^{
    HcdDateTimePickerView *innerSelf = weakSelf;
    [innerSelf setBackgroundColor:[UIColor colorWithRed:0 green:0 blue:0 alpha:0.5f]];
  } completion:^(BOOL finished) {
    HcdDateTimePickerView *innerSelf = weakSelf;
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:innerSelf action:@selector(dismiss:)];
    tap.delegate = self;
    [innerSelf addGestureRecognizer:tap];
    [innerSelf.timeBroadcastView setFrame:CGRectMake(0, kScreen_Height - kDatePickerHeight, kScreen_Width, kDatePickerHeight)];
  }];
}

-(void)dismissBlock:(DatePickerCompleteAnimationBlock)block {
  typeof(self) __weak weak = self;
  
  [UIView animateWithDuration:0.4f delay:0 usingSpringWithDamping:0.8f initialSpringVelocity:0 options:UIViewAnimationOptionLayoutSubviews animations:^{
    
    [weak setBackgroundColor:[UIColor colorWithRed:0 green:0 blue:0 alpha:0.0f]];
    [weak.timeBroadcastView setFrame:CGRectMake(0, kScreen_Height, kScreen_Width, kDatePickerHeight)];
    
  } completion:^(BOOL finished) {
    HcdDateTimePickerView *innerSelf = weak;
    block(finished);
    [innerSelf removeFromSuperview];
    innerSelf.clickedCancelButton();
  }];
  
}

-(void)dismiss:(UITapGestureRecognizer *)tap{
  if( CGRectContainsPoint(self.frame, [tap locationInView:self.timeBroadcastView])) {
    NSLog(@"tap");
  } else {
    [self dismissBlock:^(BOOL Complete) {
    }];
  }
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldReceiveTouch:(UITouch *)touch {
  if (touch.view != self) {
    return NO;
  }
  return YES;
}

- (void)selectedButtons:(UIButton *)btns {
  
  typeof(self) __weak weak = self;
  [self dismissBlock:^(BOOL Complete) {
    HcdDateTimePickerView *innerSelf = weak;
    if (btns.tag == kOKBtnTag) {
      
      switch (self.datePickerMode) {
        case DatePickerDateMode:
          dateTimeStr = [NSString stringWithFormat:@"%ld-%02ld-%02ld",(long)self.curYear,(long)self.curMonth,(long)self.curDay];
          break;
        case DatePickerTimeMode:
          dateTimeStr = [NSString stringWithFormat:@"%02ld:%02ld:%02ld",(long)self.curHour,(long)self.curMin,(long)self.curSecond];
          break;
        case DatePickerDateTimeMode:
          dateTimeStr = [NSString stringWithFormat:@"%ld-%02ld-%02ld %02ld:%02ld:%02ld",(long)self.curYear,(long)self.curMonth,(long)self.curDay,(long)self.curHour,(long)self.curMin,(long)self.curSecond];
          break;
        case DatePickerMonthDayMode:
          dateTimeStr = [NSString stringWithFormat:@"%02ld-%02ld",(long)self.curMonth,(long)self.curDay];
          break;
        case DatePickerYearMonthMode:
          dateTimeStr = [NSString stringWithFormat:@"%02ld-%02ld",(long)self.curYear,(long)self.curMonth];
          break;
        case DatePickerHourMinuteMode:
          dateTimeStr = [NSString stringWithFormat:@"%02ld:%02ld",(long)self.curHour,(long)self.curMin];
          break;
        case DatePickerDateHourMinuteMode:
          dateTimeStr = [NSString stringWithFormat:@"%ld-%02ld-%02ld %02ld:%02ld",(long)self.curYear,(long)self.curMonth,(long)self.curDay,(long)self.curHour,(long)self.curMin];
          break;
        default:
          dateTimeStr = [NSString stringWithFormat:@"%ld-%02ld-%02ld %02ld:%02ld:%02ld",(long)self.curYear,(long)self.curMonth,(long)self.curDay,(long)self.curHour,(long)self.curMin,(long)self.curSecond];
          break;
      }
      innerSelf.clickedOkBtn(dateTimeStr);
    } else {
      innerSelf.clickedCancelButton();
    }
  }];
}

- (void)onPressInOkBtn:(UIButton *)button {
  [self.okBtn setTitleColor:kButtonPressColor forState:UIControlStateNormal];
}

- (void)onPressOutOkBtn:(UIButton *)button {
  [self.okBtn setTitleColor:kButtonNormalColor forState:UIControlStateNormal];
}

- (void)onPressInCancelBtn:(UIButton *)button {
  [self.cancleBtn setTitleColor:kButtonPressColor forState:UIControlStateNormal];
}

- (void)onPressOutCancelBtn:(UIButton *)button {
  [self.cancleBtn setTitleColor:kButtonNormalColor forState:UIControlStateNormal];
}

#pragma mark - Private Methods
- (void)updateDateMode {
  [self removeOldView];
  [self.unitView updateFrameWithDatePickerMode:self.datePickerMode];

  if (self.datePickerMode == DatePickerDateMode) {
    [self setYearScrollView];
    [self setMonthScrollView];
    [self setDayScrollView];
  } else if (self.datePickerMode == DatePickerTimeMode) {
    [self setHourScrollView];
    [self setMinuteScrollView];
    [self setSecondScrollView];
  } else if (self.datePickerMode == DatePickerDateTimeMode) {
    [self setYearScrollView];
    [self setMonthScrollView];
    [self setDayScrollView];
    [self setHourScrollView];
    [self setMinuteScrollView];
    [self setSecondScrollView];
  } else if (self.datePickerMode == DatePickerYearMonthMode) {
    [self setYearScrollView];
    [self setMonthScrollView];
  } else if (self.datePickerMode == DatePickerMonthDayMode) {
    [self setMonthScrollView];
    [self setDayScrollView];
  } else if (self.datePickerMode == DatePickerHourMinuteMode) {
    [self setHourScrollView];
    [self setMinuteScrollView];
  } else if (self.datePickerMode == DatePickerDateHourMinuteMode) {
    [self setYearScrollView];
    [self setMonthScrollView];
    [self setDayScrollView];
    [self setHourScrollView];
    [self setMinuteScrollView];
	}
}

- (void)removeOldView {
  if (yearScrollView) {
    [yearScrollView removeFromSuperview];
  }
  if (monthScrollView) {
    [monthScrollView removeFromSuperview];
  }
  if (dayScrollView) {
    [dayScrollView removeFromSuperview];
  }
  if (hourScrollView) {
    [hourScrollView removeFromSuperview];
  }
  if (minuteScrollView) {
    [minuteScrollView removeFromSuperview];
  }
  if (secondScrollView) {
    [secondScrollView removeFromSuperview];
  }
}

- (void)updateYearScrollView {
  [yearScrollView setCurrentSelectPage:(self.curYear - (self.minYear + 2))];
	[yearScrollView reloadData];
  [self setAfterScrollShowView:yearScrollView andCurrentPage:1];
}

/// 更新当前日期
- (void)updateCurrentDay {
  self.curDay = [self setNowTimeShow:2];
  [dayScrollView setCurrentSelectPage:(self.curDay - 3)];
}

- (void)updateCurrentHour {
  self.curHour = [self setNowTimeShow:3];
  [hourScrollView setCurrentSelectPage:(self.curHour - 2)];
}

- (void)updateCurrentMin {
  self.curMin = [self setNowTimeShow:4];
  [minuteScrollView setCurrentSelectPage:(self.curMin / 5 - 2)];
}

- (void)updateCurrentSecond {
  self.curSecond = [self setNowTimeShow:5];
  [secondScrollView setCurrentSelectPage:(self.curSecond - 2)];
}

- (void)selectedDateString {
  switch (self.datePickerMode) {
    case DatePickerDateMode:
      dateTimeStr = [NSString stringWithFormat:@"%ld-%ld-%ld",(long)self.curYear,(long)self.curMonth,(long)self.curDay];
      break;
    case DatePickerTimeMode:
      dateTimeStr = [NSString stringWithFormat:@"%02ld:%02ld:%02ld",(long)self.curHour,(long)self.curMin,(long)self.curSecond];
      break;
    case DatePickerDateTimeMode:
      dateTimeStr = [NSString stringWithFormat:@"%ld-%ld-%ld %02ld:%02ld:%02ld",(long)self.curYear,(long)self.curMonth,(long)self.curDay,(long)self.curHour,(long)self.curMin,(long)self.curSecond];
      break;
    case DatePickerMonthDayMode:
      dateTimeStr = [NSString stringWithFormat:@"%ld-%ld",(long)self.curMonth,(long)self.curDay];
      break;
    case DatePickerYearMonthMode:
      dateTimeStr = [NSString stringWithFormat:@"%ld-%ld",(long)self.curYear,(long)self.curMonth];
      break;
    case DatePickerHourMinuteMode:
      dateTimeStr = [NSString stringWithFormat:@"%02ld:%02ld",(long)self.curHour,(long)self.curMin];
      break;
    case DatePickerDateHourMinuteMode:
      dateTimeStr = [NSString stringWithFormat:@"%ld-%ld-%ld %02ld:%02ld",(long)self.curYear,(long)self.curMonth,(long)self.curDay,(long)self.curHour,(long)self.curMin];
      break;
    default:
      dateTimeStr = [NSString stringWithFormat:@"%ld-%ld-%ld %02ld:%02ld:%02ld",(long)self.curYear,(long)self.curMonth,(long)self.curDay,(long)self.curHour,(long)self.curMin,(long)self.curSecond];
      break;
  }
}

/// 设置现在时间
- (NSInteger)setNowTimeShow:(NSInteger)timeType {
  NSDate *now = self.defaultDate;
  NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
  [dateFormatter setDateFormat:@"yyyyMMddHHmmss"];
  NSString *dateString = [dateFormatter stringFromDate:now];
  switch (timeType) {
    case 0:
    {
      NSRange range = NSMakeRange(0, 4);
      NSString *yearString = [dateString substringWithRange:range];
      return yearString.integerValue;
    }
      break;
    case 1:
    {
      NSRange range = NSMakeRange(4, 2);
      NSString *yearString = [dateString substringWithRange:range];
      return yearString.integerValue;
    }
      break;
    case 2:
    {
      NSRange range = NSMakeRange(6, 2);
      NSString *yearString = [dateString substringWithRange:range];
      return yearString.integerValue;
    }
      break;
    case 3:
    {
      NSRange range = NSMakeRange(8, 2);
      NSString *yearString = [dateString substringWithRange:range];
      return yearString.integerValue;
    }
      break;
    case 4:
    {
      NSRange range = NSMakeRange(10, 2);
      NSString *yearString = [dateString substringWithRange:range];
      return yearString.integerValue;
    }
      break;
    case 5:
    {
      NSRange range = NSMakeRange(12, 2);
      NSString *yearString = [dateString substringWithRange:range];
      return yearString.integerValue;
    }
      break;
    default:
      break;
  }
  return 0;
}

/// 选择设置的播报时间
- (void)selectSetBroadcastTime
{
  UILabel *yearLabel = [[(UILabel*)[[yearScrollView subviews] objectAtIndex:0] subviews] objectAtIndex:3];
  UILabel *monthLabel = [[(UILabel*)[[monthScrollView subviews] objectAtIndex:0] subviews] objectAtIndex:3];
  UILabel *dayLabel = [[(UILabel*)[[dayScrollView subviews] objectAtIndex:0] subviews] objectAtIndex:3];
  UILabel *hourLabel = [[(UILabel*)[[hourScrollView subviews] objectAtIndex:0] subviews] objectAtIndex:3];
  UILabel *minuteLabel = [[(UILabel*)[[minuteScrollView subviews] objectAtIndex:0] subviews] objectAtIndex:3];
  UILabel *secondLabel = [[(UILabel*)[[secondScrollView subviews] objectAtIndex:0] subviews] objectAtIndex:3];
  
  NSInteger yearInt = yearLabel.tag + _minYear - 1;
  NSInteger monthInt = monthLabel.tag;
  NSInteger dayInt = dayLabel.tag;
  NSInteger hourInt = hourLabel.tag - 1;
  NSInteger minuteInt = minuteLabel.tag - 1;
  NSInteger secondInt = secondLabel.tag - 1;
  NSString *taskDateString = [NSString stringWithFormat:@"%ld%02ld%02ld%02ld%02ld%02ld",(long)yearInt,(long)monthInt,(long)dayInt,(long)hourInt,(long)minuteInt,(long)secondInt];
  NSLog(@"Now----%@",taskDateString);
}

- (void)setAfterScrollShowView:(MXSCycleScrollView *)scrollview  andCurrentPage:(NSInteger)pageNumber
{
  UILabel *oneLabel = [[(UILabel *)[[scrollview subviews] objectAtIndex:0] subviews] objectAtIndex:pageNumber];
	oneLabel.font = REGULAR_FONT;
  [oneLabel setTextColor:[UIColor colorWithRed:0 / 255.0 green:0 / 255.0 blue:0 / 255.0 alpha:0.4]];
	
  UILabel *twoLabel = [[(UILabel *)[[scrollview subviews] objectAtIndex:0] subviews] objectAtIndex:pageNumber + 1];
	twoLabel.font = REGULAR_FONT;
  [twoLabel setTextColor:[UIColor colorWithRed:0 / 255.0 green:0 / 255.0 blue:0 / 255.0 alpha:0.7]];
  
  UILabel *currentLabel = [[(UILabel *)[[scrollview subviews] objectAtIndex:0] subviews] objectAtIndex:pageNumber + 2];
	currentLabel.font = BOLD_FONT;
  [currentLabel setTextColor:[UIColor blackColor]];
  
  UILabel *threeLabel = [[(UILabel *)[[scrollview subviews] objectAtIndex:0] subviews] objectAtIndex:pageNumber + 3];
	threeLabel.font = REGULAR_FONT;
  [threeLabel setTextColor:[UIColor colorWithRed:0 / 255.0 green:0 / 255.0 blue:0 / 255.0 alpha:0.7]];

  UILabel *fourLabel = [[(UILabel *)[[scrollview subviews] objectAtIndex:0] subviews] objectAtIndex:pageNumber + 4];
	fourLabel.font = REGULAR_FONT;
  [fourLabel setTextColor:[UIColor colorWithRed:0 / 255.0 green:0 / 255.0 blue:0 / 255.0 alpha:0.4]];
}

#pragma mark - getters and setters
- (UIView *)timeBroadcastView {
	if (_timeBroadcastView == nil) {
		_timeBroadcastView = [[UIView alloc] initWithFrame:CGRectMake(0, kScreen_Height, kScreen_Width, kDatePickerHeight)];
		_timeBroadcastView.backgroundColor = [UIColor colorWithRed:238 / 255.0 green:238 / 255.0 blue:238 / 255.0 alpha:1.0];
    [_timeBroadcastView addSubview:self.middleSepView];
    [_timeBroadcastView addSubview:self.unitView];
    [_timeBroadcastView addSubview:self.topView];
	}
	return _timeBroadcastView;
}

- (void)setMinYear:(NSInteger)minYear {
	_minYear = minYear;
	[self updateYearScrollView];
}

- (void)setMaxYear:(NSInteger)maxYear {
  _maxYear = maxYear;
  [self updateYearScrollView];
}

- (void)setTopViewColor:(UIColor *)topViewColor {
  _topViewColor = topViewColor;
  if (self.topView) {
    self.topView.backgroundColor = topViewColor;
  }
}

- (void)setButtonTitleColor:(UIColor *)buttonTitleColor {
  _buttonTitleColor = buttonTitleColor;
  if (self.okBtn) {
    [self.okBtn setTitleColor:_buttonTitleColor forState:UIControlStateNormal];
  }
  if (self.cancleBtn) {
    [self.cancleBtn setTitleColor:_buttonTitleColor forState:UIControlStateNormal];
  }
}

- (void)setTitleColor:(UIColor *)titleColor {
  _titleColor = titleColor;
  self.titleLbl.textColor = _titleColor;
}

- (void)setTitle:(NSString *)title {
  _title = title;
  self.titleLbl.text = title;
}

- (void)setDatePickerMode:(DatePickerMode)datePickerMode {
  _datePickerMode = datePickerMode;
  [self updateDateMode];
}

- (void)setDefaultDate:(NSDate *)defaultDate {
  _defaultDate = defaultDate;
  [self updateDateMode];
}

- (void)reloadTopView {
  [self.unitView updateTitleLanguage:self.language];
  [self.cancleBtn setTitle:[NSString localizedStringWithKey:@"取消" languageType:self.language] forState:UIControlStateNormal];
  [self.okBtn setTitle:[NSString localizedStringWithKey:@"确定" languageType:self.language] forState:UIControlStateNormal];
  [self.cancleBtn sizeToFit];
  [self.okBtn sizeToFit];
  if (self.cancleBtn.frame.size.height < kTopViewHeight) {
    self.cancleBtn.frame = CGRectMake(0, 0, self.cancleBtn.frame.size.width, kTopViewHeight);
  }
  if (self.okBtn.frame.size.height < kTopViewHeight) {
    self.okBtn.frame = CGRectMake(self.topView.frame.size.width - self.okBtn.frame.size.width, 0, self.okBtn.frame.size.width, kTopViewHeight);
  }
}

- (void)setYearScrollView {
  switch (self.datePickerMode) {
    case DatePickerDateTimeMode:
      yearScrollView = [[MXSCycleScrollView alloc] initWithFrame:CGRectMake(0, kCycleValueY, kScreen_Width * 0.25, kCycleHeight)];
      break;
    case DatePickerDateMode:
      yearScrollView = [[MXSCycleScrollView alloc] initWithFrame:CGRectMake(0, kCycleValueY, kScreen_Width * 0.34, kCycleHeight)];
      break;
    case DatePickerYearMonthMode:
      yearScrollView = [[MXSCycleScrollView alloc] initWithFrame:CGRectMake(0, kCycleValueY, kScreen_Width * 0.5, kCycleHeight)];
      break;
    case DatePickerDateHourMinuteMode:
      yearScrollView = [[MXSCycleScrollView alloc] initWithFrame:CGRectMake(0, kCycleValueY, kScreen_Width * YEAR_WIDTH_PERCENT, kCycleHeight)];
      break;
    default:
      break;
  }
  self.curYear = [self setNowTimeShow:0];
  [yearScrollView setCurrentSelectPage:(self.curYear - (self.minYear + 2))];
  yearScrollView.delegate = self;
  yearScrollView.datasource = self;
  [self setAfterScrollShowView:yearScrollView andCurrentPage:1];
  [self.timeBroadcastView addSubview:yearScrollView];
}

/// 设置年月日时分的滚动视图
- (void)setMonthScrollView {
  if (self.datePickerMode == DatePickerDateTimeMode) {
      monthScrollView = [[MXSCycleScrollView alloc] initWithFrame:CGRectMake(kScreen_Width * 0.25, kCycleValueY, kScreen_Width*0.15, kCycleHeight)];
  } else if (self.datePickerMode == DatePickerDateMode) {
      monthScrollView = [[MXSCycleScrollView alloc] initWithFrame:CGRectMake(kScreen_Width * 0.34, kCycleValueY, kScreen_Width*0.33, kCycleHeight)];
  } else if (self.datePickerMode == DatePickerMonthDayMode) {
      monthScrollView = [[MXSCycleScrollView alloc] initWithFrame:CGRectMake(kScreen_Width * 0, kCycleValueY, kScreen_Width*0.5, kCycleHeight)];
  } else if (self.datePickerMode == DatePickerYearMonthMode) {
      monthScrollView = [[MXSCycleScrollView alloc] initWithFrame:CGRectMake(kScreen_Width * 0.5, kCycleValueY, kScreen_Width*0.5, kCycleHeight)];
  } else if (self.datePickerMode == DatePickerDateHourMinuteMode) {
      monthScrollView = [[MXSCycleScrollView alloc] initWithFrame:CGRectMake(kScreen_Width * YEAR_WIDTH_PERCENT, kCycleValueY, kScreen_Width * MONTH_WIDTH_PERCENT, kCycleHeight)];
  }
  self.curMonth = [self setNowTimeShow:1];
  [monthScrollView setCurrentSelectPage:(self.curMonth - 3)];
  monthScrollView.delegate = self;
  monthScrollView.datasource = self;
  [self setAfterScrollShowView:monthScrollView andCurrentPage:1];
  [self.timeBroadcastView addSubview:monthScrollView];
}

/// 设置年月日时分的滚动视图
- (void)setDayScrollView {
  if (self.datePickerMode == DatePickerDateTimeMode) {
      dayScrollView = [[MXSCycleScrollView alloc] initWithFrame:CGRectMake(kScreen_Width * 0.40, kCycleValueY, kScreen_Width * 0.15, kCycleHeight)];
  } else if (self.datePickerMode == DatePickerDateMode) {
      dayScrollView = [[MXSCycleScrollView alloc] initWithFrame:CGRectMake(kScreen_Width * 0.67, kCycleValueY, kScreen_Width * 0.33, kCycleHeight)];
  } else if (self.datePickerMode == DatePickerMonthDayMode) {
      dayScrollView = [[MXSCycleScrollView alloc] initWithFrame:CGRectMake(kScreen_Width * 0.5, kCycleValueY, kScreen_Width * 0.5, kCycleHeight)];
  } else if (self.datePickerMode == DatePickerDateHourMinuteMode) {
      dayScrollView = [[MXSCycleScrollView alloc] initWithFrame:CGRectMake(kScreen_Width * (YEAR_WIDTH_PERCENT + MONTH_WIDTH_PERCENT), kCycleValueY, kScreen_Width * DAY_WIDTH_PERCENT, kCycleHeight)];
  }
  [self updateCurrentDay];
  dayScrollView.delegate = self;
  dayScrollView.datasource = self;
  [self setAfterScrollShowView:dayScrollView andCurrentPage:1];
  [self.timeBroadcastView addSubview:dayScrollView];
}

/// 设置年月日时分的滚动视图
- (void)setHourScrollView {
  if (self.datePickerMode == DatePickerDateTimeMode) {
      hourScrollView = [[MXSCycleScrollView alloc] initWithFrame:CGRectMake(kScreen_Width * 0.55, kCycleValueY, kScreen_Width * 0.15, kCycleHeight)];
  } else if (self.datePickerMode == DatePickerTimeMode) {
      hourScrollView = [[MXSCycleScrollView alloc] initWithFrame:CGRectMake(0, kCycleValueY, kScreen_Width * 0.34, kCycleHeight)];
  } else if (self.datePickerMode == DatePickerHourMinuteMode) {
      hourScrollView = [[MXSCycleScrollView alloc] initWithFrame:CGRectMake(0, kCycleValueY, kScreen_Width * 0.5, kCycleHeight)];
  } else if (self.datePickerMode == DatePickerDateHourMinuteMode) {
      hourScrollView = [[MXSCycleScrollView alloc] initWithFrame:CGRectMake(kScreen_Width * (YEAR_WIDTH_PERCENT + MONTH_WIDTH_PERCENT + DAY_WIDTH_PERCENT), kCycleValueY, kScreen_Width * HOUR_WIDTH_PERCENT, kCycleHeight)];
  }
  [self updateCurrentHour];
  hourScrollView.delegate = self;
  hourScrollView.datasource = self;
  [self setAfterScrollShowView:hourScrollView andCurrentPage:1];
  [self.timeBroadcastView addSubview:hourScrollView];
}

/// 设置年月日时分的滚动视图
- (void)setMinuteScrollView {
  if (self.datePickerMode == DatePickerDateTimeMode) {
      minuteScrollView = [[MXSCycleScrollView alloc] initWithFrame:CGRectMake(kScreen_Width * 0.70, kCycleValueY, kScreen_Width * 0.15, kCycleHeight)];
  } else if (self.datePickerMode == DatePickerTimeMode) {
      minuteScrollView = [[MXSCycleScrollView alloc] initWithFrame:CGRectMake(kScreen_Width * 0.34, kCycleValueY, kScreen_Width * 0.33, kCycleHeight)];
  } else if (self.datePickerMode == DatePickerHourMinuteMode) {
      minuteScrollView = [[MXSCycleScrollView alloc] initWithFrame:CGRectMake(kScreen_Width * 0.5, kCycleValueY, kScreen_Width * 0.5, kCycleHeight)];
  } else if (self.datePickerMode == DatePickerDateHourMinuteMode) {
      minuteScrollView = [[MXSCycleScrollView alloc] initWithFrame:CGRectMake(kScreen_Width * (YEAR_WIDTH_PERCENT + MONTH_WIDTH_PERCENT + DAY_WIDTH_PERCENT + HOUR_WIDTH_PERCENT), kCycleValueY, kScreen_Width * MINUTE_WIDTH_PERCENT, kCycleHeight)];
  }
  [self updateCurrentMin];
  minuteScrollView.delegate = self;
  minuteScrollView.datasource = self;
  [self setAfterScrollShowView:minuteScrollView andCurrentPage:1];
  [self.timeBroadcastView addSubview:minuteScrollView];
}

/// 设置年月日时分的滚动视图
- (void)setSecondScrollView {
  if (self.datePickerMode == DatePickerDateTimeMode) {
      secondScrollView = [[MXSCycleScrollView alloc] initWithFrame:CGRectMake(kScreen_Width * 0.85, kCycleValueY, kScreen_Width * 0.15, kCycleHeight)];
  } else if (self.datePickerMode == DatePickerTimeMode) {
      secondScrollView = [[MXSCycleScrollView alloc] initWithFrame:CGRectMake(kScreen_Width * 0.67, kCycleValueY, kScreen_Width * 0.33, kCycleHeight)];
  }
  [self updateCurrentSecond];
  secondScrollView.delegate = self;
  secondScrollView.datasource = self;
  [self setAfterScrollShowView:secondScrollView andCurrentPage:1];
  [self.timeBroadcastView addSubview:secondScrollView];
}

- (void)setLanguage:(LanguageType)language {
  _language = language;
  [self reloadTopView];
	[dayScrollView reloadData];
	[self setAfterScrollShowView:dayScrollView andCurrentPage:1];
}

- (UIButton *)okBtn {
	if (_okBtn == nil) {
		_okBtn = [[UIButton alloc]initWithFrame:CGRectMake(kScreen_Width - 60, 0, 60, kTopViewHeight)];
		[_okBtn setTitleColor:_buttonTitleColor forState:UIControlStateNormal];
		_okBtn.titleLabel.font = PICKER_BUTTON_FONT;
		[_okBtn setBackgroundColor:[UIColor clearColor]];
		[_okBtn addTarget:self action:@selector(selectedButtons:) forControlEvents:UIControlEventTouchUpInside];
    [_okBtn addTarget:self action:@selector(onPressInOkBtn:) forControlEvents:UIControlEventTouchDown];
    [_okBtn addTarget:self action:@selector(onPressOutOkBtn:) forControlEvents:UIControlEventTouchUpOutside];
		_okBtn.tag = kOKBtnTag;
    [_okBtn setContentHorizontalAlignment:UIControlContentHorizontalAlignmentRight];
    [_okBtn setContentEdgeInsets:UIEdgeInsetsMake(0, 16, 0, 16)];
	}
	return _okBtn;
}

- (UIButton *)cancleBtn {
	if (_cancleBtn == nil) {
		_cancleBtn = [[UIButton alloc]initWithFrame:CGRectMake(0, 0, 60, kTopViewHeight)];
		_cancleBtn.titleLabel.font = PICKER_BUTTON_FONT;
		[_cancleBtn setTitleColor:_buttonTitleColor forState:UIControlStateNormal];
		[_cancleBtn setBackgroundColor:[UIColor clearColor]];
		[_cancleBtn addTarget:self action:@selector(selectedButtons:) forControlEvents:UIControlEventTouchUpInside];
    [_cancleBtn addTarget:self action:@selector(onPressInCancelBtn:) forControlEvents:UIControlEventTouchDown];
    [_cancleBtn addTarget:self action:@selector(onPressOutCancelBtn:) forControlEvents:UIControlEventTouchUpOutside];
		_cancleBtn.tag = kCancleBtnTag;
    [_cancleBtn setContentHorizontalAlignment:UIControlContentHorizontalAlignmentLeft];
    [_cancleBtn setContentEdgeInsets:UIEdgeInsetsMake(0, 16, 0, 16)];
	}
	return _cancleBtn;
}

- (UILabel *)titleLbl {
	if (_titleLbl == nil) {
		_titleLbl = [[UILabel alloc]initWithFrame:CGRectMake(130, 0, kScreen_Width-260, kTopViewHeight)];
		_titleLbl.textAlignment = NSTextAlignmentCenter;
		_titleLbl.font = PICKER_TITLE_FONT;
	}
	return _titleLbl;
}

- (UIView *)topView {
	if (_topView == nil) {
		_topView = [[UIView alloc]initWithFrame:CGRectMake(0, 0, kScreen_Width, kTopViewHeight)];
		_topView.backgroundColor = self.topViewColor;
    [_topView addSubview:self.okBtn];
    [_topView addSubview:self.cancleBtn];
    [_topView addSubview:self.titleLbl];
	}
	return _topView;
}

- (UIView *)middleSepView {
	if (_middleSepView == nil) {
		_middleSepView = [[UIView alloc] initWithFrame:CGRectMake(0, kTopViewHeight + unitViewHeight + 10.0 + 2 * (kCycleHeight / 5.0), kScreen_Width, kCycleHeight / 5.0)];
		_middleSepView.backgroundColor = [UIColor whiteColor];
	}
	return _middleSepView;
}

- (HcdUnitView *)unitView {
	if (_unitView == nil) {
		_unitView = [[HcdUnitView alloc] initWithDatePickerMode:self.datePickerMode];
	}
	return _unitView;
}

@end
