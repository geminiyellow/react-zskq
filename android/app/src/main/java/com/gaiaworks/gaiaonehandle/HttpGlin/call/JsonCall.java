package com.gaiaworks.gaiaonehandle.HttpGlin.call;

import com.gaiaworks.gaiaonehandle.HttpGlin.Callback;
import com.gaiaworks.gaiaonehandle.HttpGlin.Params;
import com.gaiaworks.gaiaonehandle.HttpGlin.client.IClient;

/**
 * Created by AresPan on 2017/7/12.
 */

public class JsonCall<T> extends Call<T> {

    public JsonCall(IClient client, String url,
                    Params params, Object tag,
                    boolean cache) {
        super(client, url, params, tag, cache);
    }

    @Override
    public void exec(final Callback<T> callback) {
        String json = mParams.getParams(Params.DEFAULT_JSON_KEY);
        if (json == null) {
            throw new UnsupportedOperationException("cannot find json");
        }
        mClient.post(mUrl, mHeaders, mParams.getParams(Params.DEFAULT_JSON_KEY), mTag, shouldCache, callback);
    }
}
