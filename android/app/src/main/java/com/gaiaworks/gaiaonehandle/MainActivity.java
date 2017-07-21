package com.gaiaworks.gaiaonehandle;

import android.content.Intent;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Color;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.Toast;

import com.baidu.mapapi.SDKInitializer;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.gaiaworks.gaiaonehandle.permission.RuntimePermissionHelper;
import com.github.mikephil.charting.utils.HighlightedHelper;
import com.mehcode.reactnative.splashscreen.SplashScreen;
import com.umeng.analytics.MobclickAgent;
import com.umeng.socialize.UMShareAPI;
import com.umeng.socialize.UMShareListener;
import com.umeng.socialize.bean.SHARE_MEDIA;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ArrayBlockingQueue;

import cn.jpush.android.api.JPushInterface;

public class MainActivity extends ReactActivity implements UMShareListener {

    //构建一个阻塞的单一数据的队列
    public static ArrayBlockingQueue<String> mQueue = new ArrayBlockingQueue<String>(1);

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);

        getReactNativeHost().getReactInstanceManager().addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
            @Override
            public void onReactContextInitialized(ReactContext context) {
                getWindow().getDecorView().setBackgroundColor(Color.WHITE);

            }
        });
        setTheme(R.style.AppThemeWhite);
        super.onCreate(savedInstanceState);
        SDKInitializer.initialize(getApplicationContext());
        RuntimePermissionHelper helper = RuntimePermissionHelper.getHelper();
        helper.setContext(this);

        if (!helper.checkSelfLocationPermission()) {
            helper.requestPermissionsForLocation();
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        Bundle bundle = getIntent().getBundleExtra("notification");
        if (bundle != null) {
            JSONObject obj = new JSONObject();
            try {
                obj.put("state", "clock");
                getReactNativeHost().getReactInstanceManager().getCurrentReactContext().
                        getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("REMOTE_NOTIFICATION", obj.toString());
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        ((MainApplication) getApplication()).onNewIntent(intent);
    }

    @Override
    protected String getMainComponentName() {
        return "ZSKQ";
    }

    @Override
    public void onResume() {
        super.onResume();
        MobclickAgent.onResume(this);
    }

    @Override
    public void onPause() {
        super.onPause();
        MobclickAgent.onPause(this);
    }

    @Override
    public Resources getResources() {
        Resources res = super.getResources();
        Configuration config = new Configuration();
        config.setToDefaults();
        res.updateConfiguration(config, res.getDisplayMetrics());
        return res;
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        UMShareAPI.get(this).release();
    }

    @Override
    public void onStart(SHARE_MEDIA share_media) {

    }

    @Override
    public void onResult(SHARE_MEDIA share_media) {
        getReactNativeHost().getReactInstanceManager().getCurrentReactContext().
                getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("SHARE_CODE", "0");
    }

    @Override
    public void onError(SHARE_MEDIA share_media, Throwable throwable) {
        if (throwable != null && !TextUtils.isEmpty(throwable.getMessage())) {
            String temp = throwable.getMessage();
            if (temp.contains("错误信息")) {
                int start = temp.indexOf("错误信息");
                int end = temp.indexOf("点击查看错误");
                temp = temp.substring(start, end);
                getReactNativeHost().getReactInstanceManager().getCurrentReactContext().
                        getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("SHARE_CODE", "1");
                return;
            }
        }
        getReactNativeHost().getReactInstanceManager().getCurrentReactContext().
                getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("SHARE_CODE", "2");
    }

    @Override
    public void onCancel(SHARE_MEDIA share_media) {
        getReactNativeHost().getReactInstanceManager().getCurrentReactContext().
                getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("SHARE_CODE", "3");
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        JSONObject params = new JSONObject();
        try {
            if (newConfig.orientation == Configuration.ORIENTATION_LANDSCAPE) {
                HighlightedHelper.rotateScreen = true;
                params.put("orientation", "landscape");
                Object obj = new Object();
                getReactNativeHost().getReactInstanceManager().getCurrentReactContext().
                        getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("native_device_orientation_did_change_listener", params.toString());
            } else {
                HighlightedHelper.rotateScreen = true;
                params.put("orientation", "portrait");
                getReactNativeHost().getReactInstanceManager().getCurrentReactContext().
                        getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("native_device_orientation_did_change_listener", params.toString());
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}
