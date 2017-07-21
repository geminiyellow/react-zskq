//
//  CustomTableViewCell.h
//  Chart_Demo
//
//  Created by SL on 2017/6/2.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface CustomTableViewCell : UITableViewCell

@property (assign, nonatomic) NSInteger itemAmount;
@property (strong, nonatomic) UIColor *itemColor;
@property (copy, nonatomic) NSString *title;
@property (copy, nonatomic) NSArray *itemNameArr;
@property (nonatomic, strong) NSArray *itemDetai;    // 单个人员列表详情

+ (instancetype)cellWithTableView:(UITableView *)tableView;

@end
