package com.gaiaworks.gaiaonehandle.HttpGlin.call;

import com.gaiaworks.gaiaonehandle.HttpGlin.Callback;
import com.gaiaworks.gaiaonehandle.HttpGlin.Params;
import com.gaiaworks.gaiaonehandle.HttpGlin.client.IClient;

/**
 * Created by AresPan on 2017/7/12.
 */

public class DelCall<T> extends Call<T> {

    public DelCall(IClient client, String url,
                   Params params, Object tag,
                   boolean cache) {
        super(client, url, params, tag, cache);
    }

    @Override
    public void exec(Callback<T> callback) {
        mClient.delete(mUrl, mHeaders, mTag, shouldCache, callback);
    }
}
