package com.gaiaworks.gaiaonehandle.okhttp;

import android.support.annotation.Nullable;

import com.facebook.react.modules.network.ReactCookieJarContainer;

import java.security.NoSuchAlgorithmException;
import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;

/**
 * Created by AresPan on 2017/5/16.
 */

public class OkHttpClientProvider {
    private static @Nullable
    OkHttpClient sClient;

    public static OkHttpClient getOkHttpClient() throws NoSuchAlgorithmException {
        if (sClient == null) {
            sClient = createClient();
        }
        return sClient;
    }

    public static void replaceOkHttpClient(OkHttpClient client) {
        sClient = client;
    }

    public static OkHttpClient createClient() throws NoSuchAlgorithmException {
        // No timeouts by default
        return new OkHttpClient.Builder()
                .connectTimeout(0, TimeUnit.MILLISECONDS)
                .readTimeout(0, TimeUnit.MILLISECONDS)
                .writeTimeout(0, TimeUnit.MILLISECONDS)
                .cookieJar(new ReactCookieJarContainer())
                .build();
    }
}
