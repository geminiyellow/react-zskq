package com.gaiaworks.gaiaonehandle.map;

import android.content.Context;
import android.util.Log;

import com.baidu.location.LocationClient;
import com.baidu.location.LocationClientOption;
import com.facebook.react.bridge.WritableMap;

/**
 * Created by emily on 7/26/16.
 */
public class MyLocationClient {
    private static MyLocationClient instance = null;
    private LocationClient mLocationClient = null;
    private static Context context;
    private static Object  objLock = new Object();

    private MyLocationClient (Context ctx){
        context = ctx;
        mLocationClient = new LocationClient(ctx);
        LocationClientOption option = new LocationClientOption();
        option.setOpenGps(true); // 打开gps
        option.setCoorType("bd09ll"); // 设置坐标类型
//        option.setScanSpan(10000);
        option.setIsNeedAddress(true);
        option.setIsNeedLocationDescribe(true);
        option.disableCache(true);
        option.setLocationMode(LocationClientOption.LocationMode.Hight_Accuracy);
        mLocationClient.setLocOption(option);
    }

    public static MyLocationClient getInstance(Context context){
        synchronized (MyLocationClient.class) {
            if(instance == null) {
                instance = new MyLocationClient(context);

            }
        }
        return instance;
    }

    public LocationClient getLocationClient(){
        return mLocationClient;
    }

    public void registerLocationListener(BaiduLocationListener listener){
        if (mLocationClient!=null){
            mLocationClient.registerLocationListener(listener);
        }
    }

    public void unRegisterLocationListener(BaiduLocationListener listener){
        if (mLocationClient != null) {
            mLocationClient.unRegisterLocationListener(listener);
        }
    }

    public void startLocation(){
        synchronized (objLock) {
            if (mLocationClient != null) {
                if (!mLocationClient.isStarted()) {
                    Log.e("RNBaidumap", "startLocation " + mLocationClient.toString());
                    mLocationClient.start();
                }
            }
        }
    }

    public void stopLocation(){
        synchronized (objLock) {
            if (mLocationClient != null) {
                Log.e("RNBaidumap", "stopLocation " + mLocationClient.toString());
                mLocationClient.stop();
                mLocationClient = null;
                instance = null;
            }
        }
    }

}



