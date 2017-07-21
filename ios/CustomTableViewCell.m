//
//  CustomTableViewCell.m
//  Chart_Demo
//
//  Created by SL on 2017/6/2.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "CustomTableViewCell.h"

@implementation CustomTableViewCell

+ (instancetype)cellWithTableView:(UITableView *)tableView
{
  static NSString *identifier = @"CellForDetail";
  CustomTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:identifier];
  if (cell == nil)
  {
    cell = [[CustomTableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:identifier];
  }
  
  return cell;
}

- (id)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
  self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
  if (self)
  {
    for (int i = 0; i < self.itemNameArr.count - 1; i++) {
      CGFloat x = i * 105;
      NSNumber *mergable = [_itemNameArr[i + 1] objectForKey:@"mergable"];
      int mergableNumber = [mergable intValue];
      if (mergableNumber == 1)
      {
        // 合并单元格
        NSString *name = [_itemNameArr[i + 1] objectForKey:@"name"];
        NSString *detail = [[_itemDetai[0] objectForKey:name] isEqual:[NSNull null]] ? @"" : [_itemDetai[0] objectForKey:name];
        NSString *originTitle = [NSString stringWithFormat:@"%@", detail];
        NSString *formatTitle = [self isPureNumandCharacters:originTitle] ? [self positiveFormat:originTitle] : originTitle;
        UILabel *label = [self quickCreateLabelWithLeft:x width:105 title:formatTitle noMergeCout:(int)_itemDetai.count];
        label.textColor = [name isEqualToString:@"Commission"] ? [UIColor colorWithRed:20.0/255.0 green:190.0/255.0 blue:75.0/255.0 alpha:1] : [UIColor blackColor];
        label.textAlignment = NSTextAlignmentCenter;
        [self.contentView addSubview:label];
      }
      else
      {
        for (int j = 0; j < _itemDetai.count; j ++)
        {
          NSString *name = [_itemNameArr[i + 1] objectForKey:@"name"];
          NSString *detail = [[_itemDetai[j] objectForKey:name] isEqual:[NSNull null]] ? @"" : [_itemDetai[j] objectForKey:name];
          NSString *originTitle = [NSString stringWithFormat:@"%@", detail];
          NSString *formatTitle = [self isPureNumandCharacters:originTitle] ? [self positiveFormat:originTitle] : originTitle;
          UILabel *label = [self quickCreateLabelWithLeft:x width:105 title:formatTitle mergeCount:j];
          label.textColor = [name isEqualToString:@"Commission"] ? [UIColor colorWithRed:20.0/255.0 green:190.0/255.0 blue:75.0/255.0 alpha:1] : [UIColor blackColor];
          label.textAlignment = NSTextAlignmentCenter;
          [self.contentView addSubview:label];
        }
      }
    }
  }
  
  return self;
}

- (void)awakeFromNib
{
    [super awakeFromNib];
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated
{
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

- (BOOL)isPureNumandCharacters:(NSString *)str
{
  // 判断是否是数字
  NSScanner *scan = [NSScanner scannerWithString:str];
  float val;
  return [scan scanFloat:&val] && [scan isAtEnd];
}

- (NSString *)positiveFormat:(NSString *)text{
  // 显示千分位
  if(!text || [text intValue] == 0){
    return @"0.00";
  }
  if (text.floatValue < 1000) {
    return  [NSString stringWithFormat:@"%.2f",text.floatValue];
  };
  
  NSNumberFormatter *numberFormatter = [[NSNumberFormatter alloc] init];
  numberFormatter.groupingSeparator = @",";
  [numberFormatter setNumberStyle:NSNumberFormatterDecimalStyle];
  return [numberFormatter stringFromNumber:[NSNumber numberWithDouble:[text doubleValue]]];
}

- (UILabel *)quickCreateLabelWithLeft:(CGFloat)left width:(CGFloat)width title:(NSString *)title noMergeCout:(int) count
{
  UILabel *label = [[UILabel alloc] initWithFrame:CGRectMake(left, 0, width, 44 * count)];
  label.text = title;
  label.font = [UIFont systemFontOfSize:13];
  label.backgroundColor = self.itemColor;
  label.textAlignment = NSTextAlignmentCenter;
  return label;
}

- (UILabel *)quickCreateLabelWithLeft:(CGFloat)left width:(CGFloat)width title:(NSString *)title mergeCount:(int) count
{
  UILabel *label = [[UILabel alloc] initWithFrame:CGRectMake(left, count * 44, width, 44)];
  label.text = title;
  label.font = [UIFont systemFontOfSize:13];
  label.backgroundColor = self.itemColor;
  label.textAlignment = NSTextAlignmentCenter;
  return label;
}

@end
