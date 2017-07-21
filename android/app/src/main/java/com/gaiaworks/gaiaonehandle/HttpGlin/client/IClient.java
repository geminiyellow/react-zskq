package com.gaiaworks.gaiaonehandle.HttpGlin.client;

import com.gaiaworks.gaiaonehandle.HttpGlin.cache.ICacheProvider;
import com.gaiaworks.gaiaonehandle.HttpGlin.factory.ParserFactory;
import com.gaiaworks.gaiaonehandle.HttpGlin.interceptor.IResultInterceptor;

import java.util.LinkedHashMap;

/**
 * Created by AresPan on 2016/7/13.
 */

public interface IClient extends IRequest {
    void cancel(final Object tag);
    void parserFactory(ParserFactory factory);
    LinkedHashMap<String, String> headers();
    void resultInterceptor(IResultInterceptor interceptor);
    void cacheProvider(ICacheProvider provider);
    void timeout(long ms);
}
