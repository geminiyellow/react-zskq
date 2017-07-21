package com.github.wuxudong.rncharts.utils;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.github.mikephil.charting.charts.Chart;
import com.github.mikephil.charting.utils.HighlightedHelper;

/**
 * Created by dalancon on 2017/6/19.
 */

public class ChartDataSetsHelper {

    private ReadableArray dataSets = null;

    private static ChartDataSetsHelper mhelp = null;

    private ChartDataSetsHelper() {
        mhelp = this;
    }

    public static ChartDataSetsHelper getHelper() {
        synchronized (ChartDataSetsHelper.class) {
            if (mhelp == null)
                mhelp = new ChartDataSetsHelper();
        }
        return mhelp;
    }

    public void setDataSets(ReadableArray dataSets) {
        this.dataSets = dataSets;
    }

    public ReadableArray getDataSetByIndex(int index) {
        ReadableMap map = this.dataSets.getMap(index);
        ReadableArray values = map.getArray("values");
        return values;
    }
}
