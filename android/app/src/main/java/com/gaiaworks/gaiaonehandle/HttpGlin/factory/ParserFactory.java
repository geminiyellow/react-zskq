package com.gaiaworks.gaiaonehandle.HttpGlin.factory;

import com.gaiaworks.gaiaonehandle.HttpGlin.parser.Parser;

/**
 * Created by AresPan on 2016/7/13.
 */

public interface ParserFactory {
    Parser getParser();
    Parser getListParser();
}
