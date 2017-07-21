package com.gaiaworks.gaiaonehandle;

import android.annotation.TargetApi;
import android.app.KeyguardManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.hardware.fingerprint.FingerprintManager;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.os.CancellationSignal;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.provider.Settings;
import android.telecom.Call;
import android.text.TextUtils;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.WindowManager;
import android.widget.Toast;

import com.baidu.location.BDLocation;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.PixelUtil;
import com.gaiaworks.gaiaonehandle.HttpGlin.Params;
import com.gaiaworks.gaiaonehandle.HttpGlin.Result;
import com.gaiaworks.gaiaonehandle.HttpGlin.call.GetCall;
import com.gaiaworks.gaiaonehandle.HttpGlin.call.JsonCall;
import com.gaiaworks.gaiaonehandle.HttpGlin.call.PostCall;
import com.gaiaworks.gaiaonehandle.HttpGlin.reqclient.OkClient;
import com.gaiaworks.gaiaonehandle.map.BaiduLocationListener;
import com.gaiaworks.gaiaonehandle.map.Location;
import com.gaiaworks.gaiaonehandle.map.MyLocationClient;
import com.gaiaworks.gaiaonehandle.okhttp.OkHttpClientProvider;
import com.gaiaworks.gaiaonehandle.permission.RuntimePermissionHelper;
import com.github.mikephil.charting.utils.HighlightedHelper;
import com.kaopiz.kprogresshud.KProgressHUD;
import com.umeng.socialize.ShareAction;
import com.umeng.socialize.bean.SHARE_MEDIA;
import com.umeng.socialize.media.UMImage;
import com.umeng.socialize.media.UMWeb;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;

import javax.annotation.Nullable;

import cn.jpush.android.api.JPushInterface;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

/**
 * Created by emily on 5/17/16.
 */
