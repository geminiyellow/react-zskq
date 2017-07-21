package com.gaiaworks.gaiaonehandle.canlendar;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.annotation.Nullable;

/**
 * Created by Andy on 2017/6/28.
 */

public class Utils {

    /**
     * 发送通知
     * @param reactContext
     * @param eventName
     * @param params
     */
    public static void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    /**
     * 获取格式化的时间
     * @param date
     * @return
     */
    public static String getTime(Date date){
        return new SimpleDateFormat("yyyy-MM-dd").format(date).toString();
    }

}
