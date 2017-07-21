//
//  RNPickerViewManager.m
//  DatePickerDemo
//
//  Created by AndyWu on 2016/12/27.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RNPickerViewManager.h"
#import "HcdDateTimePickerView.h"
#import "RNPickerView.h"

@implementation RNPickerViewManager

RCT_EXPORT_MODULE()

- (UIView *)view {
  RNPickerView *picker = [RNPickerView new];
  return picker;
}

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_EXPORT_VIEW_PROPERTY(onPickerConfirm, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPickerCancel, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(minYear, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(maxYear, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(datePickerMode, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(defaultTime, NSString)
RCT_EXPORT_VIEW_PROPERTY(title, NSString)
RCT_EXPORT_VIEW_PROPERTY(languageType, NSInteger)

@end
