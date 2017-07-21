package com.gaiaworks.gaiaonehandle.map;


import android.content.Context;
import android.text.TextUtils;
import android.util.Log;
import android.view.WindowManager;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.baidu.location.BDLocation;
import com.baidu.mapapi.map.BaiduMap;
import com.baidu.mapapi.map.BitmapDescriptor;
import com.baidu.mapapi.map.BitmapDescriptorFactory;
import com.baidu.mapapi.map.InfoWindow;
import com.baidu.mapapi.map.MapStatus;
import com.baidu.mapapi.map.MapStatusUpdateFactory;
import com.baidu.mapapi.map.MapView;
import com.baidu.mapapi.map.Marker;
import com.baidu.mapapi.map.MarkerOptions;
import com.baidu.mapapi.map.MyLocationConfiguration;
import com.baidu.mapapi.map.OverlayOptions;
import com.baidu.mapapi.model.LatLng;
import com.gaiaworks.gaiaonehandle.R;

/**
 * Created by emily on 7/21/16.
 */
public class MyMapView extends RelativeLayout {
    MapView mMapView;
    BitmapDescriptor mCurrentMarker;
    BaiduMap mBaiduMap;
    private InfoWindow mInfoWindow;
    private MyLocationClient myLocationClient = null;
    BaiduLocationListener listener = null;
    private Context context;
    private Marker marker;

    public MyMapView(Context ctx) {
        super(ctx,null);
        context = ctx;
        if(mMapView == null) {
            mMapView = new MapView(ctx);
        }
        mBaiduMap = mMapView.getMap();
        this.addView(mMapView);
    }

    public void onDestory(){
        if(myLocationClient != null){
            myLocationClient.unRegisterLocationListener(listener);
            myLocationClient.stopLocation();
        }
        if (mMapView !=null){
            mMapView.onDestroy();
        }
    }

    public void onResume(){
        if(myLocationClient != null) {
            myLocationClient.registerLocationListener(listener);
            myLocationClient.startLocation();
        }
        if (mMapView !=null) {
            mMapView.onResume();
        }
    }

    public void onPause(){
        if(myLocationClient != null) {
            myLocationClient.unRegisterLocationListener(listener);
            myLocationClient.stopLocation();
        }
        if (mMapView !=null) {
            mMapView.onPause();
        }
    }

    private void initMap() {
        Location locationEntity = Location.getInstance();
        double initLat = locationEntity.lat;
        double initLng = locationEntity.lng;
        String province = locationEntity.provinceName;
        String city = locationEntity.cityName;
        String district = locationEntity.districtName;
        String addressNumber = locationEntity.streetNumber;
        String address = locationEntity.streetName;
        setMarker(initLat, initLng);

        if(!TextUtils.isEmpty(province)){
            String initTx1 = province + " " + city + " " + district;
            String initTx2 = null;
            if(addressNumber != null) {
                if (address.contains(addressNumber)) {
                    initTx2 = address;
                } else {
                    initTx2 = address + addressNumber;
                }
            }else{
                initTx2 = address;
            }
            setInfoWindow(initLat,initLng,initTx1,initTx2);
        }
    }

