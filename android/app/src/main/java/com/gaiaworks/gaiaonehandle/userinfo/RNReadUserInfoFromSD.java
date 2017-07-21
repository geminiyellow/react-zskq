package com.gaiaworks.gaiaonehandle.userinfo;

import android.os.Environment;

import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.lang.reflect.Array;
import java.lang.reflect.Method;
import java.util.Iterator;
import java.util.regex.Pattern;

/**
 * Created by pan_g on 2016/9/7.
 */

public class RNReadUserInfoFromSD {

    private static String SDPATH = Environment.getExternalStorageDirectory().getPath();

    public UserInfo transUserInfoByStr(String jsonStr) {
        UserInfo userInfo = null;
        try {
            JSONObject obj = new JSONObject(jsonStr);

            userInfo = new UserInfo();
            userInfo.setCompanyCode(obj.optString("companyCode"));
            userInfo.setUserName(obj.optString("userName"));
            userInfo.setPassword(obj.optString("password"));

            return userInfo;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
    /**
     * 读取SD卡中文本文件
     */
    public String readSDFile() {
        String pathDir = SDPATH + "//userInfo.txt";
        StringBuffer sb = new StringBuffer();
        File file = new File(pathDir);
        try {
            FileInputStream fis = new FileInputStream(file);
            int c;
            while ((c = fis.read()) != -1) {
                sb.append((char) c);
            }
            fis.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return sb.toString();
    }

    public static boolean isNull(Object pInput) {

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

}
