//
//  ____    ___   _        ___  _____  ____  ____  ____
// |    \  /   \ | T      /  _]/ ___/ /    T|    \|    \
// |  o  )Y     Y| |     /  [_(   \_ Y  o  ||  o  )  o  )
// |   _/ |  O  || l___ Y    _]\__  T|     ||   _/|   _/
// |  |   |     ||     T|   [_ /  \ ||  _  ||  |  |  |
// |  |   l     !|     ||     T\    ||  |  ||  |  |  |
// l__j    \___/ l_____jl_____j \___jl__j__jl__j  l__j
//
//
//	Powered by Polesapp.com
//
//
//  RBCustomDatePickerView.h
//
//
//  Created by fangmi-huangchengda on 15/10/21.
//
//  Modified by AndyWu on 17/02/10
//
//

#define kScreen_Height [UIScreen mainScreen].bounds.size.height
#define kScreen_Width [UIScreen mainScreen].bounds.size.width

#define kScaleFrom_iPhone5_Desgin(_X_) (_X_ * (kScreen_Width / 320))

#import <UIKit/UIKit.h>
#import "MXSCycleScrollView.h"
#import "RNPickerView.h"

/// 年月日时分秒单位视图高度
extern CGFloat const unitViewHeight;

typedef enum {
		/// 日期模式
    DatePickerDateMode = 1,
		/// 时间模式
    DatePickerTimeMode,
		/// 日期时间模式
    DatePickerDateTimeMode,
		/// 年月模式
    DatePickerYearMonthMode,
		/// 月日模式
    DatePickerMonthDayMode,
		/// 时分模式
    DatePickerHourMinuteMode,
		/// 日期时分模式
    DatePickerDateHourMinuteMode,
} DatePickerMode;

typedef void(^DatePickerCompleteAnimationBlock)(BOOL Complete);
typedef void(^ClickedOkBtn)(NSString *dateTimeStr);
typedef void (^ClickedCancelButton)(void);

@interface HcdDateTimePickerView : UIView <MXSCycleScrollViewDatasource,MXSCycleScrollViewDelegate>

/// 最大年份
@property (nonatomic,assign) NSInteger maxYear;

/// 最小年份
@property (nonatomic,assign) NSInteger minYear;

/// 顶部视图颜色
@property (nonatomic,strong) UIColor *topViewColor;

/// 按钮文字颜色
@property (nonatomic,strong) UIColor *buttonTitleColor;

/// 标题颜色
@property (nonatomic,strong) UIColor *titleColor;

/// 顶部视图中间标题文本
@property (nonatomic,weak) NSString *title;

/// 默认日期
@property (nonatomic, retain) NSDate *defaultDate;

/// 当前显示语言
@property (nonatomic) LanguageType language;

/// 点击确认按钮回调
@property (nonatomic, copy) ClickedOkBtn clickedOkBtn;

/// 点击取消按钮回调
@property (nonatomic, copy) ClickedCancelButton clickedCancelButton;

/// 日期选择器类型
@property (nonatomic,assign) DatePickerMode datePickerMode;

#pragma mark - init methods
-(instancetype)initWithDatePickerMode:(DatePickerMode)datePickerMode defaultDateTime:(NSDate*)dateTime;

/// 显示日期时间选择器
-(void) showHcdDateTimePicker;

@end
