package com.gaiaworks.gaiaonehandle.jpush;

import android.app.NotificationManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.gaiaworks.gaiaonehandle.EventSender;
import com.gaiaworks.gaiaonehandle.MainActivity;
import com.gaiaworks.gaiaonehandle.MainApplication;
import com.gaiaworks.gaiaonehandle.RNManagerModule;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;

import cn.jpush.android.api.JPushInterface;

/**
 * Created by dalancon on 2017/3/15.
 */

public class GaiaReceiver extends BroadcastReceiver {
    private static final String TAG = "JPush";

    @Override
    public void onReceive(Context context, Intent intent) {
        Bundle bundle = intent.getExtras();
//        Log.d(TAG, "[MyReceiver] onReceive - " + intent.getAction() + ", extras: " + printBundle(bundle));

        if (JPushInterface.ACTION_REGISTRATION_ID.equals(intent.getAction())) {
            String regId = bundle.getString(JPushInterface.EXTRA_REGISTRATION_ID);
            Log.d(TAG, "[MyReceiver] 接收Registration Id : " + regId);
            //send the Registration Id to your server...

        } else if (JPushInterface.ACTION_MESSAGE_RECEIVED.equals(intent.getAction())) {

        } else if (JPushInterface.ACTION_NOTIFICATION_RECEIVED.equals(intent.getAction())) {
            ((MainApplication) context.getApplicationContext()).getReactNativeHost().getReactInstanceManager().getCurrentReactContext().
                    getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("REMOTE_NOTIFICATION_BADGE_SYNC", true);
            Log.d(TAG, "[MyReceiver] 接收到推送下来的通知");
            int notifactionId = bundle.getInt(JPushInterface.EXTRA_NOTIFICATION_ID);
            Log.d(TAG, "[MyReceiver] 接收到推送下来的通知的ID: " + notifactionId);
//            ((MainApplication) context.getApplicationContext()).getReactNativeHost().getReactInstanceManager().getCurrentReactContext().
//                    getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("REMOTE_NOTIFICATION", bundle.getString(JPushInterface.EXTRA_MESSAGE));
        } else if (JPushInterface.ACTION_NOTIFICATION_OPENED.equals(intent.getAction())) {
            Intent mainIntent = new Intent(context, MainActivity.class);
            RNManagerModule.notificationData = bundle.getString(JPushInterface.EXTRA_EXTRA);
            mainIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(mainIntent);
            Log.d(TAG, "[MyReceiver] 用户点击打开了通知");
            ((MainApplication) context.getApplicationContext()).getReactNativeHost().getReactInstanceManager().getCurrentReactContext().
                    getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("REMOTE_NOTIFICATION", bundle.getString(JPushInterface.EXTRA_EXTRA));
            NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            manager.cancelAll();
        }
    }
}
