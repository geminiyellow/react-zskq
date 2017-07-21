package com.gaiaworks.gaiaonehandle.picker;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * Created by Andy.Li on 2016/12/21.
 */

public class ItemSelectedEvent extends Event<ItemSelectedEvent> {

    public static final String EVENT_NAME = "RNPickerViewSelected";

    private final String[] mValue;

    private final int mType;

    protected ItemSelectedEvent(int viewTag, String[] value, int type) {
        super(viewTag);
        mValue = value;
        mType = type;
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), serializeEventData());
    }

    private WritableMap serializeEventData() {
        WritableMap eventData = Arguments.createMap();
        if (mType == 2) {
            WritableArray datas = Arguments.createArray();
            datas.pushString(mValue[0]);
            datas.pushString(mValue[1]);
            eventData.putArray("data", datas);
        } else {
            eventData.putString("data", mValue[0]);
        }
        return eventData;
    }
}
