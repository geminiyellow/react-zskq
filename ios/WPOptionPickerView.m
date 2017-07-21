//
//  OptionPickerView.m
//  ZSKQ
//
//  Created by Andy Wu on 5/5/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "WPOptionPickerView.h"
#import "OptionPickerConstant.h"
#import "UIPickerView+Custom.h"

@interface WPOptionPickerView ()<UIPickerViewDataSource, UIPickerViewDelegate>

@property (nonatomic, strong) UIView *containerView;

@property (nonatomic, strong) UIView *pickerContainerView;

@property (nonatomic, strong) UIPickerView *myPickerView;

@property (nonatomic, strong) UIView *pickerTopView;

@property (nonatomic, strong) UIButton *cancelButton;

@property (nonatomic, strong) UIButton *doneButton;

@property (nonatomic, strong) UILabel *titleLabel;

@property (nonatomic, strong) NSString *selectedValue;

@property (nonatomic, assign) NSInteger originalSelectedRow;

// Date picker

@property (nonatomic, copy) NSArray *years;

@property (nonatomic, copy) NSArray *months;

@property (nonatomic, copy) NSString *defaultYear;

@property (nonatomic, copy) NSString *defaultMonth;

@property (nonatomic, assign) NSInteger defaultYearRow;

@property (nonatomic, assign) NSInteger defaultMonthRow;

@end

@implementation WPOptionPickerView

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

- (instancetype)initWithFrame:(CGRect)frame
{
	self = [super initWithFrame:frame];
	if (self) {
		[self addSubview:self.containerView];
	}
	return self;
}

#pragma mark - UIPickerViewDataSource

- (NSInteger)numberOfComponentsInPickerView:(UIPickerView *)pickerView {
	return self.component;
}

- (NSInteger)pickerView:(UIPickerView *)pickerView numberOfRowsInComponent:(NSInteger)component {
	if (self.component == 1) {
		return self.pickerData.count;
	} else if (self.component == 2) {
		if (component == 0) {
			return self.years.count;
		} else if (component == 1) {
			return self.months.count;
		}
	}
	
	return 0;
}

#pragma mark - UIPickerViewDelegate

- (CGFloat)pickerView:(UIPickerView *)pickerView rowHeightForComponent:(NSInteger)component {
	return PICKER_ROW_HEIGHT;
}

- (CGFloat)pickerView:(UIPickerView *)pickerView widthForComponent:(NSInteger)component {
	return SCREEN_WIDTH/self.component;
}

- (UIView *)pickerView:(UIPickerView *)pickerView viewForRow:(NSInteger)row forComponent:(NSInteger)component reusingView:(UIView *)view {
	CGSize rowSize = [pickerView rowSizeForComponent:component];
	CGRect labelRect = CGRectMake(0, 0, rowSize.width+5.0, rowSize.height+3.0);
	UILabel *label = [[UILabel alloc] initWithFrame:labelRect];
	label.textAlignment = NSTextAlignmentCenter;
	label.backgroundColor = [UIColor whiteColor];
	label.font = REGULAR_FONT;
	
	if (row == [pickerView selectedRowInComponent:component]) {
		label.font = BOLD_FONT;
	}
	
	if (self.component == 1) {
		label.text = [NSString stringWithFormat:@"%@", self.pickerData[row]];
		
		if (row == self.originalSelectedRow) {
			label.font = BOLD_FONT;
		}
	} else if (self.component == 2) {
		label.backgroundColor = [UIColor clearColor];

		if (component == 0) {
			label.text = [NSString stringWithFormat:@"%@", self.years[row]];
			
			if (row == self.defaultYearRow) {
				label.font = BOLD_FONT;
			}
		} else if (component == 1) {
			label.text = [NSString stringWithFormat:@"%@", self.months[row]];
			
			if (row == self.defaultMonthRow) {
				label.font = BOLD_FONT;
			}
		}
	}
	
	return label;
}

