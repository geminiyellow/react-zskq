package com.gaiaworks.gaiaonehandle.map;

import android.util.Log;
import android.view.View;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * Created by yujie on 16/3/30.
 */
public class BaiduMapViewManager extends ViewGroupManager<MyMapView> implements LifecycleEventListener {
    public static final String RCT_CLASS = "RCTBaiduMapView";

    private MyMapView myMapView;

    @Override
    public String getName() {
        return RCT_CLASS;
    }

    @Override
    protected MyMapView createViewInstance(ThemedReactContext reactContext) {
        reactContext.addLifecycleEventListener(this);
        myMapView = new MyMapView(reactContext);
        return myMapView;
    }

    public MyMapView getMyMapView() {
        return myMapView;
    }

    @ReactProp(name = "annotations")
    public void setAnnotations(MyMapView mapView, ReadableArray value) throws Exception {
        mapView.stopLocation();
        if (value == null || value.size() == 0) {
            return;
        }
        ReadableMap annotation = value.getMap(0);
        double latitude = annotation.getDouble("latitude");
        double longitude = annotation.getDouble("longitude");
        String title = annotation.getString("title");
        if (annotation.hasKey("subtitle")) {
            String subtitle = annotation.getString("subtitle");
            mapView.setMarker(latitude, longitude);
            mapView.setInfoWindow(latitude, longitude, title, subtitle);
        } else {
            mapView.setMarker(latitude, longitude);
            mapView.setInfoWindow(latitude,longitude, title, "");
        }

    }


    @Override
    public void onHostResume() {
        if (myMapView != null) {
            myMapView.onResume();
        }
    }

    @Override
    public void onHostPause() {
        if (myMapView != null) {
            myMapView.stopLocation();
            myMapView.onPause();
        }
    }

    @Override
    public void onHostDestroy() {
        if (myMapView != null) {
            myMapView.stopLocation();
            myMapView.onDestory();
            myMapView = null;
        }
    }

    @Override
    public void addView(MyMapView parent, View child, int index) {
        parent.addView(child, index + 1);
    }
}