public class RNManagerModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
    private MyLocationClient myLocationClient = null;
    private KProgressHUD hud;
    public static String notificationData = "";

    private final ReactApplicationContext mReactContext;
    public static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");


    // 指纹识别
    private FingerprintManager mFingerprintManager;
    private CancellationSignal mCancellationSignal;

    private Handler mhandler = new Handler(Looper.getMainLooper()) {
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            supportAutorotate();
        }
    };

    public RNManagerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
        // 初始化指纹识别服务
        initObject();
    }

    /**
     * 向react js文件传递参数, js中获取方式 RNManager.KEY
     *
     * @return 返回Map格式的变量集
     */
    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        return super.getConstants();
    }

    @Override
    public String getName() {
        return "RNManager";
    }

    @ReactMethod
    public void show(String message, int duration) {
        if (getReactApplicationContext() == null) return;
        Toast.makeText(getReactApplicationContext(), message, duration).show();
    }

    @ReactMethod
    public void showMessage(String message) {
        if (getReactApplicationContext() == null) return;
        Toast.makeText(getReactApplicationContext(), message, Toast.LENGTH_SHORT).show();
    }

    @ReactMethod
    public void getCurrentLanguage(Callback callback) {
        Locale current = getReactApplicationContext().getResources().getConfiguration().locale;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            callback.invoke(current.toLanguageTag());
        } else {
            StringBuilder builder = new StringBuilder();
            builder.append(current.getLanguage());
            if (current.getCountry() != null) {
                builder.append("-");
                builder.append(current.getCountry());
            }
            callback.invoke(builder.toString());
        }
    }

    /**
     * 获取状态栏高度
     *
     * @param callback
     */
    @ReactMethod
    public void getStatusBarHeight(Callback callback) {
        int statusHeight = -1;
        try {
            Class clazz = Class.forName("com.android.internal.R$dimen");
            Object object = clazz.newInstance();
            int height = Integer.parseInt(clazz.getField("status_bar_height")
                    .get(object).toString());
            statusHeight = getReactApplicationContext().getResources().getDimensionPixelSize(height);
            callback.invoke(PixelUtil.toDIPFromPixel(statusHeight));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * RNManager.showLoading(string);
     */
    @ReactMethod
    public void showLoading(String labelText) {
        if (getCurrentActivity() == null) return;
        if (hud == null) {
            hud = KProgressHUD.create(getCurrentActivity())
                    .setStyle(KProgressHUD.Style.SPIN_INDETERMINATE);
        }
        if (labelText.length() > 0 && labelText != "" && labelText != null && !TextUtils.isEmpty(labelText)) {
            hud.setLabel(labelText).setCancellable(true);
        } else {
            hud.setLabel(null);
        }
        if (getCurrentActivity().isFinishing()) return;
        if (!hud.isShowing())
            hud.show();
    }

    /**
     * RNManager.hideLoading()
     */
    @ReactMethod
    public void hideLoading() {
        if (hud != null && hud.isShowing()) {
            hud.dismiss();
            hud = null;
        }
    }

    /**
     * 用来判断设备蓝牙是否开启
     */
    @ReactMethod
    public void bluetoothEnabled(Callback successCallback) {
        successCallback.invoke(isBluetoothEnable());
    }

    private boolean isBluetoothEnable() {
        if (BluetoothManager.isBluetoothSupported() && BluetoothManager.isBluetoothEnabled()) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 开启蓝牙
     */
    @ReactMethod
    public void openBluetooth() {
        BluetoothManager.turnOnBluetooth();
    }

    /**
     * 判断GPS是否开启
     */
    @ReactMethod
    public void GPSEnabled(Callback successCallback) {
        if (getReactApplicationContext() == null) return;
        successCallback.invoke(isGpsEnable(getReactApplicationContext()));
    }

    private boolean isGpsEnable(Context context) {
        LocationManager locationManager = ((LocationManager) context.getSystemService(context.LOCATION_SERVICE));
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
    }

    @ReactMethod
    public void remoteNotificatioinInfo(Callback callback) {
        callback.invoke(notificationData);
    }

    @ReactMethod
    public void emptyNotificationInfo() {
        notificationData = "";
    }

    /**
     * 打开GPS
     */
    @ReactMethod
    public void openGPS() {
        if (getCurrentActivity() == null) return;
        Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        getCurrentActivity().startActivityForResult(intent, 0);
    }

    /**
     * 判断wifi是否开启
     */
    @ReactMethod
    public void wifiEnabled(Callback successCallback) {
        if (getReactApplicationContext() == null) return;
        successCallback.invoke(isWifiEnable(getReactApplicationContext()));
    }

    private boolean isWifiEnable(Context context) {
        WifiManager wifiManager = (WifiManager) context.getSystemService(context.WIFI_SERVICE);
        return wifiManager.isWifiEnabled();
    }

    @ReactMethod
    public void cameraEnabled(Callback callback) {

    }


    /**
     * 开启wifi
     */
    @ReactMethod
    public void openWifi() {
        if (getCurrentActivity() == null) return;
        if (android.os.Build.VERSION.SDK_INT > 10) {
            // 3.0以上打开设置界面，也可以直接用ACTION_WIRELESS_SETTINGS打开到wifi界面
            getCurrentActivity().startActivity(new Intent(android.provider.Settings.ACTION_SETTINGS));
        } else {
            getCurrentActivity().startActivity(new Intent(android.provider.Settings.ACTION_WIRELESS_SETTINGS));
        }
    }

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }


    /**
     * 用来向react js文件发送消息
     *
     * @param eventName String类型的事件名称
     * @param eventMap  封装成map格式的,需要传递过去的参数
     */
    private void sendEvent(String eventName, WritableMap eventMap) {
        if (getReactApplicationContext() == null) return;
        EventSender eventSender = new EventSender(getReactApplicationContext());
        eventSender.sendEvent(eventName, eventMap);
    }


    BaiduLocationListener.ReactLocationCallback mLocationCallback = new BaiduLocationListener.ReactLocationCallback() {
        @Override
        public void onSuccess(BDLocation bdLocation) {
            Log.e("RNBaidumap", "module location success");
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
            emitError("unable to locate, locType = " + bdLocation.getLocType());
        }
    };

    private void emitError(String error) {
        if (getReactApplicationContext() == null) return;
        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("kkLocationError", error);
    }

    @ReactMethod
    public void startLocationService() {
        if (getReactApplicationContext() == null) return;
        RuntimePermissionHelper helper = RuntimePermissionHelper.getHelper();
        if (!helper.checkSelfLocationPermission()) {
            helper.requestPermissionsForLocation();
        }
        myLocationClient = MyLocationClient.getInstance(getReactApplicationContext().getApplicationContext());
        if (myLocationClient != null) {
            Log.e("RNBaidumap", "startLocationService " + myLocationClient.toString());
            new BaiduLocationListener(myLocationClient.getLocationClient(), mLocationCallback);
            myLocationClient.startLocation();
        }
    }

    @ReactMethod
    public void stopLocationService() {
        if (getReactApplicationContext() == null) return;
        myLocationClient = MyLocationClient.getInstance(getReactApplicationContext().getApplicationContext());
        if (myLocationClient != null) {
            Log.e("RNBaidumap", "stopLocationService " + myLocationClient.toString());
            myLocationClient.stopLocation();
        }
    }

    @ReactMethod
    public void getLocation(Callback successCallback) {
        successCallback.invoke(Location.getInstance().getLocationInfo());
    }

    @ReactMethod
    public void getScreenSize(Callback successCallback) {
        if (getCurrentActivity() == null) return;
        DisplayMetrics metrics = new DisplayMetrics();
        getCurrentActivity().getWindowManager().getDefaultDisplay().getMetrics(metrics);
        int width = metrics.widthPixels;
        int height = metrics.heightPixels;
        WritableMap params = Arguments.createMap();
        params.putDouble("screenWidth", width);
        params.putDouble("screenHeight", height);
        successCallback.invoke(params);

    }

    @ReactMethod
    public void resumePush() {
        if (getReactApplicationContext() == null) return;
        if (JPushInterface.isPushStopped(getReactApplicationContext())) {
            JPushInterface.resumePush(getReactApplicationContext());
        }
    }

    @ReactMethod
    public void RegistrationId(Callback success) {
        success.invoke(JPushInterface.getRegistrationID(getReactApplicationContext()));
    }

    @ReactMethod
    public void stopJPushService() {
        if (!JPushInterface.isPushStopped(getReactApplicationContext())) {
            JPushInterface.stopPush(getReactApplicationContext());
        }
    }

    @ReactMethod
    public void shareApp(String title, String desc) {
        UMWeb web = new UMWeb("https://mobilecenter.gaiaworkforce.com/download.jsp");
        web.setTitle(title);//标题
        UMImage thumb = new UMImage(getCurrentActivity(), R.drawable.share_icon);
        web.setThumb(thumb);  //缩略图
        web.setDescription(desc);//描述
        new ShareAction(getCurrentActivity()).withMedia(web).setDisplayList(SHARE_MEDIA.QQ, SHARE_MEDIA.WEIXIN, SHARE_MEDIA.SMS).setCallback((MainActivity) getCurrentActivity()).open();
    }

    @ReactMethod
    public void TelePhone(String tel) {
        //用intent启动拨打电话
        Intent intent = new Intent(Intent.ACTION_DIAL, Uri.parse("tel:" + tel));
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getCurrentActivity().startActivity(intent);
    }

    @ReactMethod
    public void openURL(String url) {
        Intent intent = new Intent();
        intent.setAction("android.intent.action.VIEW");
        Uri content_url = Uri.parse(url);
        intent.setData(content_url);
        getCurrentActivity().startActivity(intent);
    }

    @ReactMethod
    public void rotateScreenLandscape() {
        getCurrentActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        mhandler.removeMessages(0);
        mhandler.sendEmptyMessageDelayed(0, 3000);
    }

    @ReactMethod
    public void rotateScreenPortrait() {
        getCurrentActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        mhandler.removeMessages(0);
        mhandler.sendEmptyMessageDelayed(0, 3000);
    }

    @ReactMethod
    public void supportAutorotate() {
        Settings.System.putInt(getReactApplicationContext().getContentResolver(), Settings.System.ACCELEROMETER_ROTATION, 1);
        getCurrentActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_FULL_SENSOR);
    }

    @ReactMethod
    public void disableAutorotate() {
        HighlightedHelper.rotateScreen = false;
        getCurrentActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        Settings.System.putInt(getReactApplicationContext().getContentResolver(), Settings.System.ACCELEROMETER_ROTATION, 0);
    }


    @ReactMethod
    public void changeInputType(int type) {
        if (getCurrentActivity() == null) {
            return;
        }
        if (type == 1) {
            getCurrentActivity().runOnUiThread(
                    new Runnable() {
                        @Override
                        public void run() {
                            getCurrentActivity().getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN);
                        }
                    }
            );
        } else {
            getCurrentActivity().runOnUiThread(
                    new Runnable() {
                        @Override
                        public void run() {
                            getCurrentActivity().getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
                        }
                    }
            );
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////

    /***
     * modify by arespan
     * modify time 2017-04-26 23:21
     */

    @ReactMethod
    public void canEvaluatePolicy(Callback successCallback) {
        if (Double.parseDouble(Build.VERSION.SDK) >= 23) {
            // 首先需要androidAPI版本大于23，即APP 6.0之后系统
            if (isSupport()) {
                successCallback.invoke(true);
            } else {
                successCallback.invoke(false);
            }
        } else {
            successCallback.invoke(false);
        }
    }

    @TargetApi(23)
    private boolean isSupport() {
        FingerprintManager manager = (FingerprintManager) mReactContext.getSystemService(Context.FINGERPRINT_SERVICE);
        // 增加指纹录入判断，没有录入指纹即表示没有开启指纹识别
        KeyguardManager mKeyManager = (KeyguardManager) mReactContext.getSystemService(Context.KEYGUARD_SERVICE);
        if (!manager.isHardwareDetected()) {
            return false;
        }
        if (!manager.hasEnrolledFingerprints()) {
            // 没有录入指纹
            Log.e("isSupport", "没有录入指纹");
            return false;
        }
        return true;
    }

    @ReactMethod
    @TargetApi(23)
    public void evaluatePolicy(String title) {
        mCancellationSignal = new CancellationSignal();
        mFingerprintManager.authenticate(null, mCancellationSignal, 0, new FingerprintManager.AuthenticationCallback() {
            @Override
            public void onAuthenticationError(int errorCode, CharSequence errString) {
                super.onAuthenticationError(errorCode, errString);
                touchCallback("" + errString, false);
            }

            @Override
            public void onAuthenticationHelp(int helpCode, CharSequence helpString) {
                super.onAuthenticationHelp(helpCode, helpString);
                touchCallback("" + helpString, false);
            }

            @Override
            public void onAuthenticationSucceeded(FingerprintManager.AuthenticationResult result) {
                super.onAuthenticationSucceeded(result);
                touchCallback("", true);
            }

            @Override
            public void onAuthenticationFailed() {
                super.onAuthenticationFailed();
                touchCallback("指纹识别失败", false);
            }
        }, null);
    }


    @TargetApi(Build.VERSION_CODES.M)
    private void initObject() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            return;
        }
        mFingerprintManager = mReactContext.getSystemService(FingerprintManager.class);
    }

    /**
     * 发送监听
     */
    private void sendEvent(@Nullable WritableMap params) {
        mReactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("EVENT_WITH_TOUCHID", params);
    }

    /**
     * 停止监听
     */
    @ReactMethod
    public void stopListening() {
        if (mCancellationSignal != null) {
            mCancellationSignal.cancel();
            mCancellationSignal = null;
        }
    }

    /**
     * 指纹识别监听回调
     */
    private void touchCallback(String msg, boolean result) {
        WritableMap map = Arguments.createMap();
        map.putBoolean("value", result);
        map.putString("msg", msg);
        sendEvent(map);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    @ReactMethod
    public void isNetworkAvailable(Callback successCallback) {
        ConnectivityManager cm = (ConnectivityManager) mReactContext.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo mNetworkInfo = cm.getActiveNetworkInfo();
        if (null == mNetworkInfo || !mNetworkInfo.isAvailable()) {
            successCallback.invoke(false);
        } else {
            successCallback.invoke(true);
        }
    }

    @ReactMethod
    public void isShiftTSL(Callback successCallback) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN && Build.VERSION.SDK_INT <= Build.VERSION_CODES.KITKAT) {
            successCallback.invoke(true);
        } else {
            successCallback.invoke(false);
        }
    }

    // android版本在5.0以下，调用这里的okhttp
    @ReactMethod
    public void RNPost(String url, String jsonParam, final Callback callback) {
        Params params = new Params(Params.DEFAULT_JSON_KEY, jsonParam);
        JsonCall<String> jsonCallReq = new JsonCall<>(new OkClient(), url, params, "jsonCallReq", false);
        jsonCallReq.enqueue(new com.gaiaworks.gaiaonehandle.HttpGlin.Callback<String>() {
            @Override
            public void onResponse(Result<String> result) {
                if (result.isOK()) {
                    callback.invoke(result.getObj());
                } else {
                    callback.invoke("{result:false,errCode:'404',errorMsg:'网络连接失败，请检查网络链接'}");
                }
            }
        });
    }

    @ReactMethod
    public void RNGet(String url, final Callback callback) {
        GetCall<String> httpGet = new GetCall<>(new OkClient(), url, new Params(), "getCall", false);
        httpGet.enqueue(new com.gaiaworks.gaiaonehandle.HttpGlin.Callback() {
            @Override
            public void onResponse(Result result) {
                if (result.isOK()) {
                    callback.invoke(result.getObj());
                } else {
                    callback.invoke("{result:false,errCode:'404',errorMsg:'网络连接失败，请检查网络链接'}");
                }
            }
        });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////

    @Override
    public void onHostResume() {
        myLocationClient.stopLocation();
    }

    @Override
    public void onHostPause() {
        myLocationClient.stopLocation();
    }

    @Override
    public void onHostDestroy() {
        if (myLocationClient != null) {
            myLocationClient.stopLocation();
            myLocationClient = null;
        }
        if (hud != null) {
            hud.dismiss();
            hud = null;
        }
        // 停止监听指纹服务
        stopListening();
    }
}


