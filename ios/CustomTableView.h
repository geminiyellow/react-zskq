//
//  CustomTableView.h
//  Chart_Demo
//
//  Created by SL on 2017/6/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface CustomTableView : UIView <UITableViewDelegate, UITableViewDataSource, UIScrollViewDelegate>


@property (nonatomic, strong) UITableView *titleTableView; //标题TableView
@property (nonatomic, strong) UITableView *infoTableView;  //内容TableView
@property (nonatomic, strong) UIScrollView *contentView;   //内容容器
@property (nonatomic, strong) NSMutableArray *itemArr;   // 表头数组
@property (nonatomic, strong) NSArray *detailArr; // 详细数据
@property (nonatomic, strong) NSArray *infoArr;   // 详细信息数组

@property (nonatomic, strong) NSString *tableHeadData; // RN 表头数据
@property (nonatomic, strong) NSString *tableData;   // RN 详细信息数组

@end