    public void startLocation(){
        // 开启定位图层
        mBaiduMap.setMyLocationEnabled(true);
        // 开启室内定位
        mBaiduMap.setIndoorEnable(true);

        mBaiduMap.setMyLocationConfigeration(new MyLocationConfiguration(MyLocationConfiguration.LocationMode.NORMAL, true, null));

        myLocationClient = MyLocationClient.getInstance(context);

        listener = new BaiduLocationListener(myLocationClient.getLocationClient(), new BaiduLocationListener.ReactLocationCallback(){
            @Override
            public void onSuccess(BDLocation bdLocation) {
                double latitude = bdLocation.getLatitude();
                double longitude = bdLocation.getLongitude();
                LatLng pt = new LatLng(latitude,longitude);
                int satelliteNumber = bdLocation.getSatelliteNumber();
                double radius = bdLocation.getRadius();

                String country = bdLocation.getCountry();
                String province = bdLocation.getProvince();
                String city = bdLocation.getCity();
                String district = bdLocation.getDistrict();
                String address = bdLocation.getAddrStr();
                String addressNumber = bdLocation.getStreetNumber();
                String building = bdLocation.getBuildingName();

                if(province != null) {
                    Location locationEntity = Location.getInstance();
                    locationEntity.lat = latitude;
                    locationEntity.lng = longitude;
                    locationEntity.horizontalAccuracy = radius;
                    locationEntity.streetNumber = addressNumber;
                    locationEntity.streetName = address;
                    locationEntity.districtName = district;
                    locationEntity.cityName = city;
                    locationEntity.provinceName =province;

                    setMarker(latitude, longitude);

                    String infoWindowTx1 = province + " " + city + " " + district;
                    String infoWindowTx2;
                    if(addressNumber != null) {
                        if (address.contains(addressNumber)) {
                            infoWindowTx2 = address;
                        } else {
                            infoWindowTx2 = address + addressNumber;
                        }
                    }else{
                        infoWindowTx2 = address;
                    }
                    setInfoWindow(latitude,longitude,infoWindowTx1,infoWindowTx2);
                }
            }

            @Override
            public void onFailure(BDLocation bdLocation) {
                Log.e("RNBaidumap", "error: " + bdLocation.getLocType());
            }
        });

        myLocationClient.registerLocationListener(listener);
        myLocationClient.startLocation();
    }

    public void stopLocation(){
        if(myLocationClient != null) {
            myLocationClient.stopLocation();
        }
    }

    public void setMarker(double lat, double lng){
        if (marker != null){
            marker.remove();
        }
        LatLng pt = new LatLng(lat, lng);
        // 修改为自定义marker
        mCurrentMarker = BitmapDescriptorFactory.fromResource(R.drawable.icon_gcoding);

        //构建MarkerOption，用于在地图上添加Marker
        OverlayOptions option = new MarkerOptions()
                .position(pt)
                .icon(mCurrentMarker)
                .zIndex(9);
        //在地图上添加Marker，并显示
        marker = (Marker) mBaiduMap.addOverlay(option);

        MapStatus.Builder builder = new MapStatus.Builder();
        builder.target(pt).zoom(18.0f);
        mBaiduMap.animateMapStatus(MapStatusUpdateFactory.newMapStatus(builder.build()));
    }

    public void setInfoWindow(double lat, double lng, String text1, String text2){
        LatLng pt = new LatLng(lat, lng);
        //创建InfoWindow展示的view
        LinearLayout wrapperLayout = new LinearLayout(context);
        wrapperLayout.setBackgroundResource(R.drawable.infowindow_bg);
        wrapperLayout.setPadding(15,15,10,15);
        WindowManager wm = (WindowManager) getContext().getSystemService(Context.WINDOW_SERVICE);
        wrapperLayout.setOrientation(LinearLayout.VERTICAL);

        int width = wm.getDefaultDisplay().getWidth() / 4;

        TextView tx = new TextView(context);
        tx.setMaxWidth(3*width);
        tx.setSingleLine();
        tx.setEllipsize(TextUtils.TruncateAt.END);
        tx.setText(text1);
        tx.setTextColor(context.getResources().getColor(R.color.textColor1));
        tx.setTextSize(16);
        wrapperLayout.addView(tx);

        TextView tx2 = new TextView(context);
        tx2.setMaxWidth(3*width);
        tx2.setSingleLine();
        tx2.setText(text2);
        tx2.setTextColor(context.getResources().getColor(R.color.textColor2));
        tx2.setTextSize(14);
        wrapperLayout.addView(tx2);

        InfoWindow.OnInfoWindowClickListener listener = new InfoWindow.OnInfoWindowClickListener() {
            @Override
            public void onInfoWindowClick() {
            }
        };

        //创建InfoWindow , 传入 view， 地理坐标， y 轴偏移量
        mInfoWindow = new InfoWindow(BitmapDescriptorFactory.fromView(wrapperLayout), pt, -80, listener);
        mBaiduMap.showInfoWindow(mInfoWindow);
    }

}
