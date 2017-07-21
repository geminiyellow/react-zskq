//
//  OptionPickerViewManager.m
//  ZSKQ
//
//  Created by Andy Wu on 5/5/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "WPOptionPickerViewManager.h"
#import "WPOptionPickerView.h"

@implementation WPOptionPickerViewManager

RCT_EXPORT_MODULE()

- (UIView *)view {
	WPOptionPickerView *optionPickerView = [WPOptionPickerView new];
	return optionPickerView;
}

RCT_EXPORT_VIEW_PROPERTY(pickerData, NSArray)
RCT_EXPORT_VIEW_PROPERTY(onPickerCancel, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onPickerConfirm, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(value, NSArray)
RCT_EXPORT_VIEW_PROPERTY(cancelButtonTitle, NSString)
RCT_EXPORT_VIEW_PROPERTY(doneButtonTitle, NSString)
RCT_EXPORT_VIEW_PROPERTY(title, NSString)
RCT_EXPORT_VIEW_PROPERTY(component, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(dateData, NSDictionary)

@end
