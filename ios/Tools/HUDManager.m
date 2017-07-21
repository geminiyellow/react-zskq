//
//  HUDManager.m
//  ZSKQ
//
//  Created by Tadas.Gao on 16/7/13.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "HUDManager.h"

@implementation HUDManager

@synthesize HUD;
@synthesize baseView;

- (id)initWithView:(UIView *)view {
  self = [super init];
  if (self) {
    self.baseView = view;
  }
  return self;
}

- (void)createHUD {
  if (!self.HUD) {
    self.HUD          = [[MBProgressHUD alloc] initWithView:self.baseView];
    self.HUD.mode     = MBProgressHUDModeText;
    self.HUD.delegate = self;
    [self.baseView addSubview:self.HUD];
  }
}

// Show Text

- (void)showMessage:(NSString *)message {
  [self showMessage:message duration:-1];
}

- (void)showMessage:(NSString *)message duration:(NSTimeInterval)duration {
  [self showMessage:message duration:duration complection:nil];
}

- (void)showMessage:(NSString *)message duration:(NSTimeInterval)duration complection:(void (^)())completion {
  [self showMessage:message mode:MBProgressHUDModeText duration:duration complection:completion];
}

// Show UIActivityIndicatorView

- (void)showIndeterminateWithMessage:(NSString *)message {
  [self showIndeterminateWithMessage:message duration:-1];
}

- (void)showIndeterminateWithMessage:(NSString *)message duration:(NSTimeInterval)duration {
  [self showIndeterminateWithMessage:message duration:duration complection:nil];
}

- (void)showIndeterminateWithMessage:(NSString *)message duration:(NSTimeInterval)duration complection:(void (^)())completion {
  [self showMessage:message mode:MBProgressHUDModeIndeterminate duration:duration complection:completion];
}

// Show mode

- (void)showMessage:(NSString *)message mode:(MBProgressHUDMode)mode duration:(NSTimeInterval)duration complection:(void (^)())completion {
  [self createHUD];
  self.HUD.mode = mode;
  if (mode == MBProgressHUDModeText) {
    self.HUD.labelText = nil;
    self.HUD.detailsLabelText = message;
    self.HUD.detailsLabelFont = self.HUD.labelFont;
  } else {
    self.HUD.labelText = message;
  }
  
  [self.HUD show:YES];
  if (completion) {
    [self hideWithAfterDuration:duration completion:completion];
  } else {
    self.completionBlock = NULL;
    if (duration >= 0)
      [self.HUD hide:YES afterDelay:duration];
  }
}

// hide

- (void)hide {
  if (self.HUD)
    [self.HUD hide:YES];
}

- (void)hideWithAfterDuration:(NSTimeInterval)duration completion:(MBProgressHUDCompletionBlock)completion {
  self.completionBlock = completion;
  if (!self.HUD) {
    if (self.completionBlock) {
      self.completionBlock();
      self.completionBlock = NULL;
    }
    return;
  }
  
  [self.HUD showAnimated:YES
     whileExecutingBlock:^{
       sleep(duration);
     }
         completionBlock:^{
           
         }];
}

#pragma mark -
#pragma mark MBProgressHUDDelegate methods

- (void)hudWasHidden:(MBProgressHUD *)hud {
  self.HUD.delegate = nil;
  [self.HUD removeFromSuperview];
  self.HUD = nil;
  
  if (self.completionBlock) {
    self.completionBlock();
  }
}

@end
