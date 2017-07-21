//
//  RNPickerView.h
//  DatePickerDemo
//
//  Created by AndyWu on 2016/12/27.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "RCTComponent.h"

@class RNPickerView, HcdDateTimePickerView;

typedef NS_ENUM(NSInteger, LanguageType) {
	// 中文
  LanguageTypeChinese = 1,
	// 英文
  LanguageTypeEnglish = 2,
  // 韩语
  LanguageTypeKorean = 3,
  // 日语
  LanguageTypeJapanese = 4,
  // 法语
  LanguageTypeFrench = 5,
	// 德语
	LanguageTypeGerman = 6,
	// 泰语
	LanguageTypeThai = 7,
	// 繁体中文
	LanguageTypeTraditionalChinese = 8,
};

@interface RNPickerView : UIView

/// 最小年份
@property (nonatomic, assign) NSInteger minYear;

/// 最大年份
@property (nonatomic, assign) NSInteger maxYear;

/// 日期选择器显示模式
@property (nonatomic, assign) NSInteger datePickerMode;

/// 默认显示时间
@property (nonatomic, copy) NSString *defaultTime;

/// 顶部视图中间显示的标题
@property (nonatomic, copy) NSString *title;

/// 当前语言类型
@property (nonatomic) LanguageType languageType;

/// 导出到RN的回调，点击 picker 的确认按钮时调用 RN 的对应参数名 onPickerConfirm() 函数
@property (nonatomic, copy) RCTBubblingEventBlock onPickerConfirm;

/// 导出到RN的回调，点击 picker 的取消按钮时调用 RN 的对应参数名 onPickerCancel() 函数
@property (nonatomic, copy) RCTBubblingEventBlock onPickerCancel;

@end
