package com.github.wuxudong.rncharts.charts;

import android.graphics.Color;
import android.graphics.Matrix;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.github.mikephil.charting.charts.BarChart;
import com.github.mikephil.charting.components.Legend;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.data.BarEntry;
import com.github.wuxudong.rncharts.R;
import com.github.wuxudong.rncharts.data.BarDataExtract;
import com.github.wuxudong.rncharts.data.DataExtract;
import com.github.wuxudong.rncharts.listener.RNOnChartValueSelectedListener;
import com.github.wuxudong.rncharts.utils.BridgeUtils;

import org.w3c.dom.Text;

public class BarChartManager extends BarLineChartBaseManager<BarChart, BarEntry> {

    private ReactContext reactContext;

    @Override
    public String getName() {
        return "RNBarChart";
    }

    @Override
    protected View createViewInstance(ThemedReactContext reactContext) {
        this.reactContext = reactContext;
        BarChart barChart = new BarChart(reactContext);
        barChart.setOnChartValueSelectedListener(new RNOnChartValueSelectedListener(barChart));
        return barChart;
    }

    @Override
    DataExtract getDataExtract() {
        return new BarDataExtract();
    }

    @ReactProp(name = "drawValueAboveBar")
    public void setDrawValueAboveBar(BarChart chart, boolean enabled) {
        chart.setDrawValueAboveBar(enabled);
    }

    @ReactProp(name = "drawBarShadow")
    public void setDrawBarShadow(BarChart chart, boolean enabled) {
        chart.setDrawBarShadow(enabled);
    }

    @ReactProp(name = "config")
    public void setConfig(BarChart chart, ReadableMap propMap) {
        setYAxis(chart, propMap.getMap("yAxis"));
        setXAxis(chart, propMap.getMap("xAxis"));
        setAnimation(chart, propMap.getMap("animation"));
        setData(chart, propMap.getMap("data"));
        setLegend(chart, propMap.getMap("legend"));
        setChartDescription(chart, propMap.getMap("chartDescription"));
        setScaleEnabled(chart, false);
        setScaleXEnabled(chart, false);
        setScaleYEnabled(chart, false);
        setDragEnabled(chart, false);
        setPinchZoom(chart, false);
        setChartBackgroundColor(chart, propMap.getInt("chartBackgroundColor"));
        setDoubleTapToZoomEnabled(chart, false);
        setDrawValueAboveBar(chart, false);
        setTouchEnabled(chart, false);
    }

    /**
     * 初始化柱状图的信息
     *
     * @param barChart
     */
    @ReactProp(name = "slide")
    public void setSlide(BarChart barChart, float enable) {
        barChart.initBar();
        // 设置图表的可滑动
        if (enable > 0) {
            Matrix mMatrix = new Matrix();
            mMatrix.postScale(enable, 1f);
            barChart.getViewPortHandler().refresh(mMatrix, barChart, false);
            barChart.animateY(1000);
            barChart.moveViewToX(0);
            barChart.invalidate();
        }
    }
}
