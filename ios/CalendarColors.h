//
//  CalendarColors.h
//  ZSKQ
//
//  Created by Andy Wu on 6/26/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#ifndef CalendarColors_h
#define CalendarColors_h

/// Green color of regular schedule
#define GREEN_COLOR [UIColor colorWithRed:20/255.0 green:190/255.0 blue:75/255.0 alpha:1.0]
/// Gray color of weekday
#define GRAY_COLOR [UIColor colorWithRed:168/255.0 green:168/255.0 blue:168/255.0 alpha:1.0]
/// Default font color of calendar
#define DEFAULT_COLOR [UIColor colorWithRed:44/255.0 green:44/255.0 blue:44/255.0 alpha:1.0]
/// Gray color of off schedule
#define OFF_SCHEDULE_GRAY_COLOR [UIColor colorWithRed:166/255.0 green:166/255.0 blue:166/255.0 alpha:1.0]
/// Orange
#define ORANGE_COLOR [UIColor colorWithRed:255/255.0 green:249/255.0 blue:242/255.0 alpha:1.0]

#define UIColorFromRGB(rgbValue) [UIColor colorWithRed:((float)((rgbValue & 0xFF0000) >> 16))/255.0 green:((float)((rgbValue & 0xFF00) >> 8))/255.0 blue:((float)(rgbValue & 0xFF))/255.0 alpha:1.0];

#endif /* CalendarColors_h */
