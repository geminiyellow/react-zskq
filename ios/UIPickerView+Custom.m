//
//  UIPickerView+Custom.m
//  ZSKQ
//
//  Created by Andy Wu on 5/7/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "UIPickerView+Custom.h"
#import <objc/runtime.h>

static void * LaserUnicornPropertyKey = &LaserUnicornPropertyKey;
@implementation UIPickerView (Custom)


- (UIColor *)selectorColor {
	return (UIColor *)objc_getAssociatedObject(self, LaserUnicornPropertyKey);
}

- (void)setSelectorColor:(UIColor *)selectorColor {
	objc_setAssociatedObject(self, LaserUnicornPropertyKey, selectorColor, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (void)didAddSubview:(UIView *)subview {
	[super didAddSubview:subview];
	
	if (self.selectorColor != nil) {
		if (subview.bounds.size.height < 1.0) {
			subview.backgroundColor = self.selectorColor;
		}
	}
}

@end
