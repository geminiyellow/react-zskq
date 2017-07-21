//
//  UIViewController+HUD.h
//  ZSKQ
//
//  Created by Tadas.Gao on 16/7/13.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "HUDManager.h"

@interface UIViewController (HUD)

@property (nonatomic, strong) HUDManager *gaiaHUDManager;

- (HUDManager *)hudManager;

@end
