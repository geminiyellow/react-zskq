package com.gaiaworks.gaiaonehandle;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.gaiaworks.gaiaonehandle.canlendar.RNCanlendar;
import com.gaiaworks.gaiaonehandle.picker.RNPickerModule;
import com.gaiaworks.gaiaonehandle.umeng.UmengNativeModule;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Created by emily on 5/17/16.
 */
public class RNPackage implements ReactPackage{

    private RNManagerModule mRNModule;

    public RNManagerModule getModule() {
        return mRNModule;
    }

    private RNCanlendar rnCanlendar = new RNCanlendar();

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new RNManagerModule(reactContext));
        modules.add(new RNKeychainManagerModule(reactContext));
        modules.add(new RNSearchCoreManagerModule(reactContext));
        modules.add(new UmengNativeModule(reactContext));
        modules.add(rnCanlendar);
        return modules;
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        List<ViewManager> modules = new ArrayList<>();
        modules.add(new RNPickerModule());
        modules.add(rnCanlendar);
        return modules;

    }
}
