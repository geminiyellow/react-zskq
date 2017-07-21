package com.gaiaworks.gaiaonehandle.picker;

import android.util.Log;

import com.andylidong.pickerview.TimePickerView;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.Map;

/**
 * Created by Andy on 2017/2/6.
 */

public class RNPickerModule extends SimpleViewManager<RNPickerType> {

    private static final String REACT_CLASS = "RNPickerView";

    private ReactContext reactContext = null;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected RNPickerType createViewInstance(ThemedReactContext context) {
        reactContext = context;
        return new RNPickerType(context);
    }

    @Override
    public Map getExportedCustomDirectEventTypeConstants() {

        return MapBuilder.<String, Object>builder()
                .put(ItemSelectedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onPickerConfirm"))
                .put(ItemCancelEvent.EVENT_NAME, MapBuilder.of("registrationName", "onPickerCancel"))
                .build();
    }


    /**
     * 暴露给js层调用的属性，显示picker的时间类型
     */
    @ReactProp(name = "config")
    public void setConfig(final RNPickerType wtPicker, final ReadableMap config) {
        Log.d(REACT_CLASS, "config ============" + config);
        if (reactContext.getCurrentActivity() == null) return;
        reactContext.getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                // 判断picker的类型
                if (wtPicker != null) {
                    // 处理picker的类型
                    int typeTemp = config.hasKey("datePickerMode") ? config.getInt("datePickerMode") : 1;
                    // 获取日期的类型
                    TimePickerView.Type type = getDateType(typeTemp);
                    // 获取日期的格式
                    String timeFormatter = getDateFormatter(typeTemp);
                    // 设置日期的初始化
                    wtPicker.setTimeInit(reactContext, type);

                    // 设置时间的开始年份和结束年份
                    int minYear = config.hasKey("minYear") ? config.getInt("minYear") : new Date().getYear() - 1;
                    int maxYear = config.hasKey("maxYear") ? config.getInt("maxYear") : new Date().getYear() + 1;
                    wtPicker.setTimeData(minYear, maxYear);

                    // 设置picker弹出之后选中的时间
                    String time = config.hasKey("defaultTime") ? config.getString("defaultTime") : "";
                    wtPicker.setTimeFormatter(timeFormatter);
                    wtPicker.setTime(time);

                    // 设置头部信息
                    ReadableArray title = config.hasKey("title") ? config.getArray("title") : null;
                    if (title != null) {
                        wtPicker.setTimeCancel(title.getString(0));
                        wtPicker.setTimeTitle(title.getString(1));
                        wtPicker.setTimeSubmit(title.getString(2));
                    }

                    // 设置单位信息
                    ReadableArray unit = config.hasKey("unit") ? config.getArray("unit") : null;
                    if (unit != null) {
                        wtPicker.setYearText(unit.getString(0));
                        wtPicker.setMonthText(unit.getString(1));
                        wtPicker.setDayText(unit.getString(2));
                        wtPicker.setHourText(unit.getString(3));
                        wtPicker.setMinuteText(unit.getString(4));
                    }

                    // 设置星期信息
                    ReadableArray weeks = config.hasKey("weeks") ? config.getArray("weeks") : null;
                    if (weeks != null) {
                        String week[] = new String[7];
                        for (int i = 0; i < weeks.size(); i++) {
                            week[i] = weeks.getString(i);
                        }
                        wtPicker.setWeeksData(week);
                    }


                    // 设置数据是否循环
                    wtPicker.setTimeCyclic(true);

                    // 设置点击色区域是否显示
                    wtPicker.setTimeCancelable(true);

                    // 设置picker是否显示
                    boolean showPicker = config.hasKey("showPicker") ? config.getBoolean("showPicker") : false;
                    if (!showPicker) return;

                    // 判断是否打开了选择器
                    if (wtPicker.isTimeShowing()) {
                        wtPicker.dismissTime();
                    } else {
                        wtPicker.showTime();
                    }

                }
            }
        });
    }


    /**
     * 获取时间的格式信息
     *
     * @param typeTemp
     * @return
     */
    private String getDateFormatter(int typeTemp) {
        String timeFormatter = "";
        switch (typeTemp) {
            case RNDateTypeUtil.ALL:
                timeFormatter = RNDateTypeUtil.ALL_S;
                break;
            case RNDateTypeUtil.YEAR_MONTH_DAY:
                timeFormatter = RNDateTypeUtil.YEAR_MONTH_DAY_S;
                break;
            case RNDateTypeUtil.YEAR_MONTH:
                timeFormatter = RNDateTypeUtil.YEAR_MONTH_S;
                break;
            case RNDateTypeUtil.MONTH_DAY_HOURS_MINUTES:
                timeFormatter = RNDateTypeUtil.MONTH_DAY_HOURS_MINUTES_S;
                break;
            case RNDateTypeUtil.MONTH_DAY:
                timeFormatter = RNDateTypeUtil.MONTH_DAY_S;
                break;
            case RNDateTypeUtil.MONTH:
                timeFormatter = RNDateTypeUtil.MONTH_S;
                break;
            case RNDateTypeUtil.DAY:
                timeFormatter = RNDateTypeUtil.DAY_S;
                break;
            case RNDateTypeUtil.HOUR_MINUTE:
                timeFormatter = RNDateTypeUtil.HOUR_MINUTE_S;
                break;
            case RNDateTypeUtil.HOUR:
                timeFormatter = RNDateTypeUtil.HOUR_S;
                break;
            case RNDateTypeUtil.MINUTE:
                timeFormatter = RNDateTypeUtil.MINUTE_S;
                break;
        }
        return timeFormatter;
    }

    /**
     * 获取日期的类型
     *
     * @param typeTemp
     * @return
     */
    private TimePickerView.Type getDateType(int typeTemp) {
        TimePickerView.Type type = TimePickerView.Type.ALL;
        switch (typeTemp) {
            case RNDateTypeUtil.ALL:
                type = TimePickerView.Type.ALL;
                break;
            case RNDateTypeUtil.YEAR_MONTH_DAY:
                type = TimePickerView.Type.YEAR_MONTH_DAY;
                break;
            case RNDateTypeUtil.YEAR_MONTH:
                type = TimePickerView.Type.YEAR_MONTH;
                break;
            case RNDateTypeUtil.MONTH_DAY_HOURS_MINUTES:
                type = TimePickerView.Type.MONTH_DAY_HOUR_MINUTE;
                break;
            case RNDateTypeUtil.MONTH_DAY:
                type = TimePickerView.Type.MONTH_DAY;
                break;
            case RNDateTypeUtil.MONTH:
                type = TimePickerView.Type.MONTH;
                break;
            case RNDateTypeUtil.DAY:
                type = TimePickerView.Type.DAY;
                break;
            case RNDateTypeUtil.HOUR_MINUTE:
                type = TimePickerView.Type.HOUR_MINUTE;
                break;
            case RNDateTypeUtil.HOUR:
                type = TimePickerView.Type.HOUR;
                break;
            case RNDateTypeUtil.MINUTE:
                type = TimePickerView.Type.MINUTE;
                break;
        }
        return type;
    }


    /***********************************选项选择器***********************************************/

    /**
     * 暴露给js层调用的属性，显示picker的选项类型
     */
    @ReactProp(name = "option")
    public void setOption(final RNPickerType wtPicker, final ReadableMap option) {
        Log.i(REACT_CLASS, "initOption ============" + option);
        if (reactContext.getCurrentActivity() == null) return;
        reactContext.getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (wtPicker != null) {
                    initData(wtPicker, option);
                    // 设置数据是否循环
                    wtPicker.setOptionCyclic(false);
                    // 设置点击色区域是否显示
                    wtPicker.setOptionCancelable(true);
                    // 设置picker是否显示
                    boolean showPicker = option.hasKey("showPicker") ? option.getBoolean("showPicker") : false;
                    if (!showPicker) return;
                    // 判断是否打开了选择器
                    if (wtPicker.isOptionShowing()) {
                        wtPicker.dismissOption();
                    } else {
                        wtPicker.showOption();
                    }
                }
            }
        });
    }

    /**
     * @param option
     */
    private void initData(final RNPickerType wtPicker, final ReadableMap option) {
        // 设置信息的类型 1: 表示单行  2：表示多行
        int dataType = option.hasKey("type") ? option.getInt("type") : 1;
        // 设置初始化信息
        if (dataType == 1) {
            ReadableArray optionsItem = option.hasKey("data") ? option.getArray("data") : null;
            // 没有数据则不显示
            if (optionsItem == null) {
                return;
            }
            ArrayList<String> options = new ArrayList<String>();
            for (int i = 0; i < optionsItem.size(); i++) {
                options.add(optionsItem.getString(i));
            }
            wtPicker.setOptionInit(reactContext, options, null);
            // 设置picker的数据
            wtPicker.setPicker(options, null);

            // 设置picker的选中值
            ReadableArray optionsSelected = option.hasKey("options") ? option.getArray("options") : null;
            wtPicker.setOptions(options, null, optionsSelected.getString(0), 0);
        } else {
            ReadableMap optionsItem = option.hasKey("data") ? option.getMap("data") : null;
            ReadableArray optionsSelected = option.hasKey("options") ? option.getArray("options") : null;
            // 没有数据则不显示
            if (optionsItem == null) {
                return;
            }
            // 第一栏数据
            ArrayList<String> optionsF = new ArrayList<String>();
            // 第二栏数据
            ArrayList<ArrayList<String>> optionsS = new ArrayList<ArrayList<String>>();
            // 选中值的位置
            int index = 0;
            try {
                ReadableMapKeySetIterator firstData = optionsItem.keySetIterator();
                while (firstData.hasNextKey()) {
                    optionsF.add(firstData.nextKey());
                }
                // 不指定排序规则时，也是按照字母的来排序的
                Collections.reverse(optionsF);
                for (int i = 0; i < optionsF.size(); i++) {
                    ReadableArray secondData = optionsItem.getArray(optionsF.get(i));
                    ArrayList<String> optionsSTemp = new ArrayList<String>();
                    for (int j = 0; j < secondData.size(); j++) {
                        if (optionsSelected.getString(0).equals(optionsF.get(i)) && optionsSelected.getString(1).equals(secondData.getString(j))) {
                            index = j;
                        }
                        optionsSTemp.add(secondData.getString(j));
                    }
                    optionsS.add(optionsSTemp);
                }
            } catch (Exception e) {
                return;
            }
            // 初始化数据
            wtPicker.setOptionInit(reactContext, optionsF, optionsItem);
            // 设置picker的数据
            wtPicker.setPicker(optionsF, optionsS);
            // 设置picker的选中值
            wtPicker.setOptions(optionsF, optionsS, optionsSelected.getString(0), index);
        }

        // 设置头部信息
        ReadableArray title = option.hasKey("title") ? option.getArray("title") : null;
        if (title != null) {
            wtPicker.setOptionCancel(title.getString(0));
            wtPicker.setOptionTitle(title.getString(1));
            wtPicker.setOptionSubmit(title.getString(2));
        }
    }
}
