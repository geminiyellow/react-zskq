//
//  RCTBaiduMap.h
//  ZSKQ
//
//  Created by Tadas.Gao on 16/7/20.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <BaiduMapAPI_Base/BMKBaseComponent.h>
#import <BaiduMapAPI_Map/BMKMapComponent.h>
#import <BaiduMapAPI_Location/BMKLocationComponent.h>
#import <BaiduMapAPI_Search/BMKSearchComponent.h>
#import "RCTBaiduMapAnnotation.h"

@interface RCTBaiduMap : BMKMapView<BMKMapViewDelegate, BMKLocationServiceDelegate, BMKGeoCodeSearchDelegate>

+ (instancetype)sharedInstance;

- (RCTBaiduMap *)initWithZoomLevel:(float)zoomLevel;

- (void)startLocationService;

- (void)stopLocationService;

- (void)setAnnotations:(NSArray<RCTBaiduMapAnnotation *> *)annotations;

@end
