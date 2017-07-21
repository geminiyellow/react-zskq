//
//  UIViewController+HUD.m
//  ZSKQ
//
//  Created by Tadas.Gao on 16/7/13.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#include <objc/runtime.h>
#import "UIViewController+HUD.h"

static void *hudKey = (void *) @"hudKey";

@implementation UIViewController (HUD)

@dynamic gaiaHUDManager;

- (HUDManager *)gaiaHUDManager {
  return objc_getAssociatedObject(self, hudKey);
}

- (void)setGaiaHUDManager:(HUDManager *)hudProperty {
  objc_setAssociatedObject(self, hudKey, hudProperty, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (HUDManager *)hudManager {
  if (!self.gaiaHUDManager) {
    self.gaiaHUDManager = [[HUDManager alloc] initWithView:self.view];
  }
  
  return self.gaiaHUDManager;
}

@end
