package com.gaiaworks.gaiaonehandle;

/**
 * Created by emily on 7/6/16.
 */

import android.app.Application;
import android.content.Intent;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.support.multidex.MultiDex;
import android.util.Log;

import com.BV.LinearGradient.LinearGradientPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.baidu.location.BDLocation;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.gaiaworks.gaiaonehandle.map.BaiduLocationListener;
import com.gaiaworks.gaiaonehandle.map.BaiduMapReactPackage;
import com.gaiaworks.gaiaonehandle.map.Location;
import com.gaiaworks.gaiaonehandle.map.MyLocationClient;
import com.gaiaworks.gaiaonehandle.table.RNTablePackage;
import com.github.wuxudong.rncharts.MPAndroidChartPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.mehcode.reactnative.splashscreen.SplashScreenPackage;
import com.microsoft.codepush.react.CodePush;
import com.mmazzarolo.beaconsandroid.BeaconsAndroidPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.reactnativecomponent.barcode.RCTCapturePackage;
import com.remobile.des.RCTDesPackage;
import com.squareup.leakcanary.LeakCanary;
import com.umeng.analytics.MobclickAgent;
import com.umeng.socialize.Config;
import com.umeng.socialize.PlatformConfig;
import com.umeng.socialize.UMShareAPI;

import java.util.Arrays;
import java.util.List;

import cn.jpush.android.api.JPushInterface;
import io.realm.react.RealmReactPackage;

public class MainApplication extends Application implements ReactApplication {

    private ReactNativePushNotificationPackage mReactNativePushNotificationPackage; // <------ Add Package Variable
    public static SharedPreferences mSysPer;

    @Override
    public void onCreate() {
        super.onCreate();
        PlatformConfig.setQQZone("1102858930", "jlc7pHCMzmtHMUfl");
        PlatformConfig.setWeixin("wx97df38719ecdb6c3", "589204ce8d949bfd384d050a1ba9ec5f");
        mSysPer = PreferenceManager.getDefaultSharedPreferences(this);
        LeakCanary.install(this);

        MultiDex.install(this);
        initUmeng();

        JPushInterface.setDebugMode(true);
        JPushInterface.init(this);

        MyLocationClient myLocationClient = MyLocationClient.getInstance(this);
        if (myLocationClient != null) {
            new BaiduLocationListener(myLocationClient.getLocationClient(), mLocationCallback);
            myLocationClient.startLocation();
        }
        Config.DEBUG = true;
//        Config.isJumptoAppStore = true;

        UMShareAPI.get(this);

    }

    BaiduLocationListener.ReactLocationCallback mLocationCallback = new BaiduLocationListener.ReactLocationCallback() {
        @Override
        public void onSuccess(BDLocation bdLocation) {
            double latitude = bdLocation.getLatitude();
            double longitude = bdLocation.getLongitude();
            double radius = bdLocation.getRadius();

            String province = bdLocation.getProvince();
            String city = bdLocation.getCity();
            String district = bdLocation.getDistrict();
            String address = bdLocation.getAddrStr();
            String addressNumber = bdLocation.getStreetNumber();

//            if (province != null){
            Location locationEntity = Location.getInstance();
            locationEntity.lat = latitude;
            locationEntity.lng = longitude;
            locationEntity.horizontalAccuracy = radius;
            locationEntity.streetNumber = addressNumber;
            locationEntity.streetName = address;
            locationEntity.districtName = district;
            locationEntity.cityName = city;
            locationEntity.provinceName = province;
//            }
            //  sendEvent("BAIDUMAP_LOCATION_DATA", Location.getInstance().getLocationInfo());
        }

        @Override
        public void onFailure(BDLocation bdLocation) {

        }
    };


    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }


        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        /**
         * A list of packages used by the app. If the app uses additional views
         * or modules besides the default ones, add more packages here.
         */
        @Override
        protected List<ReactPackage> getPackages() {
            mReactNativePushNotificationPackage = new ReactNativePushNotificationPackage(); // <------ Initialize the Package
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new PickerPackage(),
                    new BackgroundTimerPackage(),
                    new RealmReactPackage(),
                    new RNFetchBlobPackage(),
                    new SplashScreenPackage(),
                    new RNDeviceInfo(),
                    new RCTDesPackage(),
                    new ReactNativeI18n(),
                    new CodePush(BuildConfig.CODE_PUSH_KEY, MainApplication.this, BuildConfig.DEBUG, "https://appupdate.gaiaworkforce.com/"),
                    new RNPackage(),
                    new BaiduMapReactPackage(),
                    new RCTCameraPackage(),
                    new BeaconsAndroidPackage(),
                    mReactNativePushNotificationPackage,
                    new MPAndroidChartPackage(),
                    new LinearGradientPackage(),
                    new RCTCapturePackage(),
                    new RNTablePackage()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    // Add onNewIntent
    public void onNewIntent(Intent intent) {
        if (mReactNativePushNotificationPackage != null) {
            // mReactNativePushNotificationPackage.newIntent(intent);
        }
    }

    private void initUmeng() {
        //------------------友盟统计----------------------
        Log.i("MobclickAgent", "友盟开始统计");
        MobclickAgent.setScenarioType(this, MobclickAgent.EScenarioType.E_UM_NORMAL);

        MobclickAgent.openActivityDurationTrack(false);
        MobclickAgent.setDebugMode(true);

        //捕获程序崩溃日志
        MobclickAgent.setCatchUncaughtExceptions(true);
    }


}
