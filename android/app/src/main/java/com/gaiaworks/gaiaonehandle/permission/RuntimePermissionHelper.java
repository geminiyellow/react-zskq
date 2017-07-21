package com.gaiaworks.gaiaonehandle.permission;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;

/**
 * 动态运行时权限帮助类
 * Created by dalancon on 2017/3/13.
 */

public class RuntimePermissionHelper {

    private static RuntimePermissionHelper mHelper = null;

    public static final int PERMISSION_REQUEST_CODE_CAMERA = 0X00;

    public static final int PERMISSION_REQUEST_CODE_Location = 0X01;

    private RuntimePermissionHelper() {
    }

    private Activity mContext;

    public static RuntimePermissionHelper getHelper() {
        synchronized (RuntimePermissionHelper.class) {
            if (mHelper == null) {
                mHelper = new RuntimePermissionHelper();
            }
        }
        return mHelper;
    }

    /**
     * 检测相机权限
     */
    public boolean checkSelfCameraPermission() {
        if (mContext != null && ContextCompat.checkSelfPermission(mContext,
                android.Manifest.permission.CAMERA)
                != PackageManager.PERMISSION_GRANTED) {
            return false;
        }
        return true;
    }

    /**
     * 检测定位权限
     */
    public boolean checkSelfLocationPermission() {
        if (mContext != null && ContextCompat.checkSelfPermission(mContext,
                Manifest.permission.ACCESS_COARSE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {
//            ActivityCompat.requestPermissions(mContext,
//                    new String[]{Manifest.permission.CAMERA},
//                    PERMISSION_REQUEST_CODE_CAMERA);
            return false;
        }
        return true;
    }

    /**
     * 申请相机权限
     */
    public void requestPermissionsForCamera() {
        if (mContext != null)
            ActivityCompat.requestPermissions(mContext,
                    new String[]{Manifest.permission.CAMERA},
                    PERMISSION_REQUEST_CODE_CAMERA);
    }

    /**
     * 申请定位权限
     */
    public void requestPermissionsForLocation() {
        if (mContext != null)
            ActivityCompat.requestPermissions(mContext,
                    new String[]{Manifest.permission.READ_PHONE_STATE, Manifest.permission.ACCESS_COARSE_LOCATION, Manifest.permission.ACCESS_FINE_LOCATION},
                    PERMISSION_REQUEST_CODE_Location);
    }

    /**
     * 设置上下文
     *
     * @param context
     */
    public void setContext(Activity context) {
        mContext = context;
    }

}
