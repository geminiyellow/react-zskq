//
//  RNFormViewManager.m
//  ZSKQ
//
//  Created by SL on 2017/6/9.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "RNFormViewManager.h"
#import "CustomTableView.h"

@implementation RNFormViewManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  CustomTableView *customView = [CustomTableView new];
  return customView;
}

RCT_EXPORT_VIEW_PROPERTY(itemArr, NSArray);
RCT_EXPORT_VIEW_PROPERTY(tableHeadData, NSString);
RCT_EXPORT_VIEW_PROPERTY(tableData, NSString);

@end
