package com.gaiaworks.gaiaonehandle.map;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by emily on 8/19/16.
 */

public class BaiduMapModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
    private BaiduMapViewManager mBaiduMapViewManager;
    MyMapView myMapView;

    public BaiduMapModule(ReactApplicationContext reactContext, BaiduMapViewManager baiduMapViewManager) {
        super(reactContext);
        mBaiduMapViewManager = baiduMapViewManager;
    }

    @Override
    public String getName() {
        return "RCTBaiduMapModule";
    }

    @ReactMethod
    public void onPause() {
        if (myMapView != null) {
            myMapView.onPause();
        }
    }

    @ReactMethod
    public void onResume() {
        if (myMapView != null) {
            myMapView.onResume();
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
            myMapView.onPause();
        }
    }

    @Override
    public void onHostDestroy() {
        if (myMapView != null){
            myMapView.stopLocation();
            myMapView = null;
        }
        if(mBaiduMapViewManager!=null){
            mBaiduMapViewManager = null;
        }
    }
}
