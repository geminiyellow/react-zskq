package com.gaiaworks.gaiaonehandle;

import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.provider.Settings;
import android.telephony.TelephonyManager;
import android.util.Log;

import com.gaiaworks.gaiaonehandle.sysutil.CTelephoneInfo;

import java.lang.reflect.Array;
import java.lang.reflect.Method;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Iterator;
import java.util.regex.Pattern;

/**
 * Created by emily on 6/27/16.
 */
public class DeviceIdManager {
    public Context context = null;

    public DeviceIdManager(Context ctx) {
        context = ctx;
    }

    public String getUniqueDeviceId() {
        //The IMEI: 仅仅只对Android手机有效:
        TelephonyManager TelephonyMgr = (TelephonyManager) context.getSystemService(context.TELEPHONY_SERVICE);
        String m_szImei = "";
        String imeiTemp = "";
        try {
            imeiTemp = TelephonyMgr.getDeviceId();
            CTelephoneInfo ct = CTelephoneInfo.getInstance(context);
            if (!isNull(imeiTemp) && (!isNull(ct.getImeiSIM1()) || !isNull(ct.getImeiSIM2()))) {
                if (imeiTemp.equals(ct.getImeiSIM1()) || imeiTemp.equals(ct.getImeiSIM2())) {
                    m_szImei = ct.getImeiSIM1();
                } else {
                    m_szImei = imeiTemp;
                }
            }
        } catch (Exception e) {

        }

        //Pseudo-Unique ID, 这个在任何Android手机中都有效
        String m_szDevIDShort = "35" +
                Build.BOARD.length() % 10 +
                Build.BRAND.length() % 10 +
                Build.CPU_ABI.length() % 10 +
                Build.DEVICE.length() % 10 +
                Build.DISPLAY.length() % 10 +
                Build.HOST.length() % 10 +
                Build.ID.length() % 10 +
                Build.MANUFACTURER.length() % 10 +
                Build.MODEL.length() % 10 +
                Build.PRODUCT.length() % 10 +
                Build.TAGS.length() % 10 +
                Build.TYPE.length() % 10 +
                Build.USER.length() % 10; //13 digits

        //3. The Android ID
        String m_szAndroidID = Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ANDROID_ID);

        //4. The WLAN MAC Address string
        WifiManager wm = (WifiManager) context.getSystemService(context.WIFI_SERVICE);
        String m_szWLANMAC = wm.getConnectionInfo().getMacAddress();

        //5. The BT MAC Address string
        BluetoothAdapter m_BluetoothAdapter = null; // Local Bluetooth adapter
        m_BluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        String m_szBTMAC = m_BluetoothAdapter.getAddress();

        String m_szLongID = m_szImei + m_szDevIDShort + m_szAndroidID + m_szWLANMAC + m_szBTMAC;

        // Log.i("5 string ----- ",m_szLongID); compute md5
        MessageDigest m = null;
        try {
            m = MessageDigest.getInstance("MD5");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        m.update(m_szLongID.getBytes(), 0, m_szLongID.length());
        // get md5 bytes
        byte p_md5Data[] = m.digest();
        // create a hex string
        String m_szUniqueID = new String();
        for (int i = 0; i < p_md5Data.length; i++) {
            int b = (0xFF & p_md5Data[i]);
            // if it is a single digit, make sure it have 0 in front (proper padding)
            if (b <= 0xF)
                m_szUniqueID += "0";
            // add number to string
            m_szUniqueID += Integer.toHexString(b);
        }
        // hex string to uppercase
        m_szUniqueID = m_szUniqueID.toUpperCase();

        return m_szImei;
    }

    /**
     * modify by AresPan
     * modify date 20160824
     * modify 修改手机唯一信息实现
     * modify 设备唯一号与IMSI组合,md5加密
     */
    public String DeviceInfoByMD5() {
        CTelephoneInfo telephonyInfo = CTelephoneInfo.getInstance(context);
        telephonyInfo.setCTelephoneInfo();
        String IMSI1 = getIMSIArr(context)[0];
        String IMSI2 = getIMSIArr(context)[1];
        String deviceId = getUniqueDeviceId();
        String IMSI = getIMSI();
        String result = "";
        if (!isNull(IMSI) && (!isNull(IMSI1) || !isNull(IMSI2))) {
            if (IMSI.equals(IMSI1) || IMSI.equals(IMSI2)) {
                result = MD5(deviceId + IMSI1);
            } else  {
                result = MD5(deviceId + IMSI);
            }
        } else {
            result = MD5(deviceId);
        }
        return result;
    }

