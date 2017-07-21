package com.gaiaworks.gaiaonehandle.HttpGlin.call;

import com.gaiaworks.gaiaonehandle.HttpGlin.Callback;
import com.gaiaworks.gaiaonehandle.HttpGlin.Params;
import com.gaiaworks.gaiaonehandle.HttpGlin.client.IClient;

/**
 * Created by AresPan on 2017/7/12.
 */

public class GetCall<T> extends Call<T> {

    public GetCall(IClient client, String url,
                   Params params, Object tag,
                   boolean cache) {
        super(client, url, params, tag, cache);
    }

    @Override
    public void exec(final Callback<T> callback) {
        String url = mUrl;
        if (null != mParams) {
            String query = mParams.encode();
            if (query != null) {
                if (url.contains("?")) { url = url + "&" + query;}
                else { url = url + "?" + query;}
            }
        }
        mClient.get(url, mHeaders, mTag, shouldCache, callback);
    }
}
