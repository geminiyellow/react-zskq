package com.gaiaworks.gaiaonehandle;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import com.gaiaworks.gaiaonehandle.pinyin.Pinyin4jUtil;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Andy.Li on 2016/12/13.
 */

public class RNSearchCoreManagerModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

    // 录入的数据
    private static List<String> addData = new ArrayList<String>();

    public RNSearchCoreManagerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNSearchCoreManager";
    }


    @ReactMethod
    public void addAllCodes(ReadableArray value){
        // 首先清除数据
        addData.clear();
        // 将信息放到list中
        if (value == null || value.size() == 0) {
            return;
        }
        for (int i = 0; i < value.size(); i++) {
            addData.add(value.getString(i));
        }
    }


    @ReactMethod
    public void searchCode(String searchText, Callback resultArray){
        resultArray.invoke(getData(searchText));
    }

    // 取得数据
    private static WritableArray getData(String str) {
        // 返回的数据
        WritableArray params = new WritableNativeArray();
        // 查询信息转成小写字母
        str = str.toLowerCase();
        // 取得查询信息的匹配结果
        for (int i = 0; i < addData.size(); i++) {
            String tempData = addData.get(i).toString().toLowerCase();
            // 取得数据的全拼字母
            String tempDataAll = Pinyin4jUtil.converterToSpell(tempData);
            // 取得查询信息的全拼字母
            String searchAll = Pinyin4jUtil.converterToSpell(str);
            // 判断输入字符长度与匹配的长度
            if (searchAll.length() > tempDataAll.length()) continue;
            // 记录查询信息的字符数组
            char[] searchAllChar = str.toCharArray();
            // 记录字符的匹配次数
            int count = 0;
            // 记录当前的字符位置
            int location  = 0;
            // 判断输入的字符是否在匹配的字符串中
            for (int j = 0; j < searchAllChar.length; j++) {
                int indexAll = tempDataAll.indexOf(String.valueOf(searchAllChar[j]), location);
                if (indexAll >= 0) {
                    location = ++indexAll;
                    count++;
                } else {
                    break;
                }
            }
            // 判断字符数组在匹配的次数与其本身的长度是否一致
            if (count == searchAllChar.length) {
                params.pushString(addData.get(i).toString());
            }
        }

        return params;
    }


    @Override
    public void onHostResume() {

    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {
        // 清除数据信息
        if(!addData.isEmpty()) {
            addData.clear();
        }
    }




}
