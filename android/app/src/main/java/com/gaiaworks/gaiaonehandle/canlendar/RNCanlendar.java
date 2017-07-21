package com.gaiaworks.gaiaonehandle.canlendar;

import android.support.v4.view.ViewPager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.necer.ncalendar.calendar.MonthCalendar;
import com.necer.ncalendar.listener.OnClickMonthCalendarListener;
import com.necer.ncalendar.utils.CalendarHelper;

import org.joda.time.DateTime;

/**
 * Created by Andy on 2017/6/27.
 */

public class RNCanlendar extends SimpleViewManager<MonthCalendar> {

    private final String REACT_CLASS = "ScheduleCalendarView";

    private ReactContext reactContext = null;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    private MonthCalendar mc;

    @Override
    protected MonthCalendar createViewInstance(ThemedReactContext context) {
        reactContext = context;
        mc = new MonthCalendar(context);
        mc.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {
                mc.setToday();
            }

            @Override
            public void onPageSelected(int position) {

            }

            @Override
            public void onPageScrollStateChanged(int state) {

            }
        });
        mc.setOnClickMonthCalendarListener(new OnClickMonthCalendarListener() {
            @Override
            public void onClickMonthCalendar(DateTime dateTime) {
                WritableMap params = Arguments.createMap();
                params.putString("date", Utils.getTime(dateTime.toDate()));
                Utils.sendEvent(reactContext, "did_select_date", params);
            }
        });
        return mc;
    }

    /**
     * 排班的文字颜色 hours > 0
     */
    @ReactProp(name = "scheduledTextColor")
    public void scheduledTextColor(MonthCalendar calendar, Integer color) {
        CalendarHelper.getHelper().setScheduledTextColor(color);
    }

    /**
     * 排班的文字大小
     */
    @ReactProp(name = "scheduledTextSize")
    public void scheduledTextSize(MonthCalendar calendar, float textSize) {
        CalendarHelper.getHelper().setScheduledTextSize(textSize);
    }

    /**
     * off班 的文字大小 hours == 0
     */
    @ReactProp(name = "offScheduledTextSize")
    public void offSdcheduledTextSize(MonthCalendar calendar, float textSize) {
        CalendarHelper.getHelper().setOffScheduledTextSize(textSize);
    }

    /**
     * off班 的文字颜色 hours == 0
     */
    @ReactProp(name = "offScheduledTextColor")
    public void offSdcheduledTextColor(MonthCalendar calendar, Integer color) {
        CalendarHelper.getHelper().setOffScheduledTextColor(color);
    }

    /**
     * 未排班 的文字大小
     */
    @ReactProp(name = "noScheduledTextSize")
    public void noSdcheduledTextSize(MonthCalendar calendar, float textSize) {
        CalendarHelper.getHelper().setNoScheduledTextSize(textSize);
    }

    /**
     * 未排班 的文字颜色
     */
    @ReactProp(name = "noScheduledTextColor")
    public void noSdcheduledTextColor(MonthCalendar calendar, Integer color) {
        CalendarHelper.getHelper().setNoScheduledTextColor(color);
    }

    /**
     * 选中的日期背景颜色
     */
    @ReactProp(name = "selectedBackgroundColor")
    public void selectedBackgroundColor(MonthCalendar calendar, Integer color) {
        CalendarHelper.getHelper().setSelectedBackgroundColor(color);
    }

    /**
     * 选中的日期字体颜色
     */
    @ReactProp(name = "selectedTextColor")
    public void selectedTextColor(MonthCalendar calendar, Integer color) {
        CalendarHelper.getHelper().setSelectedTextColor(color);
    }

    /**
     * 今天的边框样式
     */
    @ReactProp(name = "todayBorderColor")
    public void todayBorderColor(MonthCalendar calendar, Integer color) {
        CalendarHelper.getHelper().setTodayBorderColor(color);
    }

    /**
     * 今天的文字颜色
     */
    @ReactProp(name = "todayTextColor")
    public void todayTextColor(MonthCalendar calendar, Integer color) {
        CalendarHelper.getHelper().setTodayTextColor(color);
    }

    /**
     * 今天的文字大小
     */
    @ReactProp(name = "todayTextSize")
    public void todayTextSize(MonthCalendar calendar, float textSize) {
        CalendarHelper.getHelper().setTodayTextSize(textSize);
    }


    /**
     * 设置事件的背景颜色
     */
    @ReactProp(name = "eventBackgroundColor")
    public void eventBackgroundColor(MonthCalendar calendar, Integer color){
        CalendarHelper.getHelper().setEventBackgroundColor(color);
    }

    /**
     * 设置数据源
     */
    @ReactProp(name = "scheduleData")
    public void setScheduleData(MonthCalendar calendar, ReadableMap data) {
        CalendarHelper.getHelper().setMarkData(data);
    }

    @ReactMethod
    public void jump(final ReadableMap data) {
        CalendarHelper.getHelper().setMarkData(data.getMap("scheduleData"));
        final String date = data.getString("selectedMonth");
        if (mc != null) {
            reactContext.getCurrentActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    mc.jumpDate(DateTime.parse(date), true);
                }
            });

        }
    }


}
