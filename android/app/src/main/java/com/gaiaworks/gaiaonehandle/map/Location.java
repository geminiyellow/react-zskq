package com.gaiaworks.gaiaonehandle.map;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

/**
 * Created by emily on 7/19/16.
 */
public class Location {
    private static Location location = null; //声明一个Location类的引用
    private Location(){ //将构造方法私有
    }

    public static Location getInstance(){
        synchronized (Location.class) {
            if (location == null) {
                location = new Location();
            }
            return location;
        }
    }

    //纬度
    public double lat;
    //经度
    public double lng;
    //水平精度
    public double horizontalAccuracy;
    //街道号码
    public String streetNumber;
    //街道名称
    public String streetName;
    //区县名称
    public String districtName;
    //城市名称
    public String cityName;
    //省份名称
    public String provinceName;

    public WritableMap getLocationInfo(){
        WritableMap params = Arguments.createMap();
        params.putDouble("lat", this.lat);
        params.putDouble("lng", this.lng);
        params.putDouble("radius", this.horizontalAccuracy);
        params.putString("address", this.streetName);

        return params;
    }


}
