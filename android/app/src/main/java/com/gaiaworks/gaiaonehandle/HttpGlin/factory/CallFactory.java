package com.gaiaworks.gaiaonehandle.HttpGlin.factory;

import com.gaiaworks.gaiaonehandle.HttpGlin.annotation.DEL;
import com.gaiaworks.gaiaonehandle.HttpGlin.annotation.GET;
import com.gaiaworks.gaiaonehandle.HttpGlin.annotation.JSON;
import com.gaiaworks.gaiaonehandle.HttpGlin.annotation.POST;
import com.gaiaworks.gaiaonehandle.HttpGlin.annotation.PUT;
import com.gaiaworks.gaiaonehandle.HttpGlin.call.Call;
import com.gaiaworks.gaiaonehandle.HttpGlin.call.DelCall;
import com.gaiaworks.gaiaonehandle.HttpGlin.call.GetCall;
import com.gaiaworks.gaiaonehandle.HttpGlin.call.JsonCall;
import com.gaiaworks.gaiaonehandle.HttpGlin.call.PostCall;
import com.gaiaworks.gaiaonehandle.HttpGlin.call.PutCall;

import java.lang.annotation.Annotation;
import java.util.HashMap;

/**
 * Created by AresPan on 2016/7/13.
 */

public class CallFactory {

    private HashMap<Class<? extends Annotation>, Class<? extends Call>> mMapping = new HashMap<>();

    public CallFactory() {
        autoRegist();
    }

    private void autoRegist() {
        register(JSON.class, JsonCall.class);
        register(GET.class, GetCall.class);
        register(POST.class, PostCall.class);
        register(PUT.class, PutCall.class);
        register(DEL.class, DelCall.class);
    }

    public void register(Class<? extends Annotation> key, Class<? extends Call> value) {
        mMapping.put(key, value);
    }

    public Class<? extends Call> get(Class<? extends Annotation> key) {
        return mMapping.get(key);
    }

    public HashMap<Class<? extends Annotation>, Class<? extends Call>> get() {
        return mMapping;
    }
}
