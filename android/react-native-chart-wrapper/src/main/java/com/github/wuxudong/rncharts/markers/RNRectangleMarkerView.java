package com.github.wuxudong.rncharts.markers;

import android.content.Context;
import android.content.res.ColorStateList;
import android.graphics.drawable.Drawable;
import android.support.v7.widget.AppCompatButton;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.github.mikephil.charting.charts.Chart;
import com.github.mikephil.charting.components.MarkerView;
import com.github.mikephil.charting.data.CandleEntry;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.highlight.Highlight;
import com.github.mikephil.charting.utils.MPPointF;
import com.github.mikephil.charting.utils.Utils;
import com.github.wuxudong.rncharts.R;
import com.github.wuxudong.rncharts.utils.ChartDataSetsHelper;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class RNRectangleMarkerView extends MarkerView {

    private AppCompatButton tvContent;

    private Drawable backgroundLeft = getResources().getDrawable(R.drawable.rectangle_marker_left);
    private Drawable background = getResources().getDrawable(R.drawable.rectangle_marker);
    private Drawable backgroundRight = getResources().getDrawable(R.drawable.rectangle_marker_right);

    private Drawable backgroundTopLeft = getResources().getDrawable(R.drawable.rectangle_marker_top_left);
    private Drawable backgroundTop = getResources().getDrawable(R.drawable.rectangle_marker_top);
    private Drawable backgroundTopRight = getResources().getDrawable(R.drawable.rectangle_marker_top_right);


    public RNRectangleMarkerView(Context context) {
        super(context, R.layout.rectangle_marker);

        tvContent = (AppCompatButton) findViewById(R.id.rectangle_tvContent);
    }

    @Override
    public void refreshContent(Entry e, Highlight highlight) {
        String text = "";
        ReadableArray arr = ChartDataSetsHelper.getHelper().getDataSetByIndex(highlight.getDataSetIndex());
        ReadableMap map = null;
        double result = 0;
        if (ReadableType.Map.equals(arr.getType((int)e.getX()))) {
            map = arr.getMap((int)e.getX());
            result = map.getDouble("y");
        } else if (ReadableType.Number.equals(arr.getType((int)e.getX()))){
            result = arr.getDouble((int)e.getX());
        }


        if (e instanceof CandleEntry) {
            CandleEntry ce = (CandleEntry) e;
            text = Utils.formatNumber(ce.getClose(), 2, true);
        } else {
            text = Utils.formatNumber(result, 0, true);
        }

        if (e.getData() instanceof Map) {
            if (((Map) e.getData()).containsKey("marker")) {

                Object marker = ((Map) e.getData()).get("marker");
                text = marker.toString();

                if (highlight.getStackIndex() != -1 && marker instanceof List) {
                    text = ((List) marker).get(highlight.getStackIndex()).toString();
                }
            }
        }
        tvContent.setText(text);

        super.refreshContent(e, highlight);
    }

    @Override
    public void setMarkerBackgroundColor(int color) {
        super.setMarkerBackgroundColor(color);
        tvContent.setSupportBackgroundTintList(ColorStateList.valueOf(color));
    }

    @Override
    public MPPointF getOffset() {
        return new MPPointF(-(getWidth() / 2), -getHeight());
    }

    @Override
    public MPPointF getOffsetForDrawingAtPoint(float posX, float posY) {

        MPPointF offset = getOffset();

        MPPointF offset2 = new MPPointF();

        offset2.x = offset.x;
        offset2.y = offset.y;

        Chart chart = getChartView();

        float width = getWidth();
        float height = getHeight();

        if (posX + offset2.x < 0) {
            offset2.x = 0;

            if (posY + offset2.y < 0) {
                offset2.y = 0;
                tvContent.setBackground(backgroundTopLeft);
            } else {
                tvContent.setBackground(backgroundLeft);
            }

        } else if (chart != null && posX + width + offset2.x > chart.getWidth()) {
            offset2.x = -width;

            if (posY + offset2.y < 0) {
                offset2.y = 0;
                tvContent.setBackground(backgroundTopRight);
            } else {
                tvContent.setBackground(backgroundRight);
            }
        } else {
            if (posY + offset2.y < 0) {
                offset2.y = 0;
                tvContent.setBackground(backgroundTop);
            } else {
                tvContent.setBackground(background);
            }
        }

        return offset2;
    }

    public AppCompatButton getTvContent() {
        return tvContent;
    }

}