- (void)pickerView:(UIPickerView *)pickerView didSelectRow:(NSInteger)row inComponent:(NSInteger)component {
	UILabel *label = (UILabel *)[pickerView viewForRow:row forComponent:component];
	label.font = BOLD_FONT;
	
	if (self.component == 1) {
		self.originalSelectedRow = -1;
	}
	
	if (self.component == 2) {
		if (component == 0) {
			NSString *selectedYear = self.years[row];
			self.months = self.dateData[selectedYear];
			[pickerView selectRow:0 inComponent:1 animated:YES];
			
			self.defaultYearRow = -1;
		} else if (component == 1) {
			self.defaultMonthRow = -1;
		}
	}
	
	[pickerView reloadAllComponents];
}

#pragma mark - Event response

- (void)cancel {
	CGRect frame = self.pickerContainerView.frame;
	__weak WPOptionPickerView *weakSelf = self;
	[UIView animateWithDuration:0.4 animations:^{
		CGRect viewRect = CGRectMake(0, frame.origin.y+PICKER_CONTAINER_HEIGHT, frame.size.width, frame.size.height);
		WPOptionPickerView *innerSelf = weakSelf;
		innerSelf.pickerContainerView.frame = viewRect;
		
		innerSelf.containerView.backgroundColor = [UIColor clearColor];
	} completion:^(BOOL finished) {
		WPOptionPickerView *innerSelf = weakSelf;
		innerSelf.onPickerCancel(@{});
	}];
}

- (void)done {
	NSMutableArray *data = [NSMutableArray new];
	if (self.component == 1) {
		NSInteger selectedRow = [self.myPickerView selectedRowInComponent:0];
		NSString *selectedValue = self.pickerData[selectedRow];
		[data addObject:selectedValue];
	} else if (self.component == 2) {
		NSInteger yearRow = [self.myPickerView selectedRowInComponent:0];
		NSString *selectedYear = self.years[yearRow];
		
		NSInteger monthRow = [self.myPickerView selectedRowInComponent:1];
		NSString *selectedMonth = self.months[monthRow];
		
		[data addObject:selectedYear];
		[data addObject:selectedMonth];
	}
	NSDictionary *param = @{@"data": data};
	
	CGRect frame = self.pickerContainerView.frame;
	__weak WPOptionPickerView *weakSelf = self;
	[UIView animateWithDuration:0.4 animations:^{
		CGRect viewRect = CGRectMake(0, frame.origin.y+PICKER_CONTAINER_HEIGHT, frame.size.width, frame.size.height);
		WPOptionPickerView *innerSelf = weakSelf;
		innerSelf.pickerContainerView.frame = viewRect;
		
		innerSelf.containerView.backgroundColor = [UIColor clearColor];
	} completion:^(BOOL finished) {
		WPOptionPickerView *innerSelf = weakSelf;
		innerSelf.onPickerConfirm(param);
	}];
}

#pragma mark - Private methods

- (NSInteger)indexOfValue: (NSString *)value inData: (NSArray *)data {
	
	for (NSInteger i = 0; i < data.count; i++) {
		if ([value isEqualToString:data[i]]) {
			return i;
		}
	}
	
	return 0;
}

- (NSInteger)indexOfDefaultYear: (NSString *)defaultYear inYears: (NSArray *)years {

	for (NSInteger i = 0; i < years.count; i++) {
		if ([defaultYear isEqualToString:years[i]]) {
			return i;
		}
	}
	
	return 0;
}

- (NSInteger)indexOfDefaultMonth: (NSString *)defaultMonth inMonths: (NSArray *)months {
	
	for (NSInteger i = 0; i < months.count; i++) {
		if ([defaultMonth isEqualToString:months[i]]) {
			return i;
		}
	}
	
	return 0;
}

#pragma mark - Getters and setters

- (UIView *)containerView {
	if (_containerView == nil) {
		CGRect viewRect = CGRectMake(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
		_containerView = [[UIView alloc] initWithFrame:viewRect];
		_containerView.backgroundColor = [UIColor colorWithRed:0 green:0 blue:0 alpha:0.5];
		UITapGestureRecognizer *singleTapGestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(cancel)];
		[_containerView addGestureRecognizer:singleTapGestureRecognizer];
		[_containerView addSubview:self.pickerContainerView];
	}
	
	return _containerView;
}

