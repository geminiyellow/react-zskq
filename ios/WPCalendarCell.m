//
//  WPCalendarCell.m
//  ZSKQ
//
//  Created by Andy Wu on 6/28/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "WPCalendarCell.h"
#import "CalendarColors.h"

@implementation WPCalendarCell

#pragma mark - FSCalendarCell
- (void)configureAppearance {
	UIColor *textColor = self.colorForTitleLabel;
	if (![textColor isEqual:self.titleLabel.textColor]) {
		self.titleLabel.textColor = textColor;
	}
	UIFont *titleFont = self.calendar.appearance.titleFont;
	if (![titleFont isEqual:self.titleLabel.font]) {
		self.titleLabel.font = titleFont;
	}
	if (self.subtitle) {
		textColor = self.colorForSubtitleLabel;
		if (![textColor isEqual:self.subtitleLabel.textColor]) {
			self.subtitleLabel.textColor = textColor;
		}
		titleFont = self.calendar.appearance.subtitleFont;
		if (![titleFont isEqual:self.subtitleLabel.font]) {
			self.subtitleLabel.font = titleFont;
		}
	}
	
	UIColor *borderColor = self.colorForCellBorder;
	UIColor *fillColor = self.colorForCellFill;
	
	BOOL shouldHideShapeLayer = !self.selected && !self.dateIsToday && !borderColor && !fillColor;
	
	if (self.shapeLayer.opacity == shouldHideShapeLayer) {
		self.shapeLayer.opacity = !shouldHideShapeLayer;
	}
	if (!shouldHideShapeLayer) {
		
		CGColorRef cellFillColor = self.colorForCellFill.CGColor;
		if (!CGColorEqualToColor(self.shapeLayer.fillColor, cellFillColor)) {
			self.shapeLayer.fillColor = cellFillColor;
		}
		
		CGColorRef cellBorderColor = self.colorForCellBorder.CGColor;
		if (!CGColorEqualToColor(self.shapeLayer.strokeColor, cellBorderColor)) {
			self.shapeLayer.strokeColor = cellBorderColor;
		}
		
		CGPathRef path = [UIBezierPath bezierPathWithRoundedRect:self.shapeLayer.bounds
																								cornerRadius:CGRectGetWidth(self.shapeLayer.bounds)*0.5*self.borderRadius].CGPath;
		if (!CGPathEqualToPath(self.shapeLayer.path, path)) {
			self.shapeLayer.path = path;
		}
		
	}
	
	if (![self.image isEqual:self.imageView.image]) {
		self.imageView.image = self.image;
		self.imageView.hidden = !self.image;
	}
	
	if (self.eventIndicator.hidden == (self.numberOfEvents > 0)) {
		self.eventIndicator.hidden = !self.numberOfEvents;
	}
	
	self.eventIndicator.numberOfEvents = self.numberOfEvents;
	self.eventIndicator.color = self.colorsForEvents;
}

- (void)performSelecting {
	[self configureAppearance];
}

- (UIColor *)colorForCellBorder
{
	if (self.selected) {
		return self.preferredBorderSelectionColor ?: self.appearance.borderSelectionColor;
	}
	if (self.dateIsToday) {
		return GREEN_COLOR;
	}
	return self.preferredBorderDefaultColor ?: self.appearance.borderDefaultColor;
}

@end
