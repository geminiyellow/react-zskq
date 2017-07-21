//
//  Location.m
//  ZSKQ
//
//  Created by Tadas.Gao on 16/7/13.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "Location.h"

@implementation Location

+ (instancetype)sharedInstance {
  static Location *sharedInstance = nil;
  
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [[super alloc] init];
  });
  
  return sharedInstance;
}

- (NSDictionary *)getLocationInfo {
	if ([self.provinceName isEqualToString:@"(null)"]) {
		self.provinceName = @"";
	}
	if ([self.cityName isEqualToString:@"(null)"]) {
		self.cityName = @"";
	}
	if ([self.districtName isEqualToString:@"(null)"]) {
		self.districtName = @"";
	}
	if ([self.streetName isEqualToString:@"(null)"]) {
		self.streetName = @"";
	}
	if ([self.streetNumber isEqualToString:@"(null)"]) {
		self.streetNumber = @"";
	}
	
  return @{
    @"lat": @(self.lat),
    @"lng": @(self.lng),
    @"radius": @(self.horizontalAccuracy),
    @"province": [NSString stringWithFormat:@"%@%@%@", self.provinceName, self.cityName, self.districtName],
    @"address": [NSString stringWithFormat:@"%@%@%@%@%@", self.provinceName, self.cityName, self.districtName, self.streetName, self.streetNumber]
  };
}

@end
