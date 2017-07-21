package com.gaiaworks.gaiaonehandle.HttpGlin.parser;

import android.util.Log;

import com.gaiaworks.gaiaonehandle.HttpGlin.RawResult;
import com.gaiaworks.gaiaonehandle.HttpGlin.Result;
import com.gaiaworks.gaiaonehandle.HttpGlin.factory.ParserFactory;

/**
 * Created by AresPan on 2017/7/13.
 */

public class Parsers implements ParserFactory {

    @Override
    public Parser getParser() {
        return new Parser() {
            @Override
            public <T> Result<T> parse(Class<T> klass, RawResult netResult) {
                Result<T> result = new Result<>();
                try {
                    result.ok(true);
                    result.setObj(netResult.getResponse());
                } catch (Exception e) {
                    e.printStackTrace();
                    result.ok(false);
                }
                return result;
            }
        };
    }

    @Override
    public Parser getListParser() {
        // empty
        return null;
    }

    public <T> Result<T> parseResult(RawResult netResult) {
        Result<T> result = new Result<>();
        try {
            result.ok(true);
            result.setObj(netResult.getResponse());
        } catch (Exception e) {
            e.printStackTrace();
            result.ok(false);
        }
        return result;
    }
}