- (UIView *)pickerContainerView {
	if (_pickerContainerView == nil) {
		CGRect viewRect = CGRectMake(0, SCREEN_HEIGHT-PICKER_CONTAINER_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT);
		_pickerContainerView = [[UIView alloc] initWithFrame:viewRect];
		[_pickerContainerView addSubview:self.myPickerView];
		[_pickerContainerView addSubview:self.pickerTopView];
	}
	
	return _pickerContainerView;
}

- (UIView *)pickerTopView {
	if (_pickerTopView == nil) {
		CGRect viewRect = CGRectMake(0, 0, SCREEN_WIDTH, PICKER_TOP_VIEW_HEIGHT);
		_pickerTopView = [[UIView alloc] initWithFrame:viewRect];
		_pickerTopView.backgroundColor = [UIColor whiteColor];
		[_pickerTopView addSubview:self.cancelButton];
		[_pickerTopView addSubview:self.doneButton];
		[_pickerTopView addSubview:self.titleLabel];
	}
	
	return _pickerTopView;
}

- (UIPickerView *)myPickerView {
	if (_myPickerView == nil) {
		CGRect viewRect = CGRectMake(0, PICKER_TOP_VIEW_HEIGHT, SCREEN_WIDTH, PICKER_VIEW_HEIGHT);
		_myPickerView = [[UIPickerView alloc] initWithFrame:viewRect];
		_myPickerView.backgroundColor = [UIColor colorWithRed:238/255.0 green:238/255.0 blue:238/255.0 alpha:1.0];
		_myPickerView.dataSource = self;
		_myPickerView.delegate = self;
		_myPickerView.selectorColor = [UIColor colorWithRed:217/255.0 green:217/255.0 blue:217/255.0 alpha:0.5];
	}
	
	return _myPickerView;
}

- (UIButton *)cancelButton {
	if (_cancelButton == nil) {
		CGRect buttonRect = CGRectMake(0, 0, BUTTON_WIDTH, PICKER_TOP_VIEW_HEIGHT);
		_cancelButton = [[UIButton alloc] initWithFrame:buttonRect];
		[_cancelButton setTitleColor:BUTTON_TITLE_COLOR forState:UIControlStateNormal];
		_cancelButton.titleLabel.font = PICKER_BUTTON_FONT;
		[_cancelButton addTarget:self action:@selector(cancel) forControlEvents:UIControlEventTouchUpInside];
		[_cancelButton setTitleColor:BUTTON_TITLE_COLOR_HIGHLIGHT forState:UIControlStateHighlighted];
		_cancelButton.contentEdgeInsets = UIEdgeInsetsMake(0, 16.0, 0, 9.0);
		_cancelButton.contentHorizontalAlignment = UIControlContentHorizontalAlignmentLeft;
		_cancelButton.titleLabel.lineBreakMode = NSLineBreakByTruncatingTail;
	}
	
	return _cancelButton;
}

- (UIButton *)doneButton {
	if (_doneButton == nil) {
		CGRect buttonRect = CGRectMake(SCREEN_WIDTH-BUTTON_WIDTH, 0, BUTTON_WIDTH, PICKER_TOP_VIEW_HEIGHT);
		_doneButton = [[UIButton alloc] initWithFrame:buttonRect];
		[_doneButton setTitleColor:BUTTON_TITLE_COLOR forState:UIControlStateNormal];
		_doneButton.titleLabel.font = PICKER_BUTTON_FONT;
		[_doneButton addTarget:self action:@selector(done) forControlEvents:UIControlEventTouchUpInside];
		[_doneButton setTitleColor:BUTTON_TITLE_COLOR_HIGHLIGHT forState:UIControlStateHighlighted];
		_doneButton.contentHorizontalAlignment = UIControlContentHorizontalAlignmentRight;
		_doneButton.titleLabel.lineBreakMode = NSLineBreakByTruncatingTail;
		_doneButton.contentEdgeInsets = UIEdgeInsetsMake(0, 9.0, 0, 16.0);
	}
	
	return _doneButton;
}