    public String getIMSI() {

        String IMSI = "";
        // 初始化系统服务
        TelephonyManager phoneMgr = (TelephonyManager) context
                .getSystemService(Context.TELEPHONY_SERVICE);
        try {
            if (isNull(phoneMgr.getSubscriberId())) {
                return IMSI;
            }
            IMSI = phoneMgr.getSubscriberId();
        } catch (Exception e) {

        }
        return IMSI;
    }

    private String MD5(String s) {
        char hexDigits[] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};

        try {
            byte[] btInput = s.getBytes();
            // 获得MD5摘要算法的 MessageDigest 对象
            MessageDigest mdInst = MessageDigest.getInstance("MD5");
            // 使用指定的字节更新摘要
            mdInst.update(btInput);
            // 获得密文
            byte[] md = mdInst.digest();
            // 把密文转换成十六进制的字符串形式
            int j = md.length;
            char str[] = new char[j * 2];
            int k = 0;
            for (int i = 0; i < j; i++) {
                byte byte0 = md[i];
                str[k++] = hexDigits[byte0 >>> 4 & 0xf];
                str[k++] = hexDigits[byte0 & 0xf];
            }
            return new String(str);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public boolean isNull(Object pInput) {
        if (pInput == null || "".equals(pInput)) {
            return true;
        } else if ("java.lang.String".equals(pInput.getClass().getName())) {
            String tmpInput = Pattern.compile("\\r|\\n|\\u3000")
                    .matcher((String) pInput).replaceAll("");
            return Pattern.compile("^(\\s)*$").matcher(tmpInput).matches();
        } else {
            Method method = null;
            String newInput = "";
            try {
                method = pInput.getClass().getMethod("size");
                newInput = String.valueOf(method.invoke(pInput));
                if (Integer.parseInt(newInput) == 0) {
                    return true;
                } else {
                    return false;
                }
            } catch (Exception e) {
                try {
                    method = pInput.getClass().getMethod("getItemCount");
                    newInput = String.valueOf(method.invoke(pInput));
                    if (Integer.parseInt(newInput) == 0) {
                        return true;
                    } else {
                        return false;
                    }
                } catch (Exception ex) {
                    try {
                        if (Array.getLength(pInput) == 0) {
                            return true;
                        } else {
                            return false;
                        }
                    } catch (Exception exx) {
                        try {
                            method = Iterator.class.getMethod("hasNext");
                            newInput = String.valueOf(method.invoke(pInput));
                            if (!Boolean.valueOf(newInput)) {
                                return true;
                            } else {
                                return false;
                            }
                        } catch (Exception exxx) {
                            return false;
                        }
                    }
                }
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * 获取双卡手机的两个卡的IMSI 需要 READ_PHONE_STATE 权限
     *
     * @param context
     *            上下文
     * @return 下标0为一卡的IMSI，下标1为二卡的IMSI
     */
    public static String[] getIMSIArr(Context context) {
        // 双卡imsi的数组
        String[] imsis = new String[2];
        try {
            TelephonyManager tm = (TelephonyManager) context
                    .getSystemService(Context.TELEPHONY_SERVICE);
            // 先使用默认的获取方式获取一卡IMSI
            imsis[0] = tm.getSubscriberId();

            // 然后进行二卡IMSI的获取,默认先获取展讯的IMSI
            try {
                Method method = tm.getClass().getDeclaredMethod(
                        "getSubscriberIdGemini", int.class);
                method.setAccessible(true);
                // 0 表示 一卡，1 表示二卡，下方获取相同
                imsis[1] = (String) method.invoke(tm, 1);
            } catch (Exception e) {
                // 异常清空数据，继续获取下一个
                imsis[1] = null;
            }
            if (imsis[1] == null || "".equals(imsis[1])) { // 如果二卡为空就获取mtk
                try {
                    Class<?> c = Class
                            .forName("com.android.internal.telephony.PhoneFactory");
                    Method m = c.getMethod("getServiceName", String.class,
                            int.class);
                    String spreadTmService = (String) m.invoke(c,
                            Context.TELEPHONY_SERVICE, 1);
                    TelephonyManager tm1 = (TelephonyManager) context
                            .getSystemService(spreadTmService);
                    imsis[1] = tm1.getSubscriberId();
                } catch (Exception ex) {
                    imsis[1] = null;
                }
            }
            if (imsis[1] == null || "".equals(imsis[1])) { // 如果二卡为空就获取高通 IMSI获取
                try {
                    Method addMethod2 = tm.getClass().getDeclaredMethod(
                            "getSimSerialNumber", int.class);
                    addMethod2.setAccessible(true);
                    imsis[1] = (String) addMethod2.invoke(tm, 1);
                } catch (Exception ex) {
                    imsis[1] = null;
                }
            }
        } catch (IllegalArgumentException e) {
        }
        return imsis;
    }
}
