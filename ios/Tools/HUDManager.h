//
//  HUDManager.h
//  ZSKQ
//
//  Created by Tadas.Gao on 16/7/13.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "MBProgressHUD.h"

@interface HUDManager : NSObject

@property (nonatomic, strong) MBProgressHUD *HUD;

@property (nonatomic, weak) UIView *baseView;

@property (copy) MBProgressHUDCompletionBlock completionBlock;

- (id)initWithView:(UIView *)view;

- (void)showMessage:(NSString *)message;

- (void)showMessage:(NSString *)message duration:(NSTimeInterval)duration;

- (void)showMessage:(NSString *)message duration:(NSTimeInterval)duration complection:(MBProgressHUDCompletionBlock)completion;

- (void)showIndeterminateWithMessage:(NSString *)message;

- (void)showIndeterminateWithMessage:(NSString *)message duration:(NSTimeInterval)duration;

- (void)showIndeterminateWithMessage:(NSString *)message duration:(NSTimeInterval)duration complection:(MBProgressHUDCompletionBlock)completion;

- (void)showMessage:(NSString *)message mode:(MBProgressHUDMode)mode duration:(NSTimeInterval)duration complection:(MBProgressHUDCompletionBlock)completion;

- (void)hide;

- (void)hideWithAfterDuration:(NSTimeInterval)duration completion:(MBProgressHUDCompletionBlock)completion;

@end
