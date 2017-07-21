package com.gaiaworks.gaiaonehandle.map;

import android.util.Log;

import com.baidu.location.BDLocation;
import com.baidu.location.BDLocationListener;
import com.baidu.location.LocationClient;

/**
 * Created by emily on 7/22/16.
 */
public class BaiduLocationListener implements BDLocationListener {
    private ReactLocationCallback mCallback;

    public BaiduLocationListener(LocationClient client, ReactLocationCallback callback) {
        this.mCallback = callback;
        if (client != null) {
            client.registerLocationListener(this);
        }
    }

    @Override
    public void onReceiveLocation(BDLocation bdLocation) {
        Log.e("RNBaidumap", "onReceiveLocation.......");
        if (bdLocation == null || bdLocation.getProvince() == null) {
            Log.e("RNBaidumap", "receivedLocation is null!");
            return;
        }
        int locatetype = bdLocation.getLocType();
        Log.e("RNBaidumap", locatetype + "");
        if (locatetype == BDLocation.TypeGpsLocation
                || locatetype == BDLocation.TypeNetWorkLocation
                || locatetype == BDLocation.TypeOffLineLocation) {
            if (this.mCallback != null) {
                this.mCallback.onSuccess(bdLocation);
            }
        } else {
            if (this.mCallback != null) {
                this.mCallback.onFailure(bdLocation);
            }
        }
    }

    @Override
    public void onConnectHotSpotMessage(String s, int i) {

    }


    public interface ReactLocationCallback {
        void onSuccess(BDLocation bdLocation);

        void onFailure(BDLocation bdLocation);
    }
}
