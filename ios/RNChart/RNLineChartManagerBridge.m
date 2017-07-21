//  Created by xudong wu on 24/02/2017.
//  Copyright © 2017 wuxudong. All rights reserved.
//

#import "React/RCTViewManager.h"
#import "RNChartManagerBridge.h"
#import "RNYAxisChartManagerBridge.h"
#import "RNBarLineChartManagerBridge.h"
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(RNLineChartManager, RCTViewManager)

- (dispatch_queue_t)methodQueue {
	return dispatch_get_main_queue();
}

EXPORT_BAR_LINE_CHART_BASE_PROPERTIES

@end
