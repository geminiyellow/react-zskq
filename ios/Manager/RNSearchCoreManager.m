//
//  RNSearchCoreManager.m
//  ZSKQ
//
//  Created by AndyWu on 12/13/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "RNSearchCoreManager.h"
#import "SearchCoreManager.h"

@implementation RNSearchCoreManager

- (instancetype)init {
  self = [super init];
  if (self) {
    NSMutableDictionary *dic = [NSMutableDictionary new];
    self.allProjectCodes = dic;
    
    NSMutableArray *array = [NSMutableArray new];
    self.searchByCode = array;
    
    NSMutableArray *phoneArray = [NSMutableArray new];
    self.searchByPhone = phoneArray;
  }
  
  return self;
}

RCT_EXPORT_MODULE();

// 添加数据到搜索库
RCT_EXPORT_METHOD(addAllCodes:(id)codeArray) {
  NSArray *array = [NSArray arrayWithObject:codeArray];
  if (array.count < 1) return;
  
  NSArray *projectCodeArray = array.firstObject;
  SearchCoreManager *manager = [SearchCoreManager share];
  for (int i = 0; i <projectCodeArray.count; i++ ) {
    [manager AddContact:[NSNumber numberWithInt:i] name:projectCodeArray[i] phone:@[]];
    [_allProjectCodes setObject:projectCodeArray[i] forKey:[NSNumber numberWithInt:i]];
  }
}

// 搜索项目代码
RCT_EXPORT_METHOD(searchCode:(NSString *)searchText callback:(RCTResponseSenderBlock)callback) {
  [[SearchCoreManager share] Search:searchText searchArray:nil nameMatch:_searchByCode phoneMatch:_searchByPhone];
  NSArray *array = [NSArray arrayWithObject:_searchByCode];
  if (array.count < 1) {
    callback(@[]);
    return;
  };
  
  NSMutableArray *filterCodes = [NSMutableArray new];
  for (NSNumber *localID in array.firstObject) {
    [filterCodes addObject:[_allProjectCodes objectForKey:localID]];
  }
  
  callback([NSArray arrayWithObject:filterCodes]);
}

@end
