package com.gaiaworks.gaiaonehandle;


import android.widget.Toast;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.gaiaworks.gaiaonehandle.userinfo.RNUserInfo;


/**
 * Created by emily on 6/27/16.
 */
public class RNKeychainManagerModule extends ReactContextBaseJavaModule{
    private DeviceIdManager deviceIdManager = new DeviceIdManager(getReactApplicationContext());

    public RNKeychainManagerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNKeychainManager";
    }

    @ReactMethod
    public void showMessage(String message){
        if(getReactApplicationContext() != null){
            Toast.makeText(getReactApplicationContext(),message,Toast.LENGTH_SHORT).show();
        }
    }

    @ReactMethod
    public void getDeviceId(Callback successCallback){
        successCallback.invoke(deviceIdManager.DeviceInfoByMD5());
    }

    /**
     * @Desc 获取保存在SD卡中的用户信息
     * @Author Ares
     */
    @ReactMethod
    public void getUserInfo(Callback successCallback) {
        successCallback.invoke(RNUserInfo.initInstance().readUserInfoFromSD());
    }

}
