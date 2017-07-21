package com.gaiaworks.gaiaonehandle;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

/**
 * Created by emily on 5/18/16.
 */
public class EventSender {
    private static EventSender eventSender = null;
    private static ReactApplicationContext context = null;

    public EventSender(ReactApplicationContext ctx){
        context = ctx;
    }

    public static EventSender getInstance(ReactApplicationContext ctx){
        if(null == eventSender){
            eventSender = new EventSender(ctx);
        }
        return eventSender;
    }

    public void sendEvent(String eventName, WritableMap eventMap){
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class) .emit(eventName, eventMap);
    }
}
