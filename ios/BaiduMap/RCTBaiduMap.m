//
//  RCTBaiduMap.m
//  ZSKQ
//
//  Created by Tadas.Gao on 16/7/20.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RCTBaiduMap.h"
#import "Location.h"
#import "EventSender.h"
#import "RCTLocationService.h"

static const NSInteger zoomViewTag = 0x999;

@implementation RCTBaiduMap {
  RCTLocationService *_locationService;
  BMKGeoCodeSearch *_geoSearch;
  RCTBaiduMap *_map;
  UIView *_zoomView;
}

+ (instancetype)sharedInstance {
  static RCTBaiduMap *sharedInstance = nil;
  
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [[super alloc] init];
  });
  
  return sharedInstance;
}

- (RCTBaiduMap *)initWithZoomLevel:(float)zoomLevel {
  _map = [RCTBaiduMap sharedInstance];
  _map.zoomLevel = zoomLevel;
  
  UIView *v = [self viewWithTag:zoomViewTag];
  [v removeFromSuperview];

  _zoomView = ({
    UIView *view = [[UIView alloc] initWithFrame:CGRectMake(CGRectGetWidth([UIScreen mainScreen].bounds) - 54, CGRectGetHeight([UIScreen mainScreen].bounds) - 380, 40, 80)];
    view.tag = zoomViewTag;
    view.backgroundColor = [UIColor colorWithRed:31.f/255.f green:214.f/255.f blue:98.f/255.f alpha:0.f];
    
    UIButton *zoomIn = ({
      UIButton *btn = [UIButton buttonWithType:UIButtonTypeCustom];
      btn.frame = CGRectMake(0, 0, 40, 40);
      btn.backgroundColor = [UIColor colorWithPatternImage:[UIImage imageNamed:@"zoom_in"]];
      [btn addTarget:self action:@selector(mapZoomIn) forControlEvents:UIControlEventTouchUpInside];
      btn;
    });
    
    UIButton *zoomOut = ({
      UIButton *btn = [UIButton buttonWithType:UIButtonTypeCustom];
      btn.frame = CGRectMake(0, 40, 40, 40);
      btn.backgroundColor = [UIColor colorWithPatternImage:[UIImage imageNamed:@"zoom_out"]];
      [btn addTarget:self action:@selector(mapZoomOut) forControlEvents:UIControlEventTouchUpInside];
      btn;
    });
    
    [view addSubview:zoomIn];
    [view addSubview:zoomOut];
    
    view;
  });
  
  [_map addSubview:_zoomView];
  
  [_map startLocationService];
  
  return _map;
}

- (void)startLocationService {
  [self stopLocationService];
  
  if (!_locationService) {
    _locationService                 = [RCTLocationService sharedInstance];
    _locationService.desiredAccuracy = kCLLocationAccuracyBestForNavigation;
    _locationService.distanceFilter  = kCLDistanceFilterNone;
    _locationService.delegate        = self;
  }

  [_locationService startUserLocationService];
}

- (void)stopLocationService {
  if (_locationService) {
    [_locationService stopUserLocationService];
  }
}

- (void)mapZoomIn {
  self.zoomLevel += 1;
  
  if (self.zoomLevel > 21) {
    self.zoomLevel = 21;
  }
  
  [self mapForceRefresh];
}

- (void)mapZoomOut {
  self.zoomLevel -= 1;
  
  if (self.zoomLevel < 3) {
    self.zoomLevel = 3;
  }
  
  [self mapForceRefresh];
}

- (void)setAnnotations:(NSArray<RCTBaiduMapAnnotation *> *)annotations {
  [self stopLocationService];
  [self setCenterCoordinate:annotations[0].coordinate];
  
  _zoomView.frame = CGRectMake(CGRectGetWidth([UIScreen mainScreen].bounds) - 54, 190, 40, 80);
  
  BMKPointAnnotation *annotation = [[BMKPointAnnotation alloc] init];
  annotation.coordinate = (CLLocationCoordinate2D){annotations[0].coordinate.latitude, annotations[0].coordinate.longitude};
  annotation.title = annotations[0].title;
  if (annotations[0].subtitle) {
    annotation.subtitle = annotations[0].subtitle;
  }
  
  self.delegate = self;
  
  [self removeAnnotations:self.annotations];
  [self addAnnotation:annotation];
  [self selectAnnotation:annotation animated:YES];
}

#pragma mark - BMKLocationServiceDelegate

- (void)didUpdateBMKUserLocation:(BMKUserLocation *)userLocation {
  [Location sharedInstance].lat = userLocation.location.coordinate.latitude;
  [Location sharedInstance].lng = userLocation.location.coordinate.longitude;
  [Location sharedInstance].horizontalAccuracy = userLocation.location.horizontalAccuracy;
  
  [self updateLocationData:userLocation];
  [self setCenterCoordinate:userLocation.location.coordinate];
  
  _geoSearch = [[BMKGeoCodeSearch alloc] init];
  _geoSearch.delegate = self;
  
  CLLocationCoordinate2D pt = (CLLocationCoordinate2D){[Location sharedInstance].lat, [Location sharedInstance].lng};
  BMKReverseGeoCodeOption *reverseGeoCodeSearchOption = [[BMKReverseGeoCodeOption alloc] init];
  reverseGeoCodeSearchOption.reverseGeoPoint = pt;
  [_geoSearch reverseGeoCode:reverseGeoCodeSearchOption];
}

#pragma mark - BMKGeoCodeSearchDelegate

- (void)onGetReverseGeoCodeResult:(BMKGeoCodeSearch *)searcher result:(BMKReverseGeoCodeResult *)result errorCode:(BMKSearchErrorCode)error {
  if (error == BMK_SEARCH_NO_ERROR) {
    Location *location    = [Location sharedInstance];
    location.provinceName = result.addressDetail.province;
    location.cityName     = result.addressDetail.city;
    location.districtName = result.addressDetail.district;
    location.streetName   = result.addressDetail.streetName;
    location.streetNumber = result.addressDetail.streetNumber;
    
    BMKPointAnnotation *annotation = [[BMKPointAnnotation alloc] init];
    annotation.coordinate = (CLLocationCoordinate2D){location.lat, location.lng};
    annotation.title = location.getLocationInfo[@"address"];
    self.delegate = self;
    
    [self removeAnnotations:self.annotations];
    [self addAnnotation:annotation];
    [self selectAnnotation:annotation animated:YES];
    
    [[EventSender sharedInstance] sendEventWithName:@"BAIDUMAP_LOCATION_DATA" body:location.getLocationInfo];
  }
}

#pragma mark - BMKMapViewDelegate

- (BMKAnnotationView *)mapView:(BMKMapView *)mapView viewForAnnotation:(id<BMKAnnotation>)annotation {
  BMKAnnotationView *annotationView = [[BMKAnnotationView alloc] initWithAnnotation:annotation reuseIdentifier:@"annotation"];
  
  annotationView.annotation = annotation;
  annotationView.image = [UIImage imageNamed:@"pin_green"];
  
  return annotationView;
}

@end
