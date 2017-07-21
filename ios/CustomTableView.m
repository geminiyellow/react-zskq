//
//  CustomTableView.m
//  Chart_Demo
//
//  Created by SL on 2017/6/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "CustomTableView.h"
#import "CustomTableViewCell.h"

@interface CustomTableView()

@property (nonatomic, strong) NSArray *arrEmployeeName;  // 人员名称合并数据
@property (nonatomic, strong) NSArray *arrEmployeeDetail;  // 人员详情具体数据
@property (nonatomic, strong) UIView *viewShadow;   // 阴影效果

@end


@implementation CustomTableView
{
  CGFloat _kOriginX;
  CGFloat _kScreenWidth;
  CGFloat _kScreenHeight;
}




- (instancetype)initWithFrame:(CGRect)frame
{
  self = [super initWithFrame:frame];
  if(self)
  {
    _contentView = [[UIScrollView alloc] init];
    _titleTableView = [[UITableView alloc] init];
    _infoTableView = [[UITableView alloc] init];

    [self addSubview:_contentView];
    
    [_contentView addSubview:_infoTableView];
  }
  return self;
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  
  [self configData];
  [self configTableHeader];
  [self configInfoView];
}

- (void)configData {
  
  _kOriginX = 105;
  _kScreenWidth = self.bounds.size.width;
  _kScreenHeight = self.bounds.size.height;
  _itemArr = [[NSMutableArray alloc] init];
  
  if (_tableHeadData.length == 0) { return; }
  NSData *jsonData = [_tableHeadData dataUsingEncoding:NSUTF8StringEncoding];
  NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingMutableContainers error:nil];
  _itemArr = [dic objectForKey:@"columns"];
  
  NSData *jsonDataDetail = [_tableData dataUsingEncoding:NSUTF8StringEncoding];
  _detailArr = [NSJSONSerialization JSONObjectWithData:jsonDataDetail options:NSJSONReadingMutableContainers error:nil];
  _arrEmployeeName = [self getEmployeeNameFormat:_detailArr];
  [self getEmployeeDataFormat];
  
  // 添加阴影效果
  _viewShadow = [[UIView alloc] initWithFrame:CGRectMake(98, 0, 2, (_detailArr.count + 1) * 44)];
  _viewShadow.backgroundColor = [UIColor grayColor];
  _viewShadow.layer.shadowOpacity = 0.3;
  _viewShadow.layer.shadowColor = [UIColor grayColor].CGColor;
  _viewShadow.layer.shadowRadius = 3;
  _viewShadow.layer.shadowOffset = CGSizeMake(3, 0);
  UIView *v = [self viewWithTag:10032];
  if (v == NULL)
  {
    _viewShadow.tag = 10032;
    [self addSubview:_viewShadow];
    [self addSubview:_titleTableView];
  }
}

- (NSArray *)getEmployeeNameFormat:(NSArray *)arr
{
  // 获取员工姓名合并项
  if (arr.count == 0)
  {
    return @[];
  }
  
  NSMutableArray *arrTemp = [[NSMutableArray alloc] init];
  for (int i = 0; i < arr.count; i++)
  {
    NSString *name = [arr[i] objectForKey:@"EmployeeName"];
    NSMutableDictionary *dicTemp = [[NSMutableDictionary alloc] init];
    [dicTemp setObject:name forKey:@"name"];
    NSInteger count = 0;
    for (int j = 0; j < arr.count; j ++)
    {
      if ([arr[j] objectForKey:@"EmployeeName"] == name)
      {
        count += 1;
      }
      
      for (int m = 0; m < arrTemp.count; m ++)
      {
        if ([arrTemp[m] objectForKey:@"name"] == name)
        {
          count = -1;
        }
      }
    }
    
    [dicTemp setObject:[NSNumber numberWithInteger:count] forKey:@"count"];
    if (count != -1)
    {
      [arrTemp addObject:dicTemp];
    }
  }
  
  return arrTemp;
}

- (void)getEmployeeDataFormat
{
  // 获取 员工信息 合并数据
  NSMutableArray *arrAll = [[NSMutableArray alloc] init];
  for (int i = 0; i < _arrEmployeeName.count; i ++)
  {
    NSMutableArray *temp = [[NSMutableArray alloc] init];
    for (int j = 0; j < _detailArr.count; j ++)
    {
      if ([_arrEmployeeName[i] objectForKey:@"name"] == [_detailArr[j] objectForKey:@"EmployeeName"])
      {
        [temp addObject:_detailArr[j]];
      }
    }
    [arrAll addObject:temp];
  }
  
  _arrEmployeeDetail = arrAll;
}

