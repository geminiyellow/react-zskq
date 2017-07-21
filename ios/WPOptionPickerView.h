//
//  OptionPickerView.h
//  ZSKQ
//
//  Created by Andy Wu on 5/5/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "RCTComponent.h"

@interface WPOptionPickerView : UIView

@property (nonatomic, copy) NSArray *pickerData;

@property (nonatomic, copy) RCTBubblingEventBlock onPickerCancel;

@property (nonatomic, copy) RCTBubblingEventBlock onPickerConfirm;

@property (nonatomic, copy) NSArray *value;

@property (nonatomic, copy) NSString *cancelButtonTitle;

@property (nonatomic, copy) NSString *doneButtonTitle;

@property (nonatomic, assign) NSInteger component;

@property (nonatomic, copy) NSDictionary *dateData;

@property (nonatomic, copy) NSString *title;

@end
