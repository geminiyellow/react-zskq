package com.github.mikephil.charting.utils;

import com.github.mikephil.charting.charts.Chart;

/**
 * Created by dalancon on 2017/6/16.
 */

public class HighlightedHelper {

    public static boolean rotateScreen = false;

    private static HighlightedHelper mhelp = null;

    private Chart mChart = null;

    private HighlightedHelper() {
        mhelp = this;
    }

    public static HighlightedHelper getHelper() {
        synchronized (HighlightedHelper.class) {
            if (mhelp == null)
                mhelp = new HighlightedHelper();
        }
        return mhelp;
    }

    public Chart getChart() {
        return mChart;
    }

    public void setChart(Chart chart) {
        this.mChart = chart;
    }
}