#pragma mark - inital method
// scrollView 容器
- (void)configTableHeader
{
  _contentView.frame = CGRectMake(_kOriginX, 0, _kScreenWidth - _kOriginX, _kScreenHeight);
  _contentView.delegate = self;
  _contentView.showsVerticalScrollIndicator = NO;
  _contentView.showsHorizontalScrollIndicator = NO;
  _contentView.contentSize = CGSizeMake((_itemArr.count - 1) * 105, _kScreenHeight);
  _contentView.bounces = NO;
  self.backgroundColor = [UIColor grayColor];
  
  UILabel *titleLabel = [self quickCreateLabelWithLeft:0 width:_kOriginX title:[_itemArr[0] objectForKey:@"text"]];
  [self addSubview:titleLabel];
  
  for (int i = 1; i < _itemArr.count; i++) {
    CGFloat x = (i - 1) * 105;
    UILabel *label = [self quickCreateLabelWithLeft:x width:105 title:[[_itemArr objectAtIndex:i] objectForKey:@"text"]];
    label.textAlignment = NSTextAlignmentCenter;
    [_contentView addSubview:label];
  }
}

// table view 左边标题、右边数据
- (void)configInfoView {
  _titleTableView.frame = CGRectMake(0, 44, _kOriginX, _kScreenHeight - 44);
  _titleTableView.dataSource = self;
  _titleTableView.delegate = self;
  _titleTableView.bounces = NO;
  _titleTableView.showsVerticalScrollIndicator = NO;
  _titleTableView.showsHorizontalScrollIndicator = NO;
  _titleTableView.separatorStyle = UITableViewCellSeparatorStyleNone;
  
  
  _infoTableView.frame = CGRectMake(0, 44, (_itemArr.count - 1) * 105, _kScreenHeight - 44);
  _infoTableView.delegate = self;
  _infoTableView.dataSource = self;
  _infoTableView.bounces = NO;
  _infoTableView.showsVerticalScrollIndicator = NO;
  _infoTableView.showsHorizontalScrollIndicator = NO;
  _infoTableView.separatorStyle = UITableViewCellSeparatorStyleNone;
}

#pragma mark - table view Delegate & DataSource
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
  return _arrEmployeeName.count;
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
  return 1;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
  if (tableView == _titleTableView) {
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"titleTable"];
    UIColor *color = indexPath.row%2 == 1 ? [UIColor whiteColor] : [UIColor colorWithRed:248/255.0 green:248/255.0 blue:248/255.0 alpha:1];
    if (!cell) {
      cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"titleTable"];
    }
    cell.backgroundColor = color;
    cell.frame = CGRectMake(0, 0, 200, 88);
    cell.textLabel.textAlignment = NSTextAlignmentCenter;
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
    cell.textLabel.text = [[_arrEmployeeName objectAtIndex:indexPath.row] objectForKey:@"name"];
    cell.textLabel.textColor = [UIColor colorWithRed:51/255.0 green:51/255.0 blue:51/255.0 alpha:1];
    cell.textLabel.font = [UIFont systemFontOfSize:13];
    return cell;
  } else {
    NSString *identifier = @"InfoCell";
    CustomTableViewCell *cell;
//    if (!cell)
//    {
      cell = [CustomTableViewCell alloc];
      cell.itemNameArr = _itemArr;
      cell.itemDetai = [_arrEmployeeDetail objectAtIndex:indexPath.row];
      if (indexPath.row%2 == 1)
      {
        cell.itemColor = [UIColor whiteColor];
      } else
      {
        cell.itemColor = [UIColor colorWithRed:248/255.0 green:248/255.0 blue:248/255.0 alpha:1];
      }
      cell = [cell initWithStyle:UITableViewCellStyleDefault reuseIdentifier:identifier];
//    }
    
    
    return cell;
  }
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
  NSDictionary *dic = [_arrEmployeeName objectAtIndex:indexPath.row];
  int i = [[dic objectForKey:@"count"] intValue];
  return 44 * i;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
  
}

- (BOOL)tableView:(UITableView *)tableView shouldHighlightRowAtIndexPath:(NSIndexPath *)indexPath
{
  return NO;
}

#pragma mark - UIScrollView Delegate
- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
  if (scrollView == _titleTableView) {
    [_infoTableView setContentOffset:CGPointMake(_infoTableView.contentOffset.x, _titleTableView.contentOffset.y)];
  }
  if (scrollView == _infoTableView) {
    [_titleTableView setContentOffset:CGPointMake(0, _infoTableView.contentOffset.y)];
  }
}


#pragma mark - others method
- (UILabel *)quickCreateLabelWithLeft:(CGFloat)left width:(CGFloat)width title:(NSString *)title
{
  UILabel *label = [[UILabel alloc] initWithFrame:CGRectMake(left, 0, width, 44)];
  label.text = title;
  label.font = [UIFont systemFontOfSize:13];
  label.backgroundColor = [UIColor whiteColor];
  label.textAlignment = NSTextAlignmentCenter;
  return label;
}



@end
