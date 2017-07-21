/**
 * Glin, A retrofit like network framework <br />
 *
 * Usage: <br />
 *  1. write your client and parser, config glin
 *      Glin glin = new Glin.Builder()
             .client(new OkClient())
             .baseUrl("http://192.168.201.39")
             .debug(true)
             .parserFactory(new FastJsonParserFactory())
             .timeout(10000)
             .build();
 *
 *  2. create an interface
 *      public interface UserBiz {
            @POST("/users/list")
            Call<User> list(@Arg("name") String userName);
        }
 *
 *  3. request the network and callback
 *      UserBiz biz = glin.create(UserBiz.class, getClass().getName());
 *      Call<User> call = biz.list("qibin");
        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Result<User> result) {
                if (result.isOK()) {
                    Toast.makeText(MainActivity.this, result.getResult().getName(), Toast.LENGTH_SHORT).show();
                }else {
                    Toast.makeText(MainActivity.this, result.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
 */
package com.gaiaworks.gaiaonehandle.HttpGlin;

import com.gaiaworks.gaiaonehandle.HttpGlin.annotation.Arg;
import com.gaiaworks.gaiaonehandle.HttpGlin.annotation.JSON;
import com.gaiaworks.gaiaonehandle.HttpGlin.annotation.Path;
import com.gaiaworks.gaiaonehandle.HttpGlin.annotation.ShouldCache;
import com.gaiaworks.gaiaonehandle.HttpGlin.cache.ICacheProvider;
import com.gaiaworks.gaiaonehandle.HttpGlin.call.Call;
import com.gaiaworks.gaiaonehandle.HttpGlin.chan.LogChanNode;
import com.gaiaworks.gaiaonehandle.HttpGlin.client.IClient;
import com.gaiaworks.gaiaonehandle.HttpGlin.factory.CallFactory;
import com.gaiaworks.gaiaonehandle.HttpGlin.factory.ParserFactory;
import com.gaiaworks.gaiaonehandle.HttpGlin.interceptor.IResultInterceptor;
import com.gaiaworks.gaiaonehandle.HttpGlin.utils.Pair;

import java.lang.annotation.Annotation;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.HashMap;
import java.util.Iterator;

/**
 * Created by AresPan on 2016/7/13.
 */

public class Glin {
    private IClient mClient;
    private String mBaseUrl;
    private CallFactory mCallFactory;
    private LogChanNode mLogChanNode;

    private Glin(Builder builder) {
        mClient = builder.mClient;
        mBaseUrl = builder.mBaseUrl;
        mLogChanNode = builder.mLogChanNode;

        mCallFactory = new CallFactory();
    }

    @SuppressWarnings("unchecked")
    public <T> T create(Class<T> klass, Object tag) {
        return (T) Proxy.newProxyInstance(klass.getClassLoader(),
                new Class<?>[] {klass}, new Handler(tag));
    }

    public void cancel(String tag) {
        mClient.cancel(tag);
    }

    public void register(Class<? extends Annotation> key, Class<? extends Call> value) {
        mCallFactory.register(key, value);
    }

    class Handler implements InvocationHandler {
        private Object mTag;

        public Handler(Object tag) {
            mTag = tag;
        }

        @Override
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            Class<? extends Annotation> key = null;
            String path = null;

            HashMap<Class<? extends Annotation>, Class<? extends Call>> mapping = mCallFactory.get();
            Class<? extends Annotation> item;
            Annotation anno;
            for (Iterator<Class<? extends Annotation>> iterator = mapping.keySet().iterator();
                 iterator.hasNext();) {
                item = iterator.next();
                if (method.isAnnotationPresent(item)) {
                    key = item;
                    anno = method.getAnnotation(item);
                    path = (String) anno.getClass().getDeclaredMethod("value").invoke(anno);
                    break;
                }
            }

            if (key == null) {
                throw new UnsupportedOperationException("cannot find annotations");
            }

            Class<? extends Call> callKlass = mCallFactory.get(key);
            if (callKlass == null) {
                throw new UnsupportedOperationException("cannot find calls");
            }

            boolean shouldCache = method.isAnnotationPresent(ShouldCache.class);

            Pair<String, Params> pair = new Pair<>(justUrl(path), new Params());
            params(pair, method, args);

            Constructor<? extends Call> constructor = callKlass.getConstructor(IClient.class,
                    String.class, Params.class, Object.class, boolean.class);

            Call<?> call = constructor.newInstance(mClient, pair.first, pair.second,
                    mTag, shouldCache);

            if (mLogChanNode != null) { call.setLogChanNode(mLogChanNode);}

            return call;
        }

        private String justUrl(String path) {
            String url = mBaseUrl == null ? "" : mBaseUrl;
            path = path == null ? "" : path;
            if (isFullUrl(path)) { url = path;}
            else { url += path;}
            return url;
        }

        private boolean isFullUrl(String url) {
            if (url == null || url.length() == 0) { return false;}
            if (url.toLowerCase().startsWith("http://")) { return true;}
            if (url.toLowerCase().startsWith("https://")) {return true;}
            return false;
        }

        private void params(Pair<String, Params> pair, Method method, Object[] args) {
            if (args == null || args.length == 0) {
                return;
            }

            Annotation[][] paramsAnno = method.getParameterAnnotations();

            int length = paramsAnno.length;
            for (int i = 0; i < length; i++) {
                if (paramsAnno[i].length == 0) {
                    // there is no annotation on this param,
                    // so, maybe it is a json value when the method is JSON annotation presented
                    if (method.isAnnotationPresent(JSON.class)) {
                        pair.second.add(Params.DEFAULT_JSON_KEY, args[i]);
                    }
                } else {
                    if (paramsAnno[i][0] instanceof Arg) {
                        pair.second.add(((Arg)paramsAnno[i][0]).value(), args[i]);
                    } else if (paramsAnno[i][0] instanceof Path) {
                        pair.first = pair.first.replaceAll("\\{:"+((Path)paramsAnno[i][0]).value()+"\\}",
                                args[i].toString());
                    }
                }
            }
        }
    }

    public static class Builder {
        private IClient mClient;
        private String mBaseUrl;
        private LogChanNode mLogChanNode;

        public Builder() {

        }

        public Builder baseUrl(String baseUrl) {
            mBaseUrl = baseUrl;
            return this;
        }

        public Builder client(IClient client) {
            mClient = client;
            return this;
        }

        public Builder logChanNode(LogChanNode logChanNode) {
            mLogChanNode = logChanNode;
            return this;
        }

        public Builder parserFactory(ParserFactory factory) {
            if (mClient == null) {
                throw new UnsupportedOperationException("invoke client method first");
            }
            mClient.parserFactory(factory);
            return this;
        }

        public Builder cacheProvider(ICacheProvider cacheProvider) {
            if (mClient == null) {
                throw new UnsupportedOperationException("invoke client method first");
            }
            mClient.cacheProvider(cacheProvider);
            return this;
        }

        public Builder timeout(long ms) {
            if (mClient == null) {
                throw new UnsupportedOperationException("invoke client method first");
            }
            mClient.timeout(ms);
            return this;
        }

        public Builder resultInterceptor(IResultInterceptor interceptor) {
            if (mClient == null) {
                throw new UnsupportedOperationException("invoke client method first");
            }
            mClient.resultInterceptor(interceptor);
            return this;
        }

        public Glin build() {
            return new Glin(this);
        }
    }
}
