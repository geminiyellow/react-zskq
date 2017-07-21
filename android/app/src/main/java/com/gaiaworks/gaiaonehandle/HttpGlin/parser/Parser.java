package com.gaiaworks.gaiaonehandle.HttpGlin.parser;

import com.gaiaworks.gaiaonehandle.HttpGlin.RawResult;
import com.gaiaworks.gaiaonehandle.HttpGlin.Result;

/**
 * Created by AresPan on 2016/7/13.
 */

public abstract class Parser {
    public String mKey;

    public Parser() {

    }

    public Parser(String key) {
        mKey = key;
    }

    /**
     *
     * @param klass the class of data struct
     * @param netResult
     * @param <T>
     * @return
     */
    public abstract <T> Result<T> parse(Class<T> klass, RawResult netResult);
}