- (UILabel *)titleLabel {
	if (_titleLabel == nil) {
		CGRect labelRect = CGRectMake(BUTTON_WIDTH, 0, SCREEN_WIDTH-BUTTON_WIDTH*2, PICKER_TOP_VIEW_HEIGHT);
		_titleLabel = [[UILabel alloc] initWithFrame:labelRect];
		_titleLabel.textAlignment = NSTextAlignmentCenter;
		_titleLabel.font = PICKER_TITLE_FONT;
		_titleLabel.textColor = [UIColor colorWithRed:163/255.0 green:163/255.0 blue:163/255.0 alpha:1.0];
		_titleLabel.lineBreakMode = NSLineBreakByTruncatingTail;
	}
	
	return _titleLabel;
}

- (void)setPickerData:(NSArray *)pickerData {
	_pickerData = [pickerData copy];
	
	if (pickerData == nil) {
		return;
	}
	
	if (self.component == 1 && self.selectedValue ) {
		NSInteger index = [self indexOfValue:self.selectedValue inData:pickerData];
		[self.myPickerView reloadComponent:0];
		[self.myPickerView selectRow:index inComponent:0 animated:YES];
		self.originalSelectedRow = [self.myPickerView selectedRowInComponent:0];
	}
}

- (void)setValue:(NSArray *)value {
	_value = [value copy];
	
	if (value == nil || value.count < 1) {
		return;
	}
	
	if (self.component == 1 && self.pickerData) {
		self.selectedValue = value[0];
		self.originalSelectedRow = [self indexOfValue:self.selectedValue inData:self.pickerData];
		[self.myPickerView reloadAllComponents];
		[self.myPickerView selectRow:self.originalSelectedRow inComponent:0 animated:YES];
	} else if (self.component == 2) {
		NSString *defaultYear = value[0];
		NSString *defaultMonth = value[1];
		self.defaultYear = defaultYear;
		self.defaultMonth = defaultMonth;
	}
}

- (void)setCancelButtonTitle:(NSString *)cancelButtonTitle {
	_cancelButtonTitle = [cancelButtonTitle copy];
	
	[self.cancelButton setTitle:_cancelButtonTitle forState:UIControlStateNormal];
}

- (void)setDoneButtonTitle:(NSString *)doneButtonTitle {
	_doneButtonTitle = [doneButtonTitle copy];
	
	[self.doneButton setTitle:_doneButtonTitle forState:UIControlStateNormal];
}

- (void)setTitle:(NSString *)title {
	_title = [title copy];
	
	self.titleLabel.text = _title;
}

- (void)setComponent:(NSInteger)component {
	_component = component;
}

- (void)setDateData:(NSDictionary *)dateData {
	_dateData = [dateData copy];
	
	if (dateData == nil) {
		return;
	}
	
	self.years = [dateData.allKeys sortedArrayUsingSelector:@selector(compare:)];
}

- (void)setYears:(NSArray *)years {
	_years = [years copy];
	
	if (self.defaultYear) {
		NSInteger row = [self indexOfDefaultYear:self.defaultYear inYears:years];
		self.defaultYearRow = row;

		[self.myPickerView reloadComponent:0];
		[self.myPickerView selectRow:row inComponent:0 animated:YES];
		
		self.months = self.dateData[self.defaultYear];
	}
}

- (void)setMonths:(NSArray *)months {
	_months = months;
	
	if (self.defaultMonth) {
		NSInteger row = [self indexOfDefaultMonth:self.defaultMonth inMonths:months];
		self.defaultMonthRow = row;

		[self.myPickerView reloadComponent:1];
		[self.myPickerView selectRow:row inComponent:1 animated:YES];
	}
}

- (void)setDefaultYear:(NSString *)defaultYear {
	_defaultYear = defaultYear;
	
	if (self.years) {
		NSInteger row = [self indexOfDefaultYear:self.defaultYear inYears:self.years];
		self.defaultYearRow = row;
		
		[self.myPickerView reloadComponent:0];
		[self.myPickerView selectRow:row inComponent:0 animated:YES];
		
		self.months = self.dateData[self.defaultYear];
	}
}

- (void)setDefaultMonth:(NSString *)defaultMonth {
	_defaultMonth = defaultMonth;
	
	if (self.months) {
		NSInteger row = [self indexOfDefaultMonth:self.defaultMonth inMonths:self.months];
		self.defaultMonthRow = row;
		
		[self.myPickerView reloadComponent:1];
		[self.myPickerView selectRow:row inComponent:1 animated:YES];
	}
}

@end
