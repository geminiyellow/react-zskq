//
//  OptionPickerConstant.h
//  ZSKQ
//
//  Created by Andy Wu on 5/5/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#ifndef OptionPickerConstant_h
#define OptionPickerConstant_h

// Screen size

#define SCREEN_WIDTH ([UIScreen mainScreen].bounds.size.width)

#define SCREEN_HEIGHT ([UIScreen mainScreen].bounds.size.height)

// Picker size

#define PICKER_VIEW_HEIGHT 198.0

#define PICKER_TOP_VIEW_HEIGHT 36.0

#define PICKER_CONTAINER_HEIGHT (PICKER_VIEW_HEIGHT+PICKER_TOP_VIEW_HEIGHT)

#define PICKER_ROW_HEIGHT 39.0

#define BUTTON_WIDTH 80.0

// Color

#define BUTTON_TITLE_COLOR ([UIColor colorWithRed:20/255.0 green:190/255.0 blue:75/255.0 alpha:1.0])

#define BUTTON_TITLE_COLOR_HIGHLIGHT ([UIColor colorWithRed:20/255.0 green:190/255.0 blue:75/255.0 alpha:0.5])

// Font

// 苹方字体在iOS 9之前的系统里不能使用
//#define REGULAR_FONT ([UIFont fontWithName:@"PingFangSC-Regular" size:15])
#define REGULAR_FONT ([UIFont systemFontOfSize:15.0])

//#define BOLD_FONT ([UIFont fontWithName:@"PingFangSC-Semibold" size:16])
#define BOLD_FONT ([UIFont boldSystemFontOfSize:16.0])

//#define PICKER_BUTTON_FONT ([UIFont fontWithName:@"PingFangSC-Regular" size:16])
#define PICKER_BUTTON_FONT ([UIFont systemFontOfSize:16.0])

//#define PICKER_TITLE_FONT ([UIFont fontWithName:@"PingFangSC-Regular" size:14])
#define PICKER_TITLE_FONT ([UIFont systemFontOfSize:14.0])

#endif /* OptionPickerConstant_h */
